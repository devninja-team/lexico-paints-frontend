import React, {useEffect, useState} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import './Calls.scss';
import PlayCircle from '../../../assets/images/bx-play-circle.svg';
// import ListenPlay from '../../../assets/images/listen-play.svg';
import { setSession, fetchCustomer } from '../../../utils/Actions';
import Call from '../../../assets/images/call.svg';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const Calls = (props) => {
    const [callList, setCallList] = useState();
    const [allCallList, setAllCallList] = useState();
    const [customerType, setCustomerType] = useState();
    const [binaryData, setBinaryData] = useState();

    //token 
    const [token, setToken] = useState();

    //dropdown vars
    const [isCallOpen, setIsCallOpen] = useState(false);
    const [dropDownList, setDropDownList] = useState();
    const [dropDownValue, setDropDownValue] = useState();
    const [isCall2Open, setIsCall2Open] = useState(false);
    const [dropDownValue2, setDropDownValue2] = useState();

    //modal vars
    const[error,setError] = useState('');
    const[infoModal,setInfoModal] = useState(false);

    const dispatch = useDispatch();
    const fetch = useSelector(state => state.fetch);
    const query = useSelector(state => state.userRegion);
    
    //sorting vars
    const[sortOrder,setSortOrder] = useState('asc');

    useEffect(() => {
        const jwtToken = localStorage.getItem("jwtToken"); 
        if(jwtToken) {
            // console.log("jwt token", jwtToken)
            setToken(jwtToken);
        }
        // dispatch(fetchCustomer({fetch:!fetch}));
    }, [])
    useEffect(() => {
        let arrayCallList = [];
        let arrayDropDownList = [];
        setCustomerType(localStorage.getItem("customer_type"))
        if(props.list) {
            Object.entries(props.list).map((value)=>{
                arrayDropDownList.push(value);
            });
            // if(arrayDropDownList.length>0) {
            //     setDropDownValue(arrayDropDownList[0][1]);
            // }
            setDropDownList(arrayDropDownList);
        }
        if(props.call) {
            Object.entries(props.call).map((value)=>{
                arrayCallList.push(value);
            });
            setAllCallList(arrayCallList);
            setCallList(arrayCallList);
            setDropDownValue("ALL");
            setDropDownValue2("ALL");
        }
        
    },[props]);
    useEffect(() => {
        const jwtToken = localStorage.getItem("jwtToken"); 
        if(jwtToken) {
            setToken(jwtToken);
        }
    });
    const handleDropDownClick = (value) => {
        let filterList = [];
        if(value === "ALL" && dropDownValue2==="ALL") {
            setCallList(allCallList);
        } else if(dropDownValue2 === "ALL") {
            filterList = allCallList.filter((data) => {
                if(data[1].FROM_NAME.toLowerCase().includes(value.toLowerCase())){
                    return data;
                }
            }); 
            setCallList(filterList);
        } else if(value === "ALL") {
            filterList = allCallList.filter((data) => {
                if(data[1].TO_NAME.toLowerCase().includes(dropDownValue2.toLowerCase())){
                    return data;
                }
            }); 
            setCallList(filterList);
        } else {
            filterList = allCallList.filter((data) => {
                if(data[1].FROM_NAME.toLowerCase().includes(value.toLowerCase()) && data[1].TO_NAME.toLowerCase().includes(dropDownValue2.toLowerCase())){
                    return data;
                }
            }); 
            setCallList(filterList);
        }
        
    }
    const handleDropDownClick2 = (value) => {        
        let filterList = [];
        if(value === "ALL" && dropDownValue==="ALL") {
            setCallList(allCallList);
        } else if(dropDownValue === "ALL") {
            filterList = allCallList.filter((data) => {
                if(data[1].TO_NAME.toLowerCase().includes(value.toLowerCase())){
                    return data;
                }
            }); 
            setCallList(filterList);
        } else if(value === "ALL") {
            filterList = allCallList.filter((data) => {
                if(data[1].FROM_NAME.toLowerCase().includes(dropDownValue.toLowerCase())){
                    return data;
                }
            }); 
            setCallList(filterList);
        } else {
            filterList = allCallList.filter((data) => {
                if(data[1].FROM_NAME.toLowerCase().includes(dropDownValue.toLowerCase()) && data[1].TO_NAME.toLowerCase().includes(value.toLowerCase())){
                    return data;
                }
            }); 
            setCallList(filterList);
        }
    }
    const handleSorting = (field) => {
        if(callList && callList.length>0) {
            let sortedArray=[];
            if(sortOrder == "asc") {
                setSortOrder('desc');
            }else {
                setSortOrder('asc');
            }
             
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "timestamp" :
                                sortedArray = callList.sort(
                                    (a, b) => new Date (a[1].CALL_TIME.split(" ")[0]) - new Date(b[1].CALL_TIME.split(" ")[0])
                                );
                            break;

                            default:console.log("check sorting Label 1"); break;
                        }
                        setCallList([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
                            case "timestamp" :
                                sortedArray = callList.sort(
                                    (a, b) => new Date(b[1].CALL_TIME.split(" ")[0]) - new Date(a[1].CALL_TIME.split(" ")[0])
                                );
                            break;    
                            default:console.log("check sorting Label 2"); break;
                        }
                        setCallList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            
        }
    }


    return (
        <div className="calls-page">
            <div className="calls-row d-flex mt-4 flex-column flex-lg-row">
                <div className="calls-table-col mb-4 mb-lg-0">
                    <div className="row calls-drop-down">
                        <div className="col-md-6">
                            <label>From:</label>
                            <div className="dropUp">
                                {/* <label>Select a number</label> */}
                                <div className="custom-select-wrapper d-flex align-items-center">
                                    <div className={isCallOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                        <div className="custom-select__trigger" onClick={()=>setIsCallOpen(!isCallOpen)}><span>
                                            {
                                                dropDownList && dropDownList.length>0 ? (
                                                    dropDownValue ? dropDownValue :"Loading..."
                                                ):"Empty List"
                                            }
                                            </span>
                                            <div className="arrow">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="custom-options">
                                            {
                                                dropDownList&& dropDownList.length>0 ?
                                                (
                                                    dropDownList.map((value, index) => {
                                                        return(
                                                            <span className={value[1] === dropDownValue ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValue(value[1]);handleDropDownClick(value[1]);setIsCallOpen(false)}}>{value[1]}</span>
                                                        )
                                                    })
                                                ):("")
                                            }
                                            {
                                                dropDownList && dropDownList.length>0 ? (<span className={dropDownValue === "ALL"? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValue("ALL");handleDropDownClick("ALL");setIsCallOpen(false)}}>{"ALL"}</span>):""
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>    
                        </div>
                        <div className="col-md-6">
                        <label>To:</label>
                            <div className="dropUp">
                                {/* <label>Select a number</label> */}
                                <div className="custom-select-wrapper d-flex align-items-center">
                                    <div className={isCall2Open ? "custom-selectDrop open":"custom-selectDrop "}>
                                        <div className="custom-select__trigger" onClick={()=>setIsCall2Open(!isCall2Open)}><span>
                                            {
                                                dropDownList && dropDownList.length>0 ? (
                                                    dropDownValue2 ? dropDownValue2 :"Loading..."
                                                ):"Empty List"
                                            }
                                            </span>
                                            <div className="arrow">
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="custom-options">
                                            {
                                                dropDownList&& dropDownList.length>0 ?
                                                (
                                                    dropDownList.map((value, index) => {
                                                        return(
                                                            <span className={value[1] === dropDownValue2 ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValue2(value[1]);handleDropDownClick2(value[1]);setIsCall2Open(false)}}>{value[1]}</span>
                                                        )
                                                    })
                                                ):("")
                                            }
                                            {
                                                dropDownList && dropDownList.length>0 ? (<span className={dropDownValue2 === "ALL"? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => {setDropDownValue2("ALL");handleDropDownClick2("ALL");setIsCall2Open(false)}}>{"ALL"}</span>):""
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    
                    <div className="table-responsive">
                                <table className="table table-fixed table-striped" >
                                    <thead>
                                        <tr>
                                            <th className="col-4 cursor-pointer" onClick={() => handleSorting("timestamp")}>Timestamp</th>
                                            <th className="col-2">Equity</th>
                                            <th className="col-2">Rep</th>
                                            <th className="col-2">Timezone</th>
                                            <th className="col-2"> </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            callList && callList.length>0 ? 
                                            (
                                                callList.map((value, index)=>{
                                                    return(
                                                        <tr key={index}>
                                                            <td className="col-4">{value[1].CALL_TIME ? value[1].CALL_TIME : "-"}</td>
                                                            <td className="col-2"><span>{value[1].DIRECTION ? value[1].DIRECTION : "-"}</span></td>
                                                            <td className="col-2">{value[1].FROM_NUM ? value[1].FROM_NUM : "-"}</td>
                                                            <td className="col-2">{value[1].TIME_ZONE ? value[1].TIME_ZONE : "-"}</td>
                                                            <td className="col-2 cursor-pointer">
                                                                <form method="get" action="https://crmapi.tftc.company/accounts/call_audio/" target="_blank">
                                                                    <input type="hidden" name="call_id" value={value[1].CALL_ID ? value[1].CALL_ID :""}></input>
                                                                    <input type="hidden" name="token" value={token ? token :""}></input>
                                                                    <button className="btn-play" type="submit"><i><img src={PlayCircle} alt=""/></i></button>
                                                                </form>
                                                            </td>
                                                        </tr>
                                                    )
                                                }))
                                        :
                                            (<tr>
                                                <td colSpan="5" className="col-12 text-center">Empty Call History</td>
                                            </tr>)
                                        }
                                    </tbody>
                                </table>
                    </div>
                </div>
                <div className="calls-listen-btn-col d-flex justify-content-center mb-4 mb-lg-0">
                    <div className="blocks d-flex flex-row flex-lg-column justify-content-center align-items-center">
                        {/* <div className="blocks-details listen d-flex flex-column justify-content-center align-items-center">
                            <div className="icon"><img src={ListenPlay} alt="ListenPlay"/></div>
                            <span>Listen</span>
                        </div> */}
                        <div className="blocks-details call d-flex flex-column justify-content-center align-items-center">
                            <div className="icon"><img src={Call} alt="Call"/></div>
                            <span>Call</span>
                        </div>
                    </div>
                </div>
                {/* <div className="calls-detail-col">
                    <div className="details">
                        <div className="details-first-section">
                            <div><span className="title">Date</span><span className="sub-title">3/7/2020</span></div>
                            <div><span className="title">Date</span><span className="sub-title">3/7/2020</span></div>
                            <div><span className="title">Date</span><span className="sub-title">3/7/2020</span></div>
                        </div>
                        <div className="details-second-section">
                            <h4>Details</h4>
                            <p>Imperdiet vitae morbi in faucibus scelerisque donec tincidunt nulla. Hendrerit condimentum vitae duis aenean tellus. Dignissim mi semper lobortis enim duis. Eu pretium tortor tincidunt fringilla fringilla.</p>
                        </div>
                        <div className="details-bottom-section d-flex justify-content-around flex-wrap">
                            <a href="#">
                                <i className="add-detail-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 2H4C2.897 2 2 2.897 2 4V16C2 17.103 2.897 18 4 18H7V21.767L13.277 18H20C21.103 18 22 17.103 22 16V4C22 2.897 21.103 2 20 2ZM20 16H12.723L9 18.233V16H4V4H20V16Z" fill="#0085FF"/>
                                        <path d="M11 14H13V11H16V9H13V6H11V9H8V11H11V14Z" fill="#0085FF"/>
                                    </svg>
                                </i>
                                Add details
                            </a>
                            <a href="#">
                                <i className="edit-icon">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.03984 15.625C4.08672 15.625 4.13359 15.6203 4.18047 15.6133L8.12266 14.9219C8.16953 14.9125 8.21406 14.8914 8.24688 14.8563L18.182 4.92109C18.2038 4.89941 18.221 4.87366 18.2328 4.8453C18.2445 4.81695 18.2506 4.78656 18.2506 4.75586C18.2506 4.72516 18.2445 4.69477 18.2328 4.66642C18.221 4.63806 18.2038 4.61231 18.182 4.59063L14.2867 0.692969C14.2422 0.648438 14.1836 0.625 14.1203 0.625C14.057 0.625 13.9984 0.648438 13.9539 0.692969L4.01875 10.6281C3.98359 10.6633 3.9625 10.7055 3.95312 10.7523L3.26172 14.6945C3.23892 14.8201 3.24707 14.9493 3.28545 15.071C3.32384 15.1927 3.39132 15.3032 3.48203 15.393C3.63672 15.543 3.83125 15.625 4.03984 15.625ZM5.61953 11.5375L14.1203 3.03906L15.8383 4.75703L7.3375 13.2555L5.25391 13.6234L5.61953 11.5375ZM18.625 17.5938H1.375C0.960156 17.5938 0.625 17.9289 0.625 18.3438V19.1875C0.625 19.2906 0.709375 19.375 0.8125 19.375H19.1875C19.2906 19.375 19.375 19.2906 19.375 19.1875V18.3438C19.375 17.9289 19.0398 17.5938 18.625 17.5938Z" fill="#0085FF"/>
                                    </svg>
                                </i>
                                Edit details
                            </a>
                        </div>
                    </div>
                </div> */}
            </div>
            <Modal show={infoModal}
                onHide={() => setInfoModal(false)} className="custom-modal user-updated-modal">
                <Modal.Header closeButton>
                    <Modal.Title>CALL INFORMATION</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="change-address-body">
                        <div className="change-address-wrapper">
                            <div className="change-address-list d-flex align-items-center street-filed">
                                <label></label>
                                <span className="error-text">{error}</span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" onClick = {() => setInfoModal(false)}className="save-btn">OK</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Calls;