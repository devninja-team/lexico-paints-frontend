import React from 'react';
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const CreateAccount = (props) => {
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
                        Create Account Modal
                    </Modal.Title>
                </Modal.Header>
                {
                        props.type==="email" ?
                            <Modal.Body>
                                Email Modal body
                            </Modal.Body>:
                            <Modal.Body>
                                Chat Modal body
                            </Modal.Body>
                    }
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CreateAccount;