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
import {logout, setSession} from "../../utils/Actions";
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
    
const VendorInventory = () => {
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
        
    //sorting vars
    const[sortOrder,setSortOrder] = useState('asc');
    
    useEffect(() => {
        fetchVendorInventory();
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
    const fetchVendorInventory = () => {
        if(window.screen.width<=480) {
            setLastPage(5);
        }
        setLoadingData(true);
        axios
        .post("/accounts/vendor_inventory"+query,{
            id:localStorage.getItem("vendor_inventory")
        }).then((res) => {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            let arrayVendorList = [];
            if(res.data) {
                setAllVendorList(res.data);
                setVendorList(res.data.slice(indexOfFirstPage,indexOfLastPost));
                setLoadingData(false);
                for(let i=1; i<=Math.ceil(res.data.length/postsPerPage);i++) {
                    setPageNumber(...[i])
                }
            }
            setLoadingData(false);
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
                currency: currency
            }).then((res) => {
                if(res.data.message === "vendor added") {
                    setError("Vendor Added Successfully!");
                    setVendorId(res.data.customer_id);
                    setViewButton(true);
                    setVendorList([]);
                    fetchVendorInventory();
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
                            case "NAME" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():""
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRODUCER" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.PRODUCER?a.PRODUCER.toLowerCase():""
                                    var nameB=b.PRODUCER?b.PRODUCER.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;  
                            case "VINTAGE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VINTAGE?(a.VINTAGE.toLowerCase()):""
                                    var nameB=b.VINTAGE?(b.VINTAGE.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;   
                            case "REGION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.REGION?(a.REGION.toLowerCase()):""
                                    var nameB=b.REGION?(b.REGION.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break; 
                            case "SUBREGION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.SUBREGION?(a.SUBREGION.toLowerCase()):""
                                    var nameB=b.SUBREGION?(b.SUBREGION.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "COUNTRY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.COUNTRY?(a.COUNTRY.toLowerCase()):""
                                    var nameB=b.COUNTRY?(b.COUNTRY.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break; 
                            case "BOTTLE_PRICE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.BOTTLE_PRICE?parseFloat(a.BOTTLE_PRICE.toLowerCase()):""
                                    var nameB=b.BOTTLE_PRICE?parseFloat(b.BOTTLE_PRICE.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break; 
                            case "CASE_SIZE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.CASE_SIZE?(a.CASE_SIZE.toLowerCase()):""
                                    var nameB=b.CASE_SIZE?(b.CASE_SIZE.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CASE_PRICE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.CASE_PRICE?parseFloat(a.CASE_PRICE.toLowerCase()):""
                                    var nameB=b.CASE_PRICE?parseFloat(b.CASE_PRICE.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break; 
                            
                            default:console.log("check sorting Label 1"); break;
                        }
                        // console.log("sorted array",[...sortedArray])
                        setAllVendorList([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "NAME" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():"";
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRODUCER" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.PRODUCER?a.PRODUCER.toLowerCase():"";
                                    var nameB=b.PRODUCER?b.PRODUCER.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VINTAGE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VINTAGE?(a.VINTAGE.toLowerCase()):"";
                                    var nameB=b.VINTAGE?(b.VINTAGE.toLowerCase()):""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "REGION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.REGION?a.REGION.toLowerCase():"";
                                    var nameB=b.REGION?b.REGION.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SUBREGION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.SUBREGION?a.SUBREGION.toLowerCase():"";
                                    var nameB=b.SUBREGION?b.SUBREGION.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "COUNTRY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.COUNTRY?a.COUNTRY.toLowerCase():"";
                                    var nameB=b.COUNTRY?b.COUNTRY.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "BOTTLE_PRICE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.BOTTLE_PRICE?parseFloat(a.BOTTLE_PRICE.toLowerCase()):"";
                                    var nameB=b.BOTTLE_PRICE?parseFloat(b.BOTTLE_PRICE.toLowerCase()):""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CASE_SIZE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.CASE_SIZE?(a.CASE_SIZE.toLowerCase()):"";
                                    var nameB=b.CASE_SIZE?(b.CASE_SIZE.toLowerCase()):""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CASE_PRICE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.CASE_PRICE?parseFloat(a.CASE_PRICE.toLowerCase()):"";
                                    var nameB=b.CASE_PRICE?parseFloat(b.CASE_PRICE.toLowerCase()):""
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
                            case "NAME" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():""
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRODUCER" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.PRODUCER?a.PRODUCER.toLowerCase():""
                                    var nameB=b.PRODUCER?b.PRODUCER.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;  
                            case "VINTAGE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VINTAGE?(a.VINTAGE.toLowerCase()):""
                                    var nameB=b.VINTAGE?(b.VINTAGE.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;   
                            case "REGION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.REGION?(a.REGION.toLowerCase()):""
                                    var nameB=b.REGION?(b.REGION.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break; 
                            case "SUBREGION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.SUBREGION?(a.SUBREGION.toLowerCase()):""
                                    var nameB=b.SUBREGION?(b.SUBREGION.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "COUNTRY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.COUNTRY?(a.COUNTRY.toLowerCase()):""
                                    var nameB=b.COUNTRY?(b.COUNTRY.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break; 
                            case "BOTTLE_PRICE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.BOTTLE_PRICE?parseFloat(a.BOTTLE_PRICE.toLowerCase()):""
                                    var nameB=b.BOTTLE_PRICE?parseFloat(b.BOTTLE_PRICE.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break; 
                            case "CASE_SIZE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.CASE_SIZE?(a.CASE_SIZE.toLowerCase()):""
                                    var nameB=b.CASE_SIZE?(b.CASE_SIZE.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CASE_PRICE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.CASE_PRICE?parseFloat(a.CASE_PRICE.toLowerCase()):""
                                    var nameB=b.CASE_PRICE?parseFloat(b.CASE_PRICE.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break; 
                            
                            default:console.log("check sorting Label 1"); break;
                        }
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "NAME" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():"";
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRODUCER" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.PRODUCER?a.PRODUCER.toLowerCase():"";
                                    var nameB=b.PRODUCER?b.PRODUCER.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VINTAGE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VINTAGE?(a.VINTAGE.toLowerCase()):"";
                                    var nameB=b.VINTAGE?(b.VINTAGE.toLowerCase()):""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "REGION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.REGION?a.REGION.toLowerCase():"";
                                    var nameB=b.REGION?b.REGION.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SUBREGION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.SUBREGION?a.SUBREGION.toLowerCase():"";
                                    var nameB=b.SUBREGION?b.SUBREGION.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "COUNTRY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.COUNTRY?a.COUNTRY.toLowerCase():"";
                                    var nameB=b.COUNTRY?b.COUNTRY.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "BOTTLE_PRICE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.BOTTLE_PRICE?parseFloat(a.BOTTLE_PRICE.toLowerCase()):"";
                                    var nameB=b.BOTTLE_PRICE?parseFloat(b.BOTTLE_PRICE.toLowerCase()):""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CASE_SIZE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.CASE_SIZE?(a.CASE_SIZE.toLowerCase()):"";
                                    var nameB=b.CASE_SIZE?(b.CASE_SIZE.toLowerCase()):""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CASE_PRICE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.CASE_PRICE?parseFloat(a.CASE_PRICE.toLowerCase()):"";
                                    var nameB=b.CASE_PRICE?parseFloat(b.CASE_PRICE.toLowerCase()):""
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

    const handleViewVendor = () => {
        localStorage.setItem("customer_id",vendorId);
        localStorage.setItem("customer_type","Vendor");
        history.push("/accountinfo/communication");
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
    
    return (
        <div className="transaction-page">
          <div className="header">
            <h4>Vendor Inventory Details</h4>
            <div className="data-filter">
                {/* <div>
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
                </div> */}
            </div>
            <div className="right-side search-page-dropbox">
                <div className={openSearch ? "search-opt show" : "search-opt"}>
                    <input placeholder="Search Inventory" type="text" value={search} onChange={(e) => { setSearch(e.target.value)}}/>
                    <img src={SearchIcon} onClick={() => setOpenSearch(!openSearch)}/>
                </div>
                <div className="dropUp">
                    <div className="custom-select-wrapper d-flex align-items-center">
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
                </div>
            </div>
        </div>
            <div className="all-customer-wrapper">
                <div className="all-customer-data">
                    <div className="customer-table">
                        <Table responsive>
                            <thead>
                            <tr>
                                <th className="cursor-pointer" onClick={()=>handleSorting("NAME")}>Name</th>
                                {/* <th onClick={() => handleSorting()}>Date <img height="12" width="12" src={OrderByIcon}></img></th> */}
                                <th className="cursor-pointer" onClick={()=>handleSorting("PRODUCER")}>Producer</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("VINTAGE")}>Vintage</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("REGION")}>Region</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("SUBREGION")}>Sub Region</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("COUNTRY")}>Country</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("BOTTLE_PRICE")}>Bottle Price</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("CASE_SIZE")}>Case Size</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("CASE_PRICE")}>Case Price</th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    search ? (
                                        allVendorList && allVendorList.length > 0 ? (
                                            allVendorList.filter((data) => {
                                                if(
                                                    data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase()) ||
                                                    data.VINTAGE && data.VINTAGE.toLowerCase().includes(search.toLowerCase())
                                                ) {
                                                    return data;
                                                }
                                            }).map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{value.NAME ? value.NAME : "-"}</td>
                                                        <td>{value.PRODUCER ? value.PRODUCER : "-"}</td>
                                                        <td>{value.VINTAGE ? value.VINTAGE : "-"}</td>
                                                        <td>{value.REGION ? value.REGION : "-"}</td>
                                                        <td>{value.SUBREGION ? value.SUBREGION : "-"}</td>
                                                        <td>{value.COUNTRY ? value.COUNTRY : "-"}</td>
                                                        <td>{value.BOTTLE_PRICE ? value.BOTTLE_PRICE : "-"}</td>
                                                        <td>{value.CASE_SIZE ? value.CASE_SIZE : "-"}</td>
                                                        <td>{value.CASE_PRICE ? value.CASE_PRICE : "-"}</td>
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
                                                    <td>{value.NAME ? value.NAME : "-"}</td>
                                                    <td>{value.PRODUCER ? value.PRODUCER : "-"}</td>
                                                    <td>{value.VINTAGE ? value.VINTAGE : "-"}</td>
                                                    <td>{value.REGION ? value.REGION : "-"}</td>
                                                    <td>{value.SUBREGION ? value.SUBREGION : "-"}</td>
                                                    <td>{value.COUNTRY ? value.COUNTRY : "-"}</td>
                                                    <td>{value.BOTTLE_PRICE ? value.BOTTLE_PRICE : "-"}</td>
                                                    <td>{value.CASE_SIZE ? value.CASE_SIZE : "-"}</td>
                                                    <td>{value.CASE_PRICE ? value.CASE_PRICE : "-"}</td>
                                                </tr>
                                            )
                                        })
                                    ) : ("")
                                }
                                {
                                    loadingData ? (
                                        <tr>
                                            <td colSpan="8" className="text-center">Loading...</td>
                                        </tr>
                                    ) :
                                    ("")
                                }
                                {
                                    vendorList && vendorList.length===0 && loadingData===false && !search? (
                                        <tr>
                                            <td colSpan="8" className="text-center">No Vendors found!</td>
                                        </tr>
                                    ) :
                                    ("")
                                }
                                {
                                    search ? (allVendorList ? (allVendorList.filter((data) => {
                                    if(
                                        data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase()) ||
                                        data.VINTAGE && data.VINTAGE.toLowerCase().includes(search.toLowerCase())
                                    ) {
                                        return data;
                                    }
                                    }).length>0) ? "":
                                    (<tr>
                                        <td colSpan="8" className="text-center">No Data Found!</td>
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
                                            data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase()) ||
                                            data.VINTAGE && data.VINTAGE.toLowerCase().includes(search.toLowerCase())
                                        ) {
                                            return data;
                                        }
                                    }).map((value, index) => {
                                        return (
                                            <div className="mobile-table-list">
                                                <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                    <div className="th">
                                                        <label onClick={()=>handleSorting("NAME")}>Name</label>
                                                        <span>{value.NAME ? value.NAME : ""}</span>
                                                    </div>
                                                    <div className="th">
                                                        <label onClick={()=>handleSorting("VINTAGE")}>Vintage</label>
                                                        <span>{value.VINTAGE ? value.VINTAGE : ""}</span>
                                                    </div>
                                                </div>
                                                <div className="mobile-table-td">
                                                    <div className="mobile-table-td-row">
                                                        <div className="td-list d-flex justify-content-between">
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("BOTTLE_PRICE")}>Bottle Price</label>
                                                                <span>{value.BOTTLE_PRICE ? value.BOTTLE_PRICE : ""}</span>
                                                            </div>
                                                            <div className="product-td d-flex">
                                                                <div className="product-td-name">
                                                                    <label onClick={()=>handleSorting("CASE_SIZE")}>Case Size</label>
                                                                    <span>{value.CASE_SIZE ? value.CASE_SIZE : ""}</span>
                                                                </div>
                                                            </div>
                                                            <div className="td">
                                                                <div className="shipping-option">
                                                                    <label onClick={()=>handleSorting("CASE_PRICE")}>Case Price</label>
                                                                    <span>{value.CASE_PRICE ? value.CASE_PRICE : "-"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={()=>handleSorting("PRODUCER")}>Producer</label>
                                                    <span>{value.PRODUCER ? value.PRODUCER : ""}</span>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={()=>handleSorting("REGION")}>Region</label>
                                                    <span>{value.REGION ? value.REGION : ""}</span>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={()=>handleSorting("SUBREGION")}>Sub Region</label>
                                                    <span>{value.SUBREGION ? value.SUBREGION : ""}</span>
                                                </div>
                                                <div className="mobile-table-footer text-right">
                                                    <label onClick={()=>handleSorting("COUNTRY")}>Country</label>
                                                    <span>{value.COUNTRY ? value.COUNTRY : ""}</span>
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
                                                <div className="mobile-table-list">
                                                    <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                        <div className="th">
                                                            <label onClick={()=>handleSorting("NAME")}>Name</label>
                                                            <span>{value.NAME ? value.NAME : ""}</span>
                                                        </div>
                                                        <div className="th">
                                                            <label onClick={()=>handleSorting("VINTAGE")}>Vintage</label>
                                                            <span>{value.VINTAGE ? value.VINTAGE : ""}</span>
                                                        </div>
                                                    </div>
                                                    <div className="mobile-table-td">
                                                        <div className="mobile-table-td-row">
                                                            <div className="td-list d-flex justify-content-between">
                                                                <div className="td">
                                                                    <label onClick={()=>handleSorting("BOTTLE_PRICE")}>Bottle Price</label>
                                                                    <span>{value.BOTTLE_PRICE ? value.BOTTLE_PRICE : ""}</span>
                                                                </div>
                                                                <div className="product-td d-flex">
                                                                    <div className="product-td-name">
                                                                        <label onClick={()=>handleSorting("CASE_SIZE")}>Case Size</label>
                                                                        <span>{value.CASE_SIZE ? value.CASE_SIZE : ""}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="td">
                                                                    <div className="shipping-option">
                                                                        <label onClick={()=>handleSorting("CASE_PRICE")}>Case Price</label>
                                                                        <span>{value.CASE_PRICE ? value.CASE_PRICE : "-"}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={()=>handleSorting("PRODUCER")}>Producer</label>
                                                        <span>{value.PRODUCER ? value.PRODUCER : ""}</span>
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={()=>handleSorting("REGION")}>Region</label>
                                                        <span>{value.REGION ? value.REGION : ""}</span>
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={()=>handleSorting("SUBREGION")}>Sub Region</label>
                                                        <span>{value.SUBREGION ? value.SUBREGION : ""}</span>
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={()=>handleSorting("COUNTRY")}>Country</label>
                                                        <span>{value.COUNTRY ? value.COUNTRY : ""}</span>
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
                                        data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase()) ||
                                        data.VINTAGE && data.VINTAGE.toLowerCase().includes(search.toLowerCase())
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
                                        <input type="text" className="text-input" value = {primaryContact?primaryContact:""} onChange = {(e) => {setError("");setPrimaryContact(e.target.value)}} required></input>
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
                                                        <span className={areaCode === "+44" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setAreaCode('+44'); setIsAreaCodeOpen(false)}}>+44</span>
                                                        <span className={areaCode === "+1" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setAreaCode('+1'); setIsAreaCodeOpen(false)}}>+1</span>
                                                        <span className={areaCode === "+92" ? "custom-option selected":"custom-option"} data-value="volvo" onClick={() => { setAreaCode('+92'); setIsAreaCodeOpen(false)}}>+92</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Phone:</label>
                                        <input type="text" className="text-input" value = {vendorPhone?vendorPhone:""} onChange = {(e) => {setError("");setVendorPhone(e.target.value)}} required></input>
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
                                                        <span className={region === "US" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setRegion('US'); setIsRegionOpen(false)}}>US</span>
                                                        <span className={region === "UK"? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setRegion('UK'); setIsRegionOpen(false)}}>UK</span>
                                                        <span className={region === "FR" ? "custom-option selected":"custom-option"} data-value="volvo" onClick={() => {setRegion('FR'); setIsRegionOpen(false)}}>FR</span>
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
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        <span className={vendorType === "1" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setVendorType('1'); setIsVendorTypeOpen(false)}}>Retail</span>
                                                        <span className={vendorType === "2"? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setVendorType('2'); setIsVendorTypeOpen(false)}}>Wholesale</span>
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
                                                        <span className={currency === "USD" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setCurrency('USD'); setIsCurrencyOpen(false)}}>USD</span>
                                                        <span className={currency === "GBP" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setCurrency('GBP'); setIsCurrencyOpen(false)}}>GBP</span>
                                                        <span className={currency === "EUR" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setCurrency('EUR'); setIsCurrencyOpen(false)}}>EUR</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label></label>
                                        <span className="error-text">{error}</span>
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

export default connect(null,{logout})(VendorInventory);
