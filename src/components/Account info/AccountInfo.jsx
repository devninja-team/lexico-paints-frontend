import React, {useState, useEffect} from 'react';
import {Link, NavLink, useHistory} from "react-router-dom";
import './Index.scss';
import SearchIcon from '../../assets/images/search-icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import SwitchIcon from '../../assets/images/switch-icon.svg';
import SessionModal from '../Modals/SessionModal';
import { setSession, setRoute, setSearch, fetchCustomer, setGlobalData } from '../../utils/Actions';
import Button from "react-bootstrap/Button";
import {statusList, leadsStatusList} from "../../utils/drop-down-list";
import Modal from 'react-bootstrap/Modal';
let id,counter=0;
const AccountInfo = () => {
    const route = useSelector(state => state.route);
    const fetch = useSelector(state => state.fetch);
    const query = useSelector(state => state.userRegion);
    const data = useSelector(state => state.data);
    const history = useHistory();
    const dispatch = useDispatch();

    const [showSearch,setshowSearch] = useState(false);
    const [customerDetails, setCustomerDetails] = useState();
    const [customerName, setCustomerName] = useState();
    const [customerEmail, setCustomerEmail] = useState();
    const [lastContact, setLastContact] = useState();
    const [lastPurchase, setLastPurchase] = useState();
    const [lastFollowUp, setLastFollowUp] = useState();
    const [lastInvoice, setLastInvoice] = useState();
    const [orderSearch, setOrderSearch] = useState();
    const [customerSearch, setCustomerSearch] = useState();
    const [customerType, setCustomerType] = useState();
    const [vendorInfo, setVendorInfo] = useState();
    const [allCustomerList, setAllCustomerList] = useState();
    const [allProspectList, setAllProspectList] = useState();
    const [allLeadList, setAllLeadList] = useState();
    const [allVendorList, setAllVendorList] = useState();
    const [allVendorProspectList, setAllVendorProspectList] = useState();

    const [nextPrevCounter, setNextPrevCounter] = useState(0);
    // dropdown vars
    const [isSourceOpen, setIsSourceOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [sourceDropDown, setSourceDropDown] = useState("-");
    const [statusDropDown, setStatusDropDown] = useState("Contacted");
    const [successStatus, setSuccessStatus] = useState("");
    const [successSource, setSuccessSource] = useState("");
    const [failureSource, setFailureSource] = useState("");
    const [failureStatus, setFailureStatus] = useState("");

     //modal vars
     const [sessionMessage, setSessionMessage] = useState("");
     const [isSessionModal, setIsSessionModal] = useState(false);
     const [convertModal, setConvertModal] = useState(false);
     const[error,setError] = useState('');
     const [success, setSuccess] = useState('');
     //next-prev 
     const [next, setNext] = useState();
     const [prev, setPrev] = useState();
     const [isNextDisabled, setIsNextDisabled] = useState(false);
     const [isPrevDisabled, setIsPrevDisabled] = useState(false);

    useEffect(() => {
        const localID = localStorage.getItem("customer_id");
        if(data && data.length>0) {
            data.map((value, index) => {
                if(value[0] === localID) {
                    setNextPrevCounter(index);
                    counter = index;
                }
            })
        }
    },[data]) 
    useEffect(() => {
        // const value = `${document.cookie}`;
        // const parts = value.split(';');
        // console.log("parts",value);
        // if(parts.length > 1) {
        //     parts.map((val,index)=>{
        //         if(val.split('=')[0] === ' customer_id' || val.split('=')[0] === 'customer_id') {
        //             id = val.split('=')[1]
        //         }
        //     })
        // }else {
        //     id = value.split('=')[1];
        // }
         if(localStorage.getItem('customer_id') && localStorage.getItem('customer_type')) {
            id=localStorage.getItem('customer_id');
            setCustomerType(localStorage.getItem('customer_type'));
            if(localStorage.getItem('customer_id') && (localStorage.getItem('customer_type')==="Customer" || localStorage.getItem('customer_type')==="Vendor")) {
                fetchInfo();
                if(localStorage.getItem('customer_type')==="Customer" && data==="") {
                    fetchAcccounts();
                } else if(localStorage.getItem('customer_type')==="Lead" && data==="") {
                    fetchLeads();
                } else if(localStorage.getItem('customer_type')==="Prospect" && data==="") {
                    fetchProspects();
                } else if(localStorage.getItem('customer_type')==="Vendor" && data==="") {
                    fetchVendors();
                } else if(localStorage.getItem('customer_type')==="Vendor-Prospect" && data==="") {
                    fetchVendorProspect();
                }
             }
             else {
                fetchLeadInfo();
                if(localStorage.getItem('customer_type')==="Customer" && data==="") {
                    fetchAcccounts();
                } else if(localStorage.getItem('customer_type')==="Lead" && data==="") {
                    fetchLeads();
                } else if(localStorage.getItem('customer_type')==="Prospect" && data==="") {
                    fetchProspects();
                } else if(localStorage.getItem('customer_type')==="Vendor" && data==="") {
                    fetchVendors();
                } else if(localStorage.getItem('customer_type')==="Vendor-Prospect" && data==="") {
                    fetchVendorProspect();
                }
             }
         }else {
             window.location.href='/';
        }   
    }, [fetch]);

    const fetchInfo = () => {
        axios.post('/accounts/accountinfo'+query,{
            customer_id:id
        }).then((res) => {
            console.log("accountinfo api response",res.data );
            // console.log("Customer details", res.data.customer_details)
            setCustomerDetails(res.data.customer_details);
            setVendorInfo(res.data.customer_details.vendor_info);
            setCustomerName(res.data.customer_name);
            setCustomerEmail(res.data.customer_email);
            setLastContact(res.data.last_contact);
            setLastPurchase(res.data.last_purchase);
            setLastFollowUp(res.data.last_followup);
            setLastInvoice(res.data.last_order);
            setVendorInfo(res.data.customer_details.vendor_info);
            // console.log("Prev",res.data.prev_customer_id);
            // console.log("Next",res.data.next_customer_id);
            // if(res.data.prev_customer_id==="0") {
            //     setIsPrevDisabled(true);
            // } else if(res.data.next_customer_id==="0") {
            //     setIsNextDisabled(true);
            // } else {
            //     setIsPrevDisabled(false);
            //     setIsNextDisabled(false);
            // }
            // setPrev(res.data.prev_customer_id);
            // setNext(res.data.next_customer_id);
            
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
            // console.log(res.data)
            setCustomerDetails(res.data.customer_details);
            setCustomerName(res.data.customer_name);
            setCustomerEmail(res.data.customer_email);
            setLastContact(res.data.last_contact);
            setLastPurchase(res.data.last_purchase);
            setLastFollowUp(res.data.last_followup);
            setLastInvoice(res.data.last_order);
            setVendorInfo(res.data.customer_details.vendor_info);
            setSourceDropDown(res.data.customer_details.customer_info.PROSPECT_SOURCE ? res.data.customer_details.customer_info.PROSPECT_SOURCE : sourceDropDown);
            setStatusDropDown(res.data.customer_details.customer_info.PROSPECT_STATUS ? res.data.customer_details.customer_info.PROSPECT_STATUS : "Not selected");
            // if(res.data.prev_customer_id==="0") {
            //     setIsPrevDisabled(true);
            // } else if(res.data.next_customer_id==="0") {
            //     setIsNextDisabled(true);
            // } else {
            //     setIsPrevDisabled(false);
            //     setIsNextDisabled(false);
            // }
            // setPrev(res.data.prev_customer_id);
            // setNext(res.data.next_customer_id);

        }).catch((error) => {
            console.log(error);
            const server_code = error.response.status;
            const server_message = error.response.statusText
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
    const fetchAcccounts = () => {
        axios.post('/accounts'+query).then((res) => {
            const {customers, most_recent_contact, most_recent_purchase, high_value_orders} = res.data;
            let arrayCustomerList = [];
            Object.entries(customers).map((value)=>{
                arrayCustomerList.push(value);
            })
            // console.log("customer main api",arrayCustomerList)
            setAllCustomerList(arrayCustomerList);
            dispatch(setGlobalData({data:arrayCustomerList}));

        })
        .catch((error) => {
            console.log(error);
        })
    }
    const fetchProspects = ()=> {
        axios
        .post("/accounts/prospect"+query).then((res) => {
            let arrayProspectList = [];
            if(res.data.prospect) {
                Object.entries(res.data.prospect).map((value)=>{
                    arrayProspectList.push(value);
                });

                setAllProspectList(arrayProspectList);
                dispatch(setGlobalData({data:arrayProspectList}));
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    const fetchLeads = () => {
        axios
        .post("/accounts/leads"+query).then((res) => {
            let arrayLeadList = [];
            if(res.data.leads) {
                Object.entries(res.data.leads).map((value)=>{
                    arrayLeadList.push(value);
                });

                setAllLeadList(arrayLeadList);
                dispatch(setGlobalData({data:arrayLeadList}))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    const fetchVendors = () => {
        axios
        .post("/accounts/vendors"+query,{
        }).then((res) => {
            let arrayVendorList = [];
            if(res.data.vendors) {
                Object.entries(res.data.vendors).map((value)=>{
                    arrayVendorList.push(value);
                });
                setAllVendorList(arrayVendorList);
                dispatch(setGlobalData({data:arrayVendorList}))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    const fetchVendorProspect = () => {
        axios
        .post("/accounts/prospect_vendor"+query,{
        }).then((res) => {;
            let arrayVendorList = [];
            if(res.data.vendors) {
                Object.entries(res.data.vendors).map((value)=>{
                    arrayVendorList.push(value);
                });

                setAllVendorProspectList(arrayVendorList);
                dispatch(setGlobalData({data: arrayVendorList}))
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    const handleSwitch = (path) => {
        dispatch(setRoute({route:path}))
        history.push(path);
    }
    const handleSearch = (value) => {
        setOrderSearch(value);
        dispatch(setSearch({search:value}));
    }
    const handleAccountInfo = (e) => {
        e.preventDefault();
        if(customerSearch) {
            localStorage.setItem('global_search',customerSearch);
            history.push('/global');
        }
    }
    const handleNextPrev = (type) => {
        if(type==="prev") {
            counter = nextPrevCounter-1;
            if(counter >= 0) {
                localStorage.setItem("customer_id",data[counter][0])
                setNextPrevCounter(counter);
            }
        } else {
            counter = nextPrevCounter+1;
            if(counter < data.length) {
                localStorage.setItem("customer_id",data[counter][0])
                setNextPrevCounter(counter);
            }
        }
        dispatch(fetchCustomer({fetch:!fetch}))
        // history.push("/accountinfo/")
    }
    const handleSource = (source) => {
        axios
        .post("/accounts/change"+query, {
            customer_id:localStorage.getItem("customer_id"),
            field:"source",
            value: source
        }).then((res) => {
            if(res.data.message === "prospect/customer updated"){
                setSuccessSource(res.data.message);
            } else {
                setFailureSource(res.data.message);
            }
        })
        .catch((error) => {
            console.log(error);
            // dispatch(setSession());
        })
    }
    const handleStatus = (status) => {
        axios
        .post("/accounts/change"+query, {
            customer_id:localStorage.getItem("customer_id"),
            field:"status",
            value: status
        }).then((res) => {
            if(res.data.message === "prospect/customer updated"){
                setSuccessStatus(res.data.message);
            } else {
                setFailureStatus(res.data.message);
            }
        })
        .catch((error) => {
            console.log(error);
            // dispatch(setSession());
        })
    }
    const handleSwitchCustomer = (type) => {
        setError('');
        if(type==="Lead") {
            axios.post('/accounts/lead2prospect'+query,{
                // customer_id:localStorage.getItem("customer_id"),
                customer_id: localStorage.getItem('customer_id'),
            }).then((res) => {
                // console.log("accountinfo api response",res.data);
                if(res.data.IS_CONVERTED === 1) {
                    setSuccess("Lead Converted to Prospect Successfully!");
                    setConvertModal(true);
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
            axios.post('/accounts/prospect2customer'+query,{
                // customer_id:localStorage.getItem("customer_id"),
                customer_id: localStorage.getItem('customer_id'),
            }).then((res) => {
                // console.log("accountinfo api response",res.data);
                if(res.data.IS_CONVERTED === 2) {
                    setSuccess("Prospect Converted to Customer Successfully!");
                    setConvertModal(true);
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
    return (
        <div className="account-info-head">
            <div className="account-head d-flex justify-content-between align-items-center flex-wrap">
                <div className="account-title-date-search d-flex align-items-center justify-content-between">
                    <div className="account-title mr-4">
                        <h4>{customerName ? customerName : "-"}</h4>
                        <span>{customerEmail ? customerEmail : "-"}</span>
                    </div>
                    <div>
                        <div className="account-date d-none d-lg-flex">
                            <div className="contact-purchase-date mr-3">
                                <span className="d-block">{lastContact ? lastContact : "-"}</span>
                                <label className="d-block">Last Contact</label>
                            </div>
                            <div className="contact-purchase-date">
                                <span className="d-block">{lastPurchase ? lastPurchase : "-"}</span>
                                <label className="d-block">Last Purchase</label>
                            </div>
                            <div className="contact-purchase-date ml-3">
                                <span className="d-block">{lastFollowUp ? lastFollowUp : "-"}</span>
                                <label className="d-block">Last Follow up</label>
                            </div>
                            {
                                (customerType==="Vendor" || customerType==="Vendor-Prospect") ? (
                                    <>
                                        <div className="contact-purchase-date ml-3">
                                            <span className="d-block">{lastInvoice ? lastInvoice : "-"}</span>
                                            <label className="d-block">Last Invoice</label>
                                        </div>
                                    </>
                                ):""
                            }
                        </div>
                        <div className="account-date d-none d-lg-flex mt-2">
                            {
                                (customerType==="Vendor" || customerType==="Vendor-Prospect") ? (
                                    <>
                                        {/* Vendor Ratings */}
                                        <div className="contact-purchase-date">
                                            <span className="d-block">{vendorInfo && vendorInfo.stock_quality ? vendorInfo.stock_quality : "-"}</span>
                                            <label className="d-block">Stock Quality</label>
                                        </div>
                                        <div className="contact-purchase-date ml-3">
                                            <span className="d-block">{vendorInfo && vendorInfo.shipping_rating ? vendorInfo.shipping_rating : "-"}</span>
                                            <label className="d-block">Shipping Rating</label>
                                        </div>
                                        <div className="contact-purchase-date ml-3">
                                            <span className="d-block">{vendorInfo && vendorInfo.inventory_rating ? vendorInfo.inventory_rating : "-"}</span>
                                            <label className="d-block">Inventory Rating</label>
                                        </div>
                                    </>
                                ):""
                            }
                        </div>
                    </div>
                    

                    <div className="account-search ml-4">
                        <div className={showSearch ? "search-input show" : "search-input show"} >
                            {
                                (route === "/accountinfo/orders" || route === "/accountinfo/inventory") ? (
                                    <>
                                        <input className="text-input" placeholder={route==="/accountinfo/orders" ? "Quick Find by ID, Name" : "Quick Find by Ref, Name"} type="text" 
                                            onChange = {(e) => handleSearch(e.target.value)}
                                            value = {orderSearch}/>
                                        <i className="search-icon"><img src={SearchIcon} alt="" onClick={()=>setshowSearch(!showSearch)}/></i>
                                    </>
                                ):(
                                    <>
                                        <form onSubmit={(e) => handleAccountInfo(e)}>
                                            <input className="text-input" placeholder="Search Customers" type="text" value={customerSearch?customerSearch:""} onChange={(e) => setCustomerSearch(e.target.value)}/>
                                            <button className="search-icon" type="submit"><img src={SearchIcon} alt="search-icon"/></button>
                                        </form>
                                    </>
                                )
                            }
                            
                        </div>
                    </div>
                </div>
                <div className="account-info-tabs d-flex justify-content-center">
                    <div className="account-tabs-row d-flex align-items-center">
                        <a className={route === "/accountinfo/communication" || route === "/accountinfo/communication/notes" || route === "/accountinfo/communication/calls" || route === "/accountinfo/communication/chats" ||
                        route === "/email-mob" || route === "/accountinfo/communication/emails" || route === "/accountinfo/communication/texts" ? "account-tab-list active":"account-tab-list"} onClick={() => {handleSwitch("/accountinfo/communication")}} >Communication</a>

                        {
                            customerType === "Customer" ?
                            (
                                <>
                                    <a className={route === "/accountinfo" ? "account-tab-list active":"account-tab-list"} onClick={() => {handleSwitch("/accountinfo")}}>Account</a>
                                    <a className={route === "/accountinfo/orders" ? "account-tab-list active":"account-tab-list" } onClick={() => {handleSwitch("/accountinfo/orders")}}>Orders</a>
                                </>
                            ):""
                        }
                        {
                            customerType === "Lead" ?
                            (
                                <>
                                    <a className={route === "/accountinfo" ? "account-tab-list active":"account-tab-list"} onClick={() => {handleSwitch("/accountinfo")}}>Account</a>
                                    <a className={route === "/accountinfo/orders" ? "account-tab-list active":"account-tab-list" } onClick={() => {handleSwitch("/accountinfo/orders")}}>Orders</a>
                                </>
                            ):""
                        }
                        {
                            customerType === "Prospect" ?
                            (
                                <>
                                    <a className={route === "/accountinfo" ? "account-tab-list active":"account-tab-list"} onClick={() => {handleSwitch("/accountinfo")}}>Account</a>
                                    <a className={route === "/accountinfo/orders" ? "account-tab-list active":"account-tab-list" } onClick={() => {handleSwitch("/accountinfo/orders")}}>Orders</a>
                                </>
                            ):""
                        }
                        {
                            (customerType === "Vendor" || customerType === "Vendor-Prospect") ?
                            (
                            <>
                                <a className={route === "/accountinfo" ? "account-tab-list active":"account-tab-list"} onClick={() => {handleSwitch("/accountinfo")}}>Account</a>
                                <a className={route === "/accountinfo/orders" ? "account-tab-list active":"account-tab-list" } onClick={() => {handleSwitch("/accountinfo/orders")}}>Orders</a>
                            </>
                            ):""
                        }
                        <a className={route === "/accountinfo/inventory" ? "account-tab-list active":"account-tab-list" } onClick={() => {handleSwitch("/accountinfo/inventory")}}>Inventory</a>
                        {
                            (customerType === "Prospect" || customerType === "Lead" || customerType==="Customer") ?
                            (
                            <>
                                <a className={route === "/accountinfo/cellar" ? "account-tab-list active":"account-tab-list"} onClick={() => {handleSwitch("/accountinfo/cellar")}}>Cellar</a>
                            </>
                            ):""
                        }
                    </div>
                </div>
                <div className="w-100 d-flex justify-content-end bottom-next-prev-btn mt-2">
                {
                            (customerType === "Lead" || customerType === "Prospect") ? 
                            (   
                                <div className="content-detail-list">
                                    <label className="source-label">
                                        {sourceDropDown}
                                    </label>
                                    <span className="dropUp-error error-succes d-block">{successSource}</span>
                                    <span className="dropUp-error error-failure d-block">{failureSource}</span>
                                    {
                                        customerType=== "Lead" ? (<label>Lead Source</label>):""
                                    }
                                    {
                                        customerType=== "Prospect" ? (<label>Prospect Source</label>):""
                                    }
                                    
                                </div>
                            ) : ""
                        }
                        {
                            (customerType === "Lead" || customerType === "Prospect") ? 
                            (   
                                <div className="content-detail-list ml-3">
                                    <span>
                                    <div className="dropUp">
                                                <div className="custom-select-wrapper d-flex align-items-center">
                                                    <div className={isStatusOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                        <div className="custom-select__trigger" onClick={()=>setIsStatusOpen(!isStatusOpen)}><span>{statusDropDown}</span>
                                                            <div className="arrow">
                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        {
                                                            customerType==="Prospect" ? (
                                                                <div className="custom-options">
                                                            {
                                                                statusList && statusList.length>0 ? (
                                                                    statusList.map((value, index) => {
                                                                        return(
                                                                            <span key={index} className={statusDropDown === value ? "custom-option selected":"custom-option"} onClick={() => { setStatusDropDown(value); setFailureSource(""); setSuccessSource(""); setFailureStatus(""); setSuccessStatus("");setIsStatusOpen(false);handleStatus(value)}}>{value}</span>
                                                                        )
                                                                    })
                                                                ) : ""
                                                            }
                                                        </div>
                                                            ) : (
                                                                <div className="custom-options">
                                                            {
                                                                leadsStatusList && leadsStatusList.length>0 ? (
                                                                    leadsStatusList.map((value, index) => {
                                                                        return(
                                                                            <span key={index} className={statusDropDown === value ? "custom-option selected":"custom-option"} onClick={() => { setStatusDropDown(value); setFailureSource(""); setSuccessSource(""); setFailureStatus(""); setSuccessStatus("");setIsStatusOpen(false);handleStatus(value)}}>{value}</span>
                                                                        )
                                                                    })
                                                                ) : ""
                                                            }
                                                        </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                    </span>
                                    <span className="dropUp-error error-succes d-flex">{successStatus}</span>
                                    <span className="dropUp-error error-failure d-flex">{failureStatus}</span>
                                    {
                                        customerType=== "Lead" ? (<label>Lead Status</label>):""
                                    }
                                    {
                                        customerType=== "Prospect" ? (<label>Prospect Status</label>):""
                                    }
                                </div>
                            ) : ""
                        }
                    <div className="d-flex">
                        {
                            customerType === "Lead" ? ( //change to Lead
                                <div className="edit">
                                    <Button variant="link" onClick={()=>handleSwitchCustomer("Lead")}><i><img src={SwitchIcon} height="12" width="12" alt="switch-icon"/></i>Convert to Prospect</Button>
                                </div>
                            ):""
                        }
                        {/* {
                            customerType === "Prospect" ? (
                                <div className="edit">
                                    <Button variant="link" onClick={()=>handleSwitchCustomer("Prospect")}><i><img src={SwitchIcon} height="12" width="12" alt="switch-icon"/></i>Convert to Account</Button>
                                </div>
                            ):""
                        } */}
                    </div>
                </div>
                {/* <div className="w-100 d-flex justify-content-end bottom-next-prev-btn">
                    <Button className="btn-save" onClick={() => handleNextPrev('prev')} disabled={counter<=0}>
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 490.661 490.661">
                        <g>
                            <g>
                                <path d="M453.331,1.424c-3.307-1.899-7.381-1.899-10.688,0L37.309,236.091c-3.285,1.92-5.312,5.44-5.312,9.237
                                    s2.027,7.317,5.312,9.237l405.333,234.667c1.664,0.96,3.499,1.429,5.355,1.429c1.835,0,3.691-0.469,5.333-1.429
                                    c3.285-1.899,5.333-5.419,5.333-9.237V10.661C458.664,6.843,456.616,3.323,453.331,1.424z"/>
                            </g>
                        </g>
                        </svg>
                    </Button>
                    <Button className="btn-save ml-2" onClick={() => handleNextPrev('next')} disabled={counter>=data.length-1}>
                        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmln="http://www.w3.org/1999/xlink" x="0px" y="0px"
                        viewBox="0 0 490.661 490.661">
                        <g>
                            <g>
                                <path d="M453.352,236.091L48.019,1.424c-3.285-1.899-7.36-1.899-10.688,0c-3.285,1.899-5.333,5.419-5.333,9.237v469.333
                                    c0,3.819,2.048,7.339,5.333,9.237c1.643,0.939,3.499,1.429,5.333,1.429c1.856,0,3.691-0.469,5.355-1.429l405.333-234.667
                                    c3.285-1.92,5.312-5.44,5.312-9.237S456.637,237.989,453.352,236.091z"/>
                            </g>
                        </g>
                        </svg>
                    </Button>
                </div> */}
            </div>
            <Modal show={convertModal}
                onHide={() => setConvertModal(false)} className="custom-modal user-updated-modal">
                <Modal.Header closeButton>
                    <Modal.Title>EDIT CUSTOMER DETAILS</Modal.Title>
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
                    <Button type="button" onClick = {() => setConvertModal(false)}className="save-btn">OK</Button>
                </Modal.Footer>
            </Modal>
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage}/>
        </div>
    );
};

export default AccountInfo;