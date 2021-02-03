import React from 'react';
import './index.scss';
const NotFound = () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="error-template">
                        <h1>Oops!</h1>
                        <h2>404 Not Found</h2>
                        <div className="error-details">
                            Sorry, an error has occured, Requested page not found!
                            
                        </div>
                        <a href="/">Click to go to Homepage</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;