import React from "react";
import './index.scss';
import {useSelector} from "react-redux";
import { useHistory } from 'react-router-dom';
import {setSession} from "../../utils/Actions";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import SearchIcon from '../../assets/images/search-icon.svg';
import OrderByIcon from '../../assets/images/orderby-arrow.png';
import SessionModal from '../Modals/SessionModal';
import {sizeList} from "../../utils/drop-down-list";
    
const MarketException = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const route = useSelector(state => state.route);

    const[showPerPage,setshowPerPage] = useState('25');
    const[isViewOpen,setIsViewOpen] = useState(false);
    const [transactionList, setTransactionList] = useState();
    const [allTransactionList, setAllTransactionList] = useState();
    const [globalTransactionList, setGlobalTransactionList] = useState();
    const [filteredTransactionList, setFilteredTransactionList] = useState();
    const [allFilteredTransactionList, setAllFilteredTransactionList] = useState();

    //goto button
    const [showViewButton, setViewButton] = useState(false);

    const [vendorId, setVendorId] = useState();
    const query = useSelector(state => state.userRegion);

    const [exceptionList, setExceptionList] = useState();
    const [allExceptionList, setAllExceptionList] = useState();
    
    //edit fields
    const [editFieldSource, setEditFieldSource] = useState();
    const [source, setSource] = useState();
    const [status, setStatus] = useState();

    //asc-desc flag
    const [order, setOrder] = useState('desc');

    //search var
    const [search, setSearch] = useState();
    const [openSearch, setOpenSearch] = useState(false);

    //dropdown vars
    const [isAreaCodeOpen, setIsAreaCodeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isRegionOpen, setIsRegionOpen] = useState(false);
    const [isVendorTypeOpen, setIsVendorTypeOpen] = useState(false);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

    //custom pagination vars
    const [currentPage,setCurrentPage] = useState(1);
    const [postsPerPage,setPostsPerPage] = useState(25);
    const [pageNumber,setPageNumber] = useState([]);
    const [indexOfAllFirstPage,setIndexOfFirstPage] = useState();
    const [indexOfAllLastPage,setIndexOfLastPage] = useState();
    const [loadingData,setLoadingData] = useState();
    const [initialPage,setInitialPage] = useState(0);
    const [lastPage,setLastPage] = useState(10);

     //form vars
     const [vendorName, setVendorName] = useState();
     const [primaryContact, setPrimaryContact] = useState();
     const [vendorEmail, setVendorEmail] = useState();
     const [vendorPhone, setVendorPhone] = useState(); 
     const [areaCode, setAreaCode] = useState("+44");
     const [phone, setPhone] = useState();
     const [region, setRegion] = useState("US");
     const [vendorType, setVendorType] = useState("1");
     const [currency, setCurrency] = useState("USD");

    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const[error,setError] = useState('');
    const[leadInfoModal,setLeadInfoModal] = useState(false);
    const[exceptionInfoModal,setExceptionInfoModal] = useState(false);
    const[prospectInfoModal,setProspectInfoModal] = useState(false);
    const [success, setSuccess] = useState();
    const [confirmModal, setConfirmModal] = useState(false);
    const [exceptionId, setExceptionId] = useState("");

    //Add Exception Modal
    const [isNameOpen, setIsNameOpen] = useState(false);
    const [name, setName] = useState("");
    const [editVintage, setEditVintage] = useState("");
    const [editExpiry, setEditExpiry] = useState("");
    const [editSize, setEditSize] = useState("");
    const [isSizeOpen, setIsSizeOpen] = useState(false);
    const [nameList, setNameList] = useState();
    const [nameDropDownValue, setNameDropDownValue] = useState("");
    const [editLwin, setLwin] = useState("");
    const [wineLoader, setWineLoader] = useState(false);

        
    //sorting vars
    const[sortOrder,setSortOrder] = useState('asc');

    //filters vars
    const [duration, setDuration] = useState("");
    const [typeDropDownValue, setTypeDropDownValue] = useState("");
    const [isTypeFilterOpen, setIsTypeFilterOpen] = useState(false);
    const [isOrderFilterOpen, setIsOrderFilterOpen] = useState(false);
    const [orderDropDownValue, setOrderDropDownValue] = useState("");
    
    useEffect(() => {
        fetchExceptions();
    },[]);
    useEffect(()=> {
        if(name==="") {
            setNameDropDownValue("");
            setIsNameOpen(false);
        }
    },[name]);

    useEffect(() => {
        if(allExceptionList && allExceptionList.length > 0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            
            setExceptionList(allExceptionList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allExceptionList.length/postsPerPage);i++) {
                setPageNumber(...[i])
            }
        }
    },[currentPage,postsPerPage]);
    const handleNavigation = (type) => {
        var fpos=initialPage;
        var lpos=lastPage;
        if (type === "prev") {
            if(fpos!==0) {
                setCurrentPage(fpos);
                setInitialPage(fpos-10)
                setLastPage(lpos-10)
            }
        }else if (type === "next") {
                if(lpos<pageNumber) {
                    setCurrentPage(lpos+1);
                    setInitialPage(fpos+10)
                    setLastPage(lpos+10)
                }
        }
    }
    const handleMobNavigation = (type) => {
        var fpos=initialPage;
        var lpos=lastPage;
        if (type === "prev") {
            if(fpos!==0) {
                setCurrentPage(fpos);
                setInitialPage(fpos-5)
                setLastPage(lpos-5)
            }
        }else if (type === "next") {
                if(lpos<pageNumber) {
                    setCurrentPage(lpos+1);
                    setInitialPage(fpos+5)
                    setLastPage(lpos+5)
                }
        }
    }
    const fetchExceptions = () => {
        if(window.screen.width<=480) {
            setLastPage(5);
        }
        setLoadingData(true);
        axios
        .get("/publish/market_excpetions"+query,{
        }).then((res) => {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            if(res.data.results) {
                setAllExceptionList(res.data.results);
                setExceptionList(res.data.results.slice(indexOfFirstPage,indexOfLastPost));
                setLoadingData(false);
                for(let i=1; i<=Math.ceil(res.data.results.length/postsPerPage);i++) {
                    setPageNumber(...[i])
                }
            }
        })
        .catch((error) => {
            console.log(error);
            const server_code = error.response.status;
            const server_message = error.response.statusText;
            if(server_code===500 || server_code===400 || server_code===404) {
                setSessionMessage(server_message);
                setIsSessionModal(true);
            }
            else if(server_code === 401 && server_message==="Unauthorized4.") {
                setSessionMessage(server_message);
                setIsSessionModal(true);
            }
            else {
                setSessionMessage("Your session has been expired!");
                dispatch(setSession());
                setIsSessionModal(true);
            }
        })
    }
    const handleAddException = (e) => {
        setError('');
        e.preventDefault();
            axios.post('/publish/add_market_excpetions'+query,{
                lwin:editLwin,
                year:editVintage,
                size: editSize,
                expiry: editExpiry
            }).then((res) => {
                if(res.data.message === "exception created") {
                    setSuccess("Exception Created Successfully!");
                    setExceptionList([]);
                    fetchExceptions();
                } else {
                    setError(res.data.message);
                }
            })
            .catch((error) => {
                console.log(error);
                const server_code = error.response.status;
                const server_message = error.response.statusText;
                if(server_code===500 || server_code===400 || server_code===404) {
                    setSessionMessage(server_message);
                    setIsSessionModal(true);
                }
                else if(server_code === 401 && server_message==="Unauthorized4.") {
                    setSessionMessage(server_message);
                    setIsSessionModal(true);
                }
                else {
                    setSessionMessage("Your session has been expired!");
                    dispatch(setSession());
                    setIsSessionModal(true);
                }
            });  
        setNameDropDownValue("");
        setEditExpiry("");
        setEditVintage("");
        setEditSize("");
        setName("");
    }
    const handleSorting = (field) => {
        if(exceptionList && exceptionList.length>0) {
            let sortedArray=[];
            // setSortOrder('desc');
            if(sortOrder == "asc") {
                setSortOrder('desc');
            }else {
                setSortOrder('asc');
            }
            if(search) {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "NAME" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():""
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PACK_SIZE" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.PACK_SIZE?a.PACK_SIZE.toLowerCase():""
                                    var nameB=b.PACK_SIZE?b.PACK_SIZE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VINTAGE" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.VINTAGE?parseFloat(a.VINTAGE.toLowerCase()):""
                                    var nameB=b.VINTAGE?parseFloat(b.VINTAGE.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "EXPIRY" : 
                            sortedArray = allExceptionList.sort(
                                (a, b) => new Date (a.EXPIRY) - new Date(b.EXPIRY)
                            );
                            break;

                            default:console.log("check sorting Label 1"); break;
                        }
                        setAllExceptionList([...sortedArray]);
                        break;
                    case 'desc' :
                        switch(field) {
                            case "NAME" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():""
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PACK_SIZE" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.PACK_SIZE?a.PACK_SIZE.toLowerCase():""
                                    var nameB=b.PACK_SIZE?b.PACK_SIZE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VINTAGE" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.VINTAGE?parseFloat(a.VINTAGE.toLowerCase()):""
                                    var nameB=b.VINTAGE?parseFloat(b.VINTAGE.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "EXPIRY" : 
                            sortedArray = allExceptionList.sort(
                                (a, b) => new Date (b.EXPIRY) - new Date(a.EXPIRY)
                            );
                            break;

                            default:console.log("check sorting Label 2"); break;
                        }
                        setAllExceptionList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }else {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "NAME" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():""
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PACK_SIZE" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.PACK_SIZE?a.PACK_SIZE.toLowerCase():""
                                    var nameB=b.PACK_SIZE?b.PACK_SIZE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VINTAGE" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.VINTAGE?parseFloat(a.VINTAGE.toLowerCase()):""
                                    var nameB=b.VINTAGE?parseFloat(b.VINTAGE.toLowerCase()):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "EXPIRY" : 
                            sortedArray = allExceptionList.sort(
                                (a, b) => new Date (a.EXPIRY) - new Date(b.EXPIRY)
                            );
                            break;
    
                            default:console.log("check sorting Label 1"); break;
                        }
                        // setVendorList([...sortedArray]);
                        break;
                    case 'desc' :
                        switch(field) {
                            case "NAME" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():""
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PACK_SIZE" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.PACK_SIZE?a.PACK_SIZE.toLowerCase():""
                                    var nameB=b.PACK_SIZE?b.PACK_SIZE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VINTAGE" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.VINTAGE?parseFloat(a.VINTAGE.toLowerCase()):""
                                    var nameB=b.VINTAGE?parseFloat(b.VINTAGE.toLowerCase()):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "EXPIRY" : 
                            sortedArray = allExceptionList.sort(
                                (a, b) => new Date (b.EXPIRY) - new Date(a.EXPIRY)
                            );
                            break;
                            default:console.log("check sorting Label 2"); break;
                        }
                        // setVendorList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
                paginate();
            }
        }
    }
    const fetchFromFilterAPI = (last_contacted, vendor_type, order_type) => {
        setInitialPage(0);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        setAllExceptionList([]);
        setExceptionList([]);
        setLoadingData(true);
        axios
        .post("/accounts/vendors"+query, {
            last_contacted, vendor_type, order_type
        }).then((res) => {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            let arrayVendorList = [];
            if(res.data.vendors) {
                Object.entries(res.data.vendors).map((value)=>{
                    arrayVendorList.push(value);
                });

                setAllExceptionList(arrayVendorList);
                setExceptionList(arrayVendorList.slice(indexOfFirstPage,indexOfLastPost));
                setLoadingData(false);
                for(let i=1; i<=Math.ceil(arrayVendorList.length/postsPerPage);i++) {
                    setPageNumber(...[i])
                }
            }
        })
        .catch((error) => {
            console.log(error);
            dispatch(setSession());
            const server_code = error.response.status;
            const server_message = error.response.statusText;
            if(server_code && server_message) {
                setSessionMessage(server_message);
                setIsSessionModal(true);
            }
        })
    }
    const handleFilter = (value, type) => {
        setInitialPage(0);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        if(type==="last-contacted") {
            fetchFromFilterAPI(value, typeDropDownValue, orderDropDownValue);
        } else if(type==="type-filter") {
            fetchFromFilterAPI(duration, value, orderDropDownValue);
        } else {
            fetchFromFilterAPI(duration, typeDropDownValue, value);
        }
    }
    const paginate = () => {
        if(allExceptionList && allExceptionList.length>0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            
            setExceptionList(allExceptionList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allExceptionList.length/postsPerPage);i++) {
                setPageNumber(...[i])
            }
            
        }
    }
    const handleViewVendor = () => {
        localStorage.setItem("customer_id",vendorId);
        localStorage.setItem("customer_type","Vendor");
        history.push("/accountinfo/communication");
    }
    const handleSwitch = (path) => {
        history.push(path);
    }
    const searchWine = (search) => {
        if(search) {
            setWineLoader(true);
            setNameList([]);
            axios
            .post("/accounts/search_wine"+query,{
                query:search,
                is_shopify: false
            }).then((res) => {
                // let arrayDropDownList = [];
                if(res.data){
                    setNameList(res.data.splice(0,20));
                }else {
                    setNameList([]);
                }
                setWineLoader(false);
            })
            .catch((error) => {
                console.log(error);
                const server_code = error.response.status;
                const server_message = error.response.statusText;
                if(server_code===500 || server_code===400 || server_code===404) {
                    setSessionMessage(server_message);
                    setIsSessionModal(true);
                }
                else if(server_code === 401 && server_message==="Unauthorized4.") {
                    setSessionMessage(server_message);
                    setIsSessionModal(true);
                }
                else {
                    setSessionMessage("Your session has been expired!");
                    dispatch(setSession());
                    setIsSessionModal(true);
                }
            })
        }
    }
    const handleDeleteException = () => {
        if(exceptionId) {
            axios
            .post("/publish/delete_market_excpetions"+query,{
                id: exceptionId
            }).then((res) => {
                if(res.data.message === "exception deleted") {
                    setExceptionList([]);
                    fetchExceptions();
                    setConfirmModal(false);
                }
            })
            .catch((error) => {
                console.log(error);
                const server_code = error.response.status;
                const server_message = error.response.statusText;
                if(server_code===500 || server_code===400 || server_code===404) {
                    setSessionMessage(server_message);
                    setIsSessionModal(true);
                }
                else if(server_code === 401 && server_message==="Unauthorized4.") {
                    setSessionMessage(server_message);
                    setIsSessionModal(true);
                }
                else {
                    setSessionMessage("Your session has been expired!");
                    dispatch(setSession());
                    setIsSessionModal(true);
                }
            })
        }
    }
    
    return (
        <div className="transaction-page">
            <div className="customers-content">
                <div className="top-head d-flex align-items-end">
                    <div className="title d-flex justify-content-start align-items-center">
                        <h1 className="mb-0 font-35">Publish Parameters</h1>
                    </div>
                    <div className={openSearch ? "search-customer show" : "search-customer"}>
                        <div className="search-box">
                            <input className="search-input" type="text" 
                                value={search}
                                placeholder="Quick Find by Name, Email or Phone"
                                onChange={(e) => setSearch(e.target.value)}/>
                            <button className="search-btn" type="button" onClick={() => setOpenSearch(!openSearch)}>
                                <img src={SearchIcon} alt=""/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="header my-2 justify-content-end">
                <div className="data-filter">
                    <div>
                        <ul>
                            <li>
                                <Button className='btn-filter'  variant="outline-primary" onClick={()=>setExceptionInfoModal(true)}>
                                    ADD EXCEPTION
                                    <svg className="add-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                            viewBox="0 0 512 512">
                                        <g>
                                            <g>
                                                <path d="M256,0C114.84,0,0,114.84,0,256s114.84,256,256,256s256-114.84,256-256S397.16,0,256,0z M256,475.429
                                                    c-120.997,0-219.429-98.432-219.429-219.429S135.003,36.571,256,36.571S475.429,135.003,475.429,256S376.997,475.429,256,475.429z
                                                    "/>
                                            </g>
                                        </g>
                                        <g>
                                            <g>
                                                <path d="M256,134.095c-10.1,0-18.286,8.186-18.286,18.286v207.238c0,10.1,8.186,18.286,18.286,18.286
                                                    c10.1,0,18.286-8.186,18.286-18.286V152.381C274.286,142.281,266.1,134.095,256,134.095z"/>
                                            </g>
                                        </g>
                                        <g>
                                            <g>
                                                <path d="M359.619,237.714H152.381c-10.1,0-18.286,8.186-18.286,18.286c0,10.1,8.186,18.286,18.286,18.286h207.238
                                                    c10.1,0,18.286-8.186,18.286-18.286C377.905,245.9,369.719,237.714,359.619,237.714z"/>
                                            </g>
                                        </g>
                                    </svg>
                                </Button>
                            </li>
                        </ul>
                    </div>
                </div>
        
                <div className="right-side search-page-dropbox">
                    <div className="dropUp">
                        <div className="custom-select-wrapper d-md-flex d-none align-items-center">
                            <div className={isViewOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                <div className="custom-select__trigger" onClick={()=>setIsViewOpen(!isViewOpen)}><span>{showPerPage===9999 ? "ALL" : showPerPage}</span>
                                    <div className="arrow">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                        </svg>
                                    </div>
                                </div>
                                <div className="custom-options">
                                    <span className={showPerPage === 5 ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setshowPerPage(5); setPostsPerPage(5); setCurrentPage(1); setIsViewOpen(false)}}>5</span>
                                    <span className={showPerPage === 25 ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setshowPerPage(25); setPostsPerPage(25); setCurrentPage(1); setIsViewOpen(false)}}>25</span>
                                    <span className={showPerPage === 50 ? "custom-option selected":"custom-option"} data-value="volvo" onClick={() => { setshowPerPage(50); setPostsPerPage(50); setCurrentPage(1); setIsViewOpen(false)}}>50</span>
                                    <span className={showPerPage === 9999 ? "custom-option selected":"custom-option"} data-value="mercedes" onClick={() => { setshowPerPage(9999); setPostsPerPage(9999); setCurrentPage(1); setIsViewOpen(false)}}>ALL</span>
                                </div>
                            </div>
                        </div>
                        <div className="custom-select-wrapper d-flex d-md-none align-items-center">
                            <div className={isViewOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                <div className="custom-select__trigger" onClick={()=>setIsViewOpen(!isViewOpen)}>
                                    {
                                        showPerPage === 9999 ? 
                                        <span>{'ALL'}</span> :
                                        <span>{showPerPage}</span>
                                    }          
                                    <div className="arrow">
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                        </svg>
                                    </div> 
                                </div>
                                <div className="custom-options per-page">
                                    <span className={showPerPage === 5 ? "custom-option selected":"custom-option"}  onClick={() => { setshowPerPage(5); setInitialPage(0); setLastPage(5); setPostsPerPage(5); setCurrentPage(1); setIsViewOpen(false)}}>5</span>
                                    <span className={showPerPage === 10 ? "custom-option selected":"custom-option"}  onClick={() => { setshowPerPage(10); setInitialPage(0); setLastPage(5); setPostsPerPage(10); setCurrentPage(1); setIsViewOpen(false)}}>10</span>
                                    <span className={showPerPage === 25 ? "custom-option selected":"custom-option"}  onClick={() => { setshowPerPage(25); setInitialPage(0); setLastPage(5); setPostsPerPage(25); setCurrentPage(1); setIsViewOpen(false)}}>25</span>
                                    <span className={showPerPage === 9999 ? "custom-option selected":"custom-option"} onClick={() => { setshowPerPage(9999); setInitialPage(0); setLastPage(5); setCurrentPage(1); setPostsPerPage(9999); setIsViewOpen(false)}}>ALL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="account-info-tabs d-flex justify-content-center ml-0">
                <div className="account-tabs-row d-flex align-items-center">
                    <a className={route === "/parameter/tier" ? "account-tab-list active":"account-tab-list" } onClick={() => {handleSwitch("/parameter/tier")}}>Vendor Tier</a>
                    <a className={route === "/parameter/control" ? "account-tab-list active":"account-tab-list" }>Case Size Control</a>
                    <a className={route === "/parameter/exception" ? "account-tab-list active":"account-tab-list" } onClick={() => {handleSwitch("/parameter/exception")}}>Market Exceptions</a>
                    <a className={route === "/parameter/vendor-exception" ? "account-tab-list active":"account-tab-list" } onClick={() => {handleSwitch("/parameter/vendor-exception")}}>Vendor Exceptions</a>
                </div>
            </div>
            <div className="all-customer-wrapper">
                <div className="all-customer-data">
                    <div className="customer-table">
                        <Table responsive>
                            <thead>
                            <tr>
                                <th className="cursor-pointer" onClick={()=>handleSorting("NAME")}>Wine Name</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("VINTAGE")}>Vinatage</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("PACK_SIZE")}>Pack Size</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("EXPIRY")}>Expiry Date</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    search ? (
                                        allExceptionList && allExceptionList.length > 0 ? (
                                            allExceptionList.filter((data) => {
                                                if(
                                                    data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase())
                                                ) {
                                                    return data;
                                                }
                                            }).map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{value.NAME ? value.NAME : "-"}</td>
                                                        <td>{value.VINTAGE ? value.VINTAGE : "-"}</td>
                                                        <td>{value.PACK_SIZE ? value.PACK_SIZE : "-"}</td>
                                                        <td>{value.EXPIRY ? value.EXPIRY : "-"}</td>
                                                        <td>
                                                            <div className="delete-cellar">
                                                                <svg onClick={() => {setExceptionId(value.ID); setConfirmModal(true)}} fill="#0085ff" height="18pt" viewBox="-57 0 512 512" width="18pt" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="m156.371094 30.90625h85.570312v14.398438h30.902344v-16.414063c.003906-15.929687-12.949219-28.890625-28.871094-28.890625h-89.632812c-15.921875 0-28.875 12.960938-28.875 28.890625v16.414063h30.90625zm0 0"/>
                                                                    <path d="m344.210938 167.75h-290.109376c-7.949218 0-14.207031 6.78125-13.566406 14.707031l24.253906 299.90625c1.351563 16.742188 15.316407 29.636719 32.09375 29.636719h204.542969c16.777344 0 30.742188-12.894531 32.09375-29.640625l24.253907-299.902344c.644531-7.925781-5.613282-14.707031-13.5625-14.707031zm-219.863282 312.261719c-.324218.019531-.648437.03125-.96875.03125-8.101562 0-14.902344-6.308594-15.40625-14.503907l-15.199218-246.207031c-.523438-8.519531 5.957031-15.851562 14.472656-16.375 8.488281-.515625 15.851562 5.949219 16.375 14.472657l15.195312 246.207031c.527344 8.519531-5.953125 15.847656-14.46875 16.375zm90.433594-15.421875c0 8.53125-6.917969 15.449218-15.453125 15.449218s-15.453125-6.917968-15.453125-15.449218v-246.210938c0-8.535156 6.917969-15.453125 15.453125-15.453125 8.53125 0 15.453125 6.917969 15.453125 15.453125zm90.757812-245.300782-14.511718 246.207032c-.480469 8.210937-7.292969 14.542968-15.410156 14.542968-.304688 0-.613282-.007812-.921876-.023437-8.519531-.503906-15.019531-7.816406-14.515624-16.335937l14.507812-246.210938c.5-8.519531 7.789062-15.019531 16.332031-14.515625 8.519531.5 15.019531 7.816406 14.519531 16.335937zm0 0"/>
                                                                    <path d="m397.648438 120.0625-10.148438-30.421875c-2.675781-8.019531-10.183594-13.429687-18.640625-13.429687h-339.410156c-8.453125 0-15.964844 5.410156-18.636719 13.429687l-10.148438 30.421875c-1.957031 5.867188.589844 11.851562 5.34375 14.835938 1.9375 1.214843 4.230469 1.945312 6.75 1.945312h372.796876c2.519531 0 4.816406-.730469 6.75-1.949219 4.753906-2.984375 7.300781-8.96875 5.34375-14.832031zm0 0"/>
                                                                </svg>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        ) : ("")
                                    )
                                    :
                                    exceptionList && exceptionList.length > 0 ? (
                                        exceptionList.map((value, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{value.NAME ? value.NAME : "-"}</td>
                                                    <td>{value.VINTAGE ? value.VINTAGE : "-"}</td>
                                                    <td>{value.PACK_SIZE ? value.PACK_SIZE : "-"}</td>
                                                    <td>{value.EXPIRY ? value.EXPIRY : "-"}</td>
                                                    <td>
                                                        <div className="delete-cellar">
                                                            <svg onClick={() => {setExceptionId(value.ID); setConfirmModal(true)}} fill="#0085ff" height="18pt" viewBox="-57 0 512 512" width="18pt" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="m156.371094 30.90625h85.570312v14.398438h30.902344v-16.414063c.003906-15.929687-12.949219-28.890625-28.871094-28.890625h-89.632812c-15.921875 0-28.875 12.960938-28.875 28.890625v16.414063h30.90625zm0 0"/>
                                                                <path d="m344.210938 167.75h-290.109376c-7.949218 0-14.207031 6.78125-13.566406 14.707031l24.253906 299.90625c1.351563 16.742188 15.316407 29.636719 32.09375 29.636719h204.542969c16.777344 0 30.742188-12.894531 32.09375-29.640625l24.253907-299.902344c.644531-7.925781-5.613282-14.707031-13.5625-14.707031zm-219.863282 312.261719c-.324218.019531-.648437.03125-.96875.03125-8.101562 0-14.902344-6.308594-15.40625-14.503907l-15.199218-246.207031c-.523438-8.519531 5.957031-15.851562 14.472656-16.375 8.488281-.515625 15.851562 5.949219 16.375 14.472657l15.195312 246.207031c.527344 8.519531-5.953125 15.847656-14.46875 16.375zm90.433594-15.421875c0 8.53125-6.917969 15.449218-15.453125 15.449218s-15.453125-6.917968-15.453125-15.449218v-246.210938c0-8.535156 6.917969-15.453125 15.453125-15.453125 8.53125 0 15.453125 6.917969 15.453125 15.453125zm90.757812-245.300782-14.511718 246.207032c-.480469 8.210937-7.292969 14.542968-15.410156 14.542968-.304688 0-.613282-.007812-.921876-.023437-8.519531-.503906-15.019531-7.816406-14.515624-16.335937l14.507812-246.210938c.5-8.519531 7.789062-15.019531 16.332031-14.515625 8.519531.5 15.019531 7.816406 14.519531 16.335937zm0 0"/>
                                                                <path d="m397.648438 120.0625-10.148438-30.421875c-2.675781-8.019531-10.183594-13.429687-18.640625-13.429687h-339.410156c-8.453125 0-15.964844 5.410156-18.636719 13.429687l-10.148438 30.421875c-1.957031 5.867188.589844 11.851562 5.34375 14.835938 1.9375 1.214843 4.230469 1.945312 6.75 1.945312h372.796876c2.519531 0 4.816406-.730469 6.75-1.949219 4.753906-2.984375 7.300781-8.96875 5.34375-14.832031zm0 0"/>
                                                            </svg>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : ("")
                                }
                                {
                                    loadingData ? (
                                        <tr>
                                            <td colSpan="5" className="text-center">Loading...</td>
                                        </tr>
                                    ) :
                                    ("")
                                }
                                {
                                    exceptionList && exceptionList.length===0 && loadingData===false && !search? (
                                        <tr>
                                            <td colSpan="5" className="text-center">No Exception found!</td>
                                        </tr>
                                    ) :
                                    ("")
                                }
                                {
                                    search ? (allExceptionList ? (allExceptionList.filter((data) => {
                                    if(
                                        data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase())
                                    ) {
                                        return data;
                                    }
                                    }).length>0) ? "":
                                    (<tr>
                                        <td colSpan="5" className="text-center">No Data Found!</td>
                                    </tr>):"") : ("")
                                }
                            </tbody>
                        </Table>
                    </div>


                    {/* transaction table mobile view */}
                    <div className="customer-table-mobile">
                            <div className="mobile-table-row">
                            {
                                search ? (
                                    allExceptionList && allExceptionList.length > 0 ? (
                                        allExceptionList.filter((data) => {
                                            if(
                                                data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase())
                                            ) {
                                                return data;
                                            }
                                        }).map((value, index) => {
                                            return (
                                                <div className="mobile-table-row" key={index}>
                                                    <div className="mobile-table-list">
                                                        <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                            <div className="th">
                                                                <label onClick={() => handleSorting("VINTAGE")}>VINTAGE</label>
                                                                <span>{value.VINTAGE ? value.VINTAGE : "-"}</span>
                                                            </div>
                                                            <div className="th">
                                                                <label onClick={() => handleSorting("EXPIRY")}>EXPIRY</label>
                                                                <span>{value.EXPIRY ? value.EXPIRY : "-"}</span>
                                                            </div>
                                                        </div>
                                                        <div className="mobile-table-footer">
                                                            <div className="shipping-option">
                                                                <label onClick={() => handleSorting("NAME")}>NAME</label>
                                                                <span>{value.NAME ? value.NAME : "-"}</span>
                                                            </div>
                                                        </div>
                                                        <div className="mobile-table-footer">
                                                            <label onClick={() => handleSorting("PACK_SIZE")}>SIZE</label>
                                                            <span>{value.PACK_SIZE ? value.PACK_SIZE : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer">
                                                            <div className="shipping-option">
                                                                <label onClick={() => {setExceptionId(value.ID); setConfirmModal(true)}}>Delete</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : ("")
                                        )
                                        :
                                        exceptionList && exceptionList.length > 0 ? (
                                            exceptionList.map((value, index) => {
                                                return (
                                                    <div className="mobile-table-row" key={index}>
                                                        <div className="mobile-table-list">
                                                            <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                                <div className="th">
                                                                    <label onClick={() => handleSorting("VINTAGE")}>VINTAGE</label>
                                                                    <span>{value.VINTAGE ? value.VINTAGE : "-"}</span>
                                                                </div>
                                                                <div className="th">
                                                                    <label onClick={() => handleSorting("EXPIRY")}>EXPIRY</label>
                                                                    <span>{value.EXPIRY ? value.EXPIRY : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => handleSorting("NAME")}>NAME</label>
                                                                    <span>{value.NAME ? value.NAME : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <label onClick={() => handleSorting("PACK_SIZE")}>SIZE</label>
                                                                <span>{value.PACK_SIZE ? value.PACK_SIZE : "-"}</span>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label onClick={() => {setExceptionId(value.ID); setConfirmModal(true)}}>Delete</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        ) : ("")
                                    }
                                    {
                                        loadingData ? (
                                            <div className="mobile-table-list text-center">
                                                Loading...
                                            </div>
                                        ) :
                                        ("")
                                    }
                                    {
                                        exceptionList && exceptionList.length===0 && loadingData===false && !search? (
                                            <div className="mobile-table-list text-center">
                                                No Exception Found!
                                            </div>
                                        ) :
                                        ("")
                                    }
                                    {
                                        search ? (allExceptionList ? (allExceptionList.filter((data) => {
                                        if(
                                            data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase())
                                        ) {
                                            return data;
                                        }
                                        }).length>0) ? "":
                                        (<div className="mobile-table-list text-center">
                                            No Data Found! 
                                        </div>):"") : ("")
                                    }
                                    </div>
                                </div>
                    {
                        search ? "" : 
                        (
                            <div className="customer-table-pagination d-none d-md-block">
                                <div className="table-pagination-row d-flex justify-content-between">
                                    <div className="table-prev">
                                        <Button
                                                className="btn-next-prev"
                                                variant="link"
                                                onClick={()=>handleNavigation('prev')}
                                                disabled={loadingData || initialPage===0}>{'< PREV'}
                                        </Button>
                                    </div>
                                    <div className="table-pagination-number">
                                        {
                                            new Array(pageNumber).fill("").map((val,index) => {
                                                    return(
                                                        <Button key={index}
                                                            className={(index+1)===currentPage ? "btn-number active":"btn-number" } variant="link"
                                                            onClick = {()=> setCurrentPage(index + 1)}
                                                            disabled={loadingData}>
                                                            {index + 1}
                                                        </Button>
                                                    )
                                            }).slice(initialPage,lastPage)
                                        }
                                    </div>
                                    <div className="table-prev">
                                        <Button
                                            className="btn-next-prev"
                                            variant="link"
                                            onClick={()=>handleNavigation('next')}
                                            disabled={loadingData || pageNumber<=lastPage}>{"NEXT >"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {
                        search || (!search && pageNumber.length==0)? "" : 
                        (
                            <div className="customer-table-pagination d-block d-md-none">
                                <div className="table-pagination-row d-flex justify-content-between">
                                    <div className="table-prev">
                                        <Button
                                                className="btn-next-prev"
                                                variant="link"
                                                onClick={()=>handleMobNavigation('prev')}
                                                disabled={loadingData || initialPage===0}>{'< PREV'}
                                        </Button>
                                    </div>
                                    <div className="table-pagination-number">
                                        {
                                            new Array(pageNumber).fill("").map((val,index) => {
                                                    return(
                                                        <Button key={index}
                                                            className={(index+1)===currentPage ? "btn-number active":"btn-number" } variant="link"
                                                            onClick = {()=> setCurrentPage(index + 1)}
                                                            disabled={loadingData}>
                                                            {index + 1}
                                                        </Button>
                                                    )
                                            }).slice(initialPage,lastPage)
                                        }
                                    </div>
                                    <div className="table-prev">
                                        <Button
                                            className="btn-next-prev"
                                            variant="link"
                                            onClick={()=>handleMobNavigation('next')}
                                            disabled={loadingData || pageNumber<=lastPage}>{"NEXT >"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>

                <Modal show={exceptionInfoModal}
                    onHide={() => {setExceptionInfoModal(false); setViewButton(false); setError("")}} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>EXCEPTION DETAILS</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={(e) => handleAddException(e)}>
                        <Modal.Body>
                            <div className="change-address-body">
                                <div className="change-address-wrapper">
                                    {/* <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Title:</label>
                                        <input type="text" className="text-input"  value = {title?title:""} onChange = {(e) => {setError("");setSuccess(""); setTitle(e.target.value)}} required></input>
                                    </div> */}
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Wine Name:</label>
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isNameOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" >
                                                        <span>
                                                            <input className="search-input" type="text" value={name}  onChange={(e)=>{setIsNameOpen(true); setName(e.target.value); setError(""); setSuccess(""); searchWine(e.target.value)}}
                                                                placeholder="Search Wines">
                                                            </input>
                                                        </span>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            nameList && nameList.length>0 ? (
                                                                nameList.map((value, index) => {
                                                                    return (
                                                                        <span className={nameDropDownValue === value.name ? "custom-option selected":"custom-option"} onClick={() => { setNameDropDownValue(value.name); setLwin(value.lwin7); setName(value.name); setIsNameOpen(false)}}>{value.name}</span>
                                                                    )
                                                                }) 
                                                            ):(
                                                                wineLoader ? (
                                                                    <span className="custom-option">{"Loading..."}</span>
                                                                ) : (<span className="custom-option">{"No Wine found!"}</span>)
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Vintage:</label>
                                        <input type="number" className="text-input" value = {editVintage?editVintage:""} onChange = {(e) => {setError(""); setSuccess("");setEditVintage(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Size:</label>
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isSizeOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{setIsSizeOpen(!isSizeOpen);}}>
                                                        {editSize ? editSize : "Select Size"}
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            sizeList.map((val, index) => {
                                                                return (
                                                                    <span key={index} className={editSize == val ? "custom-option selected":"custom-option"} onClick={() => {setEditSize(val); setIsSizeOpen(false)}}>{val}</span>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Expiry Date:</label>
                                        <input type="date" className="text-input" value = {editExpiry?editExpiry:""} onChange = {(e) => {setError(""); setSuccess(""); setEditExpiry(e.target.value)}} required></input>
                                    </div>
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label></label>
                                        <span className="error-text">{error}</span>
                                        <span className="success-text">{success}</span>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <input type="submit" value="Save" className="save-btn" />
                        </Modal.Footer>
                    </form>
            </Modal>
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage}/>       
            <Modal show={confirmModal}
                onHide={() => setConfirmModal(false)} className="custom-modal user-updated-modal">
                <Modal.Header closeButton>
                    <Modal.Title>REMOVE EXCEPTION</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="change-address-body">
                        <div className="change-address-wrapper">
                            <div className="change-address-list d-flex justify-content-center align-items-center street-filed">
                                <span className="error-text">{"Are you sure, you want to delete this Exception?"}</span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" onClick = {() => setConfirmModal(false)}className="save-btn">Cancel</Button>
                    <Button type="button" onClick = {() => handleDeleteException()}className="save-btn">Yes</Button>
                </Modal.Footer>
            </Modal>       
        </div>
        
    )
};

export default MarketException;
