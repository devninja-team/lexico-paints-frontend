import React, {useState} from 'react';
// import './Index.scss';
import LoginLogo from "../../images/westgarth-logo.png";
import axios from 'axios';
import setAuthorizationToken from "../../utils/AuthHeaders";
import {setCurrentUser,setUserRole} from "../../utils/Actions";
import {useDispatch, useSelector} from "react-redux";
const PasswordReset = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('')
    const dispatch = useDispatch();
    const query = useSelector(state => state.userRegion);

    const handleSubmit = (e) => {
        e.preventDefault();
        if(password === confirmPassword) {
            axios.post("https://api-prod.tftc.company/accounts/pass_reset"+query,{
                password,
                confirmPassword
            }).then((res)=>{
                if (res.data.status === 200 && res.data.message==="Successfully login.") {
                    const token  = res.data['token'];
                    const userCode = res.data['user-code'];
                    console.log("reset api data",res.data)
                    const role = res.data['role'];
                    setAuthorizationToken(token,userCode, '7PHs6U33kX',false);
                    localStorage.setItem('jwtToken', token);
                    localStorage.setItem('user',userCode );
                    localStorage.setItem('role', role);
                    dispatch(setCurrentUser({isLoggedIn: true,id:userCode,isVerified:true,isPasswordReset:false}))
                    dispatch(setUserRole({role:role}))
                }
            }).catch((error)=>{
                console.log(error.response.data);
            })
        }else {
            setError('Password & Confirm Password does not match')
        }
    }
    return (
        <div className="login-page">
            <div className="login-page-center">
                <form className="login-form" onSubmit={(e)=>handleSubmit(e)}>
                    <div className="login-logo">
                        <a href="demo">
                            <img src={LoginLogo} alt=""/>
                        </a>
                    </div>
                    <div className="login-form-list change-password">
                        <div className="change-password-row">
                            <div className="change-password-title msg-alert">
                                <a href="demo">{error}</a>
                            </div>
                        </div>
                        <div className="login-list-row">
                            <div className="login-list">
                                <label>new password</label>
                                <input type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
                            </div>
                            <div className="login-list">
                                <label>repeat password</label>
                                <input type="password" name="confirm_password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required/>
                            </div>
                            <div className="login-list login-btn-list">
                                <button className="login-btn" type="submit" disabled=""> RESET PASSWORD </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordReset;