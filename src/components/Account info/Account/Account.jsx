import React, {useState, useEffect} from 'react';
import CustomerDetails from "./CustomerDetails";
import Addresses from "./Addresses";
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useDispatch} from 'react-redux';
import { setSession } from '../../..//utils/Actions/index';
import SessionModal from '../../Modals/SessionModal';
import UserSection from './UserSection';
import Table from 'react-bootstrap/Table';
import {useSelector} from "react-redux";
import '../Index.scss'
import { useHistory } from 'react-router-dom';


let id;
const Account = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const query = useSelector(state => state.userRegion);
    const fetch = useSelector(state => state.fetch);
    const [cutomerInfo,setCustomerInfo] = useState();
    const [customerType, setCustomerType] = useState();
    const [success, setSuccess] = useState();
    const [eventList, setEventList] = useState();

    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [error, setError] = useState('');
    const [minimumDate, setMinimumDate] = useState();
    const [calendarInfoModal, setCalendarInfoModal] = useState(false);

    //props data to be sent
    const [billingAddress, setBillingAddress] = useState();
    const [shippingAddress, setShippingAddress] = useState();
    const [users, setUsers] = useState();
    const [cellars, setCellars] = useState();
    const [vendorInfo, setVendorInfo] = useState();
    const [fulFillDestinationList, setFulFillmentDestinationList] = useState();

    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if(localStorage.getItem('customer_id')) {
            id=localStorage.getItem('customer_id');
            if(localStorage.getItem('customer_id') && (localStorage.getItem('customer_type')==="Customer" || localStorage.getItem('customer_type')==="Vendor")) {
                fetchInfo();
                setCustomerType(localStorage.getItem('customer_type'))
            }
             else {
                fetchLeadInfo();
                setCustomerType(localStorage.getItem('customer_type'))
             }
         }else {
            window.location.href='/';
         }         
    }, [fetch]);

    const handleFetchInfo = () => {
        if(localStorage.getItem('customer_type') === "Customer" || localStorage.getItem('customer_type') === "Vendor") {
            fetchInfo();
        } else {
            fetchLeadInfo();
        }
    }

    const fetchInfo = () => {
        setLoadingData(true);
        axios.post('/accounts/accountinfo'+query,{
            customer_id:id
        }).then((res) => {
            // console.log("accountinfo api response",res.data );
            setCustomerInfo(res.data.customer_details.customer_info);
            setShippingAddress(res.data.customer_details.shipping_address);
            setBillingAddress(res.data.customer_details.billing_address);
            setUsers(res.data.users);
            setCellars(res.data.cellar);
            setFulFillmentDestinationList(res.data.fullfill_dest_list?res.data.fullfill_dest_list:"");
            setEventList(res.data.events);
            setLoadingData(false);
            
        }).catch((error) => {
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
        });
    }

    const fetchLeadInfo = () => {
        setLoadingData(true);
        axios.post('/accounts/leadinfo'+query,{
            customer_id:id
        }).then((res) => {
            // console.log("leadinfo api response",res.data );
            setCustomerInfo(res.data.customer_details.customer_info);
            setShippingAddress(res.data.customer_details.shipping_address);
            setBillingAddress(res.data.customer_details.billing_address);
            setUsers(res.data.users);
            setFulFillmentDestinationList(res.data.fullfill_dest_list?res.data.fullfill_dest_list:"");
            setEventList(res.data.events);
            setLoadingData(false);
            
        }).catch((error) => {
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
        });
    }

    // const handleViewAccount = () => {
    //     localStorage.setItem("customer_id",modalCustomerId);
    //     handleFetchInfo(); 
    //     setCalendarInfoModal(false);
    // }
    return (
        <div className="account-info-content">
            <div className="account-info-content-row d-flex">
                <CustomerDetails details={cutomerInfo} fetchCustomerInfo={handleFetchInfo} destinationList = {fulFillDestinationList}/>
                <div className="account-info-content-block customer-details-info d-flex flex-column">
                    { 
                        (customerType==="Customer" || customerType==="Vendor" || customerType==="Vendor-Prospect")? (
                        <UserSection users={users} fetchCustomer={handleFetchInfo}/>):"" 
                    }
                </div>
                <Addresses billingAddress={billingAddress} shippingAddress={shippingAddress} fetchCustomer={handleFetchInfo}/>
                <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage} />
                <Modal show={successModal}
                    onHide={() => setSuccessModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>EDIT COMMUNICATION DETAILS</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="change-address-body">
                            <div className="change-address-wrapper">
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label></label>
                                    <span className="success-text">{error}</span>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="button" onClick = {() => setSuccessModal(false)}className="save-btn">OK</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default Account;