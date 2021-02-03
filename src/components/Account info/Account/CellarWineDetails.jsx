import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import SessionModal from '../../Modals/SessionModal';
import { setSession,setSearch } from '../../../utils/Actions';
import downloadIcon from '../../../assets/images/download-icon.png';
import ReactHTMLTableToExcel from 'react-html-table-to-excel'; 
import {sizeList, currencyList} from "../../../utils/drop-down-list";
import {useHistory} from "react-router-dom";

const CellarWineDetails = () => {
    const dispatch = useDispatch();
    const query = useSelector(state => state.userRegion);
    const fetch = useSelector(state => state.fetch);
    const [wineList, setWineList] = useState();
    const [allWineList, setAllWineList] = useState();
    const search = useSelector(state => state.search);
    const [customerType, setCustomerType] = useState();
    const history = useHistory();
    const [showReceipt, setShowReceipt] = useState();
    const [allShipment, setAllShipment] = useState(true);
    const [loadingData, setLoadingData] = useState(false);
    const [cellarWineId, setCellarWineId] = useState("");
    
    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();
    const [addWineModal, setAddWineModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [purchaseDate, setPurchaseDate] = useState("");

    //sorting vars
    const[sortOrder,setSortOrder] = useState('asc');
    const [wineSearch, setWineSearch] = useState("");

    //shipment statement dates
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [minimumDate, setMinimumDate] = useState();
    const [shippingResponse, setShippingResponse] = useState("");
    
    //add wine data
    const [lwin7, setLwin7] = useState();
    const [year, setYear] = useState();
    const [size, setSize] = useState("");
    const [price, setPrice] = useState();
    const [qty, setQty] = useState();
    const [cellarId, setCellarId] = useState();
    const [nameList, setNameList] = useState();
    const [name, setName] = useState("");
    const [isNameOpen, setIsNameOpen] = useState(false);
    const [isSizeOpen, setIsSizeOpen] = useState(false);
    const [nameDropDownValue, setNameDropDownValue] = useState();
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [currencyDropDownValue, setCurrencyDropDownValue] = useState("");
    const [currency, setCurrency] = useState("");

    //filters vars
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [paymentDropDown, setPaymentDropDown] = useState("ALL");
    const [payButtonValue, setPayButtonValue] = useState("ALL");
    const [orderButtonValue, setOrderButtonValue] = useState("ALL");

    //loader
    const [wineLoder,setWineLoader] = useState(false);
    
    useEffect(() => {
        dispatch(setSearch({search:""}));
    },[]);
    useEffect(() => {
        if(localStorage.getItem('customer_id')) {
            fetchWines();
         }else {
            window.location.href='/';
         }       
    }, [fetch]);

    useEffect(()=> {
        if(name==="") {
            setNameDropDownValue("");
            setIsNameOpen(false);
        }
    },[name]);
    const fetchWines = () => {
        setLoadingData(true);
        axios.post('/accounts/get_cellar_wines/'+query,{
            customer_id:localStorage.getItem("customer_id"),
            cellar_id: localStorage.getItem("cellar_id")
        }).then((res) => {
            // console.log("wine details api response",res.data);
            setWineList(res.data);
            setAllWineList(res.data);
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
    const handleSorting = (field) => {
        if(wineList && wineList.length>0) {
            let sortedArray=[];
            // console.log(" type and field name", sortOrder, field);
            // setSortOrder('desc');
            if(sortOrder == "asc") {
                setSortOrder('desc');
            }else {
                setSortOrder('asc');
            }
            // console.log('order',sortOrder)
            if(wineSearch) {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "LWIN7" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.LWIN7?parseFloat(a.LWIN7.toLowerCase()):""
                                    var nameB=b.LWIN7?parseFloat(b.LWIN7.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "NAME" :
                                sortedArray = allWineList.sort( function(a, b) {
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
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.PRODUCER?a.PRODUCER.toLowerCase():""
                                    var nameB=b.PRODUCER?b.PRODUCER.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRICE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.PRICE?parseFloat(a.PRICE.toLowerCase()):""
                                    var nameB=b.PRICE?parseFloat(b.PRICE.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "MP" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.MP?parseFloat(a.MP.toLowerCase()):""
                                    var nameB=b.MP?parseFloat(b.MP.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CASE_SIZE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CASE_SIZE?a.CASE_SIZE.toLowerCase():""
                                    var nameB=b.CASE_SIZE?b.CASE_SIZE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VINTAGE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.VINTAGE?a.VINTAGE.toLowerCase():""
                                    var nameB=b.VINTAGE?b.VINTAGE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CURRENCY_CODE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CURRENCY_CODE?a.CURRENCY_CODE.toLowerCase():""
                                    var nameB=b.CURRENCY_CODE?b.CURRENCY_CODE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PURCHASE_DATE" :
                                sortedArray = allWineList.sort(
                                    (a, b) => new Date (a.PURCHASE_DATE) - new Date(b.PURCHASE_DATE)
                                );
                            break;
                            case "QTY" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.QTY?a.QTY.toLowerCase():""
                                    var nameB=b.QTY?b.QTY.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CELLAR_WINE_ID" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CELLAR_WINE_ID?a.CELLAR_WINE_ID.toLowerCase():""
                                    var nameB=b.CELLAR_WINE_ID?b.CELLAR_WINE_ID.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "CREATED_AT" :
                                sortedArray = allWineList.sort(
                                    (a, b) => new Date (a.CREATED_AT) - new Date(b.CREATED_AT)
                                );
                            break;
                            case "CREATED_BY" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CREATED_BY?a.CREATED_BY.toLowerCase():""
                                    var nameB=b.CREATED_BY?b.CREATED_BY.toLowerCase():""
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
                        setAllWineList([...sortedArray]);
                        // console.log("ascending data",[...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
                            case "LWIN7" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.LWIN7?parseFloat(a.LWIN7.toLowerCase()):""
                                    var nameB=b.LWIN7?parseFloat(b.LWIN7.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "NAME" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():""
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRODUCER" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.PRODUCER?a.PRODUCER.toLowerCase():""
                                    var nameB=b.PRODUCER?b.PRODUCER.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRICE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.PRICE?parseFloat(a.PRICE.toLowerCase()):""
                                    var nameB=b.PRICE?parseFloat(b.PRICE.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "MP" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.MP?parseFloat(a.MP.toLowerCase()):""
                                    var nameB=b.MP?parseFloat(b.MP.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CURRENCY_CODE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CURRENCY_CODE?a.CURRENCY_CODE.toLowerCase():""
                                    var nameB=b.CURRENCY_CODE?b.CURRENCY_CODE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PURCHASE_DATE" :
                                sortedArray = allWineList.sort(
                                    (a, b) => new Date (b.PURCHASE_DATE) - new Date(a.PURCHASE_DATE)
                                );
                            break;
                            case "CASE_SIZE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CASE_SIZE?a.CASE_SIZE.toLowerCase():""
                                    var nameB=b.CASE_SIZE?b.CASE_SIZE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VINTAGE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.VINTAGE?a.VINTAGE.toLowerCase():""
                                    var nameB=b.VINTAGE?b.VINTAGE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "QTY" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.QTY?a.QTY.toLowerCase():""
                                    var nameB=b.QTY?b.QTY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CELLAR_WINE_ID" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CELLAR_WINE_ID?a.CELLAR_WINE_ID.toLowerCase():""
                                    var nameB=b.CELLAR_WINE_ID?b.CELLAR_WINE_ID.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "CREATED_AT" :
                                sortedArray = allWineList.sort(
                                    (a, b) => new Date (a.CREATED_AT) - new Date(b.CREATED_AT)
                                );
                            break;
                            case "CREATED_BY" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CREATED_BY?a.CREATED_BY.toLowerCase():""
                                    var nameB=b.CREATED_BY?b.CREATED_BY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            default:console.log("check sorting Label 2"); break;
                        }
                        setAllWineList([...sortedArray]);
                        // console.log("descending data",[...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }else {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "LWIN7" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.LWIN7?parseFloat(a.LWIN7.toLowerCase()):""
                                    var nameB=b.LWIN7?parseFloat(b.LWIN7.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "NAME" :
                                sortedArray = allWineList.sort( function(a, b) {
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
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.PRODUCER?a.PRODUCER.toLowerCase():""
                                    var nameB=b.PRODUCER?b.PRODUCER.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CURRENCY_CODE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CURRENCY_CODE?a.CURRENCY_CODE.toLowerCase():""
                                    var nameB=b.CURRENCY_CODE?b.CURRENCY_CODE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PURCHASE_DATE" :
                                sortedArray = allWineList.sort(
                                    (a, b) => new Date (a.PURCHASE_DATE) - new Date(b.PURCHASE_DATE)
                                );
                            break;
                            case "PRICE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.PRICE?parseFloat(a.PRICE.toLowerCase()):""
                                    var nameB=b.PRICE?parseFloat(b.PRICE.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "MP" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.MP?parseFloat(a.MP.toLowerCase()):""
                                    var nameB=b.MP?parseFloat(b.MP.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CASE_SIZE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CASE_SIZE?a.CASE_SIZE.toLowerCase():""
                                    var nameB=b.CASE_SIZE?b.CASE_SIZE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VINTAGE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.VINTAGE?a.VINTAGE.toLowerCase():""
                                    var nameB=b.VINTAGE?b.VINTAGE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "QTY" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.QTY?a.QTY.toLowerCase():""
                                    var nameB=b.QTY?b.QTY.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CELLAR_WINE_ID" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CELLAR_WINE_ID?a.CELLAR_WINE_ID.toLowerCase():""
                                    var nameB=b.CELLAR_WINE_ID?b.CELLAR_WINE_ID.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "CREATED_AT" :
                                sortedArray = allWineList.sort(
                                    (a, b) => new Date (a.CREATED_AT) - new Date(b.CREATED_AT)
                                );
                            break;
                            case "CREATED_BY" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CREATED_BY?a.CREATED_BY.toLowerCase():""
                                    var nameB=b.CREATED_BY?b.CREATED_BY.toLowerCase():""
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
                        setWineList([...sortedArray]);
                        // console.log("ascending data",[...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "LWIN7" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.LWIN7?parseFloat(a.LWIN7.toLowerCase()):""
                                    var nameB=b.LWIN7?parseFloat(b.LWIN7.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "NAME" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():""
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRODUCER" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.PRODUCER?a.PRODUCER.toLowerCase():""
                                    var nameB=b.PRODUCER?b.PRODUCER.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRICE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.PRICE?parseFloat(a.PRICE.toLowerCase()):""
                                    var nameB=b.PRICE?parseFloat(b.PRICE.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "MP" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.MP?parseFloat(a.MP.toLowerCase()):""
                                    var nameB=b.MP?parseFloat(b.MP.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CASE_SIZE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CASE_SIZE?a.CASE_SIZE.toLowerCase():""
                                    var nameB=b.CASE_SIZE?b.CASE_SIZE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CURRENCY_CODE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CURRENCY_CODE?a.CURRENCY_CODE.toLowerCase():""
                                    var nameB=b.CURRENCY_CODE?b.CURRENCY_CODE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PURCHASE_DATE" :
                                sortedArray = allWineList.sort(
                                    (a, b) => new Date (b.PURCHASE_DATE) - new Date(a.PURCHASE_DATE)
                                );
                            break;
                            case "VINTAGE" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.VINTAGE?a.VINTAGE.toLowerCase():""
                                    var nameB=b.VINTAGE?b.VINTAGE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "QTY" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.QTY?a.QTY.toLowerCase():""
                                    var nameB=b.QTY?b.QTY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "CELLAR_WINE_ID" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CELLAR_WINE_ID?a.CELLAR_WINE_ID.toLowerCase():""
                                    var nameB=b.CELLAR_WINE_ID?b.CELLAR_WINE_ID.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "CREATED_AT" :
                                sortedArray = allWineList.sort(
                                    (a, b) => new Date (a.CREATED_AT) - new Date(b.CREATED_AT)
                                );
                            break;
                            case "CREATED_BY" :
                                sortedArray = allWineList.sort( function(a, b) {
                                    var nameA=a.CREATED_BY?a.CREATED_BY.toLowerCase():""
                                    var nameB=b.CREATED_BY?b.CREATED_BY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            default:console.log("check sorting Label 2"); break;
                        }
                        setWineList([...sortedArray]);
                        // console.log("descending data",[...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }
        }
    }
    const handleAddWines = (e) => {
        e.preventDefault();
        if(name!=="" && name===nameDropDownValue && size!=="" && currencyDropDownValue!=="") {
            axios.post('/accounts/add_cellar_wine/'+query,{
                lwin7,
                year,
                size,
                price,
                qty,
                currency,
                purchase_date: purchaseDate,
                cellar_id: localStorage.getItem("cellar_id")
            }).then((res) => {
                if(res.data.message === "cellar wine added") {
                    setError("");
                    setSuccess("Wine Added Successfully!");
                    setLwin7("");
                    setSize("");
                    setQty("");
                    setPrice("");
                    setYear("");
                    setName("");
                    setCurrencyDropDownValue("");
                    setPurchaseDate("");
                    fetchWines();
                }
                else {
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
        } else {
            setError("Select wine, size & currency");
        }

    }
    const searchWine = (search) => {
        if(search) {
            setWineLoader(true);
            setNameList([]);
            axios
            .post("/accounts/search_wine"+query,{
                query:search,
                is_shopify: false
            }).then((res) => {
                // console.log("search wine api",res.data);
                // let arrayDropDownList = [];
                if(res.data){
                    setNameList(res.data.splice(0,20));
                }else {
                    setNameList([]);
                }
                setWineLoader(false);
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
    const handleDeleteWine = () => {
        if(cellarWineId) {
            axios
            .post("/accounts/delete_cellar_wine"+query,{
                cellar_wine_id: cellarWineId
            }).then((res) => {
                if(res.data.message === "cellar wine deleted") {
                    setWineList([]);
                    fetchWines();
                    setConfirmModal(false);
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
    const handleCloseDropDowns = (type) => {
        switch(type){
            case "wine":
                setIsCurrencyOpen(false);
                setIsSizeOpen(false);
                // setIsNameOpen(false);
            break;
            case "size":
                setIsCurrencyOpen(false);
                // setIsSizeOpen(false);
                setIsNameOpen(false);
            break;
            case "currency":
                // setIsCurrencyOpen(false);
                setIsSizeOpen(false);
                setIsNameOpen(false);
            break;
            
            default: console.log("wrong input..")
        }
    }


    return (
        <div className="order-history-page">
            <div className="order-history-head py-3 px-3">
                <div className="d-flex justify-content-between mb-2">
                    <div className="title flex-column flex-sm-row">
                        <h6>Cellar Wines Details</h6>
                    </div>
                    <div className="d-flex align-items-center wine-main">
                        <div className='btn-add'>
                            <Button className="ml-sm-2 mt-2 mt-sm-0" onClick={() => {setAddWineModal(true)}}>Add Wine</Button>
                        </div>
                        {
                            wineList && wineList.map(val=>val).length>0 ? (
                            <div className='btn-add'>
                                <Button className="ml-sm-2 mt-2 mt-sm-0" onClick={() => {document.getElementById("html-xls").click();}}>Export XLS</Button>
                            </div>
                            ) : ""
                        }
                    </div>
                </div>
                <div className="d-flex justify-content-end align-items-center wine-main">
                    <div className='btn-add wine-sub'>
                        <input type="text" value={wineSearch} onChange={(e) => setWineSearch(e.target.value)} placeholder="Quick Find by Name"></input>
                    </div>
                </div>
            </div>
            
            
            <div className="order-history-content">
                <div className="order-history-table d-none d-md-block">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th width="5%">No</th>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("LWIN7")}>Lwin7</th>
                                <th width="25%" className="cursor-pointer" onClick={() => handleSorting("NAME")}>Wine Name</th>
                                <th width="10%" className="cursor-pointer" onClick={() => handleSorting("PRODUCER")}>Producer</th>
                                <th width="5%"  className="cursor-pointer" onClick={() => handleSorting("PRICE")}>Price</th>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("CASE_SIZE")}>Case Size</th>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("VINTAGE")}>Vintage</th>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("QTY")}>Qty</th>
                                <th width="10%" className="cursor-pointer" onClick={() => handleSorting("CREATED_AT")}>Created At</th>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("CREATED_BY")}>Created By</th>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("MP")}>Market Price</th>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("PURCHASE_DATE")}>Purchase Date</th>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("CURRENCY_CODE")}>Currency Code</th>
                                <th width="5%"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                wineSearch ? 
                                (
                                    allWineList && allWineList.map(val=>val).length>0 ? allWineList.filter((data) => {
                                        if(
                                            data.NAME && data.NAME.toLowerCase().includes(wineSearch.toLowerCase())  
                                        ) {
                                            return data;
                                       }
                                    }).map((value, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{value.LWIN7 ? value.LWIN7 : "-"}</td>
                                                <td>{value.NAME ? value.NAME : "-"}</td>
                                                <td>{value.PRODUCER ? value.PRODUCER : "-"}</td>
                                                <td>{value.PRICE ? value.PRICE : "-"}</td>
                                                <td>{value.CASE_SIZE ? value.CASE_SIZE : "-"}</td>
                                                <td>{value.VINTAGE ? value.VINTAGE : "-"}</td>
                                                <td>{value.QTY ? value.QTY : "-"}</td>
                                                <td>{value.CREATED_AT ? value.CREATED_AT : "-"}</td>
                                                <td>{value.CREATED_BY ? value.CREATED_BY : "-"}</td>
                                                <td>{value.MP ? value.MP : "-"}</td>
                                                <td>{value.PURCHASE_DATE ? value.PURCHASE_DATE : "-"}</td>
                                                <td>{value.CURRENCY_CODE ? value.CURRENCY_CODE : "-"}</td>
                                                <td onClick={() => {setCellarWineId(value.CELLAR_WINE_ID); setConfirmModal(true)}}>
                                                    <div className="delete-cellar">
                                                        <svg fill="#0085ff" height="18pt" viewBox="-57 0 512 512" width="18pt" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="m156.371094 30.90625h85.570312v14.398438h30.902344v-16.414063c.003906-15.929687-12.949219-28.890625-28.871094-28.890625h-89.632812c-15.921875 0-28.875 12.960938-28.875 28.890625v16.414063h30.90625zm0 0"/>
                                                            <path d="m344.210938 167.75h-290.109376c-7.949218 0-14.207031 6.78125-13.566406 14.707031l24.253906 299.90625c1.351563 16.742188 15.316407 29.636719 32.09375 29.636719h204.542969c16.777344 0 30.742188-12.894531 32.09375-29.640625l24.253907-299.902344c.644531-7.925781-5.613282-14.707031-13.5625-14.707031zm-219.863282 312.261719c-.324218.019531-.648437.03125-.96875.03125-8.101562 0-14.902344-6.308594-15.40625-14.503907l-15.199218-246.207031c-.523438-8.519531 5.957031-15.851562 14.472656-16.375 8.488281-.515625 15.851562 5.949219 16.375 14.472657l15.195312 246.207031c.527344 8.519531-5.953125 15.847656-14.46875 16.375zm90.433594-15.421875c0 8.53125-6.917969 15.449218-15.453125 15.449218s-15.453125-6.917968-15.453125-15.449218v-246.210938c0-8.535156 6.917969-15.453125 15.453125-15.453125 8.53125 0 15.453125 6.917969 15.453125 15.453125zm90.757812-245.300782-14.511718 246.207032c-.480469 8.210937-7.292969 14.542968-15.410156 14.542968-.304688 0-.613282-.007812-.921876-.023437-8.519531-.503906-15.019531-7.816406-14.515624-16.335937l14.507812-246.210938c.5-8.519531 7.789062-15.019531 16.332031-14.515625 8.519531.5 15.019531 7.816406 14.519531 16.335937zm0 0"/>
                                                            <path d="m397.648438 120.0625-10.148438-30.421875c-2.675781-8.019531-10.183594-13.429687-18.640625-13.429687h-339.410156c-8.453125 0-15.964844 5.410156-18.636719 13.429687l-10.148438 30.421875c-1.957031 5.867188.589844 11.851562 5.34375 14.835938 1.9375 1.214843 4.230469 1.945312 6.75 1.945312h372.796876c2.519531 0 4.816406-.730469 6.75-1.949219 4.753906-2.984375 7.300781-8.96875 5.34375-14.832031zm0 0"/>
                                                        </svg>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }) : ("") 
                                ) 
                                : 
                                (
                                    wineList && wineList.map(val=>val).length>0 ? wineList.map((value, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{value.LWIN7 ? value.LWIN7 : "-"}</td>
                                            <td>{value.NAME ? value.NAME : "-"}</td>
                                            <td>{value.PRODUCER ? value.PRODUCER : "-"}</td>
                                            <td>{value.PRICE ? value.PRICE : "-"}</td>
                                            <td>{value.CASE_SIZE ? value.CASE_SIZE : "-"}</td>
                                            <td>{value.VINTAGE ? value.VINTAGE : "-"}</td>
                                            <td>{value.QTY ? value.QTY : "-"}</td>
                                            <td>{value.CREATED_AT ? value.CREATED_AT : "-"}</td>
                                            <td>{value.CREATED_BY ? value.CREATED_BY : "-"}</td>
                                            <td>{value.MP ? value.MP : "-"}</td>
                                            <td>{value.PURCHASE_DATE ? value.PURCHASE_DATE : "-"}</td>
                                            <td>{value.CURRENCY_CODE ? value.CURRENCY_CODE : "-"}</td>
                                            <td onClick={() => {setCellarWineId(value.CELLAR_WINE_ID); setConfirmModal(true)}}>
                                            <div className="delete-cellar">
                                                <svg fill="#0085ff" height="18pt" viewBox="-57 0 512 512" width="18pt" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="m156.371094 30.90625h85.570312v14.398438h30.902344v-16.414063c.003906-15.929687-12.949219-28.890625-28.871094-28.890625h-89.632812c-15.921875 0-28.875 12.960938-28.875 28.890625v16.414063h30.90625zm0 0"/>
                                                    <path d="m344.210938 167.75h-290.109376c-7.949218 0-14.207031 6.78125-13.566406 14.707031l24.253906 299.90625c1.351563 16.742188 15.316407 29.636719 32.09375 29.636719h204.542969c16.777344 0 30.742188-12.894531 32.09375-29.640625l24.253907-299.902344c.644531-7.925781-5.613282-14.707031-13.5625-14.707031zm-219.863282 312.261719c-.324218.019531-.648437.03125-.96875.03125-8.101562 0-14.902344-6.308594-15.40625-14.503907l-15.199218-246.207031c-.523438-8.519531 5.957031-15.851562 14.472656-16.375 8.488281-.515625 15.851562 5.949219 16.375 14.472657l15.195312 246.207031c.527344 8.519531-5.953125 15.847656-14.46875 16.375zm90.433594-15.421875c0 8.53125-6.917969 15.449218-15.453125 15.449218s-15.453125-6.917968-15.453125-15.449218v-246.210938c0-8.535156 6.917969-15.453125 15.453125-15.453125 8.53125 0 15.453125 6.917969 15.453125 15.453125zm90.757812-245.300782-14.511718 246.207032c-.480469 8.210937-7.292969 14.542968-15.410156 14.542968-.304688 0-.613282-.007812-.921876-.023437-8.519531-.503906-15.019531-7.816406-14.515624-16.335937l14.507812-246.210938c.5-8.519531 7.789062-15.019531 16.332031-14.515625 8.519531.5 15.019531 7.816406 14.519531 16.335937zm0 0"/>
                                                    <path d="m397.648438 120.0625-10.148438-30.421875c-2.675781-8.019531-10.183594-13.429687-18.640625-13.429687h-339.410156c-8.453125 0-15.964844 5.410156-18.636719 13.429687l-10.148438 30.421875c-1.957031 5.867188.589844 11.851562 5.34375 14.835938 1.9375 1.214843 4.230469 1.945312 6.75 1.945312h372.796876c2.519531 0 4.816406-.730469 6.75-1.949219 4.753906-2.984375 7.300781-8.96875 5.34375-14.832031zm0 0"/>
                                                </svg>
                                            </div>
                                            </td>
                                        </tr>
                                    )
                                }) : ("") 
                                    
                                )
                            }
                            {
                                wineSearch ? (allWineList ? (allWineList.filter((data) => {
                                if( data.NAME && data.NAME.toLowerCase().includes(wineSearch.toLowerCase())  
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
                                        <td colSpan="12" className="text-center">Loading...</td>
                                    </tr>
                                ) :
                                ("")
                            }
                            {
                                wineList && wineList.length===0 && loadingData===false && !wineSearch? (
                                    <tr>
                                        <td colSpan="12" className="text-center">No Wine found!</td>
                                    </tr>
                                ) :
                                ("")
                            }
                            
                        </tbody>
                    </Table>
                </div>

                {/* hidden content -start */}
                <ReactHTMLTableToExcel  id="html-xls" className="d-none btn btn-primary"  
                                        table="wine"  filename="ReportExcel"  sheet="Sheet"  
                                        buttonText="Export" /> 
                <Table id="wine" className="d-none" responsive>
                    <div>test header</div>
                        <thead>
                            <tr>
                                <th width="5%">No</th>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("LWIN7")}>Lwin7</th>
                                <th width="25%" className="cursor-pointer" onClick={() => handleSorting("NAME")}>Wine Name</th>
                                <th width="15%" className="cursor-pointer" onClick={() => handleSorting("PRODUCER")}>Producer</th>
                                <th width="5%"  className="cursor-pointer" onClick={() => handleSorting("PRICE")}>Price</th>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("CASE_SIZE")}>Case Size</th>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("VINTAGE")}>Vintage</th>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("QTY")}>Qty</th>
                                <th width="5%" className="cursor-pointer" onClick={() => handleSorting("CELLAR_WINE_ID")}>Cellar Wine Id</th>
                                <th width="10%" className="cursor-pointer" onClick={() => handleSorting("CREATED_AT")}>Created At</th>
                                <th width="10%" className="cursor-pointer" onClick={() => handleSorting("CREATED_BY")}>Created By</th>
                                <th width="10%" className="cursor-pointer" onClick={() => handleSorting("CREATED_BY")}>Market Price</th>
                                <th width="5%"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                wineList && wineList.map(val=>val).length>0 ? wineList.map((value, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{ paddingRight: "114px" }}>{index + 1}</td>
                                        <td>{value.LWIN7 ? value.LWIN7 : "-"}</td>
                                        <td>{value.NAME ? value.NAME : "-"}</td>
                                        <td>{value.PRODUCER ? value.PRODUCER : "-"}</td>
                                        <td>{value.PRICE ? value.PRICE : "-"}</td>
                                        <td>{value.CASE_SIZE ? value.CASE_SIZE : "-"}</td>
                                        <td>{value.VINTAGE ? value.VINTAGE : "-"}</td>
                                        <td>{value.QTY ? value.QTY : "-"}</td>
                                        <td>{value.CELLAR_WINE_ID ? value.CELLAR_WINE_ID : "-"}</td>
                                        <td>{value.CREATED_AT ? value.CREATED_AT : "-"}</td>
                                        <td>{value.CREATED_BY ? value.CREATED_BY : "-"}</td>
                                        <td>{value.MP ? value.MP : "-"}</td>
                                    </tr>
                                )
                                }) : ("") 
                            }
                            
                        </tbody>
                    </Table>
                {/* hidden content -end */}
                <div className="order-history-mobile-table d-md-none">
                    {
                        wineSearch ? (
                            allWineList && allWineList.map(val=>val).length>0? allWineList.filter((data) => {
                                if( data.NAME && data.NAME.toLowerCase().includes(wineSearch.toLowerCase())   
                                ) {
                                    return data;
                               }
                            }).map((value,index)=>{
                                return(
                                    <div className="mobile-table-row" key={index}>
                                        <div className="mobile-table-list">
                                            <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                <div className="th">
                                                    <label onClick={() => handleSorting("LWIN7")}>LWIN7</label>
                                                    <span>{value.LWIN7 ? value.LWIN7 : "-"}</span>
                                                </div>
                                                <div className="th">
                                                    <label onClick={() => handleSorting("NAME")}>NAME</label>
                                                    <span>{value.NAME ? value.NAME : "-"}</span>
                                                </div>
                                                <div className="th">
                                                    <label onClick={() => handleSorting("PRODUCER")}>PRODUCER</label>
                                                    <span>{value.PRODUCER ? value.PRODUCER : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-td">
                                                <div className="mobile-table-td-row">
                                                    <div className="td-list d-flex justify-content-between">
                                                        <div className="td">
                                                            <span onClick={() => handleSorting("CASE_SIZE")}><strong>{value.CASE_SIZE ? value.CASE_SIZE : "-"}</strong></span>
                                                        </div>
                                                        <div className="td">
                                                            <div className="status-list">
                                                                <span onClick={() => handleSorting("PRICE")}><strong>{value.PRICE ? value.PRICE : "-"}</strong></span>
                                                            </div>
                                                        </div>
                                                        <div className="td">
                                                            <div className="status-list">
                                                                <span onClick={() => handleSorting("VINTAGE")}><strong>{value.VINTAGE ? value.VINTAGE : "-"}</strong></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => handleSorting("CREATED_AT")}>Created At</label>
                                                    <span>{value.CREATED_AT ? value.CREATED_AT : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => handleSorting("CREATED_BY")}>Created By</label>
                                                    <span>{value.CREATED_BY ? value.CREATED_BY : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => handleSorting("QTY")}>Quantity</label>
                                                    <span>{value.QTY ? value.QTY : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => handleSorting("MP")}>Market Price</label>
                                                    <span>{value.MP ? value.MP : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => handleSorting("PURCHASE_DATE")}>Purchase Date</label>
                                                    <span>{value.PURCHASE_DATE ? value.PURCHASE_DATE : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => handleSorting("CURRENCY_CODE")}>Currency Code</label>
                                                    <span>{value.CURRENCY_CODE ? value.CURRENCY_CODE : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => {setCellarWineId(value.CELLAR_WINE_ID); setConfirmModal(true)}}>Delete</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : ("")
                        ) : 
                        (
                            
                            wineList && wineList.map(val=>val).length>0 ? wineList.map((value,index)=>{
                                return(
                                    <div className="mobile-table-row" key={index}>
                                        <div className="mobile-table-list">
                                            <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                <div className="th">
                                                    <label onClick={() => handleSorting("LWIN7")}>LWIN7</label>
                                                    <span>{value.LWIN7 ? value.LWIN7 : "-"}</span>
                                                </div>
                                                <div className="th">
                                                    <label onClick={() => handleSorting("NAME")}>NAME</label>
                                                    <span>{value.NAME ? value.NAME : "-"}</span>
                                                </div>
                                                <div className="th">
                                                    <label onClick={() => handleSorting("PRODUCER")}>PRODUCER</label>
                                                    <span>{value.PRODUCER ? value.PRODUCER : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-td">
                                                <div className="mobile-table-td-row">
                                                    <div className="td-list d-flex justify-content-between">
                                                        <div className="td">
                                                            <span onClick={() => handleSorting("product")}><strong>{value.CASE_SIZE ? value.CASE_SIZE : "-"}</strong></span>
                                                        </div>
                                                        <div className="td">
                                                            <div className="status-list">
                                                                <span onClick={() => handleSorting("ship_option")}><strong>{value.PRICE ? value.PRICE : "-"}</strong></span>
                                                            </div>
                                                        </div>
                                                        <div className="td">
                                                            <div className="status-list">
                                                                <span onClick={() => handleSorting("ship_option")}><strong>{value.VINTAGE ? value.VINTAGE : "-"}</strong></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => handleSorting("fulfill_status")}>Created At</label>
                                                    <span>{value.CREATED_AT ? value.CREATED_AT : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => handleSorting("order_type")}>Created By</label>
                                                    <span>{value.CREATED_BY ? value.CREATED_BY : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => handleSorting("order_type")}>Quantity</label>
                                                    <span>{value.QTY ? value.QTY : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => handleSorting("MP")}>Market Price</label>
                                                    <span>{value.MP ? value.MP : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => handleSorting("PURCHASE_DATE")}>Purchase Date</label>
                                                    <span>{value.PURCHASE_DATE ? value.PURCHASE_DATE : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => handleSorting("CURRENCY_CODE")}>Currency Code</label>
                                                    <span>{value.CURRENCY_CODE ? value.CURRENCY_CODE : "-"}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-table-footer">
                                                <div className="shipping-option">
                                                    <label onClick={() => {setCellarWineId(value.CELLAR_WINE_ID); setConfirmModal(true)}}>Delete</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className="mobile-table-row text-center">
                                    No Wines Available
                                </div>
                            )
                            
                        )
                    }
                    {
                        wineSearch ? (allWineList ? (allWineList.filter((data) => {
                        if( data.NAME && data.NAME.toLowerCase().includes(wineSearch.toLowerCase())  
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
            <Modal show={addWineModal}
                       onHide={() => setAddWineModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>ADD WINE DETAILS</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={(e) => handleAddWines(e)}>
                        <Modal.Body>
                            <div className="change-address-body">
                                <div className="change-address-wrapper">
                                    {/* <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Title:</label>
                                        <input type="text" className="text-input"  value = {title?title:""} onChange = {(e) => {setError("");setSuccess(""); setTitle(e.target.value)}} required></input>
                                    </div> */}
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Wine Name:</label>
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isNameOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" >
                                                        <span>
                                                            <input className="search-input" type="text" value={name}  
                                                                onChange={(e)=>{setIsNameOpen(true); setName(e.target.value); setError(""); setSuccess(""); searchWine(e.target.value)}}
                                                                onFocus={() => handleCloseDropDowns("wine")}
                                                                placeholder="Search Wines">
                                                            </input>
                                                        </span>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            nameList && nameList.length>0 ? (
                                                                nameList.map((value, index) => {
                                                                    return (
                                                                        <span className={nameDropDownValue === value.name ? "custom-option selected":"custom-option"} onClick={() => { setNameDropDownValue(value.name); setLwin7(value.lwin7); setName(value.name); setIsNameOpen(false)}}>{value.name}</span>
                                                                    )
                                                                }) 
                                                            ):(
                                                                wineLoder ? (
                                                                    <span className="custom-option">{"Loading..."}</span>
                                                                ) : (<span className="custom-option">{"No Wine found!"}</span>)
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Vintage:</label>
                                        <input type="number" className="text-input" value = {year?year:""} onChange = {(e) => {setError(""); setSuccess("");setYear(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Size:</label>
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isSizeOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{{setIsSizeOpen(!isSizeOpen);handleCloseDropDowns("size")}}}>
                                                        {size ? size : "Select Size"}
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            sizeList.map((val, index) => {
                                                                return (
                                                                    <span key={index} className={size == val ? "custom-option selected":"custom-option"} onClick={() => {setSize(val); setIsSizeOpen(false)}}>{val}</span>
                                                                )
                                                            })
                                                        }
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
                                                    <div className="custom-select__trigger" onClick={()=>{setIsCurrencyOpen(!isCurrencyOpen);handleCloseDropDowns("currency");}}>
                                                        {currencyDropDownValue ? currencyDropDownValue : "Select Currency"}
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            currencyList.map((val, index) => {
                                                                return (
                                                                    <span key={index} className={currencyDropDownValue == val ? "custom-option selected":"custom-option"} onClick={() => {setCurrencyDropDownValue(val); setCurrency(index+1); setIsCurrencyOpen(false)}}>{val}</span>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Price:</label>
                                        <input type="number" min="1" className="text-input" value = {price?price:""} onChange = {(e) => {setError(""); setSuccess("");setPrice(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Quantity:</label>
                                        <input type="number" min="1" className="text-input" value = {qty?qty:""} onChange = {(e) => {setError(""); setSuccess("");setQty(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Purchase Date:</label>
                                        <input type="date" className="text-input" value = {purchaseDate?purchaseDate:""} onChange = {(e) => {setError(""); setSuccess(""); setPurchaseDate(e.target.value)}} required></input>
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
            <Modal show={confirmModal}
                onHide={() => setConfirmModal(false)} className="custom-modal user-updated-modal">
                <Modal.Header closeButton>
                    <Modal.Title>REMOVE WINE</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="change-address-body">
                        <div className="change-address-wrapper">
                            <div className="change-address-list d-flex justify-content-center align-items-center street-filed">
                                <span className="error-text">{"Are you sure, you want to delete this Wine?"}</span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" onClick = {() => setConfirmModal(false)}className="save-btn">Cancel</Button>
                    <Button type="button" onClick = {() => handleDeleteWine()}className="save-btn">Yes</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CellarWineDetails;