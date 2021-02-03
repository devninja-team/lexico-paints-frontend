import React from "react";
import './index.scss';
import {useSelector} from "react-redux";
import { useHistory } from 'react-router-dom';
import {setGlobalData, setSession} from "../../utils/Actions";
import axios from 'axios';
import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import SearchIcon from '../../assets/images/search-icon.svg';
import OrderByIcon from '../../assets/images/orderby-arrow.png';
import SessionModal from '../Modals/SessionModal';
import {sizeList, locationList} from "../../utils/drop-down-list";
import Select from 'react-select';
import AsyncSelect from 'react-select/async'
    
const VendorException = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const route = useSelector(state => state.route);

    const [showPerPage,setshowPerPage] = useState('25');
    const [isViewOpen,setIsViewOpen] = useState(false);
    const [statusBtnValue, setStatusBtnValue] = useState("");
    const [vendorList, setVendorList] = useState();
    const [allVendorList, setAllVendorList] = useState();
    const [vendorDropDownValue, setVendorDropDownValue] = useState("");
    const [locationDropDownValue, setLocationDropDownValue] = useState("");

    //goto button
    const [showViewButton, setViewButton] = useState(false);

    const [vendorId, setVendorId] = useState();
    const query = useSelector(state => state.userRegion);

    const [exceptionList, setExceptionList] = useState();
    const [allExceptionList, setAllExceptionList] = useState();
    const [globalExceptionList, setGlobalExceptionList] = useState();
    
    
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
    const [editVintage, setEditVintage] = useState("All");
    const [editExpiry, setEditExpiry] = useState("");
    const [editSize, setEditSize] = useState("");
    const [isSizeOpen, setIsSizeOpen] = useState(false);
    const [nameList, setNameList] = useState();
    const [nameDropDownValue, setNameDropDownValue] = useState("");
    const [editLwin, setLwin] = useState("");
    const [wineLoader, setWineLoader] = useState(false);
    const [vendor, setVendor] = useState("");
    const [isVendorOpen, setIsVendorOpen] = useState(false);
    const [vendorSearchId, setVendorSearchId] = useState();
    const [countryList, setCountryList] = useState("");
    const [vendorDropDownList, setVendorDropDownList] = useState("");
    const [producerList, setProducerList] = useState("");
    const [selectedCountry, setSelectedCountry] = useState();
    const [selectedProducer, setSelectedProducer] = useState();
    const [selectedVendor, setSelectedVendor] = useState();
    const [selectedWine, setSelectedWine] = useState();
    const [selectedLocation, setSelectedLocation] = useState();
    const [countryDropDownValue, setCountryDropDownValue] = useState("");
    const [producerDropDownValue, setProducerDropDownValue] = useState("");
    const [wineName, setWineName] = useState();
    const [showOptions, setShowOptions] = useState(false);
    const [minValue, setMinValue] = useState();
    const [maxValue, setMaxValue] = useState();
    const [isVintageRange, setIsVintageRange] = useState(false);
    const [showProducer, setShowProducer] = useState(false);
    const [showWine, setShowWine] = useState(false);
    const [wineProducer, setWineProducer] = useState();


        
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
        .post("/publish/vendor_excpetions"+query,{
        }).then((res) => {
            // console.log("Exception", res.data)
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            if(res.data.results) {
                setAllExceptionList(res.data.results);
                setGlobalExceptionList(res.data.results);
                setExceptionList(res.data.results.slice(indexOfFirstPage,indexOfLastPost));
                for(let i=1; i<=Math.ceil(res.data.results.length/postsPerPage);i++) {
                    setPageNumber(...[i])
                }
            }
            if(res.data.all_vendors) {
                let vendorArray = [];
                Object.entries(res.data.all_vendors).map((data) => {
                    vendorArray.push(
                        {
                            value: data[0],
                            label: data[1]
                        }
                    )
                });
                if(vendorArray.length>0) {
                    setVendorDropDownList(vendorArray);
                }
            }
            setLoadingData(false);
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
        // console.log("lwin7:",countryDropDownValue ==="" || countryDropDownValue ===null ? "":countryDropDownValue.map(data => data.value));
        // console.log("producer:",producerDropDownValue ==="" || producerDropDownValue ===null ? "":producerDropDownValue.label);
        // console.log("vendor_id:",vendorSearchId);
        // console.log("vintage:",editVintage);
        // console.log("store:",locationDropDownValue ==="" || locationDropDownValue ===null ? "":locationDropDownValue.map(data => data.value));
        if(vendorDropDownValue && producerDropDownValue&& countryDropDownValue && locationDropDownValue ) {
            axios.post('/publish/add_vendor_excpetions'+query,{
                lwin7:countryDropDownValue ==="" || countryDropDownValue ===null ? "":countryDropDownValue.map(data => data.value),
                producer: producerDropDownValue ==="" || producerDropDownValue ===null ? "":producerDropDownValue.value,
                vintage: isVintageRange ? (minValue+"-"+maxValue) : editVintage,
                vendor_id: vendorSearchId,
                store: locationDropDownValue ==="" || locationDropDownValue ===null ? "":locationDropDownValue.map(data => data.value)
            }).then((res) => {
                // console.log(res.data)
                if(res.data.message === "exception created") {
                    setError("");
                    setSuccess("Exception Created Successfully!");
                    setExceptionList([]);
                    fetchExceptions();
                } else {
                    setSuccess("");
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
            // setShowProducer(false);
            // setShowWine(false);
            setSelectedVendor(null);
            setVendorDropDownValue(null);
            setSelectedProducer(null);
            setProducerDropDownValue(null);
            setSelectedCountry(null);
            setCountryDropDownValue(null)
            setSelectedWine(null);
            setSelectedLocation(null);
            setLocationDropDownValue(null);
            setVendorSearchId("");
            setShowWine("")
        } else {
            setSuccess("");
            setError("Select required fields")
        }
        // setNameDropDownValue("");
        // setEditVintage("");
        // setWineName("");
        // setVendorSearchId("");
        // setVendorDropDownValue("");
        // setShowOptions(false);

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
                            case "VENDOR_NAME" :
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
                            case "VENDOR_LOCATION" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.VENDOR_LOCATION?a.VENDOR_LOCATION.toLowerCase():""
                                    var nameB=b.VENDOR_LOCATION?b.VENDOR_LOCATION.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
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
                            case "VENDOR_NAME" :
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
                            case "VENDOR_LOCATION" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.VENDOR_LOCATION?a.VENDOR_LOCATION.toLowerCase():""
                                    var nameB=b.VENDOR_LOCATION?b.VENDOR_LOCATION.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
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
                            case "VENDOR_NAME" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.VENDOR_NAME?a.VENDOR_NAME.toLowerCase():""
                                    var nameB=b.VENDOR_NAME?b.VENDOR_NAME.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_LOCATION" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.VENDOR_LOCATION?a.VENDOR_LOCATION.toLowerCase():""
                                    var nameB=b.VENDOR_LOCATION?b.VENDOR_LOCATION.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
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
                            case "VENDOR_NAME" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.VENDOR_NAME?a.VENDOR_NAME.toLowerCase():""
                                    var nameB=b.VENDOR_NAME?b.VENDOR_NAME.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "VENDOR_LOCATION" :
                                sortedArray = allExceptionList.sort( function(a, b) {
                                    var nameA=a.VENDOR_LOCATION?a.VENDOR_LOCATION.toLowerCase():""
                                    var nameB=b.VENDOR_LOCATION?b.VENDOR_LOCATION.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
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
        setGlobalExceptionList([]);
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
                setGlobalExceptionList(arrayVendorList);
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
    const handleDeleteException = () => {
        if(exceptionId) {
            axios
            .post("/publish/delete_vendor_excpetions"+query,{
                id: exceptionId
            }).then((res) => {
                if(res.data.message === "exception deleted") {
                    setExceptionList([]);
                    setConfirmModal(false);
                    fetchExceptions();
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
    const handleFilters = (value, type) => {
        // setInitialPage(0);
        // setCurrentPage(1);
        // if(window.screen.width<=480) {
        //     setLastPage(5);
        // } else {
        //     setLastPage(10);
        // }
        // setAllProspectList([]);
        // setProspectList([]);
        // if(type==="day-filter") {
        //     fetchFromFilterAPI(value, sourceDropDownValue, statusBtnValue, stockBtnValue);
        // } else if(type==="source-filter") {
        //     fetchFromFilterAPI(durationBtnValue, value, statusBtnValue, stockBtnValue);
        // } else if(type==="status-filter") {
        //     fetchFromFilterAPI(durationBtnValue, sourceDropDownValue, value, stockBtnValue);
        // } else if(type==="stock-filter") {
        //     fetchFromFilterAPI(durationBtnValue, sourceDropDownValue, statusBtnValue, value);
        // }
    }
    const handleVendorList = (query) => {
        if(vendorList && vendorList.length>0) {
            let filterData = vendorList.filter((value) => {
                if(value[1].toLowerCase().includes(query.toLowerCase())) {
                    return value;
                }
            });
            setAllVendorList(filterData);
        }
    }
    const handleStoreFilters = (value) => {
        if(globalExceptionList && globalExceptionList.length>0) {
            if(value==="all") {
                //no filter
                var indexOfLastPost = currentPage * postsPerPage;
                var indexOfFirstPage = indexOfLastPost - postsPerPage;
                setIndexOfFirstPage(indexOfFirstPage);
                setIndexOfLastPage(indexOfLastPost);
                setAllExceptionList(globalExceptionList);
                setExceptionList(globalExceptionList.slice(indexOfFirstPage,indexOfLastPost));
                for(let i=1; i<=Math.ceil(globalExceptionList.length/postsPerPage);i++) {
                    setPageNumber(...[i])
                }
            } else {
                let filteredData = [];
                filteredData = globalExceptionList.filter((data) => {
                    if(
                        data.STORE_LOCATION.join("").toLowerCase().includes(value.toLowerCase())
                    ) {
                        return data;
                    }
                });
                var indexOfLastPost = currentPage * postsPerPage;
                var indexOfFirstPage = indexOfLastPost - postsPerPage;
                setIndexOfFirstPage(indexOfFirstPage);
                setIndexOfLastPage(indexOfLastPost);
                setAllExceptionList(filteredData);
                setExceptionList(filteredData.slice(indexOfFirstPage,indexOfLastPost));
                for(let i=1; i<=Math.ceil(filteredData.length/postsPerPage);i++) {
                    setPageNumber(...[i])
                }
            }
        }
    }
    const handleVintageRange = (e) => {
        setError(""); setSuccess("");
        setIsVintageRange(e.target.checked);
        if(e.target.checked === false) {
            setMinValue("");
            setMaxValue("");
        }
    }
    const fetchProducer = (vid) => {
        setShowProducer(false);
        setShowWine(false);
        axios.post('/publish/search_excpetion_producer'+query,{
            vid
        }).then((res) => {
            // console.log(res.data);
            let producerArray = [];
                Object.entries(res.data.vendors).map((data) => {
                    producerArray.push(
                        {
                            value: data[1],
                            label: data[1]
                        }
                    )
                });
                if(producerArray.length>0) {
                    // console.log(producerArray)
                    setProducerList(producerArray.splice(0,50));
                    setShowProducer(true);
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
    }
    const fetchWines = (value) => {
        // console.log("producer list",producer);
        console.log("valued",value);
        setError("")
        axios.post('/publish/search_excpetion_wines'+query,{
            vid: vendorSearchId,
            producer: wineProducer.label,
            q: value
        }).then((res) => {
            console.log("wine data",res.data);
            let wineArray = [];
                Object.entries(res.data.vendors).map((data) => {
                    wineArray.push(
                        {
                            value: data[0],
                            label: data[1]
                        }
                    )
                });
                if(wineArray.length>0) {
                    setCountryList(wineArray);
                }else {
                    setError("No wine found!")
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
    }
    const getProducerList = (value, callback) => {
        // console.log("producer search", value)
            return axios.post(`/publish/search_excpetion_producer`+query, {
                vid: vendorSearchId,
                q: value
            })
            .then(res => {
                let producerArray = [];
                Object.entries(res.data.vendors).map((data) => {
                    producerArray.push(
                        {
                            value: data[1],
                            label: data[1]
                        }
                    )
                });
                // console.log("array", producerArray)
                return producerArray.splice(0,50)
            }
        );
    }
    const getWineList = (value, callback) => {
        // console.log("producer search", value)
            return axios.post(`/publish/search_excpetion_wines`+query, {
                vid: vendorSearchId,
                producer: wineProducer.label ? wineProducer.label :"",
                q: value
            })
            .then(res => {
                console.log(res.data)
                let wineArray = [];
                Object.entries(res.data.vendors).map((data) => {
                    wineArray.push(
                        {
                            value: data[1],
                            label: data[1]
                        }
                    )
                });
                // console.log("array", producerArray)
                return wineArray.splice(0,50)
            }
        );
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
                                placeholder="Quick Find by Vednor or Wine"
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
                                <Button className='btn-filter'  variant="outline-primary" onClick={()=>{setSuccess(""); setError("");setExceptionInfoModal(true)}}>
                                    ADD WINE TO EXCEPTION LIST
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
                    <div className="all-customer-data-head py-3 pl-3 pr-4">
                        <div className="customer-data-head-filter d-flex align-items-center justify-content-end border-bottom-0 mb-2">
                            <div className="customer-title">
                                Filter by :
                            </div>
                            <div className="data-filter">
                                <ul>
                                    <li>
                                        <Button className={statusBtnValue==="" ? 'btn-filter active' : 'btn-filter'} onClick={() => {setStatusBtnValue("");handleStoreFilters("all")}}>ALL</Button>
                                    </li>
                                    {
                                        locationList && locationList.length>0 ? (
                                            locationList.map((value, index) => {
                                                return (
                                                    <li>
                                                        <Button className={statusBtnValue===value ? 'btn-filter active' : 'btn-filter'} onClick={() => { setStatusBtnValue(value);handleStoreFilters(value)}}>{value+" Store"}</Button>
                                                    </li>
                                                )
                                            })
                                        ) : ""
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="customer-table">
                        <Table responsive>
                            <thead>
                            <tr>
                                <th className="cursor-pointer" onClick={()=>handleSorting("VENDOR_NAME")}>Vendor</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("VENDOR_LOCATION")}>Vendor Location</th>
                                <th>Store Location</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("NAME")}>Wine</th>
                                <th>Vintage</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    search ? (
                                        allExceptionList && allExceptionList.length > 0 ? (
                                            allExceptionList.filter((data) => {
                                                if(
                                                    data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase()) ||
                                                    data.VENDOR_NAME && data.VENDOR_NAME.toLowerCase().includes(search.toLowerCase())
                                                ) {
                                                    return data;
                                                }
                                            }).map((value, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{value.VENDOR_NAME ? value.VENDOR_NAME : "-"}</td>
                                                        <td>{value.VENDOR_LOCATION ? value.VENDOR_LOCATION : "-"}</td>
                                                        <td>
                                                            {
                                                                value.STORE_LOCATION ? value.STORE_LOCATION.join(", ") :""
                                                            }
                                                        </td>
                                                        <td>{value.NAME ? value.NAME : "-"}</td>
                                                        <td>{value.VINTAGE ? value.VINTAGE : "-"}</td>
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
                                                    <td>{value.VENDOR_NAME ? value.VENDOR_NAME : "-"}</td>
                                                    <td>{value.VENDOR_LOCATION ? value.VENDOR_LOCATION : "-"}</td>
                                                    <td>
                                                        {
                                                            value.STORE_LOCATION ? value.STORE_LOCATION.join(", ") :""
                                                        }
                                                    </td>
                                                    <td>{value.NAME ? value.NAME : "-"}</td>
                                                    <td>{value.VINTAGE ? value.VINTAGE : "-"}</td>
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
                                            <td colSpan="6" className="text-center">Loading...</td>
                                        </tr>
                                    ) :
                                    ("")
                                }
                                {
                                    exceptionList && exceptionList.length===0 && loadingData===false && !search? (
                                        <tr>
                                            <td colSpan="6" className="text-center">No Exception found!</td>
                                        </tr>
                                    ) :
                                    ("")
                                }
                                {
                                    search ? (allExceptionList ? (allExceptionList.filter((data) => {
                                    if(
                                        data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase()) ||
                                        data.VENDOR_NAME && data.VENDOR_NAME.toLowerCase().includes(search.toLowerCase())
                                    ) {
                                        return data;
                                    }
                                    }).length>0) ? "":
                                    (<tr>
                                        <td colSpan="6" className="text-center">No Data Found!</td>
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
                                                data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase()) ||
                                                data.VENDOR_NAME && data.VENDOR_NAME.toLowerCase().includes(search.toLowerCase())
                                            ) {
                                                return data;
                                            }
                                        }).map((value, index) => {
                                            return (
                                                <div className="mobile-table-row" key={index}>
                                                    <div className="mobile-table-list">
                                                        <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                            <div className="th">
                                                                <label onClick={() => handleSorting("VENDOR_NAME")}>VENDOR NAME</label>
                                                                <span>{value.VENDOR_NAME ? value.VENDOR_NAME : "-"}</span>
                                                            </div>
                                                            <div className="th">
                                                                <label onClick={() => handleSorting("VENDOR_LOCATION")}>VENDOR LOCATION</label>
                                                                <span>{value.VENDOR_LOCATION ? value.VENDOR_LOCATION : "-"}</span>
                                                            </div>
                                                        </div>
                                                        <div className="mobile-table-footer">
                                                            <div className="shipping-option">
                                                                <label>STORE LOCATION</label>
                                                                <span>{value.STORE_LOCATION ? value.STORE_LOCATION.join(", ") : "-"}</span>
                                                            </div>
                                                        </div>
                                                        <div className="mobile-table-footer">
                                                            <label onClick={() => handleSorting("NAME")}>WINE</label>
                                                            <span>{value.NAME ? value.NAME : "-"}</span>
                                                        </div>
                                                        <div className="mobile-table-footer">
                                                            <label>VINTAGE</label>
                                                            <span>{value.VINTAGE ? value.VINTAGE : "-"}</span>
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
                                                                    <label onClick={() => handleSorting("VENDOR_NAME")}>VENDOR NAME</label>
                                                                    <span>{value.VENDOR_NAME ? value.VENDOR_NAME : "-"}</span>
                                                                </div>
                                                                <div className="th">
                                                                    <label onClick={() => handleSorting("VENDOR_LOCATION")}>VENDOR LOCATION</label>
                                                                    <span>{value.VENDOR_LOCATION ? value.VENDOR_LOCATION : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <div className="shipping-option">
                                                                    <label>STORE LOCATION</label>
                                                                    <span>{value.STORE_LOCATION ? value.STORE_LOCATION.join(", ") : "-"}</span>
                                                                </div>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <label onClick={() => handleSorting("NAME")}>WINE</label>
                                                                <span>{value.NAME ? value.NAME : "-"}</span>
                                                            </div>
                                                            <div className="mobile-table-footer">
                                                                <label>VINTAGE</label>
                                                                <span>{value.VINTAGE ? value.VINTAGE : "-"}</span>
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
                                            data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase()) ||
                                            data.VENDOR_NAME && data.VENDOR_NAME.toLowerCase().includes(search.toLowerCase())
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
                    onHide={() => {setExceptionInfoModal(false); setViewButton(false); setError("")}} className="custom-modal user-updated-modal exception-detail-modal">
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
                                        <label>Vendor Name:<span className="required-filed">*</span></label>
                                        <div className="dropUp">
                                            <div className="custom-select-wrapper d-flex flex-column">
                                                <Select
                                                    closeMenuOnSelect={true}
                                                    options={vendorDropDownList?vendorDropDownList:[]}
                                                    className="basic-multi-select"
                                                    name="colors"
                                                    id="country-dropdown"
                                                    classNamePrefix="select"
                                                    placeholder="Select vendor"
                                                    onChange = {(selectedVendor)=> {setSelectedVendor(selectedVendor); setVendorDropDownValue(selectedVendor); setProducerDropDownValue(null); setSelectedProducer(null); setVendorSearchId(selectedVendor.value);} }
                                                    value={selectedVendor}
                                                />
                                            </div>                                                
                                        </div>
                                    </div>
                                    
                                    {
                                        vendorSearchId ? (
                                            <div className="change-address-list d-flex align-items-center street-filed">
                                                <label>Producer:<span className="required-filed">*</span></label>
                                                <div className="dropUp">
                                                    <div className="custom-select-wrapper d-flex flex-column">
                                                        <AsyncSelect
                                                            closeMenuOnSelect={true}
                                                            className="basic-multi-select"
                                                            name="colors"
                                                            id="country-dropdown"
                                                            classNamePrefix="select"
                                                            placeholder="Type to see Producer List"
                                                            onChange = {(selectedProducer)=> {setSelectedProducer(selectedProducer); setProducerDropDownValue(selectedProducer); setWineProducer(selectedProducer); 
                                                                setShowWine(true);
                                                                setCountryDropDownValue(null); setSelectedWine(null);} }
                                                            value={selectedProducer}
                                                            loadOptions={getProducerList}
                                                        />
                                                    </div>                                                
                                                </div>
                                            </div>
                                        ) :""
                                    }
                                        
                                    {
                                        showWine ? (
                                            <div className="change-address-list d-flex align-items-center street-filed">
                                                <label>Wine:<span className="required-filed">*</span></label>
                                                <div className="dropUp">
                                                    <div className="custom-select-wrapper d-flex flex-column">
                                                        <Select
                                                            isMulti
                                                            closeMenuOnSelect={false}
                                                            className="basic-multi-select"
                                                            name="wine"
                                                            id="wine-dropdown"
                                                            classNamePrefix="select"
                                                            placeholder="Type to see Wine List"
                                                            onInputChange={(value) => fetchWines(value) }
                                                            options = {countryList ? countryList : []}
                                                            onChange = {(selectedWine)=> {setSelectedWine(selectedWine); setCountryDropDownValue(selectedWine);} }
                                                            value={selectedWine}
                                                        />
                                                    </div>                                                
                                                </div>
                                            </div>
                                        ) : ""
                                    }
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Vintage Range:</label>
                                        <div className="dropUp text-left">
                                            <input type="checkbox" checked={isVintageRange} onChange = {(e) => {handleVintageRange(e)}}></input>
                                        </div>
                                    </div>
                                    {
                                        isVintageRange ? (""
                                        ):(
                                        <div className="change-address-list d-flex align-items-center street-filed">
                                            <label>Vintage:</label>
                                            <input type="text" className="text-input" value = {editVintage?editVintage:""} onChange = {(e) => {setError(""); setSuccess("");setEditVintage(e.target.value)}} required></input>
                                        </div>)
                                    }
                                    {
                                      isVintageRange ? (
                                        <>
                                            <div className="change-address-list d-flex align-items-center street-filed">
                                                <label>Min:<span className="required-filed">*</span></label>
                                                <input type="number" className="text-input" value = {minValue?minValue:""} onChange = {(e) => {setError(""); setSuccess("");setMinValue(e.target.value)}} required></input>
                                            </div>
                                            <div className="change-address-list d-flex align-items-center street-filed">
                                                <label>Max:<span className="required-filed">*</span></label>
                                                <input type="number" className="text-input" value = {maxValue?maxValue:""} onChange = {(e) => {setError(""); setSuccess("");setMaxValue(e.target.value)}} required></input>
                                            </div>
                                        </>) : ""   
                                    }

                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Store Location:<span className="required-filed">*</span></label>
                                        <div className="dropUp">                                            
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <Select
                                                    isMulti
                                                    closeMenuOnSelect={false}
                                                    options={
                                                        [{
                                                            value: "US",
                                                            label: "US"
                                                        },
                                                        {
                                                            value: "UK",
                                                            label: "UK"
                                                        },
                                                        {
                                                            value: "FR",
                                                            label: "FR"
                                                        }]
                                                    }
                                                    className="basic-multi-select"
                                                    name="colors"
                                                    id="country-dropdown"
                                                    classNamePrefix="select"
                                                    placeholder="Select location"
                                                    onChange = {(selectedLocation)=> {setLocationDropDownValue(selectedLocation);setSelectedLocation(selectedLocation);} }
                                                    value={selectedLocation}
                                                    required={true}
                                                />
                                            </div>                                                
                                        </div>
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

export default VendorException;
