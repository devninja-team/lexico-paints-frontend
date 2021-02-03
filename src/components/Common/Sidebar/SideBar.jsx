import React, { useState, useEffect } from 'react';
import { logout, setUserAccount } from '../../../utils/Actions';
import {connect, useSelector, useDispatch} from "react-redux";
import './Index.scss';
import { useHistory, useLocation} from 'react-router-dom';
const SideBar = (props) => {
    const history = useHistory();
    const [isRegionOpen, setIsRegionOpen] = useState(false);
    const query = useSelector(state => state.userRegion);
    const [region, setRegion] = useState("US");
    const location = useLocation();
    const [currentRoute, setCurrentRoute] = useState();
    const dispatch = useDispatch();

    const handlePush = (path) => {
        history.push(path);
    }
    const handleRegion = (region) => {
        localStorage.setItem("region",region);
        window.location.href="/customermain";
    }
    useEffect(() => {
        // console.log("pathname",location.pathname)
        setCurrentRoute(location.pathname);
        if(location.pathname==="/customermain") {
            localStorage.setItem("route-role","Customer");
        } else if(location.pathname==="/prospects") {
            localStorage.setItem("route-role","Prospect");
        } else if(location.pathname==="/leads") {
            localStorage.setItem("route-role","Lead");
        } else if(location.pathname==="/vendors") {
            localStorage.setItem("route-role","Vendor");
        } else if(location.pathname==="/vendor-prospect") {
            localStorage.setItem("route-role","Vendor-Prospect");
        } 
        if(query==="?region=UK") {
            setRegion("UK")
        }else {
            setRegion("US");
        }
    }, [])
    return (
        <div className={ props.toggle ? "sidebar-nav open" : "sidebar-nav"}>
            <div className="dropUp">
                    <div className="custom-select-wrapper d-flex align-items-center">
                        <div className={isRegionOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                        <div className="custom-select__trigger" onClick={()=>setIsRegionOpen(!isRegionOpen)}>
                                <span>{region}</span>
                                <div className="arrow">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                    </svg>
                                </div>
                            </div>
                            <div className="custom-options">
                                <span className={region === "UK" ? "custom-option selected":"custom-option"}  onClick={() => { setRegion("UK");setIsRegionOpen(false); handleRegion('UK');}}>UK</span>
                                <span className={region === "US" ? "custom-option selected":"custom-option"} onClick={() => { setRegion("US"); setIsRegionOpen(false); handleRegion('US');}}>US</span>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="default-menu">
                <a onClick={()=>{handlePush("/dashboard")}}>Dashboard</a>
            </div>
            <div className="sidebar-menu">
                <ul>
                    <li className="main-menu">
                        <a>ACCOUNTS</a>
                    </li>
                    <li>
                        <a className={currentRoute==="/global" ? "active":""} onClick={()=>{handlePush("/global")}}>Universal Search</a>
                    </li>
                    <li>
                        <a className={(localStorage.getItem("route-role")==="Customer" && (
                            currentRoute==="/customermain" || currentRoute==="/accountinfo" || currentRoute==="/accountinfo/communication"|| currentRoute==="/accountinfo/communication/orders"
                            || currentRoute==="/accountinfo/communication/inventory" || currentRoute==="/create-invoice"
                        )) ? "active":""} onClick={()=>{handlePush("/customermain")}}>Customers</a>
                    </li>
                    <li>
                        <a className={(localStorage.getItem("route-role")==="Prospect" && (
                            currentRoute==="/prospects" || currentRoute==="/accountinfo" || currentRoute==="/accountinfo/communication"|| currentRoute==="/accountinfo/communication/orders"
                            || currentRoute==="/accountinfo/communication/inventory" || currentRoute==="/create-invoice"
                        )) ? "active":""} onClick={()=>{handlePush("/prospects")}}>Prospects</a>
                    </li>
                    <li>
                        <a className={(localStorage.getItem("route-role")==="Lead" && 
                        (currentRoute==="/leads" || currentRoute==="/accountinfo" || currentRoute==="/accountinfo/communication"|| currentRoute==="/accountinfo/communication/orders"
                        || currentRoute==="/accountinfo/communication/inventory" || currentRoute==="/create-invoice"))  ? "active":""} onClick={()=>{handlePush("/leads")}}>Leads</a>
                    </li>
                    <li>
                        <a className={(localStorage.getItem("route-role")==="Vendor" && 
                            (currentRoute==="/vendors"|| currentRoute==="/accountinfo" || currentRoute==="/accountinfo/communication"|| currentRoute==="/accountinfo/communication/orders"
                            || currentRoute==="/accountinfo/communication/inventory" || currentRoute==="/create-invoice")
                            ) ? "active":""} 
                            onClick={()=>{handlePush("/vendors")}}>Vendors</a>
                    </li>
                    <li>
                        <a className={(localStorage.getItem("route-role")==="Vendor-Prospect" && 
                            (currentRoute==="/vendor-prospect"|| currentRoute==="/accountinfo" || currentRoute==="/accountinfo/communication"|| currentRoute==="/accountinfo/communication/orders"
                            || currentRoute==="/accountinfo/communication/inventory" || currentRoute==="/create-invoice")
                            ) ? "active":""} 
                            onClick={()=>{handlePush("/vendor-prospect")}}>Vendor Prospect</a>
                    </li>
                    <li className="main-menu">
                        <a>ORDERS</a>
                    </li>
                    <li>
                        <a className={currentRoute==="/transaction" ? "active":""} onClick={()=>{handlePush("/transaction")}}>Transaction</a>
                    </li>
                    <li>
                        <a className={currentRoute==="/logistics" ? "active":""} onClick={()=>{handlePush("/logistics")}}>Logistics</a>
                    </li>
                    <li>
                        <a className={currentRoute==="/purchase" ? "active":""} onClick={()=>{handlePush("/purchase")}}>Individual Orders</a>
                    </li>
                    <li className="main-menu">
                        <a>CALENDARS</a>
                    </li>
                    <li>
                        <a className={currentRoute==="/calendar/master" ? "active":""} onClick={()=>{setCurrentRoute("/calendar/master");handlePush("/calendar/master")}}>Master Calendar</a>
                    </li>
                    <li>
                        <a className={currentRoute==="/calendar/sales" ? "active":""} onClick={()=>{setCurrentRoute("/calendar/sales");handlePush("/calendar/sales")}}>Sales Calendar</a>
                    </li>
                    <li>
                        <a className={currentRoute==="/calendar/logistics" ? "active":""} onClick={()=>{setCurrentRoute("/calendar/logistics");handlePush("/calendar/logistics")}}>Logistics Calendar</a>
                    </li>
                    <li className="main-menu">
                        <a>SALES</a>
                    </li>
                    <li>
                        <a className={currentRoute==="/publish" ? "active":""} onClick={()=>{handlePush("/publish")}}>Publish</a>
                    </li>
                    <li>
                        <a className={currentRoute==="/parameter/tier" ? "active":""} onClick={()=>{handlePush("/parameter/tier")}}>Publish Parameters</a>
                    </li>
                    <li>
                        <a>Wine Search</a>
                    </li>
                    <li>
                        <a>Reviews</a>
                    </li>
                    <li className="main-menu">
                        <a>MONITOR</a>
                    </li>
                    <li>
                        <a className={currentRoute==="/activity/user" ? "active":""} onClick={()=>{handlePush("/activity/user")}}>User Activity</a>
                    </li>
                    <li className="text-center mt-3">
                        <button className="logout-btn" onClick={()=>props.logout()}>Logout</button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default connect(null,{logout})(SideBar);