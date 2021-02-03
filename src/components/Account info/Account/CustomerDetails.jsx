import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import EditIcon from '../../../assets/images/edit-icon.svg';
import SwitchIcon from '../../../assets/images/switch-icon.svg';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchCustomer, setSession } from '../../../utils/Actions/';
import SessionModal from '../../Modals/SessionModal';
import {phoneCodeList} from "../../../utils/drop-down-list";
import {timeZoneList} from "../../../utils/drop-down-list";

const CustomerDetails = (props) => {
    
    const dispatch = useDispatch();
    const fetch = useSelector(state => state.fetch);
    const query = useSelector(state => state.userRegion);
    const [customerDetails, setCustomerDetails] = useState();
    const [customerType, setCustomerType] = useState();
    //modal vars
    const[error,setError] = useState('');
    const [success, setSuccess] = useState('');
    const[infoModal,setInfoModal] = useState(false);
    const [successSource, setSuccessSource] = useState();
    const [failureSource, setFailureSource] = useState();
    const [successStatus, setSuccessStatus] = useState();
    const [failureStatus, setFailureStatus] = useState();

    //customer edit info modal vars
    const [customerFname, setCustomerFname] = useState("");
    const [customerLname, setCustomerLname] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [customerAlternatePhone, setCustomerAlternatePhone] = useState("");
    const [customerAlternateEmail, setCustomerAlternateEmail] = useState("");
    const [customerFulfillDestination, setCustomerFulfillDestination] = useState("");
    const [customerStorageAccount, setCustomerStorageAccount] = useState("");
    const [customerAccountNumber, setCustomerAccountNumber] = useState();
    const [customerZohoId, setCustomerZohoId] = useState("");

    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const [convertModal, setConvertModal] = useState(false);

    //dropdown vars
    const [phoneCode, setPhoneCode] = useState("+44");
    const [isPhoneCodeOpen, setIsPhoneCodeOpen] = useState(false);
    const [alternatePhoneCode, setAlternatePhoneCode] = useState("+44");
    const [isAlternatePhoneCodeOpen, setIsAlternatePhoneCodeOpen] = useState(false);
    const [timeZone, setTimeZone] = useState("GMT");
    const [isTimeZoneOpen, setIsTimeZoneOpen] = useState(false);
    const [isSourceOpen, setIsSourceOpen] = useState(false);
    const [sourceDropDown, setSourceDropDown] = useState("Hot Leads");
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [statusDropDown, setStatusDropDown] = useState("Contacted");
    const [accountDropDown, setAccountDropDown] = useState("Retail");
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [ownerDropDown, setOwnerDropDown] = useState("");
    const [isOwnerOpen, setIsOwnerOpen] = useState(false);
    const [destinationDropDownValue, setDestinationDropDownValue] = useState("");
    const [fullFillDestinationList, setFullFillDestinationList] = useState();
    const [isDestinationOpen, setIsDestinationOpen] = useState(false);
    
    //dropdown ids
    const [ownerId, setOwnerId] = useState();
    
    useEffect(() => {     
        setCustomerDetails(props.details);
        if(props.details) {
            if(props.details.admin_users!==null) {
                setOwnerDropDown(Object.entries(props.details.admin_users).length>0 ? Object.entries(props.details.admin_users)[0][1]:"");
                setOwnerId(Object.entries(props.details.admin_users).length>0 ? Object.entries(props.details.admin_users)[0][0]:"");
            }
        }
        if(localStorage.getItem('customer_type')) {
            setCustomerType(localStorage.getItem('customer_type'));
        }
    }, [props.details]);

    useEffect(() => {     
        if(props.destinationList) {
            setFullFillDestinationList(props.destinationList);
        }
    }, [props.destinationList]);

    useEffect(() => {     
        if(customerDetails && customerDetails.PROSPECT_SOURCE) {
            setSourceDropDown(customerDetails.PROSPECT_SOURCE);
        }
        if(customerDetails && customerDetails.PROSPECT_STATUS) {
            setStatusDropDown(customerDetails.PROSPECT_STATUS);
        }
    }, [customerDetails]);


    const handleFillInfo = () => {
        setError("");
        setSuccess("");
        setCustomerFname(customerDetails? customerDetails.NAME !== null ? customerDetails.NAME.split(" ")[0] ? customerDetails.NAME.split(" ")[0] :"" : "":"");
        setCustomerLname(customerDetails? customerDetails.NAME !== null ? customerDetails.NAME.split(" ")[1] ? customerDetails.NAME.split(" ")[1] :"": "":"");
        setCustomerPhone(customerDetails? customerDetails.PHONE !== null ? customerDetails.PHONE : "":"");
        setCustomerEmail(customerDetails? customerDetails.EMAIL_ADDRESS !== null ? customerDetails.EMAIL_ADDRESS : "":"");
        setCustomerAlternatePhone(customerDetails? customerDetails.ALT_PHONE !== null ? customerDetails.ALT_PHONE : "":"");
        setCustomerAlternateEmail(customerDetails? customerDetails.ALT_EMAIL !== null ? customerDetails.ALT_EMAIL : "":"");
        // setCustomerFulfillDestination(customerDetails? customerDetails.FULLFILL_DEST !== null ? customerDetails.FULLFILL_DEST : "":"");
        setPhoneCode(customerDetails? customerDetails.PHONE_AREA_CODE !== null ? customerDetails.PHONE_AREA_CODE : "+44":"+44")
        setAlternatePhoneCode(customerDetails? customerDetails.ALTERNATE_PHONE_AREA_CODE !== null ? customerDetails.ALTERNATE_PHONE_AREA_CODE : "+44":"+44")
        setTimeZone(customerDetails.TIME_ZONE? customerDetails.TIME_ZONE !== null ? customerDetails.TIME_ZONE : "PST":"PST") 
        // setSourceDropDown(customerDetails? customerDetails.PROSPECT_SOURCE !== null ? customerDetails.PROSPECT_SOURCE : "Cold Leads":"Cold Leads") 
        // setStatusDropDown(customerDetails? customerDetails.PROSPECT_STATUS !== null ? customerDetails.PROSPECT_STATUS : "Contacted":"Contacted");
        setAccountDropDown(customerDetails? customerDetails.ACCOUNT_TYPE !== null ? customerDetails.ACCOUNT_TYPE : "Retail":"Retail");
        setCustomerStorageAccount(customerDetails? customerDetails.STORAGE_ACCOUNT !== null ? customerDetails.STORAGE_ACCOUNT : "":"");
        setCustomerAccountNumber(customerDetails? customerDetails.ACCOUNT_NUMBER !== null ? customerDetails.ACCOUNT_NUMBER : "":"");
        // setOwnerDropDown(customerDetails? customerDetails.OWNER !== null ? customerDetails.OWNER : "User":"User");
        // setCustomerZohoId(customerDetails? customerDetails.ZOHO_ID !== null ? customerDetails.ZOHO_ID : "":"");
        setDestinationDropDownValue(customerDetails? customerDetails.FULLFILL_DEST !== null ? customerDetails.FULLFILL_DEST : "":"")
        setInfoModal(true);

    }
    const handleEditCustomer = (e) => {
        let customerTypeId = 0;
        if(accountDropDown==="Retail") {
            customerTypeId=1;
        } else if(accountDropDown==="Whoesale") {
            customerTypeId=2;
        } else if(accountDropDown==="Investment") {
            customerTypeId=3;
        } else if(accountDropDown==="Logistic") {
            customerTypeId=4;
        }else if(accountDropDown==="Others") {
            customerTypeId=6;
        } else {
            customerTypeId=5;
        }
        e.preventDefault();
        axios.post("/accounts/edit_user"+query,{
            customer_id:localStorage.getItem('customer_id'),
            fname:customerFname,
            lname: customerLname,
            phone: customerPhone,
            email: customerEmail,
            alt_email: customerAlternateEmail,
            alt_phone: customerAlternatePhone,
            fullfil_dest: destinationDropDownValue,
            phone_code: phoneCode,
            alt_phone_code: alternatePhoneCode,
            tim_zone: timeZone,
            customer_type_id: customerTypeId,
            account_number:customerAccountNumber,
            storage_number: customerStorageAccount,
            owner_id: ownerId,
            source: sourceDropDown,
            status: statusDropDown

        }).then((res) => {
            // console.log("edit user api response",res.data);
            if(res.data.message==="customer updated") {
                dispatch(fetchCustomer({fetch:!fetch}))
                props.fetchCustomerInfo();
                setSuccess("Customer Details Updated!");
                setError("");
            }else {
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
    const handleCloseDropDowns = (type) => {
        switch(type){
            case "phone-code":
                // setIsPhoneCodeOpen(false);
                setIsAlternatePhoneCodeOpen(false);
                setIsTimeZoneOpen(false);
                setIsAccountOpen(false);
                setIsDestinationOpen(false);
                setIsOwnerOpen(false);
            break;
            case "alternate-phone-code":
                setIsPhoneCodeOpen(false);
                // setIsAlternatePhoneCodeOpen(false);
                setIsTimeZoneOpen(false);
                setIsAccountOpen(false);
                setIsDestinationOpen(false);
                setIsOwnerOpen(false);
            break;
            case "time-zone":
                setIsPhoneCodeOpen(false);
                setIsAlternatePhoneCodeOpen(false);
                // setIsTimeZoneOpen(false);
                setIsAccountOpen(false);
                setIsDestinationOpen(false);
                setIsOwnerOpen(false);
            break;
            case "account":
                setIsPhoneCodeOpen(false);
                setIsAlternatePhoneCodeOpen(false);
                setIsTimeZoneOpen(false);
                // setIsAccountOpen(false);
                setIsDestinationOpen(false);
                setIsOwnerOpen(false);
            break;
            case "destination":
                setIsPhoneCodeOpen(false);
                setIsAlternatePhoneCodeOpen(false);
                setIsTimeZoneOpen(false);
                setIsAccountOpen(false);
                // setIsDestinationOpen(false);
                setIsOwnerOpen(false);
            break;
            case "owner":
                setIsPhoneCodeOpen(false);
                setIsAlternatePhoneCodeOpen(false);
                setIsTimeZoneOpen(false);
                setIsAccountOpen(false);
                setIsDestinationOpen(false);
                // setIsOwnerOpen(false);
            break;
            case "all":
                setIsPhoneCodeOpen(false);
                setIsAlternatePhoneCodeOpen(false);
                setIsTimeZoneOpen(false);
                setIsAccountOpen(false);
                setIsDestinationOpen(false);
                setIsOwnerOpen(false);
            break;
                default: console.log("wrong input..")
        }
    }
    return (
        <div className="account-info-content-block customer-details-info d-flex flex-column">
            <div className="head d-flex align-items-center justify-content-between">
                <div className="title">
                    {
                        customerType === "Customer" ? <h6>Customer Details</h6> : ""
                    }
                    {
                        customerType === "Prospect" ? <h6>Prospect Details</h6> : ""
                    }
                    {
                        customerType === "Lead" ? <h6>Lead Details</h6> : ""
                    }
                    {
                        customerType === "Vendor" ? <h6>Vendor Details</h6> : ""
                    }
                    {
                        customerType === "Vendor-Prospect" ? <h6>{customerType} Details</h6> : ""
                    }
                </div>
                <div className="d-flex">
                    <div className="edit">
                        <Button variant="link" onClick={() => handleFillInfo()}><i><img src={EditIcon} alt="edit-icon"/></i> Edit</Button>
                    </div>
                </div>
            </div>
            <div className="content-card">
                <div className="content-detail d-flex">
                    <div className="content-detail-list">
                        <span>{customerDetails? customerDetails.PHONE_AREA_CODE !== null ? customerDetails.PHONE_AREA_CODE : ""  : ""}{customerDetails? customerDetails.PHONE !== null ? " "+customerDetails.PHONE : " -"  : " -"}</span>
                        <label>Primary Contact Number</label>
                    </div>
                    <div className="content-detail-list">
                        <span>{customerDetails? customerDetails.EMAIL_ADDRESS !== null ? customerDetails.EMAIL_ADDRESS : "-"  : "-"}</span>
                        <label>Primary Email</label>
                    </div>
                    <div className="content-detail-list">
                        <span>{customerDetails? customerDetails.CURRENCY !== null ? customerDetails.CURRENCY : "-"  : "-"}</span>
                        <label>Currency</label>
                    </div>
                </div>
                <div className="content-detail d-flex">
                    <div className="content-detail-list">
                        <span>{customerDetails? customerDetails.ALTERNATE_PHONE_AREA_CODE !== null ? customerDetails.ALTERNATE_PHONE_AREA_CODE : ""  : ""}{customerDetails? customerDetails.ALT_PHONE !== null ? " "+customerDetails.ALT_PHONE : " -"  : " -"}</span>
                        <label>Alternate Contact Number</label>
                    </div>
                    <div className="content-detail-list">
                        <span>{customerDetails? customerDetails.ALT_EMAIL !== null ? customerDetails.ALT_EMAIL : "-"  : "-"}</span>
                        <label>Alternate Email</label>
                    </div>
                    <div className="content-detail-list">
                        <span>{customerDetails? customerDetails.TIME_ZONE !== null ? customerDetails.TIME_ZONE : "-"  : "-"}</span>
                        <label>Timezone</label>
                    </div>
                </div>
                <div className="content-detail d-flex">
                        {
                            customerType === "Customer" ? 
                            (
                                <div className="content-detail-list">
                                    <span>{customerDetails ? customerDetails.ACCOUNT_NUMBER !== null ? customerDetails.ACCOUNT_NUMBER :"-" : "-"}</span>
                                    <label>Account Number</label>
                            </div>) : ""
                        }
                        {
                            customerType === "Vendor" ? (
                                <div className="content-detail-list">
                                    <span>{customerDetails ? customerDetails.ACCOUNT_NUMBER !== null ? customerDetails.ACCOUNT_NUMBER :"-" : "-"}</span>
                                    <label>Vendor Number</label>
                            </div>) : ""
                        }
                    
                        {
                            customerType === "Customer" ? 
                            <div className="content-detail-list">
                                <span>{customerDetails ? customerDetails.LOCATION !== null ? customerDetails.LOCATION :"-" : "-"}</span>
                                <label>Account Location</label>
                            </div>
                             : ""
                        }
                        {
                            customerType === "Prospect" ? 
                            <div className="content-detail-list">
                                <span>{customerDetails ? customerDetails.LOCATION !== null ? customerDetails.LOCATION :"-" : "-"}</span>
                                <label>Prospect Location</label>
                            </div>
                             : ""
                        }
                        {
                            customerType === "Lead" ? 
                            <div className="content-detail-list">
                                <span>{customerDetails ? customerDetails.LOCATION !== null ? customerDetails.LOCATION :"-" : "-"}</span>
                                <label>Lead Location</label>
                            </div>
                             : ""
                        }
                        {
                            customerType === "Vendor" ? 
                            <div className="content-detail-list">
                                <span>{customerDetails ? customerDetails.LOCATION !== null ? customerDetails.LOCATION :"-" : "-"}</span>
                                <label>Vendor Location</label>
                            </div>
                             : ""
                        }
                        {
                            customerType === "Vendor-Prospect" ? 
                            <div className="content-detail-list">
                                <span>{customerDetails ? customerDetails.LOCATION !== null ? customerDetails.LOCATION :"-" : "-"}</span>
                                <label>Vendor-Prospect Location</label>
                            </div>
                             : ""
                        }
                    
                        {
                            customerType === "Customer" ? 
                            (
                                <div className="content-detail-list">
                                    <span>{customerDetails ? customerDetails.ZOHO_ID !== null ? customerDetails.ZOHO_ID :"-" : "-"}</span>
                                    <label>Quickbook ID</label>
                                </div>
                               ) : ""
                        }
                        {
                            customerType === "Vendor" ? 
                            (   
                                <div className="content-detail-list">
                                    <span>{customerDetails ? customerDetails.ZOHO_ID !== null ? customerDetails.ZOHO_ID :"-" : "-"}</span>
                                    <label>Quickbook ID</label>
                                </div>
                            ) : ""
                        }
                        {
                                (customerType === "Lead" || customerType === "Prospect" || customerType === "Vendor-Prospect") ? 
                                (   <>
                                    <div className="content-detail-list">
                                        <span>{customerDetails ? customerDetails.OWNER !== null ? customerDetails.OWNER :"-" : "-"}</span>
                                        <label>Account Manager</label>
                                    </div>
                                    <div className="content-detail-list">
                                    </div>
                                    </>
                                ) : ""
                        }
                </div>
                {
                    (customerType==="Vendor") ?
                    (
                        <div className="content-detail d-flex">
                            {
                                customerType === "Vendor" ? 
                                (   
                                    <div className="content-detail-list">
                                        <span>{customerDetails ? customerDetails.ACCOUNT_TYPE !== null ? customerDetails.ACCOUNT_TYPE :"-" : "-"}</span>
                                        <label>Vendor Type</label>
                                    </div>
                                ) : ""
                            }
                            {
                                customerType === "Vendor" ? 
                                (   
                                    <div className="content-detail-list">
                                        <span>{customerDetails ? customerDetails.OWNER !== null ? customerDetails.OWNER :"-" : "-"}</span>
                                        <label>Account Manager</label>
                                    </div>
                                ) : ""
                            }
                            {
                                customerType === "Vendor" ? 
                                (   
                                    <div className="content-detail-list">
                                        <span>{customerDetails ? customerDetails.STORAGE_ACCOUNT !== null ? customerDetails.STORAGE_ACCOUNT :"-" : "-"}</span>
                                        <label>Storage Account</label>
                                    </div>
                                ) : ""
                            }
                        </div>
                    ) : ""
                }
                {
                    customerType==="Customer" ? (
                        <div className="content-detail d-flex">
                            {
                                customerType === "Customer" ? 
                                (   
                                    <div className="content-detail-list">
                                        <span>{customerDetails ? customerDetails.ACCOUNT_TYPE !== null ? customerDetails.ACCOUNT_TYPE :"-" : "-"}</span>
                                        <label>Account Type</label>
                                    </div>
                                ) : ""
                            }
                            {
                                customerType === "Customer" ? 
                                (   
                                    <div className="content-detail-list">
                                        <span>{customerDetails ? customerDetails.OWNER !== null ? customerDetails.OWNER :"-" : "-"}</span>
                                        <label>Account Manager</label>
                                    </div>
                                ) : ""
                            }
                            {
                                customerType === "Customer" ? 
                                (   
                                    <div className="content-detail-list">
                                        <span>{customerDetails ? customerDetails.STORAGE_ACCOUNT !== null ? customerDetails.STORAGE_ACCOUNT :"-" : "-"}</span>
                                        <label>Storage Account</label>
                                    </div>
                                ) : ""
                            }
                        </div>
                    ) :""
                }
                

                    {
                        customerType === "Customer" ? 
                        <div className="content-detail d-flex">
                            <div className="content-detail-list">
                                <span>{customerDetails? customerDetails.FULLFILL_DEST !== null ? customerDetails.FULLFILL_DEST : "-"  : "-"}</span>
                                <label>Fullfill Destination</label>
                            </div>
                        </div> : ""
                    }
                
            </div>


            {/* Customer Info Edit Modal */}
            <Modal show={infoModal}
                       onHide={() => setInfoModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>EDIT {customerType} DETAILS</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={(e) => handleEditCustomer(e)}>
                        <Modal.Body>
                            <div className="change-address-body">
                                <div className="change-address-wrapper">
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>First Name:</label>
                                        <input type="text" className="text-input"  value = {customerFname} onChange = {(e) => {setError(""); setCustomerFname(e.target.value)}} ></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Last Name:</label>
                                        <input type="text" className="text-input" value = {customerLname} onChange = {(e) => {setError(""); setCustomerLname(e.target.value)}} ></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Phone Code:</label>
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isPhoneCodeOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{setIsPhoneCodeOpen(!isPhoneCodeOpen); handleCloseDropDowns("phone-code")}}><span>{phoneCode}</span>
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
                                                                    <span key={index} className={phoneCode === value.split('(').pop().split(')')[0] ? "custom-option selected":"custom-option"} 
                                                                        onClick={() => { setPhoneCode(value.split('(').pop().split(')')[0]); setSuccess(""); setError(""); setIsPhoneCodeOpen(false)}}
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
                                        <input type="text" className="text-input" value = {customerPhone} onChange = {(e) => {setError(""); setCustomerPhone(e.target.value)}} required={query !== "?region=UK"}></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Alternate Phone Code:</label>
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isAlternatePhoneCodeOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{setIsAlternatePhoneCodeOpen(!isAlternatePhoneCodeOpen);handleCloseDropDowns("alternate-phone-code")}}><span>{alternatePhoneCode}</span>
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
                                                                    <span key={index} className={alternatePhoneCode === value.split('(').pop().split(')')[0] ? "custom-option selected":"custom-option"} 
                                                                        onClick={() => { setAlternatePhoneCode(value.split('(').pop().split(')')[0]); setSuccess(""); setError(""); setIsAlternatePhoneCodeOpen(false)}}
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
                                        <label>Alternate Phone:</label>
                                        <input type="text" className="text-input" value = {customerAlternatePhone} onChange = {(e) => {setError(""); setCustomerAlternatePhone(e.target.value)}} ></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Primary Email:</label>
                                        <input type="email" className="text-input" value = {customerEmail} onChange = {(e) => {setError(""); setCustomerEmail(e.target.value)}} ></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Alternate Email:</label>
                                        <input type="email" className="text-input" value = {customerAlternateEmail} onChange = {(e) => {setError(""); setCustomerAlternateEmail(e.target.value)}} ></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Timezone:</label>
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isTimeZoneOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{setIsTimeZoneOpen(!isTimeZoneOpen);handleCloseDropDowns("time-zone")}}><span>{timeZone}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            timeZoneList && timeZoneList.map((value, index) => {
                                                                return (
                                                                    <span key={index} className={timeZone === value ? "custom-option selected":"custom-option"} onClick={() => { setTimeZone(value); setSuccess(""); setError(""); setIsTimeZoneOpen(false)}}>{value}</span>
                                                                )
                                                            })
                                                        }
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        (customerType === "Customer" || customerType === "Vendor") ? (
                                            <div className="change-address-list d-flex align-items-center street-filed">
                                                <label>Account Number:</label>
                                                <input type="text" className="text-input" value = {customerAccountNumber} onChange = {(e) => {setError(""); setCustomerAccountNumber(e.target.value)}} ></input>
                                            </div>
                                        ):""
                                    }
                                    {
                                        (customerType === "Customer" || customerType === "Vendor") ? (
                                            <div className="change-address-list d-flex align-items-center street-filed">
                                            {
                                                (customerType==="Vendor") ? ( <label>{customerType} Type:</label>) : ( <label>Account Type:</label>)
                                            }
                                                <div className="dropUp">
                                                    <div className="custom-select-wrapper d-flex align-items-center">
                                                        <div className={isAccountOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                            <div className="custom-select__trigger" onClick={()=>{setIsAccountOpen(!isAccountOpen); handleCloseDropDowns("account");}}><span>{accountDropDown}</span>
                                                                <div className="arrow">
                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="custom-options">
                                                                <span className={accountDropDown === "Retail" ? "custom-option selected":"custom-option"} onClick={() => { setAccountDropDown("Retail"); setSuccess(""); setError(""); setIsAccountOpen(false)}}>Retail</span>
                                                                <span className={accountDropDown === "Whoesale" ? "custom-option selected":"custom-option"} onClick={() => { setAccountDropDown("Whoesale"); setSuccess(""); setError(""); setIsAccountOpen(false)}}>Whoesale</span>
                                                                <span className={accountDropDown === "Investment" ? "custom-option selected":"custom-option"} onClick={() => { setAccountDropDown("Investment"); setSuccess(""); setError(""); setIsAccountOpen(false)}}>Investment</span>
                                                                <span className={accountDropDown === "Logistic" ? "custom-option selected":"custom-option"} onClick={() => { setAccountDropDown("Logistic"); setSuccess(""); setError(""); setIsAccountOpen(false)}}>Logistic</span>
                                                                {customerType==="Vendor" ? (
                                                                    <span className={accountDropDown === "Winery" ? "custom-option selected":"custom-option"} onClick={() => { setAccountDropDown("Winery"); setSuccess(""); setError(""); setIsAccountOpen(false)}}>Winery</span>
                                                                ) : ""}
                                                                {customerType==="Vendor" ? (
                                                                    <span className={accountDropDown === "Others" ? "custom-option selected":"custom-option"} onClick={() => { setAccountDropDown("Others"); setSuccess(""); setError(""); setIsAccountOpen(false)}}>Others</span>
                                                                ) : ""}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ):""
                                    }
                                    {
                                        (customerType === "Customer") ? (
                                            <div className="change-address-list d-flex align-items-center street-filed">
                                                <label>Fullfill Destination:</label>
                                                <div className="dropUp">
                                                    <div className="custom-select-wrapper d-flex align-items-center">
                                                        <div className={isDestinationOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                            <div className="custom-select__trigger" onClick={()=>{setIsDestinationOpen(!isDestinationOpen); handleCloseDropDowns("destination")}}>
                                                                <span>{destinationDropDownValue ? destinationDropDownValue : "Not selected"}</span>
                                                                <div className="arrow">
                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="custom-options">
                                                            {
                                                                fullFillDestinationList && fullFillDestinationList.map((value, index) => {
                                                                    return(
                                                                        <span key={index} className={destinationDropDownValue === value ? "custom-option selected":"custom-option"} 
                                                                            onClick={() => { setDestinationDropDownValue(value); setSuccess(""); setError(""); setIsDestinationOpen(false)}}
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
                                        ):""
                                    }
                                    {
                                        (customerType === "Customer" || customerType === "Vendor") ? (
                                            <div className="change-address-list d-flex align-items-center street-filed">
                                                <label>Storage Account:</label>
                                                <input type="text" className="text-input" value = {customerStorageAccount} onChange = {(e) => {setError(""); setCustomerStorageAccount(e.target.value)}} ></input>
                                            </div>
                                        ):""
                                    }
                                    {
                                        (customerType === "Customer" || customerType === "Lead" || customerType === "Prospect" || customerType === "Vendor" || customerType === "Vendor-Prospect") ? (
                                            <div className="change-address-list d-flex align-items-center street-filed">
                                                <label>Account Manager:</label>
                                                <div className="dropUp">
                                                    <div className="custom-select-wrapper d-flex align-items-center">
                                                        <div className={isOwnerOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                            <div className="custom-select__trigger" onClick={()=>{setIsOwnerOpen(!isOwnerOpen); handleCloseDropDowns("owner");}}><span>{ownerDropDown ? ownerDropDown : "select user"}</span>
                                                                <div className="arrow">
                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="custom-options">
                                                                {
                                                                    customerDetails && Object.entries(customerDetails.admin_users).length>0 ? (
                                                                        Object.entries(customerDetails.admin_users).map((value, index) => {
                                                                            return (
                                                                                <span key={index} className={ownerDropDown === value[1] ? "custom-option selected":"custom-option"} onClick={() => { setOwnerDropDown(value[1]); setSuccess(""); setError(""); setOwnerId(value[0]); setIsOwnerOpen(false)}}>{value[1]}</span>
                                                                            )
                                                                        })
                                                                    ) :""
                                                                }                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ):""
                                    }
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
            {/* <Modal show={infoModal}
                       onHide={() => setInfoModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>EDIT CUSTOMER DETAILS</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {message}
                    </Modal.Body>
            </Modal> */} 
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

export default CustomerDetails;