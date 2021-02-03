import React, { useState } from "react";
import {
    NavLink, Link
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

    
const Comms = () => {
    const [showModal, setShowModal] = useState(false);
    const whoami = useSelector(state => state.whoami);
    return (
    <>
       Comms Page

       <Link to="/comms/emails">Emails</Link>
       <Link to="/comms/calls">Calls</Link>
       <Link to="/comms/chats">Chats</Link>
    </>
    )
};

export default connect(null,{logout})(Comms);
