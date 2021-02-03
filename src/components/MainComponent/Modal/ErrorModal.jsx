import React from 'react';

const ErrorModal = () => {
    return (
        <div className="login-forgot-page">
            <div className="login-forgot-block">
                <div className="error-card d-flex flex-column h-100">
                    <div className="error-note d-flex align-items-center px-3 px-md-4">
                        <span>the password entered does not match our records. this account has been blocked. </span>
                    </div>
                    <div className="forgot-bottom">
                        <div className="forgot-bottom-row d-flex flex-column justify-content-center">
                            <div className="forgot-link-list text-center">
                                <a className="forgot-link" href="demo">Email Westgarth Wines</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*Enter {name} - OTP to LOGIN*/}
        </div>
    );
};

export default ErrorModal;