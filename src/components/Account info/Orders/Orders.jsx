import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import axios from 'axios';
import SessionModal from '../../Modals/SessionModal';
import { setSession,setSearch } from '../../../utils/Actions';
import downloadIcon from '../../../assets/images/download-icon.png'
import { 
    generateUSInvoice,generateCRMShippingStatements,
    generateUKGeneralInvoice, generateUKInvestmentInvoice,generateUKPurchaseOrder,
    generateUSPurchaseOrder, generateUKReceipt
 } from '../../../utils/Pdf/helper';
import {useHistory} from "react-router-dom";

let id;
const Orders = () => {
    const dispatch = useDispatch();
    const query = useSelector(state => state.userRegion);
    const fetch = useSelector(state => state.fetch);
    const [orders, setOrders] = useState();
    const [allOrders, setAllOrders] = useState();
    const search = useSelector(state => state.search);
    const [customerType, setCustomerType] = useState();
    const history = useHistory();
    const [showReceipt, setShowReceipt] = useState();
    const [allShipment, setAllShipment] = useState(true);
    const [loadingData, setLoadingData] = useState(false);
    
    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);

    //sorting vars
    const[sortOrder,setSortOrder] = useState('desc');

    //shipment statement dates
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [minimumDate, setMinimumDate] = useState();
    const [shippingResponse, setShippingResponse] = useState("");

    //filters vars
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [paymentDropDown, setPaymentDropDown] = useState("ALL");
    const [payButtonValue, setPayButtonValue] = useState("ALL");
    const [orderButtonValue, setOrderButtonValue] = useState("ALL");
    
    useEffect(() => { //setting up Min-Max date 
        var currentDate = new Date();
        var year = currentDate.getFullYear();                        // YYYY
        var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);  // MM
        var day = ("0" + currentDate.getDate()).slice(-2);           // DD
        var minDate = (year +"-"+ month +"-"+ day);
        setMinimumDate(minDate);
        dispatch(setSearch({search:""}));
    },[]);
    useEffect(() => { //Type Finder
        if(localStorage.getItem('customer_id')) {
            id=localStorage.getItem('customer_id');
            if(localStorage.getItem('customer_id') && (localStorage.getItem('customer_type')==="Customer" || localStorage.getItem('customer_type')==="Vendor")) {
                setCustomerType(localStorage.getItem('customer_type'));
                fetchInfo();
             }
             else {
                fetchLeadInfo();
             }
         }else {
            window.location.href='/';
         }       
    }, [fetch]);

    const fetchInfo = () => {
        setLoadingData(true);
        axios.post('/accounts/accountinfo'+query,{
            customer_id:id
        }).then((res) => {
            let arrayOrderList = [];
            if(res.data.show_receipt) {
                setShowReceipt(res.data.show_receipt);
            }
            if(res.data.orders) {
                Object.entries(res.data.orders).map((value)=>{
                    arrayOrderList.push(value);
                });
                if(arrayOrderList.length>0) {
                    arrayOrderList.sort( 
                        (a, b) => new Date (b[1][0].date) - new Date(a[1][0].date)
                    );
                }
                setOrders(arrayOrderList);
                setAllOrders(arrayOrderList);
            }
            setLoadingData(false);
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

    const fetchLeadInfo = () => {
        setLoadingData(true);
        axios.post('/accounts/leadinfo'+query,{
            customer_id:id
        }).then((res) => {
            let arrayOrderList = [];
            if(res.data.orders) {
                Object.entries(res.data.orders).map((value)=>{
                    arrayOrderList.push(value);
                });
                if(arrayOrderList.length>0) {
                    arrayOrderList.sort( 
                        (a, b) => new Date (b[1][0].date) - new Date(a[1][0].date)
                    );
                }
                setOrders(arrayOrderList);
                setAllOrders(arrayOrderList);
            }
            setLoadingData(false);
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
    const handleReceipt = (id) => {
        axios.post("/accounts/receipt"+query, {
            orderid:id
        })
        .then((res) => {
            generateUKReceipt(res.data);
        }).catch((error) => {
            console.log(error);
            // dispatch(setSession());
        });
    }
    const handleSorting = (field) => {
        if(orders && orders.length>0) {
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
                            case "product" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].product?a[1][0].product.toLowerCase():""
                                    var nameB=b[1][0].product?b[1][0].product.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "invoice" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[0]?a[0]:""
                                    var nameB=b[0]?b[0]:""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "date" :
                                sortedArray = allOrders.sort(
                                    (a, b) => new Date (a[1][0].date) - new Date(b[1][0].date)
                                );
                            break;

                            case "total" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].total?parseFloat(a[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    var nameB=b[1][0].total?parseFloat(b[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "ship_option" :
                                sortedArray = allOrders.sort( function(a, b) {
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
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].fulfill_status?a[1][0].fulfill_status.toLowerCase():""
                                    var nameB=b[1][0].fulfill_status?b[1][0].fulfill_status.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "order_type" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].order_type?a[1][0].order_type.toLowerCase():""
                                    var nameB=b[1][0].order_type?b[1][0].order_type.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "pay_status" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].pay_status?a[1][0].pay_status.toLowerCase():""
                                    var nameB=b[1][0].pay_status?b[1][0].pay_status.toLowerCase():""
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
                        setAllOrders([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "product" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].product?a[1][0].product.toLowerCase():"", nameB=b[1][0].product?b[1][0].product.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "invoice" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[0]?a[0]:"", nameB=b[0]?b[0]:""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "date" :
                                sortedArray = allOrders.sort( 
                                    (a, b) => new Date (b[1][0].date) - new Date(a[1][0].date)
                                );
                            break;
                            
                            case "total" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].total? parseFloat(a[1][0].total.replace("$","").replace(/,\s?/g, "")):"", nameB=b[1][0].total?parseFloat(b[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "ship_option" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].ship_option?a[1][0].ship_option.toLowerCase():"", nameB=b[1][0].ship_option?b[1][0].ship_option.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "fulfill_status" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].fulfill_status?a[1][0].fulfill_status.toLowerCase():"", nameB=b[1][0].fulfill_status?b[1][0].fulfill_status.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "order_type" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].order_type?a[1][0].order_type.toLowerCase():"", nameB=b[1][0].order_type?b[1][0].order_type.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "pay_status" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].pay_status?a[1][0].pay_status.toLowerCase():"", nameB=b[1][0].pay_status?b[1][0].pay_status.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            default:console.log("check sorting Label 2"); break;
                        }
                        setAllOrders([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }else {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "product" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].product?a[1][0].product.toLowerCase():""
                                    var nameB=b[1][0].product?b[1][0].product.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "invoice" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[0]?a[0]:""
                                    var nameB=b[0]?b[0]:""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "date" :
                                sortedArray = allOrders.sort(
                                    (a, b) => new Date (a[1][0].date) - new Date(b[1][0].date)
                                );
                            break;

                            case "total" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].total?parseFloat(a[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    var nameB=b[1][0].total?parseFloat(b[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "ship_option" :
                                sortedArray = allOrders.sort( function(a, b) {
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
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].fulfill_status?a[1][0].fulfill_status.toLowerCase():""
                                    var nameB=b[1][0].fulfill_status?b[1][0].fulfill_status.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "order_type" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].order_type?a[1][0].order_type.toLowerCase():""
                                    var nameB=b[1][0].order_type?b[1][0].order_type.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "pay_status" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].pay_status?a[1][0].pay_status.toLowerCase():""
                                    var nameB=b[1][0].pay_status?b[1][0].pay_status.toLowerCase():""
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
                        setOrders([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "product" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].product?a[1][0].product.toLowerCase():"", nameB=b[1][0].product?b[1][0].product.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "invoice" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[0]?a[0]:"", nameB=b[0]?b[0]:""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "date" :
                                sortedArray = allOrders.sort( 
                                    (a, b) => new Date (b[1][0].date) - new Date(a[1][0].date)
                                );
                            break;
                            
                            case "total" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].total? parseFloat(a[1][0].total.replace("$","").replace(/,\s?/g, "")):"", nameB=b[1][0].total?parseFloat(b[1][0].total.replace("$","").replace(/,\s?/g, "")):""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "ship_option" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].ship_option?a[1][0].ship_option.toLowerCase():"", nameB=b[1][0].ship_option?b[1][0].ship_option.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "fulfill_status" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].fulfill_status?a[1][0].fulfill_status.toLowerCase():"", nameB=b[1][0].fulfill_status?b[1][0].fulfill_status.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "order_type" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].order_type?a[1][0].order_type.toLowerCase():"", nameB=b[1][0].order_type?b[1][0].order_type.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "pay_status" :
                                sortedArray = allOrders.sort( function(a, b) {
                                    var nameA=a[1][0].pay_status?a[1][0].pay_status.toLowerCase():"", nameB=b[1][0].pay_status?b[1][0].pay_status.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            default:console.log("check sorting Label 2"); break;
                        }
                        setOrders([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }
        }
    }
    const handleShippingDownload = (e) => {
        e.preventDefault();
        if(allShipment) {
            axios.post('/accounts/shipping_statement'+query,{
                customer_id:localStorage.getItem("customer_id"),
                from_date:"",
                to_date:""
            }).then((res) => {
                generateCRMShippingStatements(res.data);
            }).catch((error) => {
                console.log(error);
                // dispatch(setSession());
            });
        } else {
            axios.post('/accounts/shipping_statement'+query,{
                customer_id:localStorage.getItem("customer_id"),
                from_date:startDate,
                to_date:endDate
            }).then((res) => {
                // console.log("shipping statement api",res.data);
                if(res.data.wines.length>0) {
                    generateCRMShippingStatements(res.data);
                } else {
                    setShippingResponse("No statements found!")
                }
            }).catch((error) => {
                console.log(error);
                // dispatch(setSession());
            });
        }
    }
    const handlePaymentfilter = (pay) => {
        let filteredData = [];
        if(pay==="ALL") {
            if(orderButtonValue==="ALL") {
                setOrders(allOrders);
            } else if(orderButtonValue==="INVOICE") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].order_type && data[1][0].order_type.includes("INVOICE"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            } else if(orderButtonValue==="PO") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].order_type && data[1][0].order_type.includes("PO"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            }
        } else if(pay === "Paid") {
            if(orderButtonValue==="ALL") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("paid"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            } else if(orderButtonValue==="INVOICE") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].order_type && data[1][0].order_type.includes("INVOICE")) && 
                    (data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("paid"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            } else if(orderButtonValue==="PO") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].order_type && data[1][0].order_type.includes("PO")) && 
                    (data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("paid"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            }
        } else if(pay === "Partial") {
            if(orderButtonValue==="ALL") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("partial"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            } else if(orderButtonValue==="INVOICE") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].order_type && data[1][0].order_type.includes("INVOICE")) && 
                    (data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("partial"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            } else if(orderButtonValue==="PO") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].order_type && data[1][0].order_type.includes("PO")) && 
                    (data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("partial"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            }
        } else if(pay === "Unpaid") {
            if(orderButtonValue==="ALL") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("unpaid"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            } else if(orderButtonValue==="INVOICE") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].order_type && data[1][0].order_type.includes("INVOICE")) && 
                    (data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("unpaid"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            } else if(orderButtonValue==="PO") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].order_type && data[1][0].order_type.includes("PO")) && 
                    (data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("unpaid"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            }
        }
    }
    const handleOrderTypeFilter = (type) => {
        let filteredData = [];
        if(type==="ALL") {
            if(payButtonValue === "ALL") {
                setOrders(allOrders);
            } else if(payButtonValue === "Paid") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("paid"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            } else if(payButtonValue === "Partial") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("partial"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            } else if(payButtonValue === "Unpaid") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("unpaid"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            }
        } else if(type==="PO") {
            if(payButtonValue==="ALL") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].order_type && data[1][0].order_type.includes("PO"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            }else if(payButtonValue==="Paid") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("paid")) &&
                    (data[1][0].order_type && data[1][0].order_type.includes("PO"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            }else if(payButtonValue==="Partial") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("partial")) &&
                    (data[1][0].order_type && data[1][0].order_type.includes("PO"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            }else if(payButtonValue==="Unpaid") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("unpaid")) &&
                    (data[1][0].order_type && data[1][0].order_type.includes("PO"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            }
        } else if(type==="INVOICE") {
            if(payButtonValue==="ALL") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].order_type && data[1][0].order_type.includes("INVOICE"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            }else if(payButtonValue==="Paid") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("paid")) &&
                    (data[1][0].order_type && data[1][0].order_type.includes("INVOICE"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            }else if(payButtonValue==="Partial") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("partial")) &&
                    (data[1][0].order_type && data[1][0].order_type.includes("INVOICE"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            }else if(payButtonValue==="Unpaid") {
                filteredData = allOrders.filter((data) => {
                    if((data[1][0].pay_status && data[1][0].pay_status.toLowerCase().includes("unpaid")) &&
                    (data[1][0].order_type && data[1][0].order_type.includes("INVOICE"))) {
                        return data;
                    }
                });
                setOrders(filteredData);
            }
        }
    }

    return (
        <div className="order-history-page">
            <div className="order-history-head py-3 px-3">
                <div className="title flex-column flex-sm-row">
                    <h6>Order History</h6>
                    <div>
                        {/* <Button className="mt-2 mt-sm-0">Create Purchase Order</Button> */}
                        <Button className="ml-sm-2 mt-2 mt-sm-0" onClick={() => history.push("/create-invoice")}>Create Order</Button>
                    </div>
                </div>
                <div>
                    <div className="order-table-filter-head mb-3 d-flex justify-content-between flex-column flex-sm-row">
                        {
                            customerType==="Customer" ? (
                                <div>
                                    <form onSubmit={(e) => handleShippingDownload(e)}>
                                        {
                                            allShipment ? (
                                                <>
                                                <div className="filter-list">
                                                    <label className="d-block mb-1">From</label>
                                                    <input className="date-time-input" max={minimumDate} type="date" onChange={(e) => setStartDate(e.target.value)} onClick={()=>setShippingResponse("")} ></input>
                                                </div>
                                                <div className="filter-list">
                                                    <label className="d-block mb-1">To</label>
                                                    <input className="date-time-input" max={minimumDate} type="date" onChange={(e) => setEndDate(e.target.value)} onClick={()=>setShippingResponse("")}></input>
                                                </div>
                                                <div className="filter-list">
                                                    <label className="d-block mb-1">All</label>
                                                    <input type="checkbox" onChange = {(e) => setAllShipment(e.target.checked)} checked={allShipment} onClick={()=>setShippingResponse("")}></input>
                                                </div>
                                                <div className="filter-list">
                                                    <input className="download-btn" type="submit" value="Download"></input>
                                                </div>
                                                </>
                                            ):(<>
                                                <div className="filter-list">
                                                    <label className="d-block mb-1">From</label>
                                                    <input className="date-time-input" max={minimumDate} type="date" onChange={(e) => setStartDate(e.target.value)} onClick={()=>setShippingResponse("")} required></input>
                                                </div>
                                                <div className="filter-list">
                                                    <label className="d-block mb-1">To</label>
                                                    <input className="date-time-input" max={minimumDate} type="date" onChange={(e) => setEndDate(e.target.value)} onClick={()=>setShippingResponse("")} required></input>
                                                </div>
                                                <div className="filter-list">
                                                    <label className="d-block mb-1">All</label>
                                                    <input type="checkbox" onChange = {(e) => setAllShipment(e.target.checked)} checked={allShipment} onClick={()=>setShippingResponse("")}></input>
                                                </div>
                                                <div className="filter-list">
                                                    <input className="download-btn" type="submit" value="Download"></input>
                                                </div>
                                                </>
                                            )
                                        }
                                    </form>
                                    <span>{shippingResponse}</span>
                                </div>
                            ) : ""
                        }
                    </div>
                </div>
                <div>
                    {
                        allOrders && allOrders.length>0 ? (
                            <>
                                <div className="customer-data-head-filter d-flex justify-content-end align-items-center border-bottom-0 mb-2">
                                    <div className="customer-title">
                                        Pay Status :
                                    </div>
                                    <div className="data-filter">
                                        <ul>
                                            <li>
                                                <Button className={payButtonValue==="ALL" ? 'btn-filter active' : 'btn-filter'}
                                                        onClick={() => {setPayButtonValue("ALL"); handlePaymentfilter("ALL")}} variant="outline-primary" >ALL
                                                </Button>
                                            </li>
                                            <li>
                                                <Button className={payButtonValue==="Paid" ? 'btn-filter active' : 'btn-filter'}
                                                        onClick={() => {setPayButtonValue("Paid"); handlePaymentfilter("Paid")}}>Paid
                                                </Button>
                                            </li>
                                            <li>
                                                <Button className={payButtonValue==="Partial" ? 'btn-filter active' : 'btn-filter'}
                                                        onClick={() => {setPayButtonValue("Partial"); handlePaymentfilter("Partial")}} >Partial
                                                </Button>
                                            </li>
                                            <li>
                                                <Button className={payButtonValue==="Unpaid" ? 'btn-filter active' : 'btn-filter'} 
                                                        onClick={() => {setPayButtonValue("Unpaid"); handlePaymentfilter("Unpaid")}}>Unpaid
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="customer-data-head-filter d-flex justify-content-end align-items-center border-bottom-0">
                                    <div className="customer-title">
                                        Order Type :
                                    </div>
                                    <div className="data-filter">
                                        <ul>
                                            <li>
                                                <Button className={orderButtonValue==="ALL" ? 'btn-filter active' : 'btn-filter'} variant="outline-primary"
                                                    onClick={() => {setOrderButtonValue("ALL"); handleOrderTypeFilter("ALL")}} >ALL
                                                </Button>
                                            </li>
                                            <li>
                                                <Button className={orderButtonValue==="INVOICE" ? 'btn-filter active' : 'btn-filter'}
                                                    onClick={() => {setOrderButtonValue("INVOICE"); handleOrderTypeFilter("INVOICE")}}>Invoice
                                                </Button>
                                            </li>
                                            <li>
                                                <Button className={orderButtonValue==="PO" ? 'btn-filter active' : 'btn-filter'}
                                                    onClick={() => {setOrderButtonValue("PO"); handleOrderTypeFilter("PO")}} >Purchase Order
                                                </Button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </>
                        ) :""
                    }
                </div>
            </div>
            
            
            <div className="order-history-content">
                <div className="order-history-table d-none d-md-block">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("invoice")}>PDF</th>
                                {
                                    query==="?region=UK" && showReceipt==="Yes" ? (<th width="10%" >Receipt</th>) :""
                                }
                                <th width="10%" className="cursor-pointer" onClick={() => handleSorting("date")}>Date</th>
                                <th width="25%" className="cursor-pointer" onClick={() => handleSorting("product")}>Product</th>
                                <th width="5%"  className="cursor-pointer" onClick={() => handleSorting("total")}>Total</th>
                                <th width="15%" className="cursor-pointer" onClick={() => handleSorting("ship_option")}>Shipping Option</th>
                                <th width="15%" className="cursor-pointer" onClick={() => handleSorting("fulfill_status")}>Fulfillment Status</th>
                                <th width="20%" className="cursor-pointer" onClick={() => handleSorting("order_type")}>Order Type</th>
                                <th width="20%" className="cursor-pointer" onClick={() => handleSorting("pay_status")}>Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                search ? 
                                (
                                    allOrders && allOrders.map(val=>val).length>0 ? allOrders.filter((data) => {
                                        if( data[0] && data[0].toLowerCase().includes(search.toLowerCase()) ||
                                            data[1][0].product && data[1][0].product.split('<br>')[0].toLowerCase().includes(search.toLowerCase())  
                                        ) {
                                            return data;
                                       }
                                    }).map((value, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>
                                                    <div className="cursor-pointer">
                                                        {value[0]+" "}
                                                        <img src={downloadIcon} onClick={() => handlePDF(value[0],value[1][0].order_type)} height="12" width="12" alt="download icon"></img>
                                                     </div>
                                                </td>
                                                {
                                                    (query==="?region=UK" && showReceipt==="Yes") ?  (
                                                        <td>
                                                            <div className="cursor-pointer">
                                                                {"Receipt "}
                                                                <img src={downloadIcon} onClick={() => handleReceipt(value[0])} height="12" width="12" alt="download icon"></img>
                                                            </div>
                                                        </td>
                                                    ):""
                                                }
                                                <td>{value[1][0].date ? value[1][0].date : "-"}</td>
                                                <td>
                                                    <div className="product-row">
                                                    {
                                                        value[1].map((value, index)=> {
                                                            return (
                                                                <div className="product-list d-flex justify-content-between">
                                                            <div className="product-detail">
                                                                <div className="product-title">
                                                                    <span>{value.product ? value.product.split('<br>')[0] : "-"}</span>
                                                                </div>
                                                                <span>{value.product ? value.product.split('<br>')[1] : "-"}</span>
                                                                <span>{value.product ? value.product.split('<br>')[2] : "-"}</span>
                                                            </div>

                                                        </div>
                                                            )
                                                        })
                                                    }    
                                                    </div>
                                                </td>
                                                <td>{value[1][0].total ? value[1][0].total : "-"}</td>
                                                <td>{value[1][0].ship_option ? value[1][0].ship_option : "-"}</td>
                                                <td>
                                                    <div className="status-row">
                                                        <div className="status-list">
                                                            <span>{value[1][0].fulfill_status ? value[1][0].fulfill_status : "-"}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>{value[1][0].order_type ? value[1][0].order_type : "-"}</td>
                                                <td className={value[1][0].pay_status==="REFUNDED"?"text-red":""}>{value[1][0].pay_status ? value[1][0].pay_status : "-"}</td>
                                            </tr>
                                        )
                                    }) : ("") 
                                ) 
                                : 
                                (
                                    orders && orders.map(val=>val).length>0 ? orders.map((value, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="cursor-pointer">
                                                    {value[0]+" "}
                                                    <img src={downloadIcon} onClick={() => handlePDF(value[0],value[1][0].order_type)} height="12" width="12" alt="download icon"></img>
                                                </div>
                                            </td>
                                            {
                                                 (query==="?region=UK" && showReceipt==="Yes") ? (
                                                    <td>
                                                        <div className="cursor-pointer">
                                                            {"Receipt "}
                                                            <img src={downloadIcon} onClick={() => handleReceipt(value[0])} height="12" width="12" alt="download icon"></img>
                                                        </div>
                                                    </td>
                                                 ) : ""
                                            }
                                            <td>{value[1][0].date ? value[1][0].date : "-"}</td>
                                            <td>
                                                <div className="product-row">
                                                        {
                                                            value[1].map((value, index)=> {
                                                                return (
                                                                    <div key={index} className="product-list d-flex justify-content-between">
                                                                        <div className="product-detail">
                                                                            <div className="product-title">
                                                                                <span>{value.product ? value.product.split('<br>')[0] : "-"}</span>
                                                                            </div>
                                                                            <span>{value.product ? value.product.split('<br>')[1] : "-"}</span>
                                                                            <span>{value.product ? value.product.split('<br>')[2] : "-"}</span>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }    
                                                </div>
                                            </td>
                                            <td>{value[1][0].total ? value[1][0].total : "-"}</td>
                                            <td>{value[1][0].ship_option ? value[1][0].ship_option : "-"}</td>
                                            <td>
                                                <div className="status-row">
                                                    <div className="status-list">
                                                        <span>{value[1][0].fulfill_status ? value[1][0].fulfill_status : "-"}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>{value[1][0].order_type ? value[1][0].order_type : "-"}</td>
                                            <td className={value[1][0].pay_status==="REFUNDED"?"text-red":""}>{value[1][0].pay_status ? value[1][0].pay_status : "-"}</td>
                                        </tr>
                                    )
                                }) : ("") 
                                    
                                )
                            }
                            {
                                search ? (allOrders ? (allOrders.filter((data) => {
                                if( data[0] && data[0].toLowerCase().includes(search.toLowerCase()) ||
                                    data[1][0].product && data[1][0].product.split('<br>')[0].toLowerCase().includes(search.toLowerCase())  
                                ) {
                                    return data;
                                }
                                }).length>0) ? "":
                                (<tr>
                                    <td colSpan="8" className="text-center">No Data Found!</td>
                                </tr>):"") : ("")
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
                                orders && orders.length===0 && loadingData===false && !search? (
                                    <tr>
                                        <td colSpan="8" className="text-center">No Order found!</td>
                                    </tr>
                                ) :
                                ("")
                            }
                            
                        </tbody>
                    </Table>
                </div>

                <div className="order-history-mobile-table d-md-none">
                    {
                        search ? (
                            allOrders && allOrders.map(val=>val).length>0? allOrders.filter((data) => {
                                if( data[0] && data[0].toLowerCase().includes(search.toLowerCase()) ||
                                    data[1][0].product && data[1][0].product.split('<br>')[0].toLowerCase().includes(search.toLowerCase())  
                                ) {
                                    return data;
                               }
                            }).map((value,index)=>{
                                return(
                                    <div className="mobile-table-row" key={index}>
                                    <div className="mobile-table-list">
                                        <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                            <div className="th">
                                                <label onClick={() => handleSorting("invoice")}>Invoice</label>
                                                <span className="link">
                                                    {value[0]+" "}
                                                    <img src={downloadIcon} onClick={() => handlePDF(value[0],value[1][0].order_type)} height="12" width="12" alt="download icon"></img>
                                                </span>
                                            </div>
                                            <div className="th">
                                                <label onClick={() => handleSorting("total")}>Total</label>
                                                <span>{value[1][0].total ? value[1][0].total : "-"}</span>
                                            </div>
                                        </div>
                                        <div className="mobile-table-td">
                                            <div className="mobile-table-td-row">
                                                <div className="td-list d-flex justify-content-between">
                                                    <div className="td">
                                                        <span onClick={() => handleSorting("product")}><strong>{value[1][0].product ? value[1][0].product.split('<br>')[0] : "-"}</strong></span>
                                                        <span>{value[1][0].product ? value[1][0].product.split('<br>')[1] : "-"}</span>
                                                        <span>{value[1][0].product ? value[1][0].product.split('<br>')[2] : "-"}</span>
                                                    </div>
                                                    <div className="product-status">
                                                        <i className="status-dot red-color"></i>
                                                    </div>
                                                </div>
                                                {/* <div className="td-list d-flex justify-content-between">
                                                    <div className="td">
                                                        <span><strong>Brunello Montalcino</strong></span>
                                                        <span>Cupano , 2010</span>
                                                        <span>12x750ml</span>
                                                    </div>
                                                    <div className="product-status">
                                                        <i className="status-dot blue-color"></i>
                                                    </div>
                                                    <div className="td">
                                                        <div className="status-list">
                                                            <span>Delivered In Full</span>
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                        <div className="mobile-table-footer">
                                            <div className="shipping-option">
                                                <label onClick={() => handleSorting("fulfill_status")}>Fulfillment Status</label>
                                                <span>{value[1][0].fulfill_status ? value[1][0].fulfill_status : "-"}</span>
                                            </div>
                                        </div>
                                        <div className="mobile-table-footer">
                                            <div className="shipping-option">
                                                <label onClick={() => handleSorting("fulfill_status")}>Shipping Option</label>
                                                <span onClick={() => handleSorting("ship_option")}>{value[1][0].ship_option ? value[1][0].ship_option : "-"}</span>
                                            </div>
                                        </div>
                                        <div className="mobile-table-footer">
                                            <div className="shipping-option">
                                                <label onClick={() => handleSorting("order_type")}>Order Type</label>
                                                <span>{value[1][0].order_type ? value[1][0].order_type : "-"}</span>
                                            </div>
                                        </div>
                                        <div className="mobile-table-footer">
                                            <div className="shipping-option">
                                                <label onClick={() => handleSorting("pay_status")}>Payment</label>
                                                <span  className={value[1][0].pay_status==="REFUNDED"?"text-red":""}>{value[1][0].pay_status ? value[1][0].pay_status : "-"}</span>
                                            </div>
                                        </div>
                                        <div className="mobile-table-footer">
                                            <div className="shipping-option">
                                                <label onClick={() => handleSorting("date")}>Date</label>
                                                <span>{value[1][0].date ? value[1][0].date : "-"}</span>
                                            </div>
                                        </div>
                                        {
                                             (query==="?region=UK" && showReceipt==="Yes") ? (
                                                <div className="mobile-table-footer">
                                                    <div className="shipping-option">
                                                        <label>Receipt</label>
                                                        <span className="link">
                                                            <img src={downloadIcon} onClick={() => handlePDF(value[0],value[1][0].order_type)} height="12" width="12" alt="download icon"></img>
                                                        </span>
                                                    </div>
                                                </div>
                                             ) : ""
                                        }
                                    </div>
                                </div>
                                )
                            }) : ("")
                        ) : 
                        (
                            
                            orders && orders.map(val=>val).length>0 ? orders.map((value,index)=>{
                                return(
                                    <div className="mobile-table-row" key={index}>
                                    <div className="mobile-table-list">
                                        <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                            <div className="th">
                                                <label onClick={() => handleSorting("invoice")}>Invoice</label>
                                                <span className="link">
                                                    {value[0]+" "}
                                                    <img src={downloadIcon} onClick={() => handlePDF(value[0],value[1][0].order_type)} height="12" width="12" alt="download icon"></img>
                                                </span>
                                            </div>
                                            <div className="th">
                                                <label onClick={() => handleSorting("total")}>Total</label>
                                                <span>{value[1][0].total ? value[1][0].total : "-"}</span>
                                            </div>
                                        </div>
                                        <div className="mobile-table-td">
                                            <div className="mobile-table-td-row">
                                            {
                                                value[1].map((value, index)=> {
                                                    return (
                                                        <div className="td-list d-flex justify-content-between">
                                                            <div className="td">
                                                                <span onClick={() => handleSorting("product")}><strong>{value.product ? value.product.split('<br>')[0] : "-"}</strong></span>
                                                                <span>{value.product ? value.product.split('<br>')[1] : "-"}</span>
                                                                <span>{value.product ? value.product.split('<br>')[2] : "-"}</span>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            } 
                                            </div>
                                        </div>
                                        <div className="mobile-table-footer">
                                            <div className="shipping-option">
                                                <label onClick={() => handleSorting("fulfill_status")}>Fulfillment Status</label>
                                                <span>{value[1][0].fulfill_status ? value[1][0].fulfill_status : "-"}</span>
                                            </div>
                                        </div>
                                        <div className="mobile-table-footer">
                                            <div className="shipping-option">
                                                <label onClick={() => handleSorting("fulfill_status")}>Shipping Option</label>
                                                <span onClick={() => handleSorting("ship_option")}>{value[1][0].ship_option ? value[1][0].ship_option : "-"}</span>
                                            </div>
                                        </div>
                                        <div className="mobile-table-footer">
                                            <div className="shipping-option">
                                                <label onClick={() => handleSorting("order_type")}>Order Type</label>
                                                <span>{value[1][0].order_type ? value[1][0].order_type : "-"}</span>
                                            </div>
                                        </div>
                                        <div className="mobile-table-footer">
                                            <div className="shipping-option">
                                                <label onClick={() => handleSorting("pay_status")}>Payment</label>
                                                <span className={value[1][0].pay_status==="REFUNDED"?"text-red":""}>{value[1][0].pay_status ? value[1][0].pay_status : "-"}</span>
                                            </div>
                                        </div>
                                        <div className="mobile-table-footer">
                                            <div className="shipping-option">
                                                <label onClick={() => handleSorting("date")}>Date</label>
                                                <span>{value[1][0].date ? value[1][0].date : "-"}</span>
                                            </div>
                                        </div>
                                        {
                                             (query==="?region=UK" && showReceipt==="Yes") ? (
                                                <div className="mobile-table-footer">
                                                    <div className="shipping-option">
                                                        <label>Receipt</label>
                                                        <span className="link">
                                                            <img src={downloadIcon} onClick={() => handlePDF(value[0],value[1][0].order_type)} height="12" width="12" alt="download icon"></img>
                                                        </span>
                                                    </div>
                                                </div>
                                             ) : ""
                                        }
                                    </div>
                                </div>
                                )
                            }) : (
                                <div className="mobile-table-row text-center">
                                    No Orders Available
                                </div>
                            )
                            
                        )
                    }
                    {
                        search ? (allOrders ? (allOrders.filter((data) => {
                        if( data[0] && data[0].toLowerCase().includes(search.toLowerCase()) ||
                            data[1][0].product && data[1][0].product.split('<br>')[0].toLowerCase().includes(search.toLowerCase())  
                        ) {
                            return data;
                        }
                        }).length>0) ? "":
                        (
                        <div className="mobile-table-row text-center">
                            No Data Found!
                        </div>):"") : ("")
                    }
                </div>
            </div>
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage}/>
        </div>
    );
};

export default Orders;