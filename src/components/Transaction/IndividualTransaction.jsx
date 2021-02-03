import React, { useState, useEffect } from "react";
import {
    NavLink, useHistory
} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './index.scss';
import logo from '../../images/westgarth-logo.png';
import closeIcon from '../../images/close-icon.svg';
import {connect} from "react-redux";
import {logout, setSession, fetchTransactionInfo, setInvoiceData, setUserRole} from "../../utils/Actions";
import LeadsModal from "../Modals/LeadsModal";
import AddNote from "../Modals/AddNote";
import { Button, Modal } from "react-bootstrap";
import SearchIcon from '../../assets/images/search-icon.svg';
import Table from 'react-bootstrap/Table';
import {Link} from "react-router-dom";
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import SessionModal from "../Modals/SessionModal";
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card';
import Select from 'react-select';
import {warehouseList, sizeList} from "../../utils/drop-down-list"
import {  
    generateUSInvoice,generateCRMShippingStatements,
    generateUKGeneralInvoice, generateUKInvestmentInvoice,generateUKPurchaseOrder,
    generateUSPurchaseOrder, generateUKReceipt } from "../../utils/Pdf/helper";

let id;
const IndividualTransaction = () => {
    const [showModal, setShowModal] = useState(false);
    const whoami = useSelector(state => state.whoami);
    const fetchTransaction = useSelector(state => state.fetchTransaction);
    const query = useSelector(state => state.userRegion);

    //individual transaction api data
    const [customerDetails, setCustomerDetails] = useState();
    const [notes, setNotes] = useState();
    const [inputNotes, setInputNotes] = useState();
    const [orderDetails, setOrderDetails] = useState();
    const [products, setProducts] = useState();
    const [shipping, setShipping] = useState();
    const [notesLength, setNotesLength] = useState(0);
    const [matchedList, setMatchedList] = useState();
    const [unmatchedList, setUnmatchedList] = useState();
    const [isMatchedOpen, setIsMatchedOpen] = useState(false);
    const [isUnmatchedOpen, setIsUnmatchedOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    //note counter
    const [noteCounter, setNoteCounter] = useState(0);

    const dispatch = useDispatch();
    const history = useHistory();
    const[sortOrder,setSortOrder] = useState('asc');
    
    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const [error,setError] = useState('');
    const [success,setSuccess] = useState('');
    const [infoModal,setInfoModal] = useState(false);
    const [landInfo, setLandInfo] = useState(false);
    const [editFulFillData, setFulFillDate] = useState("");
    const [editLandingData, setLandingDate] = useState("");
    const [selectedWareHouse, setSelectedWareHouse] = useState("");
    const [warehouseListArray, setWareHouseListArray] = useState("");
    const [sizeListArray, setSizeListArray] = useState("");
    const [editRotationNo, setRotationNo] = useState("");
    const [editUUID, setUUID] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [editQty, setQty] = useState("");
    const [isEditCondition, setIsCondition] = useState("yes");
    const [editNotes, setEditNotes] = useState("");
    const [lwin18, setLwin18] = useState("");
    const [orderNo,setOrderNo] = useState("");
    const [isUpdate, setIsUpdate] = useState(true);
    const [historyList, setHistoryList] = useState();
    useEffect(() => {   
         if(localStorage.getItem('transaction_id')) {
            id=localStorage.getItem('transaction_id');
            fetchInfo();
         }else {
             window.location.href='/';
         }     
    }, [fetchTransaction]);

    useEffect(() => {   
        let sizeArray = [];
        let warehouseArray = [];
        if(sizeList.length>0) {
            sizeList.map((value) => {
                sizeArray.push({
                    value, label: value
                })
            })
        }  
        if(warehouseList.length>0) {
            warehouseList.map((value) => {
                warehouseArray.push({
                    value, label: value
                })
            })
        }  
        setSizeListArray(sizeArray);
        setWareHouseListArray(warehouseArray);
   }, [sizeList,warehouseList]);

    const fetchInfo = () => {
        // console.log("fetch id",id)
        axios.post('/transaction/order_details'+query,{
            order_id:id
        }).then((res) => {
            console.log("order info api response",res.data);
            setOrderDetails(res.data.order_detail);
            setProducts(res.data.products);
            setCustomerDetails(res.data.customer_details);
            setNotes(res.data.notes);
            setNotesLength(res.data.notes.length);
            setHistoryList(res.data.history);
            let matchedListArray=[], unmatchedListArray =[];
            Object.entries(res.data.matched).map((value) => {
                matchedListArray.push(value);
            });
            Object.entries(res.data.unmatched).map((value) => {
                unmatchedListArray.push(value);
            })
            // setShipping(res.data.shipping);
            // if(res.data.matched.length>0) {
            //     let selectEnableArray=[];
            //     res.data.matched.map((value) => {
            //         if(selectEnableArray.indexOf(value.lwin18)>=0) {
            //             value.showData = false;
            //         } else {
            //             value.showData = true;
            //         }
            //         selectEnableArray.push(value.lwin18);
            //         console.log(selectEnableArray)
            //     })
            // } 
            // if(res.data.unmatched.length>0) {
            //     let selectUnmatchedEnableArray=[];
            //     res.data.unmatched.map((value) => {
            //         if(selectUnmatchedEnableArray.indexOf(value.lwin18)>=0) {
            //             value.showData = false;
            //         } else {
            //             value.showData = true;
            //         }
            //         selectUnmatchedEnableArray.push(value.lwin18);
            //     })
            // } 
            setMatchedList(matchedListArray);
            console.log(matchedListArray)
            setUnmatchedList(unmatchedListArray);
            // console.log("matched list",res.data.matched)
            // console.log("unmatched list",res.data.unmatched)
        }).catch((error) => {
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
    const handleProfile = (id) => {
        localStorage.setItem('customer_id',id)
        localStorage.setItem('customer_type',"Customer")
        history.push('/accountinfo/communication');
    }
    const handleAlert = (type) => {
        setError("");
        setSuccess("");
        axios.post('/transaction/send_alert'+query,{
            action:type,
            order_id: localStorage.getItem('transaction_id')
        }).then((res) => {
            // console.log("order alert api response",res.data );
            if(res.data.status === 200) {
                setSuccess(res.data.message);
                setInfoModal(true);
            }
            
        }).catch((error) => {
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
    const addNote = (e) => {
        setError("");
        setSuccess("");
        e.preventDefault();
        if(inputNotes) {
            axios.post('/transaction/add_note'+query,
            {
                notes: inputNotes,
                order_id:localStorage.getItem('transaction_id')
            }).then(res => {
                // console.log("Transaction notes",res.data)
                if(res.data.message === "notes added") {
                    //show modal
                    dispatch(fetchTransactionInfo({fetchTransaction:!fetchTransaction}));
                    setSuccess("Notes added successfully!");
                    setInputNotes("");
                    setInfoModal(true);
                } else {
                    setError(res.data.message);
                }
            }).catch((error) => {
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
    }
    const handleSorting = (field) => {
        if(products && products.length>0) {
            let sortedArray=[];
            // setSortOrder('desc');
            if(sortOrder == "asc") {
                setSortOrder('desc');
            }else {
                setSortOrder('asc');
            }

            switch (sortOrder) {
                case 'asc' :
                    switch(field) {
                        case "PRODUCT" :
                            sortedArray = products.sort( function(a, b) {
                                var nameA=a.PRODUCT?a.PRODUCT.split("<br>")[0]:""
                                var nameB=b.PRODUCT?b.PRODUCT.split("<br>")[0]:""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "QUANTITY" :
                            sortedArray = products.sort( function(a, b) {
                                var nameA=a.QUANTITY?parseFloat(a.QUANTITY):""
                                var nameB=b.QUANTITY?parseFloat(b.QUANTITY):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "PRICE" :
                            sortedArray = products.sort( function(a, b) {
                                var nameA=a.PRICE? parseFloat(a.PRICE.replace("$","").replace(/,\s?/g, "")):""
                                var nameB=b.PRICE? parseFloat(b.PRICE.replace("$","").replace(/,\s?/g, "")):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "STATE_TAX" :
                            sortedArray = products.sort( function(a, b) {
                                var nameA=a.STATE_TAX? parseFloat(a.STATE_TAX.replace("$","").replace(/,\s?/g, "")):""
                                var nameB=b.STATE_TAX? parseFloat(b.STATE_TAX.replace("$","").replace(/,\s?/g, "")):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "COUNTRY_TAX" :
                            sortedArray = products.sort( function(a, b) {
                                var nameA=a.COUNTRY_TAX? parseFloat(a.COUNTRY_TAX.replace("$","").replace(/,\s?/g, "")):""
                                var nameB=b.COUNTRY_TAX? parseFloat(b.COUNTRY_TAX.replace("$","").replace(/,\s?/g, "")):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "SHIPPING_OPTIONS" :
                            sortedArray = products.sort( function(a, b) {
                                var nameA=a.SHIPPING_OPTIONS?a.SHIPPING_OPTIONS.toLowerCase():""
                                var nameB=b.SHIPPING_OPTIONS?b.SHIPPING_OPTIONS.toLowerCase():""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "SHIPPING_COST" :
                            sortedArray = products.sort( function(a, b) {
                                var nameA=a.SHIPPING_COST? parseFloat(a.SHIPPING_COST.replace("$","").replace(/,\s?/g, "")):""
                                var nameB=b.SHIPPING_COST? parseFloat(b.SHIPPING_COST.replace("$","").replace(/,\s?/g, "")):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "TARIFF" :
                            sortedArray = products.sort( function(a, b) {
                                var nameA=a.TARIFF? parseFloat(a.TARIFF.replace("$","").replace(/,\s?/g, "")):""
                                var nameB=b.TARIFF? parseFloat(b.TARIFF.replace("$","").replace(/,\s?/g, "")):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "SHIPPING_STATUS" :
                            sortedArray = products.sort( function(a, b) {
                                var nameA=a.SHIPPING_STATUS?a.SHIPPING_STATUS.toLowerCase():""
                                var nameB=b.SHIPPING_STATUS?b.SHIPPING_STATUS.toLowerCase():""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "ROTATION_NUM" :
                            sortedArray = products.sort( function(a, b) {
                                var nameA=a.ROTATION_NUM?parseFloat(a.ROTATION_NUM):""
                                var nameB=b.ROTATION_NUM?parseFloat(b.ROTATION_NUM):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        default:console.log("check sorting Label 1"); break;
                    }
                    setProducts([...sortedArray]);
                    break;
                    case 'desc' :
                        switch(field) {
                            case "PRODUCT" :
                                sortedArray = products.sort( function(a, b) {
                                    var nameA=a.PRODUCT?a.PRODUCT.split("<br>")[0]:""
                                    var nameB=b.PRODUCT?b.PRODUCT.split("<br>")[0]:""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "QUANTITY" :
                                sortedArray = products.sort( function(a, b) {
                                    var nameA=a.QUANTITY?parseFloat(a.QUANTITY):""
                                    var nameB=b.QUANTITY?parseFloat(b.QUANTITY):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRICE" :
                                sortedArray = products.sort( function(a, b) {
                                    var nameA=a.PRICE? parseFloat(a.PRICE.replace("$","").replace(/,\s?/g, "")):""
                                    var nameB=b.PRICE? parseFloat(b.PRICE.replace("$","").replace(/,\s?/g, "")):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "STATE_TAX" :
                                sortedArray = products.sort( function(a, b) {
                                    var nameA=a.STATE_TAX? parseFloat(a.STATE_TAX.replace("$","").replace(/,\s?/g, "")):""
                                    var nameB=b.STATE_TAX? parseFloat(b.STATE_TAX.replace("$","").replace(/,\s?/g, "")):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "COUNTRY_TAX" :
                                sortedArray = products.sort( function(a, b) {
                                    var nameA=a.COUNTRY_TAX? parseFloat(a.COUNTRY_TAX.replace("$","").replace(/,\s?/g, "")):""
                                    var nameB=b.COUNTRY_TAX? parseFloat(b.COUNTRY_TAX.replace("$","").replace(/,\s?/g, "")):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SHIPPING_OPTIONS" :
                                sortedArray = products.sort( function(a, b) {
                                    var nameA=a.SHIPPING_OPTIONS?a.SHIPPING_OPTIONS.toLowerCase():""
                                    var nameB=b.SHIPPING_OPTIONS?b.SHIPPING_OPTIONS.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "TARIFF" :
                            sortedArray = products.sort( function(a, b) {
                                var nameA=a.TARIFF? parseFloat(a.TARIFF.replace("$","").replace(/,\s?/g, "")):""
                                var nameB=b.TARIFF? parseFloat(b.TARIFF.replace("$","").replace(/,\s?/g, "")):""
                                if (nameA > nameB) //sort string ascending
                                    return -1
                                if (nameA < nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                            case "SHIPPING_COST" :
                                sortedArray = products.sort( function(a, b) {
                                    var nameA=a.SHIPPING_COST? parseFloat(a.SHIPPING_COST.replace("$","").replace(/,\s?/g, "")):""
                                    var nameB=b.SHIPPING_COST? parseFloat(b.SHIPPING_COST.replace("$","").replace(/,\s?/g, "")):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SHIPPING_STATUS" :
                                sortedArray = products.sort( function(a, b) {
                                    var nameA=a.SHIPPING_STATUS?a.SHIPPING_STATUS.toLowerCase():""
                                    var nameB=b.SHIPPING_STATUS?b.SHIPPING_STATUS.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "ROTATION_NUM" :
                                sortedArray = products.sort( function(a, b) {
                                    var nameA=a.ROTATION_NUM?parseFloat(a.ROTATION_NUM):""
                                    var nameB=b.ROTATION_NUM?parseFloat(b.ROTATION_NUM):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            default:console.log("check sorting Label 1"); break;
                        }
                        setProducts([...sortedArray]);
                        break;
            }
        
        }
    }

    const handleSortingMatched = (field) => {
        if(matchedList && matchedList.length>0) {
            let sortedArray=[];
            // setSortOrder('desc');
            if(sortOrder == "asc") {
                setSortOrder('desc');
            }else {
                setSortOrder('asc');
            }

            switch (sortOrder) {
                case 'asc' :
                    switch(field) {
                        case "line" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a.line?parseFloat(a.line):""
                                var nameB=b.line?parseFloat(b.line):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "rotation_no" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a.rotation_no?parseFloat(a.rotation_no):""
                                var nameB=b.rotation_no?parseFloat(b.rotation_no):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "product" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a[1][0].product?(a[1][0].product.toLowerCase()):""
                                var nameB=b[1][0].product?(b[1][0].product.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "warehouse" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a.warehouse?(a.warehouse.toLowerCase()):""
                                var nameB=b.warehouse?(b.warehouse.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "po_paid" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a.po_paid?(a.po_paid.toLowerCase()):""
                                var nameB=b.po_paid?(b.po_paid.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "matched_qty" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a[1][0].matched_qty?parseFloat(a[1][0].matched_qty):""
                                var nameB=b[1][0].matched_qty?parseFloat(b[1][0].matched_qty):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "vendor_qty" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a[1][0].vendor_qty?parseFloat(a[1][0].vendor_qty):""
                                var nameB=b[1][0].vendor_qty?parseFloat(b[1][0].vendor_qty):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "size" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a.size?(a.size.toLowerCase()):""
                                var nameB=b.size?(b.size.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "vendor" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a.vendor?(a.vendor.toLowerCase()):""
                                var nameB=b.vendor?(b.vendor.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "lwin18" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a.lwin18?parseFloat(a.lwin18):""
                                var nameB=b.lwin18?parseFloat(b.lwin18):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "price" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a[1][0].price? parseFloat(a[1][0].price.replace("$","").replace(/,\s?/g, "")):""
                                var nameB=b[1][0].price? parseFloat(b[1][0].price.replace("$","").replace(/,\s?/g, "")):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "vendor_price" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a.vendor_price? parseFloat(a.vendor_price.replace("$","").replace(/,\s?/g, "")):""
                                var nameB=b.vendor_price? parseFloat(b.vendor_price.replace("$","").replace(/,\s?/g, "")):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "po" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a.po?parseFloat(a.po):""
                                var nameB=b.po?parseFloat(b.po):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "vintage" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a.vintage?parseFloat(a.vintage):""
                                var nameB=b.vintage?parseFloat(b.vintage):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "order_date" :
                                sortedArray = matchedList.sort( 
                                    (a, b) => new Date (a[1][0].order_date) - new Date(b[1][0].order_date)
                                );
                        break;  
                        default:console.log("check sorting Label 1"); 
                    break;
                }
                    setMatchedList([...sortedArray]);
                    break;
                        case 'desc' :
                            switch(field) {
                                case "line" :
                                sortedArray = matchedList.sort( function(a, b) {
                                    var nameA=a[1][0].line?parseFloat(a[1][0].line):""
                                    var nameB=b[1][0].line?parseFloat(b[1][0].line):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                                case "rotation_no" :
                                    sortedArray = matchedList.sort( function(a, b) {
                                        var nameA=a.rotation_no?parseFloat(a.rotation_no):""
                                        var nameB=b.rotation_no?parseFloat(b.rotation_no):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "product" :
                                    sortedArray = matchedList.sort( function(a, b) {
                                        var nameA=a.product?(a.product.toLowerCase()):""
                                        var nameB=b.product?(b.product.toLowerCase()):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "warehouse" :
                            sortedArray = matchedList.sort( function(a, b) {
                                var nameA=a.warehouse?(a.warehouse.toLowerCase()):""
                                var nameB=b.warehouse?(b.warehouse.toLowerCase()):""
                                if (nameA > nameB) //sort string ascending
                                    return -1
                                if (nameA < nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                                case "matched_qty" :
                                    sortedArray = matchedList.sort( function(a, b) {
                                        var nameA=a[1][0].matched_qty?parseFloat(a[1][0].matched_qty):""
                                        var nameB=b[1][0].matched_qty?parseFloat(b[1][0].matched_qty):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "size" :
                                    sortedArray = matchedList.sort( function(a, b) {
                                        var nameA=a.size?(a.size.toLowerCase()):""
                                        var nameB=b.size?(b.size.toLowerCase()):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "vendor" :
                                    sortedArray = matchedList.sort( function(a, b) {
                                        var nameA=a.vendor?(a.vendor.toLowerCase()):""
                                        var nameB=b.vendor?(b.vendor.toLowerCase()):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "lwin18" :
                                    sortedArray = matchedList.sort( function(a, b) {
                                        var nameA=a.lwin18?parseFloat(a.lwin18):""
                                        var nameB=b.lwin18?parseFloat(b.lwin18):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "price" :
                                    sortedArray = matchedList.sort( function(a, b) {
                                        var nameA=a[1][0].price? parseFloat(a[1][0].price.replace("$","").replace(/,\s?/g, "")):""
                                        var nameB=b[1][0].price? parseFloat(b[1][0].price.replace("$","").replace(/,\s?/g, "")):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "vendor_price" :
                                    sortedArray = matchedList.sort( function(a, b) {
                                        var nameA=a.vendor_price? parseFloat(a.vendor_price.replace("$","").replace(/,\s?/g, "")):""
                                        var nameB=b.vendor_price? parseFloat(b.vendor_price.replace("$","").replace(/,\s?/g, "")):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "po" :
                                    sortedArray = matchedList.sort( function(a, b) {
                                        var nameA=a.po?parseFloat(a.po):""
                                        var nameB=b.po?parseFloat(b.po):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "vintage" :
                                    sortedArray = matchedList.sort( function(a, b) {
                                        var nameA=a.vintage?parseFloat(a.vintage):""
                                        var nameB=b.vintage?parseFloat(b.vintage):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "order_date" :
                                    sortedArray = matchedList.sort( 
                                        (a, b) => new Date (b[1][0].order_date) - new Date(a[1][0].order_date)
                                    );
                                break;
                                case "vendor_qty" :
                                    sortedArray = matchedList.sort( function(a, b) {
                                        var nameA=a[1][0].vendor_qty?parseFloat(a[1][0].vendor_qty):""
                                        var nameB=b[1][0].vendor_qty?parseFloat(b[1][0].vendor_qty):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break; 
                                case "po_paid" :
                                    sortedArray = matchedList.sort( function(a, b) {
                                        var nameA=a.po_paid?(a.po_paid.toLowerCase()):""
                                        var nameB=b.po_paid?(b.po_paid.toLowerCase()):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                            default:console.log("check sorting Label 1"); 
                        break;
                        }
                        
                        setMatchedList([...sortedArray]);
                    break;
            }
            // console.log(sortedArray)
        }
    }

    const handleSortingUnmatched = (field) => {
        if(unmatchedList && unmatchedList.length>0) {
            let sortedArray=[];
            // setSortOrder('desc');
            if(sortOrder == "asc") {
                setSortOrder('desc');
            }else {
                setSortOrder('asc');
            }

            switch (sortOrder) {
                case 'asc' :
                        switch(field) {
                        case "line" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a.line?parseFloat(a.line):""
                                var nameB=b.line?parseFloat(b.line):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "rotation_no" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a.rotation_no?parseFloat(a.rotation_no):""
                                var nameB=b.rotation_no?parseFloat(b.rotation_no):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "product" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a[1][0].product?(a[1][0].product.toLowerCase()):""
                                var nameB=b[1][0].product?(b[1][0].product.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        
                        case "stock_source" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a.stock_source?(a.stock_source.toLowerCase()):""
                                var nameB=b.stock_source?(b.stock_source.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "unmatched_qty" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a[1][0].unmatched_qty?parseFloat(a[1][0].unmatched_qty):""
                                var nameB=b[1][0].unmatched_qty?parseFloat(b[1][0].unmatched_qty):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "vendor_qty" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a.vendor_qty?parseFloat(a.vendor_qty):""
                                var nameB=b.vendor_qty?parseFloat(b.vendor_qty):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "size" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a.size?(a.size.toLowerCase()):""
                                var nameB=b.size?(b.size.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "vendor_name" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a.vendor_name?(a.vendor_name.toLowerCase()):""
                                var nameB=b.vendor_name?(b.vendor_name.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "lwin18" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a.lwin18?parseFloat(a.lwin18):""
                                var nameB=b.lwin18?parseFloat(b.lwin18):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "price" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a[1][0].price? parseFloat(a[1][0].price.replace("$","").replace(/,\s?/g, "")):""
                                var nameB=b[1][0].price? parseFloat(b[1][0].price.replace("$","").replace(/,\s?/g, "")):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "vendor_price" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a.vendor_price? parseFloat(a.vendor_price.replace("$","").replace(/,\s?/g, "")):""
                                var nameB=b.vendor_price? parseFloat(b.vendor_price.replace("$","").replace(/,\s?/g, "")):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "po" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a.po?parseFloat(a.po):""
                                var nameB=b.po?parseFloat(b.po):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "vintage" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a.vintage?parseFloat(a.vintage):""
                                var nameB=b.vintage?parseFloat(b.vintage):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "vendor_email" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a.vendor_email?(a.vendor_email.toLowerCase()):""
                                var nameB=b.vendor_email?(b.vendor_email.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "vendor_phone" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a.vendor_phone?parseFloat(a.vendor_phone):""
                                var nameB=b.vendor_phone?parseFloat(b.vendor_phone):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "vendor_contact" :
                            sortedArray = unmatchedList.sort( function(a, b) {
                                var nameA=a.vendor_contact?parseFloat(a.vendor_contact):""
                                var nameB=b.vendor_contact?parseFloat(b.vendor_contact):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "order_date" :
                                sortedArray = unmatchedList.sort( 
                                    (a, b) => new Date (a[1][0].order_date) - new Date(b[1][0].order_date)
                                );
                        break;
                    
                        default:console.log("check sorting Label 1"); 
                    break;
                        }
                    setUnmatchedList([...sortedArray]);
                    break;
                    case 'desc' :
                        switch(field) {
                                case "line" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a.line?parseFloat(a.line):""
                                        var nameB=b.line?parseFloat(b.line):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "rotation_no" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a.rotation_no?parseFloat(a.rotation_no):""
                                        var nameB=b.rotation_no?parseFloat(b.rotation_no):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "product" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a[1][0].product?(a[1][0].product.toLowerCase()):""
                                        var nameB=b[1][0].product?(b[1][0].product.toLowerCase()):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "stock_source" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a.stock_source?(a.stock_source.toLowerCase()):""
                                        var nameB=b.stock_source?(b.stock_source.toLowerCase()):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "unmatched_qty" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a[1][0].unmatched_qty?parseFloat(a[1][0].unmatched_qty):""
                                        var nameB=b[1][0].unmatched_qty?parseFloat(b[1][0].unmatched_qty):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "size" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a.size?(a.size.toLowerCase()):""
                                        var nameB=b.size?(b.size.toLowerCase()):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "vendor_name" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a.vendor?(a.vendor.toLowerCase()):""
                                        var nameB=b.vendor?(b.vendor.toLowerCase()):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "lwin18" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a.lwin18?parseFloat(a.lwin18):""
                                        var nameB=b.lwin18?parseFloat(b.lwin18):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "price" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a[1][0].price? parseFloat(a[1][0].price.replace("$","").replace(/,\s?/g, "")):""
                                        var nameB=b[1][0].price? parseFloat(b[1][0].price.replace("$","").replace(/,\s?/g, "")):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "vendor_price" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a.vendor_price? parseFloat(a.vendor_price.replace("$","").replace(/,\s?/g, "")):""
                                        var nameB=b.vendor_price? parseFloat(b.vendor_price.replace("$","").replace(/,\s?/g, "")):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "po" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a.po?parseFloat(a.po):""
                                        var nameB=b.po?parseFloat(b.po):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "vintage" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a.vintage?parseFloat(a.vintage):""
                                        var nameB=b.vintage?parseFloat(b.vintage):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "vendor_email" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a.vendor_email?(a.vendor_email.toLowerCase()):""
                                        var nameB=b.vendor_email?(b.vendor_email.toLowerCase()):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "vendor_phone" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a.vendor_phone?parseFloat(a.vendor_phone):""
                                        var nameB=b.vendor_phone?parseFloat(b.vendor_phone):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;  
                                case "vendor_contact" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a.vendor_contact?parseFloat(a.vendor_contact):""
                                        var nameB=b.vendor_contact?parseFloat(b.vendor_contact):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;  
                                case "order_date" :
                                sortedArray = unmatchedList.sort( 
                                    (a, b) => new Date (b[1][0].order_date) - new Date(b[1][0].order_date)
                                );
                                break;  
                                case "vendor_qty" :
                                    sortedArray = unmatchedList.sort( function(a, b) {
                                        var nameA=a.vendor_qty?parseFloat(a.vendor_qty):""
                                        var nameB=b.vendor_qty?parseFloat(b.vendor_qty):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                default:console.log("check sorting Label 1"); 
                            break;
                        }
                    setUnmatchedList([...sortedArray]);
                    break;
            }
        
        }
    }
    const handleSortingShipping= (field) => {
        if(matchedList && matchedList.length>0) {
            let sortedArray=[];
            // setSortOrder('desc');
            if(sortOrder == "asc") {
                setSortOrder('desc');
            }else {
                setSortOrder('asc');
            }

            switch (sortOrder) {
                case 'asc' :
                    switch(field) {
                        case "line" :
                            sortedArray = shipping.sort( function(a, b) {
                                var nameA=a.line?parseFloat(a.line):""
                                var nameB=b.line?parseFloat(b.line):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "rotation_no" :
                            sortedArray = shipping.sort( function(a, b) {
                                var nameA=a.rotation_no?parseFloat(a.rotation_no):""
                                var nameB=b.rotation_no?parseFloat(b.rotation_no):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "status" :
                            sortedArray = shipping.sort( function(a, b) {
                                var nameA=a.status?(a.status.toLowerCase()):""
                                var nameB=b.status?(b.status.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "barcode" :
                            sortedArray = shipping.sort( function(a, b) {
                                var nameA=a.barcode?(a.barcode.toLowerCase()):""
                                var nameB=b.barcode?(b.barcode.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "matched_case" :
                            sortedArray = shipping.sort( function(a, b) {
                                var nameA=a.matched_case?(a.matched_case.toLowerCase()):""
                                var nameB=b.matched_case?(b.matched_case.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "weight" :
                            sortedArray = shipping.sort( function(a, b) {
                                var nameA=a.weight?parseFloat(a.weight):""
                                var nameB=b.weight?parseFloat(b.weight):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "po" :
                            sortedArray = shipping.sort( function(a, b) {
                                var nameA=a.po?parseFloat(a.po):""
                                var nameB=b.po?parseFloat(b.po):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "tracking" :
                            sortedArray = shipping.sort( function(a, b) {
                                var nameA=a.tracking?parseFloat(a.tracking):""
                                var nameB=b.tracking?parseFloat(b.tracking):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        default:console.log("check sorting Label 1"); 
                    break;
                }
                    setMatchedList([...sortedArray]);
                    break;
                    case 'desc' :
                        switch(field) {
                            case "line" :
                                sortedArray = shipping.sort( function(a, b) {
                                    var nameA=a.line?parseFloat(a.line):""
                                    var nameB=b.line?parseFloat(b.line):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "rotation_no" :
                                sortedArray = shipping.sort( function(a, b) {
                                    var nameA=a.rotation_no?parseFloat(a.rotation_no):""
                                    var nameB=b.rotation_no?parseFloat(b.rotation_no):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "status" :
                                sortedArray = shipping.sort( function(a, b) {
                                    var nameA=a.status?(a.status.toLowerCase()):""
                                    var nameB=b.status?(b.status.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "barcode" :
                                sortedArray = shipping.sort( function(a, b) {
                                    var nameA=a.barcode?(a.barcode.toLowerCase()):""
                                    var nameB=b.barcode?(b.barcode.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "weight" :
                                sortedArray = shipping.sort( function(a, b) {
                                    var nameA=a.weight?(a.weight.toLowerCase()):""
                                    var nameB=b.weight?(b.weight.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "matched_qty" :
                                sortedArray = shipping.sort( function(a, b) {
                                    var nameA=a.weight?parseFloat(a.weight):""
                                    var nameB=b.weight?parseFloat(b.weight):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "po" :
                                sortedArray = shipping.sort( function(a, b) {
                                    var nameA=a.po?parseFloat(a.po):""
                                    var nameB=b.po?parseFloat(b.po):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "tracking" :
                                sortedArray = shipping.sort( function(a, b) {
                                    var nameA=a.tracking?parseFloat(a.tracking):""
                                    var nameB=b.tracking?parseFloat(b.tracking):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            default:console.log("check sorting Label 1"); break;
                        }
                        setMatchedList([...sortedArray]);
                    break;
            }
        
        }
    }
    const handleNextPrev = (type) => {
        // console.log("note length",noteCounter,notesLength)
        if(type==="next") {
            if(noteCounter < notes.length-1) {
                setNoteCounter(noteCounter + 1);
            }
        }else {
            if(noteCounter>0) {
                setNoteCounter(noteCounter-1);
            }
        }
    }
    const handleRedirection = (value) => {
        localStorage.setItem("customer_id",value.vendor_id);
        localStorage.setItem("route-role","Vendor");
        dispatch(setInvoiceData({data:value}));
        if(localStorage.getItem("customer_id")) {
            history.push("/create-invoice")
        }
    }
    const handleFillForm = (item) => {
        console.log(item)
        setIsUpdate(true);
        setLwin18(item.lwin18 ? item.lwin18 :"");
        setError("");
        setSuccess("");
        setFulFillDate("");
        setLandingDate(item.landed_date ? item.landed_date : "");
        if(item.warehouse) {
            setSelectedWareHouse({
                value:item.warehouse,
                label: item.warehouse
            });
        } else {
            setSelectedWareHouse(null);
        }
        if(item.product) {
            setSelectedSize({
                value:item.product.split("<br>")[1].split(",")[1].trim(),
                label:item.product.split("<br>")[1].split(",")[1].trim()
            });
        } else {
            setSelectedSize(null);
        }
        setRotationNo(item.rotation_no ? item.rotation_no :"");
        setUUID(item.uuid ? item.uuid :"");
        setOrderNo(item.po?item.po:"")
        setQty(item.matched_qty?item.matched_qty:"");
        if(item.condition==0) {
            setIsCondition("no")
        } else {
            setIsCondition("yes");
        }
        setEditNotes(item.notes?item.notes:"");
        setLandInfo(true);
    }
    const handleAddMore = () => {
        setIsUpdate(false);
        setError("");
        setSuccess("");
        setFulFillDate("");
        setLandingDate("");
        setSelectedSize(null);
        setSelectedWareHouse(null);
        setRotationNo("");
        setUUID("");
        setQty("");
        setIsCondition("yes");
        setEditNotes("");
    }
    const handleAddUser = (e) => {
        e.preventDefault();
        // console.log("selected size", selectedSize)
        if(selectedSize!= null && selectedWareHouse!=null) {
            axios.post('/transaction/fullfill'+query,{
                fullfill_date:editFulFillData,
                landing_date: editLandingData,
                warehouse: selectedWareHouse.value,
                rotation_no: editRotationNo,
                uuid: editUUID,
                size: selectedSize.value,
                qty: editQty,
                condition: isEditCondition==="yes" ? 1 : 0,
                notes: editNotes,
                po_number: orderNo,
                lwin18: lwin18,
                update: isUpdate ? 1 : 0            
    
            }).then((res) => {
                // console.log("Land wine api response",res.data);
                if(res.data.message==="saved") {
                    setError("");
                    setSuccess("Details saved!");
                    setFulFillDate("");
                    setLandingDate("");
                    setSelectedSize(null);
                    setSelectedWareHouse(null);
                    setRotationNo("");
                    setUUID("");
                    setQty("");
                    setIsCondition("yes");
                    setEditNotes("");
                }
            }).catch((error) => {
                console.log(error);
            });
        } else {
            setError("Select required fields");
        }
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
    const handleSortingHistory = (field) => {
        if(historyList && historyList.length>0) {
            let sortedArray=[];
            // setSortOrder('desc');
            if(sortOrder == "asc") {
                setSortOrder('desc');
            }else {
                setSortOrder('asc');
            }

            switch (sortOrder) {
                case 'asc' :
                    switch(field) {
                        case "activity" :
                            sortedArray = historyList.sort( function(a, b) {
                                var nameA=a.activity?(a.activity.toLowerCase()):""
                                var nameB=b.activity?(b.activity.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "user" :
                            sortedArray = historyList.sort( function(a, b) {
                                var nameA=a.user?(a.user.toLowerCase()):""
                                var nameB=b.user?(b.user.toLowerCase()):""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        case "activity_date" :
                                sortedArray = historyList.sort( 
                                    (a, b) => new Date (a.activity_date) - new Date(b.activity_date)
                                );
                        break;  
                        default:console.log("check sorting Label 1"); 
                    break;
                }
                    setHistoryList([...sortedArray]);
                    break;
                        case 'desc' :
                            switch(field) {
                                case "activity" :
                                    sortedArray = historyList.sort( function(a, b) {
                                        var nameA=a.activity?(a.activity.toLowerCase()):""
                                        var nameB=b.activity?(b.activity.toLowerCase()):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "user" :
                                    sortedArray = historyList.sort( function(a, b) {
                                        var nameA=a.user?(a.user.toLowerCase()):""
                                        var nameB=b.user?(b.user.toLowerCase()):""
                                        if (nameA > nameB) //sort string ascending
                                            return -1
                                        if (nameA < nameB)
                                            return 1
                                        return 0 //default return value (no sorting)
                                    });
                                break;
                                case "activity_date" :
                                        sortedArray = historyList.sort( 
                                            (a, b) => new Date (b.activity_date) - new Date(a.activity_date)
                                        );
                                break; 
                            default:console.log("check sorting Label 1"); 
                        break;
                        }
                        
                        setHistoryList([...sortedArray]);
                    break;
            }
            // console.log(sortedArray)
        }
    }
    return (
   <>
    <div>
        <div className="transaction-page">
            <div className="header">
                <h4>Transaction #{id}</h4>
                {/* <div className="right-side">
                    <div className="search-opt">
                        <input placeholder="Search Orders" type="text"/>
                        <img src={SearchIcon} />
                    </div>
                </div> */}
            </div>
            <div className="transaction-result d-flex justify-content-between mt-4">
                <div className="result-list">
                    <span className="d-block">{orderDetails ? orderDetails.products.SHOPIFY_ORDER_NUMBER ? orderDetails.products.SHOPIFY_ORDER_NUMBER : "-" : "-"}</span>
                    <label>Shopify Order Number</label>
                </div>
                <div className="result-list result-list-row d-flex">
                    <div className="list-col">
                        <span className="d-block">{orderDetails ? orderDetails.products.ORDER_DATE ? orderDetails.products.ORDER_DATE : "-" : "-"}</span>
                        <label>Order Date</label>
                    </div>
                    <div className="list-col">
                        <span className="d-block">{orderDetails ? orderDetails.products.PAYMENT_DATE ? orderDetails.products.PAYMENT_DATE : "-" : "-"}</span>
                        <label>Payment Date</label>
                    </div>
                    <div className="list-col">
                        <span className="d-block">{orderDetails ? orderDetails.products.PAYMENT_STATUS ? orderDetails.products.PAYMENT_STATUS : "-" : "-"}</span>
                        <label>Payment Status</label>
                    </div>
                </div>
                <div className="result-list result-list-row d-flex">
                    <div className="list-col">
                        <span className="d-block">{orderDetails ? orderDetails.products.DUE_LAND_DATE ? orderDetails.products.DUE_LAND_DATE : "-" : "-"}</span>
                        <label>Due to Land</label>
                    </div>
                    <div className="list-col">
                        <span className="d-block">{orderDetails ? orderDetails.products.SHIPPING_DATE_EST ? orderDetails.products.SHIPPING_DATE_EST : "-" : "-"}</span>
                        <label>Estimated Shipping Date</label>
                    </div>
                </div>
                <div className="result-list">
                    <span className="d-block">{orderDetails ? orderDetails.products.ORDER_TYPE ? orderDetails.products.ORDER_TYPE : "-" : "-"}</span>
                    <label>Order Type</label>
                </div>
            </div>
            <div className="transaction-result-table-block">
                <div className="customer-table">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("PRODUCT")}>Product</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("QUANTITY")}>Qty</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("PRICE")}>Price</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("STATE_TAX")}>State Tax</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("COUNTRY_TAX")}>Country Tax</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("TARIFF")}>Tariff</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("SHIPPING_OPTIONS")}>Shipping Option</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("SHIPPING_COST")}>Shipping Cost</th>
                                <th className="cursor-pointer" onClick={() => handleSorting("SHIPPING_STATUS")}>Shipping Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                products && products.length > 0 ? (
                                    products ? products.length > 0 ? (
                                            products ? products.map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index+1}</td>
                                                        <td>
                                                            <div className="Product-name">
                                                                <h5>{value.PRODUCT ? value.PRODUCT.split("<br>")[0] : "-"}</h5>
                                                                <span>{value.PRODUCT ? value.PRODUCT.split("<br>")[1] : "-"}</span>
                                                                <span>{value.PRODUCT ? value.PRODUCT.split("<br>")[2] : "-"}</span>
                                                                <span className="name-lwin">{value.PRODUCT ? value.PRODUCT.split("<br>")[3] : "-"}</span>
                                                            </div>
                                                        </td>
                                                        <td>{value.QUANTITY ? value.QUANTITY : "-"}</td>
                                                        <td>{value.PRICE ? value.PRICE : "-"}</td>
                                                        <td>{value.STATE_TAX ? value.STATE_TAX : "-"}</td>
                                                        <td>{value.COUNTRY_TAX ? value.COUNTRY_TAX : "-"}</td>
                                                        <td style={{color:value.COLOR}}>{value.TARIFF ? value.TARIFF : "-"}</td>
                                                        <td>{value.SHIPPING_OPTIONS ? value.SHIPPING_OPTIONS : "-"}</td>
                                                        <td>{value.SHIPPING_COST ? value.SHIPPING_COST : "-"}</td>
                                                        <td>{value.SHIPPING_STATUS ? value.SHIPPING_STATUS : "-"}</td>
                                                    </tr>
                                                )
                                            }):(
                                            <tr >
                                                <td colSpan="10" className="text-center">Loading...</td>
                                            </tr>
                                            )
    
                                    ):(<tr >
                                        <td colSpan="10" className="text-center">NO PRODUCTS AVAILABLE</td>
                                    </tr>) : (<tr >
                                        <td colSpan="10" className="text-center">Loading...</td>
                                    </tr>)
                                
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center"> No Products Available</td>
                                </tr>
                            )
                        }
                            
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="2">
                                    <div className="unmatched-col d-flex align-items-center">
                                        <i className="unmatched-dot red-type mr-2"></i>
                                        <span>{orderDetails ? orderDetails.MATCH_STATUS ? orderDetails.MATCH_STATUS : "-" : "-"}</span>
                                    </div>
                                </td>
                                <td colSpan="8">
                                    <div className="transaction-result-tfoot-option d-flex justify-content-end">
                                        <div className="tfoot-list tfoot-gray">
                                            <span onClick= {() => handleAlert('tariff_mail')}>Tariff Email</span>
                                        </div>
                                        <div className="tfoot-list">
                                            <span onClick= {() => handleAlert('ready2ship')}>Ready to Ship Email</span>
                                        </div>
                                        <div className="tfoot-list">
                                            <span onClick= {() => handleAlert('ship_status')}>Email Shipping Status</span>
                                        </div>
                                        <div className="tfoot-list">
                                            <span>Edit Invoice</span>
                                        </div>
                                        <div className="tfoot-list">
                                            <span>Delete</span>
                                        </div>
                                        <div className="tfoot-list">
                                            <span onClicl={() => {history.push("/logistics")}}>View Logistics</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                        <tfoot>
                            <tr>
                                <td colSpan="9"></td>
                                <td>
                                    <div className="transaction-result-tfoot-option d-flex justify-content-start">
                                        <div className="tfoot-list pl-0">
                                            <span className="text-total">{"Total: $"}{orderDetails ? orderDetails.product_total ? orderDetails.product_total : "-" : "-"}</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
            </div>
            {/* <div className="transaction-shipping">
                <h2>Shipping</h2>
                <div className="transaction-shipping-table">
                    <Table>
                        <thead>
                            <tr>
                                <th className="cursor-pointer" onClick={() => handleSortingShipping("line")}>Line #</th>
                                <th className="cursor-pointer" onClick={() => handleSortingShipping("rotation_no")}>Rotation #</th>
                                <th className="cursor-pointer" onClick={() => handleSortingShipping("status")}>Status</th>
                                <th className="cursor-pointer" onClick={() => handleSortingShipping("barcode")}>Barcode</th>
                                <th className="cursor-pointer" onClick={() => handleSortingShipping("weight")}>Weight</th>
                                <th className="cursor-pointer" onClick={() => handleSortingShipping("tracking")}>Tracking</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                shipping && shipping.length>0 ? (
                                    shipping.map((value,index) => {
                                        return(
                                            <tr key={index}>
                                                <td>{value.line ? value.line: "-"}</td>
                                                <td>{value.rotation_no ? value.rotation_no: "-"}</td>
                                                <td>{value.status ? value.status: "-"}</td>
                                                <td>{value.barcode ? value.barcode: "-"}</td>
                                                <td>{value.weight ? value.weight: "-"}</td>
                                                <td>{value.tracking ? value.tracking: "-"}</td>
                                            </tr>

                                        )
                                    })
                                ):(
                                    <tr>
                                        <td colSpan="6" className="text-center">No Shipping Available</td>
                                    </tr>
                                ) 
                            }
                        </tbody>
                    </Table>
                </div>
            </div> */}
            <Accordion defaultActiveKey="0" className="mb-2">
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={() => setIsMatchedOpen(!isMatchedOpen)}>
                            {isMatchedOpen ? "Show Matched" : "Hide Matched"}
                        </Accordion.Toggle>
                    </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <div className="transaction-shipping">
                        <div className="transaction-shipping-table table-thead-border">
                            <Table>
                                <thead>
                                    <tr>
                                        <th className="cursor-pointer" onClick={() => handleSortingMatched("order_date")}>Order Date</th>
                                        <th className="cursor-pointer" onClick={() => handleSortingMatched("product")}>Product</th>
                                        <th className="cursor-pointer" onClick={() => handleSortingMatched("price")}>Sold Price</th>
                                        <th className="cursor-pointer" onClick={() => handleSortingMatched("matched_qty")}>Sold Qty</th>
                                        
                                        <th>PO</th>
                                        <th>Vendor Name</th>
                                        <th>Stock Product</th>
                                        <th>Order Price</th>
                                        <th>Vendor Qty</th>
                                        <th>Rotation No</th>
                                        <th>Warehouse</th>
                                        <th>Land Wine</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        matchedList && matchedList.length>0 ? (
                                            matchedList.map((value,index) => {
                                                let data = value[1];
                                                return(
                                                    <tr key={index}>
                                                        <td>{(data[0].order_date) ? data[0].order_date: "-"}</td>
                                                        <td>{(data[0].product) ? 
                                                            <>
                                                                <span className="d-block">{data[0].product.split('<br>')[0]}</span>
                                                                <span className="d-block">{data[0].product.split('<br>')[1]}</span>
                                                            </>: ""}
                                                        </td>
                                                        <td>{(data[0].price) ? data[0].price: ""}</td>
                                                        <td>{(data[0].matched_qty) ? data[0].matched_qty: ""}</td>
                                                        <td className="create-link">
                                                            {
                                                                data.map((val,index) => {
                                                                    return(
                                                                        <div key={index} className="product-wine-list">
                                                                            <span className="cursor-pointer" onClick={() => handlePDF(val.po,"PO")}>{val.po?val.po:""}</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                data.map((val,index) => {
                                                                    return(
                                                                        <div key={index} className="product-wine-list">
                                                                            <span>{val.vendor ? val.vendor: "-"}</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                data.map((val,index) => {
                                                                    return(
                                                                        <div key={index} className="product-wine-list ">
                                                                            <span className="d-block mb-0">{val.stock_product.split('<br>')[0]}</span>
                                                                            <span className="d-block">{val.stock_product.split('<br>')[1]}</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                data.map((val,index) => {
                                                                    return(
                                                                        <div key={index} className="product-wine-list">
                                                                            <span>{val.vendor_price ? val.vendor_price: "-"}</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td>
                                                        {
                                                            data.map((val,index) => {
                                                                return(
                                                                    <div key={index} className="product-wine-list">
                                                                        <span>{val.vendor_qty?val.vendor_qty:"-"}</span>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        </td>
                                                        <td>
                                                            {
                                                                data.map((val,index) => {
                                                                    return(
                                                                        <div key={index} className="product-wine-list">
                                                                            <span>{val.rotation_no ? val.rotation_no: "-"}</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                data.map((val,index) => {
                                                                    return(
                                                                        <div key={index} className="product-wine-list">
                                                                            <span>{val.warehouse ? val.warehouse: "-"}</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td className="create-link">
                                                            {
                                                                data.map((val,index) => {
                                                                    return(
                                                                        <div key={index} className="product-wine-list">
                                                                            <span className="cursor-pointer" 
                                                                                  onClick={() => { handleFillForm(val)
                                                                                   }
                                                                                }>Update</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                    </tr>

                                                )
                                            })
                                        ):(
                                            <tr>
                                                <td colSpan="11" className="text-center">No Data Available</td>
                                            </tr>
                                        ) 
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>

        <Accordion defaultActiveKey="0" className="mb-2">
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={() => setIsUnmatchedOpen(!isUnmatchedOpen)}>
                            {isUnmatchedOpen ? "Show Unmatched" : "Hide Unmatched"}
                        </Accordion.Toggle>
                    </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                    <div className="transaction-shipping">
                        <div className="transaction-shipping-table table-thead-border">
                            <Table>
                                <thead>
                                    <tr>
                                        <th className="cursor-pointer" onClick={() => handleSortingUnmatched("order_date")}>Order Date</th>
                                        <th className="cursor-pointer" onClick={() => handleSortingUnmatched("product")}>Product</th>
                                        <th className="cursor-pointer" onClick={() => handleSortingUnmatched("price")}>Sold Price</th>
                                        <th className="cursor-pointer" onClick={() => handleSortingUnmatched("unmatched_qty")}>Sold Qty</th>

                                        <th>Vendor Name</th>
                                        <th>Order Price</th>
                                        <th>Vendor Qty</th>
                                        <th>Vendor Email</th>
                                        <th>Vendor Phone</th>
                                        <th>Primary Contact</th>
                                        <th>Create PO</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        unmatchedList && unmatchedList.length>0 ? (
                                            unmatchedList.map((value,index) => {
                                                let data = value[1];
                                                return(
                                                    <tr key={index}>
                                                        <td>{(data[0].order_date) ? data[0].order_date: "-"}</td>
                                                        <td>{(data[0].product) ? 
                                                            <>
                                                                <span className="d-block">{data[0].product.split('<br>')[0]}</span>
                                                                <span className="d-block">{data[0].product.split('<br>')[1]}</span>
                                                            </>: "-"}
                                                        </td>
                                                        <td>{(data[0].price) ? data[0].price: "-"}</td>
                                                        <td>{(data[0].unmatched_qty) ? data[0].unmatched_qty: "-"}</td>
                                                        <td>
                                                            {
                                                                data.map((val,index) => {
                                                                    return(
                                                                        <div key={index} className="product-wine-list">
                                                                            <span>{val.vendor_name?val.vendor_name:"-"}</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                data.map((val,index) => {
                                                                    return(
                                                                        <div key={index} className="product-wine-list">
                                                                            <span>{val.vendor_price?val.vendor_price:"-"}</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td>
                                                        {
                                                            data.map((val,index) => {
                                                                return(
                                                                    <div key={index} className="product-wine-list">
                                                                        <span>{val.vendor_qty?val.vendor_qty:"-"}</span>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                        </td>
                                                        <td>
                                                            {
                                                                data.map((val,index) => {
                                                                    return(
                                                                        <div key={index} className="product-wine-list">
                                                                            <span>{val.vendor_email?val.vendor_email:"-"}</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                data.map((val,index) => {
                                                                    return(
                                                                        <div key={index} className="product-wine-list">
                                                                            <span>{val.vendor_phone?val.vendor_phone:"-"}</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                data.map((val,index) => {
                                                                    return(
                                                                        <div key={index} className="product-wine-list">
                                                                            <span>{val.vendor_contact?val.vendor_contact:"-"}</span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                        <td className="create-link">
                                                            {
                                                                data.map((val,index) => {
                                                                    return(
                                                                        <div key={index} className="product-wine-list">
                                                                            <span className="cursor-pointer" 
                                                                                    onClick={() => { handleRedirection(val)
                                                                                    }}>Create
                                                                            </span>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </td>
                                                    </tr>

                                                )
                                            })
                                        ):(
                                            <tr>
                                                <td colSpan="11" className="text-center">No Data Available</td>
                                            </tr>
                                        ) 
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        <Accordion defaultActiveKey="0" className="mb-2">
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
                            {isMatchedOpen ? "Show Trsansaction History" : "Hide Trsansaction History"}
                        </Accordion.Toggle>
                    </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <div className="transaction-shipping">
                        <div className="transaction-shipping-table table-thead-border">
                            <Table>
                                <thead>
                                    <tr>
                                        <th className="cursor-pointer" onClick={() => handleSortingHistory("activity_date")}>Activity Time</th>
                                        <th className="cursor-pointer" onClick={() => handleSortingHistory("activity")}>Activity</th>
                                        <th className="cursor-pointer" onClick={() => handleSortingHistory("user")}>User</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        historyList && historyList.length>0 ? (
                                            historyList.map((data,index) => {
                                                return(
                                                    <tr key={index}>
                                                        <td>{(data.activity_date) ? data.activity_date: "-"}</td>
                                                        <td>{(data.activity) ? data.activity: "-"}</td>
                                                        <td>{(data.user) ? data.user: "-"}</td>
                                                    </tr>

                                                )
                                            })
                                        ):(
                                            <tr>
                                                <td colSpan="3" className="text-center">No Data Available</td>
                                            </tr>
                                        ) 
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
            
            <div className="customer-notes-wrapper d-flex flex-column flex-md-row">
                <div className="customer-block">
                    <h2>Customer Details</h2>
                    <div className="customer-card d-flex">
                        <div className="customer-info">
                            <div className="customer-info-list">
                                <span>{customerDetails ? customerDetails.CUSTOMER_NAME ? customerDetails.CUSTOMER_NAME : "" : ""}</span>
                                <label>Name</label>
                            </div>
                            <div className="customer-info-list">
                                <span>{customerDetails ? customerDetails.EMAIL ? customerDetails.EMAIL : "" : ""}</span>
                                <label>Email</label>
                            </div>
                            <div className="customer-info-list">
                                <span>{customerDetails ? customerDetails.ACCOUNT_NUMBER ? customerDetails.ACCOUNT_NUMBER : "" : ""}</span>
                                <label>Account Number</label>
                            </div>
                        </div>
                        <div className="customer-info">
                            <div className="customer-info-list">
                            <span>{customerDetails ? customerDetails.SHIPPING_COMPANY ? customerDetails.SHIPPING_COMPANY : "" : ""}</span>
                                <span>{customerDetails ? customerDetails.SHIPPING_NAME ? customerDetails.SHIPPING_NAME : "" : ""}</span>
                                <span>{customerDetails ? customerDetails.SHIPPING_ADDRESS_1 ? customerDetails.SHIPPING_ADDRESS_1 : "" : ""}</span>
                                <span>{customerDetails ? customerDetails.SHIPPING_ADDRESS_2 ? customerDetails.SHIPPING_ADDRESS_2 : "" : ""}</span>
                                <span>{customerDetails ? customerDetails.SHIPPING_ZIP ? customerDetails.SHIPPING_TOWN +', '+customerDetails.SHIPPING_ZIP : "" : ""}</span>
                                <span>{customerDetails ? customerDetails.SHIPPING_COUNTRY ? customerDetails.SHIPPING_STATE +', '+customerDetails.SHIPPING_COUNTRY : "" : ""}</span>
                                <span>{customerDetails ? customerDetails.SHIPPING_PHONE ? customerDetails.SHIPPING_PHONE : "" : ""}</span>
                                <label>Shipping Address</label>
                            </div>
                            <div className="customer-info-list">
                            <span>{customerDetails ? customerDetails.BILLING_NAME ? customerDetails.BILLING_NAME : "" : ""}</span>
                                <span>{customerDetails ? customerDetails.BILLING_ADDRESS_1 ? customerDetails.BILLING_ADDRESS_1 : "" : ""}</span>
                                <span>{customerDetails ? customerDetails.BILLING_ADDRESS_2 ? customerDetails.BILLING_ADDRESS_2 : "" : ""}</span>
                                <span>{customerDetails ? customerDetails.BILLING_ZIP ? customerDetails.BILLING_TOWN +', '+customerDetails.BILLING_ZIP : "" : ""}</span>
                                <span>{customerDetails ? customerDetails.BILLING_COUNTRY ? customerDetails.BILLING_STATE +', '+customerDetails.BILLING_COUNTRY : "" : ""}</span>
                                <span>{customerDetails ? customerDetails.BILLING_PHONE ? customerDetails.BILLING_PHONE : "" : ""}</span>
                                <label>billing Address</label>
                            </div>
                            <div className="customer-info-list">
                                <a onClick = {() => handleProfile(customerDetails.CUSTOMERID)}>View Profile</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="notes-block">
                    <h2>Notes</h2>
                    <div className="notes-block-card">
                        {
                            notes && notes.length > 0 ? (
                                notes.map((value,index) => {
                                    return (
                                        <div className="notes-detail">
                                            <div className="notes-head">
                                                <span>DATE: {value.date ? value.date : "-"}</span>
                                                <span>TIME: {value.time ? value.time : "-"}</span>
                                                <span>REP:  {value.reply ? value.reply : "-"}</span>
                                            </div>
                                            <p>{value.note ? value.note : "EMPTY NOTES"}</p>
                                        </div>
                                    )
                                })[noteCounter]
                            ): (
                                <div className="notes-detail">
                                    <div className="notes-head text-center">
                                        Empty Notes
                                    </div>
                                </div>
                            )
                        }
                        <div className="notes-next-prev d-flex justify-content-between">
                            <Button variant="link" onClick={()=>handleNextPrev('prev')} disabled={noteCounter===0}>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3.414 5.65701L7.364 1.70701C7.54616 1.51841 7.64695 1.26581 7.64467 1.00361C7.6424 0.741413 7.53723 0.4906 7.35182 0.305192C7.16641 0.119784 6.9156 0.0146148 6.6534 0.0123364C6.3912 0.010058 6.1386 0.110853 5.95 0.293011L0.292999 5.95001C0.199814 6.04266 0.125865 6.15282 0.0754032 6.27416C0.0249414 6.39549 -0.00103569 6.5256 -0.00103569 6.65701C-0.00103569 6.78842 0.0249414 6.91853 0.0754032 7.03986C0.125865 7.1612 0.199814 7.27136 0.292999 7.36401L5.95 13.021C6.04225 13.1165 6.15259 13.1927 6.2746 13.2451C6.3966 13.2975 6.52782 13.3251 6.6606 13.3263C6.79338 13.3274 6.92506 13.3021 7.04795 13.2518C7.17085 13.2016 7.2825 13.1273 7.3764 13.0334C7.47029 12.9395 7.54454 12.8279 7.59482 12.705C7.6451 12.5821 7.6704 12.4504 7.66925 12.3176C7.6681 12.1848 7.64051 12.0536 7.5881 11.9316C7.53569 11.8096 7.45951 11.6993 7.364 11.607L3.414 7.65701H13C13.2652 7.65701 13.5196 7.55165 13.7071 7.36412C13.8946 7.17658 14 6.92223 14 6.65701C14 6.39179 13.8946 6.13744 13.7071 5.9499C13.5196 5.76237 13.2652 5.65701 13 5.65701H3.414Z" fill="#0085FF"/>
                                </svg>
                                Previous
                            </Button>
                            <Button variant="link" onClick={()=>handleNextPrev('next')} disabled={noteCounter===(notesLength-1) || notesLength===0}>
                                Next
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.586 5.65701L6.636 1.70701C6.45384 1.51841 6.35305 1.26581 6.35533 1.00361C6.3576 0.741413 6.46277 0.4906 6.64818 0.305192C6.83359 0.119784 7.0844 0.0146148 7.3466 0.0123364C7.6088 0.010058 7.8614 0.110853 8.05 0.293011L13.707 5.95001C13.8002 6.04266 13.8741 6.15282 13.9246 6.27416C13.9751 6.39549 14.001 6.5256 14.001 6.65701C14.001 6.78842 13.9751 6.91853 13.9246 7.03986C13.8741 7.1612 13.8002 7.27136 13.707 7.36401L8.05 13.021C7.95775 13.1165 7.84741 13.1927 7.7254 13.2451C7.6034 13.2975 7.47218 13.3251 7.3394 13.3263C7.20662 13.3274 7.07494 13.3021 6.95205 13.2518C6.82915 13.2016 6.7175 13.1273 6.6236 13.0334C6.52971 12.9395 6.45546 12.8279 6.40518 12.705C6.3549 12.5821 6.3296 12.4504 6.33075 12.3176C6.3319 12.1848 6.35949 12.0536 6.4119 11.9316C6.46431 11.8096 6.54049 11.6993 6.636 11.607L10.586 7.65701H1C0.734784 7.65701 0.48043 7.55165 0.292893 7.36412C0.105357 7.17658 0 6.92223 0 6.65701C0 6.39179 0.105357 6.13744 0.292893 5.9499C0.48043 5.76237 0.734784 5.65701 1 5.65701H10.586Z" fill="#0085FF"/>
                                </svg>
                            </Button>
                        </div>
                           
                    </div>
                    <div className="add-note-block">
                        <h2>Add Note</h2>
                        <form onSubmit={(e) => addNote(e)}>
                            <div className="add-note-input">
                                <Form.Control as="textarea" value={inputNotes} rows={3} onChange= {(e) => setInputNotes(e.target.value)}/>
                            </div>
                            <div className="add-note-btn text-right">
                                <Button type="submit" variant="link">Save</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <Modal show={infoModal}
                       onHide={() => setInfoModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>EDIT ORDER</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="change-address-body">
                            <div className="change-address-wrapper">
                                <div className="change-address-list d-flex align-items-center justify-content-center street-filed">
                                    <span className="error-text">{error}</span>
                                    <span className="success-text">{success}</span>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="button" onClick = {() => setInfoModal(false)}className="save-btn">OK</Button>
                    </Modal.Footer>
            </Modal>
        <Modal show={landInfo}
                onHide={() => {setLandInfo(false);setError(""); setSuccess("");}} className="custom-modal user-updated-modal">
                <Modal.Header closeButton>
                    <Modal.Title>LAND WINE DETAILS</Modal.Title>
                </Modal.Header>
                <form onSubmit={(e) => handleAddUser(e)}>
                    <Modal.Body>
                        <div className="change-address-body">
                        <div className="change-address-wrapper">
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>Landing Date:<span className="required-filed">*</span></label>
                                    <input type="date" className="text-input"  value = {editLandingData?editLandingData:""} onChange = {(e) => {setError("");setSuccess("");setLandingDate(e.target.value);}} required></input>
                                </div>
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>Landing Warehouse:<span className="required-filed">*</span></label>
                                    <div className="dropUp">
                                        <div className="custom-select-wrapper d-flex align-items-center">
                                            <Select
                                                closeMenuOnSelect={true}
                                                options={warehouseListArray?warehouseListArray:[]}
                                                className="basic-multi-select"
                                                name="colors"
                                                id="warehouse-dropdown"
                                                classNamePrefix="select"
                                                placeholder="Select Warehouse"
                                                onChange = {(selectedWareHouse)=> {setSelectedWareHouse(selectedWareHouse);} }
                                                value={selectedWareHouse}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>Rotation No:<span className="required-filed">*</span></label>
                                    <input type="text" className="text-input"  value = {editRotationNo?editRotationNo:""} onChange = {(e) => {setError(""); setSuccess(""); setRotationNo(e.target.value)}} required></input>
                                </div>
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>UUID:</label>
                                    <input type="text" className="text-input"  value = {editUUID?editUUID:""} onChange = {(e) => {setError("");setSuccess(""); setUUID(e.target.value)}}></input>
                                </div>
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>Pack Size:<span className="required-filed">*</span></label>
                                    <div className="dropUp">
                                        <div className="custom-select-wrapper d-flex align-items-center">
                                            <Select
                                                closeMenuOnSelect={true}
                                                options={sizeListArray?sizeListArray:[]}
                                                className="basic-multi-select"
                                                name="colors"
                                                id="size-dropdown"
                                                classNamePrefix="select"
                                                placeholder="Select Size"
                                                onChange = {(selectedSize)=> {setSelectedSize(selectedSize);} }
                                                value={selectedSize}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>Qty:<span className="required-filed">*</span></label>
                                    <input type="number" className="text-input"  value = {editQty?editQty:""} onChange = {(e) => {setError("");setSuccess(""); setQty(e.target.value)}} required></input>
                                </div>
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>Perfect Condition:<span className="required-filed">*</span></label>
                                    <input type="checkbox" checked={isEditCondition==="yes"} onChange={(e) => setIsCondition("yes")} ></input><span className="ml-1 mr-2 check-label">Yes</span>
                                    <input type="checkbox" checked={isEditCondition==="no"} onChange={(e) => setIsCondition("no")} ></input><span className="ml-1 check-label">No</span>
                                </div>
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>Note:<span className="required-filed">*</span></label>
                                    <textarea cols="10" rows="5" className="text-input"  value = {editNotes?editNotes:""} onChange = {(e) => {setError("");setSuccess(""); setEditNotes(e.target.value)}} required></textarea>
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
                        <input type="button" onClick = {() => {handleAddMore()}} value="Add More" className="save-btn" />
                        <input type="submit" value="Save" className="save-btn" />
                    </Modal.Footer>
                </form>
        </Modal>
        <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage}/>
    </div>
   </>
    )
};

export default connect(null,{logout})(IndividualTransaction);
