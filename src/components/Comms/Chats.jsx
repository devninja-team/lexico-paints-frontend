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
import AddAccount from "../Modals/AddAccount";
import CreateAccount from "../Modals/CreateAccount";
    
const Chats = () => {
    const whoami = useSelector(state => state.whoami);
    const [showModalAddAccount, setShowModalAddAccount] = useState(false);
    const [showModalCreateAccount, setShowModalCreateAccount] = useState(false);
    return (
    <>
        Chat Comms Page<br></br>
        <Button onClick={()=>setShowModalAddAccount(true)}>Add To Account</Button>
        <Button onClick={()=>setShowModalCreateAccount(true)}>Create Account</Button>

        <AddAccount
            show={showModalAddAccount}
            onHide={() => setShowModalAddAccount(false)}
            type="chat"
        />
        <CreateAccount
            show={showModalCreateAccount}
            onHide={() => setShowModalCreateAccount(false)}
            type="chat"
        />
    </>
    )
};

export default connect(null,{logout})(Chats);
