import React, {useState, useRef} from 'react';
import ReplyEmail from "../../Modals/ReplyEmail";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal'
import Form from "react-bootstrap/Form";
import AccountInfo from '../AccountInfo';
import { useEffect } from 'react';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import SessionModal from '../../Modals/SessionModal';
import { setSession } from '../../../utils/Actions';
import JoditEditor from "jodit-react";


const EmailsMob = (props) => {
    const [showReply,setshowReply] = useState(false);
    const [emailInfo,setEmailInfo] = useState();
    const dispatch = useDispatch();
    const query = useSelector(state => state.userRegion);
    const [link, setLink] = useState();
    const [content, setContent] = useState('');
    const editor = useRef(null);

        
    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [error, setError] = useState('');

    //dropdown vars
    const [replyEmailList, setReplyEmailList] = useState();
    const [replyEmailDropDownValue, setReplyEmailDropDown] = useState();
    const [isReplyEmailOpen, setIsReplyEmailOpen] = useState(false);

    useEffect(() => {
        const customer_id = localStorage.getItem('customer_id');
        axios.post('/accounts/accountinfo'+query,{
            customer_id
        }).then((res) => {
            setLink(res.data.mail_link);
            setReplyEmailList(res.data.communication.reply_from);
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
    })
    useEffect(() => {
        const email_id = localStorage.getItem('email-id');
        const customer_id = localStorage.getItem('customer_id');
        axios.post('/accounts/emailbody'+query,
            {
                uid:email_id, customer_id
            }
        ).then((res) => {
            setEmailInfo(res.data);

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
    },[])
    useEffect(() => {
        if(props.signature) {
            setContent(`<b>${props.signature.name}</b> | <i>${props.signature.position}</i><p>
            ${props.signature.company}</p><p>
            ${props.signature.phone_1}</p><p>
            ${props.signature.phone_2}</p>
            <p>
            ${props.signature.email}</p>`);
        }
    },[props])
    const handleReply = () => {
        if(content && replyEmailDropDownValue) {
            axios.post('accounts/send_email'+query,{
                customer_id:localStorage.getItem('customer_id'),
                uid:localStorage.getItem("email-id"),
                content:content,
                from_email: replyEmailDropDownValue
            }).then((res) => {
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
    
    return (
        <div>
            <div className="email-mobile">
                <div className="head">
                    <AccountInfo />
                </div>
                <div className="email-mobile-detail">
                    <div className="title-mobile">
                        <span>Email</span>
                    </div>
                    <div className="email-mobile-block">
                        <div className="email-mobile-scroll">
                            {/* <div className="email-from-subj-row">
                                <div className="email-from-subj-head">
                                    <div className="email-from-title d-flex">
                                        <label>From</label>
                                        <span>customeremail@gmail.com</span>
                                    </div>
                                    <div className="email-from-title d-flex">
                                        <label>Subject</label>
                                        <span>Subject of email</span>
                                    </div>
                                </div>
                                <div className="email-from-detail">
                                    <p>Consequat et turpis pharetra nascetur. Mauris, tortor elementum ut sit nec massa, magna lacus facilisis. Tristique vitae nibh iaculis tortor, nec vitae cras dolor facilisis.</p>
                                    <p>Imperdiet vitae morbi in faucibus scelerisque donec tincidunt nulla. Hendrerit condimentum vitae duis aenean tellus. Dignissim mi semper lobortis enim duis. Eu pretium tortor tincidunt fringilla.</p>
                                </div>
                            </div> */}
                            <div className="email-from-subj-row email-date-from-subj">
                                <div className="email-from-subj-head">
                                    <div className="email-from-title d-flex">
                                        <label>Date</label>
                                        <span>{emailInfo ? emailInfo.SEND_TIME ? emailInfo.SEND_TIME :"" : "-" }</span>
                                    </div>
                                    <div className="email-from-title d-flex">
                                        <label>From</label>
                                        <span>{emailInfo ? emailInfo.FROM_ADDRESS ? emailInfo.FROM_ADDRESS :"" : "-" }</span>
                                    </div>
                                    <div className="email-from-title d-flex">
                                        <label>Subject</label>
                                        <span>{emailInfo ? emailInfo.SUBJECT ? emailInfo.SUBJECT :"" : "No Subject" }</span>
                                    </div>
                                </div>
                                <div className="email-from-detail">
                                <div dangerouslySetInnerHTML={{ __html: emailInfo ? emailInfo.EMAIL_BODY ? emailInfo.EMAIL_BODY :"" : "Empty Body"  }}></div>
                                </div>
                            </div>
                        </div>
                        {
                            link === "OK" ?
                            (
                                <div className="email-mobile-replay">
                                    <Button variant="primary" className="reply-btn" onClick={()=>setshowReply(true)}>Reply</Button>
                                </div>
                            ):(
                                <div className="email-mobile-replay">
                                    <a className="reply-btn" href={link} >Please authenticate your email account!</a>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

            <Modal
                className="email-mobile-modal"
                show={showReply}
                onHide={() => setshowReply(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Reply From
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-input">
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
                        replyEmailDropDownValue ?       
                        <JoditEditor
                            ref={editor}
                            value={content}
                            tabIndex={1} // tabIndex of textarea
                            onChange={newContent => setContent(newContent)}
                        />:""
                    }
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleReply()} disabled={!content} >Send</Button>
                </Modal.Footer>
            </Modal>
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

export default EmailsMob;