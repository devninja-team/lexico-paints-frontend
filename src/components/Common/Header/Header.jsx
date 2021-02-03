import React from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToggleIcon from '../../../assets/images/toggle-icon.png';
import { setRoute } from '../../../utils/Actions';
import './Index.scss';

const Header = (props) => {
    const path = window.location.pathname;
    const dispatch = useDispatch();
    const query = useSelector(state=>state.userRegion);
    useEffect(()=>{
        dispatch(setRoute({route:path}))
    },[])
    // console.log("Header path",path)
    return (
        <header className="header">
            <nav className="navbar">
                <div className="nav-wrapper d-flex justify-content-between align-items-center w-100">
                    <div className="logo-toggle d-flex justify-content-between align-items-center">
                        <div className="logo">
                            <a className="navbar-brand" href="#">
                            {
                                query === "?region=UK" ? "Wine Hub (UK)" : "Wine Hub (US)"
                            }</a>
                        </div>
                        <div className="menu-toggle">
                            <button type="button" className="btn" onClick={() => props.setButtonToggle(!props.toggle)}>
                                <img src={ToggleIcon} alt=""/>
                            </button>
                        </div>
                    </div>
                    <div className="notification-bubble">
                        <button type="button" className="btn">3</button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;