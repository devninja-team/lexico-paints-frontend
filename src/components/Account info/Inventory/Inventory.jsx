import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/Button";
import axios from 'axios';
import SessionModal from '../../Modals/SessionModal';
import { setSession, setSearch } from '../../../utils/Actions';
import downloadIcon from '../../../assets/images/download-icon.png'
import { generateUSInvoice,generateCRMShippingStatements } from '../../../utils/Pdf/helper';
import {useHistory} from "react-router-dom";
import "./index.scss";

let id;
const Inventory = () => {
    const dispatch = useDispatch();
    const query = useSelector(state => state.userRegion);
    const fetch = useSelector(state => state.fetch);
    const [inventoryList, setInventoryList] = useState();
    const [allInventoryList, setAllInventoryList] = useState();
    const search = useSelector(state => state.search);
    const [customerType, setCustomerType] = useState();
    const history = useHistory();
    const [showReceipt, setShowReceipt] = useState();
    const [sellButtonValue, setSellButtonValue] = useState('ALL');
    const [UUID, setUUID] = useState();
    const [loadingData, setLoadingData] = useState(false);
    
    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);

    //sorting vars
    const[sortOrder,setSortOrder] = useState('asc');

    //shipment statement dates
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [minimumDate, setMinimumDate] = useState();

    //filters vars
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [paymentDropDown, setPaymentDropDown] = useState("ALL");

    //editable fields
    const [showEditField, setShowEditField] = useState();
    const [updatedPriceToSale, setUpdatedPriceToSale] = useState();
    const [updatedAuthorizeToSale, setUpdatedAuthorizeToSale] = useState();
    const [updatedSaleCurrency, setUpdatedSaleCurrency] = useState();

    //editable dropdown
    const [isAuthorizeToSaleOpen, setAuthorizeToSaleOpen] = useState(false);
    const [isSaleCurrencyOpen, setIsSaleCurrencyOpen] = useState(false);
    
    useEffect(() => {
        var currentDate = new Date();
        var year = currentDate.getFullYear();                        // YYYY
        var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);  // MM
        var day = ("0" + currentDate.getDate()).slice(-2);           // DD
        var minDate = (year +"-"+ month +"-"+ day);
        setMinimumDate(minDate);
        dispatch(setSearch({search:""}));
    },[]);
    useEffect(() => {
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
            let arrayInventoryList = [];
            // console.log("inventory api response",res.data);
            if(res.data.inventory) {
                Object.entries(res.data.inventory).map((value)=>{
                    arrayInventoryList.push(value);
                });
                
                setInventoryList(arrayInventoryList);
                setAllInventoryList(arrayInventoryList);
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
        axios.post('/accounts/leadinfo'+query,{
            customer_id:id
        }).then((res) => {
            let arrayInventoryList = [];
            // console.log("inventory api response",res.data);
            if(res.data.inventory) {
                Object.entries(res.data.inventory).map((value)=>{
                    arrayInventoryList.push(value);
                });
                
                setInventoryList(arrayInventoryList);
                setAllInventoryList(arrayInventoryList);
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
    const handleSorting = (field) => {
        if(inventoryList && inventoryList.length>0) {
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
                            case "buyer_ref" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].buyer_ref?a[1].buyer_ref.toLowerCase():""
                                    var nameB=b[1].buyer_ref?b[1].buyer_ref.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "landin_date" :
                                sortedArray = allInventoryList.sort( 
                                    (a, b) => new Date (a[1].landin_date) - new Date(b[1].landin_date)
                                );
                            break;

                            case "wine_name" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].wine_name?a[1].wine_name.toLowerCase():""
                                    var nameB=b[1].wine_name?b[1].wine_name.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "vintage" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].vintage?a[1].vintage.toLowerCase():""
                                    var nameB=b[1].vintage?b[1].vintage.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "size" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].size?a[1].size.toLowerCase():""
                                    var nameB=b[1].size?b[1].size.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "price" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].price?parseFloat(a[1].price.toLowerCase()):""
                                    var nameB=b[1].price?parseFloat(b[1].price.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "price_to_sell" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].price_to_sell?parseFloat(a[1].price_to_sell.toLowerCase()):""
                                    var nameB=b[1].price_to_sell?parseFloat(b[1].price_to_sell.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "supplier" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].supplier?a[1].supplier.toLowerCase():""
                                    var nameB=b[1].supplier?b[1].supplier.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "sub_account" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].sub_account?a[1].sub_account.toLowerCase():""
                                    var nameB=b[1].sub_account?b[1].sub_account.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "authorize_to_sell" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].authorize_to_sell?a[1].authorize_to_sell.toLowerCase():""
                                    var nameB=b[1].authorize_to_sell?b[1].authorize_to_sell.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "sell_currency" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].sell_currency?a[1].sell_currency.toLowerCase():""
                                    var nameB=b[1].sell_currency?b[1].sell_currency.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            default:console.log("check sorting Label 1"); break;
                        }
                        setAllInventoryList([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "buyer_ref" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].buyer_ref?a[1].buyer_ref.toLowerCase():"", nameB=b[1].buyer_ref?b[1].buyer_ref.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "landin_date" :
                                sortedArray = allInventoryList.sort(
                                    (a, b) => new Date (b[1].landin_date) - new Date(a[1].landin_date)
                                );
                            break;

                            case "wine_name" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].wine_name?a[1].wine_name.toLowerCase():"", nameB=b[1].wine_name?b[1].wine_name.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "vintage" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].vintage?a[1].vintage.toLowerCase():"", nameB=b[1].vintage?b[1].vintage.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "size" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].size?a[1].size.toLowerCase():"", nameB=b[1].size?b[1].size.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "price" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].price?parseFloat(a[1].price.toLowerCase()):"", nameB=b[1].price?parseFloat(b[1].price.toLowerCase()):""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "price_to_sell" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].price?parseFloat(a[1].price_to_sell.toLowerCase()):"", nameB=b[1].price_to_sell?parseFloat(b[1].price_to_sell.toLowerCase()):""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "supplier" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].supplier?a[1].supplier.toLowerCase():"", nameB=b[1].supplier?b[1].supplier.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "sub_account" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].sub_account?a[1].sub_account.toLowerCase():"", nameB=b[1].sub_account?b[1].sub_account.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "authorize_to_sell" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].authorize_to_sell?a[1].authorize_to_sell.toLowerCase():"", nameB=b[1].authorize_to_sell?b[1].authorize_to_sell.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "sell_currency" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].sell_currency?a[1].sell_currency.toLowerCase():"", nameB=b[1].sell_currency?b[1].sell_currency.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                                
                            default:console.log("check sorting Label 2"); break;
                        }
                        setAllInventoryList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }else {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "buyer_ref" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].buyer_ref?a[1].buyer_ref.toLowerCase():""
                                    var nameB=b[1].buyer_ref?b[1].buyer_ref.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "landin_date" :
                                sortedArray = allInventoryList.sort(
                                    (a, b) => new Date (a[1].landin_date) - new Date(b[1].landin_date)
                                );
                            break;

                            case "wine_name" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].wine_name?a[1].wine_name.toLowerCase():""
                                    var nameB=b[1].wine_name?b[1].wine_name.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "vintage" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].vintage?a[1].vintage.toLowerCase():""
                                    var nameB=b[1].vintage?b[1].vintage.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "size" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].size?a[1].size.toLowerCase():""
                                    var nameB=b[1].size?b[1].size.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "price" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].price?parseFloat(a[1].price.toLowerCase()):""
                                    var nameB=b[1].price?parseFloat(b[1].price.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "price_to_sell" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].price_to_sell?parseFloat(a[1].price_to_sell.toLowerCase()):""
                                    var nameB=b[1].price_to_sell?parseFloat(b[1].price_to_sell.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "supplier" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].supplier?a[1].supplier.toLowerCase():""
                                    var nameB=b[1].supplier?b[1].supplier.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "sub_account" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].sub_account?a[1].sub_account.toLowerCase():""
                                    var nameB=b[1].sub_account?b[1].sub_account.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "authorize_to_sell" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].authorize_to_sell?a[1].authorize_to_sell.toLowerCase():""
                                    var nameB=b[1].authorize_to_sell?b[1].authorize_to_sell.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "sell_currency" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].sell_currency?a[1].sell_currency.toLowerCase():""
                                    var nameB=b[1].sell_currency?b[1].sell_currency.toLowerCase():""
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
                        setInventoryList([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "buyer_ref" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].buyer_ref?a[1].buyer_ref.toLowerCase():"", nameB=b[1].buyer_ref?b[1].buyer_ref.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "landin_date" :
                                sortedArray = allInventoryList.sort(
                                    (a, b) => new Date (b[1].landin_date) - new Date(a[1].landin_date)
                                );
                            break;

                            case "wine_name" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].wine_name?a[1].wine_name.toLowerCase():"", nameB=b[1].wine_name?b[1].wine_name.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "vintage" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].vintage?a[1].vintage.toLowerCase():"", nameB=b[1].vintage?b[1].vintage.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "size" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].size?a[1].size.toLowerCase():"", nameB=b[1].size?b[1].size.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "price" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].price?parseFloat(a[1].price.toLowerCase()):"", nameB=b[1].price?parseFloat(b[1].price.toLowerCase()):""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "price_to_sell" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].price_to_sell?parseFloat(a[1].price_to_sell.toLowerCase()):"", nameB=b[1].price_to_sell?parseFloat(b[1].price_to_sell.toLowerCase()):""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "supplier" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].supplier?a[1].supplier.toLowerCase():"", nameB=b[1].supplier?b[1].supplier.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "sub_account" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].sub_account?a[1].sub_account.toLowerCase():"", nameB=b[1].sub_account?b[1].sub_account.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "authorize_to_sell" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].authorize_to_sell?a[1].authorize_to_sell.toLowerCase():"", nameB=b[1].authorize_to_sell?b[1].authorize_to_sell.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "sell_currency" :
                                sortedArray = allInventoryList.sort( function(a, b) {
                                    var nameA=a[1].sell_currency?a[1].sell_currency.toLowerCase():"", nameB=b[1].sell_currency?b[1].sell_currency.toLowerCase():""
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                                
                            default:console.log("check sorting Label 2"); break;
                        }
                        setInventoryList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }
        }
    }
    const handleSellFilter = (value) => {
        let filteredData = [];
        if(value==="ALL") {
            setInventoryList(allInventoryList);
        } else {
            filteredData = allInventoryList.filter((data) => {
                if((data[1].authorize_to_sell && data[1].authorize_to_sell.includes(value))) {
                    return data;
                }
            });
            setInventoryList(filteredData);
        }
    } 

    const handleEditableFields = () => {
        axios.post('/accounts/edit_inventory'+query,{
            uuid: UUID,
            sale_price: updatedPriceToSale,
            auth_to_sale: updatedAuthorizeToSale,
            sale_currency: updatedSaleCurrency 
        }).then((res) => {
            if(res.data.message === "inventory updated") {
                setInventoryList([]);
                setAllInventoryList([]);
                if(customerType === "Customer" || customerType==="Vendor") {
                    fetchInfo();
                } else {
                    fetchLeadInfo();
                }
            }
        }).catch((error) => {
            console.log(error);
            // dispatch(setSession());
        });
    }

    return (
        <div className="order-history-page">
            <div className="order-history-head py-3 px-3">
                <div className="title flex-column flex-sm-row">
                    <h6 className="pl-0">Inventory List</h6>
                </div>
                
                {
                    allInventoryList && allInventoryList.length>0 ? (
                        <div className="customer-data-head-filter d-flex justify-content-end align-items-center border-bottom-0">
                            <div className="customer-title">
                                Authorize to Sale :
                            </div>
                            <div className="data-filter">
                                <ul>
                                    <li>
                                        <Button className={sellButtonValue==="ALL" ? 'btn-filter active' : 'btn-filter'}
                                                onClick={() => {setSellButtonValue("ALL"); handleSellFilter("ALL")}} variant="outline-primary" >ALL
                                        </Button>
                                    </li>
                                    <li>
                                        <Button className={sellButtonValue==="Yes" ? 'btn-filter active' : 'btn-filter'}
                                                onClick={() => {setSellButtonValue("Yes"); handleSellFilter("Yes")}}>Yes
                                        </Button>
                                    </li>
                                    <li>
                                        <Button className={sellButtonValue==="No" ? 'btn-filter active' : 'btn-filter'}
                                                onClick={() => {setSellButtonValue("No"); handleSellFilter("No")}} >No
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) :""
                }
            </div>
            
            <div className="order-history-content">
                <div className="order-history-table d-none d-md-block">
                    <Table responsive>
                        <thead>
                            <tr>
                                <th width="15%" className="cursor-pointer" onClick={() => handleSorting("buyer_ref")}>Ref</th>
                                <th width="35%" className="cursor-pointer" onClick={() => handleSorting("wine_name")}>Wine Name</th>
                                <th width="15%" className="cursor-pointer" onClick={() => handleSorting("landin_date")}>Landing Date</th>
                                <th width="5%" className="cursor-pointer"  onClick={() => handleSorting("vintage")}>Vintage</th>
                                <th width="5%"  className="cursor-pointer" onClick={() => handleSorting("size")}>Size</th>
                                <th width="10%" className="cursor-pointer" onClick={() => handleSorting("price")}>Price</th>
                                <th width="10%" className="cursor-pointer" onClick={() => handleSorting("supplier")}>Supplier</th>
                                <th width="5%" className="cursor-pointer"  onClick={() => handleSorting("sub_account")}>Sub Account</th>
                                <th width="5%" className="cursor-pointer"  onClick={() => handleSorting("price_to_sell")}>Price to Sale</th>
                                <th width="5%" className="cursor-pointer"  onClick={() => handleSorting("authorize_to_sell")}>Authorize to Sale</th>
                                <th width="5%" className="cursor-pointer"  onClick={() => handleSorting("sell_currency")}>Sale Currency</th>
                                <th width="15%">Edit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                search ? 
                                (
                                    allInventoryList && allInventoryList.map(val=>val).length>0 ? allInventoryList.filter((data) => {
                                        if( data[1].buyer_ref && data[1].buyer_ref.toLowerCase().includes(search.toLowerCase()) ||
                                            data[1].wine_name && data[1].wine_name.toLowerCase().includes(search.toLowerCase())  
                                        ) {
                                            return data;
                                       }
                                    }).map((value, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{value[1].buyer_ref ? value[1].buyer_ref : "-"}</td> 
                                                <td>{value[1].wine_name ? value[1].wine_name : "-"}</td> 
                                                <td>{value[1].landin_date ? value[1].landin_date : "-"}</td> 
                                                <td>{value[1].vintage ? value[1].vintage : "-"}</td> 
                                                <td>{value[1].size ? value[1].size : "-"}</td> 
                                                <td>{value[1].price ? value[1].price : "-"}</td> 
                                                <td>{value[1].supplier ? value[1].supplier : "-"}</td> 
                                                <td>{value[1].sub_account ? value[1].sub_account : "-"}</td>
                                                {
                                                    showEditField === index ? (
                                                        <>
                                                            <td>
                                                                <input type="text" value={updatedPriceToSale} onChange={(e) => setUpdatedPriceToSale(e.target.value)}></input></td> 
                                                            <td>
                                                                <div className="dropUp">
                                                                <div className="custom-select-wrapper d-flex align-items-center">
                                                                    <div className={isAuthorizeToSaleOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                        <div className="custom-select__trigger" onClick={()=>setAuthorizeToSaleOpen(!isAuthorizeToSaleOpen)}><span>{updatedAuthorizeToSale}</span>
                                                                            <div className="arrow">
                                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                        <div className="custom-options">
                                                                            <span className={updatedAuthorizeToSale === "Yes" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedAuthorizeToSale("Yes"); setAuthorizeToSaleOpen(false)}}>Yes</span>
                                                                            <span className={updatedAuthorizeToSale === "No" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedAuthorizeToSale('No'); setAuthorizeToSaleOpen(false)}}>No</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            </td>
                                                            <td>
                                                                <div className="dropUp">
                                                                    <div className="custom-select-wrapper d-flex align-items-center">
                                                                        <div className={isSaleCurrencyOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                            <div className="custom-select__trigger" onClick={()=>setIsSaleCurrencyOpen(!isSaleCurrencyOpen)}><span>{updatedSaleCurrency}</span>
                                                                                <div className="arrow">
                                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                    </svg>
                                                                                </div>
                                                                            </div>
                                                                            <div className="custom-options">
                                                                                <span className={updatedSaleCurrency === "GBP" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedSaleCurrency("GBP"); setIsSaleCurrencyOpen(false)}}>GBP</span>
                                                                                <span className={updatedSaleCurrency === "USD" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedSaleCurrency('USD'); setIsSaleCurrencyOpen(false)}}>USD</span>
                                                                                <span className={updatedSaleCurrency === "EUR" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedSaleCurrency('EUR'); setIsSaleCurrencyOpen(false)}}>EUR</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </>
                                                    ) : (<>
                                                            <td>{value[1].price_to_sell ? value[1].price_to_sell : "-"}</td> 
                                                            <td>{value[1].authorize_to_sell ? value[1].authorize_to_sell : "-"}</td>
                                                            <td>{value[1].sell_currency ? value[1].sell_currency : "-"}</td>
                                                        </>
                                                    )
                                                } 
                                                <td>{showEditField===index ? 
                                                    (<>
                                                        <div className="edit-btn-show d-flex">
                                                            <Button onClick={() => {setShowEditField(""); handleEditableFields()}}>Save</Button>
                                                            <Button className="px-2" onClick={() => setShowEditField("")}>X</Button>
                                                        </div>
                                                        </>) : 
                                                        <Button className="edit-btn-inventory px-3" onClick={() => {
                                                            setUpdatedPriceToSale(value[1].price_to_sell ? value[1].price_to_sell:"");
                                                            setUpdatedAuthorizeToSale(value[1].authorize_to_sell ? value[1].authorize_to_sell:"");
                                                            setUpdatedSaleCurrency(value[1].sell_currency ? value[1].sell_currency:""); 
                                                            setUUID(value[0]);
                                                            setShowEditField(index)}}>
                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M4.03984 15.625C4.08672 15.625 4.13359 15.6203 4.18047 15.6133L8.12266 14.9219C8.16953 14.9125 8.21406 14.8914 8.24688 14.8563L18.182 4.92109C18.2038 4.89941 18.221 4.87366 18.2328 4.8453C18.2445 4.81695 18.2506 4.78656 18.2506 4.75586C18.2506 4.72516 18.2445 4.69477 18.2328 4.66642C18.221 4.63806 18.2038 4.61231 18.182 4.59063L14.2867 0.692969C14.2422 0.648438 14.1836 0.625 14.1203 0.625C14.057 0.625 13.9984 0.648438 13.9539 0.692969L4.01875 10.6281C3.98359 10.6633 3.9625 10.7055 3.95312 10.7523L3.26172 14.6945C3.23892 14.8201 3.24707 14.9493 3.28545 15.071C3.32384 15.1927 3.39132 15.3032 3.48203 15.393C3.63672 15.543 3.83125 15.625 4.03984 15.625ZM5.61953 11.5375L14.1203 3.03906L15.8383 4.75703L7.3375 13.2555L5.25391 13.6234L5.61953 11.5375ZM18.625 17.5938H1.375C0.960156 17.5938 0.625 17.9289 0.625 18.3438V19.1875C0.625 19.2906 0.709375 19.375 0.8125 19.375H19.1875C19.2906 19.375 19.375 19.2906 19.375 19.1875V18.3438C19.375 17.9289 19.0398 17.5938 18.625 17.5938Z" fill="#0085FF"/>
                                                                </svg>
                                                        </Button>}
                                                </td> 
                                        </tr>
                                        )
                                    }) : ("") 
                                ) 
                                : 
                                (
                                    inventoryList && inventoryList.map(val=>val).length>0 ? inventoryList.map((value, index) => {
                                    return (
                                        <tr key={index}> 
                                            <td>{value[1].buyer_ref ? value[1].buyer_ref : "-"}</td> 
                                            <td>{value[1].wine_name ? value[1].wine_name : "-"}</td> 
                                            <td>{value[1].landin_date ? value[1].landin_date : "-"}</td> 
                                            <td>{value[1].vintage ? value[1].vintage : "-"}</td> 
                                            <td>{value[1].size ? value[1].size : "-"}</td> 
                                            <td>{value[1].price ? value[1].price : "-"}</td> 
                                            <td>{value[1].supplier ? value[1].supplier : "-"}</td> 
                                            <td>{value[1].sub_account ? value[1].sub_account : "-"}</td>
                                            {
                                                showEditField === index ? (
                                                    <>
                                                        <td><input type="text" value={updatedPriceToSale} onChange={(e) => setUpdatedPriceToSale(e.target.value)}></input></td> 
                                                        <td>
                                                        <div className="dropUp">
                                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                                <div className={isAuthorizeToSaleOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                    <div className="custom-select__trigger" onClick={()=>setAuthorizeToSaleOpen(!isAuthorizeToSaleOpen)}><span>{updatedAuthorizeToSale}</span>
                                                                        <div className="arrow">
                                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                    <div className="custom-options">
                                                                        <span className={updatedAuthorizeToSale === "Yes" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedAuthorizeToSale("Yes"); setAuthorizeToSaleOpen(false)}}>Yes</span>
                                                                        <span className={updatedAuthorizeToSale === "No" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedAuthorizeToSale('No'); setAuthorizeToSaleOpen(false)}}>No</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        </td>
                                                        <td>
                                                        <div className="dropUp">
                                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                                <div className={isSaleCurrencyOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                    <div className="custom-select__trigger" onClick={()=>setIsSaleCurrencyOpen(!isSaleCurrencyOpen)}><span>{updatedSaleCurrency}</span>
                                                                        <div className="arrow">
                                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                    <div className="custom-options">
                                                                        <span className={updatedSaleCurrency === "GBP" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedSaleCurrency("GBP"); setIsSaleCurrencyOpen(false)}}>GBP</span>
                                                                        <span className={updatedSaleCurrency === "USD" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedSaleCurrency('USD'); setIsSaleCurrencyOpen(false)}}>USD</span>
                                                                        <span className={updatedSaleCurrency === "EUR" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedSaleCurrency('EUR'); setIsSaleCurrencyOpen(false)}}>EUR</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        </td>
                                                    </>
                                                ) : (<>
                                                        <td>{value[1].price_to_sell ? value[1].price_to_sell : "-"}</td> 
                                                        <td>{value[1].authorize_to_sell ? value[1].authorize_to_sell : "-"}</td>
                                                        <td>{value[1].sell_currency ? value[1].sell_currency : "-"}</td>
                                                    </>
                                                )
                                            } 
                                            <td>{showEditField===index ? 
                                                (<>
                                                    <div className="edit-btn-show d-flex">
                                                        <Button onClick={() => {setShowEditField(""); handleEditableFields()}}>Save</Button>
                                                        <Button className="px-2" onClick={() => setShowEditField("")}>X</Button>
                                                    </div>
                                                    </>) : 
                                                    <Button className="edit-btn-inventory px-3" onClick={() => {
                                                        setUpdatedPriceToSale(value[1].price_to_sell ? value[1].price_to_sell:"");
                                                        setUpdatedAuthorizeToSale(value[1].authorize_to_sell ? value[1].authorize_to_sell:"");
                                                        setUpdatedSaleCurrency(value[1].sell_currency ? value[1].sell_currency:""); 
                                                        setUUID(value[0]);
                                                        setShowEditField(index)}}>
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M4.03984 15.625C4.08672 15.625 4.13359 15.6203 4.18047 15.6133L8.12266 14.9219C8.16953 14.9125 8.21406 14.8914 8.24688 14.8563L18.182 4.92109C18.2038 4.89941 18.221 4.87366 18.2328 4.8453C18.2445 4.81695 18.2506 4.78656 18.2506 4.75586C18.2506 4.72516 18.2445 4.69477 18.2328 4.66642C18.221 4.63806 18.2038 4.61231 18.182 4.59063L14.2867 0.692969C14.2422 0.648438 14.1836 0.625 14.1203 0.625C14.057 0.625 13.9984 0.648438 13.9539 0.692969L4.01875 10.6281C3.98359 10.6633 3.9625 10.7055 3.95312 10.7523L3.26172 14.6945C3.23892 14.8201 3.24707 14.9493 3.28545 15.071C3.32384 15.1927 3.39132 15.3032 3.48203 15.393C3.63672 15.543 3.83125 15.625 4.03984 15.625ZM5.61953 11.5375L14.1203 3.03906L15.8383 4.75703L7.3375 13.2555L5.25391 13.6234L5.61953 11.5375ZM18.625 17.5938H1.375C0.960156 17.5938 0.625 17.9289 0.625 18.3438V19.1875C0.625 19.2906 0.709375 19.375 0.8125 19.375H19.1875C19.2906 19.375 19.375 19.2906 19.375 19.1875V18.3438C19.375 17.9289 19.0398 17.5938 18.625 17.5938Z" fill="#0085FF"/>
                                                            </svg>
                                                    </Button>}
                                            </td>
                                        </tr>
                                    )
                                }) : ("") 
                                    
                                )
                            }
                            {
                                search ? (allInventoryList ? (allInventoryList.filter((data) => {
                                if( data[1].buyer_ref && data[1].buyer_ref.toLowerCase().includes(search.toLowerCase()) ||
                                    data[1].wine_name && data[1].wine_name.toLowerCase().includes(search.toLowerCase())  
                                ) {
                                    return data;
                                }
                                }).length>0) ? "":
                                (<tr>
                                    <td colSpan="12" className="text-center">No Data Found!</td>
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
                                inventoryList && inventoryList.length===0 && loadingData===false && !search? (
                                    <tr>
                                        <td colSpan="12" className="text-center">No Inventory found!</td>
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
                            allInventoryList && allInventoryList.map(val=>val).length>0? allInventoryList.filter((data) => {
                                if( data[1].buyer_ref && data[1].buyer_ref.toLowerCase().includes(search.toLowerCase()) ||
                                    data[1].wine_name && data[1].wine_name.toLowerCase().includes(search.toLowerCase())   
                                ) {
                                    return data;
                               }
                            }).map((value,index)=>{
                                return(
                                    <div className="mobile-table-row" key={index}>
                                        <div className="mobile-table-list">
                                        {showEditField===index ? 
                                                (<>
                                                    <div className="edit-btn-show d-flex justify-content-end">
                                                        <Button onClick={() => {setShowEditField(""); handleEditableFields()}}>Save</Button>
                                                        <Button className="px-2" onClick={() => setShowEditField("")}>X</Button>
                                                    </div>
                                                    </>) : 
                                                    <div className="edit-btn-show d-flex justify-content-end">
                                                    <Button className="edit-btn-inventory px-3" onClick={() => {
                                                        setUpdatedPriceToSale(value[1].price_to_sell ? value[1].price_to_sell:"");
                                                        setUpdatedAuthorizeToSale(value[1].authorize_to_sell ? value[1].authorize_to_sell:"");
                                                        setUpdatedSaleCurrency(value[1].sell_currency ? value[1].sell_currency:""); 
                                                        setUUID(value[0]);
                                                        setShowEditField(index)}}>
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M4.03984 15.625C4.08672 15.625 4.13359 15.6203 4.18047 15.6133L8.12266 14.9219C8.16953 14.9125 8.21406 14.8914 8.24688 14.8563L18.182 4.92109C18.2038 4.89941 18.221 4.87366 18.2328 4.8453C18.2445 4.81695 18.2506 4.78656 18.2506 4.75586C18.2506 4.72516 18.2445 4.69477 18.2328 4.66642C18.221 4.63806 18.2038 4.61231 18.182 4.59063L14.2867 0.692969C14.2422 0.648438 14.1836 0.625 14.1203 0.625C14.057 0.625 13.9984 0.648438 13.9539 0.692969L4.01875 10.6281C3.98359 10.6633 3.9625 10.7055 3.95312 10.7523L3.26172 14.6945C3.23892 14.8201 3.24707 14.9493 3.28545 15.071C3.32384 15.1927 3.39132 15.3032 3.48203 15.393C3.63672 15.543 3.83125 15.625 4.03984 15.625ZM5.61953 11.5375L14.1203 3.03906L15.8383 4.75703L7.3375 13.2555L5.25391 13.6234L5.61953 11.5375ZM18.625 17.5938H1.375C0.960156 17.5938 0.625 17.9289 0.625 18.3438V19.1875C0.625 19.2906 0.709375 19.375 0.8125 19.375H19.1875C19.2906 19.375 19.375 19.2906 19.375 19.1875V18.3438C19.375 17.9289 19.0398 17.5938 18.625 17.5938Z" fill="#0085FF"/>
                                                            </svg>
                                                    </Button>
                                                    </div>}
                                                    {
                                                        showEditField === index ? (
                                                            <>
                                                            <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                                <div className="th">
                                                                    <label onClick={() => handleSorting("size")}>Size</label>
                                                                    <span className="link">
                                                                        {value[1].size ? value[1].size : "-"}
                                                                    </span>
                                                                </div>
                                                                <div className="th">
                                                                    <label onClick={() => handleSorting("vintage")}>Vintage</label>
                                                                    <span>{value[1].vintage ? value[1].vintage : "-"}</span>
                                                                </div>
                                                                <div className="th">
                                                            </div>
                                                                        <label onClick={() => handleSorting("price")}>Price</label>
                                                                    <span>{value[1].price ? value[1].price : "-"}</span>
                                                            </div>
                                                            <div className="mobile-table-td">
                                                                <div className="mobile-table-td-row">
                                                                    <div className="td-list d-flex justify-content-between">
                                                                        <div className="td">
                                                                            <span onClick={() => handleSorting("wine_name")}><strong>{value[1].wine_name ? value[1].wine_name : "-"}</strong></span>
                                                                        </div>
                                                                        <div className="td">
                                                                            <div className="status-list">
                                                                                <span onClick={() => handleSorting("sub_account")}><strong>{value[1].sub_account ? value[1].sub_account : "-"}</strong></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("buyer_ref")}>Buyer's Reference</label>
                                                                    <span>{value[1].buyer_ref ? value[1].buyer_ref : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("supplier")}>Supplier</label>
                                                                    <span>{value[1].supplier ? value[1].supplier : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("landin_date")}>Landing Date</label>
                                                                    <span>{value[1].landin_date ? value[1].landin_date : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("authorize_to_sell")}>Price to Sale</label>
                                                                    <span><input type="text" value={updatedSaleCurrency} onChange={(e) => setUpdatedPriceToSale(e.target.value)}></input></span>
                                                                    <span>{value[1].price_to_sell ? value[1].price_to_sell : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("authorize_to_sell")}>Authorize to Sale</label>
                                                                    <span><div className="dropUp">
                                                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                                                <div className={isAuthorizeToSaleOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                                    <div className="custom-select__trigger" onClick={()=>setAuthorizeToSaleOpen(!isAuthorizeToSaleOpen)}><span>{updatedAuthorizeToSale}</span>
                                                                                        <div className="arrow">
                                                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                            </svg>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="custom-options">
                                                                                        <span className={updatedAuthorizeToSale === "Yes" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedAuthorizeToSale("Yes"); setAuthorizeToSaleOpen(false)}}>Yes</span>
                                                                                        <span className={updatedAuthorizeToSale === "No" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedAuthorizeToSale('No'); setAuthorizeToSaleOpen(false)}}>No</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("sell_currency")}>Sale Currency</label>
                                                                    <span>
                                                                    <div className="dropUp">
                                                                        <div className="custom-select-wrapper d-flex align-items-center">
                                                                            <div className={isSaleCurrencyOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                                <div className="custom-select__trigger" onClick={()=>setIsSaleCurrencyOpen(!isSaleCurrencyOpen)}><span>{updatedSaleCurrency}</span>
                                                                                    <div className="arrow">
                                                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                        </svg>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="custom-options">
                                                                                    <span className={updatedSaleCurrency === "GBP" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedSaleCurrency("GBP"); setIsSaleCurrencyOpen(false)}}>GBP</span>
                                                                                    <span className={updatedSaleCurrency === "USD" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedSaleCurrency('USD'); setIsSaleCurrencyOpen(false)}}>USD</span>
                                                                                    <span className={updatedSaleCurrency === "EUR" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedSaleCurrency('EUR'); setIsSaleCurrencyOpen(false)}}>EUR</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                            <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                                <div className="th">
                                                                    <label onClick={() => handleSorting("size")}>Size</label>
                                                                    <span className="link">
                                                                        {value[1].size ? value[1].size : "-"}
                                                                    </span>
                                                                </div>
                                                                <div className="th">
                                                                    <label onClick={() => handleSorting("vintage")}>Vintage</label>
                                                                    <span>{value[1].vintage ? value[1].vintage : "-"}</span>
                                                                </div>
                                                                <div className="th">
                                                                    <label onClick={() => handleSorting("price")}>Price</label>
                                                                    <span>{value[1].price ? value[1].price : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-td">
                                                                <div className="mobile-table-td-row">
                                                                    <div className="td-list d-flex justify-content-between">
                                                                        <div className="td">
                                                                            <span onClick={() => handleSorting("wine_name")}><strong>{value[1].wine_name ? value[1].wine_name : "-"}</strong></span>
                                                                        </div>
                                                                        <div className="td">
                                                                            <div className="status-list">
                                                                                <span onClick={() => handleSorting("sub_account")}><strong>{value[1].sub_account ? value[1].sub_account : "-"}</strong></span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("buyer_ref")}>Buyer's Reference</label>
                                                                    <span>{value[1].buyer_ref ? value[1].buyer_ref : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("supplier")}>Supplier</label>
                                                                    <span>{value[1].supplier ? value[1].supplier : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("landin_date")}>Landing Date</label>
                                                                    <span>{value[1].landin_date ? value[1].landin_date : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("authorize_to_sell")}>Price to Sale</label>
                                                                    <span>{value[1].price_to_sell ? value[1].price_to_sell : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("authorize_to_sell")}>Authorize to Sale</label>
                                                                    <span>{value[1].authorize_to_sell ? value[1].authorize_to_sell : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("sell_currency")}>Sale Currency</label>
                                                                    <span>{value[1].sell_currency ? value[1].sell_currency : "-"}</span>
                                                                </div>
                                                            </div>
                                                            </>
                                                        )
                                                    }
                                        </div>
                                    </div>
                                )
                            }) : ("")
                        ) : 
                        (
                            
                            inventoryList && inventoryList.map(val=>val).length>0 ? inventoryList.map((value,index)=>{
                                return(
                                    <div className="mobile-table-row" key={index}>
                                        <div className="mobile-table-list">
                                        {showEditField===index ? 
                                                    (<>
                                                        <div className="edit-btn-show d-flex justify-content-end">
                                                            <Button onClick={() => {setShowEditField(""); handleEditableFields()}}>Save</Button>
                                                            <Button className="px-2" onClick={() => setShowEditField("")}>X</Button>
                                                        </div>
                                                        </>) : 
                                                        <div className="edit-btn-show d-flex justify-content-end">
                                                            <Button className="edit-btn-inventory px-3" onClick={() => {
                                                                setUpdatedPriceToSale(value[1].price_to_sell ? value[1].price_to_sell:"");
                                                                setUpdatedAuthorizeToSale(value[1].authorize_to_sell ? value[1].authorize_to_sell:"");
                                                                setUpdatedSaleCurrency(value[1].sell_currency ? value[1].sell_currency:""); 
                                                                setUUID(value[0]);
                                                                setShowEditField(index)}}>
                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M4.03984 15.625C4.08672 15.625 4.13359 15.6203 4.18047 15.6133L8.12266 14.9219C8.16953 14.9125 8.21406 14.8914 8.24688 14.8563L18.182 4.92109C18.2038 4.89941 18.221 4.87366 18.2328 4.8453C18.2445 4.81695 18.2506 4.78656 18.2506 4.75586C18.2506 4.72516 18.2445 4.69477 18.2328 4.66642C18.221 4.63806 18.2038 4.61231 18.182 4.59063L14.2867 0.692969C14.2422 0.648438 14.1836 0.625 14.1203 0.625C14.057 0.625 13.9984 0.648438 13.9539 0.692969L4.01875 10.6281C3.98359 10.6633 3.9625 10.7055 3.95312 10.7523L3.26172 14.6945C3.23892 14.8201 3.24707 14.9493 3.28545 15.071C3.32384 15.1927 3.39132 15.3032 3.48203 15.393C3.63672 15.543 3.83125 15.625 4.03984 15.625ZM5.61953 11.5375L14.1203 3.03906L15.8383 4.75703L7.3375 13.2555L5.25391 13.6234L5.61953 11.5375ZM18.625 17.5938H1.375C0.960156 17.5938 0.625 17.9289 0.625 18.3438V19.1875C0.625 19.2906 0.709375 19.375 0.8125 19.375H19.1875C19.2906 19.375 19.375 19.2906 19.375 19.1875V18.3438C19.375 17.9289 19.0398 17.5938 18.625 17.5938Z" fill="#0085FF"/>
                                                                    </svg>
                                                            </Button>
                                                        </div>}
                                                        {
                                                            showEditField === index ? (
                                                                <>
                                                                <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                                    <div className="th">
                                                                        <label onClick={() => handleSorting("size")}>Size</label>
                                                                        <span className="link">
                                                                            {value[1].size ? value[1].size : "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="th">
                                                                        <label onClick={() => handleSorting("vintage")}>Vintage</label>
                                                                        <span>{value[1].vintage ? value[1].vintage : "-"}</span>
                                                                    </div>
                                                                    <div className="th">
                                                                        <label onClick={() => handleSorting("price")}>Price</label>
                                                                        <span>{value[1].price ? value[1].price : "-"}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-td">
                                                                    <div className="mobile-table-td-row">
                                                                        <div className="td-list d-flex justify-content-between">
                                                                            <div className="td">
                                                                                <span onClick={() => handleSorting("wine_name")}><strong>{value[1].wine_name ? value[1].wine_name : "-"}</strong></span>
                                                                            </div>
                                                                            <div className="td">
                                                                                <div className="status-list">
                                                                                    <span onClick={() => handleSorting("sub_account")}><strong>{value[1].sub_account ? value[1].sub_account : "-"}</strong></span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-footer">
                                                                    <div className="shipping-option">
                                                                        <label onClick={() => handleSorting("buyer_ref")}>Buyer's Reference</label>
                                                                        <span>{value[1].buyer_ref ? value[1].buyer_ref : "-"}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-footer">
                                                                    <div className="shipping-option">
                                                                        <label onClick={() => handleSorting("supplier")}>Supplier</label>
                                                                        <span>{value[1].supplier ? value[1].supplier : "-"}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-footer">
                                                                    <div className="shipping-option">
                                                                        <label onClick={() => handleSorting("landin_date")}>Landing Date</label>
                                                                        <span>{value[1].landin_date ? value[1].landin_date : "-"}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-footer">
                                                                    <div className="shipping-option">
                                                                        <label onClick={() => handleSorting("authorize_to_sell")}>Price to Sale</label>
                                                                        <span><input type="text" value={updatedSaleCurrency} onChange={(e) => setUpdatedPriceToSale(e.target.value)}></input></span>
                                                                        <span>{value[1].price_to_sell ? value[1].price_to_sell : "-"}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-footer">
                                                                    <div className="shipping-option">
                                                                        <label onClick={() => handleSorting("authorize_to_sell")}>Authorize to Sale</label>
                                                                        <span><div className="dropUp">
                                                                                <div className="custom-select-wrapper d-flex align-items-center">
                                                                                    <div className={isAuthorizeToSaleOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                                        <div className="custom-select__trigger" onClick={()=>setAuthorizeToSaleOpen(!isAuthorizeToSaleOpen)}><span>{updatedAuthorizeToSale}</span>
                                                                                            <div className="arrow">
                                                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                                </svg>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="custom-options">
                                                                                            <span className={updatedAuthorizeToSale === "Yes" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedAuthorizeToSale("Yes"); setAuthorizeToSaleOpen(false)}}>Yes</span>
                                                                                            <span className={updatedAuthorizeToSale === "No" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedAuthorizeToSale('No'); setAuthorizeToSaleOpen(false)}}>No</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-footer">
                                                                    <div className="shipping-option">
                                                                        <label onClick={() => handleSorting("sell_currency")}>Sale Currency</label>
                                                                        <span>
                                                                        <div className="dropUp">
                                                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                                                <div className={isSaleCurrencyOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                                    <div className="custom-select__trigger" onClick={()=>setIsSaleCurrencyOpen(!isSaleCurrencyOpen)}><span>{updatedSaleCurrency}</span>
                                                                                        <div className="arrow">
                                                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                            </svg>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="custom-options">
                                                                                        <span className={updatedSaleCurrency === "GBP" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedSaleCurrency("GBP"); setIsSaleCurrencyOpen(false)}}>GBP</span>
                                                                                        <span className={updatedSaleCurrency === "USD" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedSaleCurrency('USD'); setIsSaleCurrencyOpen(false)}}>USD</span>
                                                                                        <span className={updatedSaleCurrency === "EUR" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setUpdatedSaleCurrency('EUR'); setIsSaleCurrencyOpen(false)}}>EUR</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                </>
                                                            ) : (
                                                                <>
                                                                <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                                    <div className="th">
                                                                        <label onClick={() => handleSorting("size")}>Size</label>
                                                                        <span className="link">
                                                                            {value[1].size ? value[1].size : "-"}
                                                                        </span>
                                                                    </div>
                                                                    <div className="th">
                                                                        <label onClick={() => handleSorting("vintage")}>Vintage</label>
                                                                        <span>{value[1].vintage ? value[1].vintage : "-"}</span>
                                                                    </div>
                                                                    <div className="th">
                                                                        <label onClick={() => handleSorting("price")}>Price</label>
                                                                        <span>{value[1].price ? value[1].price : "-"}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-td">
                                                                    <div className="mobile-table-td-row">
                                                                        <div className="td-list d-flex justify-content-between">
                                                                            <div className="td">
                                                                                <span onClick={() => handleSorting("wine_name")}><strong>{value[1].wine_name ? value[1].wine_name : "-"}</strong></span>
                                                                            </div>
                                                                            <div className="td">
                                                                                <div className="status-list">
                                                                                    <span onClick={() => handleSorting("sub_account")}><strong>{value[1].sub_account ? value[1].sub_account : "-"}</strong></span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-footer">
                                                                    <div className="shipping-option">
                                                                        <label onClick={() => handleSorting("buyer_ref")}>Buyer's Reference</label>
                                                                        <span>{value[1].buyer_ref ? value[1].buyer_ref : "-"}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-footer">
                                                                    <div className="shipping-option">
                                                                        <label onClick={() => handleSorting("supplier")}>Supplier</label>
                                                                        <span>{value[1].supplier ? value[1].supplier : "-"}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-footer">
                                                                    <div className="shipping-option">
                                                                        <label onClick={() => handleSorting("landin_date")}>Landing Date</label>
                                                                        <span>{value[1].landin_date ? value[1].landin_date : "-"}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-footer">
                                                                    <div className="shipping-option">
                                                                        <label onClick={() => handleSorting("authorize_to_sell")}>Price to Sale</label>
                                                                        <span>{value[1].price_to_sell ? value[1].price_to_sell : "-"}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-footer">
                                                                    <div className="shipping-option">
                                                                        <label onClick={() => handleSorting("authorize_to_sell")}>Authorize to Sale</label>
                                                                        <span>{value[1].authorize_to_sell ? value[1].authorize_to_sell : "-"}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="mobile-table-footer">
                                                                    <div className="shipping-option">
                                                                        <label onClick={() => handleSorting("sell_currency")}>Sale Currency</label>
                                                                        <span>{value[1].sell_currency ? value[1].sell_currency : "-"}</span>
                                                                    </div>
                                                                </div>
                                                                </>
                                                            )
                                                        }
                                        </div>
                                    </div>
                                )
                            }) : (
                                <div className="mobile-table-row text-center">
                                    No Inventory Available
                                </div>
                            )
                            
                        )
                    }
                    {
                        search ? (allInventoryList ? (allInventoryList.filter((data) => {
                        if( data[1].buyer_ref && data[1].buyer_ref.toLowerCase().includes(search.toLowerCase()) ||
                            data[1].wine_name && data[1].wine_name.toLowerCase().includes(search.toLowerCase())    
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

export default Inventory; 