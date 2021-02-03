import React, {useState, useEffect} from 'react';
import {Link, NavLink, Route, useHistory} from "react-router-dom";
import './index.scss';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import AddNote from '../../../Modals/AddNote'
import ReplyEmail from '../../../Modals/ReplyEmail'
import EmailsMob from "../EmailsMob";
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { setRoute, setSession } from '../../../../utils/Actions';
import axios from 'axios';
import EditIcon from '../../../../assets/images/edit-icon.svg';

const Communication = (props) => {
    const [showNote,setshowNote] = useState(false);
    const [showReply,setshowReply] = useState(false);
    const [showHead, setshowHead] = useState(false);
    const [active,setActive] = useState(0);
    const [eventList, setEventList] = useState();
    const [loadingData, setLoadingData] = useState(false);

    const history = useHistory();
    const dispatch = useDispatch();

    const route = useSelector(state => state.route);
    const query = useSelector(state => state.userRegion);

    const [emailList, setEmailList] = useState();
    const [allEmailList, setAllEmailList] = useState();
    const [callList, setCallList] = useState();
    const [allCallList, setAllCallList] = useState();
    const [noteList, setNoteList] = useState();
    const [success, setSuccess] = useState();
    const [dropDownValueEmail, setDropDownValueEmail] = useState();
    const [dropDownValueEmail2, setDropDownValueEmail2] = useState();
    const [dropDownListEmail, setDropDownListEmail] = useState();
    const [dropDownValueCall, setDropDownValueCall] = useState();
    const [dropDownValueCall2, setDropDownValueCall2] = useState();
    const [dropDownListCall, setDropDownListCall] = useState();

    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [isCallOpen, setIsCallOpen] = useState(false);
    const [isEmail2Open, setIsEmail2Open] = useState(false);
    const [isCall2Open, setIsCall2Open] = useState(false);
    const [note, setNote] = useState();
    const [date, setDate] = useState();
    const [time, setTime] = useState();
    const [minimumDate, setMinimumDate] = useState();
    //notes edit modal
    const [calendarInfoModal, setCalendarInfoModal] = useState(false);
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const [modalNotes, setModalNotes] = useState();
    const [modalRescheduleDate, setModalRescheduleDate] = useState();
    const [modalRescheduleTime, setModalRescheduleTime] = useState();
    const [modalStatus, setModalStatus] = useState();
    const [modalCreatedBy, setModalCreatedBy] = useState();
    const [modalCreatedFor, setModalCreatedFor] = useState();
    const [modalCreatedOn, setModalCreatedOn] = useState();
    const [isEventCompleted, setIsEventCompleted] = useState();
    const [eventId, setEventId] = useState();
    const [eventDate, setEventDate] = useState();
    const [eventTime, setEventTime] = useState();
    const [modalCustomerId, setModalCustomerId] = useState();

    //modal vars
    const[error,setError] = useState('');
    const[infoModal,setInfoModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    //token 
    const [token, setToken] = useState();
    useEffect(() => {
        const jwtToken = localStorage.getItem("jwtToken"); 
        if(jwtToken) {
            setToken(jwtToken);
        }
    })
    useEffect(() => {
        // console.log("props on communication",props.data)
        let arrayDropDownListEmail=[], arrayDropDownListCall=[], arrayEmailList=[], arrayCallList=[];

        //email
        if(props.emaillist) {
            // console.log("email props list",props.list)
            Object.entries(props.emaillist).map((value)=>{
                arrayDropDownListEmail.push(value);
            });
            if(arrayDropDownListEmail.length>0) {
                setDropDownValueEmail(arrayDropDownListEmail[0][1]);
            }
            setDropDownListEmail(arrayDropDownListEmail);
        }
        if(props.email) {
            // console.log("email props",props.email)
            Object.entries(props.email).map((value)=>{
                arrayEmailList.push(value);
            });
            setAllEmailList(arrayEmailList);
            setEmailList(arrayEmailList);
            setDropDownValueEmail("ALL");
            setDropDownValueEmail2("ALL");
            // if(arrayDropDownListEmail.length>0 && arrayEmailList.length>0) {
            //     let temp = arrayEmailList.filter((data) => {
            //         if(data[1].FROM_ADDRESS.toLowerCase().includes(arrayDropDownListEmail[0][1].toLowerCase()) || data[1].TO_ADDRESS.toLowerCase().includes(arrayDropDownListEmail[0][1].toLowerCase())){
            //             return data;
            //         }
            //     });
            //     if(localStorage.getItem("customer_type")==="Customer") {
            //         setEmailList(temp);
            //     }else {
            //         setEmailList(arrayEmailList);
            //     }
            // }
        }

        //calls
        if(props.calllist) {
            // console.log("call props list",props.list)
            Object.entries(props.calllist).map((value)=>{
                arrayDropDownListCall.push(value);
            });
            // if(arrayDropDownListCall.length>0) {
            //     setDropDownValueCall(arrayDropDownListCall[0][1]);
            // }
            setDropDownListCall(arrayDropDownListCall);
        }
        if(props.call) {
            // console.log("call props",props.call)
            Object.entries(props.call).map((value)=>{
                arrayCallList.push(value);
            });
            setAllCallList(arrayCallList);
            setCallList(arrayCallList);
            setDropDownValueCall("ALL");
            setDropDownValueCall2("ALL");
            // if(arrayDropDownListCall.length>0 && arrayCallList.length>0) {
            //     let temp = arrayCallList.filter((data) => {
            //         if(data[1].PRIMARY_PHONE_NUMBER.toLowerCase().includes(arrayDropDownListCall[0][1].toLowerCase()) || data[1].TO_NUM.toLowerCase().includes(arrayDropDownListCall[0][1].toLowerCase())){
            //             return data;
            //         }
            //     });
            //     if(localStorage.getItem("customer_type")==="Customer") {
            //         setCallList(temp);
            //     }else {
            //         setCallList(arrayCallList);
            //     }
            // }
        }

        //notes
        if(props.note) {
            setNoteList(props.note);
        }
        if(props.events) {
            setEventList(props.events);
        }
    },[props])
    
    useEffect(() => {
        var currentDate = new Date();
        var year = currentDate.getFullYear();                        // YYYY
        var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);  // MM
        var day = ("0" + currentDate.getDate()).slice(-2);           // DD
        var minDate = (year +"-"+ month +"-"+ day);
        setMinimumDate(minDate);
    },[]);
    const handleSwitch = (path) => {
        dispatch(setRoute({route:path}))
        history.push(path);
    }
    const handleEmail = (id) => {
        localStorage.setItem('email-id',id);
        history.push("/email-mob");
    }
    const handleDropDownClick = (value,type) => {
        if(type==="Email") {
            let filterList = [];
            if(value === "ALL" && dropDownValueEmail2==="ALL") {
                setEmailList(allEmailList);
            } else if(dropDownValueEmail2 === "ALL") {
                filterList = allEmailList.filter((data) => {
                    if(data[1].FROM_ADDRESS.toLowerCase().includes(value.toLowerCase())){
                        return data;
                    }
                }); 
                setEmailList(filterList);
            } else if(value === "ALL") {
                filterList = allEmailList.filter((data) => {
                    if(data[1].TO_ADDRESS.toLowerCase().includes(dropDownValueEmail2.toLowerCase())){
                        return data;
                    }
                }); 
                setEmailList(filterList);
            } else {
                filterList = allEmailList.filter((data) => {
                    if(data[1].FROM_ADDRESS.toLowerCase().includes(value.toLowerCase()) && data[1].TO_ADDRESS.toLowerCase().includes(dropDownValueEmail2.toLowerCase())){
                        return data;
                    }
                }); 
                setEmailList(filterList);
            }
    
            // console.log("dp-1 | dp-2", value, dropDownValueEmail2)
            // console.log("Filtered Data",filterList);
        } else {
            let filterList = [];
            if(value === "ALL" && dropDownValueCall2==="ALL") {
                setCallList(allCallList);
            } else if(dropDownValueCall2 === "ALL") {
                filterList = allCallList.filter((data) => {
                    if(data[1].FROM_NAME.toLowerCase().includes(value.toLowerCase())){
                        return data;
                    }
                }); 
                setCallList(filterList);
            } else if(value === "ALL") {
                filterList = allCallList.filter((data) => {
                    if(data[1].TO_NAME.toLowerCase().includes(dropDownValueCall2.toLowerCase())){
                        return data;
                    }
                }); 
                setCallList(filterList);
            } else {
                filterList = allCallList.filter((data) => {
                    if(data[1].FROM_NAME.toLowerCase().includes(value.toLowerCase()) && data[1].TO_NAME.toLowerCase().includes(dropDownValueCall2.toLowerCase())){
                        return data;
                    }
                }); 
                setCallList(filterList);
            }
    
            // console.log("dp-1 | dp-2", value, dropDownValueCall2)
            // console.log("Filtered Data",filterList);
        }
    }
    const handleDropDownClick2 = (value,type) => {
        if(type==="Email") {
            let filterList = [];
            if(value === "ALL" && dropDownValueEmail==="ALL") {
                setEmailList(allEmailList);
            } else if(dropDownValueEmail === "ALL") {
                filterList = allEmailList.filter((data) => {
                    if(data[1].TO_ADDRESS.toLowerCase().includes(value.toLowerCase())){
                        return data;
                    }
                }); 
                setEmailList(filterList);
            } else if(value === "ALL") {
                filterList = allEmailList.filter((data) => {
                    if(data[1].FROM_ADDRESS.toLowerCase().includes(dropDownValueEmail.toLowerCase())){
                        return data;
                    }
                }); 
                setEmailList(filterList);
            } else {
                filterList = allEmailList.filter((data) => {
                    if(data[1].FROM_ADDRESS.toLowerCase().includes(dropDownValueEmail.toLowerCase()) && data[1].TO_ADDRESS.toLowerCase().includes(value.toLowerCase())){
                        return data;
                    }
                }); 
                setEmailList(filterList);
            }

        // console.log("dp-1 | dp-2", value, dropDownValueEmail)
        // console.log("Filtered Data",filterList);
        }else {
            let filterList = [];
            if(value === "ALL" && dropDownValueCall==="ALL") {
                setCallList(allCallList);
            } else if(dropDownValueCall === "ALL") {
                filterList = allCallList.filter((data) => {
                    if(data[1].TO_NAME.toLowerCase().includes(value.toLowerCase())){
                        return data;
                    }
                }); 
                setCallList(filterList);
            } else if(value === "ALL") {
                filterList = allCallList.filter((data) => {
                    if(data[1].FROM_NAME.toLowerCase().includes(dropDownValueCall.toLowerCase())){
                        return data;
                    }
                }); 
                setCallList(filterList);
            } else {
                filterList = allCallList.filter((data) => {
                    if(data[1].FROM_NAME.toLowerCase().includes(dropDownValueCall.toLowerCase()) && data[1].TO_NAME.toLowerCase().includes(value.toLowerCase())){
                        return data;
                    }
                }); 
                setCallList(filterList);
            }
    
            // console.log("dp-1 | dp-2", value, dropDownValueCall)
            // console.log("Filtered Data",filterList);
        }  
    }
    const handleEditIcon = (value) => {
        // console.log("event details", value)
        setSuccess("");
        setModalCreatedOn(value.CREATED_AT ? value.CREATED_AT : "");
        setModalCreatedBy(value.CREATED_BY ? value.CREATED_BY : "");
        setModalCreatedFor(value.CUSTOMER_ID ? value.CUSTOMER_ID : "");
        setEventId(value.EVENT_ID ? value.EVENT_ID : "");
        setEventDate(value.EVENT_DATE ? value.EVENT_DATE : "");
        setEventTime(value.EVENT_TIME ? value.EVENT_TIME : "");
        setModalNotes(value.NOTES ? value.NOTES : "");
        setModalStatus(value.STATUS ? value.STATUS : "");
        setIsEventCompleted(value.STATUS==="1" ? true : false);
        setModalRescheduleDate(value.EVENT_DATE ? value.EVENT_DATE : "");
        setModalRescheduleTime(value.EVENT_TIME ? value.EVENT_TIME : "");
        setModalCustomerId(value.CUSTOMER_ID ? value.CUSTOMER_ID : "");
        setCalendarInfoModal(true);
    }
    const handleSubmitEvent = (e) => {
        e.preventDefault();

        if(eventId) {
            axios
            .post("/accounts/event_update"+query,{
                event_id: eventId,
                date: modalRescheduleDate,
                time: modalRescheduleTime,
                notes: modalNotes
            }).then((res) => {
                if(res.data=="1") {
                    axios
                .post("/accounts/event_complete"+query,{
                    event_id:eventId,
                    status:isEventCompleted ? 1 : 0
                }).then((response) => {
                    if(response.data == "1") {
                        setSuccess("Event Updated!");
                        props.callBackFetch();
                    }
                })
                .catch((error) => {
                    console.log(error);
                    dispatch(setSession());
                });
                }
            })
            .catch((error) => {
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
    const handleAddNote = (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if(time && date && note) {
            axios.post("accounts/add_event"+query,{
                customer_id:localStorage.getItem("customer_id"),
                notes: note,
                date,
                time
            }).then((res) => {
                // console.log("response from event api:", res.data);
                if(res.data.message === "event added") {
                    setSuccess("Event Added Successfully!");
                    setNote('');
                    setDate("");
                    setTime("");
                    setSuccessModal(true);
                    handleFetchInfo();

                }else {
                    setSessionMessage(res.data.message);
                    setIsSessionModal(true);
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
    const handleFetchInfo = () => {
        props.callBackFetch();
    }


    return (
        <div className="sub-head-navbar">
            <div className="account-info-content-block customer-details-info d-flex flex-column">
            <div className="account-info-content-block customer-details-info d-flex flex-column">
                    <div className="head d-flex align-items-center justify-content-between">
                        <div className="title"><h6>Notes</h6></div>
                    </div>
                    <div className="content-card">
                        <form onSubmit={(e) => handleAddNote(e)}>
                            <div className="content-detail d-flex align-items-center">
                                <div className="content-detail-list note-left-section mb-0">
                                    <input type="text" className="text-area-box" value={note} onChange={(e) => setNote(e.target.value)} required></input>
                                </div>
                                <div className="content-detail-list mb-0 pl-md-4">
                                    <div className="date-time-btn-wrapper d-flex flex-column flex-md-row align-items-center">
                                        <div className="d-flex flex-column mt-2 mt-md-0">
                                            <label className="mb-1">Follow up on</label>
                                            <input className="date-time-input" min={minimumDate} type="date" value={date?date:""} onChange={(e) => setDate(e.target.value)} required></input>
                                        </div>
                                        <div className="d-flex flex-column ml-md-2 my-2 my-md-0">
                                            {
                                                query === "?region=UK" ? (<label className="mb-1">Time zone GMT</label>) : <label className="mb-1">Time zone PST</label>
                                            }
                                            <input className="date-time-input" type="time" step="300" value={time?time:""} onChange={(e) => setTime(e.target.value)} required></input>
                                        </div>
                                        <input className="date-time-btn ml-3" type="submit" value="Save"></input>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
                {
                    eventList && eventList.length>0 ? (
                        eventList.map((value, index) => {
                            return(
                                <div className="account-info-content-block customer-details-info d-flex flex-column" key={index}>
                                    <div className="head d-flex align-items-center justify-content-between">
                                        <div className="title">
                                            <h6>Follow Up Details</h6>
                                        </div>
                                        
                                        <div className="d-flex">
                                            <div className="edit">
                                                <Button variant="link" onClick={() => handleEditIcon(value)}><i><img src={EditIcon} alt="edit-icon"/></i> Edit</Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="content-card">
                                        <div className="content-detail d-flex">
                                            <div className="content-detail-list">
                                                <span>{value.EVENT_DATE ? value.EVENT_DATE : "-"}</span>
                                                <label>Event Date</label>
                                            </div>
                                            <div className="content-detail-list">
                                                <span>{value.EVENT_TIME ? value.EVENT_TIME : "-"}</span>
                                                <label>Event Time</label>
                                            </div>
                                            <div className="content-detail-list">
                                                <span>{value.CREATED_BY ? value.CREATED_BY : "-"}</span>
                                                <label>Created By</label>
                                            </div>
                                        </div>
                                        <div className="content-detail d-flex">
                                            <div className="content-detail-list">
                                                <span>{value.CREATED_AT ? value.CREATED_AT : "-"}</span>
                                                <label>Created At</label>
                                            </div>
                                            <div className="content-detail-list">
                                                <span>{value.NOTES ? value.NOTES : "-"}</span>
                                                <label>Notes</label>
                                            </div>
                                            <div className="content-detail-list">
                                                <span className={value.STATUS === "1" ? "status-complete" : "status-incomplete"}>{value.STATUS === "1" ? "Completed" : "Incomplete"}</span>
                                                <label>Status</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>               
                            )
                        })
                    ) : ""
                }
                {
                    eventList && eventList.length===0 && loadingData===false ? (
                        <div className="account-info-content-block customer-details-info d-flex flex-column">
                            <div className="head d-flex align-items-center justify-content-between">
                                <div className="title">
                                    <h6>Follow Up Details</h6>
                                </div>
                                
                            </div>
                            <div className="content-card">
                                <div className="content-detail d-flex">
                                    <div className="content-detail-list">
                                        <span className="text-center">No Events Found!</span>
                                    </div>
                                </div>
                            </div>
                        </div> 
                    ) :
                    ("")
                }

            <div className="navbar custom-navbar mt-4">
                <a className={route === "/accountinfo/communication/calls" ? "nav-list active" : "nav-list" } onClick={()=>handleSwitch("/accountinfo/communication/calls")}>Calls</a>
                <a className={route === "/accountinfo/communication" ? "nav-list active" : "nav-list" } onClick={()=>handleSwitch("/accountinfo/communication")}>Notes</a>
                <a className={route === "/accountinfo/communication/emails" ? "nav-list active" : "nav-list" } onClick={()=>handleSwitch("/accountinfo/communication/emails")}>Emails <div className="new-show"><span>2 New</span></div></a>
                {/* <a className={route === "/accountinfo/communication/chats" ? "nav-list active" : "nav-list" } onClick={()=>handleSwitch("/accountinfo/communication/chats")}>Chats <div className="new-show"><span>1 New</span></div></a>
                <a className={route === "/accountinfo/communication/texts" ? "nav-list active" : "nav-list" } onClick={()=>handleSwitch("/accountinfo/communication/texts")}>Texts</a> */}

                <a className={route === "/accountinfo/communication/chats" ? "nav-list active" : "nav-list" }>Chats <div className="new-show"><span>1 New</span></div></a>
                <a className={route === "/accountinfo/communication/texts" ? "nav-list active" : "nav-list" }>Texts</a>
            </div>
            <Accordion className="mobile-accordion">
                {/* call */}
                <Card>
                    <Card.Header className={showHead === 0 ? "head-show " : ""} >
                        <Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={()=>setshowHead(0)}>
                            <div className="title-contact-date d-flex align-items-center">
                                <div className="title-head">
                                    <span>Calls</span>
                                </div>
                                <div className="contact-date">
                                    <span>Last Contact: {callList && callList.length>0 ? callList[callList.length-1][1].CALL_TIME ? callList[callList.length-1][1].CALL_TIME:"-":"-"}</span>
                                </div>
                            </div>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="0" className="card-collapse">
                        <Card.Body>
                            <div className="row calls-drop-down px-3 pt-2">
                                <div className="col-sm-6">
                                    <label>From:</label>
                                    <div className="dropUp">
                                        <div className="custom-select-wrapper d-flex align-items-center">
                                            <div className={isCallOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                <div className="custom-select__trigger" onClick={()=>setIsCallOpen(!isCallOpen)}><span>
                                                {
                                                        dropDownListCall && dropDownListCall.length>0 ? (
                                                        dropDownValueCall ? dropDownValueCall :"Loading..."
                                                    ):"Empty List"
                                                }
                                                    </span>
                                                    <div className="arrow">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="custom-options">
                                                    {
                                                        dropDownListCall && dropDownListCall.length>0 ?
                                                        (
                                                            dropDownListCall.map((value, index) => {
                                                                return(
                                                                    <span className={value[0] === dropDownValueCall ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValueCall(value[0]);handleDropDownClick(value[0],"Call");setIsCallOpen(false)}}>{value[0]}</span>
                                                                )
                                                            })
                                                        ):("")
                                                    }
                                                    {
                                                        dropDownListCall && dropDownListCall.length>0 ? (<span className={dropDownValueCall === "ALL"? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValueCall("ALL");handleDropDownClick("ALL","Call");setIsCallOpen(false)}}>{"ALL"}</span>):""
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>      
                                </div>
                                <div className="col-sm-6">
                                    <label>To:</label>
                                    <div className="dropUp">
                                        <div className="custom-select-wrapper d-flex align-items-center">
                                            <div className={isCall2Open ? "custom-selectDrop open":"custom-selectDrop "}>
                                                <div className="custom-select__trigger" onClick={()=>setIsCall2Open(!isCall2Open)}><span>
                                                {
                                                        dropDownListCall && dropDownListCall.length>0 ? (
                                                        dropDownValueCall2 ? dropDownValueCall2 :"Loading..."
                                                    ):"Empty List"
                                                }
                                                    </span>
                                                    <div className="arrow">
                                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="custom-options">
                                                    {
                                                        dropDownListCall && dropDownListCall.length>0 ?
                                                        (
                                                            dropDownListCall.map((value, index) => {
                                                                return(
                                                                    <span className={value[0] === dropDownValueCall2 ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValueCall2(value[0]);handleDropDownClick2(value[0],"Call");setIsCall2Open(false)}}>{value[0]}</span>
                                                                )
                                                            })
                                                        ):("")
                                                    }
                                                    {
                                                        dropDownListCall && dropDownListCall.length>0 ? (<span className={dropDownValueCall2 === "ALL"? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValueCall2("ALL");handleDropDownClick2("ALL","Call");setIsCall2Open(false)}}>{"ALL"}</span>):""
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        
                        
                        {
                            callList && callList.length>0 ? 
                            (
                                callList.map((value, index)=>{
                                    return(
                                        <>
                                            <div className="accordion-detail mt-2">
                                                <div className="date-time-head">
                                                    <div className="date-time-col">
                                                        <label>Date</label>
                                                        <span>{value[1].CALL_DATE ? value[1].CALL_DATE : "-"}</span>
                                                    </div>
                                                    <div className="date-time-col">
                                                        <label>Time</label>
                                                        <span>{value[1].CALL_TIME ? value[1].CALL_TIME : "-"}</span>
                                                    </div>
                                                    <div className="date-time-col">
                                                        <label>Rep</label>
                                                        <span>{value[1].FROM_NUM ? value[1].FROM_NUM : "-"}</span>
                                                    </div>
                                                    <div className="date-time-col">
                                                        <label>Timezone</label>
                                                        <span>{value[1].TIME_ZONE ? value[1].TIME_ZONE : "-"}</span>
                                                    </div>
                                                </div>
                                                {/* <div className="details">
                                                    <div className="details-title">
                                                        <span>Details</span>
                                                    </div>
                                                    <p>Imperdiet vitae morbi in faucibus scelerisque donec tincidunt nulla. Hendrerit condimentum vitae duis aenean tellus. Dignissim mi semper lobortis enim duis. Eu pretium tortor tincidunt fringilla fringilla.</p>
                                                </div> */}
                                            </div>
                                            <div className="accordion-bottom-btn">
                                                <div className="accordion-btn-row d-flex">
                                                <form method="get" action="https://crmapi.tftc.company/accounts/call_audio/" target="_blank">
                                                    <input type="hidden" name="call_id" value={value[1].CALL_ID ? value[1].CALL_ID :""}></input>
                                                    <input type="hidden" name="token" value={token ? token :""}></input>
                                                    <button type="submit" className="listen-btn"><i></i> Listen</button>
                                                </form>
                                                    {/* <Button variant="primary" className="listen-btn" onClick={()=>handlePlayButton(value[1].CALL_ID)}><i></i> Listen</Button> */}
                                                    <Button variant="primary" className="call-btn">Call</Button>
                                                </div>
                                            </div>
                                        </>
                                    )
                                }))
                            :
                            (<div className="mobile-table-list text-center">
                                Empty Call History
                            </div>)
                        }
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                {/* notes */}
                <Card>
                    <Card.Header className={showHead === 1 ? "head-show " : ""}>
                        <Accordion.Toggle as={Button} variant="link" eventKey="1" onClick={()=>setshowHead(1)}>
                            <div className="title-contact-date d-flex align-items-center">
                                <div className="title-head">
                                    <span>Notes</span>
                                </div>
                                <div className="contact-date">
                                    <span>Last Contact: {noteList && noteList.length>0 ? noteList[noteList.length-1].time ? noteList[noteList.length-1].time:"-":"-"}</span>
                                </div>
                            </div>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="1" className="card-collapse">
                        <Card.Body>
                        {
                                noteList && noteList.length > 0 ? 
                                (
                                    noteList.map((value,index) => {
                                        return (
                                            <div className="accordion-detail" key={index}>
                                                <div className="date-time-head">
                                                    <div className="date-time-col">
                                                        <label>Date</label>
                                                        <span>{value.time ? value.time : "-"}</span>
                                                    </div>
                                                    <div className="date-time-col">
                                                        <label>Rep</label>
                                                        <span>{value.reply ? value.reply : "-"}</span>
                                                    </div>
                                                </div>
                                                <div className="details">
                                                    <div className="details-title">
                                                        <span>Details</span>
                                                    </div>
                                                    <p>{value.note ? value.note : "-"}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) 
                            : 
                                (
                                    <div className="d-flex py-4 justify-content-center">Empty Notes</div>
                                )
                            }
                            <div className="accordion-bottom-btn">
                                <div className="accordion-btn-row d-flex">
                                    <Button variant="primary" className="note-btn" onClick={()=>setshowNote(true)}><i></i> Add Note</Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                {/* email */}
                <Card>
                    <Card.Header className={showHead === 2 ? "head-show " : ""}>
                        <Accordion.Toggle as={Button} variant="link" eventKey="2" onClick={()=>setshowHead(2)}>
                            <div className="title-contact-date d-flex align-items-center">
                                <div className="title-head">
                                    <span>Email</span>
                                </div>
                                <div className="contact-date">
                                    <span>Last Contact: {emailList && emailList.length>0 ? emailList[emailList.length-1][1].SEND_TIME ? emailList[emailList.length-1][1].SEND_TIME:"-":"-"}</span>
                                </div>
                            </div>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="2" className="card-collapse">
                        <Card.Body>
                            <div className="email-drop-down pt-2 px-3">
                                <label>From:</label>
                                <div className="dropUp">
                                    <div className="custom-select-wrapper d-flex align-items-center">
                                        <div className={isEmailOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                            <div className="custom-select__trigger" onClick={()=>setIsEmailOpen(!isEmailOpen)}><span>
                                                {
                                                    dropDownListEmail && dropDownListEmail.length>0 ? (
                                                        dropDownValueEmail ? dropDownValueEmail :"Loading..."
                                                    ):"Empty List"
                                                }
                                                </span>
                                                <div className="arrow">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="custom-options">
                                                {
                                                    dropDownListEmail&& dropDownListEmail.length>0 ?
                                                    (
                                                        dropDownListEmail.map((value, index) => {
                                                            return(
                                                                <span key={index} className={value[1] === dropDownValueEmail ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValueEmail(value[1]);handleDropDownClick(value[1],"Email");setIsEmailOpen(false)}}>{value[1]}</span>
                                                            )
                                                        })
                                                    ):("")
                                                }
                                                {
                                                    dropDownListEmail && dropDownListEmail.length>0 ?
                                                    (<span className={dropDownValueEmail==="ALL" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValueEmail("ALL");handleDropDownClick("ALL","Email");setIsEmailOpen(false)}}>{"ALL"}</span>):""
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <label>To:</label>
                                <div className="dropUp">
                                    <div className="custom-select-wrapper d-flex align-items-center">
                                        <div className={isEmail2Open ? "custom-selectDrop open":"custom-selectDrop "}>
                                            <div className="custom-select__trigger" onClick={()=>setIsEmail2Open(!isEmail2Open)}><span>
                                                {
                                                    dropDownListEmail && dropDownListEmail.length>0 ? (
                                                        dropDownValueEmail2 ? dropDownValueEmail2 :"Loading..."
                                                    ):"Empty List"
                                                }
                                                </span>
                                                <div className="arrow">
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="custom-options">
                                                {
                                                    dropDownListEmail&& dropDownListEmail.length>0 ?
                                                    (
                                                        dropDownListEmail.map((value, index) => {
                                                            return(
                                                                <span className={value[1] === dropDownValueEmail2 ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValueEmail2(value[1]);handleDropDownClick2(value[1],"Email");setIsEmail2Open(false)}}>{value[1]}</span>
                                                            )
                                                        })
                                                    ):("")
                                                }
                                                {
                                                    dropDownListEmail && dropDownListEmail.length>0 ?
                                                    (<span className={dropDownValueEmail2==="ALL" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValueEmail2("ALL");handleDropDownClick2("ALL","Email");setIsEmail2Open(false)}}>{"ALL"}</span>):""
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        
                            <div className="email-listing">
                                {
                                    emailList && emailList.length > 0 ?
                                    (
                                        emailList.map((value,index) => {
                                            return(
                                                <div className="list" key={index}>
                                                    <a onClick={() => handleEmail(value[0])}>
                                                        <div className="date-subject-row d-flex">
                                                            <div className="date-subject">
                                                                <label>Date</label>
                                                            </div>
                                                            <div className="date-subject-dot d-flex justify-content-between">
                                                                <div className="date-sub">
                                                                    <span>{value[1].SEND_TIME ? value[1].SEND_TIME : "-"}</span>
                                                                </div>
                                                                <div className="list-dot">
                                                                    <i></i>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="date-subject-row d-flex">
                                                            <div className="date-subject">
                                                                <label>Subject</label>
                                                            </div>
                                                            <div className="date-subject-dot d-flex justify-content-between">
                                                                <div className="date-sub">
                                                                <span>{value[1].SUBJECT ? value[1].SUBJECT : "-"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                </div>
                                            )
                                        })
                                    )
                                :
                                    <div className="d-flex py-4 justify-content-center">Empty Inbox</div>
                                }   
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                {/* chats */}
                <Card>
                    <Card.Header className={showHead === 3 ? "head-show " : ""}>
                        {/* <Accordion.Toggle as={Button} variant="link" eventKey="3" onClick={()=>setshowHead(3)}> */}
                        <Accordion.Toggle as={Button} variant="link" onClick={()=>setshowHead(3)}>
                            <div className="title-contact-date d-flex align-items-center">
                                <div className="title-head">
                                    <span>Chats</span>
                                </div>
                                <div className="contact-date">
                                    <span>Last Contact: dd mmm yyyy</span>
                                </div>
                            </div>
                        </Accordion.Toggle>
                    </Card.Header>
                    {/* <Accordion.Collapse eventKey="3" className="card-collapse"> */}
                    <Accordion.Collapse  className="card-collapse">
                        <Card.Body>
                            <div className="email-listing">
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>mm/dd/yyyy</span>
                                                </div>
                                                <div className="list-dot">
                                                    <i></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>mm/dd/yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>mm/dd/yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>mm/dd/yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>mm/dd/yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>mm/dd/yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>mm/dd/yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>mm/dd/yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
                {/* texts */}
                <Card>
                    <Card.Header className={showHead === 4 ? "head-show " : ""}>
                        {/* <Accordion.Toggle as={Button} variant="link" eventKey="4" onClick={()=>setshowHead(4)}> */}
                        <Accordion.Toggle as={Button} variant="link" onClick={()=>setshowHead(4)}>
                            <div className="title-contact-date d-flex align-items-center">
                                <div className="title-head">
                                    <span>Texts</span>
                                </div>
                                <div className="contact-date">
                                    <span>Last Contact: dd mmm yyyy</span>
                                </div>
                            </div>
                        </Accordion.Toggle>
                    </Card.Header>
                    <Accordion.Collapse eventKey="4" className="card-collapse">
                        <Card.Body>
                            <div className="email-listing">
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>dd mm yyyy</span>
                                                </div>
                                                <div className="list-dot">
                                                    <i></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>dd mm yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>dd mm yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>dd mm yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>dd mm yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>dd mm yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>dd mm yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="list">
                                    <Link to="/chat-mob">
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Date</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>dd mm yyyy</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="date-subject-row d-flex">
                                            <div className="date-subject">
                                                <label>Customer</label>
                                            </div>
                                            <div className="date-subject-dot d-flex justify-content-between">
                                                <div className="date-sub">
                                                    <span>Customer Chat ID</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </Card.Body>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
            <AddNote
                className="add-note-modal"
                show={showNote}
                onHide={() => setshowNote(false)}
            />
            <ReplyEmail
                className="reply-modal"
                show={showReply}
                onHide={() => setshowReply(false)}
            />
            <Modal show={infoModal}
                onHide={() => setInfoModal(false)} className="custom-modal user-updated-modal">
                <Modal.Header closeButton>
                    <Modal.Title>CALL INFORMATION</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="change-address-body">
                        <div className="change-address-wrapper">
                            <div className="change-address-list d-flex align-items-center street-filed">
                                <label></label>
                                <span className="error-text">{error}</span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" onClick = {() => setInfoModal(false)}className="save-btn">OK</Button>
                </Modal.Footer>
            </Modal>
            {/* Event Edit Modal */}
            <Modal show={calendarInfoModal} size="lg"
                    onHide={() => setCalendarInfoModal(false)} className="custom-modal user-updated-modal event-details-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>EVENT DETAILS</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={(e) => handleSubmitEvent(e)}>
                        <Modal.Body>
                            <div className="change-address-body">
                                <div className="change-address-wrapper px-0">
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>CREATED BY:</label>
                                        <input type="text" className="text-input"  value = {modalCreatedBy?modalCreatedBy:""} disabled></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>CREATED FOR:</label>
                                        <input type="text" className="text-input"  value = {modalCreatedFor?modalCreatedFor:""} disabled></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>{"EVENT DATE & TIME:"}</label>
                                        <input type="text" className="text-input"  value = {eventDate?eventDate+' '+ eventTime:""} disabled></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>NOTES: </label>
                                        <input type="text" className="text-input"  value = {modalNotes?modalNotes:""} onChange={(e) => {setModalNotes(e.target.value);setError("");setSuccess("")}} required></input>
                                    </div>
                                    <>
                                        <div className="change-address-list d-flex align-items-center street-filed">
                                            <label>Re-schedule Date:</label>
                                            <input type="date" value={modalRescheduleDate?modalRescheduleDate:""} className="text-input" onChange={(e) => setModalRescheduleDate(e.target.value)} required></input>
                                            {/* {
                                                isEventCompleted ? (
                                                    <><input type="date" value={rescheduleDate?rescheduleDate:""} className="text-input" onChange={(e) => setRescheduleDate(e.target.value)} required></input></>
                                                ) : (""
                                                    <><input type="date" min={minimumDate} value={rescheduleDate?rescheduleDate:""} className="text-input" onChange={(e) => setRescheduleDate(e.target.value)} required></input></>
                                                )
                                            } */}
                                        </div>
                                        <div className="change-address-list d-flex align-items-center street-filed">
                                            <label>Re-schedule Time:</label>
                                            <input type="time" className="text-input" value={modalRescheduleTime?modalRescheduleTime:""} onChange={(e) => setModalRescheduleTime(e.target.value)} required></input>
                                        </div>
                                    </>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>EVENT STATUS:</label> 
                                        {
                                            modalStatus === "0" ? (
                                                <>
                                                    <input type="checkbox" onChange={(e) => setIsEventCompleted(e.target.checked)} checked={isEventCompleted}></input><span className="ml-2">Mark as completed</span>
                                                </>
                                            ) : (
                                                <>
                                                    <input type="checkbox" onChange={(e) => setIsEventCompleted(e.target.checked)} checked={isEventCompleted}></input><span className="ml-2">Unmark from completed</span>
                                                </>
                                            )
                                        }
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
                            <input type="submit" value="Update Event" className="save-btn" />
                            {/* <input type="button" value={`View Account`} className="save-btn" onClick={() => {handleViewAccount()}}/> */}
                        </Modal.Footer>
                    </form>
                </Modal>
                <Modal show={successModal}
                    onHide={() => setSuccessModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>EDIT COMMUNICATION DETAILS</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="change-address-body">
                            <div className="change-address-wrapper">
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label></label>
                                    <span className="success-text">{success}</span>
                                    <span className="error-text">{error}</span>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="button" onClick = {() => setSuccessModal(false)}className="save-btn">OK</Button>
                    </Modal.Footer>
                </Modal>
        </div>
    );
};

export default Communication;