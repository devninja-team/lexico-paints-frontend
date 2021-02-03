import React, {useState} from 'react';
// import Button from "react-bootstrap/Button";
import {useHistory} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import setAuthorizationToken from "../../../utils/AuthHeaders";
import axios from "axios";
import { setSession } from '../../../utils/Actions';
import SessionModal from '../../Modals/SessionModal';
const OTPModal = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const id = useSelector((state) =>state.user);
    const query = useSelector(state => state.userRegion);
    const [active,setActive] = useState(false);

    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);

    const sendOTP = (type)=> {
        setAuthorizationToken(false,false,"7PHs6U33kX",type);
        setActive(true);
        axios.post("/accounts/otp_request"+query,{email: id}).then((res)=>{
            // console.log("res data",res.data)
            if(res.data.message === "EMAIL OTP Sent" && res.data.status === 200) {
                // console.log(res.data);
                setAuthorizationToken(false,res.data["user-code"],"7PHs6U33kX",type)
                history.push('/loginotpemail');
            }else if(res.data.message === "SMS OTP Sent" && res.data.status === 200) {
                setAuthorizationToken(false,res.data["user-code"],"7PHs6U33kX",type)
                history.push('/loginotpsms');
            }else if(res.data.message === "SMS OTP Sent error" && res.data.status === 200) {
                alert("Invalid Contact!")
                setActive(false);
            }else if(res.data.message === "EMAIL OTP Sent error" && res.data.status === 200) {
                alert("Invalid Email!")
                setActive(false);
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

    return (
        <div className="login-forgot-page">
            <div className="login-forgot-block">
                <div className="otp-card mt-4">
                    <div className="otp-note text-center mb-5">
                        <span>to verify your identity, please select an option to receive a one time password to your registered email or mobile number:</span>
                    </div>
                    <div className="forgot-bottom">
                        <div className="forgot-bottom-row d-flex flex-column justify-content-center">
                            <div className="forgot-link-list text-center mb-4">
                                <button onClick={
                                    () => {sendOTP("EMAIL")}} className="forgot-link" disabled={active}>Email One Time Password</button>
                            </div>
                            <div className="forgot-link-list text-center">
                                <button   onClick={
                                    () => {sendOTP("SMS")}} className="forgot-link" disabled={active}>SMS One Time Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage}/>
        </div>
    );
};

export default OTPModal;