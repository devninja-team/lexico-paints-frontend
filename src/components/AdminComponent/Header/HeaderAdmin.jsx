import React, {useState, useEffect} from "react";
import {Button} from "react-bootstrap";
import axios from 'axios';
import {connect, useDispatch, useSelector} from "react-redux";
import {logout, setInvestmentCustomerList,setSession} from "../../../utils/Actions";
import Navbar from "react-bootstrap/Navbar";
import Container from 'react-bootstrap/Container';
import '../Index.scss';
import logo from "../../../images/westgarth-logo.png";
import { useHistory } from "react-router-dom";
import setAuthorizationToken from "../../../utils/AuthHeaders";
import Nav from 'react-bootstrap/Nav';
import closeIcon from '../../../images/close-icon.svg';

let id=0;
const HeaderAdmin = (props) => {
    const [search,setSearch]=useState("");
    const [loading,setLoading]=useState(false);
    const dispatch = useDispatch();
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [view, setView] = useState("Admin Account");
    const history = useHistory();
    useEffect(() => {
        let allCookies = document.cookie;
        let cookieArray = allCookies.split(';');
        for(var i=0; i<cookieArray.length; i++) {
            id = cookieArray[0].split('=')[1];
        }    
    }, [])
    const holder = useSelector(state => state.holder_id) || (id===0? '':id);
    // console.log("holder",holder)
    const handleInvestmentCustomerList = () => {
        if(search!==""){
            setLoading(true);
            // console.log("search",search)
            axios.post("https://api-prod.tftc.company/admin/account_list",{
                query:search
            }).then((res)=>{
                // console.log(res.data);
                setLoading(false);
                if(res.data.message === "results found") {
                    dispatch(setInvestmentCustomerList({investment_customer_list:res.data}))
                }
                else if(res.data.message === "no data found for given search!") {
                    dispatch(setInvestmentCustomerList({investment_customer_list:""}))
                }
            }).catch((error)=>{
                console.log(error);
                // dispatch(setCurrentUser({isLoggedIn:false,id:'', isVerified:false}));
                // dispatch(setSession());
                // dispatch(logout)
            })
        }
    }
    const handleClick = (e) => {
        if(search!==""){
            setLoading(true);
            // console.log("search",search)
            axios.post("https://api-prod.tftc.company/admin/find",{
                "query":search
            }).then((res)=>{
                // console.log(res.data);
                if(res.data.message === "results found") {
                    props.onFetchAccount(res.data)
                    setLoading(false);
                    history.push("/customer")
                }
                else if(res.data.message === "no data found for given search!") {
                    props.onFetchAccount(res.data)
                    setLoading(false);
                    history.push("/customer")
                }
            }).catch((error)=>{
                console.log(error);
                // dispatch(setCurrentUser({isLoggedIn:false,id:'', isVerified:false}));
                // dispatch(setSession());
                // dispatch(logout)
            })
        }
    }
    const handleSwitch = (value) => {
        // console.log(value)
        axios.post("https://api-prod.tftc.company/admin/profile_change",{
            customer_id:value
        })
        .then((res)=>{
            // console.log("switch api response",res.data); 
            if(res.data["status"] === 200) {
                setAuthorizationToken(res.data['token'],res.data['user-code'], '7PHs6U33kX',false);
                localStorage.setItem('adminToken',localStorage.jwtToken);
                localStorage.setItem('adminCode',localStorage.user);
                localStorage.setItem('adminRole',localStorage.role);
                localStorage.jwtToken = res.data['token'];
                localStorage.role = res.data['role'];
                localStorage.user = res.data['user-code'];
                localStorage.whoami = res.data['whoami'];
                // dispatch(setWhoAmI({whoami:res.data['whoami']}));
                window.location.href="/";
                // dispatch(setCurrentUser({isLoggedIn: true,id:res.data['user-code'],isVerified:true,isPasswordReset:false }))
                // dispatch(setUserRole({role:'user'}))
            }
        })
        .catch((error)=> {
            console.log(error);
        })
    }
    
    return (
        <div>
            <div className="top-header">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div className="top-header-admin-view mb-2 mb-md-0">
                        <span>ADMIN VIEW</span>
                    </div>
                    <div className="top-header-view-dropdown d-flex align-items-center">
                        <label className="mr-2">VIEW AS </label>
                        <div className={isViewOpen ? "custom-selectDrop open":"custom-selectDrop"}>
                            <div className="custom-select__trigger" onClick={()=>setIsViewOpen(!isViewOpen)}><span>{view}</span>
                                <div className="arrow"></div>
                            </div>
                            <div className="custom-options">
                            <span className={view === "Admin Account" ? "custom-option selected":"custom-option"} onClick={() => { setView("Admin Account");setIsViewOpen(false);}}>Admin Account</span>
                                <span className={(view === "Account Holder" || holder) ? "custom-option":"custom-option pointer-off"} 
                                      onClick={() => { setView("Account Holder");setIsViewOpen(false); handleSwitch(holder)}}>
                                          Account Holder
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="admin-header">
                <Container>
                    <Navbar expand="lg" className="mobile-side-menu">
                        <Navbar.Toggle aria-controls="navbar-nav" className="top-toggle-menu" />        
                        <Navbar.Collapse id="navbar-nav" className="header-nav mt-0 mb-3">
                            <Nav className="ml-auto">
                                <Nav.Link className="close-icon">
                                    <Navbar.Toggle aria-controls="basic-navbar-nav">
                                        <img src={closeIcon} alt=""/>
                                    </Navbar.Toggle>
                                </Nav.Link>
                                <Navbar.Toggle aria-controls="basic-navbar-nav"><button key={1} onClick={()=> props.logout()} className="nav-link nav-logout">Log Out</button></Navbar.Toggle>
                                {/*<Nav.Link>Live Market</Nav.Link>*/}
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <div className="header-wrap d-flex flex-column flex-lg-row justify-content-lg-between align-items-center align-items-lg-end">
                        <div className="header-logo">
                            <Navbar.Brand href="#home">
                                <a href="/"><img src={logo} alt="Logo" /></a>
                            </Navbar.Brand>
                        </div>
                        {
                            window.location.pathname === "/accountlist" ? "" : ""
                        }
                        <div className="find-search-logout d-flex">
                            {
                                window.location.pathname === "/accountlist" ? 
                                (
                                    <div className="find-search d-flex align-items-center">
                                        <span>FIND INVESTMENT CUSTOMER</span>
                                        <input className="text-input d-none d-md-block" placeholder="Search by Phone or Name" type="text" value={search} onChange={(e)=>setSearch(e.target.value)}/>
                                        <input className="text-input d-block d-md-none" placeholder="Phone/Name" type="text" value={search} onChange={(e)=>setSearch(e.target.value)}/>
                                        <Button type="button" onClick={()=>handleInvestmentCustomerList()} disabled={loading}>GO</Button>
                                    </div>):
                                (
                                    <div className="find-search d-flex align-items-center">
                                        <span>FIND CUSTOMER</span>
                                        <input className="text-input d-none d-md-block" placeholder="Search by Email or Number or Name" type="text" value={search} onChange={(e)=>setSearch(e.target.value)}/>
                                        <input className="text-input d-block d-md-none" placeholder="Email/Number/Name" type="text" value={search} onChange={(e)=>setSearch(e.target.value)}/>
                                        <Button type="button" onClick={()=>handleClick()} disabled={loading}>GO</Button>
                                    </div>
                                )
                            }
                            
                            <div className="admin-logout d-none d-lg-block">
                                <Navbar.Toggle aria-controls="basic-navbar-nav"><span key={1} onClick={()=> props.logout()} className="nav-link nav-logout">Log Out</span></Navbar.Toggle>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        </div>
    )
};

export default connect(null,{logout})(HeaderAdmin);
