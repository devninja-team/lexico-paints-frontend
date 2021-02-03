import React, {useState, useEffect} from 'react';
import {Link, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import './index.scss';
import CustomerIcon from '../../assets/images/customer-icon.svg';
import SearchIcon from '../../assets/images/search-icon.svg';
import SessionModal from '../Modals/SessionModal';
import { setSession } from '../../utils/Actions';


export default function UniversalSearch() {
    
    const [customerList, setCustomerList] = useState();
    const dispatch = useDispatch();
    const history = useHistory();
    const globalSearch = useSelector(state => state.globalSearch);
    const query = useSelector(state => state.userRegion);


    const [search,setSearch] = useState(); //search

    const [error, setError] = useState();
    const [initialMessage, setInitialMessage] = useState('initial');

    //sorting vars
    const[sortOrder,setSortOrder] = useState('asc');
    
    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);

    useEffect(() => {
        const global_search = localStorage.getItem('global_search')
        console.log(global_search)
        if(global_search) {
            setSearch(global_search);
            setInitialMessage("");
            axios.post('/accounts/allsearch'+query,{
                query:global_search
            }).then((res) => {
                if(res.data.message === "no data found for given search!") {
                    setError("No Data Found For Given Search!");
                }
                if(res.data.message === "results found") {
                    setCustomerList(res.data.data);
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
            return () => {
                localStorage.removeItem('global_search');
            };
        }
    }, [])

    const handleCustomer = (id, type) => {
        localStorage.setItem('customer_id',id)
        if(type==="Prospect") {
            localStorage.setItem('customer_type','Prospect')
        } else if(type==="Lead") {
            localStorage.setItem('customer_type','Lead')
        } else if(type==="Vendor") {
            localStorage.setItem('customer_type','Vendor')
        } else if(type==="Customer") {
            localStorage.setItem('customer_type','Customer')
        } else if(type==="Vendor-Prospect") {
            localStorage.setItem('customer_type','Customer')
        }
        history.push('/accountinfo/communication');
    }
    
    const handleSearch = (e) => {
        e.preventDefault();
        setError("");
        setInitialMessage("");
        if(search) {
            axios.post('/accounts/allsearch'+query,{
                query:search
            }).then((res) => {
                // console.log("search api response",res.data);
                if(res.data.message === "no data found for given search!") {
                    setError("No Data Found For Given Search!");
                }
                if(res.data.message === "results found") {
                    setCustomerList(res.data.data);
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
    }

    const handleSorting = (field) => {
        if(customerList && customerList.length>0) {
            let sortedArray=[];
            // setSortOrder('desc');
            if(sortOrder == "asc") {
                setSortOrder('desc');
            }else {
                setSortOrder('asc');
            }
             
            switch (sortOrder) {
                case 'asc' :
                    switch(field) {
                        case "first_name" :
                            sortedArray = customerList.sort( function(a, b) {
                                var nameA=a.first_name?a.first_name.toLowerCase():""
                                var nameB=b.first_name?b.first_name.toLowerCase():""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;

                        case "last_name" :
                            sortedArray = customerList.sort( function(a, b) {
                                var nameA=a.last_name?a.last_name.toLowerCase():""
                                var nameB=b.last_name?b.last_name.toLowerCase():""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;

                        case "customer_type" :
                            sortedArray = customerList.sort( function(a, b) {
                                var nameA=a.customer_type?a.customer_type.toLowerCase():""
                                var nameB=b.customer_type?b.customer_type.toLowerCase():""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;

                        case "last_contact_date" :
                            sortedArray = customerList.sort(
                                (a, b) => new Date (a.last_contact_date) - new Date(b.last_contact_date)
                            );
                        break;

                        case "last_contact_type" :
                            sortedArray = customerList.sort( function(a, b) {
                                var nameA=a.last_contact_type?a.last_contact_type.toLowerCase():""
                                var nameB=b.last_contact_type?b.last_contact_type.toLowerCase():""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;

                        case "location" :
                            sortedArray = customerList.sort( function(a, b) {
                                var nameA=a.location?a.location.toLowerCase():""
                                var nameB=b.location?b.location.toLowerCase():""
                                if (nameA < nameB) //sort string ascending
                                    return -1
                                if (nameA > nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;

                        default:console.log("check sorting Label 1"); break;
                    }
                    // console.log("sorted array",[...sortedArray])
                    setCustomerList([...sortedArray]);
                    break;

                case 'desc' :
                    switch(field) {

                        case "first_name" :
                            sortedArray = customerList.sort( function(a, b) {
                                var nameA=a.first_name?a.first_name.toLowerCase():"", nameB=b.first_name?b.first_name.toLowerCase():""
                                if (nameA > nameB) //sort string descending
                                    return -1
                                if (nameA < nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;

                        case "last_name" :
                            sortedArray = customerList.sort( function(a, b) {
                                var nameA=a.last_name?a.last_name.toLowerCase():"", nameB=b.last_name?b.last_name.toLowerCase():""
                                if (nameA > nameB) //sort string descending
                                    return -1
                                if (nameA < nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;

                        case "customer_type" :
                            sortedArray = customerList.sort( function(a, b) {
                                var nameA=a.customer_type?a.customer_type.toLowerCase():"", nameB=b.customer_type?b.customer_type.toLowerCase():""
                                if (nameA > nameB) //sort string descending
                                    return -1
                                if (nameA < nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;
                        
                        case "last_contact_type" :
                            sortedArray = customerList.sort( function(a, b) {
                                var nameA=a.last_contact_type?a.last_contact_type.toLowerCase():"", nameB=b.last_contact_type?b.last_contact_type.toLowerCase():""
                                if (nameA > nameB) //sort string descending
                                    return -1
                                if (nameA < nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;

                        case "last_contact_date" :
                            sortedArray = customerList.sort(
                                (a, b) => new Date (b.last_contact_date) - new Date(a.last_contact_date)
                            );
                        break;
                        case "location" :
                            sortedArray = customerList.sort( function(a, b) {
                                var nameA=a.location?a.location.toLowerCase():"", nameB=b.location?b.location.toLowerCase():""
                                if (nameA > nameB) //sort string descending
                                    return -1
                                if (nameA < nameB)
                                    return 1
                                return 0 //default return value (no sorting)
                            });
                        break;

                        


                        default:console.log("check sorting Label 2"); break;
                    }
                    setCustomerList([...sortedArray]);
                    break;
                default: console.log('check sorting Label 3'); break;
            }
            
        }
    }
    return (
        <div className="customers-content">
            <div className="top-head d-flex align-items-end">
                <div className="title d-flex justify-content-center align-items-center">
                    <div className="title-icon">
                        <img src={CustomerIcon} alt=""/>
                    </div>
                    <h1 className="mb-0 ml-3">Customers</h1>
                </div>
                <div className="search-customer show">
                    <div className="search-box">
                        <form onSubmit = {(e) => handleSearch(e)}>
                            <input className="search-input" type="text" 
                                value={search}
                                placeholder="Quick Find by Name, Email or Phone"
                                onChange={(e) => {setError(""); setInitialMessage(""); setCustomerList([]); setSearch(e.target.value)}}/>
                            <button type="submit" className="search-btn">
                                <img src={SearchIcon} alt=""/>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="left-middle-wrapper">
                <div className="all-customer-wrapper">
                    <div className="all-customer-data">
                        <div className="customer-table">
                            {
                                customerList && customerList.length > 0 ? (
                                    <Table responsive >
                                        <thead>
                                            <tr>
                                                <th className="cursor-pointer" onClick={() => handleSorting("first_name")}>First Name </th>
                                                <th className="cursor-pointer" onClick={() => handleSorting("last_name")}>Last Name</th>
                                                <th className="cursor-pointer" onClick={() => handleSorting("customer_type")}>Customer Type</th>
                                                <th className="cursor-pointer" onClick={() => handleSorting("last_contact_date")}>Last Contacted</th>
                                                <th className="cursor-pointer" onClick={() => handleSorting("last_contact_type")}>Contact Type</th>
                                                <th className="cursor-pointer" onClick={() => handleSorting("location")}>Location</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                customerList.map((value, index) => {
                                                    return (
                                                        <tr  className="cursor-pointer" onClick={() => handleCustomer(value.id,value.customer_type)}>
                                                            <td >{value.first_name ? value.first_name : "-"}</td>
                                                            <td>{value.last_name ? value.last_name : "-"}</td>
                                                            <td>{value.customer_type ? value.customer_type : "-"}</td>
                                                            <td>{value.last_contact_date ? value.last_contact_date : "-"}</td>
                                                            <td>{value.last_contact_type ? value.last_contact_type : "-"}</td>
                                                            <td>{value.location ? value.location : "-"}</td>
                                                        </tr> 
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>

                                ) : ("")
                            }
                            
                        </div>
                        {
                            initialMessage || search===""? (
                                <Table className="mb-0" responsive>
                                        <tbody>
                                            <tr>
                                                <td className="text-center">{"Search To Find Customer"}</td> 
                                            </tr> 
                                        </tbody>
                                </Table>
                            ) : ""
                        }
                        {
                            error ? (
                                <Table className="mb-0" responsive>
                                        <tbody>
                                            <tr>
                                                <td className="text-center">{error}</td> 
                                            </tr> 
                                        </tbody>
                                </Table>
                            ):""
                        }
                        {/* Customer Table Mobile */}

                        <div className="customer-table-mobile">
                            {
                                customerList && customerList.length>0 ? (
                                    <Table className="mb-0">
                                        <thead>
                                            <tr>
                                                <th width="50%" onClick={()=>handleSorting("first_name")}>First Name</th>
                                                <th width="25%" onClick={()=>handleSorting("customer_type")}>
                                                    <span>Customer Type</span>
                                                </th>
                                                <th width="25%" onClick={()=>handleSorting("location")}>
                                                    <span>Location</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {
                                                customerList.map((value, index) => {
                                                    return (
                                                        <tr key={index} onClick={() => handleCustomer(value.id,value.customer_type)}>
                                                            <td>
                                                                {value.first_name ? value.first_name : "-"}
                                                            </td>
                                                            <td>{value.customer_type ? value.customer_type : "-"}</td>
                                                            <td>{value.location ? value.location : "-"}</td>
                                                        </tr>
                                                    )
                                                })
                                        }
                                        </tbody>
                                    </Table>
                                ): ""
                            }
                        </div>
                    </div>
                </div>
            </div>
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage} />
        </div>
    )
}
