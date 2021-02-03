import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button'
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {login, setCurrentUser, setUserRole} from '../../../utils/Actions/index'
import {connect} from  'react-redux';
import axios from 'axios';
import setAuthorizationToken from "../../../utils/AuthHeaders";
const LoginOtp = ({name, login}) => {
    const [otp,setOtp] = useState('')
    const [minutes,setMinutes] = useState(0);
    const [seconds,setSeconds] = useState(0);
    let timerOn = true;
    const [active,setActive] = useState(false);
    const auth = useSelector(state => state.auth)
    const username =  useSelector(state => state.username)
    const password =  useSelector(state => state.password)
    const usercode = useSelector(state => state.user)
    const id = useSelector((state) =>state.user);
    const otp_type = useSelector((state) =>state.type);
    const query = useSelector(state => state.userRegion);
    const dispatch = useDispatch();

    const history = useHistory();
    const [error,setError] = useState('');
    let str_email,str_sms,str_4,str_domain;
    if(name==="sms"){
        str_4 = otp_type.substr(otp_type.length-4,otp_type.length);
    }
    else {
        str_email = id.split("@");
        str_4 = str_email[0].substr(str_email[0].length-4,str_email[0].length);
        str_domain = str_email[1];
    }

    const sendOTP = (type)=> {
        setAuthorizationToken(false,false,"7PHs6U33kX",type);
        setActive(true);
        axios.post("/accounts/otp_request"+query,{email: id}).then((res)=>{
            // console.log("res data",res.data)
            setActive(false);
            if(res.data.message === "EMAIL OTP Sent" && res.data.status === 200) {
                setAuthorizationToken(false,res.data["user-code"],"7PHs6U33kX",type)
                setError("OTP sent successfully!");
                history.push('/loginotpemail');
            }else if(res.data.message === "SMS OTP Sent" && res.data.status === 200) {
                setAuthorizationToken(false,res.data["user-code"],"7PHs6U33kX",type)
                setError("OTP sent successfully!");
                history.push('/loginotpsms');
            }else if(res.data.message === "SMS OTP Sent error" && res.data.status === 200) {
                setError("Invalid Contact!");
                setActive(false);
            }
            else if(res.data.message === "EMAIL OTP Sent error" && res.data.status === 200) {
                setError("Invalid Email!");
                setActive(false);
            }
        }).catch((error)=>{
            console.log(error);
            setActive(false);
        })
    }

    const handleClick = (e,otp,auth,usercode,name,username,password) => {
        if(e.target.value.length > 6 || e.target.value.length===0) {
            e.preventDefault();
            setError('Enter valid OTP');
        }
        else {
            let data = {
                email:username,
                password: password
            }
            axios.post("/accounts/verify"+query,{
                otp:otp
            }).then((res)=>{
                if (res.data.status === 200 && res.data.message==="Successfully login.") {
                    timerOn = false;
                    // console.log("LOGIN OTP RESPONSE",res.data)
                    const token  = res.data['token'];
                    const userCode = res.data['user-code']
                    const role = res.data['role']
                    setAuthorizationToken(token,userCode, '7PHs6U33kX',false);
                    localStorage.setItem('jwtToken', token);
                    localStorage.setItem('user',userCode );
                    localStorage.setItem('role', role);
                    dispatch(setCurrentUser({isLoggedIn: true,id:userCode,isVerified:true,isPasswordReset:false}))
                    dispatch(setUserRole({role:role}))
                }else if (res.data.status === 200 && res.data.message==="Wrong or expired otp.") {
                    setError(res.data.message)
                }
            }).catch((err)=>{
                console.log(err)
            });
        }
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
            history.push("/otpmodal")
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
    useEffect(()=>{
        timer(600);
    },[])
    return (
        <div className="login-forgot-page login-forgot-otp">
            <div className="login-forgot-block">
                <div className="forgot-card d-flex flex-column h-100">
                    <div className="forgot-remaining text-center">
                        <span>{minutes}:{seconds} Remaining</span>
                   </div>
                    <div className="forgot-from text-center flex-fill d-flex justify-content-center flex-column">
                        <div>
                            <div className="forgot-note">
                                { name==="sms" ? <span>Please enter the 6 digit code sent to your number ******{str_4} </span> : <span>Please enter the 6 digit code sent to your email ********{str_4}@{str_domain}</span>}
                            </div>
                            <div className="forgot-note otp-error">
                                <span>{error}</span>
                            </div>
                            <div className="forgot-input">
                                <input type="password" onChange={(e)=>setOtp(e.target.value)} className="text-input" required />
                            </div>
                            <div className="forgot-btn">
                                <Button className="login-btn" value={otp} onClick={(e)=>handleClick(e,otp,auth,usercode,name,username,password)} variant="primary" >Log in</Button>
                            </div>
                        </div>
                    </div>
                    <div className="forgot-bottom">
                        <div className="forgot-bottom-row d-flex justify-content-between align-items-center flex-column flex-md-row">
                            <div className="forgot-link-list">
                                {
                                    name === "sms" ?
                                        <button onClick={
                                            () => {sendOTP("EMAIL")}} className="forgot-link" disabled={active}>EMAIL One Time Password</button>:
                                        <button   onClick={
                                            () => {sendOTP("SMS")}} className="forgot-link" disabled={active}>SMS One Time Password</button>
                                }
                            </div>
                            <div className="forgot-link-list">
                                {
                                    name === "sms" ?
                                        <button onClick={
                                            () => {sendOTP("SMS")}} className="forgot-link" disabled={active}>Resend One Time Password
                                            </button>:
                                        <button   onClick={
                                            () => {sendOTP("EMAIL")}} className="forgot-link" disabled={active}>Resend One Time Password
                                        </button>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default connect('',{login})(LoginOtp);