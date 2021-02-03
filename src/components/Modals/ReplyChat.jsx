import React from 'react';
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const ReplyChat = (props) => {
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
                        Reply
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-input">
                        <Form.Control as="textarea" rows="4" />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Send</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ReplyChat;