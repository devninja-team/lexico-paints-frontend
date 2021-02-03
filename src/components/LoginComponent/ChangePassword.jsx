import React from 'react';
// import './Index.scss';
import LoginLogo from "../../images/westgarth-logo.png";

const ChangePassword = () => {
    return (
        <div className="login-page">
            <div className="login-page-center">
                <form className="login-form">
                    <div className="login-logo">
                        <a href="demo">
                            <img src={LoginLogo} alt=""/>
                        </a>
                    </div>
                    <div className="login-form-list change-password">
                        <div className="change-password-row">
                            <div className="change-password-title">
                                <a href="demo">password changed</a>
                            </div>
                            <div className="login-title">
                                <span>Log In</span>
                            </div>
                        </div>
                        <div className="login-list-row">
                            <div className="login-list">
                                <label>Email</label>
                                <input type="text" name="email" value="test@gmail.com" required/>
                            </div>
                            <div className="login-list">
                                <label>repeat password</label>
                                <input type="password" name="password" value="test" required/>
                            </div>
                            <div className="login-list login-btn-list">
                                <button className="login-btn" type="submit" disabled=""> Log in </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;