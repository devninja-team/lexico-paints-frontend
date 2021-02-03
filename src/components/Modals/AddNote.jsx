import React, {useState} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from "react-bootstrap/Form";
import axios from 'axios';
import SessionModal from './SessionModal';
import { setSession, fetchCustomer } from '../../utils/Actions';

const AddNote = (props) => {
      //modal vars
      const[error,setError] = useState('');
      const [note, setNote] = useState();
      const fetch = useSelector(state => state.fetch);
      const dispatch = useDispatch();
      const query = useSelector(state => state.userRegion);

      const[infoModal,setInfoModal] = useState(false);
      const [sessionMessage, setSessionMessage] = useState("");
      const [isSessionModal, setIsSessionModal] = useState(false);

    const addNote = (e) => {
        e.preventDefault();
        setError("");
        if(note) {
            axios.post('/accounts/add_note'+query,
            {
                notes: note,
                customer_id:localStorage.getItem('customer_id')
            })
            .then(res => {
                if(res.data.message === "notes added") {
                    //show modal
                    dispatch(fetchCustomer({fetch:!fetch}));
                    setError("Notes added successfully!");
                    props.onHide();
                    setInfoModal(true);
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
    return (
        <div>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <i>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4.03984 15.625C4.08672 15.625 4.13359 15.6203 4.18047 15.6133L8.12266 14.9219C8.16953 14.9125 8.21406 14.8914 8.24688 14.8563L18.182 4.92109C18.2038 4.89941 18.221 4.87366 18.2328 4.8453C18.2445 4.81695 18.2506 4.78656 18.2506 4.75586C18.2506 4.72516 18.2445 4.69477 18.2328 4.66642C18.221 4.63806 18.2038 4.61231 18.182 4.59063L14.2867 0.692969C14.2422 0.648438 14.1836 0.625 14.1203 0.625C14.057 0.625 13.9984 0.648438 13.9539 0.692969L4.01875 10.6281C3.98359 10.6633 3.9625 10.7055 3.95312 10.7523L3.26172 14.6945C3.23892 14.8201 3.24707 14.9493 3.28545 15.071C3.32384 15.1927 3.39132 15.3032 3.48203 15.393C3.63672 15.543 3.83125 15.625 4.03984 15.625ZM5.61953 11.5375L14.1203 3.03906L15.8383 4.75703L7.3375 13.2555L5.25391 13.6234L5.61953 11.5375ZM18.625 17.5938H1.375C0.960156 17.5938 0.625 17.9289 0.625 18.3438V19.1875C0.625 19.2906 0.709375 19.375 0.8125 19.375H19.1875C19.2906 19.375 19.375 19.2906 19.375 19.1875V18.3438C19.375 17.9289 19.0398 17.5938 18.625 17.5938Z"/>
                            </svg>
                        </i> Add Note
                    </Modal.Title>
                </Modal.Header>
                <form onSubmit={(e) => addNote(e)}>
                    <Modal.Body>
                        <div className="text-input">
                            <Form.Control as="textarea" value={note} onChange={(e)=>setNote(e.target.value)} rows="4" />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <input type="submit" value="Save"/>
                    </Modal.Footer>
                </form>
            </Modal>
            <Modal show={infoModal}
                       onHide={() => setInfoModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>EDIT COMMUNICATION</Modal.Title>
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
                            <Button type="button" onClick = {() => setInfoModal(false)}className="save-btn">Save</Button>
                        </Modal.Footer>
            </Modal>
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage} />
        </div>
    );
};

export default AddNote;