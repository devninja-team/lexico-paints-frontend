import React from "react";
import './index.scss';
import {useSelector} from "react-redux";
import { useHistory } from 'react-router-dom';
import {setGlobalData, setSession} from "../../utils/Actions";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import SearchIcon from '../../assets/images/search-icon.svg';
import downloadIcon from '../../assets/images/download-icon.png'
import OrderByIcon from '../../assets/images/orderby-arrow.png';
import SessionModal from '../Modals/SessionModal';
import {paymentCategoryList, OrderStatusList, fulfillmentList, transactionDropDownList} from "../../utils/drop-down-list";
import Select from 'react-select';
import {  
    generateUSInvoice,generateCRMShippingStatements,
    generateUKGeneralInvoice, generateUKInvestmentInvoice,generateUKPurchaseOrder,
    generateUSPurchaseOrder, generateUKReceipt } from "../../utils/Pdf/helper";
    
const Transaction = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const route = useSelector(state => state.route);

    const[showPerPage,setshowPerPage] = useState('25');
    const[isViewOpen,setIsViewOpen] = useState(false);
    const [statusBtnValue, setStatusBtnValue] = useState("");
    const [vendorList, setVendorList] = useState();
    const [allVendorList, setAllVendorList] = useState();
    const [vendorDropDownValue, setVendorDropDownValue] = useState("");
    const [locationDropDownValue, setLocationDropDownValue] = useState("");

    //goto button
    const [showViewButton, setViewButton] = useState(false);

    const [vendorId, setVendorId] = useState();
    const query = useSelector(state => state.userRegion);

    const [transactionList, setTransactionList] = useState();
    const [allTransactionList, setAllTransactionList] = useState();
    
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
    const[exceptionInfoModal,setExceptionInfoModal] = useState(false);
    const[prospectInfoModal,setProspectInfoModal] = useState(false);
    const [success, setSuccess] = useState();
    const [confirmModal, setConfirmModal] = useState(false);
    const [exceptionId, setExceptionId] = useState("");

    //Add Exception Modal
    const [isNameOpen, setIsNameOpen] = useState(false);
    const [name, setName] = useState("");
    const [editVintage, setEditVintage] = useState("");
    const [editExpiry, setEditExpiry] = useState("");
    const [editSize, setEditSize] = useState("");
    const [isSizeOpen, setIsSizeOpen] = useState(false);
    const [nameList, setNameList] = useState();
    const [nameDropDownValue, setNameDropDownValue] = useState("");
    const [editLwin, setLwin] = useState("");
    const [wineLoader, setWineLoader] = useState(false);
    const [vendor, setVendor] = useState("");
    const [isVendorOpen, setIsVendorOpen] = useState(false);
    const [vendorSearchId, setVendorSearchId] = useState();
    const [countryList, setCountryList] = useState("");
    const [selectedCountry, setSelectedCountry] = useState();
    const [selectedLocation, setSelectedLocation] = useState();
    const [countryDropDownValue, setCountryDropDownValue] = useState("");
    const [wineName, setWineName] = useState();
    const [showOptions, setShowOptions] = useState(false);


        
    //sorting vars
    const[sortOrder,setSortOrder] = useState('asc');
    //filter btn vars
    const [payCategoryBtn, setPayCategoryBtn] = useState("");
    const [orderStatusBtn, setOrderStatusBtn] = useState("");
    const [fulfillStatusBtn, setFulfillStatusBtn] = useState("");
    const [transactionDateBtn, setTransactionDateBtn] = useState("");
    const [transactionStatusBtn, setTransactionStatusBtn] = useState("ACTIVE");
    const [customerTypeBtn, setCustomerTypeBtn] = useState("");

    
    useEffect(() => {
        fetchTransaction(payCategoryBtn,orderStatusBtn, fulfillStatusBtn, transactionDateBtn, transactionStatusBtn, customerTypeBtn);
    },[]);

    useEffect(() => {
        if(allTransactionList && allTransactionList.length > 0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            
            setTransactionList(allTransactionList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allTransactionList.length/postsPerPage);i++) {
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
    const fetchTransaction = (payment_category, order_status, fulfillment_status,transaction_date, transaction_status, customer_type) => {
        if(window.screen.width<=480) {
            setLastPage(5);
        }
        setLoadingData(true);
        // console.log("payment_category:",payment_category)
        // console.log("order_status:",order_status)
        // console.log("fulfillment_status:",fulfillment_status)
        // console.log("transaction_date:",transaction_date)
        // console.log("transaction_status:",transaction_status)
        // console.log("customer_type:",customer_type)

        axios
        .post("/transaction/"+query,{
            payment_category,
            order_status,
            fulfillment_status,
            transaction_date,
            transaction_status,
            customer_type
        }).then((res) => {
            // console.log("Exception", res.data)
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            // console.log("Transaction API", res.data)
            if(res.data) {
                let transactionArray = [];
                Object.entries(res.data).map((value)=>{
                    transactionArray.push(value);
                });
                // console.log("transaction Array", transactionArray)
                if(transactionArray.length>0) {
                    transactionArray.sort( 
                        (a, b) => new Date (b[1][0].date) - new Date(a[1][0].date)
                    );
                }
                setAllTransactionList(transactionArray);
                setTransactionList(transactionArray.slice(indexOfFirstPage,indexOfLastPost));
                for(let i=1; i<=Math.ceil(transactionArray.length/postsPerPage);i++) {
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
        })
    }
    const handleAddException = (e) => {
        setError('');
        e.preventDefault();
        // console.log("lwin7:",countryDropDownValue ==="" || countryDropDownValue ===null ? "":countryDropDownValue.map(data => data.value));
        // console.log("vendor_id:",vendorSearchId);
        // console.log("vintage:",editVintage);
        // console.log("store:",locationDropDownValue ==="" || locationDropDownValue ===null ? "":locationDropDownValue.map(data => data.value));
            axios.post('/publish/add_vendor_excpetions'+query,{
                lwin7:countryDropDownValue ==="" || countryDropDownValue ===null ? "":countryDropDownValue.map(data => data.value),
                vintage:editVintage,
                vendor_id: vendorSearchId,
                store: locationDropDownValue ==="" || locationDropDownValue ===null ? "":locationDropDownValue.map(data => data.value),
            }).then((res) => {
                // console.log(res.data)
                if(res.data.message === "exception created") {
                    setSuccess("Exception Created Successfully!");
                    setTransactionList([]);
                    fetchTransaction(payCategoryBtn,orderStatusBtn, fulfillStatusBtn, transactionDateBtn, transactionStatusBtn, customerTypeBtn);
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
        setNameDropDownValue("");
        setEditVintage("");
        setWineName("");
        setVendorSearchId("");
        setVendorDropDownValue("");
        setShowOptions(false);
    }
    const handleSorting = (field) => {
        if(transactionList && transactionList.length>0) {
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
                            case "invoice" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[0]?parseFloat(a[0]):""
                                    var nameB=b[0]?parseFloat(b[0]):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "customer_name" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].customer_name?a[1][0].customer_name.toLowerCase():""
                                    var nameB=b[1][0].customer_name?b[1][0].customer_name.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "date" :
                                sortedArray = allTransactionList.sort( 
                                    (a, b) => new Date (a[1][0].date) - new Date(b[1][0].date)
                                );
                            break;
                            case "total" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].total? parseFloat(a[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    var nameB=b[1][0].total? parseFloat(b[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "ship_option" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].ship_option?a[1][0].ship_option.toLowerCase():""
                                    var nameB=b[1][0].ship_option?b[1][0].ship_option.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "fulfill_status" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].fulfill_status?a[1][0].fulfill_status.toLowerCase():""
                                    var nameB=b[1][0].fulfill_status?b[1][0].fulfill_status.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "qty" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].qty?parseFloat(a[1][0].qty):""
                                    var nameB=b[1][0].qty?parseFloat(b[1][0].qty):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "order_status" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].order_status?a[1][0].order_status.toLowerCase():""
                                    var nameB=b[1][0].order_status?b[1][0].order_status.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "tariff_paid" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].tariff_paid?a[1][0].tariff_paid.toLowerCase():""
                                    var nameB=b[1][0].tariff_paid?b[1][0].tariff_paid.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "payment_status" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].payment_status?a[1][0].payment_status.toLowerCase():""
                                    var nameB=b[1][0].payment_status?b[1][0].payment_status.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;


                            default:console.log("check sorting Label 1"); break;
                        }
                        setAllTransactionList([...sortedArray]);
                        break;
                    case 'desc' :
                        switch(field) {
                            case "invoice" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[0]?parseFloat(a[0]):""
                                    var nameB=b[0]?parseFloat(b[0]):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "customer_name" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].customer_name?a[1][0].customer_name.toLowerCase():""
                                    var nameB=b[1][0].customer_name?b[1][0].customer_name.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "date" :
                                sortedArray = allTransactionList.sort( 
                                    (a, b) => new Date (b[1][0].date) - new Date(a[1][0].date)
                                );
                            break;
                            case "total" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].total? parseFloat(a[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    var nameB=b[1][0].total? parseFloat(b[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "ship_option" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].ship_option?a[1][0].ship_option.toLowerCase():""
                                    var nameB=b[1][0].ship_option?b[1][0].ship_option.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "fulfill_status" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].fulfill_status?a[1][0].fulfill_status.toLowerCase():""
                                    var nameB=b[1][0].fulfill_status?b[1][0].fulfill_status.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "qty" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].qty?parseFloat(a[1][0].qty):""
                                    var nameB=b[1][0].qty?parseFloat(b[1][0].qty):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "order_status" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].order_status?a[1][0].order_status.toLowerCase():""
                                    var nameB=b[1][0].order_status?b[1][0].order_status.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "tariff_paid" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].tariff_paid?a[1][0].tariff_paid.toLowerCase():""
                                    var nameB=b[1][0].tariff_paid?b[1][0].tariff_paid.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "payment_status" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].payment_status?a[1][0].payment_status.toLowerCase():""
                                    var nameB=b[1][0].payment_status?b[1][0].payment_status.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            default:console.log("check sorting Label 2"); break;
                        }
                        setAllTransactionList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }else {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "invoice" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[0]?parseFloat(a[0]):""
                                    var nameB=b[0]?parseFloat(b[0]):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "customer_name" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].customer_name?a[1][0].customer_name.toLowerCase():""
                                    var nameB=b[1][0].customer_name?b[1][0].customer_name.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "date" :
                                sortedArray = allTransactionList.sort( 
                                    (a, b) => new Date (a[1][0].date) - new Date(b[1][0].date)
                                );
                            break;
                            case "total" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].total? parseFloat(a[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    var nameB=b[1][0].total? parseFloat(b[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "ship_option" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].ship_option?a[1][0].ship_option.toLowerCase():""
                                    var nameB=b[1][0].ship_option?b[1][0].ship_option.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "fulfill_status" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].fulfill_status?a[1][0].fulfill_status.toLowerCase():""
                                    var nameB=b[1][0].fulfill_status?b[1][0].fulfill_status.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "qty" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].qty?parseFloat(a[1][0].qty):""
                                    var nameB=b[1][0].qty?parseFloat(b[1][0].qty):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "order_status" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].order_status?a[1][0].order_status.toLowerCase():""
                                    var nameB=b[1][0].order_status?b[1][0].order_status.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "tariff_paid" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].tariff_paid?a[1][0].tariff_paid.toLowerCase():""
                                    var nameB=b[1][0].tariff_paid?b[1][0].tariff_paid.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "payment_status" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].payment_status?a[1][0].payment_status.toLowerCase():""
                                    var nameB=b[1][0].payment_status?b[1][0].payment_status.toLowerCase():""
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
                            case "invoice" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[0]?parseFloat(a[0]):""
                                    var nameB=b[0]?parseFloat(b[0]):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "customer_name" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].customer_name?a[1][0].customer_name.toLowerCase():""
                                    var nameB=b[1][0].customer_name?b[1][0].customer_name.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "date" :
                                sortedArray = allTransactionList.sort( 
                                    (a, b) => new Date (b[1][0].date) - new Date(a[1][0].date)
                                );
                            break;
                            case "total" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].total? parseFloat(a[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    var nameB=b[1][0].total? parseFloat(b[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "ship_option" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].ship_option?a[1][0].ship_option.toLowerCase():""
                                    var nameB=b[1][0].ship_option?b[1][0].ship_option.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "fulfill_status" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].fulfill_status?a[1][0].fulfill_status.toLowerCase():""
                                    var nameB=b[1][0].fulfill_status?b[1][0].fulfill_status.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "qty" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].qty?parseFloat(a[1][0].qty):""
                                    var nameB=b[1][0].qty?parseFloat(b[1][0].qty):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "order_status" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].order_status?a[1][0].order_status.toLowerCase():""
                                    var nameB=b[1][0].order_status?b[1][0].order_status.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "tariff_paid" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].tariff_paid?a[1][0].tariff_paid.toLowerCase():""
                                    var nameB=b[1][0].tariff_paid?b[1][0].tariff_paid.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "payment_status" :
                                sortedArray = allTransactionList.sort( function(a, b) {
                                    var nameA=a[1][0].payment_status?a[1][0].payment_status.toLowerCase():""
                                    var nameB=b[1][0].payment_status?b[1][0].payment_status.toLowerCase():""
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
        setAllTransactionList([]);
        setTransactionList([]);
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

                setAllTransactionList(arrayVendorList);
                setTransactionList(arrayVendorList.slice(indexOfFirstPage,indexOfLastPost));
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
    const paginate = () => {
        if(allTransactionList && allTransactionList.length>0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            
            setTransactionList(allTransactionList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allTransactionList.length/postsPerPage);i++) {
                setPageNumber(...[i])
            }
            
        }
    }
    const handleViewVendor = () => {
        localStorage.setItem("customer_id",vendorId);
        localStorage.setItem("customer_type","Vendor");
        history.push("/accountinfo/communication");
    }
    const handleSwitch = (path) => {
        history.push(path);
    }
    const searchWine = (search) => {
        if(search) {
            setWineLoader(true);
            setNameList([]);
            setShowOptions(false);
            axios
            .post("/publish/search_excpetion_wines"+query,{
                vid:vendorSearchId,
                q: search
            }).then((res) => {
                let countryArray = [];
                Object.entries(res.data.vendors).map((data) => {
                    countryArray.push(
                        {
                            value: data[0],
                            label: data[1]
                        }
                    )
                });
                if(countryArray.length>0) {
                    setShowOptions(true);
                    setCountryList(countryArray.slice(0,20));
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
    }

    const handleFilters = (value, type) => {
        setInitialPage(0);
        setCurrentPage(1);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        setAllTransactionList([]);
        setTransactionList([]);
        if(type==="pay-category-filter") {
            fetchTransaction(value, orderStatusBtn, fulfillStatusBtn, transactionDateBtn,transactionStatusBtn, customerTypeBtn);
        } else if(type==="order-status-filter") {
            fetchTransaction(payCategoryBtn, value, fulfillStatusBtn, transactionDateBtn,transactionStatusBtn, customerTypeBtn);
        } else if(type==="fulfillment-filter") {
            fetchTransaction(payCategoryBtn, orderStatusBtn, value, transactionDateBtn,transactionStatusBtn, customerTypeBtn);
        } else if(type==="transaction-date-filter") {
            fetchTransaction(payCategoryBtn, orderStatusBtn, fulfillStatusBtn, value,transactionStatusBtn, customerTypeBtn);
        } else if(type==="transaction-status-filter") {
            fetchTransaction(payCategoryBtn, orderStatusBtn, fulfillStatusBtn, transactionDateBtn,value, customerTypeBtn);
        } else if(type==="customer-type-filter"){
            fetchTransaction(payCategoryBtn, orderStatusBtn, fulfillStatusBtn, transactionDateBtn,transactionStatusBtn, value);
        }
    }
    const handleRedirect = (id) => {
        localStorage.setItem("transaction_id",id);
        history.push("/individualtrans");
    }
    const handlePDF = (id, type) => {
        if(type=="INVOICE") {
            axios.post("/accounts/invoice"+query, {
                orderid:id
            }).then((res) => {
                if(res.data.region === "US") {
                    generateUSInvoice(res.data);
                } else {
                    if(res.data.type==="invoice") {
                        generateUKGeneralInvoice(res.data);
                    } else {
                        generateUKInvestmentInvoice(res.data);
                    }
                }
            })
        } else if(type==="PO"){
            axios.post("/accounts/purchase_order"+query, {
                orderid:id
            }).then((res) => {
                if(res.data.region === "US") {
                    generateUSPurchaseOrder(res.data);
                } else {
                    generateUKPurchaseOrder(res.data);
                }
            })
        }
    }
    
    return (
        <div className="transaction-page">
                <div className="customers-content">
                    <div className="top-head d-flex align-items-end">
                        <div className="title d-flex justify-content-start align-items-center">
                            <h1 className="mb-0 font-35">Transaction</h1>
                        </div>
                        <div className={openSearch ? "search-customer show" : "search-customer"}>
                            <div className="search-box">
                                <input className="search-input" type="text" 
                                    value={search}
                                    placeholder="Quick Find by Invoice No, Customer Name"
                                    onChange={(e) => setSearch(e.target.value)}/>
                                <button className="search-btn" type="button" onClick={() => setOpenSearch(!openSearch)}>
                                    <img src={SearchIcon} alt=""/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            
                <div className="header my-2 justify-content-end">
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
                            <div className="customer-data-head-filter d-flex align-items-center justify-content-end border-bottom-0 mb-2">
                                <div className="customer-title">
                                    Invoice Payment :
                                </div>
                                <div className="data-filter">
                                    <ul>
                                        <li>
                                            <Button className={payCategoryBtn==="" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setPayCategoryBtn(""); handleFilters("","pay-category-filter")}}>ALL</Button>
                                        </li>
                                        {
                                            paymentCategoryList && paymentCategoryList.length>0 ? (
                                                paymentCategoryList.map((value, index) => {
                                                    return (
                                                        <li>
                                                            <Button className={payCategoryBtn===value ? 'btn-filter active' : 'btn-filter'} onClick={() => { setPayCategoryBtn(value); handleFilters(value,"pay-category-filter")}}>{value}</Button>
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
                                    Order Status :
                                </div>
                                <div className="data-filter">
                                    <ul>
                                        <li>
                                            <Button className={orderStatusBtn==="" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setOrderStatusBtn("");handleFilters("","order-status-filter")}}>ALL</Button>
                                        </li>
                                        {
                                            OrderStatusList && OrderStatusList.length>0 ? (
                                                OrderStatusList.map((value, index) => {
                                                    return (
                                                        <li>
                                                            <Button className={orderStatusBtn===value ? 'btn-filter active' : 'btn-filter'} onClick={() => { setOrderStatusBtn(value);handleFilters(value,"order-status-filter")}}>{value}</Button>
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
                                    Stock Status :
                                </div>
                                <div className="data-filter">
                                    <ul>
                                        <li>
                                            <Button className={fulfillStatusBtn==="" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setFulfillStatusBtn("");handleFilters("","fulfillment-filter")}}>ALL</Button>
                                        </li>
                                        {
                                            fulfillmentList && fulfillmentList.length>0 ? (
                                                fulfillmentList.map((value, index) => {
                                                    return (
                                                        <li>
                                                            <Button className={fulfillStatusBtn===value ? 'btn-filter active' : 'btn-filter'} onClick={() => { setFulfillStatusBtn(value);handleFilters(value,"fulfillment-filter")}}>{value}</Button>
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
                                    Transaction Date :
                                </div>
                                <div className="data-filter">
                                    <ul>
                                        <li>
                                            <Button className={transactionDateBtn==="" ? 'btn-filter active' : 'btn-filter'} variant="outline-primary" onClick = {() => {setTransactionDateBtn('');handleFilters("","transaction-date-filter")}}>ALL</Button>
                                        </li>
                                        <li>
                                            <Button className={transactionDateBtn==="30days" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setTransactionDateBtn('30days');handleFilters("30days","transaction-date-filter")}}>LAST 30 DAYS</Button>
                                        </li>
                                        <li>
                                            <Button className={transactionDateBtn==="30_90_days" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setTransactionDateBtn('30_90_days');handleFilters("30_90_days","transaction-date-filter")}}>30-90 DAYS</Button>
                                        </li>

                                        <li>
                                            <Button className={transactionDateBtn==="3_6_months" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setTransactionDateBtn('3_6_months');handleFilters("3_6_months","transaction-date-filter")}}>3-6 MONTHS</Button>
                                        </li>
                                        <li>
                                            <Button className={transactionDateBtn==="6_12_months" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setTransactionDateBtn('6_12_months');handleFilters("6_12_months","transaction-date-filter")}}>6-12 MONTHS</Button>
                                        </li>
                                        <li>
                                            <Button className={transactionDateBtn==="more_than_1_year" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setTransactionDateBtn('more_than_1_year');handleFilters("more_than_1_year","transaction-date-filter")}}>LONGER THAN 1 YEAR</Button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="customer-data-head-filter d-flex align-items-center justify-content-end border-bottom-0 mb-2">
                                <div className="customer-title">
                                    Transaction Status:
                                </div>
                                <div className="data-filter">
                                    <ul>
                                        <li>
                                            <Button className={transactionStatusBtn==="" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setTransactionStatusBtn("");handleFilters("","transaction-status-filter")}}>ALL</Button>
                                        </li>
                                        {
                                            transactionDropDownList && transactionDropDownList.length>0 ? (
                                                transactionDropDownList.map((value, index) => {
                                                    return (
                                                        <li>
                                                            <Button className={transactionStatusBtn===value ? 'btn-filter active' : 'btn-filter'} onClick={() => { setTransactionStatusBtn(value);handleFilters(value,"transaction-status-filter")}}>{value}</Button>
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
                                    Customer Type :
                                </div>
                                <div className="data-filter">
                                    <ul>
                                        <li>
                                            <Button className={customerTypeBtn==="" ? 'btn-filter active' : 'btn-filter'} variant="outline-primary" onClick={()=>{setCustomerTypeBtn(""); handleFilters('',"customer-type-filter");}}>ALL</Button>
                                        </li>
                                        <li>
                                            <Button className={customerTypeBtn==="retail" ? 'btn-filter active' : 'btn-filter'} variant="outline-primary" onClick={()=>{setCustomerTypeBtn("retail"); handleFilters('1',"customer-type-filter");}}>RETAIL</Button>
                                        </li>
                                        <li>
                                            <Button className={customerTypeBtn==="investment" ? 'btn-filter active' : 'btn-filter'} variant="outline-primary" onClick={()=>{setCustomerTypeBtn("investment"); handleFilters('2',"customer-type-filter");}}>INVESTMENT</Button>
                                        </li>   
                                        <li>
                                            <Button className={customerTypeBtn==="logistic" ? 'btn-filter active' : 'btn-filter'} variant="outline-primary" onClick={()=>{setCustomerTypeBtn("logistic"); handleFilters('3',"customer-type-filter");}}>LOGISTIC</Button>
                                        </li>   
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="customer-table">
                            <Table responsive>
                                <thead>
                                <tr>
                                    <th className="cursor-pointer width-5" onClick={()=>handleSorting("invoice")}>Invoice</th>
                                    <th className="cursor-pointer width-5" onClick={()=>handleSorting("date")}>Date</th>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("customer_name")}>Customer</th>
                                    <th>Product</th>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("qty")}>Qty</th>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("order_status")}>Order Status</th>

                                    <th className="cursor-pointer" onClick={()=>handleSorting("total")}>Total</th>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("ship_option")}>Shipping Option</th>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("fulfill_status")}>Stock Status</th>

                                    <th className="cursor-pointer" onClick={()=>handleSorting("tariff_paid")}>Tariff paid</th>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("payment_status")}>Payment Status</th>
                                    <th>Logistics</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {
                                        search ? (
                                            allTransactionList && allTransactionList.length > 0 ? (
                                                allTransactionList.filter((data) => {
                                                    if(
                                                        data[0] && data[0].toLowerCase().includes(search.toLowerCase()) ||
                                                        data[1][0].customer_name && data[1][0].customer_name.toLowerCase().includes(search.toLowerCase())
                                                    ) {
                                                        return data;
                                                    }
                                                }).map((value, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="invoice-blue">
                                                                <div className="cursor-pointer" onClick={() => handlePDF(value[0],value[1][0].order_type)}>
                                                                    {value[0]+" "}
                                                                    <img src={downloadIcon} height="12" width="12" alt="download icon"></img>
                                                                </div>
                                                            </td>
                                                            <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].date ? value[1][0].date : "-"}</td>
                                                            <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].customer_name ? value[1][0].customer_name : "-"}</td>
                                                            <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>
                                                                {
                                                                    value[1] && value[1].map((val, index)=>{
                                                                        return(
                                                                            <div className="product-addr d-flex justify-content-between" key={index}>
                                                                                <div className="add">
                                                                                    <h6>{val.product.split('<br>')[0]}</h6> 
                                                                                    <span>{val.product.split('<br>')[1]}</span>  
                                                                                    <span>{val.product.split('<br>')[2]}</span>
                                                                                </div>
                                                                                <div className="location-col d-flex justify-content-start">
                                                                                    <i className="dot-icon red-color"></i>
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })
                                                                }
                                                            </td>
                                                            <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].qty ? value[1][0].qty : "-"}</td>
                                                            <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].order_status ? value[1][0].order_status : "-"}</td>

                                                            <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].total ? value[1][0].total : "-"}</td>
                                                            <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].ship_option ? value[1][0].ship_option : "-"}</td>
                                                            <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].fulfill_status ? value[1][0].fulfill_status : "-"}</td>
                                                            <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].tariff_paid ? value[1][0].tariff_paid : "-"}</td>
                                                            <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].payment_status ? value[1][0].payment_status : "-"}</td>
                                                            <td className="invoice-blue">View Logistics</td>
                                                        </tr>
                                                    )
                                                })
                                            ) : ("")
                                        )
                                        : 
                                        transactionList && transactionList.length > 0 ? (
                                            transactionList.map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="invoice-blue">
                                                            <div className="cursor-pointer" className="cursor-pointer" onClick={() => handlePDF(value[0],value[1][0].order_type)}>
                                                                {value[0]+" "}
                                                                <img src={downloadIcon} height="12" width="12" alt="download icon"></img>
                                                            </div>
                                                        </td>
                                                        <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].date ? value[1][0].date : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].customer_name ? value[1][0].customer_name : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>
                                                            {
                                                                value[1] && value[1].map((val, index)=>{
                                                                    return(
                                                                        <div className="product-addr d-flex justify-content-between" key={index}>
                                                                            <div className="add">
                                                                                <h6>{val.product.split('<br>')[0]}</h6> 
                                                                                <span>{val.product.split('<br>')[1]}</span>  
                                                                                <span>{val.product.split('<br>')[2]}</span>
                                                                            </div>
                                                                            <div className="location-col d-flex justify-content-start">
                                                                                <i className="dot-icon red-color"></i>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].qty ? value[1][0].qty : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].order_status ? value[1][0].order_status : "-"}</td>

                                                        <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].total ? value[1][0].total : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].ship_option ? value[1][0].ship_option : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].fulfill_status ? value[1][0].fulfill_status : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].tariff_paid ? value[1][0].tariff_paid : "-"}</td>
                                                        <td className="cursor-pointer" onClick={() => handleRedirect(value[0])}>{value[1][0].payment_status ? value[1][0].payment_status : "-"}</td>
                                                        <td className="invoice-blue">View Logistics</td>
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
                                        transactionList && transactionList.length===0 && loadingData===false && !search? (
                                            <tr>
                                                <td colSpan="12" className="text-center">No Transaction found!</td>
                                            </tr>
                                        ) :
                                        ("")
                                    }
                                    {
                                        search ? (allTransactionList ? (allTransactionList.filter((data) => {
                                        if(
                                            data[0] && data[0].toLowerCase().includes(search.toLowerCase()) ||
                                            data[1][0].customer_name && data[1][0].customer_name.toLowerCase().includes(search.toLowerCase())
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
                                        allTransactionList && allTransactionList.length > 0 ? (
                                            allTransactionList.filter((data) => {
                                                if(
                                                    data[0] && data[0].toLowerCase().includes(search.toLowerCase()) ||
                                                    data[1][0].customer_name && data[1][0].customer_name.toLowerCase().includes(search.toLowerCase())
                                                ) {
                                                    return data;
                                                }
                                            }).map((value, index) => {
                                                return (
                                                    <div className="mobile-table-list" key={index}>
                                                        <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                            <div className="th">
                                                                <label onClick={() => handleSorting("invoice")}>Invoice</label>
                                                                <span className="link" onClick={() => handlePDF(value[0],value[1][0].order_type)}>
                                                                    {value[0]+" "}
                                                                    <img src={downloadIcon}  height="12" width="12" alt="download icon"></img>
                                                                </span>
                                                            </div>
                                                            <div className="th">
                                                                <label onClick={() => handleSorting("date")}>Date</label>
                                                                <span onClick={() => handleRedirect(value[0])}>{value[1][0].date ? value[1][0].date: "-"}</span>
                                                            </div>
                                                            <div className="th">
                                                                <label onClick={()=>handleSorting("total")}>Total</label>
                                                                <span onClick={() => handleRedirect(value[0])}>{value[1][0].total ? value[1][0].total : "-"}</span>
                                                            </div>
                                                        </div>
                                                        <div className="mobile-table-td">
                                                            <div className="mobile-table-td-row">
                                                                <div className="td-list d-flex justify-content-between">
                                                                    <div className="td">
                                                                        <span onClick={() => handleRedirect(value[0])}><strong>{value[1][0].customer_name ? value[1][0].customer_name : ""}</strong></span>
                                                                    </div>
                                                                    <div className="product-td d-flex justify-content-between">
                                                                        <div className="product-td-name" onClick={() => handleRedirect(value[0])}>
                                                                            <h6>{value[1][0].product.split('<br>')[0]}</h6> 
                                                                            <span>{value[1][0].product.split('<br>')[1]}</span>  
                                                                            <span>{value[1][0].product.split('<br>')[2]}</span>
                                                                        </div>
                                                                        <div className="status-col">
                                                                            <i className="dot-icon red-color"></i>
                                                                        </div>
                                                                    </div>
                                                                    <div className="td">
                                                                        <div className="shipping-option">
                                                                            <span onClick={() => handleRedirect(value[0])}>{value[1][0].ship_option ? value[1][0].ship_option : ""}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("fulfill_status")}>Stock Status</label>
                                                            <span onClick={() => handleRedirect(value[0])}>{value[1][0].fulfill_status ? value[1][0].fulfill_status : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("qty")}>Qty</label>
                                                            <span onClick={() => handleRedirect(value[0])}>{value[1][0].qty ? value[1][0].qty : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("order_status")}>Order Status</label>
                                                            <span onClick={() => handleRedirect(value[0])}>{value[1][0].order_status ? value[1][0].order_status : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("tariff_paid")}>Tariff paid</label>
                                                            <span onClick={() => handleRedirect(value[0])}>{value[1][0].tariff_paid ? value[1][0].tariff_paid : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <label onClick={()=>handleSorting("payment_status")}>Payment Status</label>
                                                            <span onClick={() => handleRedirect(value[0])}>{value[1][0].payment_status ? value[1][0].payment_status : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer text-right">
                                                            <span onClick={() => handleRedirect(value[0])} className="invoice-blue">View Logistics</span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : ("")
                                            )
                                            :
                                            transactionList && transactionList.length > 0 ? (
                                                transactionList.map((value, index) => {
                                                    return (
                                                        <div className="mobile-table-list" key={index}>
                                                            <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                                <div className="th">
                                                                    <label onClick={() => handleSorting("invoice")}>Invoice</label>
                                                                    <span className="link" onClick={() => handlePDF(value[0],value[1][0].order_type)} >
                                                                        {value[0]+" "}
                                                                        <img src={downloadIcon} height="12" width="12" alt="download icon"></img>
                                                                    </span>
                                                                </div>
                                                                <div className="th">
                                                                    <label onClick={() => handleSorting("date")}>Date</label>
                                                                    <span onClick={() => handleRedirect(value[0])}>{value[1][0].date ? value[1][0].date: "-"}</span>
                                                                </div>
                                                                <div className="th">
                                                                    <label onClick={()=>handleSorting("total")}>Total</label>
                                                                    <span onClick={() => handleRedirect(value[0])}>{value[1][0].total ? value[1][0].total : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-td">
                                                                <div className="mobile-table-td-row">
                                                                    <div className="td-list d-flex justify-content-between">
                                                                        <div className="td">
                                                                            <span onClick={() => handleRedirect(value[0])}><strong>{value[1][0].customer_name ? value[1][0].customer_name : ""}</strong></span>
                                                                        </div>
                                                                        <div className="product-td d-flex justify-content-between">
                                                                            <div className="product-td-name" onClick={() => handleRedirect(value[0])}>
                                                                                <h6>{value[1][0].product.split('<br>')[0]}</h6> 
                                                                                <span>{value[1][0].product.split('<br>')[1]}</span>  
                                                                                <span>{value[1][0].product.split('<br>')[2]}</span>
                                                                            </div>
                                                                            <div className="status-col">
                                                                                <i className="dot-icon red-color"></i>
                                                                            </div>
                                                                        </div>
                                                                        <div className="td">
                                                                            <div className="shipping-option">
                                                                                <span onClick={() => handleRedirect(value[0])}>{value[1][0].ship_option ? value[1][0].ship_option : ""}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer text-right">
                                                                <label onClick={()=>handleSorting("fulfill_status")}>Stock Status</label>
                                                                <span onClick={() => handleRedirect(value[0])}>{value[1][0].fulfill_status ? value[1][0].fulfill_status : "-"}</span>
                                                            </div>
                                                            <div className="mobile-table-footer text-right">
                                                                <label onClick={()=>handleSorting("qty")}>Qty</label>
                                                                <span onClick={() => handleRedirect(value[0])}>{value[1][0].qty ? value[1][0].qty : "-"}</span>
                                                            </div>
                                                            <div className="mobile-table-footer text-right">
                                                                <label onClick={()=>handleSorting("order_status")}>Order Status</label>
                                                                <span onClick={() => handleRedirect(value[0])}>{value[1][0].order_status ? value[1][0].order_status : "-"}</span>
                                                            </div>
                                                            <div className="mobile-table-footer text-right">
                                                                <label onClick={()=>handleSorting("tariff_paid")}>Tariff paid</label>
                                                                <span onClick={() => handleRedirect(value[0])}>{value[1][0].tariff_paid ? value[1][0].tariff_paid : "-"}</span>
                                                            </div>
                                                            <div className="mobile-table-footer text-right">
                                                                <label onClick={()=>handleSorting("payment_status")}>Payment Status</label>
                                                                <span onClick={() => handleRedirect(value[0])}>{value[1][0].payment_status ? value[1][0].payment_status : "-"}</span>
                                                            </div>
                                                            <div className="mobile-table-footer text-right">
                                                                <span onClick={() => handleRedirect(value[0])} className="invoice-blue">View Logistics</span>
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
                                            transactionList && transactionList.length===0 && loadingData===false && !search? (
                                                <div className="mobile-table-list text-center">
                                                    No Transaction Found!
                                                </div>
                                            ) :
                                            ("")
                                        }
                                        {
                                            search ? (allTransactionList ? (allTransactionList.filter((data) => {
                                            if(
                                                data[0] && data[0].toLowerCase().includes(search.toLowerCase()) ||
                                                data[1][0].customer_name && data[1][0].customer_name.toLowerCase().includes(search.toLowerCase())
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
                            search || (transactionList && transactionList.length===0) ? "" : 
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
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage}/>             
        </div>
        
    )
};

export default Transaction;
