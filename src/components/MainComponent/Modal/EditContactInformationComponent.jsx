import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './index.scss';

const EditContactInformation = (props) => {
    return (
        <Modal {...props} className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>EDIT CONTACT INFORMATION</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="edit-contact-info">
                    <div className="edit-contact-info-list d-flex align-items-center name-filed">
                        <label>Name:</label>
                        <input className="text-input" type="text"/>
                    </div>
                    <div className="edit-contact-info-list d-flex align-items-center email-filed">
                        <label>Email:</label>
                        <input className="text-input" type="email"/>
                    </div>
                    <div className="edit-contact-info-list d-flex align-items-center phone-filed">
                        <label>Phone:</label>
                        <input className="text-input" type="tel"/>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button className="save-btn" variant="link">
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    )
};

export default EditContactInformation;
