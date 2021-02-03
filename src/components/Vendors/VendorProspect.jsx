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
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import SearchIcon from '../../assets/images/search-icon.svg';
import OrderByIcon from '../../assets/images/orderby-arrow.png';
import SessionModal from '../Modals/SessionModal';
import {phoneCodeList, locationList, currencyList } from "../../utils/drop-down-list";
    
const VendorProspect = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const[showPerPage,setshowPerPage] = useState('25');
    const[isViewOpen,setIsViewOpen] = useState(false);
    const [transactionList, setTransactionList] = useState();
    const [allTransactionList, setAllTransactionList] = useState();
    const [globalTransactionList, setGlobalTransactionList] = useState();
    const [filteredTransactionList, setFilteredTransactionList] = useState();
    const [allFilteredTransactionList, setAllFilteredTransactionList] = useState();

    //goto button
    const [showViewButton, setViewButton] = useState(false);

    const [vendorId, setVendorId] = useState();
    const query = useSelector(state => state.userRegion);

    const [vendorList, setVendorList] = useState();
    const [allVendorList, setAllVendorList] = useState();
    
    //edit fields
    const [editFieldSource, setEditFieldSource] = useState();
    const [source, setSource] = useState();
    const [status, setStatus] = useState();

    //asc-desc flag
    const [order, setOrder] = useState('desc');

    //search var
    const [search, setSearch] = useState();
    const [openSearch, setOpenSearch] = useState(false);

    //dropdown vars
    const [isAreaCodeOpen, setIsAreaCodeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isRegionOpen, setIsRegionOpen] = useState(false);
    const [isVendorTypeOpen, setIsVendorTypeOpen] = useState(false);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

    //custom pagination vars
    const [currentPage,setCurrentPage] = useState(1);
    const [postsPerPage,setPostsPerPage] = useState(25);
    const [pageNumber,setPageNumber] = useState([]);
    const [indexOfAllFirstPage,setIndexOfFirstPage] = useState();
    const [indexOfAllLastPage,setIndexOfLastPage] = useState();
    const [loadingData,setLoadingData] = useState();
    const [initialPage,setInitialPage] = useState(0);
    const [lastPage,setLastPage] = useState(10);

     //form vars
     const [vendorName, setVendorName] = useState();
     const [primaryContact, setPrimaryContact] = useState();
     const [vendorEmail, setVendorEmail] = useState();
     const [vendorPhone, setVendorPhone] = useState(); 
     const [areaCode, setAreaCode] = useState("+44");
     const [phone, setPhone] = useState();
     const [region, setRegion] = useState("US");
     const [vendorType, setVendorType] = useState("1");
     const [currency, setCurrency] = useState("USD");

    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const[error,setError] = useState('');
    const[leadInfoModal,setLeadInfoModal] = useState(false);
    const[vendorInfoModal,setVendorInfoModal] = useState(false);
    const[prospectInfoModal,setProspectInfoModal] = useState(false);
    const [success, setSuccess] = useState();
        
    //sorting vars
    const[sortOrder,setSortOrder] = useState('asc');

    //filters vars
    const [duration, setDuration] = useState("");
    const [typeDropDownValue, setTypeDropDownValue] = useState("");
    const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
    const [isOrderFilterOpen, setIsOrderFilterOpen] = useState(false);
    const [orderDropDownValue, setOrderDropDownValue] = useState("");
    
    useEffect(() => {
        dispatch(setInvoiceData({data:""}));
        fetchVendors();
    },[]);

    useEffect(() => {
        if(allVendorList && allVendorList.length > 0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            
            setVendorList(allVendorList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allVendorList.length/postsPerPage);i++) {
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
    const handleVendors = (id) => {
        localStorage.setItem('customer_id',id);
        localStorage.setItem('customer_type','Vendor-Prospect');
        migrateDataToRedux();
        history.push('/accountinfo/communication');
    }
    const paginate = () => {
        if(allVendorList && allVendorList.length>0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            
            setVendorList(allVendorList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allVendorList.length/postsPerPage);i++) {
                setPageNumber(...[i])
            }
            
        }
    }
    const fetchVendors = () => {
        setLoadingData(true);
        axios
        .post("/accounts/prospect_vendor"+query,{
        }).then((res) => {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            let arrayVendorList = [];
            if(res.data.vendors) {
                Object.entries(res.data.vendors).map((value)=>{
                    arrayVendorList.push(value);
                });

                setAllVendorList(arrayVendorList);
                setVendorList(arrayVendorList.slice(indexOfFirstPage,indexOfLastPost));
                setLoadingData(false);
                for(let i=1; i<=Math.ceil(arrayVendorList.length/postsPerPage);i++) {
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
    const handleAddUser = (e) => {
        setError('');
        e.preventDefault();
            axios.post('/accounts/add_vendor'+query,{
                vendor_name:vendorName,
                contact_name:primaryContact,
                email_address: vendorEmail,
                phone_area_code: areaCode,
                phone_number: vendorPhone,
                vendor_type: vendorType,
                store_region: region,
                currency: currency,
                vendor_prospect:1
            }).then((res) => {
                if(res.data.message === "vendor added") {
                    setSuccess("Vendor Added Successfully!");
                    setVendorId(res.data.customer_id);
                    setViewButton(true);
                    setVendorList([]);
                    fetchVendors();
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
            });  
            setVendorName("");
            setPrimaryContact("");
            setVendorPhone("");
            setVendorEmail("");
    }
    const handleSorting = (field) => {
        if(vendorList && vendorList.length>0) {
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
                            case "company" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].company?a[1].company.toLowerCase():""
                                    var nameB=b[1].company?b[1].company.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "primary_contact" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].primary_contact?a[1].primary_contact.toLowerCase():""
                                    var nameB=b[1].primary_contact?b[1].primary_contact.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "email" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].email?a[1].email.toLowerCase():""
                                    var nameB=b[1].email?b[1].email.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "phone" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].phone?a[1].phone.toLowerCase():""
                                    var nameB=b[1].phone?b[1].phone.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "vendor_type" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].vendor_type?a[1].vendor_type.toLowerCase():""
                                    var nameB=b[1].vendor_type?b[1].vendor_type.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "created_date" :
                                sortedArray = allVendorList.sort( 
                                    (a, b) => new Date (a[1].created_date) - new Date(b[1].created_date)
                                );
                            break;

                            case "last_contacted" :
                                sortedArray = allVendorList.sort(
                                    (a, b) => new Date (a[1].last_contacted) - new Date(b[1].last_contacted)
                                );
                            break;

                            case "contact_type" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].contact_type?a[1].contact_type.toLowerCase():""
                                    var nameB=b[1].contact_type?b[1].contact_type.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "follow_date" :
                                sortedArray = allVendorList.sort(
                                    (a, b) => new Date (a[1].follow_date) - new Date(b[1].follow_date)
                                );
                            break;
                            
                            case "inventory_list" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].inventory_list?a[1].inventory_list.toLowerCase():""
                                    var nameB=b[1].inventory_list?b[1].inventory_list.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            default:console.log("check sorting Label 1"); break;
                        }
                        setAllVendorList([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "company" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].company?a[1].company.toLowerCase():"", nameB=b[1].company?b[1].company.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "primary_contact" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].primary_contact?a[1].primary_contact.toLowerCase():"", nameB=b[1].primary_contact?b[1].primary_contact.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "email" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].email?a[1].email.toLowerCase():"", nameB=b[1].email?b[1].email.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            
                            case "phone" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].phone?a[1].phone.toLowerCase():"", nameB=b[1].phone?b[1].phone.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "vendor_type" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].vendor_type?a[1].vendor_type.toLowerCase():"", nameB=b[1].vendor_type?b[1].vendor_type.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "created_date" :
                                sortedArray = allVendorList.sort(
                                    (a, b) => new Date (b[1].created_date) - new Date(a[1].created_date)
                                );
                            break;

                            case "last_contacted" :
                                sortedArray = allVendorList.sort(
                                    (a, b) => new Date(b[1].last_contacted) - new Date(a[1].last_contacted)
                                );
                            break;

                            case "contact_type" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].contact_type?a[1].contact_type.toLowerCase():"", nameB=b[1].contact_type?b[1].contact_type.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "follow_date" :
                                sortedArray = allVendorList.sort(
                                    (a, b) => new Date(b[1].follow_date) - new Date(a[1].follow_date)
                                );
                            break;
                            case "inventory_list" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].inventory_list?a[1].inventory_list.toLowerCase():"", nameB=b[1].inventory_list?b[1].inventory_list.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
    
                            default:console.log("check sorting Label 2"); break;
                        }
                        setAllVendorList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }else {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "company" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].company?a[1].company.toLowerCase():""
                                    var nameB=b[1].company?b[1].company.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "primary_contact" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].primary_contact?a[1].primary_contact.toLowerCase():""
                                    var nameB=b[1].primary_contact?b[1].primary_contact.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "email" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].email?a[1].email.toLowerCase():""
                                    var nameB=b[1].email?b[1].email.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "phone" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].phone?a[1].phone.toLowerCase():""
                                    var nameB=b[1].phone?b[1].phone.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "vendor_type" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].vendor_type?a[1].vendor_type.toLowerCase():""
                                    var nameB=b[1].vendor_type?b[1].vendor_type.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "created_date" :
                                sortedArray = allVendorList.sort( 
                                    (a, b) => new Date (a[1].created_date) - new Date(b[1].created_date)
                                );
                            break;

                            case "last_contacted" :
                                sortedArray = allVendorList.sort(
                                    (a, b) => new Date (a[1].last_contacted) - new Date(b[1].last_contacted)
                                );
                            break;

                            case "contact_type" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].contact_type?a[1].contact_type.toLowerCase():""
                                    var nameB=b[1].contact_type?b[1].contact_type.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "follow_date" :
                                sortedArray = allVendorList.sort(
                                    (a, b) => new Date (a[1].follow_date) - new Date(b[1].follow_date)
                                );
                            break;

                            case "inventory_list" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].inventory_list?a[1].inventory_list.toLowerCase():""
                                    var nameB=b[1].inventory_list?b[1].inventory_list.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            default:console.log("check sorting Label 1"); break;
                        }
                        // setVendorList([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "company" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].company?a[1].company.toLowerCase():"", nameB=b[1].company?b[1].company.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "primary_contact" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].primary_contact?a[1].primary_contact.toLowerCase():"", nameB=b[1].primary_contact?b[1].primary_contact.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "email" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].email?a[1].email.toLowerCase():"", nameB=b[1].email?b[1].email.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            
                            case "phone" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].phone?a[1].phone.toLowerCase():"", nameB=b[1].phone?b[1].phone.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "vendor_type" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].vendor_type?a[1].vendor_type.toLowerCase():"", nameB=b[1].vendor_type?b[1].vendor_type.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "created_date" :
                                sortedArray = allVendorList.sort(
                                    (a, b) => new Date (b[1].created_date) - new Date(a[1].created_date)
                                );
                            break;

                            case "last_contacted" :
                                sortedArray = allVendorList.sort(
                                    (a, b) => new Date(b[1].last_contacted) - new Date(a[1].last_contacted)
                                );
                            break;

                            case "contact_type" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].contact_type?a[1].contact_type.toLowerCase():"", nameB=b[1].contact_type?b[1].contact_type.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "follow_date" :
                                sortedArray = allVendorList.sort(
                                    (a, b) => new Date(b[1].follow_date) - new Date(a[1].follow_date)
                                );
                            break;
                            case "inventory_list" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a[1].inventory_list?a[1].inventory_list.toLowerCase():"", nameB=b[1].inventory_list?b[1].inventory_list.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
    
                            default:console.log("check sorting Label 2"); break;
                        }
                        // setVendorList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
                paginate();
            }
        }
    }
    const fetchFromFilterAPI = (last_contacted, vendor_type, order_type) => {
        setAllVendorList([]);
        setVendorList([]);
        setInitialPage(0);
        setCurrentPage(1);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        setLoadingData(true);
        axios
        .post("/accounts/prospect_vendor"+query, {
            last_contacted, vendor_type, order_type
        }).then((res) => {
            var indexOfLastPost = 1 * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            let arrayVendorList = [];
            if(res.data.vendors) {
                Object.entries(res.data.vendors).map((value)=>{
                    arrayVendorList.push(value);
                });

                setAllVendorList(arrayVendorList);
                setVendorList(arrayVendorList.slice(indexOfFirstPage,indexOfLastPost));
                setLoadingData(false);
                for(let i=1; i<=Math.ceil(arrayVendorList.length/postsPerPage);i++) {
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
    const handleFilter = (value, type) => {
        setInitialPage(0);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        if(type==="last-contacted") {
            fetchFromFilterAPI(value, typeDropDownValue, orderDropDownValue);
        } else if(type==="type-filter") {
            fetchFromFilterAPI(duration, value, orderDropDownValue);
        } else {
            fetchFromFilterAPI(duration, typeDropDownValue, value);
        }
    }

    const handleViewVendor = () => {
        localStorage.setItem("customer_id",vendorId);
        localStorage.setItem("customer_type","Vendor");
        history.push("/accountinfo/communication");
    }
    const handleVendorInventory = (id) => {
        localStorage.setItem("vendor_inventory",id);
        history.push("/vendor-inventory")
    }
    const migrateDataToRedux = (data) => {
        dispatch(setGlobalData({data:allVendorList}));
    }
    
    return (
        <div className="transaction-page">
            <div className="customers-content">
                <div className="top-head d-flex align-items-end">
                    <div className="title d-flex justify-content-start align-items-center">
                        <h1 className="mb-0 font-35">Vendors-Prospect</h1>
                    </div>
                    <div className={openSearch ? "search-customer show" : "search-customer"}>
                        <div className="search-box">
                            <input className="search-input" type="text" 
                                value={search}
                                placeholder="Quick Find by Name, Email or Phone"
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
                            <Button className='btn-filter'  variant="outline-primary" onClick={()=>setVendorInfoModal(true)}>
                                ADD VENDOR
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
            
            <div className="all-customer-wrapper">
                <div className="all-customer-data">

                    <div className="all-customer-data-head py-3 pl-3 pr-4">
                        <div className="customer-data-head-filter d-flex justify-content-end align-items-center border-bottom-0 mb-2">
                            <div className="customer-title">
                                Last Contacted :
                            </div>
                            <div className="data-filter">
                                <ul>
                                    <li>
                                        <Button className={duration==="" ? 'btn-filter active' : 'btn-filter'} variant="outline-primary" onClick = {() => {setDuration(''); handleFilter('','last-contacted')}}>ALL</Button>
                                    </li>
                                    <li>
                                        <Button className={duration==="30days" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration('30days'); handleFilter('30days','last-contacted')}}>LAST 30 DAYS</Button>
                                    </li>
                                    <li>
                                        <Button className={duration==="30_90_days" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration('30_90_days'); handleFilter('30_90_days','last-contacted')}}>30-90 DAYS</Button>
                                    </li>

                                    <li>
                                        <Button className={duration==="3_6_months" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration('3_6_months');handleFilter('3_6_months','last-contacted')}}>3-6 MONTHS</Button>
                                    </li>
                                    <li>
                                        <Button className={duration==="6_12_months" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration('6_12_months');handleFilter('6_12_months','last-contacted')}}>6-12 MONTHS</Button>
                                    </li>
                                    <li>
                                        <Button className={duration==="more_than_1_year" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration('more_than_1_year'); handleFilter('more_than_1_year','last-contacted')}}>LONGER THAN 1 YEAR</Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="customer-data-head-filter d-flex justify-content-end align-items-center border-bottom-0 mb-2">
                            <div className="customer-title">
                                Vendor Type :
                            </div>
                            <div className="data-filter">
                            <div className="dropUp">
                                <div className="custom-select-wrapper d-flex align-items-center">
                                    <div className={isTypeFilterOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                        <div className="custom-select__trigger" onClick={()=>{setIsTypeFilterOpen(!isTypeFilterOpen); setIsOrderFilterOpen(false);}}>
                                            {typeDropDownValue==="1" ? <span>Retail</span>  : ""}
                                            {typeDropDownValue==="2" ? <span>Wholesale</span>  : ""}
                                            {typeDropDownValue==="3" ? <span>Investment</span>  : ""}
                                            {typeDropDownValue==="4" ? <span>Logistics</span>  : ""}
                                            {typeDropDownValue==="5" ? <span>Winery</span>  : ""}
                                            {typeDropDownValue==="6" ? <span>Others</span>  : ""}
                                            {typeDropDownValue==="" ? <span>ALL</span>  : ""}
                                            <div className="arrow">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="custom-options">
                                            <span className={typeDropDownValue === "1" ? "custom-option selected":"custom-option"} onClick={() => {setTypeDropDownValue("1"); handleFilter("1", "type-filter"); setIsTypeFilterOpen(false)}}>Retail</span>
                                            <span className={typeDropDownValue === "2" ? "custom-option selected":"custom-option"} onClick={() => {setTypeDropDownValue("2"); handleFilter("2", "type-filter");setIsTypeFilterOpen(false)}}>Wholesale</span>
                                            <span className={typeDropDownValue === "3" ? "custom-option selected":"custom-option"} onClick={() => {setTypeDropDownValue("3"); handleFilter("3", "type-filter");setIsTypeFilterOpen(false)}}>Investment</span>
                                            <span className={typeDropDownValue === "4" ? "custom-option selected":"custom-option"} onClick={() => {setTypeDropDownValue("4"); handleFilter("4", "type-filter");setIsTypeFilterOpen(false)}}>Logistics</span>
                                            <span className={typeDropDownValue === "5" ? "custom-option selected":"custom-option"}  onClick={() => {setTypeDropDownValue("5"); handleFilter("5", "type-filter");setIsTypeFilterOpen(false)}}>Winery</span>
                                            <span className={typeDropDownValue === "6" ? "custom-option selected":"custom-option"}  onClick={() => {setTypeDropDownValue("6"); handleFilter("6", "type-filter");setIsTypeFilterOpen(false)}}>Others</span>
                                            <span className={typeDropDownValue === "" ? "custom-option selected":"custom-option"}  onClick={() => {setTypeDropDownValue(""); handleFilter("", "type-filter");setIsTypeFilterOpen(false)}}>ALL</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        <div className="customer-data-head-filter d-flex justify-content-end align-items-center border-bottom-0">
                            <div className="customer-title">
                                Order Type :
                            </div>
                            <div className="data-filter">
                            <div className="dropUp">
                                <div className="custom-select-wrapper d-flex align-items-center">
                                    <div className={isOrderFilterOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                        <div className="custom-select__trigger" onClick={()=>{setIsOrderFilterOpen(!isOrderFilterOpen); setIsTypeFilterOpen(false)}}>
                                            <span>{orderDropDownValue ? orderDropDownValue : "ALL"}</span>
                                            <div className="arrow">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="custom-options">
                                            <span className={orderDropDownValue === "INVOICE" ? "custom-option selected":"custom-option"} onClick={() => {setOrderDropDownValue("INVOICE"); handleFilter("INVOICE", "order-filter");setIsOrderFilterOpen(false)}}>INVOICE</span>
                                            <span className={orderDropDownValue === "PO" ? "custom-option selected":"custom-option"}  onClick={() => {setOrderDropDownValue("PO"); handleFilter("PO", "order-filter");setIsOrderFilterOpen(false)}}>PO</span>
                                            <span className={typeDropDownValue === "" ? "custom-option selected":"custom-option"}  onClick={() => {setOrderDropDownValue(""); handleFilter("", "order-filter");setIsOrderFilterOpen(false)}}>ALL</span>
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
                                <th className="cursor-pointer" onClick={()=>handleSorting("company")}>Vendor</th>
                                {/* <th onClick={() => handleSorting()}>Date <img height="12" width="12" src={OrderByIcon}></img></th> */}
                                <th className="cursor-pointer" onClick={()=>handleSorting("primary_contact")}>Primary Contact</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("email")}>Email</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("phone")}>Phone</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("vendor_type")}>Vendor Type</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("created_date")}>Created Date</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("last_contacted")}>Last Contacted</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("contact_type")}>Contact Type</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("follow_date")}>Followup Date</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("inventory_list")}>Vendor Inventory</th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    search ? (
                                        allVendorList && allVendorList.length > 0 ? (
                                            allVendorList.filter((data) => {
                                                if(
                                                    data[1].company && data[1].company.toLowerCase().includes(search.toLowerCase())||
                                                    data[1].phone && data[1].phone.toLowerCase().includes(search.toLowerCase()) ||
                                                    data[1].email && data[1].email.toLowerCase().includes(search.toLowerCase())
                                                ) {
                                                    return data;
                                                }
                                            }).map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].company ? value[1].company : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].primary_contact ? value[1].primary_contact : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].email ? value[1].email : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].phone ? value[1].phone : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].vendor_type ? value[1].vendor_type : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].created_date ? value[1].created_date : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].last_contacted ? value[1].last_contacted : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].contact_type ? value[1].contact_type : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].follow_date ? value[1].follow_date : "-"}</td>
                                                        {
                                                            value[1].inventory_list && value[1].inventory_list.toLowerCase().includes("http") ? 
                                                            (<a href={value[1].inventory_list} target="_blank">View Inventory</a>):
                                                            (
                                                                <td className="cursor-pointer" onClick={() => handleVendorInventory(value[1].inventory_list)}>{value[1].inventory_list ? "View Inventory" : "-"}</td>
                                                            )
                                                        }
                                                    </tr>
                                                )
                                            })
                                        ) : ("")
                                    )
                                    :
                                    vendorList && vendorList.length > 0 ? (
                                        vendorList.map((value, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].company ? value[1].company : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].primary_contact ? value[1].primary_contact : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].email ? value[1].email : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].phone ? value[1].phone : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].vendor_type ? value[1].vendor_type : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].created_date ? value[1].created_date : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].last_contacted ? value[1].last_contacted : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].contact_type ? value[1].contact_type : "-"}</td>
                                                    <td className="cursor-pointer" onClick={() => handleVendors(value[0])}>{value[1].follow_date ? value[1].follow_date : "-"}</td>
                                                    {
                                                        value[1].inventory_list && value[1].inventory_list.toLowerCase().includes("http") ? 
                                                        (<a href={value[1].inventory_list} target="_blank">View Inventory</a>):
                                                        (
                                                            <td className="cursor-pointer" onClick={() => handleVendorInventory(value[1].inventory_list)}>{value[1].inventory_list ? "View Inventory" : "-"}</td>
                                                        )
                                                    }
                                                </tr>
                                            )
                                        })
                                    ) : ("")
                                }
                                {
                                    loadingData ? (
                                        <tr>
                                            <td colSpan="9" className="text-center">Loading...</td>
                                        </tr>
                                    ) :
                                    ("")
                                }
                                {
                                    vendorList && vendorList.length===0 && loadingData===false && !search? (
                                        <tr>
                                            <td colSpan="9" className="text-center">No Vendors found!</td>
                                        </tr>
                                    ) :
                                    ("")
                                }
                                {
                                    search ? (allVendorList ? (allVendorList.filter((data) => {
                                    if(
                                        data[1].company && data[1].company.toLowerCase().includes(search.toLowerCase())||
                                        data[1].phone && data[1].phone.toLowerCase().includes(search.toLowerCase()) ||
                                        data[1].email && data[1].email.toLowerCase().includes(search.toLowerCase())
                                    ) {
                                        return data;
                                    }
                                    }).length>0) ? "":
                                    (<tr>
                                        <td colSpan="9" className="text-center">No Data Found!</td>
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
                                allVendorList && allVendorList.length > 0 ? (
                                    allVendorList.filter((data) => {
                                        if(
                                            data[1].company && data[1].company.toLowerCase().includes(search.toLowerCase())||
                                            data[1].phone && data[1].phone.toLowerCase().includes(search.toLowerCase()) ||
                                            data[1].email && data[1].email.toLowerCase().includes(search.toLowerCase())
                                        ) {
                                            return data;
                                        }
                                    }).map((value, index) => {
                                        return (
                                            <div className="mobile-table-list">
                                                <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                    <div className="th">
                                                        <label onClick={()=>handleSorting("company")}>Vendor</label>
                                                        <span onClick={() => handleVendors(value[0])}>{value[1].company ? value[1].company: ""}</span>
                                                    </div>
                                                    <div className="th">
                                                        <label onClick={()=>handleSorting("vendor_type")}>Vendor Type</label>
                                                        <span onClick={() => handleVendors(value[0])}>{value[1].vendor_type ? value[1].vendor_type : "-"}</span>
                                                    </div>
                                                </div>
                                                <div className="mobile-table-td">
                                            <div className="mobile-table-td-row">
                                                <div className="td-list d-flex justify-content-between">
                                                    <div className="td">
                                                        <label onClick={()=>handleSorting("created_date")}>Created Date</label>
                                                        <span onClick={() => handleVendors(value[0])}><strong>{value[1].created_date ? value[1].created_date : "-"}</strong></span>
                                                    </div>
                                                    <div className="product-td d-flex">
                                                        <div className="product-td-name">
                                                            <label onClick={()=>handleSorting("last_contacted")}>Last Contacted</label>
                                                            <h6 onClick={() => handleVendors(value[0])}>{value[1].last_contacted ? value[1].last_contacted : "-"}</h6> 
                                                        </div>
                                                    </div>
                                                    <div className="td">
                                                        <div className="shipping-option">
                                                            <label onClick={()=>handleSorting("contact_type")}>Contact Type</label>
                                                            <span onClick={() => handleVendors(value[0])}>{value[1].contact_type ? value[1].contact_type : "-"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={()=>handleSorting("primary_contact")}>Primary Contact</label>
                                                    <span onClick={() => handleVendors(value[0])}>{value[1].primary_contact ? value[1].primary_contact: ""}</span>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={()=>handleSorting("email")}>Email</label>
                                                    <span onClick={() => handleVendors(value[0])}>{value[1].email ? value[1].email : ""}</span>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={()=>handleSorting("phone")}>Phone</label>
                                                    <span onClick={() => handleVendors(value[0])}>{value[1].phone ? value[1].phone : ""}</span>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={()=>handleSorting("follow_date")}>Followup Date</label>
                                                    <span onClick={() => handleVendors(value[0])}>{value[1].follow_date ? value[1].follow_date : "-"}</span>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={()=>handleSorting("inventory_list")}>Vendor Inventory</label>
                                                        {
                                                            value[1].inventory_list && value[1].inventory_list.toLowerCase().includes("http") ? 
                                                            (<a href={value[1].inventory_list} target="_blank">View Inventory</a>):
                                                            (
                                                                <span onClick={() => handleVendorInventory(value[1].inventory_list)}>{value[1].inventory_list ? "View Inventory": ""}</span>
                                                            )
                                                        }
                                                </div>
                                        </div>
                                        )
                                    })
                                ) : ("")
                                    )
                                    :
                                    vendorList && vendorList.length > 0 ? (
                                        vendorList.map((value, index) => {
                                            return (
                                                <div className="mobile-table-list" key={index}>
                                                        <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                            <div className="th">
                                                                <label onClick={()=>handleSorting("company")}>Vendor </label>
                                                                <span onClick={() => handleVendors(value[0])}>{value[1].company ? value[1].company: ""}</span>
                                                            </div>
                                                            <div className="th">
                                                                <label onClick={()=>handleSorting("vendor_type")}>Vendor Type</label>
                                                                <span onClick={() => handleVendors(value[0])}>{value[1].vendor_type ? value[1].vendor_type : "-"}</span>
                                                            </div>
                                                        </div>
                                                        <div className="mobile-table-td">
                                                    <div className="mobile-table-td-row">
                                                        <div className="td-list d-flex justify-content-between">
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("created_date")}>Created Date</label>
                                                                <span onClick={() => handleVendors(value[0])}><strong>{value[1].created_date ? value[1].created_date : "-"}</strong></span>
                                                            </div>
                                                            <div className="product-td d-flex">
                                                                <div className="product-td-name">
                                                                    <label onClick={()=>handleSorting("last_contacted")}>Last Contacted</label>
                                                                    <h6 onClick={() => handleVendors(value[0])}>{value[1].last_contacted ? value[1].last_contacted : "-"}</h6> 
                                                                </div>
                                                            </div>
                                                            <div className="td">
                                                                <div className="shipping-option">
                                                                    <label onClick={()=>handleSorting("contact_type")}>Contact Type</label>
                                                                    <span onClick={() => handleVendors(value[0])}>{value[1].contact_type ? value[1].contact_type : "-"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("primary_contact")}>Primary Contact</label>
                                                            <span onClick={() => handleVendors(value[0])}>{value[1].primary_contact ? value[1].primary_contact: ""}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("email")}>Email</label>
                                                            <span onClick={() => handleVendors(value[0])}>{value[1].email ? value[1].email : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("phone")}>Phone</label>
                                                            <span onClick={() => handleVendors(value[0])}>{value[1].phone ? value[1].phone : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("follow_date")}>Followup Date</label>
                                                            <span onClick={() => handleVendors(value[0])}>{value[1].follow_date ? value[1].follow_date : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("inventory_list")}>Vendor Inventory</label>
                                                                {
                                                                    value[1].inventory_list && value[1].inventory_list.toLowerCase().includes("http") ? 
                                                                    (<a href={value[1].inventory_list} target="_blank">View Inventory</a>):
                                                                    (
                                                                        <span onClick={() => handleVendorInventory(value[1].inventory_list)}>{value[1].inventory_list ? "View Inventory": ""}</span>
                                                                    )
                                                                }
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
                                    vendorList && vendorList.length===0 && loadingData===false && !search? (
                                        <div className="mobile-table-list text-center">
                                            No Vendors Found!
                                        </div>
                                    ) :
                                    ("")
                                }
                                {
                                    search ? (allVendorList ? (allVendorList.filter((data) => {
                                    if(
                                        data[1].company && data[1].company.toLowerCase().includes(search.toLowerCase())||
                                        data[1].phone && data[1].phone.toLowerCase().includes(search.toLowerCase()) ||
                                        data[1].email && data[1].email.toLowerCase().includes(search.toLowerCase())
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

            <Modal show={vendorInfoModal}
                    onHide={() => {setVendorInfoModal(false); setViewButton(false); setError("")}} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>ADD VENDOR DETAILS</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={(e) => handleAddUser(e)}>
                        <Modal.Body>
                            <div className="change-address-body">
                            <div className="change-address-wrapper">
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Vendor Name:</label>
                                        <input type="text" className="text-input"  value = {vendorName?vendorName:""} onChange = {(e) => {setError("");setVendorName(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Primary Contact:</label>
                                        <input type="text" className="text-input" value = {primaryContact?primaryContact:""} onChange = {(e) => {setError("");setPrimaryContact(e.target.value)}} ></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Email:</label>
                                        <input type="email" className="text-input" value = {vendorEmail?vendorEmail:""} onChange = {(e) => {setError("");setVendorEmail(e.target.value)}} required></input>
                                    </div>
                                    {/* DropDowns */}
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
                                        <input type="text" className="text-input" value = {vendorPhone?vendorPhone:""} onChange = {(e) => {setError("");setVendorPhone(e.target.value)}} required={query !== "?region=UK"}></input>
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
                                        <label>Vendor type:</label>
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isVendorTypeOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>setIsVendorTypeOpen(!isVendorTypeOpen)}>
                                                        {
                                                            vendorType === "1" ? <span>Retail</span>:""
                                                        }
                                                        {
                                                            vendorType === "2" ? <span>Wholesale</span>:""
                                                        }
                                                        {
                                                            vendorType === "3" ? <span>Investment</span>:""
                                                        }
                                                        {
                                                            vendorType === "4" ? <span>Logistics</span>:""
                                                        }
                                                        {
                                                            vendorType === "5" ? <span>Winery</span>:""
                                                        }
                                                        {
                                                            vendorType === "6" ? <span>Other</span>:""
                                                        }
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        <span className={vendorType === "1" ? "custom-option selected":"custom-option"} onClick={() => { setVendorType('1'); setIsVendorTypeOpen(false)}}>Retail</span>
                                                        <span className={vendorType === "2"? "custom-option selected":"custom-option"}  onClick={() => {setVendorType('2'); setIsVendorTypeOpen(false)}}>Wholesale</span>
                                                        <span className={vendorType === "3" ? "custom-option selected":"custom-option"} onClick={() => { setVendorType('3'); setIsVendorTypeOpen(false)}}>Investment</span>
                                                        <span className={vendorType === "4"? "custom-option selected":"custom-option"}  onClick={() => {setVendorType('4'); setIsVendorTypeOpen(false)}}>Logistics</span>
                                                        <span className={vendorType === "5" ? "custom-option selected":"custom-option"} onClick={() => { setVendorType('5'); setIsVendorTypeOpen(false)}}>Winery</span>
                                                        <span className={vendorType === "6" ? "custom-option selected":"custom-option"} onClick={() => { setVendorType('6'); setIsVendorTypeOpen(false)}}>Other</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Currency:</label>
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isCurrencyOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>setIsCurrencyOpen(!isCurrencyOpen)}>
                                                        {currency ? currency : ""}
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                    {
                                                        currencyList && currencyList.length>0 ? (
                                                            currencyList.map((value, index) => {
                                                                return(
                                                                    <span className={currency === value ? "custom-option selected":"custom-option"} onClick={() => { setCurrency(value); setIsCurrencyOpen(false)}}>{value}</span>                
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
                                        <label></label>
                                        <span className="error-text">{error}</span>
                                        <span className="success-text">{success}</span>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            {
                                showViewButton ? (<input type="button" value="View Vendor" className="save-btn" onClick={() => handleViewVendor()} />) :
                                (<input type="submit" value="Save" className="save-btn" />)
                            }
                        </Modal.Footer>
                    </form>
            </Modal>
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage}/>              
        </div>
        
    )
};

export default connect(null,{logout})(VendorProspect);
