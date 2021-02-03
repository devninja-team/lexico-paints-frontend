import React from "react";
import {
    NavLink
} from "react-router-dom";
import {useSelector} from "react-redux";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './index.scss';
import logo from '../../images/westgarth-logo.png';
import closeIcon from '../../images/close-icon.svg';
import { useHistory } from 'react-router-dom';
import {connect} from "react-redux";
import {logout, setGlobalData, setInvoiceData, setSession} from "../../utils/Actions";
import axios from 'axios';
import {Link} from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import EditIcon from '../../assets/images/edit-icon.svg';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import SearchIcon from '../../assets/images/search-icon.svg';
import OrderByIcon from '../../assets/images/orderby-arrow.png';
import SessionModal from '../Modals/SessionModal';
import {statusList, locationList, phoneCodeList} from "../../utils/drop-down-list";
    
const Prospects = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const[showPerPage,setshowPerPage] = useState('25');
    const[isViewOpen,setIsViewOpen] = useState(false);
    const [prospectId, setPropsectId] = useState("");
    const query = useSelector(state => state.userRegion);

    const [prospectList, setProspectList] = useState();
    const [allProspectList, setAllProspectList] = useState();

    //edit fields
    const [editFieldSource, setEditFieldSource] = useState();
    const [source, setSource] = useState("CAP");
    const [status, setStatus] = useState("Qualified");

    //asc-desc flag
    const [order, setOrder] = useState('desc');

    //search var
    const [search, setSearch] = useState();
    const [openSearch, setOpenSearch] = useState(false);

    //dropdown vars
    const [isAreaCodeOpen, setIsAreaCodeOpen] = useState(false);
    const [isRegionOpen, setIsRegionOpen] = useState(false);
    const [isVendorTypeOpen, setIsVendorTypeOpen] = useState(false);

    const [statusDropdown, setStatusDropdown] = useState("Qualified");
    const [sourceDropDown, setSourceDropDown] = useState("CAP");

    const [isSourceDropDownOpen, setIsSourceDropDownOpen] = useState(false);
    const [isStatusDropDownOpen, setIsStatusDropDownOpen] = useState(false);

    //filter dropdowns
    const [isDayOpen, setIsDayOpen] = useState(false);
    const [dayDropDownValue, setDayDropDownValue] = useState("ALL");
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [statusDropDownValue, setStatusDropDownValue] = useState("");
    const [isSourceOpen, setIsSourceOpen] = useState(false);
    const [sourceDropDownValue, setSourceDropDownValue] = useState("");

    //custom pagination vars
    const [currentPage,setCurrentPage] = useState(1);
    const [postsPerPage,setPostsPerPage] = useState(25);
    const [pageNumber,setPageNumber] = useState([]);
    const [indexOfAllFirstPage,setIndexOfFirstPage] = useState();
    const [indexOfAllLastPage,setIndexOfLastPage] = useState();
    const [loadingData,setLoadingData] = useState();
    const [initialPage,setInitialPage] = useState(0);
    const [lastPage,setLastPage] = useState(10);

    //sorting vars
    const[sortOrder,setSortOrder] = useState('asc');

    //form vars
    const [title, setTitle] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [areaCode, setAreaCode] = useState("+44");
    const [phone, setPhone] = useState();
    const [region, setRegion] = useState("US");
    const [vendorType, setVendorType] = useState("1");
    const [sourceForm, setSourceForm] = useState("");

    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const[error,setError] = useState('');
    const [success, setSuccess] = useState("");
    const[leadInfoModal,setLeadInfoModal] = useState(false);
    const[vendorInfoModal,setVendorInfoModal] = useState(false);
    const[prospectInfoModal,setProspectInfoModal] = useState(false);

    const [showEdit, setShowEdit] = useState();
    const [showEditStatus, setShowEditStatus] = useState();

    //day filters
    const [durationLastContacted, setDurationLastContacted] = useState('');
    const [durationSource, setDurationSource] = useState('');
    const [durationStatus, setDurationStatus] = useState('');

    //filter vars
    const [durationBtnValue, setDurationBtnValue] = useState("");
    const [sourceBtnValue, setSourceBtnValue] = useState("");
    const [statusBtnValue, setStatusBtnValue] = useState("");
    const [stockBtnValue, setStockBtnValue] = useState("");
    const [isSourceFilterOpen, setIsSourceFilterOpen] = useState(false);
    const [sourceFilterDropDownValue, setSourceFilterDropDownValue] = useState("");

    //source-dropdown list
    const [sourceList, setSourceList] = useState();
    

    //btn show/hide
    const [showBtn, setShowBtn] = useState(false);

    useEffect(() => {
        dispatch(setInvoiceData({data:""}));
        fetchProspects();
    },[]);


    useEffect(() => {
        if(allProspectList && allProspectList.length > 0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            
            setProspectList(allProspectList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allProspectList.length/postsPerPage);i++) {
                setPageNumber(...[i])
            }
        }
    },[currentPage,postsPerPage]);
    
    const handleNavigation = (type) => {
        var fpos=initialPage;
        var lpos=lastPage;
        if (type === "prev") {
            if(fpos!==0) {
                setCurrentPage(fpos);
                setInitialPage(fpos-10)
                setLastPage(lpos-10)
            }
        }else if (type === "next") {
                if(lpos<pageNumber) {
                    setCurrentPage(lpos+1);
                    setInitialPage(fpos+10)
                    setLastPage(lpos+10)
                }
        }
    }
    const handleMobNavigation = (type) => {
        var fpos=initialPage;
        var lpos=lastPage;
        if (type === "prev") {
            if(fpos!==0) {
                setCurrentPage(fpos);
                setInitialPage(fpos-5)
                setLastPage(lpos-5)
            }
        }else if (type === "next") {
                if(lpos<pageNumber) {
                    setCurrentPage(lpos+1);
                    setInitialPage(fpos+5)
                    setLastPage(lpos+5)
                }
        }
    }
    const fetchProspects = ()=> {
        if(window.screen.width<=480) {
            setLastPage(5);
        }
        setLoadingData(true);
        setDurationLastContacted("all")
        axios
        .post("/accounts/prospect"+query).then((res) => {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            let arrayProspectList = [];
            if(res.data.prospect) {
                Object.entries(res.data.prospect).map((value)=>{
                    arrayProspectList.push(value);
                });

                setAllProspectList(arrayProspectList);
                setProspectList(arrayProspectList.slice(indexOfFirstPage,indexOfLastPost));
                setLoadingData(false);
                for(let i=1; i<=Math.ceil(arrayProspectList.length/postsPerPage);i++) {
                    setPageNumber(...[i])
                }
            }
            if(res.data.sources) {
                setSourceList(res.data.sources);
            }
        })
        .catch((error) => {
            console.log(error);
            const server_code = error.response.status;
            const server_message = error.response.statusText;
            if(server_code===500 || server_code===400 || server_code===404) {
                setSessionMessage(server_message);
                setIsSessionModal(true);
            }
            else if(server_code === 401 && server_message==="Unauthorized4.") {
                setSessionMessage(server_message);
                setIsSessionModal(true);
            }
            else {
                setSessionMessage("Your session has been expired!");
                dispatch(setSession());
                setIsSessionModal(true);
            }
        })
    }
    const paginate = () => {
        if(allProspectList && allProspectList.length>0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            
            setProspectList(allProspectList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allProspectList.length/postsPerPage);i++) {
                setPageNumber(...[i])
            }
            
        }
    }
    const handleProspects = (id) => {
        localStorage.setItem('customer_id',id);
        localStorage.setItem('customer_type','Prospect');
        migrateDataToRedux();
        history.push('/accountinfo/communication');
    }
    const migrateDataToRedux = (data) => {
        dispatch(setGlobalData({data:allProspectList}));
    }
    const handleEditSource = (e, id) => {
        e.preventDefault();
        axios
        .post("/accounts/change"+query, {
            customer_id:id,
            field:"source",
            value: source
        }).then((res) => {
            if(res.data.message === "prospect/customer updated") {
                setShowEdit('');
                setProspectList([]);
                setLoadingData(true);
                setDurationBtnValue("");
                setSourceBtnValue("");
                setStatusBtnValue("");
                fetchProspects();
            }
        })
        .catch((error) => {
            console.log(error);
            const server_code = error.response.status;
            const server_message = error.response.statusText;
            if(server_code===500 || server_code===400 || server_code===404) {
                setSessionMessage(server_message);
                setIsSessionModal(true);
            }
            else if(server_code === 401 && server_message==="Unauthorized4.") {
                setSessionMessage(server_message);
                setIsSessionModal(true);
            }
            else {
                setSessionMessage("Your session has been expired!");
                dispatch(setSession());
                setIsSessionModal(true);
            }
        })
        setShowEdit('');
    }
    const handleAddUser = (e,type) => {
        setError("");
        setSuccess("");
        e.preventDefault();
        if(phone || email) {
            axios.post('/accounts/add_lead'+query,{
                title:title,
                first_name:firstName,
                last_name: lastName,
                email_address: email,
                phone_area_code: areaCode,
                phone_number: phone,
                store_region: region,
                source: source,
                status: status
            }).then((res) => {
                // console.log("add user api response",res.data);
                if(res.data.message === "lead/prospect added") {
                    setPropsectId(res.data.customer_id);
                    setSuccess("Prospect Added Successfully!");
                    setShowBtn(true);
                    setProspectList([]);
                    fetchProspects();
                } else {
                    setError(res.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
                const server_code = error.response.status;
                const server_message = error.response.statusText;
                if(server_code===500 || server_code===400 || server_code===404) {
                    setSessionMessage(server_message);
                    setIsSessionModal(true);
                }
                else if(server_code === 401 && server_message==="Unauthorized4.") {
                    setSessionMessage(server_message);
                    setIsSessionModal(true);
                }
                else {
                    setSessionMessage("Your session has been expired!");
                    dispatch(setSession());
                    setIsSessionModal(true);
                }
            }) 
            
            setTitle('');
            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setSource('');   
        } else {
            setSuccess("");
            setError("Email/Phone required");
        }
    }
    const handleEditStatus = (e, id) => {
        e.preventDefault();
        if(status) {
            axios
        .post("/accounts/change"+query, {
            customer_id:id,
            field:"status",
            value: status
        }).then((res) => {
            if(res.data.message === "prospect/customer updated") {
                setShowEdit('');
                setProspectList([]);
                setLoadingData(true);
                setDurationBtnValue("");
                setSourceBtnValue("");
                setStatusBtnValue("");
                fetchProspects();
            }
        })
        .catch((error) => {
            console.log(error);
            const server_code = error.response.status;
            const server_message = error.response.statusText;
            if(server_code===500 || server_code===400 || server_code===404) {
                setSessionMessage(server_message);
                setIsSessionModal(true);
            }
            else if(server_code === 401 && server_message==="Unauthorized4.") {
                setSessionMessage(server_message);
                setIsSessionModal(true);
            }
            else {
                setSessionMessage("Your session has been expired!");
                dispatch(setSession());
                setIsSessionModal(true);
            }
        })
        setShowEditStatus('');
        }
    }

    const handleSorting = (field) => {
        if(prospectList && prospectList.length>0) {
            let sortedArray=[];
            // setSortOrder('desc');
            if(sortOrder == "asc") {
                setSortOrder('desc');
            }else {
                setSortOrder('asc');
            }
            if(search) {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "firstname" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].first_name?a[1].first_name.toLowerCase():""
                                    var nameB=b[1].first_name?b[1].first_name.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "lastname" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].last_name?a[1].last_name.toLowerCase():""
                                    var nameB=b[1].last_name?b[1].last_name.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "prospect_source" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].prospect_source?a[1].prospect_source.toLowerCase():""
                                    var nameB=b[1].prospect_source?b[1].prospect_source.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "prospect_status" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].prospect_status?a[1].prospect_status.toLowerCase():""
                                    var nameB=b[1].prospect_status?b[1].prospect_status.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "created_date" :
                                sortedArray = allProspectList.sort( 
                                    (a, b) => new Date (a[1].created_date) - new Date(b[1].created_date)
                                );
                            break;

                            case "last_contacted" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date (a[1].last_contacted) - new Date(b[1].last_contacted)
                                );
                            break;

                            case "contact_type" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].contact_type?a[1].contact_type.toLowerCase():""
                                    var nameB=b[1].contact_type?b[1].contact_type.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "location" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].location?a[1].location.toLowerCase():""
                                    var nameB=b[1].location?b[1].location.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "follow_date" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date (a[1].follow_date) - new Date(b[1].follow_date)
                                );
                            break;

                            case "proposal_sent" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].proposal_sent?a[1].proposal_sent.toLowerCase():""
                                    var nameB=b[1].proposal_sent?b[1].proposal_sent.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "proposal_date" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date (a[1].proposal_date) - new Date(b[1].proposal_date)
                                );
                            break;

                            case "email_status" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].email_status?a[1].email_status.toLowerCase():""
                                    var nameB=b[1].email_status?b[1].email_status.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "stock_to_sale" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].stock_to_sale?a[1].stock_to_sale.toLowerCase():""
                                    var nameB=b[1].stock_to_sale?b[1].stock_to_sale.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            default:console.log("check sorting Label 1"); break;
                        }
                        setAllProspectList([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "firstname" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].first_name?a[1].first_name.toLowerCase():"", nameB=b[1].first_name?b[1].first_name.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "lastname" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].last_name?a[1].last_name.toLowerCase():"", nameB=b[1].last_name?b[1].last_name.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "prospect_source" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].prospect_source?a[1].prospect_source.toLowerCase():"", nameB=b[1].prospect_source?b[1].prospect_source.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            
                            case "prospect_status" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].prospect_status?a[1].prospect_status.toLowerCase():"", nameB=b[1].prospect_status?b[1].prospect_status.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "created_date" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date (b[1].created_date) - new Date(a[1].created_date)
                                );
                            break;

                            case "last_contacted" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date(b[1].last_contacted) - new Date(a[1].last_contacted)
                                );
                            break;

                            case "contact_type" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].contact_type?a[1].contact_type.toLowerCase():"", nameB=b[1].contact_type?b[1].contact_type.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "location" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].location?a[1].location.toLowerCase():"", nameB=b[1].location?b[1].location.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "follow_date" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date(b[1].follow_date) - new Date(a[1].follow_date)
                                );
                            break;

                            case "proposal_sent" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].proposal_sent?a[1].proposal_sent.toLowerCase():"", nameB=b[1].proposal_sent?b[1].proposal_sent.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "proposal_date" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date(b[1].proposal_date) - new Date(a[1].proposal_date)
                                );
                            break;

                            case "email_status" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].proposal_status?a[1].email_status.toLowerCase():"", nameB=b[1].email_status?b[1].email_status.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "stock_to_sale" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].stock_to_sale?a[1].stock_to_sale.toLowerCase():"", nameB=b[1].stock_to_sale?b[1].stock_to_sale.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
    
                            default:console.log("check sorting Label 2"); break;
                        }
                        setAllProspectList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }else {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "firstname" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].first_name?a[1].first_name.toLowerCase():""
                                    var nameB=b[1].first_name?b[1].first_name.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "lastname" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].last_name?a[1].last_name.toLowerCase():""
                                    var nameB=b[1].last_name?b[1].last_name.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "prospect_source" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].prospect_source?a[1].prospect_source.toLowerCase():""
                                    var nameB=b[1].prospect_source?b[1].prospect_source.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "prospect_status" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].prospect_status?a[1].prospect_status.toLowerCase():""
                                    var nameB=b[1].prospect_status?b[1].prospect_status.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "created_date" :
                                sortedArray = allProspectList.sort( 
                                    (a, b) => new Date (a[1].created_date) - new Date(b[1].created_date)
                                );
                            break;

                            case "last_contacted" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date (a[1].last_contacted) - new Date(b[1].last_contacted)
                                );
                            break;

                            case "contact_type" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].contact_type?a[1].contact_type.toLowerCase():""
                                    var nameB=b[1].contact_type?b[1].contact_type.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "location" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].location?a[1].location.toLowerCase():""
                                    var nameB=b[1].location?b[1].location.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "follow_date" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date (a[1].follow_date) - new Date(b[1].follow_date)
                                );
                            break;

                            case "location" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].proposal_sent?a[1].location.toLowerCase():""
                                    var nameB=b[1].location?b[1].location.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "proposal_sent" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].proposal_sent?a[1].proposal_sent.toLowerCase():""
                                    var nameB=b[1].proposal_sent?b[1].proposal_sent.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "proposal_date" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date (a[1].proposal_date) - new Date(b[1].proposal_date)
                                );
                            break;

                            case "email_status" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].email_status?a[1].email_status.toLowerCase():""
                                    var nameB=b[1].email_status?b[1].email_status.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "stock_to_sale" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].stock_to_sale?a[1].stock_to_sale.toLowerCase():""
                                    var nameB=b[1].stock_to_sale?b[1].stock_to_sale.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            default:console.log("check sorting Label 1"); break;
                        }
                        // setProspectList([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "firstname" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].first_name?a[1].first_name.toLowerCase():"", nameB=b[1].first_name?b[1].first_name.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "lastname" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].last_name?a[1].last_name.toLowerCase():"", nameB=b[1].last_name?b[1].last_name.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "prospect_source" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].prospect_source?a[1].prospect_source.toLowerCase():"", nameB=b[1].prospect_source?b[1].prospect_source.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            
                            case "prospect_status" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].prospect_status?a[1].prospect_status.toLowerCase():"", nameB=b[1].prospect_status?b[1].prospect_status.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "created_date" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date (b[1].created_date) - new Date(a[1].created_date)
                                );
                            break;

                            case "last_contacted" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date(b[1].last_contacted) - new Date(a[1].last_contacted)
                                );
                            break;

                            case "contact_type" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].contact_type?a[1].contact_type.toLowerCase():a[1].contact_type, nameB=b[1].contact_type?b[1].contact_type.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "location" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].location?a[1].location.toLowerCase():a[1].location, nameB=b[1].location?b[1].location.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "follow_date" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date(b[1].follow_date) - new Date(a[1].follow_date)
                                );
                            break;

                            case "proposal_sent" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].proposal_sent?a[1].proposal_sent.toLowerCase():a[1].proposal_sent, nameB=b[1].proposal_sent?b[1].proposal_sent.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            
                            case "proposal_date" :
                                sortedArray = allProspectList.sort(
                                    (a, b) => new Date(b[1].proposal_date) - new Date(a[1].proposal_date)
                                );
                            break;

                            case "email_status" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].email_status?a[1].email_status.toLowerCase():a[1].email_status, nameB=b[1].email_status?b[1].email_status.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "stock_to_sale" :
                                sortedArray = allProspectList.sort( function(a, b) {
                                    var nameA=a[1].stock_to_sale?a[1].stock_to_sale.toLowerCase():a[1].stock_to_sale, nameB=b[1].stock_to_sale?b[1].stock_to_sale.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            
    
    
                            default:console.log("check sorting Label 2"); break;
                        }
                        // setProspectList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
                paginate();
            }
        }
    }
    const handleViewBtn = () => {
        localStorage.setItem("customer_id",prospectId);
        localStorage.setItem("customer_type","Prospect");
        history.push("/accountinfo/communication");
    }
    const fetchFromFilterAPI = (range,source,status, stock_to_sell) => {
        setLoadingData(true);
        setInitialPage(0);
        // setCurrentPage(1);
        // console.log("initial page", initialPage)
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        setAllProspectList([]);
        setProspectList([]);
        setDurationLastContacted("all");
        axios
        .post("/accounts/prospect"+query, {
            range, source, status, stock_to_sell
        }).then((res) => {
            var indexOfLastPost = 1 * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            let arrayProspectList = [];
            if(res.data.prospect) {
                Object.entries(res.data.prospect).map((value)=>{
                    arrayProspectList.push(value);
                });

                setAllProspectList(arrayProspectList);
                setProspectList(arrayProspectList.slice(indexOfFirstPage,indexOfLastPost));
                setLoadingData(false);
                for(let i=1; i<=Math.ceil(arrayProspectList.length/postsPerPage);i++) {
                    setPageNumber(...[i])
                }
            }
        })
        .catch((error) => {
            console.log(error);
            const server_code = error.response.status;
            const server_message = error.response.statusText;
            if(server_code===500 || server_code===400 || server_code===404) {
                setSessionMessage(server_message);
                setIsSessionModal(true);
            }
            else if(server_code === 401 && server_message==="Unauthorized4.") {
                setSessionMessage(server_message);
                setIsSessionModal(true);
            }
            else {
                setSessionMessage("Your session has been expired!");
                dispatch(setSession());
                setIsSessionModal(true);
            }
        })
    }
    const handleFilters = (value, type) => {
        setInitialPage(0);
        setCurrentPage(1);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        setAllProspectList([]);
        setProspectList([]);
        if(type==="day-filter") {
            fetchFromFilterAPI(value, sourceDropDownValue, statusBtnValue, stockBtnValue);
        } else if(type==="source-filter") {
            fetchFromFilterAPI(durationBtnValue, value, statusBtnValue, stockBtnValue);
        } else if(type==="status-filter") {
            fetchFromFilterAPI(durationBtnValue, sourceDropDownValue, value, stockBtnValue);
        } else if(type==="stock-filter") {
            fetchFromFilterAPI(durationBtnValue, sourceDropDownValue, statusBtnValue, value);
        }
    }

    
    return (
        <div className="transaction-page">
            <div className="customers-content">
                <div className="top-head d-flex align-items-end">
                    <div className="title d-flex justify-content-start align-items-center">
                        <h1 className="mb-0">Prospects</h1>
                    </div>
                    <div className={openSearch ? "search-customer show" : "search-customer"}>
                        <div className="search-box">
                            <input className="search-input" type="text" 
                                value={search}
                                placeholder="Quick Find by First Name, Last Name"
                                onChange={(e) => setSearch(e.target.value)}/>
                            <button className="search-btn" type="button" onClick={() => setOpenSearch(!openSearch)}>
                                <img src={SearchIcon} alt=""/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="header my-2 justify-content-end">
                <div className="data-filter">
                    <div>
                        <ul>
                            <li>
                                <Button className='btn-filter'  variant="outline-primary" onClick={()=>setProspectInfoModal(true)}>
                                    ADD PROSPECT
                                    <svg className="add-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                            viewBox="0 0 512 512">
                                        <g>
                                            <g>
                                                <path d="M256,0C114.84,0,0,114.84,0,256s114.84,256,256,256s256-114.84,256-256S397.16,0,256,0z M256,475.429
                                                    c-120.997,0-219.429-98.432-219.429-219.429S135.003,36.571,256,36.571S475.429,135.003,475.429,256S376.997,475.429,256,475.429z
                                                    "/>
                                            </g>
                                        </g>
                                        <g>
                                            <g>
                                                <path d="M256,134.095c-10.1,0-18.286,8.186-18.286,18.286v207.238c0,10.1,8.186,18.286,18.286,18.286
                                                    c10.1,0,18.286-8.186,18.286-18.286V152.381C274.286,142.281,266.1,134.095,256,134.095z"/>
                                            </g>
                                        </g>
                                        <g>
                                            <g>
                                                <path d="M359.619,237.714H152.381c-10.1,0-18.286,8.186-18.286,18.286c0,10.1,8.186,18.286,18.286,18.286h207.238
                                                    c10.1,0,18.286-8.186,18.286-18.286C377.905,245.9,369.719,237.714,359.619,237.714z"/>
                                            </g>
                                        </g>
                                    </svg>
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="right-side search-page-dropbox">
                    <div className="dropUp">
                        <div className="custom-select-wrapper d-md-flex d-none align-items-center">
                            <div className={isViewOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                <div className="custom-select__trigger" onClick={()=>setIsViewOpen(!isViewOpen)}><span>{showPerPage===9999 ? 'ALL' : showPerPage}</span>
                                    <div className="arrow">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className="custom-options">
                                    <span className={showPerPage === 5 ? "custom-option selected":"custom-option"} onClick={() => { setshowPerPage(5); setPostsPerPage(5); setInitialPage(0); setCurrentPage(1); setLastPage(10);  setIsViewOpen(false)}}>5</span>
                                    <span className={showPerPage === 25 ? "custom-option selected":"custom-option"}  onClick={() => { setshowPerPage(25); setPostsPerPage(25); setInitialPage(0); setCurrentPage(1);setLastPage(10);  setIsViewOpen(false)}}>25</span>
                                    <span className={showPerPage === 50 ? "custom-option selected":"custom-option"}  onClick={() => { setshowPerPage(50); setPostsPerPage(50); setInitialPage(0); setCurrentPage(1); setLastPage(10); setIsViewOpen(false)}}>50</span>
                                    <span className={showPerPage === 9999 ? "custom-option selected":"custom-option"} onClick={() => { setshowPerPage(9999); setPostsPerPage(9999); setInitialPage(0); setCurrentPage(1); setLastPage(10); setIsViewOpen(false)}}>ALL</span>
                                </div>
                            </div>
                        </div>
                        <div className="custom-select-wrapper d-flex d-md-none align-items-center">
                            <div className={isViewOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                <div className="custom-select__trigger" onClick={()=>setIsViewOpen(!isViewOpen)}>
                                    {
                                        showPerPage === 9999 ? 
                                        <span>{'ALL'}</span> :
                                        <span>{showPerPage}</span>
                                    }          
                                    <div className="arrow">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                        </svg>
                                    </div> 
                                </div>
                                <div className="custom-options per-page">
                                    <span className={showPerPage === 5 ? "custom-option selected":"custom-option"}  onClick={() => { setshowPerPage(5); setInitialPage(0); setLastPage(5); setPostsPerPage(5); setCurrentPage(1); setIsViewOpen(false)}}>5</span>
                                    <span className={showPerPage === 10 ? "custom-option selected":"custom-option"}  onClick={() => { setshowPerPage(10); setInitialPage(0); setLastPage(5); setPostsPerPage(10); setCurrentPage(1); setIsViewOpen(false)}}>10</span>
                                    <span className={showPerPage === 25 ? "custom-option selected":"custom-option"}  onClick={() => { setshowPerPage(25); setInitialPage(0); setLastPage(5); setPostsPerPage(25); setCurrentPage(1); setIsViewOpen(false)}}>25</span>
                                    <span className={showPerPage === 9999 ? "custom-option selected":"custom-option"} onClick={() => { setshowPerPage(9999); setInitialPage(0); setLastPage(5); setCurrentPage(1); setPostsPerPage(9999); setIsViewOpen(false)}}>ALL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            

        <div className="all-customer-wrapper">
            <div className="all-customer-data">
                <div className="all-customer-data-head py-3 pl-3 pr-4">
                    <div className="customer-data-head-filter d-flex align-items-center justify-content-end border-bottom-0 mb-2">
                        <div className="customer-title">
                            Last Contacted :
                        </div>
                        <div className="data-filter">
                            <ul>
                                <li>
                                    <Button className={durationBtnValue==="" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setDurationBtnValue(""); handleFilters("","day-filter");}}>ALL</Button>
                                </li>
                                <li>
                                    <Button className={durationBtnValue==="30days" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setDurationBtnValue("30days");handleFilters("30days","day-filter"); }} >LAST 30 DAYS</Button>
                                </li>
                                <li>
                                    <Button className={durationBtnValue==="30_90_days" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setDurationBtnValue("30_90_days");handleFilters("30_90_days","day-filter");}}>30-90 DAYS</Button>
                                </li>

                                <li>
                                    <Button className={durationBtnValue==="3_6_months" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setDurationBtnValue("3_6_months");handleFilters("3_6_months","day-filter");}}>3-6 MONTHS</Button>
                                </li>
                                <li>
                                    <Button className={durationBtnValue==="6_12_months" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setDurationBtnValue("6_12_months");handleFilters("6_12_months","day-filter");}}>6-12 MONTHS</Button>
                                </li>
                                <li>
                                    <Button className={durationBtnValue==="more_than_1_year" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setDurationBtnValue("more_than_1_year");handleFilters("more_than_1_year","day-filter");}}>LONGER THAN 1 YEAR</Button>
                                </li>
                            </ul>
                        </div>
                    </div>
                
                
                    <div className="customer-data-head-filter d-flex align-items-center justify-content-end border-bottom-0 mb-2">
                        <div className="customer-title">
                            Status :
                        </div>
                        <div className="data-filter">
                            <ul>
                                <li>
                                    <Button className={statusBtnValue==="" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setStatusBtnValue("");handleFilters("","status-filter")}}>ALL</Button>
                                </li>
                                {
                                    statusList && statusList.length>0 ? (
                                        statusList.map((value, index) => {
                                            return (
                                                <li>
                                                    <Button className={statusBtnValue===value ? 'btn-filter active' : 'btn-filter'} onClick={() => { setStatusBtnValue(value);handleFilters(value,"status-filter")}}>{value}</Button>
                                                </li>
                                            )
                                        })
                                    ) : ""
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="customer-data-head-filter d-flex align-items-center justify-content-end border-bottom-0 mb-2">
                        <div className="customer-title">
                            Stock to Sale :
                        </div>
                        <div className="data-filter">
                            <ul>
                                <li>
                                    <Button className={stockBtnValue==="" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setStockBtnValue("");handleFilters("","stock-filter")}}>ALL</Button>
                                </li>
                                <li>
                                    <Button className={stockBtnValue==="Yes" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setStockBtnValue("Yes");handleFilters("Yes","stock-filter")}}>Yes</Button>
                                </li>
                                <li>
                                    <Button className={stockBtnValue==="No" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setStockBtnValue("No");handleFilters("No","stock-filter")}}>No</Button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="customer-data-head-filter d-flex align-items-center justify-content-end border-bottom-0 mb-2">
                        <div className="customer-title">
                            Source :
                        </div>
                        <div className="data-filter">
                            <div className="dropUp">
                                <div className="custom-select-wrapper d-flex align-items-center">
                                    <div className={isSourceFilterOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                        <div className="custom-select__trigger" onClick={()=>setIsSourceFilterOpen(!isSourceFilterOpen)}>
                                            <span>{sourceFilterDropDownValue?sourceFilterDropDownValue:"ALL"}</span>
                                            <div className="arrow">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="custom-options">
                                            {
                                                sourceList && sourceList.length>0 ? (
                                                    sourceList.map((value, index) => {
                                                        return (
                                                            <span key={index} className={sourceFilterDropDownValue === value ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setSourceFilterDropDownValue(value);  handleFilters(value,"source-filter"); setIsSourceFilterOpen(false)}}>{value}</span>        
                                                        )
                                                    })
                                                ) :("")
                                            }
                                            <span className={sourceFilterDropDownValue === "" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setSourceFilterDropDownValue(""); handleFilters("","source-filter");setIsSourceFilterOpen(false)}}>{"ALL"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="customer-table">
                    <Table responsive>
                        <thead>
                        <tr>
                            <th className="cursor-pointer" onClick={() => handleSorting("firstname")}>First Name </th>
                            {/* <th onClick={() => handleSorting()}>Date <img height="12" width="12" src={OrderByIcon}></img></th> */}
                            <th className="cursor-pointer" onClick={() => handleSorting("lastname")}>Last Name</th>
                            <th className="cursor-pointer" onClick={() => handleSorting("prospect_source")}>Prospect Source</th>
                            <th className="cursor-pointer" onClick={() => handleSorting("prospect_status")}>Prospect Status</th>
                            <th className="cursor-pointer" onClick={() => handleSorting("created_date")}>Created Date</th>
                            <th className="cursor-pointer" onClick={() => handleSorting("last_contacted")}>Last Contacted</th>
                            <th className="cursor-pointer" onClick={() => handleSorting("contact_type")}>Contact Type</th>
                            <th className="cursor-pointer" onClick={() => handleSorting("location")}>Location</th>
                            <th className="cursor-pointer" onClick={() => handleSorting("follow_date")}>Followup Date</th>
                            <th className="cursor-pointer" onClick={() => handleSorting("proposal_date")}>Proposal Date</th>
                            <th className="cursor-pointer" onClick={() => handleSorting("proposal_sent")}>Proposal sent</th>
                            <th className="cursor-pointer" onClick={() => handleSorting("stock_to_sale")}>Stock to Sale</th>
                            {/* <th className="cursor-pointer" onClick={() => handleSorting("email_status")}>Email status</th> */}
                        </tr>
                        </thead>
                        <tbody>
                        {
                                search ? (
                                    allProspectList && allProspectList.length > 0 ? (
                                        allProspectList.filter((data) => {
                                            if(
                                                data[1].first_name && data[1].first_name.toLowerCase().includes(search.toLowerCase())||
                                                data[1].last_name && data[1].last_name.toLowerCase().includes(search.toLowerCase()) 
                                                // ||
                                                // data[1].phone && data[1].phone.toLowerCase().includes(search.toLowerCase()) ||
                                                // data[1].email && data[1].email.toLowerCase().includes(search.toLowerCase())
                                            ) {
                                                return data;
                                            }
                                        }).map((value, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].first_name ? value[1].first_name : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].last_name ? value[1].last_name : "-"}</td>
                                                    {
                                                        showEdit === index ?  
                                                        (
                                                            <td>
                                                                <form onSubmit={(e) => handleEditSource(e, value[0])}>
                                                                    <div className="dropUp">
                                                                        <div className="custom-select-wrapper d-flex align-items-center">
                                                                            <div className={isSourceOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                                <div className="custom-select__trigger" onClick={()=>setIsSourceOpen(!isSourceOpen)}><span>{sourceDropDown}</span>
                                                                                    <div className="arrow">
                                                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                        </svg>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="custom-options">
                                                                                    {statusList && statusList.length >0 ? (
                                                                                        statusList.map((value, index) => {
                                                                                            return(
                                                                                                <span key={index} className={sourceDropDown === value ? "custom-option selected":"custom-option"} onClick={() => { setSourceDropDown("value"); setSource("value"); setIsSourceOpen(false)}}>{value}</span>
                                                                                            )
                                                                                        })
                                                                                    ):""}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <input type="submit" className="save-btn" value="save"></input>
                                                                    <input type="button" className="close-btn" value="x" onClick={()=>setShowEdit('')}></input>
                                                                </form>
                                                            </td>)
                                                        :
                                                        (
                                                            value[1].prospect_source ? (<td><span className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].prospect_source}
                                                                {/* <img onClick={() => {setShowEdit(index);}}src={EditIcon} alt="edit-icon"></img> */}
                                                            </span></td>
                                                        ) : (
                                                            <td>
                                                                <span>-
                                                                    {/* <img onClick={() => {setShowEdit(index);}}src={EditIcon} alt="edit-icon"></img> */}
                                                                </span>
                                                            </td>
                                                        )
                                                    )
                                                }
                                                {
                                                    showEditStatus === index ?  
                                                        (
                                                            <td>
                                                                <form onSubmit={(e) => handleEditStatus(e, value[0])}>
                                                                    <div className="dropUp">
                                                                        <div className="custom-select-wrapper d-flex align-items-center">
                                                                            <div className={isStatusOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                                <div className="custom-select__trigger" onClick={()=>setIsStatusOpen(!isStatusOpen)}><span>{statusDropdown}</span>
                                                                                    <div className="arrow">
                                                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                        </svg>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="custom-options">
                                                                                    {statusList && statusList.length >0 ? (
                                                                                        statusList.map((value, index) => {
                                                                                            return(
                                                                                                <span key={index} className={statusDropdown === value ? "custom-option selected":"custom-option"} onClick={() => { setStatusDropdown(value); setStatus(value); setIsStatusOpen(false)}}>{value}</span>
                                                                                            )
                                                                                        })
                                                                                    ):""}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <input type="submit" className="save-btn" value="save"></input>
                                                                    <input type="button" className="close-btn" value="x" onClick={()=>setShowEditStatus('')}></input>
                                                                </form>
                                                            </td>)
                                                            :
                                                            (
                                                                value[1].prospect_status ? (<td><span>{value[1].prospect_status}<img onClick={() => {setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img></span></td>
                                                            ) : (
                                                            <td>
                                                                <span>-
                                                                    <img onClick={() => {setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img>
                                                                </span>
                                                            </td>
                                                            )
                                                    )
                                                }     
                                                    <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].created_date ? value[1].created_date : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].last_contacted ? value[1].last_contacted : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].contact_type ? value[1].contact_type : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].location ? value[1].location : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].follow_date ? value[1].follow_date : "-"}</td>

                                                    <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].proposal_date ? value[1].proposal_date : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].proposal_sent ? value[1].proposal_sent : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].stock_to_sale ? value[1].stock_to_sale : "-"}</td>
                                                    {/* <td>{value[1].email_status ? value[1].email_status : "-"}</td> */}
                                                </tr>
                                            )
                                        })
                                    ) : ("")
                                )
                                :
                                prospectList && prospectList.length > 0 ? (
                                    prospectList.map((value, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].first_name ? value[1].first_name : "-"}</td>
                                                <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].last_name ? value[1].last_name : "-"}</td>
                                                {
                                                        showEdit === index ?  
                                                        (
                                                            <td>
                                                                <form onSubmit={(e) => handleEditSource(e, value[0])}>
                                                                    <div className="dropUp">
                                                                        <div className="custom-select-wrapper d-flex align-items-center">
                                                                            <div className={isSourceOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                                <div className="custom-select__trigger" onClick={()=>setIsSourceOpen(!isSourceOpen)}><span>{sourceDropDown}</span>
                                                                                    <div className="arrow">
                                                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                        </svg>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="custom-options">
                                                                                    <span className={sourceDropDown === "Hot" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setSourceDropDown("Hot"); setSource("Hot"); setIsSourceOpen(false)}}>Hot</span>
                                                                                    <span className={sourceDropDown === "Cold" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setSourceDropDown("Cold"); setSource("Cold"); setIsSourceOpen(false)}}>Cold</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <input type="submit" className="save-btn" value="save"></input>
                                                                    <input type="button" className="close-btn" value="x" onClick={()=>setShowEdit('')}></input>
                                                                </form>
                                                            </td>)
                                                        :
                                                        (
                                                            value[1].prospect_source ? (<td><span className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].prospect_source}
                                                                {/* <img onClick={() => {setShowEdit(index);}}src={EditIcon} alt="edit-icon"></img> */}
                                                            </span></td>
                                                        ) : (
                                                            <td>
                                                                <span>-
                                                                    {/* <img onClick={() => {setShowEdit(index);}}src={EditIcon} alt="edit-icon"></img> */}
                                                                </span>
                                                            </td>
                                                        )
                                                    )
                                                }
                                                {
                                                    showEditStatus === index ?  
                                                        (
                                                            <td>
                                                                <form onSubmit={(e) => handleEditStatus(e, value[0])}>
                                                                    <div className="dropUp">
                                                                        <div className="custom-select-wrapper d-flex align-items-center">
                                                                            <div className={isStatusOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                                <div className="custom-select__trigger" onClick={()=>setIsStatusOpen(!isStatusOpen)}><span>{statusDropdown}</span>
                                                                                    <div className="arrow">
                                                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                        </svg>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="custom-options">
                                                                                    {statusList && statusList.length >0 ? (
                                                                                        statusList.map((value, index) => {
                                                                                            return(
                                                                                                <span key={index} className={statusDropdown === value ? "custom-option selected":"custom-option"} onClick={() => { setStatusDropdown(value); setStatus(value); setIsStatusOpen(false)}}>{value}</span>
                                                                                            )
                                                                                        })
                                                                                    ):""}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <input type="submit" className="save-btn" value="save"></input>
                                                                    <input type="button" className="close-btn" value="x" onClick={()=>setShowEditStatus('')}></input>
                                                                </form>
                                                            </td>)
                                                            :
                                                            (
                                                                value[1].prospect_status ? (<td><span>{value[1].prospect_status}<img onClick={() => {setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img></span></td>
                                                            ) : (
                                                            <td>
                                                                <span>-
                                                                    <img onClick={() => {setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img>
                                                                </span>
                                                            </td>
                                                            )
                                                    )
                                                }  
                                                <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].created_date ? value[1].created_date : "-"}</td>
                                                <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].last_contacted ? value[1].last_contacted : "-"}</td>
                                                <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].contact_type ? value[1].contact_type : "-"}</td>
                                                <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].location ? value[1].location : "-"}</td>
                                                <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].follow_date ? value[1].follow_date : "-"}</td>

                                                <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].proposal_date ? value[1].proposal_date : "-"}</td>
                                                <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].proposal_sent ? value[1].proposal_sent : "-"}</td>
                                                <td className="cursor-pointer" onClick={() => handleProspects(value[0])}>{value[1].stock_to_sale ? value[1].stock_to_sale : "-"}</td>
                                                {/* <td>{value[1].email_status ? value[1].email_status : "-"}</td> */}
                                            </tr>
                                        )
                                    })
                                ) : ("")
                            }
                            {
                                loadingData ? (
                                    <tr>
                                        <td colSpan="12" className="text-center">Loading...</td>
                                    </tr>
                                ) :
                                ("")
                            }
                            {
                                prospectList && prospectList.length===0 && loadingData===false && !search? (
                                    <tr>
                                        <td colSpan="12" className="text-center">No Prospects Found</td>
                                    </tr>
                                ) :
                                ("")
                            }
                            {
                                search ? (allProspectList ? (allProspectList.filter((data) => {
                                if(
                                    data[1].first_name && data[1].first_name.toLowerCase().includes(search.toLowerCase())||
                                    data[1].last_name && data[1].last_name.toLowerCase().includes(search.toLowerCase()) 
                                    // ||
                                    // data[1].phone && data[1].phone.toLowerCase().includes(search.toLowerCase()) ||
                                    // data[1].email && data[1].email.toLowerCase().includes(search.toLowerCase())
                                ) {
                                    return data;
                                }
                                }).length>0) ? "":
                                (<tr>
                                    <td colSpan="12" className="text-center">No Data Found!</td>
                                </tr>):"") : ("")
                            }
                        </tbody>
                    </Table>
                </div>
                {/* transaction table mobile view */}
                <div className="customer-table-mobile">
                    <div className="mobile-table-row">
                    {
                        search ? (
                            allProspectList && allProspectList.length > 0 ? (
                                allProspectList.filter((data) => {
                                    if(
                                        data[1].first_name && data[1].first_name.toLowerCase().includes(search.toLowerCase())||
                                        data[1].last_name && data[1].last_name.toLowerCase().includes(search.toLowerCase()) 
                                        // ||
                                        // data[1].phone && data[1].phone.toLowerCase().includes(search.toLowerCase()) ||
                                        // data[1].email && data[1].email.toLowerCase().includes(search.toLowerCase())
                                    ) {
                                        return data;
                                    }
                                }).map((value, index) => {
                                    return (
                                        <div className="mobile-table-list" key={index}>
                                            <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                <div className="th">
                                                    <label onClick={() => handleSorting("firstname")}>First Name </label>
                                                    <span onClick={() => handleProspects(value[0])}>{value[1].first_name ? value[1].first_name: ""}</span>
                                                </div>
                                                <div className="th">
                                                    <label onClick={() => handleSorting("lastname")}>Last Name </label>
                                                    <span onClick={() => handleProspects(value[0])}>{value[1].last_name ? value[1].last_name: ""}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-td">
                                                <div className="mobile-table-td-row">
                                                    <div className="td-list d-flex justify-content-between">
                                                        <div className="td">
                                                            <label onClick={() => handleSorting("created_date")}>Created Date</label>
                                                            <span onClick={() => handleProspects(value[0])}><strong>{value[1].created_date ? value[1].created_date : "-"}</strong></span>
                                                        </div>
                                                        <div className="product-td d-flex">
                                                            <div className="product-td-name">
                                                                <label onClick={() => handleSorting("last_contacted")}>Last Contacted</label>
                                                                <h6 onClick={() => handleProspects(value[0])}>{value[1].last_contacted ? value[1].last_contacted : "-"}</h6> 
                                                            </div>
                                                        </div>
                                                        <div className="td">
                                                            <div className="shipping-option">
                                                                <label onClick={() => handleSorting("contact_type")}>Contact Type</label>
                                                                <span onClick={() => handleProspects(value[0])}>{value[1].contact_type ? value[1].contact_type : "-"}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer text-right">
                                                <label onClick={() => handleSorting("prospect_source")}>Prospect Source</label>
                                                {
                                                    showEdit === index ?  
                                                    (
                                                        <span>
                                                            <form onSubmit={(e) => handleEditSource(e, value[0])}>
                                                                <div className="dropUp">
                                                                    <div className="custom-select-wrapper d-flex align-items-center">
                                                                        <div className={isSourceDropDownOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                            <div className="custom-select__trigger" onClick={()=>setIsSourceDropDownOpen(!isSourceDropDownOpen)}><span>{sourceDropDown}</span>
                                                                                <div className="arrow">
                                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                            <div className="custom-options">
                                                                                <span className={sourceDropDown === "Hot" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setSourceDropDown("Hot"); setSource("Hot"); setIsSourceDropDownOpen(false)}}>Hot</span>
                                                                                <span className={sourceDropDown === "Cold" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setSourceDropDown("Cold"); setSource("Cold"); setIsSourceDropDownOpen(false)}}>Cold</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <input type="submit" className="save-btn" value="save"></input>
                                                                <input type="button" className="close-btn" value="x" onClick={()=>setShowEdit('')}></input>
                                                            </form>
                                                        </span>)
                                                        :
                                                        (
                                                            value[1].prospect_source ? (<span onClick={() => handleProspects(value[0])}>{value[1].prospect_source} 
                                                                {/* <img onClick={() =>{setShowEdit(index);}}src={EditIcon} alt="edit-icon"></img> */}
                                                            </span>
                                                        ) : (
                                                            <span>-
                                                                {/* <img onClick={() =>{setShowEdit(index);}}src={EditIcon} alt="edit-icon"></img> */}
                                                            </span>
                                                        )
                                                    )
                                                }
                                            </div>
                                            <div className="mobile-table-footer text-right">
                                                <label onClick={() => handleSorting("prospect_status")}>Prospect Status</label>
                                                {
                                                    showEditStatus === index ?  
                                                    (
                                                        <span>
                                                            <form onSubmit={(e) => handleEditStatus(e, value[0])}>
                                                            <div className="dropUp">
                                                                <div className="custom-select-wrapper d-flex align-items-center">
                                                                    <div className={isStatusDropDownOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                        <div className="custom-select__trigger" onClick={()=>setIsStatusDropDownOpen(!isStatusDropDownOpen)}><span>{statusDropdown}</span>
                                                                            <div className="arrow">
                                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                        <div className="custom-options">
                                                                            {statusList && statusList.length >0 ? (
                                                                                statusList.map((value, index) => {
                                                                                    return(
                                                                                        <span key={index} className={statusDropdown === value ? "custom-option selected":"custom-option"} onClick={() => { setStatusDropdown(value); setStatus(value); setIsStatusOpen(false)}}>{value}</span>
                                                                                    )
                                                                                })
                                                                            ):""}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <input type="submit" className="save-btn" value="save"></input>
                                                            <input type="button" className="close-btn" value="x" onClick={()=>setShowEditStatus('')}></input>
                                                            </form>
                                                        </span>)
                                                        :
                                                        (
                                                            value[1].prospect_status ? (<span>{value[1].prospect_status} <img onClick={() =>{setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img></span>
                                                        ) : (<span>-
                                                                <img onClick={() =>{setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img>
                                                            </span>
                                                        )
                                                    )
                                                }
                                            </div>
                                            <div className="mobile-table-footer text-right">
                                                <label onClick={() => handleSorting("location")}>Location</label>
                                                <span onClick={() => handleProspects(value[0])}>{value[1].location ? value[1].location : "-"}</span>
                                            </div>
                                            <div className="mobile-table-footer text-right">
                                                <label onClick={() => handleSorting("follow_date")}>Followup Date</label>
                                                <span  onClick={() => handleProspects(value[0])}>{value[1].follow_date ? value[1].follow_date : "-"}</span>
                                            </div>

                                            <div className="mobile-table-footer text-right">
                                                <label onClick={() => handleSorting("proposal_date")}>Proposal Date</label>
                                                <span  onClick={() => handleProspects(value[0])}>{value[1].proposal_date ? value[1].proposal_date : "-"}</span>
                                            </div>
                                            <div className="mobile-table-footer text-right">
                                                <label onClick={() => handleSorting("proposal_sent")}>Proposal Sent</label>
                                                <span  onClick={() => handleProspects(value[0])}>{value[1].proposal_sent ? value[1].proposal_sent : "-"}</span>
                                            </div>
                                            <div className="mobile-table-footer text-right">
                                                <label onClick={() => handleSorting("stock_to_sale")}>Stock to Sale</label>
                                                <span  onClick={() => handleProspects(value[0])}>{value[1].stock_to_sale ? value[1].stock_to_sale : "-"}</span>
                                            </div>
                                            {/* <div className="mobile-table-footer text-right">
                                                <label onClick={() => handleSorting("email_status")}>Email Status</label>
                                                <span>{value[1].email_status ? value[1].email_status : "-"}</span>
                                            </div> */}
                                        </div>
                                    )
                                })
                            ) : ("")
                                )
                                :
                                prospectList && prospectList.length > 0 ? (
                                    prospectList.map((value, index) => {
                                        return (
                                            <div className="mobile-table-list" key={index}>
                                                <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                    <div className="th">
                                                        <label onClick={() => handleSorting("firstname")}>First Name </label>
                                                        <span onClick={() => handleProspects(value[0])}>{value[1].first_name ? value[1].first_name: ""}</span>
                                                    </div>
                                                    <div className="th">
                                                        <label onClick={() => handleSorting("lastname")}>Last Name </label>
                                                        <span  onClick={() => handleProspects(value[0])}>{value[1].last_name ? value[1].last_name: ""}</span>
                                                    </div>
                                                </div>
                                                <div className="mobile-table-td">
                                                    <div className="mobile-table-td-row">
                                                        <div className="td-list d-flex justify-content-between">
                                                            <div className="td">
                                                                <label onClick={() => handleSorting("created_date")}>Created Date</label>
                                                                <span onClick={() => handleProspects(value[0])}><strong>{value[1].created_date ? value[1].created_date : "-"}</strong></span>
                                                            </div>
                                                            <div className="product-td d-flex">
                                                                <div className="product-td-name">
                                                                    <label onClick={() => handleSorting("last_contacted")}>Last Contacted</label>
                                                                    <h6 onClick={() => handleProspects(value[0])}>{value[1].last_contacted ? value[1].last_contacted : "-"}</h6> 
                                                                </div>
                                                            </div>
                                                            <div className="td">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("contact_type")}>Contact Type</label>
                                                                    <span onClick={() => handleProspects(value[0])}>{value[1].contact_type ? value[1].contact_type : "-"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={() => handleSorting("prospect_source")}>Prospect Source</label>
                                                    {
                                                        showEdit === index ?  
                                                        (
                                                            <span>
                                                                <form onSubmit={(e) => handleEditSource(e, value[0])}>
                                                                    <div className="dropUp">
                                                                        <div className="custom-select-wrapper d-flex align-items-center">
                                                                            <div className={isSourceDropDownOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                                <div className="custom-select__trigger" onClick={()=>setIsSourceDropDownOpen(!isSourceDropDownOpen)}><span>{sourceDropDown}</span>
                                                                                    <div className="arrow">
                                                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                        </svg>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="custom-options">
                                                                                    <span className={sourceDropDown === "Hot" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setSourceDropDown("Hot"); setSource("Hot"); setIsSourceDropDownOpen(false)}}>Hot</span>
                                                                                    <span className={sourceDropDown === "Cold" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setSourceDropDown("Cold"); setSource("Cold"); setIsSourceDropDownOpen(false)}}>Cold</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <input type="submit" className="save-btn" value="save"></input>
                                                                    <input type="button" className="close-btn" value="x" onClick={()=>setShowEdit('')}></input>
                                                                </form>
                                                            </span>)
                                                            :
                                                            (
                                                                value[1].prospect_source ? (<span onClick={() => handleProspects(value[0])}>{value[1].prospect_source} 
                                                                    {/* <img onClick={() =>{setShowEdit(index);}}src={EditIcon} alt="edit-icon"></img> */}
                                                                </span>
                                                            ) : (
                                                                <span>-
                                                                    {/* <img onClick={() =>{setShowEdit(index);}}src={EditIcon} alt="edit-icon"></img> */}
                                                                </span>
                                                            )
                                                        )
                                                    }
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={() => handleSorting("prospect_status")}>Prospect Status</label>
                                                        {
                                                            showEditStatus === index ?  
                                                            (
                                                                <span>
                                                                    <form onSubmit={(e) => handleEditStatus(e, value[0])}>
                                                                    <div className="dropUp">
                                                                        <div className="custom-select-wrapper d-flex align-items-center">
                                                                            <div className={isStatusDropDownOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                                <div className="custom-select__trigger" onClick={()=>setIsStatusDropDownOpen(!isStatusDropDownOpen)}><span>{statusDropdown}</span>
                                                                                    <div className="arrow">
                                                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                        </svg>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="custom-options">
                                                                                    {statusList && statusList.length >0 ? (
                                                                                        statusList.map((value, index) => {
                                                                                            return(
                                                                                                <span key={index} className={statusDropdown === value ? "custom-option selected":"custom-option"} onClick={() => { setStatusDropdown(value); setStatus(value); setIsStatusOpen(false)}}>{value}</span>
                                                                                            )
                                                                                        })
                                                                                    ):""}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <input type="submit" className="save-btn" value="save"></input>
                                                                    <input type="button" className="close-btn" value="x" onClick={()=>setShowEditStatus('')}></input>
                                                                    </form>
                                                                </span>)
                                                                :
                                                                (
                                                                    value[1].prospect_status ? (<span>{value[1].prospect_status} <img onClick={() =>{setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img></span>
                                                                ) : (<span>-
                                                                        <img onClick={() =>{setShowEditStatus(index); }}src={EditIcon} alt="edit-icon"></img>
                                                                    </span>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={() => handleSorting("location")}>Location</label>
                                                    <span onClick={() => handleProspects(value[0])}>{value[1].location ? value[1].location : "-"}</span>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={() => handleSorting("follow_date")}>Followup Date</label>
                                                    <span onClick={() => handleProspects(value[0])}>{value[1].follow_date ? value[1].follow_date : "-"}</span>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={() => handleSorting("proposal_date")}>Proposal Date</label>
                                                    <span onClick={() => handleProspects(value[0])}>{value[1].proposal_date ? value[1].proposal_date : "-"}</span>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={() => handleSorting("proposal_sent")}>Proposal Sent</label>
                                                    <span onClick={() => handleProspects(value[0])}>{value[1].proposal_sent ? value[1].proposal_sent : "-"}</span>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={() => handleSorting("stock_to_sale")}>Stock to Sale</label>
                                                    <span onClick={() => handleProspects(value[0])}>{value[1].stock_to_sale ? value[1].stock_to_sale : "-"}</span>
                                                </div>
                                                {/* <div className="mobile-table-footer text-right">
                                                    <label onClick={() => handleSorting("email_status")}>Email Status</label>
                                                    <span>{value[1].email_status ? value[1].email_status : "-"}</span>
                                                </div> */}
                                            </div>
                                        )
                                    })
                                ) : ("")
                            }
                            {
                                loadingData ? (
                                    <div className="mobile-table-list text-center">
                                        Loading...
                                    </div>
                                ) :
                                ("")
                            }
                            {
                                prospectList && prospectList.length===0 && loadingData===false && !search? (
                                    <div className="mobile-table-list text-center">
                                        No Prospects Found!
                                    </div>
                                ) :
                                ("")
                            }
                            {
                                search ? (allProspectList ? (allProspectList.filter((data) => {
                                if(
                                    data[1].first_name && data[1].first_name.toLowerCase().includes(search.toLowerCase())||
                                    data[1].last_name && data[1].last_name.toLowerCase().includes(search.toLowerCase()) 
                                    // ||
                                    // data[1].phone && data[1].phone.toLowerCase().includes(search.toLowerCase()) ||
                                    // data[1].email && data[1].email.toLowerCase().includes(search.toLowerCase())
                                ) {
                                    return data;
                                }
                                }).length>0) ? "":
                                (<div className="mobile-table-list text-center">
                                    No Data Found! 
                                </div>):"") : ("")
                            }
                    </div>
                </div>
                {
                        search ? "" : 
                        (
                            <div className="customer-table-pagination d-none d-md-block">
                                <div className="table-pagination-row d-flex justify-content-between">
                                    <div className="table-prev">
                                        <Button
                                                className="btn-next-prev"
                                                variant="link"
                                                onClick={()=>handleNavigation('prev')}
                                                disabled={loadingData || initialPage===0}>{'< PREV'}
                                        </Button>
                                    </div>
                                    <div className="table-pagination-number">
                                        {
                                            new Array(pageNumber).fill("").map((val,index) => {
                                                    return(
                                                        <Button key={index}
                                                            className={(index+1)===currentPage ? "btn-number active":"btn-number" } variant="link"
                                                            onClick = {()=> setCurrentPage(index + 1)}
                                                            disabled={loadingData}>
                                                            {index + 1}
                                                        </Button>
                                                    )
                                            }).slice(initialPage,lastPage)
                                        }
                                    </div>
                                    <div className="table-prev">
                                        <Button
                                            className="btn-next-prev"
                                            variant="link"
                                            onClick={()=>handleNavigation('next')}
                                            disabled={loadingData || pageNumber<=lastPage}>{"NEXT >"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {
                        search || (!search && pageNumber.length==0)? "" : 
                        (
                            <div className="customer-table-pagination d-block d-md-none">
                                <div className="table-pagination-row d-flex justify-content-between">
                                    <div className="table-prev">
                                        <Button
                                                className="btn-next-prev"
                                                variant="link"
                                                onClick={()=>handleMobNavigation('prev')}
                                                disabled={loadingData || initialPage===0}>{'< PREV'}
                                        </Button>
                                    </div>
                                    <div className="table-pagination-number">
                                        {
                                            new Array(pageNumber).fill("").map((val,index) => {
                                                    return(
                                                        <Button key={index}
                                                            className={(index+1)===currentPage ? "btn-number active":"btn-number" } variant="link"
                                                            onClick = {()=> setCurrentPage(index + 1)}
                                                            disabled={loadingData}>
                                                            {index + 1}
                                                        </Button>
                                                    )
                                            }).slice(initialPage,lastPage)
                                        }
                                    </div>
                                    <div className="table-prev">
                                        <Button
                                            className="btn-next-prev"
                                            variant="link"
                                            onClick={()=>handleMobNavigation('next')}
                                            disabled={loadingData || pageNumber<=lastPage}>{"NEXT >"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
            </div>
        </div>
            <Modal show={prospectInfoModal}
                       onHide={() => {setProspectInfoModal(false); setShowBtn(false); setError(""); setSuccess("");}} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>ADD PROSPECT DETAILS</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={(e) => handleAddUser(e,"Prospect")}>
                        <Modal.Body>
                            <div className="change-address-body">
                            <div className="change-address-wrapper">
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Prospect Name:</label>
                                        <input type="text" className="text-input" value = {firstName?firstName:""} onChange = {(e) => {setError("");setSuccess(""); setFirstName(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Email:</label>
                                        <input type="email" className="text-input" value = {email?email:""} onChange = {(e) => {setError("");setSuccess(""); setEmail(e.target.value)}}></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Phone Area Code:</label> 
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isAreaCodeOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>setIsAreaCodeOpen(!isAreaCodeOpen)}><span>{areaCode}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                    {
                                                        phoneCodeList.map((value, index) => {
                                                            return(
                                                                <span key={index} className={areaCode === value.split('(').pop().split(')')[0] ? "custom-option selected":"custom-option"} 
                                                                    onClick={() => { setAreaCode(value.split('(').pop().split(')')[0]);setIsAreaCodeOpen(false)}}
                                                                    >{value}
                                                                </span>
                                                            )
                                                        })
                                                    }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Phone:</label>
                                        <input type="text" className="text-input" value = {phone?phone:""} onChange = {(e) => {setError("");setSuccess("");setPhone(e.target.value)}}></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Status:</label>
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isStatusDropDownOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>setIsStatusDropDownOpen(!isStatusDropDownOpen)}><span>{statusDropdown}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                    {statusList && statusList.length >0 ? (
                                                        statusList.map((value, index) => {
                                                            return(
                                                                <span key={index} className={statusDropdown === value ? "custom-option selected":"custom-option"} onClick={() => { setStatus(value); setStatusDropdown(value); setIsStatusDropDownOpen(false)}}>{value}</span>
                                                            )
                                                        })
                                                    ):""}
                                                        {/* <span className={sourceDropDown === "Cold Leads" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setSource("Cold Leads"); setSourceDropDown("Cold Leads"); setIsSourceDropDownOpen(false)}}>Cold Leads</span> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Store Region:</label>
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isRegionOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>setIsRegionOpen(!isRegionOpen)}><span>{region}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            locationList && locationList.length>0 ? (
                                                                locationList.map((value, index) => {
                                                                    return(
                                                                        <span className={region === value ? "custom-option selected":"custom-option"} onClick={() => { setRegion(value); setIsRegionOpen(false)}}>{value}</span>                
                                                                    )
                                                                })
                                                            ): ""
                                                    }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Source:</label>
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isSourceDropDownOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>setIsSourceDropDownOpen(!isSourceDropDownOpen)}><span>{sourceDropDown}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            sourceList && sourceList.length>0 ? (
                                                                sourceList.map((value, index) => {
                                                                    return(
                                                                        <span className={sourceDropDown === value ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setSource(value); setSourceDropDown(value); setIsSourceDropDownOpen(false)}}>{value}</span>
                                                                    )
                                                                })
                                                            ) :""
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label></label>
                                        <span className="error-text">{error}</span>
                                        <span className="success-text">{success}</span>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            {
                                showBtn ? (
                                    <input type="button" value="View Prospect" className="save-btn" 
                                        onClick={() => handleViewBtn()
                                    }/>
                                ) : (
                                    <input type="submit" value="Save" className="save-btn" />
                                )
                            }
                        </Modal.Footer>
                    </form>
            </Modal>
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage}/>              
        </div>
    )
}
export default Prospects;
