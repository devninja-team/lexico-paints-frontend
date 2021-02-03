import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from "react-bootstrap/Button";
// import EditIcon from "../../../assets/images/edit-icon.svg";
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card';
import editIcon from "../../../../src/assets/images/edit-icon.svg";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
// import { setSession } from '../../utils/Actions';
import SessionModal from '../../Modals/SessionModal';
import { setSession, fetchCustomer } from '../../../utils/Actions';
import { Dropdown } from 'react-bootstrap';
import {phoneCodeList} from "../../../utils/drop-down-list";

const UserSection = (props) => {
    
    const dispatch = useDispatch();
    const fetch = useSelector(state => state.fetch);
    const query = useSelector(state => state.userRegion);
    const [userList, setUserList] = useState();
    const [customerType, setCustomerType] = useState();

    //add form data
    const [title, setTitle] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    const [userId, setUserId] = useState();

    //modal vars
    const [addUserModal, setAddUserModal] = useState(false);
    const [editUserModal, setEditUserModal] = useState(false);
    const [error, setError] = useState();
    const [success, setSuccess] = useState();
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const [convertModal, setConvertModal] = useState(false);
    const [isAccount, setIsAccount] = useState(false);
    const [isLogistics, setIsLogistics] = useState(false);
    const [isMarketing, setIsMarketing] = useState(false);
    const [isData, setIsData] = useState(false);
    const [isSales, setIsSales] = useState(false);
    const [isOther, setIsOther] = useState(false);
    const [isManagement, setIsManagement] = useState(false);
    const [isPrimary, setIsPrimary] = useState(false);
    const [jobTitle, setJobTitle] = useState("");

    //dropdown vars
    const [isAreaCodeOpen, setIsAreaCodeOpen] = useState(false);
    const [areaCode, setAreaCode] = useState("+44");
    const [isAccountPreferenceOpen, setIsAccountPreferenceOpen] = useState(false);
    const [accountPreferenceDropDown, setAccountPreferenceDropDown] = useState("Accounting");

    useEffect(() => {
        setCustomerType(localStorage.getItem("customer_type"));
    },[]);
    useEffect(() => {
        const arrayUserList = [];
        if(props.users) {
            Object.entries(props.users).map((value)=>{
                arrayUserList.push(value);
            });
            setUserList(arrayUserList);
        }

    }, [props.users])
    const handleAddUser = (e) => {
        e.preventDefault();
        const secondaryPreference = accountPreferenceDropDown+(isAccount?",Account":"")+(isLogistics?",Logistics":"")+(isMarketing?",Marketing":"")+(isData?",Data":"")+(isManagement?",Management":"")+(isSales?",Sales":"")+(isOther?",Other":"");
        axios.post('/accounts/add_user'+query,{
            customer_id:localStorage.getItem("customer_id"),
            job_title: jobTitle,
            first_name: firstName,
            last_name: lastName,
            email,
            phone,
            marketing_pref_primary:accountPreferenceDropDown,
            marketing_pref_other:secondaryPreference,
            phone_code:areaCode


        }).then((res) => {
            if(res.data.message === "user added") {
                setSuccess("User Added Successfully!");
                setError("");
                setTitle('');
                setFirstName('');
                setLastName('');
                setPhone('');
                setEmail('');
                props.fetchCustomer();
            }
            else {
                setError(res.data.message);
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
    const handleFillForm = (id) => {
        setSuccess("");
        setTitle('');
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
        setUserId(id);
        setError('');
        setIsAccount(false);
        setIsLogistics(false);
        setIsMarketing(false);
        setIsData(false);
        setIsSales(false);
        setIsOther(false);
        setIsManagement(false);
        setJobTitle("");
        userList.map((value) => {
            if(value[0]===id) {
                setFirstName(value[1].first_name ? value[1].first_name:"");
                setLastName(value[1].last_name ? value[1].last_name:"")
                setPhone(value[1].user_phone ? value[1].user_phone: "");
                setEmail(value[1].user_email ? value[1].user_email: "");
                setIsPrimary(value[1].is_primary === "1" ? true:false)
                setAccountPreferenceDropDown(value[1].marketing_pref_primary?value[1].marketing_pref_primary:accountPreferenceDropDown);
                setJobTitle(value[1].job_title?value[1].job_title:"");
                if(value[1].marketing_pref_other) {
                    value[1].marketing_pref_other.split(",").map((preference) => {
                        if(value[1].marketing_pref_primary==="Accounting") {
                            if(preference === "Accounting") {
                                setIsAccount(false);
                            } else if(preference === "Logistics") {
                                setIsLogistics(true);
                            } else if(preference === "Marketing") {
                                setIsMarketing(true);
                            }else if(preference === "Data") {
                                setIsData(true);
                            }else if(preference === "Sales") {
                                setIsSales(true);
                            }else if(preference === "Other") {
                                setIsOther(true);
                            }else if(preference === "Management") {
                                setIsManagement(true);
                            }
                        } else if(value[1].marketing_pref_primary === "Logistics") {
                            if(preference === "Accounting") {
                                setIsAccount(true);
                            } else if(preference === "Logistics") {
                                setIsLogistics(false);
                            } else if(preference === "Marketing") {
                                setIsMarketing(true);
                            }else if(preference === "Data") {
                                setIsData(true);
                            }else if(preference === "Sales") {
                                setIsSales(true);
                            }else if(preference === "Other") {
                                setIsOther(true);
                            }else if(preference === "Management") {
                                setIsManagement(true);
                            }
                        } else if(value[1].marketing_pref_primary === "Marketing") {
                            if(preference === "Accounting") {
                                setIsAccount(true);
                            } else if(preference === "Logistics") {
                                setIsLogistics(true);
                            } else if(preference === "Marketing") {
                                setIsMarketing(false);
                            }else if(preference === "Data") {
                                setIsData(true);
                            }else if(preference === "Sales") {
                                setIsSales(true);
                            }else if(preference === "Other") {
                                setIsOther(true);
                            }else if(preference === "Management") {
                                setIsManagement(true);
                            }
                        }else if(value[1].marketing_pref_primary === "Data") {
                            if(preference === "Accounting") {
                                setIsAccount(true);
                            } else if(preference === "Logistics") {
                                setIsLogistics(true);
                            } else if(preference === "Marketing") {
                                setIsMarketing(true);
                            }else if(preference === "Data") {
                                setIsData(false);
                            }else if(preference === "Sales") {
                                setIsSales(true);
                            }else if(preference === "Other") {
                                setIsOther(true);
                            }else if(preference === "Management") {
                                setIsManagement(true);
                            }
                        }else if(value[1].marketing_pref_primary === "Sales") {
                            if(preference === "Accounting") {
                                setIsAccount(true);
                            } else if(preference === "Logistics") {
                                setIsLogistics(true);
                            } else if(preference === "Marketing") {
                                setIsMarketing(true);
                            }else if(preference === "Data") {
                                setIsData(true);
                            }else if(preference === "Sales") {
                                setIsSales(false);
                            }else if(preference === "Other") {
                                setIsOther(true);
                            }else if(preference === "Management") {
                                setIsManagement(true);
                            }
                        }else if(value[1].marketing_pref_primary === "Other") {
                            if(preference === "Accounting") {
                                setIsAccount(true);
                            } else if(preference === "Logistics") {
                                setIsLogistics(true);
                            } else if(preference === "Marketing") {
                                setIsMarketing(true);
                            }else if(preference === "Data") {
                                setIsData(true);
                            }else if(preference === "Sales") {
                                setIsSales(true);
                            }else if(preference === "Other") {
                                setIsOther(false);
                            }else if(preference === "Management") {
                                setIsManagement(true);
                            }
                        }else if(value[1].marketing_pref_primary === "Management") {
                            if(preference === "Accounting") {
                                setIsAccount(true);
                            } else if(preference === "Logistics") {
                                setIsLogistics(true);
                            } else if(preference === "Marketing") {
                                setIsMarketing(true);
                            }else if(preference === "Data") {
                                setIsData(true);
                            }else if(preference === "Sales") {
                                setIsSales(true);
                            }else if(preference === "Other") {
                                setIsOther(true);
                            }else if(preference === "Management") {
                                setIsManagement(false);
                            }
                        }
                    })
                }
                // setIsAccount();
                // setIsLogistics();
                // setIsMarketing();
                //checkbox 
                setEditUserModal(true);
            }
        })
    }
    const handleEditUser = (e) => {
        e.preventDefault();
        const secondaryPreference = accountPreferenceDropDown+(isAccount?",Account":"")+(isLogistics?",Logistics":"")+(isMarketing?",Marketing":"")+(isData?",Data":"")+(isManagement?",Management":"")+(isSales?",Sales":"")+(isOther?",Other":"");
        axios.post('/accounts/edit_user_account'+query,{
            customer_id:localStorage.getItem("customer_id"),
            user_id:userId,
            first_name: firstName,
            last_name: lastName,
            job_title: jobTitle,
            email,
            phone,
            marketing_pref_primary:accountPreferenceDropDown,
            marketing_pref_other:secondaryPreference,
            phone_code:areaCode,
            is_primary: isPrimary===true ? "1" : "0"

        }).then((res) => {
            if(res.data.message === "user updated") {
                setError("");
                setSuccess("User Updated Successfully!")
                props.fetchCustomer();
            }
            else {
                setError(res.data.message);
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

    const handleUserAccess = (e,user_id) => {
        const user_status = e.target.checked;
        axios.post('/accounts/change_user_status'+query,{
            customer_id:localStorage.getItem("customer_id"),
            user_id:user_id,
            status: e.target.checked ? 1 : 0
        }).then((res) => {
            if(res.data.message === "user updated") {
                setSuccess("User access changed!")
                setError("");
                setConvertModal(true);
                props.fetchCustomer();
            }
            else {
                setError(res.data.message);
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
    const handleCloseDropDowns = (type) => {
        switch(type){
            case "area-code":
                // setIsAreaCodeOpen(false);
                setIsAccountPreferenceOpen(false);
            break;
            case "account-preference":
                setIsAreaCodeOpen(false);
                // setIsAccountPreferenceOpen(false);
            break;
            
            default: console.log("wrong input..")
        }
    }
    return (
        <>
            <div className="head d-flex align-items-center justify-content-between user-head">
                <div className="title">
                    <h6>User Section</h6>
                </div>
                <div className='btn-add'>
                    <Button onClick={() => {setFirstName('');setLastName('');setPhone('');setEmail(''); setError(""); setSuccess(""); setAddUserModal(true)}}>Add User</Button>
                </div>
            </div>
            
            <div>
            <Accordion defaultActiveKey="1">
                        {
                            (userList && userList.length>0) ? (
                                <>
                                    <div className="title">
                                        <h6>Accounting Contacts</h6>
                                    </div>
                                    <Accordion defaultActiveKey="1">
                                        {
                                            (userList && userList.filter((data) => {
                                                if(
                                                    data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("accounting") 
                                                ) {
                                                    return data;
                                                }
                                            }).length>0) ? (
                                                userList.filter((data) => {
                                                    if(
                                                        data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("accounting") 
                                                    ) {
                                                        return data;
                                                    }
                                                }).map((value, index) => {
                                                    return(
                                                        <Card key={index}>
                                                            <Card.Header>
                                                                <Accordion.Toggle className="user-section-link" as={Button} variant="link" eventKey={(index+1).toString()}>
                                                                    <span>{value[1].first_name ? value[1].first_name :""}{value[1].last_name ? " "+value[1].last_name :""}</span>
                                                                    <span>{value[1].is_primary==="1" ? " (Primary)" :""}</span>
                                                                </Accordion.Toggle>
                                                                    <Button className="edit-link " variant="link" onClick={()=>handleFillForm(value[0])}>
                                                                        <img src={editIcon}/>
                                                                    </Button>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey={(index+1).toString()}>
                                                            <Card.Body className="content-card p-0">
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].user_email ? value[1].user_email  : "-"}</span>    
                                                                    <label>Email</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].phone_code ? value[1].phone_code  : ""}{value[1].user_phone ? " "+value[1].user_phone  : " -"}</span>    
                                                                    <label>Phone</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_primary ? value[1].marketing_pref_primary  : "-"}</span>    
                                                                    <label>Marketing Preference</label>
                                                                </div>
                                                            </div>
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_other ? value[1].marketing_pref_other.split(",").join(", ")  : "-"}</span>    
                                                                    <label>Second Marketing Preference</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].job_title ? value[1].job_title : "-"}</span>    
                                                                    <label>Job Title</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-flex">
                                                                        {
                                                                            value[1].is_active === 1 ? (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked></input><span className="ml-2">Active</span> </>
                                                                            ) : (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked={false}></input><span className="ml-2">Not Active</span> </>
                                                                            )
                                                                        }</span>    
                                                                    <label>Status</label>
                                                                </div>
                                                            </div>
                                                            </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    )
                                                })
                                            ) : (
                                                <Card>
                                                    <Card.Body>
                                                        <div className="account-info-detail" >
                                                            No Accounting Contact 
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )
                                        }    
                                    </Accordion>
                                    <div className="title">
                                        <h6>Logistics Contacts</h6>
                                    </div>
                                    <Accordion defaultActiveKey="1">
                                        {
                                            (userList && userList.filter((data) => {
                                                if(
                                                    data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("logistics") 
                                                ) {
                                                    return data;
                                                }
                                            }).length>0) ? (
                                                userList.filter((data) => {
                                                    if(
                                                        data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("logistics") 
                                                    ) {
                                                        return data;
                                                    }
                                                }).map((value, index) => {
                                                    return(
                                                        <Card key={index}>
                                                            <Card.Header>
                                                                <Accordion.Toggle className="user-section-link" as={Button} variant="link" eventKey={(index+1).toString()}>
                                                                    <span>{value[1].first_name ? value[1].first_name :""}{value[1].last_name ? " "+value[1].last_name :""}</span>
                                                                    <span>{value[1].is_primary==="1" ? " (Primary)" :""}</span>
                                                                </Accordion.Toggle>
                                                                    <Button className="edit-link " variant="link" onClick={()=>handleFillForm(value[0])}>
                                                                        <img src={editIcon}/>
                                                                    </Button>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey={(index+1).toString()}>
                                                            <Card.Body className="content-card p-0">
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].user_email ? value[1].user_email  : "-"}</span>    
                                                                    <label>Email</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].phone_code ? value[1].phone_code  : ""}{value[1].user_phone ? " "+value[1].user_phone  : " -"}</span>    
                                                                    <label>Phone</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_primary ? value[1].marketing_pref_primary  : "-"}</span>    
                                                                    <label>Marketing Preference</label>
                                                                </div>
                                                            </div>
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_other ? value[1].marketing_pref_other.split(",").join(", ")  : "-"}</span>    
                                                                    <label>Second Marketing Preference</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-flex">
                                                                        {
                                                                            value[1].is_active === 1 ? (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked></input><span className="ml-2">Active</span> </>
                                                                            ) : (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked={false}></input><span className="ml-2">Not Active</span> </>
                                                                            )
                                                                        }</span>    
                                                                    <label>Status</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].job_title ? value[1].job_title : "-"}</span>    
                                                                    <label>Job Title</label>
                                                                </div>
                                                            </div>
                                                            </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    )
                                                })
                                            ) : (
                                                <Card>
                                                    <Card.Body>
                                                        <div className="account-info-detail" >
                                                            No Logistics Contact 
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )
                                        }    
                                    </Accordion>
                                    <div className="title">
                                        <h6>Data Contacts</h6>
                                    </div>
                                    <Accordion defaultActiveKey="1">
                                        {
                                            (userList && userList.filter((data) => {
                                                if(
                                                    data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("data") 
                                                ) {
                                                    return data;
                                                }
                                            }).length>0) ? (
                                                userList.filter((data) => {
                                                    if(
                                                        data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("data") 
                                                    ) {
                                                        return data;
                                                    }
                                                }).map((value, index) => {
                                                    return(
                                                        <Card key={index}>
                                                            <Card.Header>
                                                                <Accordion.Toggle className="user-section-link" as={Button} variant="link" eventKey={(index+1).toString()}>
                                                                    <span>{value[1].first_name ? value[1].first_name :""}{value[1].last_name ? " "+value[1].last_name :""}</span>
                                                                    <span>{value[1].is_primary==="1" ? " (Primary)" :""}</span>
                                                                </Accordion.Toggle>
                                                                    <Button className="edit-link " variant="link" onClick={()=>handleFillForm(value[0])}>
                                                                        <img src={editIcon}/>
                                                                    </Button>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey={(index+1).toString()}>
                                                            <Card.Body className="content-card p-0">
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].user_email ? value[1].user_email  : "-"}</span>    
                                                                    <label>Email</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].phone_code ? value[1].phone_code  : ""}{value[1].user_phone ? " "+value[1].user_phone  : " -"}</span>    
                                                                    <label>Phone</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_primary ? value[1].marketing_pref_primary  : "-"}</span>    
                                                                    <label>Marketing Preference</label>
                                                                </div>
                                                            </div>
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_other ? value[1].marketing_pref_other.split(",").join(", ")  : "-"}</span>    
                                                                    <label>Second Marketing Preference</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].job_title ? value[1].job_title : "-"}</span>    
                                                                    <label>Job Title</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-flex">
                                                                        {
                                                                            value[1].is_active === 1 ? (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked></input><span className="ml-2">Active</span> </>
                                                                            ) : (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked={false}></input><span className="ml-2">Not Active</span> </>
                                                                            )
                                                                        }</span>    
                                                                    <label>Status</label>
                                                                </div>
                                                            </div>
                                                            </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    )
                                                })
                                            ) : (
                                                <Card>
                                                    <Card.Body>
                                                        <div className="account-info-detail" >
                                                            No Data Contact 
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )
                                        }    
                                    </Accordion>
                                    <div className="title">
                                        <h6>Management Contacts</h6>
                                    </div>
                                    <Accordion defaultActiveKey="1">
                                        {
                                            (userList && userList.filter((data) => {
                                                if(
                                                    data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("management") 
                                                ) {
                                                    return data;
                                                }
                                            }).length>0) ? (
                                                userList.filter((data) => {
                                                    if(
                                                        data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("management") 
                                                    ) {
                                                        return data;
                                                    }
                                                }).map((value, index) => {
                                                    return(
                                                        <Card key={index}>
                                                            <Card.Header>
                                                                <Accordion.Toggle className="user-section-link" as={Button} variant="link" eventKey={(index+1).toString()}>
                                                                    <span>{value[1].first_name ? value[1].first_name :""}{value[1].last_name ? " "+value[1].last_name :""}</span>
                                                                    <span>{value[1].is_primary==="1" ? " (Primary)" :""}</span>
                                                                </Accordion.Toggle>
                                                                    <Button className="edit-link " variant="link" onClick={()=>handleFillForm(value[0])}>
                                                                        <img src={editIcon}/>
                                                                    </Button>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey={(index+1).toString()}>
                                                            <Card.Body className="content-card p-0">
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].user_email ? value[1].user_email  : "-"}</span>    
                                                                    <label>Email</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].phone_code ? value[1].phone_code  : ""}{value[1].user_phone ? " "+value[1].user_phone  : " -"}</span>    
                                                                    <label>Phone</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_primary ? value[1].marketing_pref_primary  : "-"}</span>    
                                                                    <label>Marketing Preference</label>
                                                                </div>
                                                            </div>
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_other ? value[1].marketing_pref_other.split(",").join(", ")  : "-"}</span>    
                                                                    <label>Second Marketing Preference</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].job_title ? value[1].job_title : "-"}</span>    
                                                                    <label>Job Title</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-flex">
                                                                        {
                                                                            value[1].is_active === 1 ? (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked></input><span className="ml-2">Active</span> </>
                                                                            ) : (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked={false}></input><span className="ml-2">Not Active</span> </>
                                                                            )
                                                                        }</span>    
                                                                    <label>Status</label>
                                                                </div>
                                                            </div>
                                                            </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    )
                                                })
                                            ) : (
                                                <Card>
                                                    <Card.Body>
                                                        <div className="account-info-detail" >
                                                            No Other Contact 
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )
                                        }    
                                    </Accordion>
                                    <div className="title">
                                        <h6>Marketing Contacts</h6>
                                    </div>
                                    <Accordion defaultActiveKey="1">
                                        {
                                            (userList && userList.filter((data) => {
                                                if(
                                                    data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("marketing") 
                                                ) {
                                                    return data;
                                                }
                                            }).length>0) ? (
                                                userList.filter((data) => {
                                                    if(
                                                        data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("marketing") 
                                                    ) {
                                                        return data;
                                                    }
                                                }).map((value, index) => {
                                                    return(
                                                        <Card key={index}>
                                                            <Card.Header>
                                                                <Accordion.Toggle className="user-section-link" as={Button} variant="link" eventKey={(index+1).toString()}>
                                                                    <span>{value[1].first_name ? value[1].first_name :""}{value[1].last_name ? " "+value[1].last_name :""}</span>
                                                                    <span>{value[1].is_primary==="1" ? " (Primary)" :""}</span>
                                                                </Accordion.Toggle>
                                                                    <Button className="edit-link " variant="link" onClick={()=>handleFillForm(value[0])}>
                                                                        <img src={editIcon}/>
                                                                    </Button>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey={(index+1).toString()}>
                                                            <Card.Body className="content-card p-0">
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].user_email ? value[1].user_email  : "-"}</span>    
                                                                    <label>Email</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].phone_code ? value[1].phone_code  : ""}{value[1].user_phone ? " "+value[1].user_phone  : " -"}</span>    
                                                                    <label>Phone</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_primary ? value[1].marketing_pref_primary  : "-"}</span>    
                                                                    <label>Marketing Preference</label>
                                                                </div>
                                                            </div>
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_other ? value[1].marketing_pref_other.split(",").join(", ")  : "-"}</span>    
                                                                    <label>Second Marketing Preference</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].job_title ? value[1].job_title : "-"}</span>    
                                                                    <label>Job Title</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-flex">
                                                                        {
                                                                            value[1].is_active === 1 ? (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked></input><span className="ml-2">Active</span> </>
                                                                            ) : (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked={false}></input><span className="ml-2">Not Active</span> </>
                                                                            )
                                                                        }</span>    
                                                                    <label>Status</label>
                                                                </div>
                                                            </div>
                                                            </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    )
                                                })
                                            ) : (
                                                <Card>
                                                    <Card.Body>
                                                        <div className="account-info-detail" >
                                                            No Marketing Contact 
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )
                                        }    
                                    </Accordion>
                                    <div className="title">
                                        <h6>Sales Contacts</h6>
                                    </div>
                                    <Accordion defaultActiveKey="1">
                                        {
                                            (userList && userList.filter((data) => {
                                                if(
                                                    data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("sales") 
                                                ) {
                                                    return data;
                                                }
                                            }).length>0) ? (
                                                userList.filter((data) => {
                                                    if(
                                                        data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("sales") 
                                                    ) {
                                                        return data;
                                                    }
                                                }).map((value, index) => {
                                                    return(
                                                        <Card key={index}>
                                                            <Card.Header>
                                                                <Accordion.Toggle className="user-section-link" as={Button} variant="link" eventKey={(index+1).toString()}>
                                                                    <span>{value[1].first_name ? value[1].first_name :""}{value[1].last_name ? " "+value[1].last_name :""}</span>
                                                                    <span>{value[1].is_primary==="1" ? " (Primary)" :""}</span>
                                                                </Accordion.Toggle>
                                                                    <Button className="edit-link " variant="link" onClick={()=>handleFillForm(value[0])}>
                                                                        <img src={editIcon}/>
                                                                    </Button>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey={(index+1).toString()}>
                                                            <Card.Body className="content-card p-0">
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].user_email ? value[1].user_email  : "-"}</span>    
                                                                    <label>Email</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].phone_code ? value[1].phone_code  : ""}{value[1].user_phone ? " "+value[1].user_phone  : " -"}</span>    
                                                                    <label>Phone</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_primary ? value[1].marketing_pref_primary  : "-"}</span>    
                                                                    <label>Marketing Preference</label>
                                                                </div>
                                                            </div>
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_other ? value[1].marketing_pref_other.split(",").join(", ")  : "-"}</span>    
                                                                    <label>Second Marketing Preference</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].job_title ? value[1].job_title : "-"}</span>    
                                                                    <label>Job Title</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-flex">
                                                                        {
                                                                            value[1].is_active === 1 ? (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked></input><span className="ml-2">Active</span> </>
                                                                            ) : (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked={false}></input><span className="ml-2">Not Active</span> </>
                                                                            )
                                                                        }</span>    
                                                                    <label>Status</label>
                                                                </div>
                                                            </div>
                                                            </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    )
                                                })
                                            ) : (
                                                <Card>
                                                    <Card.Body>
                                                        <div className="account-info-detail" >
                                                            No Sales Contact 
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )
                                        }    
                                    </Accordion>
                                    <div className="title">
                                        <h6>Other Contacts</h6>
                                    </div>
                                    <Accordion defaultActiveKey="1">
                                        {
                                            (userList && userList.filter((data) => {
                                                if(
                                                    data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("other") 
                                                ) {
                                                    return data;
                                                }
                                            }).length>0) ? (
                                                userList.filter((data) => {
                                                    if(
                                                        data[1].marketing_pref_primary && data[1].marketing_pref_primary.toLowerCase().includes("other") 
                                                    ) {
                                                        return data;
                                                    }
                                                }).map((value, index) => {
                                                    return(
                                                        <Card key={index}>
                                                            <Card.Header>
                                                                <Accordion.Toggle className="user-section-link" as={Button} variant="link" eventKey={(index+1).toString()}>
                                                                    <span>{value[1].first_name ? value[1].first_name :""}{value[1].last_name ? " "+value[1].last_name :""}</span>
                                                                    <span>{value[1].is_primary==="1" ? " (Primary)" :""}</span>
                                                                </Accordion.Toggle>
                                                                    <Button className="edit-link " variant="link" onClick={()=>handleFillForm(value[0])}>
                                                                        <img src={editIcon}/>
                                                                    </Button>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey={(index+1).toString()}>
                                                            <Card.Body className="content-card p-0">
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].user_email ? value[1].user_email  : "-"}</span>    
                                                                    <label>Email</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].phone_code ? value[1].phone_code  : ""}{value[1].user_phone ? " "+value[1].user_phone  : " -"}</span>    
                                                                    <label>Phone</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_primary ? value[1].marketing_pref_primary  : "-"}</span>    
                                                                    <label>Marketing Preference</label>
                                                                </div>
                                                            </div>
                                                            <div className="content-detail d-flex">
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].marketing_pref_other ? value[1].marketing_pref_other.split(",").join(", ")  : "-"}</span>    
                                                                    <label>Second Marketing Preference</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-block">{value[1].job_title ? value[1].job_title : "-"}</span>    
                                                                    <label>Job Title</label>
                                                                </div>
                                                                <div className="content-detail-list">
                                                                    <span className="d-flex">
                                                                        {
                                                                            value[1].is_active === 1 ? (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked></input><span className="ml-2">Active</span> </>
                                                                            ) : (
                                                                                <><input type="checkbox" onChange={(e) => handleUserAccess(e,value[1].id)} checked={false}></input><span className="ml-2">Not Active</span> </>
                                                                            )
                                                                        }</span>    
                                                                    <label>Status</label>
                                                                </div>
                                                            </div>
                                                            </Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                                    )
                                                })
                                            ) : (
                                                <Card>
                                                    <Card.Body>
                                                        <div className="account-info-detail" >
                                                            No Other Contact 
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )
                                        }    
                                    </Accordion>
                                </>
                            ) : (
                                <Card>
                                    <Card.Body>
                                        <div className="account-info-detail" >
                                            No User Exist!
                                        </div>
                                    </Card.Body>
                                </Card>
                            )
                        }    
                        </Accordion>
            </div>
            <Modal show={addUserModal}
                       onHide={() => setAddUserModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>NEW USER DETAILS</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={(e) => handleAddUser(e)}>
                        <Modal.Body>
                            <div className="change-address-body">
                                <div className="change-address-wrapper">
                                    {/* <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Title:</label>
                                        <input type="text" className="text-input"  value = {title?title:""} onChange = {(e) => {setError(""); setSuccess(""); setTitle(e.target.value)}} required></input>
                                    </div> */}
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>First Name:</label>
                                        <input type="text" className="text-input" value = {firstName?firstName:""} onChange = {(e) => {setError(""); setSuccess(""); setFirstName(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Last Name:</label>
                                        <input type="text" className="text-input" value = {lastName?lastName:""} onChange = {(e) => {setError(""); setSuccess(""); setLastName(e.target.value)}}></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Job Title:</label> 
                                        <input type="text" className="text-input" value = {jobTitle?jobTitle:""} onChange = {(e) => {setError(""); setSuccess(""); setJobTitle(e.target.value)}}></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Email:</label>
                                        <input type="email" className="text-input" value = {email?email:""} onChange = {(e) => {setError(""); setSuccess(""); setEmail(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Phone Country Code:</label> 
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isAreaCodeOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{setIsAreaCodeOpen(!isAreaCodeOpen); handleCloseDropDowns("area-code")}}><span>{areaCode}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                    {
                                                        phoneCodeList.map((value, index) => {
                                                            return(
                                                                <span key={index} className={areaCode === value.split('(').pop().split(')')[0] ? "custom-option selected":"custom-option"} 
                                                                    onClick={() => { setAreaCode(value.split('(').pop().split(')')[0]);setIsAreaCodeOpen(false)}}
                                                                    >{value}
                                                                </span>
                                                            )
                                                        })
                                                    }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Phone:</label>
                                        <input type="text" className="text-input" value = {phone?phone:""} onChange = {(e) => {setError(""); setPhone(e.target.value)}} required={query !== "?region=UK"}></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Primary Preference:</label> 
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isAccountPreferenceOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{setIsAccountPreferenceOpen(!isAccountPreferenceOpen);handleCloseDropDowns("account-preference")}}><span>{accountPreferenceDropDown}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        <span className={accountPreferenceDropDown === "Accounting" ? "custom-option selected":"custom-option"}  onClick={() => { setAccountPreferenceDropDown('Accounting'); setIsAccountPreferenceOpen(false); setIsLogistics(false); setIsMarketing(false); setIsAccount(false); setIsData(false); setIsSales(false); setIsOther(false);setIsManagement(false);}}>Accounting</span>
                                                        <span className={accountPreferenceDropDown === "Logistics" ? "custom-option selected":"custom-option"} onClick={() => { setAccountPreferenceDropDown('Logistics'); setIsAccountPreferenceOpen(false); setIsAccount(false); setIsMarketing(false); setIsLogistics(false);setIsData(false); setIsSales(false); setIsOther(false);setIsManagement(false);}}>Logistics</span>
                                                        <span className={accountPreferenceDropDown === "Marketing" ? "custom-option selected":"custom-option"} onClick={() => { setAccountPreferenceDropDown('Marketing'); setIsAccountPreferenceOpen(false); setIsAccount(false); setIsLogistics(false); setIsMarketing(false);setIsData(false); setIsSales(false); setIsOther(false);setIsManagement(false);}}>Marketing</span>
                                                        <span className={accountPreferenceDropDown === "Data" ? "custom-option selected":"custom-option"} onClick={() => { setAccountPreferenceDropDown('Data'); setIsAccountPreferenceOpen(false); setIsAccount(false); setIsLogistics(false); setIsMarketing(false);setIsData(false);setIsSales(false); setIsOther(false);setIsManagement(false);}}>Data</span>
                                                        <span className={accountPreferenceDropDown === "Management" ? "custom-option selected":"custom-option"} onClick={() => { setAccountPreferenceDropDown('Management'); setIsAccountPreferenceOpen(false); setIsAccount(false); setIsLogistics(false); setIsMarketing(false);setIsData(false); setIsSales(false); setIsOther(false);setIsManagement(false);}}>Management</span>
                                                        <span className={accountPreferenceDropDown === "Sales" ? "custom-option selected":"custom-option"} onClick={() => { setAccountPreferenceDropDown('Sales'); setIsAccountPreferenceOpen(false); setIsAccount(false); setIsLogistics(false); setIsMarketing(false);setIsData(false); setIsSales(false); setIsOther(false);setIsManagement(false);}}>Sales</span>
                                                        <span className={accountPreferenceDropDown === "Other" ? "custom-option selected":"custom-option"} onClick={() => { setAccountPreferenceDropDown('Other'); setIsAccountPreferenceOpen(false); setIsAccount(false); setIsLogistics(false); setIsMarketing(false);setIsData(false); setIsSales(false); setIsOther(false);setIsManagement(false);}}>Other</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-start street-filed">
                                        <label>Other Preferences:</label>
                                        <div className="d-flex flex-column checkbox-filed">
                                            {
                                                accountPreferenceDropDown === "Accounting" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsLogistics(e.target.checked)}></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsMarketing(e.target.checked)}></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsData(e.target.checked)}></input><span className="ml-2">Data</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsManagement(e.target.checked)}></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsSales(e.target.checked)}></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsOther(e.target.checked)}></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                            {
                                                accountPreferenceDropDown === "Logistics" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsAccount(e.target.checked)}></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsMarketing(e.target.checked)}></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsData(e.target.checked)}></input><span className="ml-2">Data</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsManagement(e.target.checked)}></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsSales(e.target.checked)}></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsOther(e.target.checked)}></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                            {
                                                accountPreferenceDropDown === "Marketing" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsAccount(e.target.checked)}></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsLogistics(e.target.checked)}></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsData(e.target.checked)}></input><span className="ml-2">Data</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsManagement(e.target.checked)}></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsSales(e.target.checked)}></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsOther(e.target.checked)}></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                            {
                                                accountPreferenceDropDown === "Data" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsAccount(e.target.checked)}></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsLogistics(e.target.checked)}></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsMarketing(e.target.checked)}></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Data</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsManagement(e.target.checked)}></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsSales(e.target.checked)}></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsOther(e.target.checked)}></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                            {
                                                accountPreferenceDropDown === "Sales" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsAccount(e.target.checked)}></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsLogistics(e.target.checked)}></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsMarketing(e.target.checked)}></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsData(e.target.checked)}></input><span className="ml-2">Data</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsManagement(e.target.checked)}></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsOther(e.target.checked)}></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                            {
                                                accountPreferenceDropDown === "Other" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsAccount(e.target.checked)}></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsLogistics(e.target.checked)}></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsMarketing(e.target.checked)}></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsData(e.target.checked)}></input><span className="ml-2">Data</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsManagement(e.target.checked)}></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsSales(e.target.checked)}></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                            {
                                                accountPreferenceDropDown === "Management" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsAccount(e.target.checked)}></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsLogistics(e.target.checked)}></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsMarketing(e.target.checked)}></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsData(e.target.checked)}></input><span className="ml-2">Data</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsSales(e.target.checked)}></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsOther(e.target.checked)}></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                            
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label></label>
                                        <span className="error-text">{error}</span>
                                        <span className="success-text">{success}</span>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <input type="submit" value="Save" className="save-btn" />
                        </Modal.Footer>
                    </form>
            </Modal> 
            <Modal show={editUserModal}
                       onHide={() => setEditUserModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>EDIT USER DETAILS</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={(e) => handleEditUser(e)}>
                        <Modal.Body>
                            <div className="change-address-body">
                                <div className="change-address-wrapper">
                                    {/* <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Title:</label>
                                        <input type="text" className="text-input"  value = {title?title:""} onChange = {(e) => {setError("");setSuccess(""); setTitle(e.target.value)}} required></input>
                                    </div> */}
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label></label>
                                        <div className="checkbox-filed">
                                        {
                                            isPrimary===true ? (<><input type="checkbox" onChange={(e) => {setIsPrimary(e.target.checked); setError(""); setSuccess("");}} checked></input><span className="ml-2">Primary Contact</span> </>)
                                            :(<><input type="checkbox" onChange={(e) => {setIsPrimary(e.target.checked);setError(""); setSuccess("");}}></input><span className="ml-2">Primary Contact</span> </>)
                                        }
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>First Name:</label>
                                        <input type="text" className="text-input" value = {firstName?firstName:""} onChange = {(e) => {setError("");setSuccess(""); setFirstName(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Last Name:</label>
                                        <input type="text" className="text-input" value = {lastName?lastName:""} onChange = {(e) => {setError(""); setSuccess("");setLastName(e.target.value)}}></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Job Title:</label> 
                                        <input type="text" className="text-input" value = {jobTitle?jobTitle:""} onChange = {(e) => {setError(""); setSuccess(""); setJobTitle(e.target.value)}}></input>
                                    </div>

                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Email:</label>
                                        <input type="email" className="text-input" value = {email?email:""} onChange = {(e) => {setError(""); setSuccess("");setEmail(e.target.value)}} required></input>
                                    </div>
                                    
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Phone Country Code:</label> 
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isAreaCodeOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{setIsAreaCodeOpen(!isAreaCodeOpen); handleCloseDropDowns("area-code")}}><span>{areaCode}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                    {
                                                        phoneCodeList.map((value, index) => {
                                                            return(
                                                                <span key={index} className={areaCode === value.split('(').pop().split(')')[0] ? "custom-option selected":"custom-option"} 
                                                                    onClick={() => { setAreaCode(value.split('(').pop().split(')')[0]);setError(""); setSuccess("");setIsAreaCodeOpen(false)}}
                                                                    >{value}
                                                                </span>
                                                            )
                                                        })
                                                    }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Phone:</label>
                                        <input type="text" className="text-input" value = {phone?phone:""} onChange = {(e) => {setError("");setSuccess("");setPhone(e.target.value)}} required={query !== "?region=UK"}></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Primary Preference:</label> 
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isAccountPreferenceOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{setIsAccountPreferenceOpen(!isAccountPreferenceOpen);handleCloseDropDowns("account-preference")}}><span>{accountPreferenceDropDown}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        <span className={accountPreferenceDropDown === "Accounting" ? "custom-option selected":"custom-option"}  onClick={() => { setAccountPreferenceDropDown('Accounting'); setError(""); setSuccess("");setIsAccountPreferenceOpen(false); setIsLogistics(false); setIsMarketing(false); setIsAccount(false);setIsData(false);setIsSales(false); setIsOther(false); setIsManagement(false)}}>Accounting</span>
                                                        <span className={accountPreferenceDropDown === "Logistics" ? "custom-option selected":"custom-option"} onClick={() => { setAccountPreferenceDropDown('Logistics'); setError(""); setSuccess("");setIsAccountPreferenceOpen(false); setIsAccount(false); setIsMarketing(false); setIsLogistics(false);setIsData(false);setIsSales(false); setIsOther(false);setIsManagement(false)}}>Logistics</span>
                                                        <span className={accountPreferenceDropDown === "Marketing" ? "custom-option selected":"custom-option"} onClick={() => { setAccountPreferenceDropDown('Marketing'); setError(""); setSuccess("");setIsAccountPreferenceOpen(false); setIsAccount(false); setIsLogistics(false); setIsMarketing(false);setIsData(false);setIsSales(false); setIsOther(false);setIsManagement(false)}}>Marketing</span>
                                                        <span className={accountPreferenceDropDown === "Data" ? "custom-option selected":"custom-option"} onClick={() => { setAccountPreferenceDropDown('Data'); setError(""); setSuccess("");setIsAccountPreferenceOpen(false); setIsAccount(false); setIsLogistics(false); setIsMarketing(false);setIsData(false);setIsManagement(false)}}>Data</span>
                                                        <span className={accountPreferenceDropDown === "Management" ? "custom-option selected":"custom-option"} onClick={() => { setAccountPreferenceDropDown('Management'); setError(""); setSuccess("");setIsAccountPreferenceOpen(false); setIsAccount(false); setIsLogistics(false); setIsMarketing(false);setIsData(false);setIsManagement(false)}}>Management</span>
                                                        <span className={accountPreferenceDropDown === "Sales" ? "custom-option selected":"custom-option"} onClick={() => { setAccountPreferenceDropDown('Sales'); setError(""); setSuccess(""); setIsAccountPreferenceOpen(false); setIsAccount(false); setIsLogistics(false); setIsMarketing(false);setIsData(false); setIsSales(false); setIsOther(false);setIsManagement(false)}}>Sales</span>
                                                        <span className={accountPreferenceDropDown === "Other" ? "custom-option selected":"custom-option"} onClick={() => { setAccountPreferenceDropDown('Other'); setError(""); setSuccess(""); setIsAccountPreferenceOpen(false); setIsAccount(false); setIsLogistics(false); setIsMarketing(false);setIsData(false); setIsSales(false); setIsOther(false);setIsManagement(false)}}>Other</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-start street-filed">
                                        <label>Other Preferences:</label>
                                        <div className="d-flex flex-column checkbox-filed">
                                            {
                                                accountPreferenceDropDown === "Accounting" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsLogistics(e.target.checked)} checked={isLogistics}></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsMarketing(e.target.checked)} checked={isMarketing}></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsData(e.target.checked)} checked={isData}></input><span className="ml-2">Data</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsManagement(e.target.checked)} checked={isManagement}></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsSales(e.target.checked)} checked={isSales}></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsOther(e.target.checked)} checked={isOther}></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                            {
                                                accountPreferenceDropDown === "Logistics" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsAccount(e.target.checked)} checked={isAccount}></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsMarketing(e.target.checked)} checked={isMarketing}></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsData(e.target.checked)} checked={isData}></input><span className="ml-2">Data </span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsManagement(e.target.checked)} checked={isManagement}></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsSales(e.target.checked)} checked={isSales}></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsOther(e.target.checked)} checked={isOther}></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                            
                                            {
                                                accountPreferenceDropDown === "Marketing" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsAccount(e.target.checked)} checked={isAccount}></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsLogistics(e.target.checked)} checked={isLogistics}></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsData(e.target.checked)} checked={isData}></input><span className="ml-2">Data</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsManagement(e.target.checked)} checked={isManagement}></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsSales(e.target.checked)} checked={isSales}></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsOther(e.target.checked)} checked={isOther}></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                            {
                                                accountPreferenceDropDown === "Data" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsAccount(e.target.checked)} checked={isAccount}></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsLogistics(e.target.checked)} checked={isLogistics}></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsMarketing(e.target.checked)} checked={isMarketing}></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Data</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsManagement(e.target.checked)} checked={isManagement}></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsSales(e.target.checked)} checked={isSales}></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsOther(e.target.checked)} checked={isOther}></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                            {
                                                accountPreferenceDropDown === "Sales" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsAccount(e.target.checked)} checked={isAccount}></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsLogistics(e.target.checked)} checked={isLogistics}></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsMarketing(e.target.checked)} checked={isMarketing}></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsData(e.target.checked)} checked={isData}></input><span className="ml-2">Data</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsManagement(e.target.checked)} checked={isManagement}></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsOther(e.target.checked)} checked={isOther}></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                               {
                                                accountPreferenceDropDown === "Other" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsAccount(e.target.checked)} checked={isAccount}></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsLogistics(e.target.checked)} checked={isLogistics}></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsMarketing(e.target.checked)} checked={isMarketing}></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsData(e.target.checked)} checked={isData}></input><span className="ml-2">Data</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsManagement(e.target.checked)} checked={isManagement}></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsSales(e.target.checked)} checked={isSales}></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                            {
                                                accountPreferenceDropDown === "Management" ? (
                                                    <>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsAccount(e.target.checked)} checked={isAccount}></input><span className="ml-2">Accounting</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsLogistics(e.target.checked)} checked={isLogistics}></input><span className="ml-2">Logistics</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsMarketing(e.target.checked)} checked={isMarketing}></input><span className="ml-2">Marketing</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsData(e.target.checked)} checked={isData}></input><span className="ml-2">Data</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" checked></input><span className="ml-2">Management</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsSales(e.target.checked)} checked={isSales}></input><span className="ml-2">Sales</span>
                                                        </div>
                                                        <div className="d-flex mb-2">
                                                            <input type="checkbox" onChange={(e) => setIsOther(e.target.checked)} checked={isOther}></input><span className="ml-2">Other</span>
                                                        </div>
                                                    </>
                                                ): ""
                                            }
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label></label>
                                        <span className="error-text">{error}</span>
                                        <span className="success-text">{success}</span>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <input type="submit" value="Save" className="save-btn" />
                        </Modal.Footer>
                    </form>
            </Modal> 
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage} />
            <Modal show={convertModal}
                onHide={() => setConvertModal(false)} className="custom-modal user-updated-modal">
                <Modal.Header closeButton>
                    <Modal.Title>EDIT USER DETAILS</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="change-address-body">
                        <div className="change-address-wrapper">
                            <div className="change-address-list d-flex align-items-center street-filed">
                                <label></label>
                                <span className="error-text">{error}</span>
                                <span className="success-text">{success}</span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" onClick = {() => setConvertModal(false)}className="save-btn">OK</Button>
                </Modal.Footer>
            </Modal>
        </>
        
    );
};

export default UserSection;