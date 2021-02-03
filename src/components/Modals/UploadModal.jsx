import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const UploadModal = (props) => {
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
                        Upload Modal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-input">
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Send</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UploadModal;