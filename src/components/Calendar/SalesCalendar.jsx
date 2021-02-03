
import React,{useEffect, useState} from "react";
import { useDispatch, useSelector } from 'react-redux';
import {setSession} from "../../utils/Actions";
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import editIcon from "../../../src/assets/images/edit-icon.svg";
import './index.scss';
// import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from '@fullcalendar/list';
import SessionModal from "../Modals/SessionModal";
import { useHistory } from "react-router-dom";



const SalesCalendar = () => {
    const dispatch = useDispatch();
    const [eventList, setEventList] = useState();
    const history = useHistory();
    const query = useSelector(state => state.userRegion);
    // modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const [calendarInfoModal, setCalendarInfoModal] = useState(false);
    const [createdBy, setCreatedBy] = useState();
    const [createdFor, setCreatedFor] = useState();
    const [dateTime, setDateTime] = useState();
    const [notes, setNotes] = useState();
    const [status, setStatus] = useState();
    const [eventId, setEventId] = useState();
    const [rescheduleDate, setRescheduleDate] = useState();
    const [rescheduleTime, setRescheduleTime] = useState();
    const [isEventCompleted, setIsEventCompleted] = useState(false);

    const [error, setError] = useState();
    const [success, setSuccess] = useState();
    const [minimumDate, setMinimumDate] = useState();

    //calendar vars
    const [eventArrayList, setEventArrayList] = useState();
    const [userList, setUserList] = useState();

    //dropdown vars
    const [isUserDropDownOpen, setIsUserDropDownOpen] = useState(false);
    const [userDropDown, setUserDropDown] = useState("All");

    useEffect(() => {
        var currentDate = new Date();
        var year = currentDate.getFullYear();                        // YYYY
        var month = ("0" + (currentDate.getMonth() + 1)).slice(-2);  // MM
        var day = ("0" + currentDate.getDate()).slice(-2);           // DD
        var minDate = (year +"-"+ month +"-"+ day);
        setMinimumDate(minDate);
    },[]);

    useEffect(() => {
        fetchEvents();
    }, []);
    
    const fetchEvents = () => {
        axios
        .post("/accounts/events/"+query,{
        }).then((res) => {

            let arrayList = [];
            if(res.data.events) {
                res.data.events.map((value) => {
                    arrayList.push(
                        {
                            groupId:value.EVENT_ID,
                            createdBy: value.CREATED_BY,
                            createdFor: value.CUSTOMER_ID,
                            createdAt: value.CREATED_AT,
                            start:value.EVENT_DATE+"T"+value.EVENT_TIME,
                            title:value.NOTES,
                            time: value.EVENT_TIME,
                            date: value.EVENT_DATE,
                            status: value.STATUS,
                            customer_type: value.TYPE,
                            display_name: value.DISPLAY_NAME
                            // tooltip: 'This is a cool event' 
                        }
                    )
                });
                arrayList.map((value) => {
                    let x = new Date(value.date);
                    let y = new Date();
                    if(value.status==="1") {
                        value.color="#01930c";
                    } else if(value.status ==="0") {
                        if(x<y) {
                            value.color="#ff0000"
                        } else if (x<y) {
                            value.color = "#0085FF"
                        }
                        else {
                            value.color = "#0085FF";
                        }
                    }
                })
                
                setEventArrayList(arrayList);
            }
            if(res.data.events_users) {
                let arrayUserList = [];
                res.data.events_users && Object.entries(res.data.events_users).map((value)=>{
                    arrayUserList.push(value);
                });
                setUserList(arrayUserList);
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
    const handleSubmitEvent = (e) => {
        e.preventDefault();
        let update_api;
        let event_complete_api;
        if(eventId) {
            axios
            .post("/accounts/event_update"+query,{
                event_id: eventId,
                date: rescheduleDate,
                time: rescheduleTime,
                notes
            }).then((res) => {
                if(res.data=="1") {
                    axios
                .post("/accounts/event_complete"+query,{
                    event_id:eventId,
                    status:isEventCompleted ? 1 : 0
                }).then((response) => {
                    if(response.data == "1") {
                        setSuccess("Event Updated!");
                        fetchEvents();
                        if(isEventCompleted) {
                            setStatus("Completed");
                        } else {
                            setStatus("Incomplete")
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                    // dispatch(setSession());
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
    const handleDropDownClick = (id) => {
        axios
        .post("/accounts/events/"+query,{
            user_id:id
        }).then((res) => {
            let arrayList = [];
            if(res.data.events) {
                res.data.events.map((value) => {
                    arrayList.push(
                        {
                            groupId:value.EVENT_ID,
                            createdBy: value.CREATED_BY,
                            createdFor: value.CUSTOMER_ID,
                            createdAt: value.CREATED_AT,
                            start:value.EVENT_DATE+"T"+value.EVENT_TIME,
                            title:value.NOTES,
                            time: value.EVENT_TIME,
                            date: value.EVENT_DATE,
                            status: value.STATUS,
                            customer_type: value.TYPE
                            // tooltip: 'This is a cool event' 
                        }
                    )
                });
                arrayList.map((value) => {
                    let x = new Date(value.date);
                    let y = new Date();
                    if(value.status==="1") {
                        value.color="#01930c";
                    } else if(value.status ==="0") {
                        if(x<y) {
                            value.color="#ff0000"
                        } else if (x<y) {
                            value.color = "#0085FF"
                        }
                        else {
                            value.color = "#0085FF";
                        }
                    }
                })
                
                setEventArrayList(arrayList);
            }
            if(res.data.events_users) {
                let arrayUserList = [];
                res.data.events_users && Object.entries(res.data.events_users).map((value)=>{
                    arrayUserList.push(value);
                });
                setUserList(arrayUserList);
            }
        })
        .catch((error) => {
            console.log(error);
            // dispatch(setSession());
        });   
    }
  return (
    <div className="calendar-block">
        <div>
            <div className="dropUp">
                <div className="custom-select-wrapper d-flex align-items-center">
                    <div className={isUserDropDownOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                        <div className="custom-select__trigger" onClick={()=>setIsUserDropDownOpen(!isUserDropDownOpen)}>
                            <span>{userDropDown?userDropDown:""}</span>
                            <div className="arrow">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                </svg>
                            </div>
                        </div>
                        <div className="custom-options">
                            {
                                userList && userList.length>0 ? (
                                    userList.map((value, index) => {
                                        return (
                                            <span key={index} className={userDropDown === value[1] ? "custom-option selected":"custom-option"}  onClick={() => { setUserDropDown(value[1]); handleDropDownClick(value[0]); setIsUserDropDownOpen(false)}}>{value[1]}</span>
                                        )
                                    } )
                                ) : ""
                            }
                            <span className={userDropDown === "All" ? "custom-option selected":"custom-option"} onClick={() => { setUserDropDown("All"); handleDropDownClick(""); setIsUserDropDownOpen(false)}}>All</span>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                        <label>{query === "?region=UK" ? "Timezone: GMT" : "Timezone: PST"}</label>
            </div>
        </div>
        <div>
            {
                eventArrayList && eventArrayList ? 
                <FullCalendar
                    initialView="dayGridMonth"
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                    headerToolbar={{
                    left: 'prev,next,today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                    }}
                    events={eventArrayList}
                    eventClick = {function(info) {
                        eventArrayList.map((value) => {
                            if(value.groupId === info.event.groupId) {
                                localStorage.setItem("customer_id",value.createdFor);
                                localStorage.setItem("customer_type",value.customer_type);
                                setEventId(info.event.groupId);
                                setCreatedBy(value.createdBy);
                                let eventTimeDate = value.createdAt + " "+value.time;
                                setCreatedFor(value.display_name);
                                setDateTime(eventTimeDate);
                                setNotes(value.title);
                                // setCurrentEventDate(value.start);
                                setRescheduleDate(value.date);
                                setRescheduleTime(value.time);
                                // setCurrentEventTime(value.time);
                                if(value.status==="0") {
                                    setStatus("Incomplete")
                                    setIsEventCompleted(false);
                                } else {
                                    setStatus("Completed");
                                    setIsEventCompleted(true);
                                }
                            }
                        });
                        setSuccess("");
                        setError("");
                        setCalendarInfoModal(true);
                    }}
            />:""
            }
        </div>
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
                                <input type="text" className="text-input"  value = {createdBy?createdBy:""} disabled></input>
                            </div>
                            <div className="change-address-list d-flex align-items-center street-filed">
                                <label>CREATED FOR:</label>
                                <input type="text" className="text-input"  value = {createdFor?createdFor:""} disabled></input>
                            </div>
                            <div className="change-address-list d-flex align-items-center street-filed">
                                <label>{"EVENT DATE & TIME:"}</label>
                                <input type="text" className="text-input"  value = {dateTime?dateTime:""} disabled></input>
                            </div>
                            <div className="change-address-list d-flex align-items-center street-filed">
                                <label>NOTES: </label>
                                <input type="text" className="text-input"  value = {notes?notes:""} onChange={(e) => {setNotes(e.target.value);setError("");setSuccess("")}} required></input>
                            </div>
                            <>
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label>Re-schedule Date:</label>
                                    <input type="date" value={rescheduleDate?rescheduleDate:""} className="text-input" onChange={(e) => setRescheduleDate(e.target.value)} required></input>
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
                                    <input type="time" className="text-input" value={rescheduleTime?rescheduleTime:""} onChange={(e) => setRescheduleTime(e.target.value)} required></input>
                                </div>
                            </>
                            <div className="change-address-list d-flex align-items-center street-filed">
                                <label>EVENT STATUS:</label> 
                                {
                                    status === "Incomplete" ? (
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
                    <input type="button" value={`View Account`} className="save-btn" onClick={() => history.push("/accountinfo/communication")}/>
                </Modal.Footer>
            </form>
        </Modal>
        <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage}/> 
    </div>
  )
}
export default SalesCalendar;