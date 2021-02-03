import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Header from "./Common/Header/Header";
import Login from "./LoginComponent/Login";
import { Redirect} from "react-router-dom";
import {connect} from 'react-redux';
import '../App.scss';
import PasswordReset from "./LoginComponent/PasswordReset";
import ChangePassword from "./LoginComponent/ChangePassword";
import Account from "./Account info/Account/Account";
import OTPModal from "./MainComponent/Modal/OTPModal";
import LoginOtp from "./MainComponent/Modal/LoginOTP";
import ErrorModal from "./MainComponent/Modal/ErrorModal";
import NotFound from "./404/NotFound";
import HeaderAdmin from "./AdminComponent/Header/HeaderAdmin";
import AccountInfo from "./Account info/AccountInfo";
import SideBar from "./Common/Sidebar/SideBar";
import CustomerMain from "./CustomerMain/CustomerMain";
import Orders from "./Account info/Orders/Orders";
import Communication from "./Account info/Communication/Communication Main/Communication";
import Calls from "./Account info/Communication/Calls";
import Notes from "./Account info/Communication/Notes";
import Emails from "./Account info/Communication/Emails";
import Chats from "./Account info/Communication/Chats";
import Texts from "./Account info/Communication/Texts";
import EmailsMob from "./Account info/Communication/EmailsMob";
import ChatsMob from "./Account info/Communication/ChatsMob";
import Leads from "./Leads/Leads";
import CustomerLeads from "./Leads/CustomerLeads";  
import Dashboard from "./Dashboard/Dashboard";
import Vendors from "./Vendors/Vendors";
import VendorsInfo from "./Vendors/VendorsInfo";
import Transaction from "./Transaction/Transaction";
import IndividualTransaction from "./Transaction/IndividualTransaction";
import IndividualOrders from "./Purchase Orders UK/IndividualOrders";
import PurchaseOrders from "./Purchase Orders UK/Orders";
import EmailsComms from "./Comms/Emails";
import ChatsComms from "./Comms/Chats";
import CallsComms from "./Comms/Calls";
import Comms from "./Comms/Comms";
import Tasks from "./Tasks/Tasks";
import Invoice from "./AddInvoice/Invoice";

import Cola from "./Cola/Cola";
import Prospects from "./Prospects/Prospects";
import UniversalSearch from "./Global Search/GlobalSearch";
import Logistics from "./Logistics/Logistics";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setSession } from "../utils/Actions";
import Calendar from "./Calendar/Calendar";
import Inventory from "./Account info/Inventory/Inventory";
import VendorInventory from "./Vendors/VendorInventory";
import Publish from "./Publish Menu/Publish";
import VendorProspect from "./Vendors/VendorProspect";
import CellarWineDetails from "./Account info/Account/CellarWineDetails";
import Cellar from "./Account info/Cellar/Cellar";
import VendorTier from "./Publish Parameters/VendorTier";
import UserActivity from "./Monitor/UserActivity";
import SalesCalendar from "./Calendar/SalesCalendar";
import LogisticsCalendar from "./Calendar/LogisticsCalendar";
import CaseControl from "./Publish Parameters/CaseControl";
import MarketException from "./Publish Parameters/MarketException";
import VendorException from "./Publish Parameters/VendorExceptions";
// import  from "./Account info/Communication/Calls"
//user routes
const protectedRoutes = ['/','/login','/loginotpemail','/loginotsms','/otpmodal','/account','/errorotp','/reset','/customermain'];
const publicRoutes = ['/wine','/change','/reset',"/prospects","/logistics","/global","/accountinfo",'/accountinfo/communication','/accountinfo/orders',"/accountinfo/inventory","/accountinfo/cellar","/accountinfo/communication/notes",
    "/accountinfo/communication/emails", "/accountinfo/communication/calls","/accountinfo/communication/chats","/accountinfo/communication/texts","/leads","/customerleads",
    "/dashboard","/vendors","/vendor-prospect","/vendorsinfo","/transaction","/individualtrans","/purchase","/individualpurchase","/comms","/comms/emails","/comms/calls",
    "/comms/chats","/addinvoice","/tasks","/cola","/email-mob","/create-invoice","/calendar/master","/vendor-inventory","/publish","/parameter/tier", "/parameter/control", "/parameter/exception","/parameter/vendor-exception",
    "/activity/user","/accountinfo/cellarwines", "/accountinfo/cellar",
    "/calendar/sales","/calendar/logistics"];
