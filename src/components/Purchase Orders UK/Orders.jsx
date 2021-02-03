import React, { useState } from "react";
// import {
//     NavLink
// } from "react-router-dom";
// import {useSelector} from "react-redux";
// import Container from 'react-bootstrap/Container';
// import Navbar from 'react-bootstrap/Navbar';
// import Nav from 'react-bootstrap/Nav';
// import './index.scss';
// import Card from 'react-bootstrap/Card';
// import {Link} from "react-router-dom";
// import Button from 'react-bootstrap/Button';
// import Table from 'react-bootstrap/Table';
// import logo from '../../images/westgarth-logo.png';
// import closeIcon from '../../images/close-icon.svg';
import { useHistory } from 'react-router-dom';
import {connect} from "react-redux";
import {logout} from "../../utils/Actions";

import SearchIcon from '../../assets/images/search-icon.svg';
    
const Orders = () => {
    const [showcustomerSearch,setshowcustomerSearch] = useState(false);
    const history = useHistory();
    const handlePush = (path) => {
        history.push(path);
    }
    return (
        <div className="individual-wrapper">
            Order Page
        {/* <header>
            <h5 className="mb-0">Transaction #10292</h5>
            <div className={showcustomerSearch ? "search-customer show" : "search-customer"}>
                    <div className="search-box">
                        <input className="search-input" type="text" placeholder="Search Orders"/>
                        <button className="search-btn" type="button" onClick={() => setshowcustomerSearch(!showcustomerSearch)}>
                            <img src={SearchIcon} alt=""/>
                        </button>
                    </div>
                </div>
        </header>
        <div className="recent-list light-blue">
                <Card className="recent-card">
                    <Card.Body>
                        <div className="detail-list d-flex">
                            <div className="detail-list-left">
                                <span>#1234</span>
                                <label>Shopify Order Number</label>
                            </div>
                            <div className="detail-list-left">
                                <span>dd mmm yyyy</span>
                                <label>Order Date</label>
                            </div>
                            <div className="detail-list-left">
                                <span>dd mmm yyyy</span>
                                <label>Payment Date</label>
                            </div>
                            <div className="detail-list-left">
                                <span>status</span>
                                <label>Payment Status</label>
                            </div>
                            <div className="detail-list-left">
                                <span>dd mmm yyyy</span>
                                <label>Payment Status</label>
                            </div>
                            <div className="detail-list-left">
                                <span>dd mmm yyyy</span>
                                <label>Estimated Shipping Date</label>
                            </div>
                            <div className="detail-list-left">
                                <span>Email/Phone/Web</span>
                                <label>Order Type</label>
                            </div>
                        </div>
                        </Card.Body>
                </Card>
            </div>
            <div className="all-customer-wrapper">
                <div className="all-customer-data">
                        
                        <div className="customer-table">
                            <Table responsive>
                                <thead>
                                <tr>
                                    <th># </th>
                                    <th>Product</th>
                                    <th>Qty</th>
                                    <th>Price</th>
                                    <th>State Tax</th>
                                    <th>County Tax</th>
                                    <th>Shipping Option</th>
                                    <th>Shipping Cost</th>
                                    <th>Shipping Status</th>
                                    <th>Rotation #</th>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><Link to="/accountinfo">1</Link></td>
                                        <td>
                                        <div className="add">
                                                <h6>Wine Name  6x75</h6> 
                                                <span>Region, Vintage</span>  
                                                <span>6x75</span>
                                                <span>LWIN: 54688511466982164564</span>
                                            </div>
                                        </td>
                                        <td>1</td>
                                        <td>$</td>
                                        <td>$</td>
                                        <td>$</td>
                                        <td>60-90 days with OWC</td>
                                        <td> $ 36</td>
                                        <td>N/A </td>
                                        <td>0985230958</td>                                    
                                    </tr>
                              </tbody>
                            </Table>
                        </div>
                        <div className="customer-table-mobile">
                            <Table>
                                <thead>
                                    <tr>
                                        <th width="40%">Customer Name</th>
                                        <th width="60%">
                                            <div className="th-filter d-flex justify-content-between align-items-center">
                                                <span>Location</span>
                                                <Button variant="link">
                                                    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M17 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V3.59C0 4.113 0.213 4.627 0.583 4.997L6 10.414V18C6.0002 18.1704 6.04387 18.3379 6.1269 18.4867C6.20992 18.6354 6.32955 18.7605 6.47444 18.8502C6.61934 18.9398 6.78471 18.9909 6.9549 18.9988C7.1251 19.0066 7.29447 18.9709 7.447 18.895L11.447 16.895C11.786 16.725 12 16.379 12 16V10.414L17.417 4.997C17.787 4.627 18 4.113 18 3.59V1C18 0.734784 17.8946 0.48043 17.7071 0.292893C17.5196 0.105357 17.2652 0 17 0ZM10.293 9.293C10.2 9.38571 10.1262 9.4959 10.0759 9.61724C10.0256 9.73857 9.99981 9.86866 10 10V15.382L8 16.382V10C8.00019 9.86866 7.9744 9.73857 7.92412 9.61724C7.87383 9.4959 7.80004 9.38571 7.707 9.293L2 3.59V2H16.001L16.003 3.583L10.293 9.293Z"/>
                                                    </svg>
                                                </Button>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><Link to="/accountinfo">Adam Bellet</Link></td>
                                        <td>
                                            <div className="location-col d-flex justify-content-between align-items-center">
                                                <span>GA US; 30040</span>
                                                <div className="td-dot">
                                                    <i className="dot-icon red-color"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Link to="/accountinfo">Adam Bellet</Link></td>
                                        <td>
                                            <div className="location-col d-flex justify-content-between align-items-center">
                                                <span>GA US; 30040</span>
                                                <div className="td-dot">
                                                    <i className="dot-icon blue-color"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Link to="/accountinfo">Adam Bellet</Link></td>
                                        <td>
                                            <div className="location-col d-flex justify-content-between align-items-center">
                                                <span>GA US; 30040</span>
                                                <div className="td-dot">
                                                    <i className="dot-icon green-color"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Link to="/accountinfo">Adam Bellet</Link></td>
                                        <td>
                                            <div className="location-col d-flex justify-content-between align-items-center">
                                                <span>GA US; 30040</span>
                                                <div className="td-dot">
                                                    <i className="dot-icon yellow-color"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Link to="/accountinfo">Adam Bellet</Link></td>
                                        <td>
                                            <div className="location-col d-flex justify-content-between align-items-center">
                                                <span>GA US; 30040</span>
                                                <div className="td-dot">
                                                    <i className="dot-icon grey-color"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Link to="/accountinfo">Adam Bellet</Link></td>
                                        <td>
                                            <div className="location-col d-flex justify-content-between align-items-center">
                                                <span>GA US; 30040</span>
                                                <div className="td-dot">
                                                    <i className="dot-icon red-color"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Link to="/accountinfo">Adam Bellet</Link></td>
                                        <td>
                                            <div className="location-col d-flex justify-content-between align-items-center">
                                                <span>GA US; 30040</span>
                                                <div className="td-dot">
                                                    <i className="dot-icon blue-color"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Link to="/accountinfo">Adam Bellet</Link></td>
                                        <td>
                                            <div className="location-col d-flex justify-content-between align-items-center">
                                                <span>GA US; 30040</span>
                                                <div className="td-dot">
                                                    <i className="dot-icon green-color"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Link to="/accountinfo">Adam Bellet</Link></td>
                                        <td>
                                            <div className="location-col d-flex justify-content-between align-items-center">
                                                <span>GA US; 30040</span>
                                                <div className="td-dot">
                                                    <i className="dot-icon yellow-color"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Link to="/accountinfo">Adam Bellet</Link></td>
                                        <td>
                                            <div className="location-col d-flex justify-content-between align-items-center">
                                                <span>GA US; 30040</span>
                                                <div className="td-dot">
                                                    <i className="dot-icon grey-color"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><Link to="/accountinfo">Adam Bellet</Link></td>
                                        <td>
                                            <div className="location-col d-flex justify-content-between align-items-center">
                                                <span>GA US; 30040</span>
                                                <div className="td-dot">
                                                    <i className="dot-icon red-color"></i>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
            </div>  
            <div className="shipping-wrap">
                <h5>Shipping</h5>
                <div className="shipment-element">
                <Table responsive>
                    <thead>
                        <tr>
                            <th>Line #</th>
                            <th>Rotation #</th>
                            <th>Status </th>
                            <th>Barcode</th>
                            <th>Weight</th>
                            <th>Tracking</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>0985230958</td>
                            <td>Landed</td>
                            <td>2938570239185672370</td>
                            <td>1.5kg</td>
                            <td><Link to="#">Link</Link></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td>0985230958</td>
                            <td>Landed</td>
                            <td>2938570239185672370</td>
                            <td>1.5kg</td>
                            <td><Link to="#">Link</Link></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </Table>
                </div>
            </div>            
        <div className="row">
            <div className="col-md-4 col-12">
                <h5>Customer Details</h5>
                <div className="customer-card">
                    <div className="information-card">
                        <div className="info">
                            <span className="text">Customer name</span>
                            <h6>Name</h6>
                        </div>
                        <div className="info">
                            <div className="desc">
                                <span>18472 Random Street</span> 
                                <span>alphaville</span> 
                                 <span>CA, 90210 </span> 
                               <span>USA</span> 
                            </div>
                            <h6>Name</h6>
                        </div>
                    </div>
                    <div className="information-card">
                        <div className="info">
                            <div className="text">customer@gmail.com</div>
                            <h6>Email</h6>
                        </div>
                        <div className="info">
                        <div className="text">Customer name</div>
                            <h6>Name</h6>
                        </div>
                    </div>
                    
                    <div className="information-card">
                        <div className="info">
                        <div className="text"> WEST.04634.US</div>
                            <h6>Account Number</h6>
                        </div>
                        <div className="info">
                        <a href="">View Profile</a>
                    </div>
                   </div>
                </div>
                </div>
                <div className="col-md-8 col-12">
                    <h5>Notes</h5>
                    <div className="note-card">
                       
                        <span>DATE: 26/04/2020 TIME: 14:30 REP: ALEX</span>
                        <p>
                        Mi lectus ullamcorper interdum turpis. Quam cras libero, quis neque. Mi neque quam urna aliquam tortor, 
                        ac in pellentesque. Posuere iaculis vulputate dolor, sagittis. Aliquam id amet, turpis urna duis in enim risus. Mauris ultricies in vitae tincidunt.
                        </p>
                        <div className="footer-btn d-flex justify-content-between">
                        <div className="table-prev">
                                        <Button className="btn-next-prev">{'< Previous'}</Button>
                                </div>
                                <div className="table-prev">
                                    <Button className="btn-next-prev">{'Next >'}</Button>
                                </div>
                        </div>
                    </div>
                    <div className="note-box">
                            <h5>Add Note</h5>
                            <div className="content-note">
                                <p>
                                I am text input that will save to the Previous contact section </p>
                                <p>Needs to be time/log in stamped to fill the rep and date columns
                                </p>
                            </div>
                          <div className="btn-save">
                                <a href="#">Save</a>
                          </div>
                            
                    </div>
              </div>
        </div> */}
        </div>
      )
};

export default connect(null,{logout})(Orders);
