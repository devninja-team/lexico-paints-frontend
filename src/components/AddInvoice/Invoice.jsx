import React, { useState, useEffect } from "react";
// import {
//     NavLink
// } from "react-router-dom";
// import {useSelector} from "react-redux";
// import Container from 'react-bootstrap/Container';
// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
import './index.scss';
import Modal from 'react-bootstrap/Modal';
// import logo from '../../images/westgarth-logo.png';
// import closeIcon from '../../images/close-icon.svg';
import {connect} from "react-redux";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from 'react-redux';
import {logout, setInvoiceData, setSession} from "../../utils/Actions";
import SessionModal from '../Modals/SessionModal';
import axios from 'axios';
import closeButton from '../../assets/images/cancel.png'
import { useHistory} from "react-router-dom";
import {sizeList} from "../../utils/drop-down-list";
// import LeadsModal from "../Modals/LeadsModal";
// import AddNote from "../Modals/AddNote";
// import { Button } from "react-bootstrap";

    
const Invoice = () => {
    // const [showModal, setShowModal] = useState(false);
    // const whoami = useSelector(state => state.whoami);
    const query = useSelector(state => state.userRegion);
    const invoiceData = useSelector(state => state.invoiceData);
    const history = useHistory();
    const [isPayStatusOpen, setIsPayStatusOpen] = useState(false);
    const [payStatus, setPayStatus] = useState('Paid');

    const [isWineOpen, setIsWineOpen] = useState(false);
    const [wine, setWine] = useState('');
    const [wineError, setWineError] = useState("");

    const [isVintageOpen, setIsVintageOpen] = useState(false);
    const [vintage, setVintage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    const [wineDropDownList, setWineDropDownList] = useState();
    const [orderType, setOrderType] = useState("INVOICE");
    const [isOrderTypeOpen, setIsOrderTypeOpen] = useState();
    const [showTariffSection,setShowtariffSection] = useState(false);
    const [customShippingCost, setCustomShippingCost] = useState();
    const [invoiceID, setInvoiceID] = useState();

    const [search, setSearch] = useState('');
    const [counter, setCounter] = useState(0);
    const [size, setSize] = useState();
    const [price, setPrice] = useState();
    const [qty, setQty] = useState();
    const [note, setNote] = useState();
    const [includeTariff, setIncludeTariff] = useState(false);
    const [tariffAmount, setTariffAmount] = useState();

    const [isShopify, setIsShopify] = useState(false);
    const [orderDate, setOrderDate] = useState(new Date().toISOString().slice(0, 10));
    const [shippingCost, setShippingCost] = useState("0");
    const [shippingOption, setShippingOption] = useState("");
    const [discount, setDiscount] = useState("0");
    const [showTariff, setShowTariff] = useState(false);
    const [notes, setNotes] = useState("");
    const [itemError, setItemError] = useState();
    const [showShippingCostSection, setShowShippingCostSection] = useState(false);
    const [shippingInfoDropDownList,setShippingInfoDropDownList] = useState();
    const [isShippingDropDownOpen, setIsShippingDropDownOpen] = useState(false);
    const [shippingDropDownValue, setShippingDropDownvalue] = useState("");

    const [invoiceList, setInvoiceList] = useState([]);
    const [isSizeOpen, setIsSizeOpen] = useState();
    const [isWareHouseOpen, setIsWareHouseOpen] = useState();
    const [ shippingDropDownError, setShippingDropDownError] = useState(false);
    const [ wareHouse, setWareHouse] = useState("LCB");

    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const dispatch = useDispatch();
    useEffect(() => {
        if(invoiceData) {
            setOrderType("PO")
            // console.log("invoice data", invoiceData)
            setInvoiceID(invoiceData.order_id ? invoiceData.order_id: "")
            setInvoiceList([...invoiceList,{
                match_lwin18:invoiceData.lwin18,
                lwin7:"",
                wine:invoiceData.product?invoiceData.product.split("<br>")[0]:"",
                vintage:invoiceData.product?invoiceData.product.split("<br>")[1].split(",")[0]:"",
                size:invoiceData.product?invoiceData.product.split("<br>")[1].split(",")[1].trim():"",
                price:invoiceData.vendor_price?invoiceData.vendor_price.replace("$","").replace(/,\s?/g, ""):"1",
                qty:invoiceData.unmatched_qty?invoiceData.unmatched_qty:"",
                is_tariff:"0"
            }]);
            setWineDropDownList([{
                lwin7: "",
                match_lwin18: invoiceData.lwin18?invoiceData.lwin18:"",
                name: invoiceData.product?invoiceData.product.split("<br>")[0]:"",
                price: invoiceData.vendor_price?invoiceData.vendor_price.replace("$","").replace(/,\s?/g, ""):"1",
                size:invoiceData.product?invoiceData.product.split("<br>")[1].split(",")[1].trim():"",
                sku: null,
                vintage:invoiceData.product?invoiceData.product.split("<br>")[1].split(",")[0]:"",
                qty:invoiceData.unmatched_qty?invoiceData.unmatched_qty:""
            }]);
        }
    },[invoiceData])
    useEffect(() => {
        setShowShippingCostSection(false);
        setShowtariffSection(false);
    }, [isOrderTypeOpen, orderDate, payStatus, shippingCost, shippingOption, discount, notes, isWineOpen, isVintageOpen, isSizeOpen,
    price, qty])
    useEffect(() => {
        if(!localStorage.getItem("customer_id")) {
            history.push("/customermain")
        } 
    },[])

    const searchWines = () => {
        if(search) {
            axios
            .post("/accounts/search_wine"+query,{
                query:search,
                is_shopify: isShopify
            }).then((res) => {
                // console.log("search wine api",res.data);
                // let arrayDropDownList = [];
                if(res.data){
                    setWineDropDownList(res.data);
                }else {
                    setWineError("No Wine Found!");
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
    const handleAddBtn = () => {
        setInvoiceList([...invoiceList,{
            lwin7:"",
            wine:"",
            vintage:"",
            size:"",
            price:"",
            qty:"",
            is_tariff:"0",
            match_lwin18:""
        }])
    }
    const handleCreateInvoice = (e) => {
        // console.log("invoice list", invoiceList)
        e.preventDefault();
        let checkvalidation = invoiceList.filter((value, index) => {
            if(value.size==="" || value.wine==="" || value.vintage==="") {
                return value;
            }
        });
        if(checkvalidation.length > 0) {
            setItemError("Please select required fields");
        }else {
            setItemError("");
            setShowTariff(true);
        }
        //call create order api here

        if(isShopify) {
            if(shippingDropDownValue || customShippingCost) {
                if(invoiceList.length>0) {
                    axios
                    .post("/accounts/create_order"+query,{
                        is_shopify: isShopify ? "1" : "0",
                        customer_id: localStorage.getItem("customer_id"),
                        order_date: orderDate,
                        shipping_cost: shippingCost,
                        shipping_option: shippingOption,
                        discount: discount,
                        type: orderType,
                        pay_status: payStatus,
                        notes: notes,
                        items: invoiceList,
                        tariff_cost: includeTariff ? tariffAmount : "0",
                        shipping_cost_custom: customShippingCost ? `Custom ($${customShippingCost})` : shippingDropDownValue,
                        invoice_no: invoiceID,
                        ware_house: wareHouse
                    }).then((res) => {
                        if(res.data.message==="shopify draft order created!") {
                            setSuccess("Shopify draft order created!");
                            setError("");
                            setSuccessModal(true);
                        } else {
                            setError(res.data.message);
                            setSuccess("");
                            setSuccessModal(true);
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
            } else if(showShippingCostSection){
                setShippingDropDownError("Please select shipping service/cost");
            }
        }else {
            axios
            .post("/accounts/create_order"+query,{
                is_shopify: isShopify ? "1" : "0",
                customer_id: localStorage.getItem("customer_id"),
                order_date: orderDate,
                shipping_cost: shippingCost,
                shipping_option: shippingOption,
                discount: discount,
                type: orderType,
                pay_status: payStatus,
                notes: notes,
                items: invoiceList,
                invoice_no: invoiceID,
                ware_house: wareHouse
            }).then((res) => {
                if(res.data.message==="order created") {
                    setSuccess("Order created successfully");
                    setError("");
                    setSuccessModal(true);
                } else {
                    setError(res.data.message);
                    setSuccess("");
                    setSuccessModal(true);
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
    const handleAddInvoice = (index) => {
        invoiceList.splice(index,1);
        setInvoiceList([...invoiceList]);
    }
    const handleAutomaticFill = (id, index) => {
        let pushData;
        if(wineDropDownList.length>0) {
            wineDropDownList.map((value) => {
                if(value.lwin7 === id) {
                    pushData = value;
                }
            });
            invoiceList.map((value,index_list) => {
                if(index===index_list) {
                    value.price = pushData.price?pushData.price:"1";
                    value.vintage = pushData.vintage?pushData.vintage:"";
                    value.size = pushData.size?pushData.size:"";
                    value.qty = "1";
                    value.sku = pushData.sku?pushData.sku:"";
                }
            });
        } 
    }
    const handleCheckTariffBtn = () => {
        axios
        .post("/accounts/get_tariff"+query,{
            is_shopify: isShopify ? "1" : "0",
            customer_id: localStorage.getItem("customer_id"),
            order_date: orderDate,
            shipping_cost: shippingCost,
            shipping_option: shippingOption,
            discount: discount,
            type: orderType,
            pay_status: payStatus,
            notes: notes,
            items: invoiceList,
        }).then((res) => {
            if(res.data.tariff_amount) {
                setShowtariffSection(true);
                setTariffAmount(res.data.tariff_amount);
            }
        })
        .catch((error) => {
            console.log(error);
            // dispatch(setSession());
            // const server_code = error.response.status;
            // const server_message = error.response.statusText;
            // if(server_code===500 || server_code===400 || server_code===404) {
            //     setSessionMessage(server_message);
            //     setIsSessionModal(true);
            // }
            // else if(server_code === 401 && server_message==="Unauthorized4.") {
            //     setSessionMessage(server_message);
            //     setIsSessionModal(true);
            // }
            // else {
            //     setSessionMessage("Your session has been expired!");
            //     setIsSessionModal(true);
            // }
        })
    }
    const handleCheckShippingCostBtn = () => {
        axios
        .post("/accounts/get_shipping"+query,{
            is_shopify: isShopify ? "1" : "0",
            customer_id: localStorage.getItem("customer_id"),
            order_date: orderDate,
            shipping_cost: shippingCost,
            shipping_option: shippingOption,
            discount: discount,
            type: orderType,
            pay_status: payStatus,
            notes: notes,
            items: invoiceList
        }).then((res) => {
            if(res.data.rates) {
                setShowShippingCostSection(true);
                setShippingInfoDropDownList(res.data.rates);
            }
        })
        .catch((error) => {
            console.log(error);
            // dispatch(setSession());
            // const server_code = error.response.status;
            // const server_message = error.response.statusText;
            // if(server_code===500 || server_code===400 || server_code===404) {
            //     setSessionMessage(server_message);
            //     setIsSessionModal(true);
            // }
            // else if(server_code === 401 && server_message==="Unauthorized4.") {
            //     setSessionMessage(server_message);
            //     setIsSessionModal(true);
            // }
            // else {
            //     setSessionMessage("Your session has been expired!");
            //     setIsSessionModal(true);
            // }
        })
    }
    return (
    <>
    {/* static form section */}
    <div className="create-invoice-wrapper">
        <div className="create-invoice-head mt-2 mb-4 d-flex justify-content-between">
            <h5>Create Order Details</h5>
            <Button className="create-wine-submit-btn" onClick={() => history.goBack()}>Go back</Button>
        </div>
        <div className="create-invoice-form mb-3">
            <form onSubmit={(e)=>handleCreateInvoice(e)}>
                <div className="invoice-order-details">
                    <div className="invoice-order-details-row d-flex flex-wrap">
                    <div className="invoice-order-details-list">
                            <label>Order Type</label>
                            <div className="dropUp">
                                <div className="custom-select-wrapper d-flex align-items-center">
                                    <div className={isOrderTypeOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                        <div className="custom-select__trigger" onClick={()=>setIsOrderTypeOpen(!isOrderTypeOpen)}>
                                            {orderType === "INVOICE" ? "Invoice" : "Purchase Order"}
                                            <div className="arrow">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="custom-options">
                                            <span className={orderType === "INVOICE" ? "custom-option selected":"custom-option"} onClick={() => { setOrderType('INVOICE'); setIsOrderTypeOpen(false);}}>Invoice</span>
                                            <span className={orderType === "PO"? "custom-option selected":"custom-option"} onClick={() => {setOrderType('PO'); setIsOrderTypeOpen(false); setIsShopify(false)}}>Purchase Order</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {
                            isShopify ? "" : (
                                <div className="invoice-order-details-list">
                                    <label>Order date</label>
                                    <input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)}required></input>
                                </div>
                            )
                        }
                        {
                            orderType === "INVOICE" ? (
                                <div className="invoice-order-details-list d-flex flex-column">
                                    <label>Shopify Order</label>
                                    <input className="w-auto" type="checkbox" checked={isShopify} onChange={(e) => {setIsShopify(e.target.checked); setSearch("");setShowTariff(false); setInvoiceList([]); setWineDropDownList([])} }></input>
                                </div>
                            ) :""
                        }
                        {
                            isShopify ? "" : (
                                <div className="invoice-order-details-list">
                                    <label>Pay status</label>
                                    <div className="dropUp">
                                        <div className="custom-select-wrapper d-flex align-items-center">
                                            <div className={isPayStatusOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                <div className="custom-select__trigger" onClick={()=>setIsPayStatusOpen(!isPayStatusOpen)}>
                                                    {payStatus}
                                                    <div className="arrow">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="custom-options">
                                                    <span className={payStatus === "Paid" ? "custom-option selected":"custom-option"} onClick={() => { setPayStatus('Paid'); setIsPayStatusOpen(false)}}>Paid</span>
                                                    <span className={payStatus === "Unpaid"? "custom-option selected":"custom-option"} onClick={() => {setPayStatus('Unpaid'); setIsPayStatusOpen(false)}}>Unpaid</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        } 
                        {
                            orderType === "INVOICE" ? "" : (
                                <div className="invoice-order-details-list">
                                    <label>Warehouse</label>
                                    <div className="dropUp">
                                        <div className="custom-select-wrapper d-flex align-items-center">
                                            <div className={isWareHouseOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                <div className="custom-select__trigger" onClick={()=>setIsWareHouseOpen(!isWareHouseOpen)}>
                                                    {wareHouse}
                                                    <div className="arrow">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="custom-options">
                                                    <span className={wareHouse === "LCB" ? "custom-option selected":"custom-option"} onClick={() => { setWareHouse('LCB'); setIsWareHouseOpen(false)}}>LCB</span>
                                                    <span className={wareHouse === "Seabrooks"? "custom-option selected":"custom-option"} onClick={() => {setWareHouse('Seabrooks'); setIsWareHouseOpen(false)}}>Seabrooks</span>
                                                    <span className={wareHouse === "Other"? "custom-option selected":"custom-option"} onClick={() => {setWareHouse('Other'); setIsWareHouseOpen(false)}}>Other</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        } 
                        {
                            isShopify ? "" : (
                                <div className="invoice-order-details-list">
                                    <label>Shipping cost</label>
                                    <input type="text" value={shippingCost} onChange={(e) => setShippingCost(e.target.value)} required></input>
                                </div>
                            )
                        }
                        {
                            isShopify ? "" : (
                                <div className="invoice-order-details-list">
                                    <label>Shipping Option</label>
                                    <input type="text" value={shippingOption} onChange={(e) => setShippingOption(e.target.value)} required></input>
                                </div>
                            )
                        }
                        <div className="invoice-order-details-list">
                            <label>Discount</label>
                            <input type="text" value={discount} onChange={(e) => setDiscount(e.target.value)} required></input>
                        </div>
                        <div className="invoice-order-details-list">
                            <label>Notes</label>
                            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} required></input>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div className="create-invoice-form mb-3">
            <form onSubmit={(e)=>handleCreateInvoice(e)}>
            <div className="create-wine-details">
                    {/* Dynamic form section */}
                    <div className="create-wine-details-head mb-3">
                        <h5>Wine Details</h5>
                    </div>
                    {
                        invoiceList.map((valueInvoice, index)=> {
                            return (
                                <div key={index} className="create-wine-details-form">
                                    <div className="d-flex justify-content-end close-wine-detail">
                                        <Button className="cross-btn mb-3" onClick={() => handleAddInvoice(index)}>
                                            <img src={closeButton} alt="close-btn"></img>
                                        </Button>
                                    </div>
                                    <div className="create-wine-details-row d-flex flex-wrap">
                                        <div className="create-wine-details-list search-list">
                                            <input type="text" value={search} placeholder="search wines" onChange={(e) => {setSearch(e.target.value); setWineError(""); setWineDropDownList([])}}></input>
                                            <Button onClick={() => searchWines()} disabled={!search}>Search</Button>
                                        </div>
                                        <div className="wine-detail-bottom-right d-flex justify-content-end">
                                            <div className="error-wine">
                                                {wineError?wineError:""}
                                            </div>
                                            <div className="wine-detail-right d-flex flex-wrap flex-lg-nowrap">
                                                {
                                                    wineDropDownList && wineDropDownList.length>0 ? 
                                                    (
                                                        <div className="create-wine-details-list wine-list d-flex align-items-center mr-lg-4">
                                                            <label className="mr-2">Wine List</label>
                                                            <div className="dropUp">
                                                                <div className="custom-select-wrapper d-flex align-items-center">
                                                                    <div className={isWineOpen && (currentIndex===index) ? "custom-selectDrop open":"custom-selectDrop "}>
                                                                        <div className="custom-select__trigger" onClick={()=>{setIsWineOpen(!isWineOpen);setCurrentIndex(index)}}>
                                                                            {valueInvoice.wine ? valueInvoice.wine : "Select Wine"}
                                                                            <div className="arrow">
                                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                        <div className="custom-options">
                                                                            {
                                                                                wineDropDownList.map((val, index_list) => {
                                                                                    return (
                                                                                        <span key={index_list} className={valueInvoice.wine === val.name ? "custom-option selected":"custom-option"} onClick={() => {valueInvoice.wine=val.name;valueInvoice.lwin7=val.lwin7; handleAutomaticFill(val.lwin7, index);setIsWineOpen(false)}}>{val.name}</span>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : ""
                                                }
                                                <div className="create-wine-details-list size-wine-list d-flex align-items-center pr-sm-3 pr-lg-4">
                                                    <label className="mr-2">Vintage</label>
                                                    <div className="dropUp">
                                                        <div className="custom-select-wrapper d-flex align-items-center">
                                                            <div className={(isVintageOpen && (currentIndex===index))? "custom-selectDrop open":"custom-selectDrop "}>
                                                                <div className="custom-select__trigger" onClick={()=>{setIsVintageOpen(!isVintageOpen);setCurrentIndex(index)}}>
                                                                    {valueInvoice.vintage ? valueInvoice.vintage : "Select Vintage"}
                                                                    <div className="arrow">
                                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                                <div className="custom-options">
                                                                    {
                                                                        Array(2020 - 1800 + 1).fill().map((val, index) => {
                                                                            return (
                                                                                <span key={index} className={valueInvoice.vintage == 1800+index ? "custom-option selected":"custom-option"} onClick={() => {valueInvoice.vintage = (1800+index).toString(); setVintage(1800+index); setIsVintageOpen(false)}}>{1800+index}</span>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="create-wine-details-list size-wine-list d-flex align-items-center pr-lg-4">
                                                    <label className="mr-2">Size</label>
                                                    <div className="dropUp">
                                                        <div className="custom-select-wrapper d-flex align-items-center">
                                                            <div className={(isSizeOpen && (currentIndex===index))? "custom-selectDrop open":"custom-selectDrop "}>
                                                                <div className="custom-select__trigger" onClick={()=>{setIsSizeOpen(!isSizeOpen);setCurrentIndex(index)}}>
                                                                    {valueInvoice.size ? valueInvoice.size : "Select Size"}
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
                                                                                <span key={index} className={valueInvoice.size == val ? "custom-option selected":"custom-option"} onClick={() => {valueInvoice.size = val; setSize(val); setIsSizeOpen(false)}}>{val}</span>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <input type="text" value={valueInvoice.size ? valueInvoice.size : size} onBlur={() => valueInvoice.size=size} onFocus={()=>valueInvoice.size=""} onChange={(e)=>setSize(e.target.value)} required></input> */}
                                                </div>
                                                <div className="create-wine-details-list qty-wine-list d-flex align-items-center pr-sm-3 pr-lg-0 mr-lg-4">
                                                    <label className="mr-2">Price</label>
                                                    <input type="number" min="1" value={valueInvoice.price ? valueInvoice.price : price} onBlur={() => {valueInvoice.price=price;}} onFocus={()=>valueInvoice.price=""} onChange={(e)=>setPrice(e.target.value)} required></input>
                                                </div>
                                                <div className="create-wine-details-list qty-wine-list d-flex align-items-center">
                                                    <label className="mr-2">Qty</label>
                                                    <input type="number" min="1" value={valueInvoice.qty ? valueInvoice.qty : qty} onBlur={() => valueInvoice.qty=qty} onFocus={()=>valueInvoice.qty=""} onChange={(e)=>setQty(e.target.value)} required></input>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })            
                    }

                    <div className="create-wine-submit-btn">
                        <Button onClick={() => {setShowTariff(false); handleAddBtn()}}>Add item</Button>
                        {
                            invoiceList.length>0 ? 
                            <>
                                {/* <div>
                                    <label>Note</label>
                                    <textarea rows="5" cols="50" type="text" value={note} onChange={(e)=>setNote(e.target.value)} required></textarea>
                                </div> */}
                                {
                                    isShopify ?  (
                                        <>
                                            {
                                                shippingDropDownValue ?  (
                                                    <input type="submit" value={"Create Order"} disabled={invoiceList.length===0}></input>
                                                ) : (
                                                    <input type="submit" value={"Continue"} disabled={invoiceList.length===0}></input>
                                                )
                                            }
                                            {shippingDropDownError?<label className="error-wine mt-2">{shippingDropDownError}</label>:""}
                                            {itemError?<label className="error-wine mt-2">{itemError}</label>:""}
                                        </>
                                    ): (
                                        <>
                                            <input type="submit" value="Create Order" disabled={invoiceList.length===0}></input>
                                        </>
                                    )
                                }
                            </>:""
                        }
                    </div>                    
                </div>
                
            </form>
        </div>
        {
            (showTariff && isShopify) ? (
                <div className="create-invoice-form">
                    <div className="create-wine-details">
                        {/* Dynamic form section */}
                        <div className="create-wine-details-head mb-3">
                            <h5>{"Shipping & Tariff"}</h5>
                        </div>       
                        <div className="create-invoice-form-block">
                            <div className="create-invoice-form-btn d-flex justify-content-center">
                            <Button onClick={() => handleCheckTariffBtn()}>Check Tariff</Button>
                            <Button onClick={() => handleCheckShippingCostBtn()}>Check Shipping Cost</Button>
                            </div>
                            <div className="create-invoice-content mt-3 d-flex">
                                <div className="create-invoice-content-list">
                                {
                                    showTariffSection ? (
                                        <>
                                            <div className="tariff-input mb-3">
                                                <input type="number" min="1" value={tariffAmount} onChange={(e) => setTariffAmount(e.target.value)}></input>
                                            </div>
                                            <div className="tariff-checkbox d-flex align-items-center">
                                                <input type="checkbox" checked={includeTariff} onChange={(e) => setIncludeTariff(e.target.checked)} ></input>
                                                <label>Include Tariff</label>
                                            </div>
                                        </>
                                    ) : ""
                                }
                                </div>
                                <div className="create-invoice-content-list">
                                    {
                                    showShippingCostSection ? (
                                        <>
                                        <div className="dropUp mb-3">
                                        <div className="custom-select-wrapper d-flex align-items-center">
                                            <div className={isShippingDropDownOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                <div className="custom-select__trigger" onClick={()=>setIsShippingDropDownOpen(!isShippingDropDownOpen)}>
                                                    {shippingDropDownValue?shippingDropDownValue:"select shipping"}
                                                    <div className="arrow">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="custom-options">
                                                    {
                                                        shippingInfoDropDownList && shippingInfoDropDownList.length>0 ? (
                                                            shippingInfoDropDownList.map((value, index) => {
                                                                return (
                                                                <span className={shippingDropDownValue === `${value.service_name} ($${value.total_price})` ? "custom-option selected":"custom-option"} 
                                                                    onClick={() => { setShippingDropDownvalue(`${value.service_name} ($${value.total_price})`); setCustomShippingCost(""); setIsShippingDropDownOpen(false); setShippingDropDownError("");}}>
                                                                        {`${value.service_name} ($${value.total_price})`}
                                                                </span>
                                                                )
                                                            })
                                                        ) : ""
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tariff-input">
                                        <input type="number"  min="1" value={customShippingCost} placeholder="Enter custom shipping cost" onChange={(e) => setCustomShippingCost(e.target.value)}></input>
                                    </div>
                                        </>
                                    ) : ""
                                }
                                </div>
                            </div>
                        </div>          
                    </div>
                </div>
            ) : ""
        }
    </div>
        <Modal show={successModal}
            onHide={() => setSuccessModal(false)} className="custom-modal user-updated-modal">
            <Modal.Header closeButton>
                <Modal.Title>ORDER DETAILS</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="change-address-body">
                    <div className="change-address-wrapper">
                        <div className="change-address-list d-flex align-items-center street-filed">
                            <label></label>
                            <span className="error-text">{error}</span>
                            <span className="success-text">{success}</span>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button type="button" onClick = {() => {setSuccessModal(false); history.push("/accountinfo/orders")}}className="save-btn">OK</Button>
            </Modal.Footer>
        </Modal>
        <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage} />
    </>
    )
};

export default connect(null,{logout})(Invoice);
