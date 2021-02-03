    import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import Button from "react-bootstrap/Button";
// import EditIcon from "../../../assets/images/edit-icon.svg";
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card';
import editIcon from "../../../../src/assets/images/edit-icon.svg";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
// import { setSession } from '../../utils/Actions';
import SessionModal from '../../Modals/SessionModal';
import { setSession } from '../../../utils/Actions';
import { useSelector } from "react-redux";

const Addresses = (props) => {
    let billingCounter = 0;
    let shippingCounter = 0;
    const [billingAddress, setBillingAddress] = useState();
    const [shippingAddress, setShippingAddress] = useState();
    const dispatch = useDispatch();
    const query = useSelector(state => state.userRegion);
    const [customerType, setCustomerType] = useState("");

    //billing address vars
    const [billingPrimaryAddressLine1,setBillingPrimaryAddressLine1] = useState("");
    const [billingPrimaryAddressLine2,setBillingPrimaryAddressLine2] = useState("");
    const [billingPrimaryAddressId,setBillingPrimaryAddressId] = useState("");
    const [billingPrimaryAddressCountry,setBillingPrimaryAddressCountry] = useState("");
    const [billingPrimaryAddressName,setBillingPrimaryAddressName] = useState("");
    const [billingPrimaryAddressPhone,setBillingPrimaryAddressPhone] = useState("");
    const [billingPrimaryAddressState,setBillingPrimaryAddressState] = useState("");
    const [billingPrimaryAddressTown,setBillingPrimaryAddressTown] = useState("");
    const [billingPrimaryAddressZip,setBillingPrimaryAddressZip] = useState(""); 
    // const [billingPrimaryAddressBilling,setPrimaryAddressBilling] = useState(""); 

    //save-unsaved flag for billing address
    const [billingPrimaryId, setBillingPrimaryId] = useState();

    //shipping address vars
    const [shippingPrimaryAddressLine1,setShippingPrimaryAddressLine1] = useState("");
    const [shippingPrimaryAddressLine2,setShippingPrimaryAddressLine2] = useState("");
    const [shippingPrimaryAddressId,setShippingPrimaryAddressId] = useState("");
    const [shippingPrimaryAddressCountry,setShippingPrimaryAddressCountry] = useState("");
    const [shippingPrimaryAddressName,setShippingPrimaryAddressName] = useState("");
    const [shippingPrimaryAddressPhone,setShippingPrimaryAddressPhone] = useState("");
    const [shippingPrimaryAddressState,setShippingPrimaryAddressState] = useState("");
    const [shippingPrimaryAddressTown,setShippingPrimaryAddressTown] = useState("");
    const [shippingPrimaryAddressZip,setShippingPrimaryAddressZip] = useState(""); 
    // const [shippingPrimaryAddressBilling,setPrimaryAddressBilling] = useState(""); 

    //save-unsaved flag for shipping address
    const [shippingPrimaryId, setShippingPrimaryId] = useState();

    const [message,setMessage] = useState(false);
    const [status,setStatus] = useState("");
    const [showAll,setShowAll] = useState(false);

    //edit modal vars
    const [modalAddressLine1, setModalAddressLine1] = useState();
    const [modalAddressLine2, setModalAddressLine2] = useState();
    const [modalPhone, setModalPhone] = useState();
    const [modalTown, setModalTown] = useState();
    const [modalState, setModalState] = useState();
    const [modalZip, setModalZip] = useState();
    const [modalCountry, setModalCountry] = useState();
    const [modalId, setModalId] = useState();
    const [modalType, setModalType] = useState();
    const [addressType, setAddressType] = useState('Billing');
    const [isPrimary, setIsPrimary] = useState(false);


    //modal vars
    const[error,setError] = useState('');
    const[infoModal,setInfoModal] = useState(false);
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const [addAddressModal, setAddAddressModal] = useState(false);
    const [isAddressTypeOpen, setIsAddressTypeOpen] = useState(false);
    const [success, setSuccess] = useState();

    useEffect(() => {
        if(localStorage.getItem("customer_type")) {
            setCustomerType(localStorage.getItem("customer_type"));
        }
    }, [])
    useEffect(() => {     
        setBillingAddress(props.billingAddress);
        setShippingAddress(props.shippingAddress);

        props.billingAddress && Object.entries(props.billingAddress).map((value)=>{
            if(value[1].IS_PRIMARY == 1) {
                // setPrimaryAddress(value[1].NAME);
                // console.log("Billing primary address",value)
                setBillingPrimaryId(value[1].BILLING_ADDRESS_ID);
                setBillingPrimaryAddressLine1(value[1].ADDRESS_LINE_1);
                setBillingPrimaryAddressLine2(value[1].ADDRESS_LINE_2);
                setBillingPrimaryAddressId(value[1].BILLING_ADDRESS_ID);
                setBillingPrimaryAddressCountry(value[1].COUNTRY);
                
                // setPrimaryAddressName(value[1].NAME);
                // setPrimaryAddressPhone(value[1].PHONE);

                setBillingPrimaryAddressState(value[1].STATE);
                setBillingPrimaryAddressTown(value[1].TOWN);
                setBillingPrimaryAddressZip(value[1].ZIP_CODE);
                setBillingPrimaryAddressPhone(value[1].CONTACT_NO);
            }
        });

        props.shippingAddress && Object.entries(props.shippingAddress).map((value)=>{
            // console.log("value",value)
            if(value[1].IS_PRIMARY == 1) {
                // setPrimaryAddress(value[1].NAME);
                // console.log("shipping primary address",value)
                setShippingPrimaryId(value[1].SHIPPING_ADDRESS_ID);
                setShippingPrimaryAddressLine1(value[1].ADDRESS_LINE_1);
                setShippingPrimaryAddressLine2(value[1].ADDRESS_LINE_2);
                setShippingPrimaryAddressId(value[1].SHIPPING_ADDRESS_ID);
                setShippingPrimaryAddressCountry(value[1].COUNTRY);
                
                // setPrimaryAddressName(value[1].NAME);
                // setPrimaryAddressPhone(value[1].PHONE);

                setShippingPrimaryAddressState(value[1].STATE);
                setShippingPrimaryAddressTown(value[1].TOWN);
                setShippingPrimaryAddressZip(value[1].ZIP_CODE);
                setShippingPrimaryAddressPhone(value[1].CONTACT_NO);
            }
        });
    }, [props]);
    const handleFillFormBilling = (id) => {
        setError("");
        setSuccess("");
        Object.entries(billingAddress).map((value)=>{
            if(value[0]==id) {
                setModalType("billing");
                setModalId(value[1].BILLING_ADDRESS_ID);
                setModalAddressLine1(value[1].ADDRESS_LINE_1);
                setModalAddressLine2(value[1].ADDRESS_LINE_2);
                setModalTown(value[1].TOWN);
                setModalState(value[1].STATE);
                setModalCountry(value[1].COUNTRY);
                setModalZip(value[1].ZIP_CODE);
                setModalPhone(value[1].CONTACT_NO);
                setIsPrimary(value[1].IS_PRIMARY == 1 ? true : false);
            }   
        })
        setInfoModal(true);
    }
    const handleFillFormShipping = (id) => {
        setError("");
        setSuccess("");
        Object.entries(shippingAddress).map((value)=>{
            if(value[0]==id) {
                setModalType("shipping");
                setModalId(value[1].SHIPPING_ADDRESS_ID);
                setModalAddressLine1(value[1].ADDRESS_LINE_1);
                setModalAddressLine2(value[1].ADDRESS_LINE_2);
                setModalTown(value[1].TOWN);
                setModalState(value[1].STATE);
                setModalCountry(value[1].COUNTRY);
                setModalZip(value[1].ZIP_CODE);
                setModalPhone(value[1].CONTACT_NO);
                setIsPrimary(value[1].IS_PRIMARY == 1 ? true : false);
            }   
        })
        // setEditAddAccount(true)
        setInfoModal(true);
    }

    const handleEditAddress = (e) => {
        e.preventDefault();
        // console.log("address type",modalType)
        axios.post("/accounts/edit_address"+query, {
            customer_id: localStorage.getItem("customer_id"),
            address_id: modalId,
            phone: modalPhone,
            address_1: modalAddressLine1,
            address_2: modalAddressLine2,
            town: modalTown,
            state: modalState,
            zip: modalZip,
            country: modalCountry,
            address_type: modalType,
            primary_address: isPrimary==true ? "1" : "0"
        }).then((res) => {
            if(res.data.message === "address updated") {
                axios.post("/accounts/edit_address_flag"+query, {
                    customer_id: localStorage.getItem("customer_id"),
                    address_id: modalId,
                    address_type: modalType,
                    primary_address: isPrimary === true ? "1" : "0"
                }).then((res) => {
                    if(res.data.message === "address updated") {
                        setSuccess("Address Updated Successfully!");
                        props.fetchCustomer();
                    }
                }).catch((error) => {
                    console.log(error);
                    // dispatch(setSession());
                });
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
    }
    const handleAddAddress = (e) => {
        e.preventDefault();
        axios.post("/accounts/add_address"+query, {
            customer_id: localStorage.getItem("customer_id"),
            phone: modalPhone,
            address_1: modalAddressLine1,
            address_2: modalAddressLine2,
            town: modalTown,
            state: modalState,
            zip: modalZip,
            country: modalCountry,
            address_type: addressType
        }).then((res) => {
            // console.log("add address api response",res.data)
            if(res.data.message === "address added") {
                props.fetchCustomer();
                setError("Address Added Successfully!");
                props.fetchCustomer();
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
    }
    const handleAddAddressClick = () => {
        setAddAddressModal(true);
        setModalAddressLine1('');
        setModalAddressLine2('');
        setModalCountry('');
        setModalTown('');
        setModalState('');
        setModalPhone('');
        setModalZip('');
    }
    return (
        <>
        <div className="account-info-content-block customer-details-info d-flex flex-column">
            <div className="btn-add">
                <Button className="btn-save" onClick={() => handleAddAddressClick()}>Add Address</Button>
            </div>
        </div>
        <div className="address-row">
            {
                billingAddress && Object.entries(billingAddress).length > 0 ? 
                (
                    <div className="account-info-content-block d-flex flex-column">
                    <div className="head d-flex align-items-center justify-content-between">
                        <div className="title">
                            {
                                customerType === "Vendor" ? (
                                    <h6>Business Address</h6>
                                ) : (
                                    <h6>Billing Address</h6>
                                )
                            }
                        </div>
                    </div>
                    <div className="content-card d-flex">
                        <div className="content-detail address-block billing-adr">
                            {
                                billingAddress ? (Object.entries(billingAddress).length > 0 ? (
                                    (
                                        <>
                                            <Accordion defaultActiveKey="0">
                                                {
                                                    (billingPrimaryAddressId || billingPrimaryId) ? (
                                                        <Card>
                                                            <Card.Header>
                                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                                {
                                                                    customerType === "Vendor" ? (
                                                                       "Primary Business Address "
                                                                    ) : (
                                                                        "Primary Billing Address "
                                                                    )
                                                                }
                                                                </Accordion.Toggle>
                                                                    <Button className="edit-link" variant="link" onClick={()=>{handleFillFormBilling(billingPrimaryAddressId)}}>
                                                                        <img src={editIcon}/>
                                                                    </Button>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey="0">
                                                            <Card.Body>
                                                                <div className="account-info-detail" >
                                                                    <div className="storage-details-block">
                                                                        <div className="storage-details-row d-flex">
                                                                            <div className="storage-details-list">
                                                                                <div className="storage-addr">
                                                                                    <span>{billingPrimaryAddressLine1 ? billingPrimaryAddressLine1 : " "}</span>
                                                                                    <span>{billingPrimaryAddressLine2 ? billingPrimaryAddressLine2 : " "}</span>
                                                                                    <span>{billingPrimaryAddressState ? (billingPrimaryAddressTown+', '+ billingPrimaryAddressState):" "}</span>
                                                                                    <span>{billingPrimaryAddressZip ? billingPrimaryAddressZip : ""}{billingPrimaryAddressCountry ? "- "+billingPrimaryAddressCountry : ""}</span>
                                                                                    <span>{billingPrimaryAddressPhone ? billingPrimaryAddressPhone : " "}</span>
                                                                            </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    ) : (
                                                        <Card>
                                                            <Card.Header>
                                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                                {
                                                                    customerType === "Vendor" ? (
                                                                        "Primary Business Address "
                                                                    ) : (
                                                                        "Primary Billing Address "
                                                                    )
                                                                }
                                                                </Accordion.Toggle>
                                                                {
                                                                    billingPrimaryAddressId ? (
                                                                        <Button className="edit-link" variant="link" onClick={()=>handleFillFormBilling(billingPrimaryAddressId)}><img src={editIcon}/></Button>
                                                                    ) : ""
                                                                }
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey="0">
                                                            <Card.Body>
                                                                <div className="empty-address">
                                                                    No Primary Address Selected Yet
                                                                </div>
                                                            </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    )
                                                }    
                                            </Accordion>
            
                                            <Accordion>
                                                {
                                                    billingAddress ? Object.entries(billingAddress).map((val,index) => {
                                                        if(val[1].IS_PRIMARY != 1) {
                                                            return (
                                                                <Card key={index}>
                                                                    <Card.Header>
                                                                    <Accordion.Toggle as={Button} variant="link" eventKey={index+1}>
                                                                    {
                                                                        customerType === "Vendor" ? (
                                                                            "Secondary Business Address " 
                                                                        ) : (
                                                                            "Secondary Billing Address "
                                                                        )
                                                                    }
                                                                         {billingCounter+=1} 
                                                                    </Accordion.Toggle>
                                                                    {/* <Button onClick={()=>handleFillForm(val[0])}>
                                                                        <img src={editIcon}/>
                                                                    </Button> */}
                                                                    <Button className="edit-link" variant="link" onClick={()=>handleFillFormBilling(val[0])}>
                                                                        <img src={editIcon}/>
                                                                    </Button>
                                                                    </Card.Header>
                                                                    <Accordion.Collapse eventKey={index+1}>
                                                                        <Card.Body>
                                                                        <div className="account-info-detail" key={index}>
                                                                            <div className="storage-details-block">
                                                                                <div className="storage-details-row d-flex">
                                                                                    <div className="storage-details-list">
                                                                                        <div className="storage-addr">
                                                                                            <span>{val[1].ADDRESS_LINE_1 ? val[1].ADDRESS_LINE_1 : ""}</span>
                                                                                            <span>{val[1].ADDRESS_LINE_2 ? val[1].ADDRESS_LINE_2 : ""}</span>
                                                                                            <span>{val[1].STATE ? (val[1].TOWN+', '+ val[1].STATE):""}</span>
                                                                                            <span>{val[1].ZIP_CODE ? val[1].ZIP_CODE :""} {val[1].COUNTRY ? "- "+val[1].COUNTRY :""}</span>
                                                                                            <span>{val[1].CONTACT_NO ? val[1].CONTACT_NO : ""}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        </Card.Body>
                                                                    </Accordion.Collapse>
                                                                </Card>
                                                            )
                                                        }
                                                    }):""
                                                }
                                            </Accordion>
                                    </>)
                                ):("")) : ("No address")
                            }
                        </div>
                    </div>
                </div>
            ) : ""
        }
        {
            shippingAddress && Object.entries(shippingAddress).length > 0 ? 
            (
                <div className="account-info-content-block d-flex flex-column">
                <div className="head d-flex align-items-center justify-content-between">
                    <div className="title">
                    {
                                customerType === "Vendor" ? (
                                    <h6>Warehouse Address</h6>
                                ) : (
                                    <h6>Shipping Address</h6>
                                )
                            }                
                    </div>

                    {/* <div className="edit">
                        <Button variant="link"><i><img src={EditIcon} alt=""/></i> Edit</Button>
                    </div> */}
                </div>
                <div className="content-card d-flex">
                    <div className="content-detail address-block billing-adr">
                        {
                            shippingAddress ? (Object.entries(shippingAddress).length > 0 ? (
                                (
                                    <>
                                        <Accordion defaultActiveKey="0">
                                            {
                                                (shippingPrimaryAddressId || shippingPrimaryId) ? (
                                                    <Card>
                                                        <Card.Header>
                                                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                            {
                                                                customerType === "Vendor" ? (
                                                                    "Primary Warehouse Address"
                                                                ) : (
                                                                    "Primary Shipping Address"
                                                                )
                                                            }
                                                            </Accordion.Toggle>
                                                                {/* <Button onClick={()=>handleFillForm(primaryId)}>
                                                                    <img src={editIcon}/>
                                                                </Button>      */}
                                                                <Button className="edit-link" variant="link" onClick={()=>handleFillFormShipping(shippingPrimaryAddressId)}>
                                                                    <img src={editIcon}/>
                                                                </Button>
                                                        </Card.Header>
                                                        <Accordion.Collapse eventKey="0">
                                                        <Card.Body>
                                                            <div className="account-info-detail" >
                                                                <div className="storage-details-block">
                                                                    <div className="storage-details-row d-flex">
                                                                        <div className="storage-details-list">
                                                                            <div className="storage-addr">
                                                                                <span>{shippingPrimaryAddressLine1 ? shippingPrimaryAddressLine1 : " "}</span>
                                                                                <span>{shippingPrimaryAddressLine2 ? shippingPrimaryAddressLine2 : " "}</span>
                                                                                <span>{shippingPrimaryAddressState ? (shippingPrimaryAddressTown+', '+ shippingPrimaryAddressState):" "}</span>
                                                                                <span>{shippingPrimaryAddressZip ? shippingPrimaryAddressZip : ""}{shippingPrimaryAddressCountry ? "- "+shippingPrimaryAddressCountry : ""}</span>
                                                                                <span>{shippingPrimaryAddressPhone ? shippingPrimaryAddressPhone : " "}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Card>
                                                ) : (
                                                    <Card>
                                                        <Card.Header>
                                                            <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                                {
                                                                customerType === "Vendor" ? (
                                                                    "Primary Warehouse Address"
                                                                ) : (
                                                                    "Primary Shipping Address"
                                                                )
                                                            } 
                                                            
                                                            </Accordion.Toggle>
                                                            {
                                                                shippingPrimaryAddressId ? (
                                                                    <Button className="edit-link" variant="link" onClick={()=>handleFillFormShipping(shippingPrimaryAddressId)}><img src={editIcon}/></Button>
                                                                ) : ""
                                                            }
                                                        </Card.Header>
                                                        <Accordion.Collapse eventKey="0">
                                                        <Card.Body>
                                                            <div className="empty-address">
                                                                No Primary Address Selected Yet
                                                            </div>
                                                        </Card.Body>
                                                        </Accordion.Collapse>
                                                    </Card>
                                                )
                                            }    
                                        </Accordion>
        
                                        <Accordion>
                                            {
                                                shippingAddress ? Object.entries(shippingAddress).map((val,index) => {
                                                    if(val[1].IS_PRIMARY != 1) {
                                                        return (
                                                            <Card key={index}>
                                                                <Card.Header>
                                                                <Accordion.Toggle as={Button} variant="link" eventKey={index+1}>
                                                                {
                                                                customerType === "Vendor" ? (
                                                                    "Secondary Warehouse Address"
                                                                ) : (
                                                                    "Secondary Shipping Address"
                                                                )
                                                            } {shippingCounter+=1} 
                                                                </Accordion.Toggle>
                                                                {/* <Button onClick={()=>handleFillForm(val[0])}>
                                                                    <img src={editIcon}/>
                                                                </Button> */}
                                                                <Button className="edit-link" variant="link" onClick={()=>handleFillFormShipping(val[0])}>
                                                                    <img src={editIcon}/>
                                                                </Button>
                                                                </Card.Header>
                                                                <Accordion.Collapse eventKey={index+1}>
                                                                    <Card.Body>
                                                                    <div className="account-info-detail" key={index}>
                                                                        <div className="storage-details-block">
                                                                            <div className="storage-details-row d-flex">
                                                                                <div className="storage-details-list">
                                                                                    <div className="storage-addr">
                                                                                        <span>{val[1].ADDRESS_LINE_1 ? val[1].ADDRESS_LINE_1 : " "}</span>
                                                                                        <span>{val[1].ADDRESS_LINE_2 ? val[1].ADDRESS_LINE_2 : " "}</span>
                                                                                        <span>{val[1].STATE ? (val[1].TOWN+', '+ val[1].STATE):" "}</span>
                                                                                        <span>{val[1].ZIP_CODE ? val[1].ZIP_CODE :""} {val[1].COUNTRY ? "- "+val[1].COUNTRY :""}</span>
                                                                                        <span>{val[1].CONTACT_NO ? val[1].CONTACT_NO : " "}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    </Card.Body>
                                                                </Accordion.Collapse>
                                                            </Card>
                                                        )
                                                    }
                                                }):""
                                            }
                                        </Accordion>
                                </>)
                            ):("")) : ("No address")
                        }
                    </div>
                </div>
            </div>
            ) :""
        }
        
        </div>
            <Modal show={infoModal}
                       onHide={() => setInfoModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>EDIT ADDRESSS DETAILS</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={(e) => handleEditAddress(e)}>
                        <Modal.Body>
                            <div className="change-address-body">
                                <div className="change-address-wrapper">
                                <div className="change-address-list d-flex align-items-center street-filed">
                                        <label></label>
                                        <div className="checkbox-filed">
                                        {
                                            isPrimary===true ? (<><input type="checkbox" onChange={(e) => {setIsPrimary(e.target.checked); setError(""); setSuccess("");}} checked></input><span className="ml-2">Primary Address</span> </>)
                                            :(<><input type="checkbox" onChange={(e) => {setIsPrimary(e.target.checked);setError(""); setSuccess("");}}></input><span className="ml-2">Primary Address</span> </>)
                                        }
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Address Line 1:</label>
                                        <input type="text" className="text-input"  value = {modalAddressLine1?modalAddressLine1:""} onChange = {(e) => {setError("");setSuccess("");setModalAddressLine1(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Address Line 2:</label>
                                        <input type="text" className="text-input" value = {modalAddressLine2?modalAddressLine2:""} onChange = {(e) => {setError("");setSuccess("");setModalAddressLine2(e.target.value)}}></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Town:</label>
                                        <input type="text" className="text-input" value = {modalTown?modalTown:""} onChange = {(e) => {setError("");setSuccess("");setModalTown(e.target.value)}} required></input>
                                    </div>

                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>State:</label>
                                        <input type="text" className="text-input" value = {modalState?modalState:""} onChange = {(e) => {setError("");setSuccess("");setModalState(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Phone:</label>
                                        <input type="text" className="text-input" value = {modalPhone?modalPhone:""} onChange = {(e) => {setError("");setSuccess("");setModalPhone(e.target.value)}} required={query !== "?region=UK"}></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Zip:</label>
                                        <input type="text" className="text-input" value = {modalZip?modalZip:""} onChange = {(e) => {setError("");setSuccess("");setModalZip(e.target.value)}} required ></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Country:</label>
                                        <input type="text" className="text-input" value = {modalCountry?modalCountry:""} onChange = {(e) => {setError(""); setSuccess(""); setModalCountry(e.target.value)}} required></input>
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
            <Modal show={addAddressModal}
                       onHide={() => setAddAddressModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>NEW ADDRESSS DETAILS</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={(e) => handleAddAddress(e)}>
                        <Modal.Body>
                            <div className="change-address-body">
                                <div className="change-address-wrapper">
                                <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Address Type:</label> 
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isAddressTypeOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>setIsAddressTypeOpen(!isAddressTypeOpen)}><span>
                                                            {
                                                                (customerType==="Vendor" || customerType==="Vendor-Prospect") && addressType==="Shipping" ? "Warehouse" : (
                                                                    addressType
                                                                )
                                                            }
                                                        </span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        <span className={addressType === "Billing" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setAddressType('Billing'); setIsAddressTypeOpen(false)}}>Billing</span>
                                                        <span className={addressType === "Shipping" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setAddressType('Shipping'); setIsAddressTypeOpen(false)}}>{(customerType==="Vendor" || customerType==="Vendor-Prospect") ? "Warehouse":"Shipping"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Address Line 1:</label>
                                        <input type="text" className="text-input"  value = {modalAddressLine1?modalAddressLine1:""} onChange = {(e) => {setError("");setModalAddressLine1(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Address Line 2:</label>
                                        <input type="text" className="text-input" value = {modalAddressLine2?modalAddressLine2:""} onChange = {(e) => {setError("");setModalAddressLine2(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Town:</label>
                                        <input type="text" className="text-input" value = {modalTown?modalTown:""} onChange = {(e) => {setError("");setModalTown(e.target.value)}} required></input>
                                    </div>

                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>State:</label>
                                        <input type="text" className="text-input" value = {modalState?modalState:""} onChange = {(e) => {setError("");setModalState(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Phone:</label>
                                        <input type="text" className="text-input" value = {modalPhone?modalPhone:""} onChange = {(e) => {setError("");setModalPhone(e.target.value)}} required={query !== "?region=UK"}></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Zip:</label>
                                        <input type="text" className="text-input" value = {modalZip?modalZip:""} onChange = {(e) => {setError("");setModalZip(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Country:</label>
                                        <input type="text" className="text-input" value = {modalCountry?modalCountry:""} onChange = {(e) => {setError("");setModalCountry(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label></label>
                                        <span className="error-text">{error}</span>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <input type="submit" value="Save" className="save-btn" />
                        </Modal.Footer>
                    </form>
            </Modal> 
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage} />
        </>
        
    );
};

export default Addresses;