//admin routes
const protectedRoutesAdmin = ['/','/login','/customer','/loginotpemail','/loginotsms','/otpmodal','/errorotp','/reset'];
const publicRoutesAdmin = ['/accountinfo/info','/accountinfo/storage','/accountinfo/edituser','/accountinfo/adduser','/accountinfo/addstorage','/accountinfo/address', '/accountinfo','/accountinfo/user','/change','/reset','/accountlist','/customer']

const found_private = protectedRoutes.find(element => element === window.location.pathname);
// console.log("found private")
const found_public = publicRoutes.find(element => element === window.location.pathname);

const found_private_admin = protectedRoutesAdmin.find(element => element === window.location.pathname);
const found_public_admin = publicRoutesAdmin.find(element => element === window.location.pathname);

const Home = (props) => {
    // console.log('props',window.location.pathname)
    const fetch = useSelector(state => state.fetch);
    const query = useSelector(state => state.userRegion);
    const [accounts, setAccounts] = useState({});
    const [toggle,setToggle] = useState(false);
    const dispatch = useDispatch();
    const [calls, setCalls] = useState();
    const [chats, setChats] = useState();
    const [emails, setEmails] = useState();
    const [notes, setNotes] = useState();
    const [texts, setTexts] = useState();
    const [communication, setcommunication] = useState();
    const [emailList, setEmailList] = useState();
    const [phoneList, setCallList] = useState();
    const [link, setLink] = useState();
    const [replyEmailList, setReplyEmailList] = useState();
    const [eventList, setEventList] = useState();
    const [signatureDetails, setSignatureDetails] = useState();

    const handleAccounts = (value) => {
        setAccounts(value);
    }

    useEffect(() => {
        handleFetchInfo();
    }, [fetch, localStorage.getItem('customer_id')]);

    const fetchInfo = () => {
        if(localStorage.getItem("customer_id")) {
            axios.post('/accounts/accountinfo'+query,{
                customer_id:localStorage.getItem('customer_id')
            }).then((res) => {
                // console.log("Home.jsx api", res.data)
                setcommunication(res.data.communication);
                setCalls(res.data.communication.calls.results);
                setCallList(res.data.communication.calls.phones);
                setChats(res.data.communication.chat);
                setEmails(res.data.communication.emails.results);
                setEmailList(res.data.communication.emails.email_addresses);
                setNotes(res.data.communication.notes);
                setTexts(res.data.communication.text);
                setLink(res.data.mail_link);
                setReplyEmailList(res.data.communication.reply_from);
                setEventList(res.data.events);
                setSignatureDetails(res.data.communication.signature);
    
            }).catch((error) => {
                console.log(error);
                // dispatch(setSession());
            });
        }
    }
    const fetchLeadInfo = () => {
        axios.post('/accounts/leadinfo'+query,{
            customer_id:localStorage.getItem('customer_id')
        }).then((res) => {
            // console.log("Home.jsx LEAD api", res.data)
            setcommunication(res.data.communication);
            setCalls(res.data.communication.calls.results);
            setCallList(res.data.communication.calls.phones);
            setChats(res.data.communication.chat);
            setEmails(res.data.communication.emails.results);
            setEmailList(res.data.communication.emails.email_addresses);
            setNotes(res.data.communication.notes);
            setTexts(res.data.communication.text);
            setLink(res.data.mail_link);
            setReplyEmailList(res.data.communication.reply_from);
            setEventList(res.data.events);
            setSignatureDetails(res.data.communication.signature);
        }).catch((error) => {
            console.log(error);
            // dispatch(setSession());
        });
    }
    const handleFetchInfo = () => {
        if(localStorage.getItem('customer_id') && (localStorage.getItem('customer_type')==="Customer" || localStorage.getItem('customer_type')==="Vendor")) {
            fetchInfo();
         }
         else {
             if(localStorage.getItem('customer_id')) {
                fetchLeadInfo();
            }
         }
    }
    const path = window.location.pathname
    // console.log("path name",path)
        if(props.isAuthenticated && props.isVerified) {
            if(props.role === "user") {
                return (
                    <Router>
                        <div>
                            <Route path="/">
                                {
                                    found_private ?
                                        (props.isPasswordReset ?
                                            <Redirect to='/reset'></Redirect>:
                                            <Redirect to="/customermain"></Redirect>) :
                                        (found_public ?
                                            <Redirect to={path}> </Redirect> :
                                            <Redirect to="/404"></Redirect>)
                                }
                                <Route path="/customermain">
                                    <Header toggle={toggle} setButtonToggle={(t) => setToggle(t)}/>
                                    <div className="main-wrapper d-flex justify-content-between">
                                        <SideBar toggle={toggle} />
                                        <div className={ toggle ? "middle-content open" : "middle-content"} toggle={toggle}>
                                            <CustomerMain/>
                                        </div>
                                    </div>
                                </Route>
                                <Route path="/404" component={NotFound}>
                                </Route>
                            </Route>
                        </div>
                    </Router>
                )
            }
            else {
                return (
                    <Router>
                        <div>
                            <Route path="/">
                                {
                                    found_private_admin ?
                                        (props.isPasswordReset ?
                                            <Redirect to='/reset'></Redirect>:
                                            <Redirect to="/customer"></Redirect>) :
                                        (found_public_admin ?
                                            <Redirect to={path}> </Redirect> :
                                            <Redirect to="/404"></Redirect>)
                                }
                                {/* <Route path="/customer">
                                    <HeaderAdmin onFetchAccount={handleAccounts}/>
                                    <CustomerList list={accounts}/>
                                </Route> */}
                                {/* <Route path="/accountinfo"> */}
                                {/* <Route path="/accountinfo"> */}
                                    {/* <HeaderAdmin onFetchAccount={handleAccounts}/> */}
                                    {/* <Main/> */}
                                    {/* <SideBar/>
                                    <AccountInfo /> */}
                                {/* </Route> */}
                                {/* <Route path="/accountlist">
                                    <HeaderAdmin onFetchAccount={handleAccounts}/>
                                    <AccountList />
                                </Route> */}
                                <Route path="/reset" component={PasswordReset}>
                                </Route>
                                <Route path="/change" component={ChangePassword}>
                                </Route>
                                <Route path="/404" component={NotFound}>
                                </Route>
                            </Route>
                        </div>
                    </Router>
                )
            }

        }
        else if(props.isAuthenticated === true) {
            return (
                <Router>
                    <div>
                        <Redirect to="/otpmodal"></Redirect>
                        <Route exact path="/otpmodal">
                            <OTPModal />
                        </Route>
                        <Route exact path="/errorotp">
                            <ErrorModal />
                        </Route>
                        <Route exact path="/loginotpemail">
                            <LoginOtp name="email"/>
                        </Route>
                        <Route exact path="/loginotpsms" >
                            <LoginOtp name="sms"/>
                        </Route>
                    </div>
                </Router>
            )
        }
        else {
            return (
                <Router>
                    <div>
                        <Redirect to="/login"></Redirect>
                        <Route exact path="/login">
                            <Login />
                        </Route>
                    </div>
                </Router>
            )
        }


};
function mapStateToProps(state) {
    return {
        isAuthenticated:  state.isAuthenticated,
        isVerified: state.isVerified,
        isPasswordReset :state.isPasswordReset,
        role:state.role
    }
}
export default connect(mapStateToProps)(Home);
