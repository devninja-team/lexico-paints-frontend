import React from "react";
import {
    NavLink
} from "react-router-dom";
import './index.scss';
import {useSelector} from "react-redux";
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
import editIcon from '../../assets/images/edit-icon.svg';
import Select from 'react-select';
    
const VendorTier = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const route = useSelector(state => state.route);

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
    const[vendorInfoModal,setVendorInfoModal] = useState(false);
    const [success, setSuccess] = useState();
    const [showVendorModal, setShowVendorModal] = useState(false);
    const [editMPFlag, setEditMPFlag] = useState("");
    const [editVendorId,setEditVendorId] = useState("");

    const [selectedMPFlag,setSelectedMPFlag] = useState(null);
    const [selectedVendorStatus,setSelectedVendorStatus] = useState(null);
    const [selectedStockQuality,setSelectedStockQuality] = useState(null);
    const [selectedInventoryRating,setSelectedInventoryRating] = useState(null);
    const [selectedShippingRating,setSelectedShippingRating] = useState(null);
    const [selectedBusinessRelation,setSelectedBusinessRelation] = useState(null);
    
        
    //sorting vars
    const[sortOrder,setSortOrder] = useState('asc');

    //filters vars
    const [duration, setDuration] = useState("");
    const [typeDropDownValue, setTypeDropDownValue] = useState("");
    const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
    const [isOrderFilterOpen, setIsOrderFilterOpen] = useState(false);
    const [orderDropDownValue, setOrderDropDownValue] = useState("");
    
    useEffect(() => {
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
        localStorage.setItem('customer_type','Vendor');
        history.push('/accountinfo/communication');
    }
    const fetchVendors = () => {
        if(window.screen.width<=480) {
            setLastPage(5);
        }
        setLoadingData(true);
        axios
        .post("/publish/vendors"+query,{
        }).then((res) => {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            let arrayVendorList = [];
            if(res.data.vendors) {
                setAllVendorList(res.data.vendors);
                setVendorList(res.data.vendors.slice(indexOfFirstPage,indexOfLastPost));
                setLoadingData(false);
                for(let i=1; i<=Math.ceil(res.data.vendors.length/postsPerPage);i++) {
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
        setSuccess("");
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
    const handleEditVendor = (e) => {
        setError('');
        setSuccess("");
        e.preventDefault();
        console.log("mp_flag",selectedMPFlag.value?selectedMPFlag.value:"")
        console.log("mp_flag",selectedVendorStatus.value?selectedVendorStatus.value:"")
        console.log("mp_flag",selectedStockQuality.value?selectedStockQuality.value:"")
        console.log("mp_flag",selectedInventoryRating.value?selectedInventoryRating.value:"")
        console.log("mp_flag",selectedShippingRating.value?selectedShippingRating.value:"")
        console.log("mp_flag",selectedBusinessRelation.value?selectedBusinessRelation.value:"")
        if( selectedMPFlag!=null && selectedVendorStatus!=null && selectedStockQuality!=null&&
            selectedInventoryRating!=null && selectedShippingRating!=null && selectedBusinessRelation!=null) {
                axios.post('/publish/vendor_edit'+query,{
                    vid: editVendorId,
                    mp_flag: selectedMPFlag.value?selectedMPFlag.value:"",
                    status: selectedVendorStatus.value?selectedVendorStatus.value:"",
                    stock_quality: selectedStockQuality.value?selectedStockQuality.value:"",
                    inventory_rating: selectedInventoryRating.value?selectedInventoryRating.value:"",
                    shipping_rating: selectedShippingRating.value?selectedShippingRating.value:"",
                    business_relation:selectedBusinessRelation.value?selectedBusinessRelation.value:"",
                }).then((res) => {
                    console.log(res.data)
                    if(res.data.message === "vendor updated") {
                        setError("");
                        fetchVendors();
                        setSuccess("Vendor Updated Successfully!");
                        // setSelectedMPFlag(null);
                        // setSelectedVendorStatus(null);
                        // setSelectedStockQuality(null);
                        // setSelectedInventoryRating(null);
                        // setSelectedShippingRating(null);
                        // setSelectedBusinessRelation(null);
                        
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
        } else {
            setSuccess("");
            setError("Please select required fields");
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
                            case "VENDOR_NAME" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_NAME?a.VENDOR_NAME.toLowerCase():""
                                    var nameB=b.VENDOR_NAME?b.VENDOR_NAME.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_CODE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_CODE?a.VENDOR_CODE.toLowerCase():""
                                    var nameB=b.VENDOR_CODE?b.VENDOR_CODE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_CURRENCY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_CURRENCY?a.VENDOR_CURRENCY.toLowerCase():""
                                    var nameB=b.VENDOR_CURRENCY?b.VENDOR_CURRENCY.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "STOCK_QUALITY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.STOCK_QUALITY?a.STOCK_QUALITY.toLowerCase():""
                                    var nameB=b.STOCK_QUALITY?b.STOCK_QUALITY.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "LOCATION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.LOCATION?a.LOCATION.toLowerCase():""
                                    var nameB=b.LOCATION?b.LOCATION.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "MP_FLAG" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.MP_FLAG?parseFloat(a.MP_FLAG):""
                                    var nameB=b.MP_FLAG?parseFloat(b.MP_FLAG):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_ACTIVE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_ACTIVE?parseFloat(a.VENDOR_ACTIVE):""
                                    var nameB=b.VENDOR_ACTIVE?parseFloat(b.VENDOR_ACTIVE):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SHIPPING_RULE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.SHIPPING_RULE?a.SHIPPING_RULE.toLowerCase():""
                                    var nameB=b.SHIPPING_RULE?b.SHIPPING_RULE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_RATING" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_RATING?parseFloat(a.VENDOR_RATING.toLowerCase()):""
                                    var nameB=b.VENDOR_RATING?parseFloat(b.VENDOR_RATING.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "INVENTORY_RATING" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.INVENTORY_RATING?parseFloat(a.INVENTORY_RATING.toLowerCase()):""
                                    var nameB=b.INVENTORY_RATING?parseFloat(b.INVENTORY_RATING.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SHIPPING_RATING" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.SHIPPING_RATING?parseFloat(a.SHIPPING_RATING.toLowerCase()):""
                                    var nameB=b.SHIPPING_RATING?parseFloat(b.SHIPPING_RATING.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "BUSINESS_RELATION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.BUSINESS_RELATION?parseFloat(a.BUSINESS_RELATION):""
                                    var nameB=b.BUSINESS_RELATION?parseFloat(b.BUSINESS_RELATION):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "TIER" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.TIER?a.TIER.toLowerCase():""
                                    var nameB=b.TIER?b.TIER.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "FAMILY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.FAMILY?a.FAMILY.toLowerCase():""
                                    var nameB=b.FAMILY?b.FAMILY.toLowerCase():""
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
                            case "VENDOR_NAME" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_NAME?a.VENDOR_NAME.toLowerCase():""
                                    var nameB=b.VENDOR_NAME?b.VENDOR_NAME.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_CODE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_CODE?a.VENDOR_CODE.toLowerCase():""
                                    var nameB=b.VENDOR_CODE?b.VENDOR_CODE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_CURRENCY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_CURRENCY?a.VENDOR_CURRENCY.toLowerCase():""
                                    var nameB=b.VENDOR_CURRENCY?b.VENDOR_CURRENCY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "STOCK_QUALITY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.STOCK_QUALITY?a.STOCK_QUALITY.toLowerCase():""
                                    var nameB=b.STOCK_QUALITY?b.STOCK_QUALITY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "LOCATION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.LOCATION?a.LOCATION.toLowerCase():""
                                    var nameB=b.LOCATION?b.LOCATION.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "MP_FLAG" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.MP_FLAG?parseFloat(a.MP_FLAG):""
                                    var nameB=b.MP_FLAG?parseFloat(b.MP_FLAG):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_ACTIVE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_ACTIVE?parseFloat(a.VENDOR_ACTIVE):""
                                    var nameB=b.VENDOR_ACTIVE?parseFloat(b.VENDOR_ACTIVE):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SHIPPING_RULE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.SHIPPING_RULE?a.SHIPPING_RULE.toLowerCase():""
                                    var nameB=b.SHIPPING_RULE?b.SHIPPING_RULE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_RATING" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_RATING?parseFloat(a.VENDOR_RATING.toLowerCase()):""
                                    var nameB=b.VENDOR_RATING?parseFloat(b.VENDOR_RATING.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "INVENTORY_RATING" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.INVENTORY_RATING?parseFloat(a.INVENTORY_RATING.toLowerCase()):""
                                    var nameB=b.INVENTORY_RATING?parseFloat(b.INVENTORY_RATING.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SHIPPING_RATING" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.SHIPPING_RATING?parseFloat(a.SHIPPING_RATING.toLowerCase()):""
                                    var nameB=b.SHIPPING_RATING?parseFloat(b.SHIPPING_RATING.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "BUSINESS_RELATION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.BUSINESS_RELATION?parseFloat(a.BUSINESS_RELATION):""
                                    var nameB=b.BUSINESS_RELATION?parseFloat(b.BUSINESS_RELATION):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "TIER" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.TIER?a.TIER.toLowerCase():""
                                    var nameB=b.TIER?b.TIER.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "FAMILY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.FAMILY?a.FAMILY.toLowerCase():""
                                    var nameB=b.FAMILY?b.FAMILY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
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
                            case "VENDOR_NAME" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_NAME?a.VENDOR_NAME.toLowerCase():""
                                    var nameB=b.VENDOR_NAME?b.VENDOR_NAME.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_CODE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_CODE?a.VENDOR_CODE.toLowerCase():""
                                    var nameB=b.VENDOR_CODE?b.VENDOR_CODE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_CURRENCY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_CURRENCY?a.VENDOR_CURRENCY.toLowerCase():""
                                    var nameB=b.VENDOR_CURRENCY?b.VENDOR_CURRENCY.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "STOCK_QUALITY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.STOCK_QUALITY?a.STOCK_QUALITY.toLowerCase():""
                                    var nameB=b.STOCK_QUALITY?b.STOCK_QUALITY.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "LOCATION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.LOCATION?a.LOCATION.toLowerCase():""
                                    var nameB=b.LOCATION?b.LOCATION.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "MP_FLAG" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.MP_FLAG?parseFloat(a.MP_FLAG):""
                                    var nameB=b.MP_FLAG?parseFloat(b.MP_FLAG):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_ACTIVE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_ACTIVE?parseFloat(a.VENDOR_ACTIVE):""
                                    var nameB=b.VENDOR_ACTIVE?parseFloat(b.VENDOR_ACTIVE):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SHIPPING_RULE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.SHIPPING_RULE?a.SHIPPING_RULE.toLowerCase():""
                                    var nameB=b.SHIPPING_RULE?b.SHIPPING_RULE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_RATING" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_RATING?parseFloat(a.VENDOR_RATING.toLowerCase()):""
                                    var nameB=b.VENDOR_RATING?parseFloat(b.VENDOR_RATING.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "INVENTORY_RATING" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.INVENTORY_RATING?parseFloat(a.INVENTORY_RATING.toLowerCase()):""
                                    var nameB=b.INVENTORY_RATING?parseFloat(b.INVENTORY_RATING.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SHIPPING_RATING" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.SHIPPING_RATING?parseFloat(a.SHIPPING_RATING.toLowerCase()):""
                                    var nameB=b.SHIPPING_RATING?parseFloat(b.SHIPPING_RATING.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "BUSINESS_RELATION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.BUSINESS_RELATION?parseFloat(a.BUSINESS_RELATION):""
                                    var nameB=b.BUSINESS_RELATION?parseFloat(b.BUSINESS_RELATION):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "TIER" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.TIER?a.TIER.toLowerCase():""
                                    var nameB=b.TIER?b.TIER.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "FAMILY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.FAMILY?a.FAMILY.toLowerCase():""
                                    var nameB=b.FAMILY?b.FAMILY.toLowerCase():""
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
    
                            case "VENDOR_NAME" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_NAME?a.VENDOR_NAME.toLowerCase():""
                                    var nameB=b.VENDOR_NAME?b.VENDOR_NAME.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_CODE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_CODE?a.VENDOR_CODE.toLowerCase():""
                                    var nameB=b.VENDOR_CODE?b.VENDOR_CODE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_CURRENCY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_CURRENCY?a.VENDOR_CURRENCY.toLowerCase():""
                                    var nameB=b.VENDOR_CURRENCY?b.VENDOR_CURRENCY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "STOCK_QUALITY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.STOCK_QUALITY?a.STOCK_QUALITY.toLowerCase():""
                                    var nameB=b.STOCK_QUALITY?b.STOCK_QUALITY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "LOCATION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.LOCATION?a.LOCATION.toLowerCase():""
                                    var nameB=b.LOCATION?b.LOCATION.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "MP_FLAG" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.MP_FLAG?parseFloat(a.MP_FLAG):""
                                    var nameB=b.MP_FLAG?parseFloat(b.MP_FLAG):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_ACTIVE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_ACTIVE?parseFloat(a.VENDOR_ACTIVE):""
                                    var nameB=b.VENDOR_ACTIVE?parseFloat(b.VENDOR_ACTIVE):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SHIPPING_RULE" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.SHIPPING_RULE?a.SHIPPING_RULE.toLowerCase():""
                                    var nameB=b.SHIPPING_RULE?b.SHIPPING_RULE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_RATING" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.VENDOR_RATING?parseFloat(a.VENDOR_RATING.toLowerCase()):""
                                    var nameB=b.VENDOR_RATING?parseFloat(b.VENDOR_RATING.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "INVENTORY_RATING" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.INVENTORY_RATING?parseFloat(a.INVENTORY_RATING.toLowerCase()):""
                                    var nameB=b.INVENTORY_RATING?parseFloat(b.INVENTORY_RATING.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SHIPPING_RATING" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.SHIPPING_RATING?parseFloat(a.SHIPPING_RATING.toLowerCase()):""
                                    var nameB=b.SHIPPING_RATING?parseFloat(b.SHIPPING_RATING.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "BUSINESS_RELATION" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.BUSINESS_RELATION?parseFloat(a.BUSINESS_RELATION):""
                                    var nameB=b.BUSINESS_RELATION?parseFloat(b.BUSINESS_RELATION):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "TIER" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.TIER?a.TIER.toLowerCase():""
                                    var nameB=b.TIER?b.TIER.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "FAMILY" :
                                sortedArray = allVendorList.sort( function(a, b) {
                                    var nameA=a.FAMILY?a.FAMILY.toLowerCase():""
                                    var nameB=b.FAMILY?b.FAMILY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
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
        setInitialPage(0);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        setAllVendorList([]);
        setVendorList([]);
        setLoadingData(true);
        axios
        .post("/accounts/vendors"+query, {
            last_contacted, vendor_type, order_type
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
            dispatch(setSession());
            const server_code = error.response.status;
            const server_message = error.response.statusText;
            if(server_code && server_message) {
                setSessionMessage(server_message);
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
    const handleViewVendor = () => {
        localStorage.setItem("customer_id",vendorId);
        localStorage.setItem("customer_type","Vendor");
        history.push("/accountinfo/communication");
    }
    const handleVendorInventory = (id) => {
        localStorage.setItem("vendor_inventory",id);
        history.push("/vendor-inventory")
    }
    const handleSwitch = (path) => {
        history.push(path);
    }
    const handleFillForm = (item) => {
        setError("");
        setSuccess("");

        setEditVendorId(item.VENDOR_ID?item.VENDOR_ID:"");
        //fill values
        if(item.MP_FLAG) {
            setSelectedMPFlag({
                value: item.MP_FLAG?item.MP_FLAG:"",
                label: item.MP_FLAG=="1" ? "Yes" : "No",
            });
        }

        if(item.VENDOR_ACTIVE) {
            setSelectedVendorStatus({
                value: item.VENDOR_ACTIVE?item.VENDOR_ACTIVE:"",
                label: item.VENDOR_ACTIVE=="1" ? "Active" : "Not Active",
            });
        }
        if(item.STOCK_QUALITY) {
            setSelectedStockQuality({
                value: item.STOCK_QUALITY?item.STOCK_QUALITY:"",
                label: item.STOCK_QUALITY?item.STOCK_QUALITY:""
            });
        }
        if(item.SHIPPING_RATING) {
            setSelectedShippingRating({
                value: item.SHIPPING_RATING?item.SHIPPING_RATING:"",
                label: item.SHIPPING_RATING?item.SHIPPING_RATING:""
            });
        }
        if(item.BUSINESS_RELATION) {
            setSelectedBusinessRelation({
                value: item.BUSINESS_RELATION ? item.BUSINESS_RELATION:"",
                label: item.BUSINESS_RELATION=="1" ? "Yes" : "No",
            });
        }
        if(item.INVENTORY_RATING) {
            setSelectedInventoryRating({
                value: item.INVENTORY_RATING?item.INVENTORY_RATING:"",
                label: item.INVENTORY_RATING?item.INVENTORY_RATING:""
            });
        }

        setShowVendorModal(true);
    }
    
    return (
        <div className="transaction-page">
            <div className="customers-content">
                <div className="top-head d-flex align-items-end">
                    <div className="title d-flex justify-content-start align-items-center">
                        <h1 className="mb-0 font-35">Publish Parameters</h1>
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
            {/* <div className="customer-data-head-filter d-flex justify-content-end align-items-center border-bottom-0 mb-2">
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
            </div> */}
            {/* <div className="customer-data-head-filter d-flex justify-content-end align-items-center border-bottom-0 mb-2">
                <div className="customer-title">
                    Vendor Type :
                </div>
                <div className="data-filter">
                <div className="dropUp">
                    <div className="custom-select-wrapper d-flex align-items-center">
                        <div className={isTypeFilterOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                            <div className="custom-select__trigger" onClick={()=>setIsTypeFilterOpen(!isTypeFilterOpen)}>
                                <span>{typeDropDownValue ? typeDropDownValue : "ALL"}</span>
                                <div className="arrow">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="custom-options">
                                <span className={typeDropDownValue === "Retail" ? "custom-option selected":"custom-option"} onClick={() => {setTypeDropDownValue("Retail"); handleFilter("1", "type-filter"); setIsTypeFilterOpen(false)}}>Retail</span>
                                <span className={typeDropDownValue === "Wholesale" ? "custom-option selected":"custom-option"} onClick={() => {setTypeDropDownValue("Wholesale"); handleFilter("2", "type-filter");setIsTypeFilterOpen(false)}}>Wholesale</span>
                                <span className={typeDropDownValue === "Investment" ? "custom-option selected":"custom-option"} onClick={() => {setTypeDropDownValue("Investment"); handleFilter("3", "type-filter");setIsTypeFilterOpen(false)}}>Investment</span>
                                <span className={typeDropDownValue === "Logistics" ? "custom-option selected":"custom-option"} onClick={() => {setTypeDropDownValue("Logistics"); handleFilter("4", "type-filter");setIsTypeFilterOpen(false)}}>Logistics</span>
                                <span className={typeDropDownValue === "Winery" ? "custom-option selected":"custom-option"}  onClick={() => {setTypeDropDownValue("Winery"); handleFilter("5", "type-filter");setIsTypeFilterOpen(false)}}>Winery</span>
                                <span className={typeDropDownValue === "" ? "custom-option selected":"custom-option"}  onClick={() => {setTypeDropDownValue(""); handleFilter("", "type-filter");setIsTypeFilterOpen(false)}}>ALL</span>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div> */}
            {/* <div className="customer-data-head-filter d-flex justify-content-end align-items-center border-bottom-0">
                <div className="customer-title">
                    Order Type :
                </div>
                <div className="data-filter">
                <div className="dropUp">
                    <div className="custom-select-wrapper d-flex align-items-center">
                        <div className={isOrderFilterOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                            <div className="custom-select__trigger" onClick={()=>setIsOrderFilterOpen(!isOrderFilterOpen)}>
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
                                <span className={orderDropDownValue === "" ? "custom-option selected":"custom-option"}  onClick={() => {setOrderDropDownValue(""); handleFilter("", "order-filter");setIsOrderFilterOpen(false)}}>ALL</span>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            </div> */}
            <div className="account-info-tabs d-flex justify-content-center ml-0">
                <div className="account-tabs-row d-flex align-items-center">
                    <a className={route === "/parameter/tier" ? "account-tab-list active":"account-tab-list" } onClick={() => {handleSwitch("/parameter/tier")}}>Vendor Tier</a>
                    <a className={route === "/parameter/control" ? "account-tab-list active":"account-tab-list" }>Case Size Control</a>
                    <a className={route === "/parameter/exception" ? "account-tab-list active":"account-tab-list" } onClick={() => {handleSwitch("/parameter/exception")}}>Market Exceptions</a>
                    <a className={route === "/parameter/vendor-exception" ? "account-tab-list active":"account-tab-list" } onClick={() => {handleSwitch("/parameter/vendor-exception")}}>Vendor Exceptions</a>

                </div>
            </div>
            <div className="all-customer-wrapper">
                <div className="all-customer-data">
                    <div className="customer-table">
                        <Table responsive>
                            <thead>
                            <tr>
                                <th className="cursor-pointer" onClick={()=>handleSorting("VENDOR_NAME")}>Vendor Name</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("VENDOR_CODE")}>Vendor Code</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("VENDOR_CURRENCY")}>Vendor Currency</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("LOCATION")}>Location</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("MP_FLAG")}>MP Flag</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("VENDOR_ACTIVE")}>Vendor Status</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("STOCK_QUALITY")}>Stock Quality</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("INVENTORY_RATING")}>Inventory Rating</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("SHIPPING_RATING")}>Shipping Rating</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("BUSINESS_RELATION")}>Business Relation</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("TIER")}>Tier</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("FAMILY")}>Family</th>
                                <th>Edit</th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    search ? (
                                        allVendorList && allVendorList.length > 0 ? (
                                            allVendorList.filter((data) => {
                                                if(
                                                    data.VENDOR_NAME && data.VENDOR_NAME.toLowerCase().includes(search.toLowerCase())||
                                                    data.VENDOR_CODE && data.VENDOR_CODE.toLowerCase().includes(search.toLowerCase())
                                                ) {
                                                    return data;
                                                }
                                            }).map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{value.VENDOR_NAME ? value.VENDOR_NAME : "-"}</td>
                                                        <td>{value.VENDOR_CODE ? value.VENDOR_CODE : "-"}</td>
                                                        <td>{value.VENDOR_CURRENCY ? value.VENDOR_CURRENCY : "-"}</td>
                                                        <td>{value.LOCATION ? value.LOCATION : "-"}</td>
                                                        <td>{value.MP_FLAG ? (value.MP_FLAG=="1" ? "Yes" : "No") : "-"}</td>
                                                        <td>{value.VENDOR_ACTIVE ? (value.VENDOR_ACTIVE === "1" ? "Active" : "Not Active") : "-"}</td>
                                                        <td>{value.STOCK_QUALITY ? value.STOCK_QUALITY : "-"}</td>
                                                        <td>{value.INVENTORY_RATING ? value.INVENTORY_RATING : "-"}</td>
                                                        <td>{value.SHIPPING_RATING ? value.SHIPPING_RATING : "-"}</td>
                                                        <td>{value.BUSINESS_RELATION ? (value.BUSINESS_RELATION == "1" ? "Yes" : "No") : "-"}</td>
                                                        <td>{value.TIER ? value.TIER : "-"}</td>
                                                        <td>{value.FAMILY ? value.FAMILY : "-"}</td>
                                                        <td><img src={editIcon} className="cursor-pointer" onClick={() => handleFillForm(value)}/></td>
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
                                                    <td>{value.VENDOR_NAME ? value.VENDOR_NAME : "-"}</td>
                                                    <td>{value.VENDOR_CODE ? value.VENDOR_CODE : "-"}</td>
                                                    <td>{value.VENDOR_CURRENCY ? value.VENDOR_CURRENCY : "-"}</td>
                                                    <td>{value.LOCATION ? value.LOCATION : "-"}</td>
                                                    <td>{value.MP_FLAG ? (value.MP_FLAG=="1" ? "Yes" : "No") : "-"}</td>
                                                    <td>{value.VENDOR_ACTIVE ? (value.VENDOR_ACTIVE === "1" ? "Active" : "Not Active") : "-"}</td>
                                                    <td>{value.STOCK_QUALITY ? value.STOCK_QUALITY : "-"}</td>
                                                    <td>{value.INVENTORY_RATING ? value.INVENTORY_RATING : "-"}</td>
                                                    <td>{value.SHIPPING_RATING ? value.SHIPPING_RATING : "-"}</td>
                                                    <td>{value.BUSINESS_RELATION ? (value.BUSINESS_RELATION == "1" ? "Yes" : "No") : "-"}</td>
                                                    <td>{value.TIER ? value.TIER : "-"}</td>
                                                    <td>{value.FAMILY ? value.FAMILY : "-"}</td>
                                                    <td><img src={editIcon} className="cursor-pointer" onClick={() => handleFillForm(value)}/></td>
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
                                    vendorList && vendorList.length===0 && loadingData===false && !search? (
                                        <tr>
                                            <td colSpan="12" className="text-center">No Tier found!</td>
                                        </tr>
                                    ) :
                                    ("")
                                }
                                {
                                    search ? (allVendorList ? (allVendorList.filter((data) => {
                                    if(
                                        data.VENDOR_NAME && data.VENDOR_NAME.toLowerCase().includes(search.toLowerCase())||
                                        data.VENDOR_CODE && data.VENDOR_CODE.toLowerCase().includes(search.toLowerCase())
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
                                    allVendorList && allVendorList.length > 0 ? (
                                        allVendorList.filter((data) => {
                                            if(
                                                data.VENDOR_NAME && data.VENDOR_NAME.toLowerCase().includes(search.toLowerCase())||
                                                data.VENDOR_CODE && data.VENDOR_CODE.toLowerCase().includes(search.toLowerCase())
                                            ) {
                                                return data;
                                            }
                                        }).map((value, index) => {
                                            return (
                                                <div className="mobile-table-list">
                                                    <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                        <div className="th">
                                                            <label onClick={()=>handleSorting("VENDOR_NAME")}>Vendor Name</label>
                                                            <span>{value.VENDOR_NAME ? value.VENDOR_NAME: "-"}</span>
                                                        </div>
                                                        <div className="th">
                                                            <label onClick={()=>handleSorting("VENDOR_CURRENCY")}>Vendor Currency</label>
                                                            <span>{value.VENDOR_CURRENCY ? value.VENDOR_CURRENCY: "-"}</span>
                                                        </div>
                                                        <div className="th">
                                                            <label></label>
                                                            <img src={editIcon} onClick={() => handleFillForm(value)}></img>
                                                        </div>
                                                    </div>
                                                    <div className="mobile-table-td">
                                                        <div className="mobile-table-td-row">
                                                            <div className="td-list d-flex justify-content-between">
                                                                <div className="td">
                                                                    <label onClick={()=>handleSorting("STOCK_QUALITY")}>Stock Quality</label>
                                                                    <span><strong>{value.STOCK_QUALITY ? value.STOCK_QUALITY : "-"}</strong></span>
                                                                </div>
                                                                <div className="td">
                                                                    <label onClick={()=>handleSorting("LOCATION")}>Location</label>
                                                                    <span><strong>{value.LOCATION ? value.LOCATION : "-"}</strong></span>
                                                                </div>
                                                                <div className="td">
                                                                    <label onClick={()=>handleSorting("MP_FLAG")}>MP Flag</label>
                                                                    <span><strong>{value.MP_FLAG ? (value.MP_FLAG == "1" ? "Yes" : "No") : "-"}</strong></span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={()=>handleSorting("VENDOR_CODE")}>Vendor Code</label>
                                                        <span>{value.VENDOR_CODE ? value.VENDOR_CODE: "-"}</span>
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={()=>handleSorting("VENDOR_ACTIVE")}>Vendor Status</label>
                                                        <span>{value.VENDOR_ACTIVE ? (value.VENDOR_ACTIVE?"Active":"Not Active") : "-"}</span>
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={()=>handleSorting("INVENTORY_RATING")}>Inventory Rating</label>
                                                        <span>{value.INVENTORY_RATING ? value.INVENTORY_RATING : "-"}</span>
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={()=>handleSorting("SHIPPING_RATING")}>Shipping Rating</label>
                                                        <span>{value.SHIPPING_RATING ? value.SHIPPING_RATING : "-"}</span>
                                                    </div>

                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={()=>handleSorting("BUSINESS_RELATION")}>Business Relatin</label>
                                                        <span>{value.BUSINESS_RELATION ? (value.BUSINESS_RELATION=="1" ? "Yes" : "No") : "-"}</span>
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={()=>handleSorting("TIER")}>Tier</label>
                                                        <span>{value.TIER ? value.TIER : "-"}</span>
                                                    </div>
                                                    <div className="mobile-table-footer text-right">
                                                        <label onClick={()=>handleSorting("FAMILY")}>Family</label>
                                                        <span>{value.FAMILY ? value.FAMILY : "-"}</span>
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
                                                                <label onClick={()=>handleSorting("VENDOR_NAME")}>Vendor Name</label>
                                                                <span>{value.VENDOR_NAME ? value.VENDOR_NAME: "-"}</span>
                                                            </div>
                                                            <div className="th">
                                                                <label onClick={()=>handleSorting("VENDOR_CURRENCY")}>Vendor Currency</label>
                                                                <span>{value.VENDOR_CURRENCY ? value.VENDOR_CURRENCY: "-"}</span>
                                                            </div>
                                                            <div className="th">
                                                                <label></label>
                                                                <img src={editIcon} onClick={() => handleFillForm(value)}></img>
                                                            </div>
                                                        </div>
                                                        <div className="mobile-table-td">
                                                            <div className="mobile-table-td-row">
                                                                <div className="td-list d-flex justify-content-between">
                                                                    <div className="td">
                                                                        <label onClick={()=>handleSorting("STOCK_QUALITY")}>Stock Quality</label>
                                                                        <span><strong>{value.STOCK_QUALITY ? value.STOCK_QUALITY : "-"}</strong></span>
                                                                    </div>
                                                                    <div className="td">
                                                                        <label onClick={()=>handleSorting("LOCATION")}>Location</label>
                                                                        <span><strong>{value.LOCATION ? value.LOCATION : "-"}</strong></span>
                                                                    </div>
                                                                    <div className="td">
                                                                        <label onClick={()=>handleSorting("MP_FLAG")}>MP Flag</label>
                                                                        <span><strong>{value.MP_FLAG ? (value.MP_FLAG == "1" ? "Yes" : "No") : "-"}</strong></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("VENDOR_CODE")}>Vendor Code</label>
                                                            <span>{value.VENDOR_CODE ? value.VENDOR_CODE: "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("VENDOR_ACTIVE")}>Vendor Status</label>
                                                            <span>{value.VENDOR_ACTIVE ? (value.VENDOR_ACTIVE?"Active":"Not Active") : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("INVENTORY_RATING")}>Inventory Rating</label>
                                                            <span>{value.INVENTORY_RATING ? value.INVENTORY_RATING : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("SHIPPING_RATING")}>Shipping Rating</label>
                                                            <span>{value.SHIPPING_RATING ? value.SHIPPING_RATING : "-"}</span>
                                                        </div>

                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("BUSINESS_RELATION")}>Business Relatin</label>
                                                            <span>{value.BUSINESS_RELATION ? (value.BUSINESS_RELATION=="1" ? "Yes" : "No") : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("TIER")}>Tier</label>
                                                            <span>{value.TIER ? value.TIER : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("FAMILY")}>Family</label>
                                                            <span>{value.FAMILY ? value.FAMILY : "-"}</span>
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
                                                No Tier Found!
                                            </div>
                                        ) :
                                        ("")
                                    }
                                    {
                                        search ? (allVendorList ? (allVendorList.filter((data) => {
                                        if(
                                            data.VENDOR_NAME && data.VENDOR_NAME.toLowerCase().includes(search.toLowerCase())||
                                            data.VENDOR_CODE && data.VENDOR_CODE.toLowerCase().includes(search.toLowerCase())
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
                                                            {
                                                                vendorType === "3" ? <span>Investment</span>:""
                                                            }
                                                            {
                                                                vendorType === "4" ? <span>Logistics</span>:""
                                                            }
                                                            {
                                                                vendorType === "5" ? <span>Winery</span>:""
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
                <Modal show={showVendorModal}
                onHide={() => {setShowVendorModal(false);setError(""); setSuccess("");}} className="custom-modal user-updated-modal">
                <Modal.Header closeButton>
                    <Modal.Title>VENDOR TIER DETAILS</Modal.Title>
                </Modal.Header>
                <form onSubmit={(e) => handleEditVendor(e)}>
                    <Modal.Body>
                        <div className="change-address-body">
                            <div className="change-address-wrapper">
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>MP Flag:<span className="required-filed">*</span></label>
                                    <div className="dropUp">
                                        <div className="custom-select-wrapper d-flex align-items-center">
                                            <Select
                                                closeMenuOnSelect={true}
                                                options={
                                                    [
                                                        {
                                                            value:"1",
                                                            label:"Yes"
                                                        },
                                                        {
                                                            value:"0",
                                                            label:"No"
                                                        }
                                                    ]
                                                }
                                                className="basic-multi-select"
                                                name="colors"
                                                id="mp-dropdown"
                                                classNamePrefix="select"
                                                placeholder="Select Flag"
                                                onChange = {(selectedMPFlag)=> {setSelectedMPFlag(selectedMPFlag);} }
                                                value={selectedMPFlag}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>Vendor Status:<span className="required-filed">*</span></label>
                                    <div className="dropUp">
                                        <div className="custom-select-wrapper d-flex align-items-center">
                                            <Select
                                                closeMenuOnSelect={true}
                                                options={
                                                    [
                                                        {
                                                            value:"1",
                                                            label:"Active"
                                                        },
                                                        {
                                                            value:"0",
                                                            label:"Not Active"
                                                        }
                                                    ]
                                                }
                                                className="basic-multi-select"
                                                name="colors"
                                                id="mp-dropdown"
                                                classNamePrefix="select"
                                                placeholder="Select Status"
                                                onChange = {(selectedVendorStatus)=> {setSelectedVendorStatus(selectedVendorStatus);} }
                                                value={selectedVendorStatus}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>Stock Quality:<span className="required-filed">*</span></label>
                                    <div className="dropUp">
                                        <div className="custom-select-wrapper d-flex align-items-center">
                                            <Select
                                                closeMenuOnSelect={true}
                                                options={
                                                    [
                                                        {
                                                            value:"0",
                                                            label:"0"
                                                        },
                                                        {
                                                            value:"1",
                                                            label:"1"
                                                        },
                                                        {
                                                            value:"2",
                                                            label:"2"
                                                        },
                                                        {
                                                            value:"3",
                                                            label:"3"
                                                        },
                                                        {
                                                            value:"4",
                                                            label:"4"
                                                        },
                                                        {
                                                            value:"5",
                                                            label:"5"
                                                        },
                                                    ]
                                                }
                                                className="basic-multi-select"
                                                name="colors"
                                                id="mp-dropdown"
                                                classNamePrefix="select"
                                                placeholder="Select Quality"
                                                onChange = {(selectedStockQuality)=> {setSelectedStockQuality(selectedStockQuality);} }
                                                value={selectedStockQuality}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>Inventory Rating:<span className="required-filed">*</span></label>
                                    <div className="dropUp">
                                        <div className="custom-select-wrapper d-flex align-items-center">
                                            <Select
                                                closeMenuOnSelect={true}
                                                options={
                                                    [
                                                        {
                                                            value:"0",
                                                            label:"0"
                                                        },
                                                        {
                                                            value:"1",
                                                            label:"1"
                                                        },
                                                        {
                                                            value:"2",
                                                            label:"2"
                                                        },
                                                        {
                                                            value:"3",
                                                            label:"3"
                                                        },
                                                        {
                                                            value:"4",
                                                            label:"4"
                                                        },
                                                        {
                                                            value:"5",
                                                            label:"5"
                                                        },
                                                    ]
                                                }
                                                className="basic-multi-select"
                                                name="colors"
                                                id="mp-dropdown"
                                                classNamePrefix="select"
                                                placeholder="Select Rating"
                                                onChange = {(selectedInventoryRating)=> {setSelectedInventoryRating(selectedInventoryRating);} }
                                                value={selectedInventoryRating}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>Shipping Rating:<span className="required-filed">*</span></label>
                                    <div className="dropUp">
                                    <div className="custom-select-wrapper d-flex align-items-center">
                                            <Select
                                                closeMenuOnSelect={true}
                                                options={
                                                    [
                                                        {
                                                            value:"0",
                                                            label:"0"
                                                        },
                                                        {
                                                            value:"1",
                                                            label:"1"
                                                        },
                                                        {
                                                            value:"2",
                                                            label:"2"
                                                        },
                                                        {
                                                            value:"3",
                                                            label:"3"
                                                        },
                                                        {
                                                            value:"4",
                                                            label:"4"
                                                        },
                                                        {
                                                            value:"5",
                                                            label:"5"
                                                        },
                                                    ]
                                                }
                                                className="basic-multi-select"
                                                name="colors"
                                                id="mp-dropdown"
                                                classNamePrefix="select"
                                                placeholder="Select Rating"
                                                onChange = {(selectedShippingRating)=> {setSelectedShippingRating(selectedShippingRating);} }
                                                value={selectedShippingRating}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>Business Relation:<span className="required-filed">*</span></label>
                                    <div className="dropUp">
                                        <div className="custom-select-wrapper d-flex align-items-center">
                                            <Select
                                                closeMenuOnSelect={true}
                                                options={
                                                    [
                                                        {
                                                            value:"1",
                                                            label:"Yes"
                                                        },
                                                        {
                                                            value:"0",
                                                            label:"No"
                                                        }
                                                    ]
                                                }
                                                className="basic-multi-select"
                                                name="colors"
                                                id="mp-dropdown"
                                                classNamePrefix="select"
                                                placeholder="Select Relation"
                                                onChange = {(selectedBusinessRelation)=> {setSelectedBusinessRelation(selectedBusinessRelation);} }
                                                value={selectedBusinessRelation}
                                            />
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
                        <input type="submit" value="Save" className="save-btn" />
                    </Modal.Footer>
                </form>
        </Modal>
                <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage}/>              
        </div>
        
    )
};

export default VendorTier;
