import React, { useState } from "react";
import {
    NavLink
} from "react-router-dom";
import {useSelector} from "react-redux";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import './index.scss';
import logo from '../../images/westgarth-logo.png';
import closeIcon from '../../images/close-icon.svg';
import {connect} from "react-redux";
import {logout} from "../../utils/Actions";
import LeadsModal from "../Modals/LeadsModal";
import AddNote from "../Modals/AddNote";
import { Button } from "react-bootstrap";
import UploadModal from "../Modals/UploadModal";

    
const Cola = () => {
    const [showModal, setShowModal] = useState(false);
    const whoami = useSelector(state => state.whoami);
    return (
        <>
            Cola Page <br></br>
            <Button onClick={()=>setShowModal(true)}>Add To Account</Button>

            <UploadModal
                show={showModal}
                onHide={() => setShowModal(false)}
            />
        </>
    )
};

export default connect(null,{logout})(Cola);
