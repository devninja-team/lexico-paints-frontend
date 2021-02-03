import React from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import './index.scss';

const ChangeAddress = (props) => {
    return (
        <Modal {...props} className="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Change address:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="change-address-body">
                    <div className="change-billing-shipping-radio d-flex justify-content-around">
                        <Form.Check
                            custom
                            type="radio"
                            label="BILLING ADDRESS"
                            name="billing-shipping-radio"
                            id="formHorizontalRadios1"
                        />
                        <Form.Check
                            custom
                            type="radio"
                            label="SHIPPING ADDRESS"
                            name="billing-shipping-radio"
                            id="formHorizontalRadios2"
                        />
                    </div>
                    <div className="change-address-wrapper">
                        <div className="change-address-list d-flex align-items-center street-filed">
                            <label>Street:</label>
                            <input className="text-input" type="text"/>
                        </div>
                        <div className="change-address-list d-flex align-items-center state-normal-filed">
                            <label>State:</label>
                            <input className="text-input" type="text"/>
                        </div>
                        <div className="change-address-list d-flex align-items-center state-normal-filed">
                            <label>ZIP:</label>
                            <input className="text-input" type="text"/>
                        </div>
                        <div className="change-address-list d-flex align-items-center state-normal-filed">
                            <label>Country:</label>
                            <input className="text-input" type="text"/>
                        </div>
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

export default ChangeAddress;
