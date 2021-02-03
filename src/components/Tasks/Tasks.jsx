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

    
const Tasks = () => {
    const [showModal, setShowModal] = useState(false);
    const whoami = useSelector(state => state.whoami);
    return (
    <>
        Tasks Page
    </>
    )
};

export default connect(null,{logout})(Tasks);
