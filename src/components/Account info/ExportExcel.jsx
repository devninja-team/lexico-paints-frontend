import React, {useState, useEffect} from 'react';
import {Link, NavLink, useHistory} from "react-router-dom";
import './Index.scss';
import SearchIcon from '../../assets/images/search-icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import SwitchIcon from '../../assets/images/switch-icon.svg';
import SessionModal from '../Modals/SessionModal';
import { setSession, setRoute, setSearch, fetchCustomer } from '../../utils/Actions';
import Button from "react-bootstrap/Button";
import {statusList, leadsStatusList} from "../../utils/drop-down-list";
import Modal from 'react-bootstrap/Modal';
let id;
const ExportExcel = () => {
    
    return (
        <div>
            
        </div>
    );
};

export default ExportExcel;