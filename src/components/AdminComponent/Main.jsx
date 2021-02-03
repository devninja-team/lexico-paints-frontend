import React from 'react';
// import {Component, useEffect, useState} from 'react'
import SideBar from '../AdminComponent/Sidebar/SideBar';
import StorageDetails from '../AdminComponent/StorageDetails';
import AddressBook from '../AdminComponent/AddressBook';
import AccountInfo from '../AdminComponent/AccountInfo';
import AddUser from '../AdminComponent/AddUser';
import AddStorageAddress from '../AdminComponent/AddStorageAddress';
import Container from 'react-bootstrap/Container';
import {useEffect, useState} from 'react';
import axios from "axios";
import {useSelector} from "react-redux";
import {Link, useHistory} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import {useDispatch} from "react-redux";
import { setCurrentUser,setOtp, setRoute } from '../../utils/Actions/index';
import { BrowserRouter as Router, Route } from "react-router-dom";
import UserAccess from './UserAccess';
import EditUser from './EditUser';

let path,id;
const Main = ()=> {
    const [showVerifyButtons, setShowVerifyButtons] = useState(false);
    const [showReset,setShowReset] = useState(true);
    const [showButtons,setShowButtons] = useState(false);
    const dispatch = useDispatch();
    const [otp,setOTP] = useState('');
    const [minutes,setMinutes] = useState(0);
    const [seconds,setSeconds] = useState(0);
    let timerOn = true;
    
    const generated_otp = useSelector(state => state.otp);
    const route = useSelector(state => state.route);
    const query = useSelector(state => state.userRegion);

    useEffect(() => {
        let allCookies = document.cookie;
        let cookieArray = allCookies.split(';');
        for(var i=0; i<cookieArray.length; i++) {
            id = cookieArray[0].split('=')[1];
        }
        path = window.location.pathname;
        if(path === "/accountinfo") {
            // setShowVerifyButtons(true);
            dispatch(setRoute({route:"/accountinfo"}))
        }
    }, []);

    const sendOTP = (type) => {
        setShowButtons(true);
        setOTP("");
        // console.log("id vlue",id,type)
        axios.post('https://api-prod.tftc.company/admin/request_otp',{type:type, customer_id:id})
            .then(res => {
                setShowButtons(false);
                if(res.data.status === 200 && res.data.message === "EMAIL OTP Sent") {
                    setOTP(res.data['otp']);
                    timer(600);
                    dispatch(setOtp({otp:res.data['otp']}))
                    setShowReset(false);

                }
                else if(res.data.status === 200 && res.data.message === "SMS OTP Sent") {
                    setOTP(res.data['otp']);
                    timer(600);
                    setShowReset(false);
                    dispatch(setOTP({otp:res.data['otp']}))
                }
                else if(res.data.status === 200 && res.data.message === "To number  is not in a valid format") {
                    setShowReset(true);
                    dispatch(setOtp({otp:"Invalid phone number"}))
                }
            }).catch(err => {
                dispatch(setCurrentUser({isLoggedIn:false,id:'', isVerified:false}));
            console.log(err)
        })
    }
    const resetPassword = () => {
        setShowButtons(true);
        setShowReset(true);
        axios.post('https://api-prod.tftc.company/admin/reset_password',{customer_id:id})
            .then(res => {
                // console.log("otp info",res.data)
                setShowButtons(false);
                setShowReset(true);
                if(res.data.message === "password reset done!") {
                    alert(res.data.message);
                }
            }).catch(err => {
                dispatch(setCurrentUser({isLoggedIn:false,id:'', isVerified:false}));
            console.log(err)
        })
    }
    const timer = (remaining) => {
        var m = Math.floor(remaining / 60);
        var s = remaining % 60;

        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
        setMinutes(m);
        setSeconds(s);
        remaining -= 1;
        if(remaining === 0) {
            dispatch(setOtp({otp:""}));
            return 0;
        }

        if(remaining >= 0 && timerOn) {
            window.setTimeout(function() {
                timer(remaining);
            }, 1000);
            return;
        }

        // Do timeout stuff here
        // alert('Timeout for otp');
    }

        return (
            <div className="main-wrapper">
                <Container>
                <Router>
                    <div className="sidebar-middle-wrapper d-flex flex-column flex-md-row">
                        <div className="sidebar-block">
                            <SideBar/>
                        </div>
                        <div className="middle-content-block">
                            
                                <Route  exact path="/accountinfo/">
                                    <AccountInfo/>
                                </Route>
                                <Route path="/accountinfo/user">
                                    <UserAccess />
                                </Route>
                                <Route path="/accountinfo/storage">
                                    <StorageDetails />
                                </Route>
                                <Route path="/accountinfo/address">
                                    <AddressBook />
                                </Route>
                                <Route path="/accountinfo/adduser">
                                    <AddUser />
                                </Route>
                                <Route path="/accountinfo/addstorage">
                                    <AddStorageAddress />
                                </Route>
                                <Route path="/accountinfo/edituser/:params_id">
                                    <EditUser />
                                </Route>
                        </div>
                        <div className="sidebar-bottom-button d-block d-md-none">
                            <div className="sidebar-btn-list my-3 text-center">
                            {
                                route === "/accountinfo"? 
                                (
                                <>
                                    <Button className="mt-3" variant="primary" disabled={showReset || !generated_otp} onClick={()=>resetPassword()}>RESET PASSWORD</Button>
                                    <Button className="mt-3" variant="primary" disabled={showButtons} onClick={()=>sendOTP("EMAIL")}>Send email OTP</Button>
                                    <Button className="mt-3" variant="primary" disabled={showButtons} onClick={()=>sendOTP("SMS")}>Send SMS OTP</Button>
                                </>): ""
                            }
                            </div>
                        </div>
                    </div>
                    </Router>
                </Container>
            </div>
    )
}

export default Main;