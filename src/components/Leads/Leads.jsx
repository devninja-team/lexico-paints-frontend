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
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import SearchIcon from '../../assets/images/search-icon.svg';
import EditIcon from '../../assets/images/edit-icon.svg';
import OrderByIcon from '../../assets/images/orderby-arrow.png';
import SessionModal from '../Modals/SessionModal';
import Modal from 'react-bootstrap/Modal';
import {leadsStatusList, locationList, phoneCodeList} from "../../utils/drop-down-list";
    
const Leads = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const query = useSelector(state => state.userRegion);

    const[showPerPage,setshowPerPage] = useState('25');
    const[isViewOpen,setIsViewOpen] = useState(false);
    const [transactionList, setTransactionList] = useState();
    const [allTransactionList, setAllTransactionList] = useState();
    const [globalTransactionList, setGlobalTransactionList] = useState();
    const [filteredTransactionList, setFilteredTransactionList] = useState();
    const [allFilteredTransactionList, setAllFilteredTransactionList] = useState();
    const [leadId, setLeadId] = useState("");

    //edit fields
    const [editFieldSource, setEditFieldSource] = useState();
    const [source, setSource] = useState("CAP");
    const [status, setStatus] = useState("Hot");

    const [leadList, setLeadList] = useState();
    const [allLeadList, setAllLeadList] = useState();

    //asc-desc flag
    const [order, setOrder] = useState('desc');

    //search var
    const [search, setSearch] = useState();
    const [openSearch, setOpenSearch] = useState(false);

    //custom pagination vars
    const [currentPage,setCurrentPage] = useState(1);
    const [postsPerPage,setPostsPerPage] = useState(25);
    const [pageNumber,setPageNumber] = useState([]);
    const [indexOfAllFirstPage,setIndexOfFirstPage] = useState();
    const [indexOfAllLastPage,setIndexOfLastPage] = useState();
    const [loadingData,setLoadingData] = useState(false);
    const [initialPage,setInitialPage] = useState(0);
    const [lastPage,setLastPage] = useState(10);

    //dropdown vars
    const [isAreaCodeOpen, setIsAreaCodeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isRegionOpen, setIsRegionOpen] = useState(false);

    const [statusDropdown, setStatusDropDown] = useState("Hot");
    const [sourceDropDown, setSourceDropDown] = useState("CAP");

    const [isSourceDropDownOpen, setIsSourceDropDownOpen] = useState(false);
    const [isStatusDropDownOpen, setIsStatusDropDownOpen] = useState(false);

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

    //filter vars

    const [isSourceOpen, setIsSourceOpen] = useState(false);

    const [durationBtnValue, setDurationBtnValue] = useState("");
    const [sourceBtnValue, setSourceBtnValue] = useState("");
    const [statusBtnValue, setStatusBtnValue] = useState("");


    //modal vars
    const[error,setError] = useState('');
    const [success, setSuccess] = useState("");
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const[leadInfoModal,setLeadInfoModal] = useState(false);

    //edit/save vars
    const [showEdit, setShowEdit] = useState();
    const [showEditStatus, setShowEditStatus] = useState();

    //sorting vars
    const[sortOrder,setSortOrder] = useState('asc');

    //day filters
    const [durationLastContacted, setDurationLastContacted] = useState('');
    const [durationSource, setDurationSource] = useState('');
    const [durationStatus, setDurationStatus] = useState('');

    //filters vars
    const [isSourceFilterOpen, setIsSourceFilterOpen] = useState(false);
    const [sourceFilterDropDownValue, setSourceFilterDropDownValue] = useState("");

    //btn show/hide
    const [showBtn, setShowBtn] = useState(false);

    //source-dropdown list
    const [sourceList, setSourceList] = useState();
    
    useEffect(() => {
        dispatch(setInvoiceData({data:""}));
        fetchLeads();
    },[]);

    useEffect(() => {
        if(allLeadList && allLeadList.length > 0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            
            setLeadList(allLeadList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allLeadList.length/postsPerPage);i++) {
                setPageNumber(...[i])
            }
        }
    },[currentPage,postsPerPage]);
    
    const fetchLeads = () => {
        if(window.screen.width<=480) {
            setLastPage(5);
        }
        setLoadingData(true);
        axios
        .post("/accounts/leads"+query).then((res) => {
            // console.log(res.data);
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            let arrayLeadList = [];
            if(res.data.leads) {
                Object.entries(res.data.leads).map((value)=>{
                    arrayLeadList.push(value);
                });

                setAllLeadList(arrayLeadList);
                setLeadList(arrayLeadList.slice(indexOfFirstPage,indexOfLastPost));
                setLoadingData(false);
                for(let i=1; i<=Math.ceil(arrayLeadList.length/postsPerPage);i++) {
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
    const handleLeads = (id) => {
        localStorage.setItem('customer_id',id);
        localStorage.setItem('customer_type','Lead');
        migrateDataToRedux();
        history.push('/accountinfo/communication');
    }
    const handleEditSource = (e, id) => {
        e.preventDefault();
        if(source) {
            axios
        .post("/accounts/change"+query, {
            customer_id:id,
            field:"source",
            value: source
        }).then((res) => {
            // console.log("res.data",res.data)
            if(res.data.message === "prospect/customer updated") {
                setShowEdit("");
                setLeadList([]);
                setAllLeadList([]);
                setLoadingData(true);
                fetchLeads();
                setDurationBtnValue("");
                setSourceBtnValue("");
                setStatusBtnValue("");
            }
        })
        .catch((error) => {
            console.log(error);
            // dispatch(setSession());
        })
        setShowEdit('');
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
                setLeadList([]);
                setAllLeadList([]);
                setLoadingData(true);
                fetchLeads();
                setDurationBtnValue("");
                setSourceBtnValue("");
                setStatusBtnValue("");
            }
        })
        .catch((error) => {
            console.log(error);
            // dispatch(setSession());
        })
        setShowEditStatus('');
        }
    }
    const handleAddUser = (e,type) => {
        setError('');
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
                if(res.data.message === "lead/prospect added") {
                    setLeadId(res.data.customer_id);
                    setSuccess("Lead Added Successfully!");
                    setShowBtn(true);
                    setLeadList([]);
                    fetchLeads();
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
    const paginate = () => {
        if(allLeadList && allLeadList.length>0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            
            setLeadList(allLeadList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allLeadList.length/postsPerPage);i++) {
                setPageNumber(...[i])
            }
            
        }
    }
    const handleSorting = (field) => {
        if(leadList && leadList.length>0) {
            let sortedArray=[];
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
                                sortedArray = allLeadList.sort( function(a, b) {
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
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].last_name?a[1].last_name.toLowerCase():""
                                    var nameB=b[1].last_name?b[1].last_name.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "lead_source" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].lead_source ? a[1].lead_source.toLowerCase() : ""
                                    var nameB=b[1].lead_source ? b[1].lead_source.toLowerCase() : ""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "lead_status" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].lead_status? a[1].lead_status.toLowerCase() : ""
                                    var nameB=b[1].lead_status ? b[1].lead_status.toLowerCase() :""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "campaign" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].campaign?a[1].campaign.toLowerCase():""
                                    var nameB=b[1].campaign?b[1].campaign.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "created_date" :
                                sortedArray = allLeadList.sort( 
                                    (a, b) => new Date (a[1].created_date) - new Date(b[1].created_date)
                                );
                            break;

                            case "last_contacted" :
                                sortedArray = allLeadList.sort(
                                    (a, b) => new Date (a[1].last_contacted) - new Date(b[1].last_contacted)
                                );
                            break;

                            case "contact_type" :
                                sortedArray = allLeadList.sort( function(a, b) {
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
                                sortedArray = allLeadList.sort( function(a, b) {
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
                                sortedArray = allLeadList.sort(
                                    (a, b) => new Date (a[1].follow_date) - new Date(b[1].follow_date)
                                );
                            break;
    
                            default:console.log("check sorting Label 1"); break;
                        }
                        setAllLeadList([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "firstname" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].first_name?a[1].first_name.toLowerCase():"", nameB=b[1].first_name?b[1].first_name.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "lastname" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].last_name?a[1].last_name.toLowerCase():"", nameB=b[1].last_name?b[1].last_name.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "lead_source" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].lead_source ? a[1].lead_source.toLowerCase():"", nameB=b[1].lead_source ? b[1].lead_source.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            
                            case "lead_status" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].lead_status?a[1].lead_status.toLowerCase():"", nameB=b[1].lead_status?b[1].lead_status.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "campaign" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].campaign?a[1].campaign.toLowerCase():"", nameB=b[1].campaign?b[1].campaign.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "created_date" :
                                sortedArray = allLeadList.sort(
                                    (a, b) => new Date (b[1].created_date) - new Date(a[1].created_date)
                                );
                            break;

                            case "last_contacted" :
                                sortedArray = allLeadList.sort(
                                    (a, b) => new Date(b[1].last_contacted) - new Date(a[1].last_contacted)
                                );
                            break;

                            case "contact_type" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].contact_type?a[1].contact_type.toLowerCase():"", nameB=b[1].contact_type?b[1].contact_type.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "location" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].location?a[1].location.toLowerCase():"", nameB=b[1].location?b[1].location.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "follow_date" :
                                sortedArray = allLeadList.sort(
                                    (a, b) => new Date(b[1].follow_date) - new Date(a[1].follow_date)
                                );
                            break;
    
    
                            default:console.log("check sorting Label 2"); break;
                        }
                        setAllLeadList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }else {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "firstname" :
                                sortedArray = allLeadList.sort( function(a, b) {
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
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].last_name?a[1].last_name.toLowerCase():""
                                    var nameB=b[1].last_name?b[1].last_name.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "lead_source" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].lead_source?a[1].lead_source.toLowerCase():""
                                    var nameB=b[1].lead_source?b[1].lead_source.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "lead_status" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].lead_status?a[1].lead_status.toLowerCase():""
                                    var nameB=b[1].lead_status?b[1].lead_status.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "campaign" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].campaign?a[1].campaign.toLowerCase():""
                                    var nameB=b[1].campaign?b[1].campaign.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "created_date" :
                                sortedArray = allLeadList.sort( 
                                    (a, b) => new Date (a[1].created_date) - new Date(b[1].created_date)
                                );
                            break;

                            case "last_contacted" :
                                sortedArray = allLeadList.sort(
                                    (a, b) => new Date (a[1].last_contacted) - new Date(b[1].last_contacted)
                                );
                            break;

                            case "contact_type" :
                                sortedArray = allLeadList.sort( function(a, b) {
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
                                sortedArray = allLeadList.sort( function(a, b) {
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
                                sortedArray = allLeadList.sort(
                                    (a, b) => new Date (a[1].follow_date) - new Date(b[1].follow_date)
                                );
                            break;
    
                            default:console.log("check sorting Label 1"); break;
                        }
                        // console.log("sorted array",[...sortedArray])
                        // setLeadList([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "firstname" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].first_name?a[1].first_name.toLowerCase():"", nameB=b[1].first_name?b[1].first_name.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "lastname" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].last_name?a[1].last_name.toLowerCase():"", nameB=b[1].last_name?b[1].last_name.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "lead_source" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].lead_source?a[1].lead_source.toLowerCase():"", nameB=b[1].lead_source?b[1].lead_source.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            
                            case "lead_status" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].lead_status?a[1].lead_status.toLowerCase():"", nameB=b[1].lead_status?b[1].lead_status.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "campaign" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].campaign?a[1].campaign.toLowerCase():"", nameB=b[1].campaign?b[1].campaign.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "created_date" :
                                sortedArray = allLeadList.sort(
                                    (a, b) => new Date (b[1].created_date) - new Date(a[1].created_date)
                                );
                            break;

                            case "last_contacted" :
                                sortedArray = allLeadList.sort(
                                    (a, b) => new Date(b[1].last_contacted) - new Date(a[1].last_contacted)
                                );
                            break;

                            case "contact_type" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].contact_type?a[1].contact_type.toLowerCase():"", nameB=b[1].contact_type?b[1].contact_type.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "location" :
                                sortedArray = allLeadList.sort( function(a, b) {
                                    var nameA=a[1].location?a[1].location.toLowerCase():"", nameB=b[1].location?b[1].location.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "follow_date" :
                                sortedArray = allLeadList.sort(
                                    (a, b) => new Date(b[1].follow_date) - new Date(a[1].follow_date)
                                );
                            break;
    
    
                            default:console.log("check sorting Label 2"); break;
                        }
                        // setLeadList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
                paginate();
            }
        }
    }
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

    const handleViewBtn = () => {
        localStorage.setItem("customer_id",leadId);
        localStorage.setItem("customer_type","Lead");
        history.push("/accountinfo/communication");
    }
    const fetchFromFilterAPI = (range,source,status) => {
        setLoadingData(true);
        setInitialPage(0);
        setCurrentPage(1);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        axios
        .post("/accounts/leads"+query, {
            range,
            source,
            status
        }).then((res) => {
            var indexOfLastPost = 1 * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            let arrayLeadList = [];
            if(res.data.leads) {
                Object.entries(res.data.leads).map((value)=>{
                    arrayLeadList.push(value);
                });

                setAllLeadList(arrayLeadList);
                setLeadList(arrayLeadList.slice(indexOfFirstPage,indexOfLastPost));
                setLoadingData(false);
                for(let i=1; i<=Math.ceil(arrayLeadList.length/postsPerPage);i++) {
                    setPageNumber(...[i])
                }
            }
        })
        .catch((error) => {
            console.log(error);
            // dispatch(setSession());
        })
    }
    const handleFilters = (value, type) => {
        setAllLeadList([]);
        setLeadList([]);
        setInitialPage(0);
        setCurrentPage(1);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        if(type==="day-filter") {
            fetchFromFilterAPI(value, sourceDropDown, statusBtnValue);
        } else if(type==="source-filter") {
            fetchFromFilterAPI(durationBtnValue, value, statusBtnValue);
        } else if(type==="status-filter") {
            fetchFromFilterAPI(durationBtnValue, sourceDropDown, value);
        }
    }
    const migrateDataToRedux = (data) => {
        dispatch(setGlobalData({data:allLeadList}));
    }
    
    return (
        <div className="transaction-page">
            <div className="customers-content">
                <div className="top-head d-flex align-items-end">
                    <div className="title d-flex justify-content-start align-items-center">
                        <h1 className="mb-0">Leads</h1>
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
                            <Button className='btn-filter'  variant="outline-primary" onClick={()=>setLeadInfoModal(true)}>
                                ADD LEAD
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
                            <div className="custom-select__trigger" onClick={()=>setIsViewOpen(!isViewOpen)}><span>{showPerPage===9999 ? "ALL" : showPerPage}</span>
                                <div className="arrow">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="custom-options">
                                <span className={showPerPage === 5 ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setshowPerPage(5); setPostsPerPage(5); setCurrentPage(1); setIsViewOpen(false)}}>5</span>
                                <span className={showPerPage === 25 ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setshowPerPage(25); setPostsPerPage(25); setCurrentPage(1); setIsViewOpen(false)}}>25</span>
                                <span className={showPerPage === 50 ? "custom-option selected":"custom-option"} data-value="volvo" onClick={() => { setshowPerPage(50); setPostsPerPage(50); setCurrentPage(1); setIsViewOpen(false)}}>50</span>
                                <span className={showPerPage === 9999 ? "custom-option selected":"custom-option"} data-value="mercedes" onClick={() => { setshowPerPage(9999); setPostsPerPage(9999); setCurrentPage(1); setIsViewOpen(false)}}>ALL</span>
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
            
            {/* <div className="customer-data-head-filter d-flex align-items-center justify-content-end border-bottom-0 mb-2">
                <div className="customer-title">
                    Source :
                </div>
                <div className="data-filter">
                    <ul>
                        <li>
                            <Button className={sourceBtnValue==="" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setSourceBtnValue("");handleFilters("","source-filter")}}>ALL</Button>
                        </li>
                        <li>
                            <Button className={sourceBtnValue==="Hot" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setSourceBtnValue("Hot");handleFilters("Hot","source-filter")}} >Hot</Button>
                        </li>
                        <li>
                            <Button className={sourceBtnValue==="Cold" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setSourceBtnValue("Cold");handleFilters("Cold","source-filter")}} >Cold</Button>
                        </li>
                    </ul>
                </div>
            </div> */}
            
            <div className="all-customer-wrapper">
                <div className="all-customer-data">
                    <div className="all-customer-data-head py-3 pl-3 pr-4">
                        <div className="customer-data-head-filter d-flex justify-content-end align-items-center mb-2">
                            <div className="customer-title">
                                Last Contacted :
                            </div>
                            <div className="data-filter">
                                <ul>
                                    <li>
                                        <Button className={durationBtnValue==="" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setDurationBtnValue(""); handleFilters("","day-filter")}}>ALL</Button>
                                    </li>
                                    <li>
                                        <Button className={durationBtnValue==="30days" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setDurationBtnValue("30days");handleFilters("30days","day-filter")}} >LAST 30 DAYS</Button>
                                    </li>
                                    <li>
                                        <Button className={durationBtnValue==="30_90_days" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setDurationBtnValue("30_90_days");handleFilters("30_90_days","day-filter")}}>30-90 DAYS</Button>
                                    </li>

                                    <li>
                                        <Button className={durationBtnValue==="3_6_months" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setDurationBtnValue("3_6_months");handleFilters("3_6_months","day-filter")}}>3-6 MONTHS</Button>
                                    </li>
                                    <li>
                                        <Button className={durationBtnValue==="6_12_months" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setDurationBtnValue("6_12_months");handleFilters("6_12_months","day-filter")}}>6-12 MONTHS</Button>
                                    </li>
                                    <li>
                                        <Button className={durationBtnValue==="more_than_1_year" ? 'btn-filter active' : 'btn-filter'}o nClick={() => {setDurationBtnValue("more_than_1_year");handleFilters("more_than_1_year","day-filter")}}>LONGER THAN 1 YEAR</Button>
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
                                        leadsStatusList && leadsStatusList.length>0 ? (
                                            leadsStatusList.map((value, index) => {
                                                return (
                                                    <li>
                                                        <Button className={statusBtnValue===value ? 'btn-filter active' : 'btn-filter'} onClick={() => {setStatusBtnValue(value);handleFilters(value,"status-filter")}} >{value}</Button>
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
                                                                <span key={index} className={sourceFilterDropDownValue === value ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setSourceFilterDropDownValue(value); handleFilters(value,"source-filter"); setIsSourceFilterOpen(false)}}>{value}</span>        
                                                            )
                                                        })
                                                    ) :("")
                                                }
                                                <span className={sourceFilterDropDownValue === "" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setSourceFilterDropDownValue(""); handleFilters("","source-filter"); setIsSourceFilterOpen(false)}}>{"ALL"}</span>
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
                                <th className="cursor-pointer" onClick={() => handleSorting("lead_source")}>Lead Source</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("lead_status")}>Lead Status</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("campaign")}>Campaign</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("created_date")}>Created Date</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("last_contacted")}>Last Contacted</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("contact_type")}>Contact Type</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("location")}>Location</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("follow_date")}>Followup Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                    search ? (
                                        allLeadList && allLeadList.length > 0 ? (
                                            allLeadList.filter((data) => {
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
                                                        <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].first_name ? value[1].first_name : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].last_name ? value[1].last_name : "-"}</td>
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
                                                                    value[1].lead_source ? (<td className="cursor-pointer" onClick={() => handleLeads(value[0])}><span>{value[1].lead_source}
                                                                    {/* <img onClick={() => {setShowEdit(index); }}src={EditIcon} alt="edit-icon"></img> */}
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
                                                                                        {leadsStatusList && leadsStatusList.length >0 ? (
                                                                                            leadsStatusList.map((value, index) => {
                                                                                                return(
                                                                                                    <span key={index} className={statusDropdown === value ? "custom-option selected":"custom-option"} onClick={() => { setStatusDropDown(value); setStatus(value); setIsStatusOpen(false)}}>{value}</span>
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
                                                                    value[1].lead_status ? (<td><span>{value[1].lead_status}<img onClick={() => {setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img></span></td>
                                                                ) : (
                                                                <td>
                                                                    <span>-
                                                                        <img onClick={() => {setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img>
                                                                    </span>
                                                                </td>
                                                                )
                                                            )
                                                        }
                                                        <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].campaign ? value[1].campaign : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].created_date ? value[1].created_date : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].last_contacted ? value[1].last_contacted : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].contact_type ? value[1].contact_type : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].location ? value[1].location : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].follow_date ? value[1].follow_date : "-"}</td>
                                                    </tr>
                                                )
                                            })
                                        ) : ("")
                                    )
                                    :
                                    leadList && leadList.length > 0 ? (
                                        leadList.map((value, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].first_name ? value[1].first_name : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].last_name ? value[1].last_name : "-"}</td>
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
                                                                value[1].lead_source ? (<td className="cursor-pointer" onClick={() => handleLeads(value[0])}><span>{value[1].lead_source}
                                                                {/* <img onClick={() => {setShowEdit(index); }}src={EditIcon} alt="edit-icon"></img> */}
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
                                                                                    {leadsStatusList && leadsStatusList.length >0 ? (
                                                                                        leadsStatusList.map((value, index) => {
                                                                                            return(
                                                                                                <span key={index} className={statusDropdown === value ? "custom-option selected":"custom-option"} onClick={() => { setStatusDropDown(value); setStatus(value); setIsStatusOpen(false)}}>{value}</span>
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
                                                                value[1].lead_status ? (<td><span>{value[1].lead_status}<img onClick={() => {setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img></span></td>
                                                            ) : (
                                                            <td>
                                                                <span>-
                                                                    <img onClick={() => {setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img>
                                                                </span>
                                                            </td>
                                                            )
                                                        )
                                                    }
                                                    <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].campaign ? value[1].campaign : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].created_date ? value[1].created_date : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].last_contacted ? value[1].last_contacted : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].contact_type ? value[1].contact_type : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].location ? value[1].location : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].follow_date ? value[1].follow_date : "-"}</td>
                                                </tr>
                                            )
                                        })
                                    ) : ("")
                                }
                                {
                                    loadingData ? (
                                        <tr>
                                            <td colSpan="10" className="text-center">Loading...</td>
                                        </tr>
                                    ) :
                                    ("")
                                }
                                {
                                    leadList && leadList.length===0 && loadingData===false && !search? (
                                        <tr>
                                            <td colSpan="10" className="text-center">No Leads found!</td>
                                        </tr>
                                    ) :
                                    ("")
                                }
                                {
                                    search ? (allLeadList ? (allLeadList.filter((data) => {
                                    if(
                                        data[1].first_name && data[1].first_name.toLowerCase().includes(search.toLowerCase())||
                                        data[1].last_name && data[1].last_name.toLowerCase().includes(search.toLowerCase()) 
                                    ) {
                                        return data;
                                    }
                                    }).length>0) ? "":
                                    (<tr>
                                        <td colSpan="10" className="text-center">No Data Found!</td>
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
                                allLeadList && allLeadList.length > 0 ? (
                                    allLeadList.filter((data) => {
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
                                                        <span onClick={() => handleLeads(value[0])}>{value[1].first_name ? value[1].first_name: ""}</span>
                                                    </div>
                                                    <div className="th">
                                                        <label onClick={() => handleSorting("lastname")}>Last Name </label>
                                                        <span className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].last_name ? value[1].last_name: ""}</span>
                                                    </div>
                                                </div>
                                                <div className="mobile-table-td">
                                                    <div className="mobile-table-td-row">
                                                        <div className="td-list d-flex justify-content-between">
                                                            <div className="td">
                                                                <label onClick={() => handleSorting("created_date")}>Created Date</label>
                                                                <span className="cursor-pointer" onClick={() => handleLeads(value[0])}><strong>{value[1].created_date ? value[1].created_date : "-"}</strong></span>
                                                            </div>
                                                            <div className="product-td d-flex">
                                                                <div className="product-td-name">
                                                                    <label onClick={() => handleSorting("last_contacted")}>Last Contacted</label>
                                                                    <h6 className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].last_contacted ? value[1].last_contacted : "-"}</h6> 
                                                                </div>
                                                            </div>
                                                            <div className="td">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("contact_type")}>Contact Type</label>
                                                                    <span className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].contact_type ? value[1].contact_type : "-"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={() => handleSorting("lead_source")}>Lead Source</label>
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
                                                                value[1].lead_source ? (<span className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].lead_source} 
                                                                    {/* <img onClick={() =>{setShowEdit(index);}}src={EditIcon} alt="edit-icon"></img> */}
                                                                </span>
                                                            ) : (<span className="cursor-pointer" onClick={() => handleLeads(value[0])}>-
                                                                    {/* <img onClick={() =>{setShowEdit(index);}}src={EditIcon} alt="edit-icon"></img> */}
                                                                </span>
                                                            )
                                                        )
                                                    }
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={() => handleSorting("lead_status")}>Lead Status</label>
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
                                                                                    {leadsStatusList && leadsStatusList.length >0 ? (
                                                                                        leadsStatusList.map((value, index) => {
                                                                                            return(
                                                                                                <span key={index} className={statusDropdown === value ? "custom-option selected":"custom-option"} onClick={() => { setStatusDropDown(value); setStatus(value); setIsStatusOpen(false)}}>{value}</span>
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
                                                                value[1].lead_status ? (<span>{value[1].lead_status} <img onClick={() =>{setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img></span>
                                                            ) : (<span>-
                                                                    <img onClick={() =>{setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img>
                                                                </span>
                                                            )
                                                        )
                                                    }
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={() => handleSorting("location")}>Location</label>
                                                    <span className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].location ? value[1].location : "-"}</span>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={() => handleSorting("campaign")}>Campaign</label>
                                                    <span className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].campaign ? value[1].campaign : "-"}</span>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={() => handleSorting("follow_date")}>Followup Date</label>
                                                    <span className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].follow_date ? value[1].follow_date : "-"}</span>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : ("")
                                    )
                                    :
                                    leadList && leadList.length > 0 ? (
                                        leadList.map((value, index) => {
                                            return (
                                                <div className="mobile-table-list" key={index}>
                                                    <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                        <div className="th">
                                                            <label onClick={() => handleSorting("firstname")}>First Name </label>
                                                            <span onClick={() => handleLeads(value[0])}>{value[1].first_name ? value[1].first_name: ""}</span>
                                                        </div>
                                                        <div className="th">
                                                            <label onClick={() => handleSorting("lastname")}>Last Name </label>
                                                            <span className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].last_name ? value[1].last_name: ""}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mobile-table-td">
                                                        <div className="mobile-table-td-row">
                                                            <div className="td-list d-flex justify-content-between">
                                                                <div className="td">
                                                                    <label onClick={() => handleSorting("created_date")}>Created Date</label>
                                                                    <span className="cursor-pointer" onClick={() => handleLeads(value[0])}><strong>{value[1].created_date ? value[1].created_date : "-"}</strong></span>
                                                                </div>
                                                                <div className="product-td d-flex">
                                                                    <div className="product-td-name">
                                                                        <label onClick={() => handleSorting("last_contacted")}>Last Contacted</label>
                                                                        <h6 className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].last_contacted ? value[1].last_contacted : "-"}</h6> 
                                                                    </div>
                                                                </div>
                                                                <div className="td">
                                                                    <div className="shipping-option">
                                                                        <label onClick={() => handleSorting("contact_type")}>Contact Type</label>
                                                                        <span className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].contact_type ? value[1].contact_type : "-"}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={() => handleSorting("lead_source")}>Lead Source</label>
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
                                                                    value[1].lead_source ? (<span className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].lead_source} 
                                                                    {/* <img onClick={() =>{setShowEdit(index); }}src={EditIcon} alt="edit-icon"></img> */}
                                                                    </span>
                                                                ) : (
                                                                    <span className="cursor-pointer" onClick={() => handleLeads(value[0])}>-
                                                                        {/* <img onClick={() =>{setShowEdit(index);}}src={EditIcon} alt="edit-icon"></img> */}
                                                                    </span>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={() => handleSorting("lead_status")}>Lead Status</label>
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
                                                                                        {leadsStatusList && leadsStatusList.length >0 ? (
                                                                                            leadsStatusList.map((value, index) => {
                                                                                                return(
                                                                                                    <span key={index} className={statusDropdown === value ? "custom-option selected":"custom-option"} onClick={() => { setStatusDropDown(value); setStatus(value); setIsStatusOpen(false)}}>{value}</span>
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
                                                                    value[1].lead_status ? (<span>{value[1].lead_status} <img onClick={() =>{setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img></span>
                                                                ) : (<span>-
                                                                        <img onClick={() =>{setShowEditStatus(index);}}src={EditIcon} alt="edit-icon"></img>
                                                                    </span>
                                                                )
                                                            )
                                                        }
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={() => handleSorting("location")}>Location</label>
                                                        <span  className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].location ? value[1].location : "-"}</span>
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={() => handleSorting("campaign")}>Campaign</label>
                                                        <span  className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].campaign ? value[1].campaign : "-"}</span>
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={() => handleSorting("follow_date")}>Followup Date</label>
                                                        <span  className="cursor-pointer" onClick={() => handleLeads(value[0])}>{value[1].follow_date ? value[1].follow_date : "-"}</span>
                                                    </div>
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
                                    leadList && leadList.length===0 && loadingData===false && !search? (
                                        <div className="mobile-table-list text-center">
                                           No Leads Found!
                                        </div>
                                    ) :
                                    ("")
                                }
                                {
                                    search ? (allLeadList ? (allLeadList.filter((data) => {
                                    if(
                                        data[1].first_name && data[1].first_name.toLowerCase().includes(search.toLowerCase())||
                                        data[1].last_name && data[1].last_name.toLowerCase().includes(search.toLowerCase()) 
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
            <Modal show={leadInfoModal}
                       onHide={() => {setLeadInfoModal(false);setShowBtn(false);}} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>ADD LEAD DETAILS</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={(e) => handleAddUser(e,"Lead")}>
                        <Modal.Body>
                            <div className="change-address-body">
                            <div className="change-address-wrapper">
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Lead Name:</label>
                                        <input type="text" className="text-input" value = {firstName?firstName:""} onChange = {(e) => {setError("");setSuccess("");setFirstName(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Email:</label>
                                        <input type="email" className="text-input" value = {email?email:""} onChange = {(e) => {setError("");setSuccess("");setEmail(e.target.value)}}></input>
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
                                                    {leadsStatusList && leadsStatusList.length >0 ? (
                                                        leadsStatusList.map((value, index) => {
                                                            return(
                                                                <span className={statusDropdown === value ? "custom-option selected":"custom-option"} onClick={() => { setStatusDropDown(value); setIsSourceDropDownOpen(false); setStatus(value)}}>{value}</span>
                                                            )
                                                        })
                                                    ):""}
                                                        {/* <span className={statusDropdown === "Cold Leads" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setSourceDropDown("Cold Leads"); setIsSourceDropDownOpen(false); setSource("Cold Leads")}}>Cold Leads</span> */}
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
                                                                        <span className={statusDropdown === value ? "custom-option selected":"custom-option"} onClick={() => { setStatusDropDown(value); setIsSourceDropDownOpen(false); setStatus(value)}}>{value}</span>
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
                                    <input type="button" value="View Lead" className="save-btn" 
                                    onClick={() => handleViewBtn()
                                }/>
                                ): (
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
export default Leads;
