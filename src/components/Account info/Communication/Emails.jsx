import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Email.scss';
import { useEffect, useState, useRef } from 'react';
import { useDispatch} from 'react-redux';
import { setSession } from '../../..//utils/Actions/index';
import SessionModal from '../../Modals/SessionModal';
import { useSelector } from "react-redux";
import axios from 'axios';
import JoditEditor from "jodit-react";

const Emails = (props) => {
    const dispatch = useDispatch();
    const query = useSelector(state => state.userRegion);
    const [emailList, setEmailList] = useState();
    const [allEmailList, setAllEmailList] = useState();
    const [date, setDate] = useState();
    const [from, setFrom] = useState();
    const [body, setBody] = useState();
    const [subject, setSubject] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [customerType, setCustomerType] = useState();
    const [link, setLink] = useState();
    const [uid, setUid] = useState();


    const [content, setContent] = useState("");
    const editor = useRef(null);

    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [error, setError] = useState('');

    //dropdown vars
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [dropDownList, setDropDownList] = useState();
    const [dropDownValue, setDropDownValue] = useState();

    const [isEmail2Open, setIsEmail2Open] = useState(false);
    const [dropDownValue2, setDropDownValue2] = useState();

    const [replyEmailList, setReplyEmailList] = useState();
    const [replyEmailDropDownValue, setReplyEmailDropDown] = useState();
    const [isReplyEmailOpen, setIsReplyEmailOpen] = useState(false);

    useEffect(() => {
        let arrayEmailList = [];
        let arrayDropDownList = [];
        setCustomerType(localStorage.getItem("customer_type"))
        if(props.list) {
            Object.entries(props.list).map((value)=>{
                arrayDropDownList.push(value);
            });
            // if(arrayDropDownList.length>0) {
            //     setDropDownValue(arrayDropDownList[0][1]);
            // }
            setDropDownList(arrayDropDownList);
        }
        if(props.email) {
            Object.entries(props.email).map((value)=>{
                arrayEmailList.push(value);
            });
            setAllEmailList(arrayEmailList);
            setEmailList(arrayEmailList);
            setDropDownValue("ALL");
            setDropDownValue2("ALL");
            if(arrayEmailList.length>0) {
                setIsLoading(true);
                axios.post('/accounts/emailbody'+query,{
                    customer_id:localStorage.getItem('customer_id'),
                    uid:arrayEmailList[0][0]
                }).then((res) => {
                    setDate(res.data.SEND_TIME?res.data.SEND_TIME:"");
                    setFrom(res.data.FROM_ADDRESS?res.data.FROM_ADDRESS:"");
                    setSubject(res.data.SUBJECT?res.data.SUBJECT:"");
                    setBody(res.data.EMAIL_BODY?res.data.EMAIL_BODY:"");
                    setUid(res.data.EMAIL_UID?res.data.EMAIL_UID:"")
                    setIsLoading(false);
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
            // if(arrayDropDownList.length>0 && arrayEmailList.length>0) {
            //     let temp = arrayEmailList.filter((data) => {
            //         if(data[1].FROM_ADDRESS.toLowerCase().includes(arrayDropDownList[0][1].toLowerCase()) || data[1].TO_ADDRESS.toLowerCase().includes(arrayDropDownList[0][1].toLowerCase())){
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
        if(props.link) {
            if(props.link !== "OK") {
                setLink(props.link);
            }
        }
        if(props.replyEmailList) {
            setReplyEmailList(props.replyEmailList);
        }
        if(props.signature) {
            setContent(`<div class="signature"><p><br></p><p><br></p><p><br></p><p><br></p>
            <p><br></p><p><br></p><p><br></p><b>${props.signature.name}</b> | <i>${props.signature.position}</i><p>
            ${props.signature.company}</p><p>
            ${props.signature.phone_1}</p><p>
            ${props.signature.phone_2}</p>
            <a href="${props.signature.email}">
            ${props.signature.email}</a></div>`);
        }
        
    },[props])
    const handleDropDownClick = (value) => {
        let filterList = [];
        if(value === "ALL" && dropDownValue2==="ALL") {
            fetchBody(allEmailList);
            setEmailList(allEmailList);
        } else if(dropDownValue2 === "ALL") {
            filterList = allEmailList.filter((data) => {
                if(data[1].FROM_ADDRESS.toLowerCase().includes(value.toLowerCase())){
                    return data;
                }
            }); 
            setEmailList(filterList);
        } else if(value === "ALL") {
            filterList = allEmailList.filter((data) => {
                if(data[1].TO_ADDRESS.toLowerCase().includes(dropDownValue2.toLowerCase())){
                    return data;
                }
            }); 
            setEmailList(filterList);
        } else {
            filterList = allEmailList.filter((data) => {
                if(data[1].FROM_ADDRESS.toLowerCase().includes(value.toLowerCase()) && data[1].TO_ADDRESS.toLowerCase().includes(dropDownValue2.toLowerCase())){
                    return data;
                }
            }); 
            setEmailList(filterList);
        }
        if(filterList.length>0) {
            fetchBody(filterList);
        } else {
            setDate("");
            setFrom("");
            setSubject("");
            setBody("");
            setUid("")
        }
    }
    const handleDropDownClick2 = (value) => {
        let filterList = [];
        if(value === "ALL" && dropDownValue==="ALL") {
            fetchBody(allEmailList);
            setEmailList(allEmailList);
        } else if(dropDownValue === "ALL") {
            filterList = allEmailList.filter((data) => {
                if(data[1].TO_ADDRESS.toLowerCase().includes(value.toLowerCase())){
                    return data;
                }
            }); 
            setEmailList(filterList);
        } else if(value === "ALL") {
            filterList = allEmailList.filter((data) => {
                if(data[1].FROM_ADDRESS.toLowerCase().includes(dropDownValue.toLowerCase())){
                    return data;
                }
            }); 
            setEmailList(filterList);
        } else {
            filterList = allEmailList.filter((data) => {
                if(data[1].FROM_ADDRESS.toLowerCase().includes(dropDownValue.toLowerCase()) && data[1].TO_ADDRESS.toLowerCase().includes(value.toLowerCase())){
                    return data;
                }
            }); 
            setEmailList(filterList);
        }
        if(filterList.length>0) {
            fetchBody(filterList);
        } else {
            setDate("");
            setFrom("");
            setSubject("");
            setBody("");
            setUid("")
        }
    }
    const handleEmail = (uid) => {
        setIsLoading(true);
        axios.post('/accounts/emailbody'+query,{
            customer_id:localStorage.getItem('customer_id'),
            uid
        }).then((res) => {
            // console.log("EMAIL api response",res.data);
            setDate(res.data.SEND_TIME?res.data.SEND_TIME:"");
            setFrom(res.data.FROM_ADDRESS?res.data.FROM_ADDRESS:"");
            setSubject(res.data.SUBJECT?res.data.SUBJECT:"");
            setBody(res.data.EMAIL_BODY?res.data.EMAIL_BODY:"");
            setUid(res.data.EMAIL_UID?res.data.EMAIL_UID:"")
            setIsLoading(false);
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
    const handleReply = () => {
        if(content && replyEmailDropDownValue) {
            axios.post('accounts/send_email'+query,{
                customer_id:localStorage.getItem('customer_id'),
                uid:uid,
                content: content,
                from_email: replyEmailDropDownValue
            }).then((res) => {
                setIsLoading(false);
                setError(res.data.message);
                setSuccessModal(true);
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
    const fetchBody = (filterList) => {
        setIsLoading(true);
        axios.post('/accounts/emailbody'+query,{
            customer_id:localStorage.getItem('customer_id'),
            uid:filterList[0][0]
        }).then((res) => {
            setDate(res.data.SEND_TIME?res.data.SEND_TIME:"");
            setFrom(res.data.FROM_ADDRESS?res.data.FROM_ADDRESS:"");
            setSubject(res.data.SUBJECT?res.data.SUBJECT:"");
            setBody(res.data.EMAIL_BODY?res.data.EMAIL_BODY:"");
            setUid(res.data.EMAIL_UID?res.data.EMAIL_UID:"")
            setIsLoading(false);
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
    

    return (
        <div className="email-chats-text-page">
            <div className="email-chats-text-row d-flex mt-4">
                <div className="left-sidebar d-flex flex-column">
                    <div className="sidbar-title mb-3">
                        <span>All Emails</span>
                    </div>
                    <div className="email-drop-down">
                        <label>From:</label>
                        <div className="dropUp">
                            <div className="custom-select-wrapper d-flex align-items-center">
                                <div className={isEmailOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                    <div className="custom-select__trigger" onClick={()=>setIsEmailOpen(!isEmailOpen)}><span>
                                    {
                                        dropDownList && dropDownList.length>0 ? (
                                            dropDownValue ? dropDownValue :"Loading..."
                                        ):"Empty List"
                                    }
                                        </span>
                                        <div className="arrow">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="custom-options mb-2">
                                        {
                                            dropDownList&& dropDownList.length>0 ?
                                            (
                                                dropDownList.map((value, index) => {
                                                    return(
                                                        <span className={value[1] === dropDownValue ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValue(value[1]);handleDropDownClick(value[1]);setIsEmailOpen(false)}}>{value[1]}</span>
                                                    )
                                                })
                                            ):("")
                                        }
                                        {
                                            dropDownList && dropDownList.length>0 ? (
                                                <span className={dropDownValue==="ALL" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValue("ALL");handleDropDownClick("ALL");setIsEmailOpen(false)}}>{"ALL"}</span>
                                            ):""
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
                                        dropDownList && dropDownList.length>0 ? (
                                            dropDownValue2 ? dropDownValue2 :"Loading..."
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
                                            dropDownList&& dropDownList.length>0 ?
                                            (
                                                dropDownList.map((value, index) => {
                                                    return(
                                                        <span className={value[1] === dropDownValue2 ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValue2(value[1]);handleDropDownClick2(value[1]);setIsEmail2Open(false)}}>{value[1]}</span>
                                                    )
                                                })
                                            ):("")
                                        }
                                        {
                                            dropDownList && dropDownList.length>0 ? (
                                                <span className={dropDownValue2==="ALL" ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValue2("ALL");handleDropDownClick2("ALL");setIsEmail2Open(false)}}>{"ALL"}</span>
                                            ):""
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="email-side-block">
                        <div className="email-block">
                            <ul>
                                {
                                    emailList && emailList.length>0 ? 
                                    (
                                        emailList.map((value,index)=>{
                                            return(
                                                <li key={index} className="cursor-pointer" onClick={() => { handleEmail(value[1].EMAIL_UID)}}>
                                                    <div className="date-subject d-flex">
                                                        <label>Date</label>
                                                        <div className="date-status d-flex justify-content-between align-items-center">
                                                            <span>{value[1].SEND_TIME ? value[1].SEND_TIME : "-" }</span>
                                                            {value[1].FLAG === "Unread" ? <i className="status-dot"></i> :""}
                                                        </div>
                                                    </div>
                                                    <div className="date-subject d-flex">
                                                        <label>Subject</label>
                                                        <div className="date-status d-flex justify-content-between align-items-center">
                                                        <span>{value[1].SUBJECT ? value[1].SUBJECT : "-" }</span>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })
                                    )
                                :
                                    (
                                        <li className="d-flex py-4 justify-content-center">Empty Inbox</li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="email-middle-content">
                    <div className="middle-title mb-3">
                        <span>Email Info</span>
                    </div>
                    <div className="email-thread-block">
                        <ul>
                        <li>
                            <div className="date-from d-flex">
                                <div className="date-col">
                                    <label>{"Date & Time"}</label>
                                    <span>{date ? date : "-"}</span>
                                </div>
                                <div className="date-col">
                                    <label>From</label>
                                    <span>{from ? from : "-"}</span>
                                </div>
                                <div className="date-col">
                                    <label>SUB</label>
                                    <span>{subject ? subject : "No Subject"}</span>
                                </div>
                            </div>
                            <div className="thread-msg">
                                <div className="msg">
                                    {
                                        isLoading ? <p>Loading...</p> :
                                        <div dangerouslySetInnerHTML={{ __html: body ? body : "No Body" }}></div>
                                    }
                                </div>
                            </div>
                        </li>
                        </ul>
                    </div>
                    {
                        (emailList && emailList.length>0) ?
                            (
                                <div className="email-reply mt-3">
                                    <div className="middle-title mb-3">
                                        <span>Reply From:</span>
                                    </div>
                                    <div className="dropUp">
                                        <div className="custom-select-wrapper d-flex align-items-center">
                                            <div className={isReplyEmailOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                <div className="custom-select__trigger" onClick={()=>setIsReplyEmailOpen(!isReplyEmailOpen)}><span>
                                                {
                                                    replyEmailDropDownValue ? replyEmailDropDownValue : "Not selected" 
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
                                                        replyEmailList&& replyEmailList.length>0 ?
                                                        (
                                                            replyEmailList.map((value, index) => {
                                                                return(
                                                                    <span className={value === replyEmailDropDownValue ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setReplyEmailDropDown(value);setIsReplyEmailOpen(false)}}>{value}</span>
                                                                )
                                                            })
                                                        ):("")
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        link ? (
                                            <div className="email-reply-card">
                                                <a href={link}>Please authenticate your email account!</a>
                                            </div>
                                        ):(
                                            replyEmailDropDownValue ? (
                                                <div className="email-reply-card">
                                                <JoditEditor
                                                    ref={editor}
                                                    value={content}
                                                    tabIndex={1} // tabIndex of textarea
                                                    onChange={(newContent) => {
                                                        setContent(newContent);
                                                    }}
                                                    height="1000px"
                                                />
                                                <div className="reply-btn d-flex justify-content-end">
                                                    <Button variant="link" onClick={() => handleReply()} disabled={!content}>Reply Email</Button>
                                                    <Button variant="link">ESCALATE</Button>
                                                </div>
                                            </div>
                                            ):""
                                        )
                                    }
                                </div>
                        ) : ""
                    }
                </div>
            </div>
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage} />
            <Modal show={successModal}
                    onHide={() => setSuccessModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>EMAIL STATUS</Modal.Title>
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
                        <Button type="button" onClick = {() => setSuccessModal(false)}className="save-btn">OK</Button>
                    </Modal.Footer>
                </Modal>
        </div>
    );
};

export default Emails;