import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './index.scss';
import '../MainComponent/Modal/index.scss';

function SessionModal(props) {
    return (
        <div>
            <Modal
                show={props.show}
                onHide={props.onHide}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-center text-danger">
                        {props.message ? props.message:""}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    {
                        props.message === "Your session has been expired!" ? (
                            <Button className="btn-close" onClick={() => window.location.href="/"}>Login</Button>
                        ) : (
                            <Button className="btn-close" onClick={props.onHide}>Close</Button>
                        )
                    }
                </Modal.Footer>
            </Modal>            
        </div>
    )
}

export default SessionModal
