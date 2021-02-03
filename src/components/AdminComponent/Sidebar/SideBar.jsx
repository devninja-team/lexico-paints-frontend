import React, {useEffect, useState} from 'react';
// import {useParams} from "react-router-dom";
import axios from "axios";
import {Link, useHistory} from "react-router-dom";
// import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import {useDispatch} from "react-redux";
import {useSelector} from "react-redux";

import  './index.scss';
import { setCurrentUser,setOtp, setRoute, setSession } from '../../../utils/Actions';
let id,path;
const SideBar = ()=> {
    const dispatch = useDispatch();
    const [menuType, setMenuType] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showReset,setShowReset] = useState(true);
    const [showButtons,setShowButtons] = useState(false);
    const [otp,setOTP] = useState('');
    const [minutes,setMinutes] = useState(0);
    const [seconds,setSeconds] = useState(0);
    const [showVerifyButtons, setShowVerifyButtons] = useState(false);
    const [active, setActive] = useState(0);
    const history = useHistory();
    const generated_otp = useSelector(state => state.otp);
    let timerOn = true;
    useEffect(() => {
        let allCookies = document.cookie;
        let cookieArray = allCookies.split(';');
        for(var i=0; i<cookieArray.length; i++) {
            id = cookieArray[0].split('=')[1];
        }
        path = window.location.pathname;
        if(path === "/accountinfo") {
            setMenuType('Account Information');
            setActive(0);
            setShowVerifyButtons(true);
        }else if(path === "/accountinfo/user" || path === "/accountinfo/adduser" || path === "/accountinfo/edituser") {
            setMenuType('User Access');
            setActive(1);
        }else if(path === "/accountinfo/storage" || path === "/accountinfo/addstorage") {
            setMenuType('Storage Details');
            setActive(2);
        }
        else if(path === "/accountinfo/address") {
            setMenuType('Address Book');
            setActive(3);
        }
    }, []);

    const sendOTP = (type) => {
        setShowButtons(true);
        setOTP("");
        // console.log("id vlue",id,type)
        axios.post('https://api-prod.tftc.company/admin/request_otp',{type:type, customer_id:id})
            .then(res => {
                // console.log("otp request response",res.data)
                setShowButtons(false);
                if(res.data.status === 200 && res.data.message === "EMAIL OTP Sent") {
                    // setOTP(res.data['otp']);
                    timer(600);
                    dispatch(setOtp({otp:res.data['otp']}))
                    setShowReset(false);

                }
                else if(res.data.status === 200 && res.data.message === "SMS OTP Sent") {
                    // setOTP(res.data['otp']);
                    timer(600);
                    dispatch(setOtp({otp:res.data['otp']}))
                    setShowReset(false);
                }
                else if(res.data.status === 200 && res.data.message === "To number  is not in a valid format") {
                    setShowReset(true);
                    dispatch(setOtp({otp:"Invalid phone number"}))
                }
            }).catch(err => {
                // dispatch(setCurrentUser({isLoggedIn:false,id:'', isVerified:false}));
            console.log(err);
            // dispatch(setSession());
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
                // dispatch(setCurrentUser({isLoggedIn:false,id:'', isVerified:false}));
            console.log(err);
            // dispatch(setSession());
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
    const handlePush = (type) => {
        // console.log("type",type,path)
        if(type === "/accountinfo") {
            setShowVerifyButtons(true);
            setActive(0);
            dispatch(setRoute({route:"/accountinfo"}))
        }else if(type === "/accountinfo/user") {
            setShowVerifyButtons(false);
            setActive(1);
            dispatch(setRoute({route:"/accountinfo/user"}))
        }
        else if(type === "/accountinfo/storage") {
            setShowVerifyButtons(false);
            setActive(2);
            dispatch(setRoute({route:"/accountinfo/storage"}))
        }
        else if(type === "/accountinfo/address") {
            setShowVerifyButtons(false);
            setActive(3);
            dispatch(setRoute({route:"/accountinfo/address"}))
        }
        history.push(type);
    }
    return (
        <div className="sidebar-menu-wrap">
            <div className="sidebar-menu d-none d-md-block">
                <ul>
                    <li>
                        <a className={active===0 ? "active":""} onClick = {() => handlePush('/accountinfo')}>Account Information</a>
                    </li>
                    <li>
                        <a className={active===1 ? "active":""} onClick = {() => handlePush('/accountinfo/user')}>USER ACCESS</a>
                    </li>
                    <li>
                        <a className={active===2 ? "active":""} onClick = {() => handlePush('/accountinfo/storage')}>STORAGE DETAILS</a>
                    </li>
                    <li>
                        <a className={active===3 ? "active":""} onClick = {() => handlePush('/accountinfo/address')}>ADDRESS BOOK</a>
                    </li>
                    {/* <li>
                        <a href="#">Invoices</a>
                    </li> */}
                </ul>
            </div>
            <div className="sidebar-btn-list d-none d-md-block mt-5">
                {
                    showVerifyButtons ? 
                    (
                        <>
                        <Button className="mt-3" variant="primary" disabled={showReset || !generated_otp} onClick={()=>resetPassword()}>RESET PASSWORD</Button>
                        <Button className="mt-3" variant="primary" disabled={showButtons} onClick={()=>sendOTP("EMAIL")}>Send email OTP</Button>
                        <Button className="mt-3" variant="primary" disabled={showButtons} onClick={()=>sendOTP("SMS")}>Send SMS OTP</Button>
                        </>
                    ): ""
                }
                

            </div>
            <div className="sidebar-dropdown-mobile d-block d-md-none">
                <div className="custom-select-wrapper d-flex align-items-center">
                    <div className={isMenuOpen ? "custom-selectDrop open":"custom-selectDrop"}>
                            <div className="custom-select__trigger" onClick={()=>setIsMenuOpen(!isMenuOpen)}>
                                <span>{menuType}</span>
                            <div className="arrow"></div>
                        </div>
                        <div className="custom-options">
                            <span className={menuType === 'Account Information' ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setMenuType('Account Information'); setIsMenuOpen(false); setIsMenuOpen(!isMenuOpen); dispatch(setRoute({route:"/accountinfo"}));history.push("/accountinfo")}}>ACCOUNT INFORMATION</span>
                            <span className={menuType === 'User Access' ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setMenuType('User Access'); setIsMenuOpen(false); setIsMenuOpen(!isMenuOpen); dispatch(setRoute({route:"/accountinfo/user"})); history.push("/accountinfo/user")}} >USER ACCESS</span>
                            <span className={menuType === 'Storage Details' ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setMenuType('Storage Details'); setIsMenuOpen(false); setIsMenuOpen(!isMenuOpen); dispatch(setRoute({route:"/accountinfo/storage"})); history.push("/accountinfo/storage")}}>STORAGE DETAILS</span>
                            <span className={menuType === 'Addresss Book' ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setMenuType('Address Book'); setIsMenuOpen(false); setIsMenuOpen(!isMenuOpen); dispatch(setRoute({route:"/accountinfo/address"})); history.push("/accountinfo/address")}}>ADDRESS BOOK</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideBar;