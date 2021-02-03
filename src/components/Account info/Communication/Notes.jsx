import React, {useState, useEffect} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './Notes.scss';
import { useDispatch,useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import SessionModal from '../../Modals/SessionModal';
import { setSession, fetchCustomer } from '../../../utils/Actions';
const Notes = (props) => {
    const [note, setNote] = useState();
    const fetch = useSelector(state => state.fetch);
    const query = useSelector(state => state.userRegion);
    const [noteList, setNoteList] = useState();
    
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reply, setReply] = useState("");
    const [details, setDetails] = useState("");
    
    const dispatch = useDispatch();

    //modal vars
    const[error,setError] = useState('');
    const [success, setSuccess] = useState('');
    const[infoModal,setInfoModal] = useState(false);
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
        
    //sorting vars
    const[sortOrder,setSortOrder] = useState('asc');
    useEffect(() => {
        dispatch(fetchCustomer({fetch:!fetch}));
    },[])
    useEffect(() => {
        if(props.data) {
            if(props.data.length>0) {
                setNoteList(props.data);
                setDate(props.data[0].date?props.data[0].date:"");
                setTime(props.data[0].time?props.data[0].time:"");
                setReply(props.data[0].reply?props.data[0].reply:"");
                setDetails(props.data[0].note?props.data[0].note:"");
            } else {
                setNoteList([]);
                setDate("");
                setTime("");
                setReply("");
                setDetails("");
            }
        }
    },[props.data]);
    const addNote = (e) => {
        setError("");
        setSuccess("");
        e.preventDefault();
        if(note) {
            axios.post('/accounts/add_note'+query,
            {
                notes: note,
                customer_id:localStorage.getItem('customer_id')
            }).then(res => {
                if(res.data.message === "notes added") {
                    //show modal
                    dispatch(fetchCustomer({fetch:!fetch}));
                    setSuccess("Notes added successfully!");
                    setInfoModal(true);
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
    const handleEmailList = (index) => {
        setDate(noteList[index].date); 
        setTime(noteList[index].time); 
        setReply(noteList[index].reply); 
        setDetails(noteList[index].note); 
    }
    const handleSorting = (field) => {
        if(noteList && noteList.length>0) {
            let sortedArray=[];
            if(sortOrder == "asc") {
                setSortOrder('desc');
            }else {
                setSortOrder('asc');
            }
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "timestamp" :
                                sortedArray = noteList.sort(
                                    (a, b) => new Date (a.time.split(" ")[0]) - new Date(b.time.split(" ")[0])
                                );
                            break;

                            default:console.log("check sorting Label 1"); break;
                        }
                        // console.log("sorted array",[...sortedArray])
                        setNoteList([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
                            case "timestamp" :
                                sortedArray = noteList.sort(
                                    (a, b) => new Date(b.time.split(" ")) - new Date(a.time.split(" ")[0])
                                );
                            break;    
                            default:console.log("check sorting Label 2"); break;
                        }
                        setNoteList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
        }
    }
    return (
        <div className="notes-page">
            <div className="notes-row d-flex mt-4">
                <div className="notes-table-col">
                    <div className="table-responsive">
                        <table className="table table-fixed table-striped">
                        <thead>
                            <tr>
                                <th className="col-4 col-lg-4" onClick={() => handleSorting("timestamp")}>Timestamp</th>
                                <th className="col-3">Rep</th>
                                <th className="col-2">Timezone</th>
                                <th className="col-3 col-lg-3">Details</th>
                            </tr>
                        </thead>
                            <tbody>
                            {
                                noteList && noteList.length > 0 ? 
                                (
                                    noteList.map((value,index) => {
                                        return (
                                            <tr key={index} className="cursor-pointer" onClick={() => handleEmailList(index)}>
                                                <td className="col-4 col-lg-4">{value.time ? value.time : ""}</td>
                                                <td className="col-3">{value.reply ? value.reply : "-"}</td>
                                                <td className="col-2">{value.time_zone ? value.time_zone : "-"}</td>                                                
                                                <td className="col-3 col-lg-3"><span>{value.note ? (value.note.substr(0,9).length===9 ? value.note.substr(0,9) + '...' : value.note.substr(0,9))  : "-"}</span></td>
                                            </tr>
                                        )   
                                    })
                                ) 
                            : 
                                (
                                    <tr>
                                        <td colSpan="4" className="col-12 text-center">Empty Notes</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="notes-detail-col">
                    <div className="top-date-row d-flex justify-content-between mb-4">
                        <div className="date-time-col">
                            <label>Date & Time</label>
                            <span>{time ? time : "-"}</span>
                        </div>
                        <div className="date-time-col">
                            <label>Rep</label>
                            <span>{reply ? reply : "-"}</span>
                        </div>
                    </div>
                    <div className="detail-block mb-4">
                        <div className="detail-title mb-2">
                            <span>Details</span>
                        </div>
                        <pre>{details ? details : "No Details"}</pre>
                    </div>
                    <div className="add-notes-block">
                        <div className="title-notes mb-3">
                            <i>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#0085FF" d="M4.03984 15.625C4.08672 15.625 4.13359 15.6203 4.18047 15.6133L8.12266 14.9219C8.16953 14.9125 8.21406 14.8914 8.24688 14.8563L18.182 4.92109C18.2038 4.89941 18.221 4.87366 18.2328 4.8453C18.2445 4.81695 18.2506 4.78656 18.2506 4.75586C18.2506 4.72516 18.2445 4.69477 18.2328 4.66642C18.221 4.63806 18.2038 4.61231 18.182 4.59063L14.2867 0.692969C14.2422 0.648438 14.1836 0.625 14.1203 0.625C14.057 0.625 13.9984 0.648438 13.9539 0.692969L4.01875 10.6281C3.98359 10.6633 3.9625 10.7055 3.95312 10.7523L3.26172 14.6945C3.23892 14.8201 3.24707 14.9493 3.28545 15.071C3.32384 15.1927 3.39132 15.3032 3.48203 15.393C3.63672 15.543 3.83125 15.625 4.03984 15.625ZM5.61953 11.5375L14.1203 3.03906L15.8383 4.75703L7.3375 13.2555L5.25391 13.6234L5.61953 11.5375ZM18.625 17.5938H1.375C0.960156 17.5938 0.625 17.9289 0.625 18.3438V19.1875C0.625 19.2906 0.709375 19.375 0.8125 19.375H19.1875C19.2906 19.375 19.375 19.2906 19.375 19.1875V18.3438C19.375 17.9289 19.0398 17.5938 18.625 17.5938Z"/>
                                </svg>
                            </i>
                            <span>Add Note</span>
                        </div>
                        <form onSubmit={(e) => addNote(e)}>
                            <div className="notes-text-box">
                                <Form.Control as="textarea" value={note} placeholder="I am text input that will save to the Previous contact section Needs to be time/log in stamped to fill the rep and date columns" rows="4" onChange={(e) => setNote(e.target.value)}/>
                            </div>
                            <div className="save-btn text-right">
                                <Button type="submit" variant="link">Save</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Modal show={infoModal}
                       onHide={() => setInfoModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>EDIT COMMUNICATION DETAILS</Modal.Title>
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
                            <Button type="button" onClick = {() => {setInfoModal(false); setNote("")}}className="save-btn">OK</Button>
                        </Modal.Footer>
            </Modal>
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage} />
        </div>
    );
};

export default Notes;