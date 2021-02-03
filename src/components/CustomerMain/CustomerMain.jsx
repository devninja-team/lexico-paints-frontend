import React, {useState, useEffect} from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import './Index.scss';
import CustomerIcon from '../../assets/images/customer-icon.svg';
import SearchIcon from '../../assets/images/search-icon.svg';
import {Link, useHistory} from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import {fetchCustomer, setGlobalData, setInvoiceData, setSession} from '../../utils/Actions/index';
import SessionModal from '../Modals/SessionModal';
import EditIcon from '../../assets/images/edit-icon.svg';


const CustomerMain = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const fetch = useSelector(state => state.fetch);
    const query = useSelector(state => state.userRegion);
    const [customerList, setCustomerList] = useState(); //customer list
    const [allCustomerList, setAllCustomerList] = useState(); //customer list
    const [recentContact, setRecentContact] = useState(); //most recent contact
    const [recentPurchase, setRecentPurchase] = useState(); //most recent purchase
    const [highValueOrder, setHighValueOrder] = useState(); //high value orders
    const [search, setSearch] = useState(); //search
    const [showcustomerSearch,setshowcustomerSearch] = useState(false); //search show/hide
    const [toggle, setToggle] = useState('last transaction');
    
    //custom pagination vars
    const [currentPage,setCurrentPage] = useState(1);
    const [postsPerPage,setPostsPerPage] = useState(25);
    const [pageNumber,setPageNumber] = useState([]);
    const [indexOfAllFirstPage,setIndexOfFirstPage] = useState();
    const [indexOfAllLastPage,setIndexOfLastPage] = useState();
    const [loading,setLoading] = useState(false);
    const [loadingData,setLoadingData] = useState(false);
    const [initialPage,setInitialPage] = useState(0);
    const [lastPage,setLastPage] = useState(10);

    //dropdown vars
    const[showPerPage,setshowPerPage] = useState('25');
    const[isViewOpen,setIsViewOpen] = useState(false);
    const[dropDownList,setDropDownList] = useState('');
    const[isViewOpenPage,setIsViewOpenPage] = useState(false);
    const[isDayViewOpen,setIsDayViewOpen] = useState(false);
    const [combineDropDown, setCombineDropDown] = useState(false);
    const [isAreaCodeOpen, setIsAreaCodeOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isRegionOpen, setIsRegionOpen] = useState(false);
    const [isVendorTypeOpen, setIsVendorTypeOpen] = useState(false);

    //sorting vars
    const[sortOrder,setSortOrder] = useState('desc');
    const[azBtn,setAZButton] = useState(false);
    const [duration,setDuration] = useState('ALL');
    const [durationContacted,setDurationContacted] = useState('');
    const [customerTypeBtn, setCustomerTypeBtn] = useState("ALL");

    //modal vars
    const[error,setError] = useState('');
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);

    //add vendor/prospect/lead

    //user info
    const [title, setTitle] = useState();
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [email, setEmail] = useState();
    const [areaCode, setAreaCode] = useState("+44");
    const [phone, setPhone] = useState();
    const [region, setRegion] = useState("US");
    const [source, setSource] = useState();
    const [status, setStatus] = useState("Hot Lead");
    const [vendorType, setVendorType] = useState("1");



    useEffect(() => {
        dispatch(setInvoiceData({data:""}));
        fetchAcccounts();
    }, [])

    useEffect(() => {
        if(allCustomerList && allCustomerList.length>0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            
            setCustomerList(allCustomerList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allCustomerList.length/postsPerPage);i++) {
                setPageNumber(...[i])
            }
            
        }
    }, [currentPage,postsPerPage])
    const fetchAcccounts = () => {
        if(window.screen.width<=480) {
            setLastPage(5);
        }
        setLoadingData(true);
        axios.post('/accounts'+query).then((res) => {
            // console.log("accoutnt api response",res.data);
            // console.log("query string", query);
            const {customers} = res.data;
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            let arrayCustomerList = [];
            Object.entries(customers).map((value)=>{
                arrayCustomerList.push(value);
            })
            // console.log("customer main api",arrayCustomerList)
            setAllCustomerList(arrayCustomerList);
            //initial sorting
            let sortedArray = [];
            if(arrayCustomerList.length>0) {
                sortedArray = arrayCustomerList.sort( 
                    (a, b) => new Date(b[1].last_transaction) - new Date(a[1].last_transaction)   
                );
            }
            setCustomerList(sortedArray.slice(indexOfFirstPage,indexOfLastPost));
            setLoadingData(false);
            for(let i=1; i<=Math.ceil(arrayCustomerList.length/postsPerPage);i++) {
                setPageNumber(...[i])
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
    const handleCustomer = (id) => {
        localStorage.setItem('customer_id',id);
        localStorage.setItem('customer_type','Customer');
        dispatch(fetchCustomer({fetch:!fetch}))
        migrateDataToRedux();
        history.push('/accountinfo/communication');
    }
    const handleCustomerRightClick = (e,id) => {
        e.preventDefault();
        localStorage.setItem('customer_id',id);
        localStorage.setItem('customer_type','Customer');
        dispatch(fetchCustomer({fetch:!fetch}))
        const win = window.open("/accountinfo/communication", "_blank");
        win.focus();
    }
    const handleDayFiltersTransaction = (duration) => {
        // console.log("customre page duration",duration)
        setCustomerList([]);
        setLoadingData(true);
        setCustomerTypeBtn("ALL");
        axios.post('/accounts'+query, {
            range: duration
        }).then((res) => {
            setInitialPage(0);
            if(window.screen.width<=480) {
                setLastPage(5);
            } else {
                setLastPage(10);
            }
            const {customers, most_recent_contact, most_recent_purchase, high_value_orders} = res.data;
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            let arrayCustomerList = [];
            Object.entries(customers).map((value)=>{
                arrayCustomerList.push(value);
            })
            if(arrayCustomerList.length>0) {
                arrayCustomerList.sort( 
                    (a, b) => new Date(b[1].last_transaction) - new Date(a[1].last_transaction)   
                );
            }
            // console.log("customer main day filter api for last transaction",arrayCustomerList)
            setAllCustomerList(arrayCustomerList);
            setCustomerList(arrayCustomerList.slice(indexOfFirstPage,indexOfLastPost));
            setLoadingData(false);
            if(arrayCustomerList.length>0) {
                for(let i=1; i<=Math.ceil(arrayCustomerList.length/postsPerPage);i++) {
                    setPageNumber(...[i])
                }
            }else {
                setPageNumber([]);
            }
            setCurrentPage(1);

        }).catch((error) => {
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
    const handleDayFiltersContacted = (duration) => {
        setCustomerList([]);
        setLoadingData(true);
        setCustomerTypeBtn("ALL");
        setInitialPage(0);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        axios.post('/accounts'+query, {
            last_contacted: duration
        }).then((res) => {
            setInitialPage(0);
                if(window.screen.width<=480) {
                    setLastPage(5);
                } else {
                    setLastPage(10);
                }
            const {customers, most_recent_contact, most_recent_purchase, high_value_orders} = res.data;
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;

            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            let arrayCustomerList = [];
            Object.entries(customers).map((value)=>{
                arrayCustomerList.push(value);
            });
            if(arrayCustomerList.length>0) {
                arrayCustomerList.sort( 
                    (a, b) => new Date(b[1].last_transaction) - new Date(a[1].last_transaction)   
                );
            }
            // console.log("customer main day filter api for last contacted",arrayCustomerList)
            setAllCustomerList(arrayCustomerList);
            setCustomerList(arrayCustomerList.slice(indexOfFirstPage,indexOfLastPost));
            setLoadingData(false);
            if(arrayCustomerList.length>0) {
                for(let i=1; i<=Math.ceil(arrayCustomerList.length/postsPerPage);i++) {
                    setPageNumber(...[i])
                }
            }else {
                setPageNumber([]);
            }
            setCurrentPage(1);

        }).catch((error) => {
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
    const handleNavigation = (type) => {
        var fpos=initialPage;
        var lpos=lastPage;
        // console.log("fpos"+fpos+"lpos"+lpos);
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
        // console.log("fpos"+fpos+"lpos"+lpos);
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

    const paginate = () => {
        if(allCustomerList && allCustomerList.length>0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            
            setCustomerList(allCustomerList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allCustomerList.length/postsPerPage);i++) {
                setPageNumber(...[i])
            }
            
        }
    }
    const handleCurrencyFormat = (value, type) => {
        let str_value = value.toString();
        str_value = str_value.replace("$","");
        let str_length = str_value.length;
        if(type==="currency") {
            if(str_length === 7) {
                str_value = str_value.slice(0,1) + "," + str_value.slice(1,str_length);
            }
            if(str_length === 8) {
                str_value = str_value.slice(0,2) + "," + str_value.slice(2,str_length);
            }
            if(str_length === 9) {
                str_value = str_value.slice(0,1) + "," + str_value.slice(1,3) + "," + str_value.slice(3,str_length);
            }
        }else {
            if(str_value.slice(0,1) === "-") {
                if(str_length === 8) {
                    str_value = str_value.slice(0,2) + "," + str_value.slice(2,str_length);
                }
                if(str_length === 9) {
                    str_value = str_value.slice(0,3) + "," + str_value.slice(3,str_length);
                }
                if(str_length === 10) {
                    str_value = str_value.slice(0,2) + "," + str_value.slice(2,4) + "," + str_value.slice(4,str_length);
                }
            }else {
                if(str_length === 7) {
                    str_value = str_value.slice(0,1) + "," + str_value.slice(1,str_length);
                }
                if(str_length === 8) {
                    str_value = str_value.slice(0,2) + "," + str_value.slice(2,str_length);
                }
                if(str_length === 9) {
                    str_value = str_value.slice(0,1) + "," + str_value.slice(1,3) + "," + str_value.slice(3,str_length);
                }
            }
        }
        return '$'+str_value;
    }
    const handleSorting = (field) => {
        if(customerList && customerList.length>0) {
            let sortedArray=[];
            // setSortOrder('desc');
            if(sortOrder == "asc") {
                setSortOrder('desc');
            }else {
                setSortOrder('asc');
            }
            if(field === 'a-z') {
                setAZButton(!azBtn);
            }
            if(search) {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "a-z" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].customer_name.toLowerCase();
                                    var nameB=b[1].customer_name.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "customer_type" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].customer_type.toLowerCase();
                                    var nameB=b[1].customer_type.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "value" :
                                allCustomerList.map((val)=>{
                                    val[1].value = val[1].value.replace(/,\s?/g, "");
                                    val[1].value = val[1].value.replace('$', "");
                                });
                                
                                sortedArray = allCustomerList.sort( function(a, b) {
                                return a[1].value - b[1].value;
                                });
                                
                                allCustomerList.map((value)=>{
                                    value[1].value = handleCurrencyFormat(value[1].value,"currency");
                                });
                            break;
    
                            case "location" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].location.toLowerCase();
                                    var nameB=b[1].location.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "timezone" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].time_zone.toLowerCase();
                                    var nameB=b[1].time_zone.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "company" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].company.toLowerCase();
                                    var nameB=b[1].company.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "orders" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].orders.toLowerCase();
                                    var nameB=b[1].orders.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "last_contacted" :
                                sortedArray = allCustomerList.sort(
                                    (a, b) => new Date (a[1].last_contacted) - new Date(b[1].last_contacted)
                                );
                            break;
    
                            case "contact_type" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].contact_type.toLowerCase();
                                    var nameB=b[1].contact_type.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "first_transaction" :
                                sortedArray = allCustomerList.sort(
                                    (a, b) => new Date (a[1].first_transaction) - new Date(b[1].first_transaction)
                                );
                            break;
    
                            case "last_transaction" :
                                sortedArray = allCustomerList.sort(
                                    (a, b) => new Date (a[1].last_transaction) - new Date(b[1].last_transaction)
                                );
                            break;

                            case "followup" :
                                sortedArray = allCustomerList.sort(
                                    (a, b) => new Date (a[1].follow_date) - new Date(b[1].follow_date)
                                );
                            break;
                            
    
                            default: console.log("check sorting Label 1"); break;
                        }
                        // console.log("sorted array",[...sortedArray])
                        setAllCustomerList([...sortedArray]);
                        // console.log("ascending data",[...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "a-z" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].customer_name.toLowerCase(), nameB=b[1].customer_name.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "customer_type" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].customer_type.toLowerCase(), nameB=b[1].customer_type.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            
                            case "value" :
                                allCustomerList.map((val)=>{
                                    val[1].value = val[1].value.replace(/,\s?/g, "");
                                    val[1].value = val[1].value.replace('$', "");
                                });
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    return b[1].value - a[1].value;
                                });
                                allCustomerList.map((value)=>{
                                    value[1].value = handleCurrencyFormat(value[1].value,"currency");
                                });
                            break;
                            case "location" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].location.toLowerCase(), nameB=b[1].location.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "timezone" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].time_zone.toLowerCase(), nameB=b[1].time_zone.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "company" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].company.toLowerCase(), nameB=b[1].company.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "orders" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].orders.toLowerCase(), nameB=b[1].orders.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "last_contacted" :
                                sortedArray = allCustomerList.sort(
                                    (a, b) => new Date(b[1].last_contacted) - new Date(a[1].last_contacted)
                                );
                            break;
    
                            case "contact_type" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].contact_type.toLowerCase(), nameB=b[1].contact_type.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "first_transaction" :
                                sortedArray = allCustomerList.sort(
                                    (a, b) => new Date(b[1].first_transaction) - new Date(a[1].first_transaction)
                                );
                            break;
    
                            case "last_transaction" :
                                sortedArray = allCustomerList.sort( 
                                    (a, b) => new Date(b[1].last_transaction) - new Date(a[1].last_transaction)   
                                );
                            break;

                            case "followup" :
                                sortedArray = allCustomerList.sort( 
                                    (a, b) => new Date(b[1].follow_date) - new Date(a[1].follow_date)   
                                );
                            break;
    
                            default:console.log("check sorting Label 2"); break;
                        }
                        setAllCustomerList([...sortedArray]);
                        // console.log("descending data",[...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }else {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "a-z" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].customer_name.toLowerCase();
                                    var nameB=b[1].customer_name.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "customer_type" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].customer_type.toLowerCase();
                                    var nameB=b[1].customer_type.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "value" :
                                allCustomerList.map((val)=>{
                                    val[1].value = val[1].value.replace(/,\s?/g, "");
                                    val[1].value = val[1].value.replace('$', "");
                                });
                                
                                sortedArray = allCustomerList.sort( function(a, b) {
                                return a[1].value - b[1].value;
                                });
                                
                                allCustomerList.map((value)=>{
                                    value[1].value = handleCurrencyFormat(value[1].value,"currency");
                                });
                            break;
    
                            case "location" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].location.toLowerCase();
                                    var nameB=b[1].location.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "timezone" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].time_zone.toLowerCase();
                                    var nameB=b[1].time_zone.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "company" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].company.toLowerCase();
                                    var nameB=b[1].company.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "orders" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].orders.toLowerCase();
                                    var nameB=b[1].orders.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "last_contacted" :
                                sortedArray = allCustomerList.sort(
                                    (a, b) => new Date (a[1].last_contacted) - new Date(b[1].last_contacted)
                                );
                            break;
    
                            case "contact_type" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].contact_type.toLowerCase();
                                    var nameB=b[1].contact_type.toLowerCase()
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "first_transaction" :
                                sortedArray = allCustomerList.sort(
                                    (a, b) => new Date (a[1].first_transaction) - new Date(b[1].first_transaction)
                                );
                            break;
    
                            case "last_transaction" :
                                sortedArray = allCustomerList.sort(
                                    (a, b) => new Date (a[1].last_transaction) - new Date(b[1].last_transaction)
                                );
                            break;

                            case "followup" :
                                sortedArray = allCustomerList.sort(
                                    (a, b) => new Date (a[1].follow_date) - new Date(b[1].follow_date)
                                );
                            break;
                            
    
                            default:console.log("check sorting Label 1"); break;
                        }
                        // console.log("sorted array",[...sortedArray])
                        // setCustomerList([...sortedArray]);
                        // console.log("ascending data",[...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
    
                            case "a-z" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].customer_name.toLowerCase(), nameB=b[1].customer_name.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;

                            case "customer_type" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].customer_type.toLowerCase(), nameB=b[1].customer_type.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            
                            case "value" :
                                allCustomerList.map((val)=>{
                                    val[1].value = val[1].value.replace(/,\s?/g, "");
                                    val[1].value = val[1].value.replace('$', "");
                                });
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    return b[1].value - a[1].value;
                                });
                                allCustomerList.map((value)=>{
                                    value[1].value = handleCurrencyFormat(value[1].value,"currency");
                                });
                            break;
                            case "location" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].location.toLowerCase(), nameB=b[1].location.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "timezone" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].time_zone.toLowerCase(), nameB=b[1].time_zone.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "company" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].company.toLowerCase(), nameB=b[1].company.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "orders" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].orders.toLowerCase(), nameB=b[1].orders.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "last_contacted" :
                                sortedArray = allCustomerList.sort(
                                    (a, b) => new Date(b[1].last_contacted) - new Date(a[1].last_contacted)
                                );
                            break;
    
                            case "contact_type" :
                                sortedArray = allCustomerList.sort( function(a, b) {
                                    var nameA=a[1].contact_type.toLowerCase(), nameB=b[1].contact_type.toLowerCase()
                                    if (nameA > nameB) //sort string descending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
    
                            case "first_transaction" :
                                sortedArray = allCustomerList.sort(
                                    (a, b) => new Date(b[1].first_transaction) - new Date(a[1].first_transaction)
                                );
                            break;
    
                            case "last_transaction" :
                                sortedArray = allCustomerList.sort( 
                                    (a, b) => new Date(b[1].last_transaction) - new Date(a[1].last_transaction)   
                                );
                            break;

                            case "followup" :
                                sortedArray = allCustomerList.sort( 
                                    (a, b) => new Date(b[1].follow_date) - new Date(a[1].follow_date)   
                                );
                            break;
    
                            default:console.log("check sorting Label 2"); break;
                        }
                        // setCustomerList([...sortedArray]);
                        // console.log("descending data",[...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
                paginate();
            }
        }
    }
    const handleAddUser = (e,type) => {
        setError('');
        e.preventDefault();
        if(type==="Lead") {
            axios.post('/accounts/add_lead'+query,{
                title:title,
                first_name:firstName,
                last_name: lastName,
                email_address: email,
                phone_area_code: areaCode,
                phone_number: phone,
                store_region: region,
                source: source,
                status: status
            }).then((res) => {
                // console.log("add user api response",res.data);
                if(res.data.message === "lead/prospect added") {
                    setError("Lead Added Successfully!")
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
            }) 
        } else if(type==="Vendor") {
            axios.post('/accounts/add_vendor/'+query,{
                title:title,
                first_name:firstName,
                last_name: lastName,
                email_address: email,
                phone_area_code: areaCode,
                phone_number: phone,
                store_region: region,
                vendor_type:vendorType
            }).then((res) => {
                // console.log("add user vendor api response",res.data);
                if(res.data.message === "lead/prospect added") {
                    setError("Vendor Added Successfully!")
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
            }) 
        } else if(type==="Prospect") {
            axios.post('/accounts/add_lead/'+query,{
                title:title,
                first_name:firstName,
                last_name: lastName,
                email_address: email,
                phone_area_code: areaCode,
                phone_number: phone,
                store_region: region,
                source: source,
                status: status
            }).then((res) => {
                // console.log("add user api response",res.data);
                if(res.data.message === "lead/prospect added") {
                    setError("Prospect Added Successfully!")
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
            }) 
        } 
        setTitle('');
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setSource('');
    }
    const handleCustomerTypeFilter = (type, customer_type) => {
        setCustomerTypeBtn(type);
        setInitialPage(0);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        if(duration) {
            // console.log("last transaction duration",duration, customer_type)
            setCustomerList([]);
            setLoadingData(true);
            axios.post('/accounts'+query, {
                range: duration,
                customer_type
            }).then((res) => {
                setInitialPage(0);
                if(window.screen.width<=480) {
                    setLastPage(5);
                } else {
                    setLastPage(10);
                }
                const {customers, most_recent_contact, most_recent_purchase, high_value_orders} = res.data;
                var indexOfLastPost = currentPage * postsPerPage;
                var indexOfFirstPage = indexOfLastPost - postsPerPage;

                setIndexOfFirstPage(indexOfFirstPage);
                setIndexOfLastPage(indexOfLastPost);
                let arrayCustomerList = [];
                Object.entries(customers).map((value)=>{
                    arrayCustomerList.push(value);
                })
                // console.log("customer main day filter api for last transaction",arrayCustomerList)
                setAllCustomerList(arrayCustomerList);
                setCustomerList(arrayCustomerList.slice(indexOfFirstPage,indexOfLastPost));
                setLoadingData(false);
                if(arrayCustomerList.length>0) {
                    for(let i=1; i<=Math.ceil(arrayCustomerList.length/postsPerPage);i++) {
                        setPageNumber(...[i])
                    }
                }else {
                    setPageNumber([]);
                }
                setCurrentPage(1);

            }).catch((error) => {
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
            } else if(durationContacted){
                // console.log("last contacted duration",durationContacted, customer_type)
                setCustomerList([]);
                setLoadingData(true);
                axios.post('/accounts'+query, {
                    last_contacted: durationContacted,
                    customer_type
                }).then((res) => {
                    setInitialPage(0);
                    if(window.screen.width<=480) {
                        setLastPage(5);
                    } else {
                        setLastPage(10);
                    }
                    const {customers, most_recent_contact, most_recent_purchase, high_value_orders} = res.data;
                    var indexOfLastPost = currentPage * postsPerPage;
                    var indexOfFirstPage = indexOfLastPost - postsPerPage;

                    setIndexOfFirstPage(indexOfFirstPage);
                    setIndexOfLastPage(indexOfLastPost);
                    let arrayCustomerList = [];
                    Object.entries(customers).map((value)=>{
                        arrayCustomerList.push(value);
                    })
                    // console.log("customer main day filter api for last contacted",arrayCustomerList)
                    setAllCustomerList(arrayCustomerList);
                    setCustomerList(arrayCustomerList.slice(indexOfFirstPage,indexOfLastPost));
                    setLoadingData(false);
                    if(arrayCustomerList.length>0) {
                        for(let i=1; i<=Math.ceil(arrayCustomerList.length/postsPerPage);i++) {
                            setPageNumber(...[i])
                        }
                    }else {
                        setPageNumber([]);
                    }
                    setCurrentPage(1);

                }).catch((error) => {
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
    }
    const migrateDataToRedux = (data) => {
        // console.log("Migrated Data", allCustomerList)
        dispatch(setGlobalData({data:allCustomerList}));
    }

    return (
        <div className="customers-content">
            <div className="top-head d-flex align-items-end">
                <div className="title d-flex justify-content-center align-items-center">
                    <div className="title-icon">
                        <img src={CustomerIcon} alt=""/>
                    </div>
                    <h1 className="mb-0 ml-3">Customers</h1>
                </div>
                <div className={showcustomerSearch ? "search-customer show" : "search-customer"}>
                    <div className="search-box">
                        <input className="search-input" type="text" 
                            value={search}
                            placeholder="Quick Find by Name, Email or Phone"
                            onChange={(e) => setSearch(e.target.value)}/>
                        <button className="search-btn" type="button" onClick={() => setshowcustomerSearch(!showcustomerSearch)}>
                            <img src={SearchIcon} alt=""/>
                        </button>
                    </div>
                </div>
            </div>
            <div className="left-middle-wrapper">
                <div className="all-customer-wrapper">
                    <div className="all-customer-data">
                        <div className="customer-data-head-filter mob-show d-flex justify-content-between align-items-center border-bottom-0">
                            <div className="customer-title">
                            </div>
                        </div>
                        <div className="customer-data-head-filter d-flex justify-content-between align-items-center border-bottom-0">
                            <div className="customer-title">
                                Last Transaction :
                            </div>
                            <div className="data-filter">
                                <ul>
                                    <li>
                                        <Button className={duration==="ALL" ? 'btn-filter active' : 'btn-filter'} variant="outline-primary" onClick = {() => {setDuration('ALL'); setDurationContacted('');handleDayFiltersTransaction('ALL')}}>ALL</Button>
                                    </li>
                                    <li>
                                        <Button className={duration==="30days" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration('30days'); setDurationContacted('');handleDayFiltersTransaction('30days')}}>LAST 30 DAYS</Button>
                                    </li>
                                    <li>
                                        <Button className={duration==="30_90_days" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration('30_90_days');setDurationContacted(''); handleDayFiltersTransaction('30_90_days')}}>30-90 DAYS</Button>
                                    </li>

                                    <li>
                                        <Button className={duration==="3_6_months" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration('3_6_months');setDurationContacted('');handleDayFiltersTransaction('3_6_months')}}>3-6 MONTHS</Button>
                                    </li>
                                    <li>
                                        <Button className={duration==="6_12_months" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration('6_12_months'); setDurationContacted('');handleDayFiltersTransaction('6_12_months')}}>6-12 MONTHS</Button>
                                    </li>
                                    <li>
                                        <Button className={duration==="more_than_1_year" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration('more_than_1_year'); setDurationContacted('');handleDayFiltersTransaction('more_than_1_year')}}>LONGER THAN 1 YEAR</Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="customer-data-head-filter d-flex justify-content-between align-items-center border-bottom-0">
                            <div className="customer-title">
                            Last Contacted :
                            </div>
                            <div className="data-filter">
                                <ul>
                                    <li>
                                        <Button className={durationContacted==="ALL" ? 'btn-filter active' : 'btn-filter'} variant="outline-primary" onClick = {() => {setDuration(''); setDurationContacted('ALL'); handleDayFiltersContacted('ALL')}}>ALL</Button>
                                    </li>
                                    <li>
                                        <Button className={durationContacted==="30days" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration(''); setDurationContacted('30days'); handleDayFiltersContacted('30days')}}>LAST 30 DAYS</Button>
                                    </li>
                                    <li>
                                        <Button className={durationContacted==="30_90_days" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration(''); setDurationContacted('30_90_days'); handleDayFiltersContacted('30_90_days')}}>30-90 DAYS</Button>
                                    </li>

                                    <li>
                                        <Button className={durationContacted==="3_6_months" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration(''); setDurationContacted('3_6_months'); handleDayFiltersContacted('3_6_months')}}>3-6 MONTHS</Button>
                                    </li>
                                    <li>
                                        <Button className={durationContacted==="6_12_months" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration(''); setDurationContacted('6_12_months'); handleDayFiltersContacted('6_12_months')}}>6-12 MONTHS</Button>
                                    </li>
                                    <li>
                                        <Button className={durationContacted==="more_than_1_year" ? 'btn-filter active' : 'btn-filter'} onClick = {() => {setDuration(''); setDurationContacted('more_than_1_year'); handleDayFiltersContacted('more_than_1_year')}}>LONGER THAN 1 YEAR</Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
        
                        <div className="customer-data-head-filter d-flex justify-content-between align-items-center border-bottom-0 mob-show">
                                    <div className="customer-title">
                                    </div>
                                    <div className="data-filter">
                                        <ul>
                                            <li>
                                                <Button className={customerTypeBtn==="ALL" ? 'btn-filter active' : 'btn-filter'} variant="outline-primary" onClick={()=>{handleCustomerTypeFilter('ALL',0);}}>ALL</Button>
                                            </li>
                                            <li>
                                                <Button className={customerTypeBtn==="retail" ? 'btn-filter active' : 'btn-filter'} variant="outline-primary" onClick={()=>{handleCustomerTypeFilter('retail',1)}}>Retail</Button>
                                            </li>
                                            <li>
                                                <Button className={customerTypeBtn==="investment" ? 'btn-filter active' : 'btn-filter'} variant="outline-primary" onClick={()=>{handleCustomerTypeFilter('investment',3)}}>Investment</Button>
                                            </li>   
                                            <li>
                                                <Button className={customerTypeBtn==="logistic" ? 'btn-filter active' : 'btn-filter'} variant="outline-primary" onClick={()=>{handleCustomerTypeFilter('logistic',4)}}>Logistic</Button>
                                            </li>   
                                        </ul>
                                    </div>
                                </div>
                        <div className="customer-data-head-filter d-flex justify-content-between align-items-center pt-2">
                            <div className="customer-title">
                            </div>
                            <div className="data-filter">
                                <ul>
                                    {/* <li>
                                        {
                                            azBtn ? (
                                                <Button className="btn-filter" variant="outline-primary"
                                                onClick = {() => handleSorting('a-z')}>A-Z</Button>
                                            ) : (
                                                <Button className="btn-filter" variant="outline-primary"
                                                onClick = {() => handleSorting('a-z')}>Z-A</Button>
                                            )
                                        }
                                    </li> */}
                                    {/* <li>
                                        <Button className="btn-filter" variant="outline-primary"
                                        onClick = {() => handleSorting('value')}>VALUE</Button>
                                    </li> */}
                                    {/* <li>
                                        <Button className="btn-filter" variant="outline-primary">OPEN ORDER</Button>
                                    </li> */}
                                    <li>
                                        <div className="custom-select-wrapper d-flex align-items-center justify-content-end">
                                            <div className={isViewOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                <div className="custom-select__trigger" onClick={()=>setIsViewOpen(!isViewOpen)}>
                                                    {
                                                        showPerPage === 999999999 ? 
                                                        <span>{'ALL'}</span> :
                                                        <span>{showPerPage}</span>
                                                    }          
                                                </div>
                                                <div className="custom-options">
                                                    <span className={showPerPage === 5 ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setshowPerPage(5); setPostsPerPage(5); setInitialPage(0); setLastPage(10); setCurrentPage(1); setIsViewOpen(false)}}>5</span>
                                                    <span className={showPerPage === 25 ? "custom-option selected":"custom-option"} data-value="tesla" onClick={() => { setshowPerPage(25); setPostsPerPage(25); setInitialPage(0); setLastPage(10); setCurrentPage(1); setIsViewOpen(false)}}>25</span>
                                                    <span className={showPerPage === 50 ? "custom-option selected":"custom-option"} data-value="volvo" onClick={() => { setshowPerPage(50); setPostsPerPage(50);setInitialPage(0); setLastPage(10); setCurrentPage(1); setIsViewOpen(false)}}>50</span>
                                                    <span className={showPerPage === 999999999 ? "custom-option selected":"custom-option"} data-value="mercedes" onClick={() => { setshowPerPage(999999999); setInitialPage(0); setLastPage(10); setCurrentPage(1); setPostsPerPage(999999999); setIsViewOpen(false)}}>ALL</span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                       
                        <div className="customer-table">
                            <Table responsive>
                                <thead>
                                <tr>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("a-z")}>Customer Name</th>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("customer_type")}>Customer type</th>
                                    {/* <th className="cursor-pointer" onClick={()=>handleSorting("location")}>Location</th> */}
                                    <th className="cursor-pointer" onClick={()=>handleSorting("timezone")}>Timezone</th>
                                    {/* <th className="cursor-pointer" onClick={()=>handleSorting("company")}>Company Name</th> */}
                                    <th className="cursor-pointer" onClick={()=>handleSorting("orders")}>Orders</th>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("value")}>Values</th>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("last_contacted")}>Last Contact</th>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("contact_type")}>Contact Type</th>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("first_transaction")}>First Transaction</th>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("last_transaction")}>Last Transaction</th>
                                    <th className="cursor-pointer" onClick={()=>handleSorting("followup")}>Followup date</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {
                                        search ?  (
                                            allCustomerList ? allCustomerList.filter((data) => {
                                                if( 
                                                    data[1].customer_name && data[1].customer_name.toLowerCase().includes(search.toLowerCase()) ||
                                                    data[1].phone && data[1].phone.toLowerCase().includes(search.toLowerCase()) ||
                                                    data[1].email && data[1].email.toLowerCase().includes(search.toLowerCase())
                                                ) {
                                                    return data;
                                               }
                                            }).map((value,index) => {
                                                return(
                                                    <tr key={index} className="cursor-pointer" onClick={() => handleCustomer(value[0])} onContextMenu={(e) => handleCustomerRightClick(e,value[0])}>
                                                        <td><a>{value[1].customer_name ? value[1].customer_name : "-"}</a></td>
                                                        <td>{value[1].customer_type ? value[1].customer_type : "-"}</td>
                                                        {/* <td>
                                                            <div className="location-col d-flex justify-content-between">
                                                                <span>{value[1].location ? value[1].location : "-"}</span>
                                                                {
                                                                    value[1].status ? (value[1].status==="NA" ? 
                                                                    <i className="dot-icon red-color"></i>:
                                                                    <i className="dot-icon red-color"></i>) : "-"
                                                                }
                                                            </div>
                                                        </td> */}
                                                        <td>{value[1].time_zone ? value[1].time_zone : "-"}</td>
                                                        {/* <td>{value[1].company ? value[1].company : "-"}</td> */}
                                                        <td>{value[1].orders ? value[1].orders : "-"}</td>
                                                        <td>{value[1].value ? value[1].value : "-"}</td>
                                                        <td>{value[1].last_contacted ? value[1].last_contacted : "-"}</td>
                                                        <td>{value[1].contact_type ? value[1].contact_type : "-"}</td>
                                                        <td>{value[1].first_transaction ? value[1].first_transaction : "-"}</td>
                                                        <td>{value[1].last_transaction ? value[1].last_transaction : "-"}</td>
                                                        <td>{value[1].follow_date ? value[1].follow_date : "-"}</td>
                                                    </tr>           
                                                )
                                            }) :("")
                                        ) 
                                      : 
                                        (
                                            customerList && customerList.length > 0 ? (
                                                customerList ? customerList.map((value,index) => {
                                                    return(
                                                        <tr key={index} className="cursor-pointer" onClick={() => handleCustomer(value[0])} onContextMenu={(e) => handleCustomerRightClick(e,value[0])}>
                                                            <td><a>{value[1].customer_name ? value[1].customer_name : "-"}</a></td>
                                                            <td>{value[1].customer_type ? value[1].customer_type : "-"}</td>
                                                            {/* <td>
                                                                <div className="location-col d-flex justify-content-between">
                                                                    <span>{value[1].location ? value[1].location : "-"}</span>
                                                                    {
                                                                        value[1].status ? (value[1].status==="NA" ? 
                                                                        <i className="dot-icon red-color"></i>:
                                                                        <i className="dot-icon red-color"></i>) : "-"
                                                                    }
                                                                </div>
                                                            </td> */}
                                                            <td>{value[1].time_zone ? value[1].time_zone : "-"}</td>
                                                            {/* <td>{value[1].company ? value[1].company : "-"}</td> */}
                                                            <td>{value[1].orders ? value[1].orders : "-"}</td>
                                                            <td>{value[1].value ? value[1].value : "-"}</td>
                                                            <td>{value[1].last_contacted ? value[1].last_contacted : "-"}</td>
                                                            <td>{value[1].contact_type ? value[1].contact_type : "-"}</td>
                                                            <td>{value[1].first_transaction ? value[1].first_transaction : "-"}</td>
                                                            <td>{value[1].last_transaction ? value[1].last_transaction : "-"}</td>
                                                            <td>{value[1].follow_date ? value[1].follow_date : "-"}</td>
                                                        </tr>           
                                                    )
                                                }) :("")
                                            ):("")
                                        )
                                    }
                                    {
                                        loadingData ? (
                                            <tr>
                                                <td colSpan="10" className="text-center">Loading...</td>
                                            </tr>
                                        ) :
                                        ("")
                                    }
                                    {
                                        customerList && customerList.length===0 && loadingData===false && !search? (
                                            <tr>
                                                <td colSpan="10" className="text-center">No data found!</td>
                                            </tr>
                                        ) :
                                        ("")
                                    }
                                    {
                                        search ? (allCustomerList ? (allCustomerList.filter((data) => {
                                            if( 
                                                data[1].customer_name && data[1].customer_name.toLowerCase().includes(search.toLowerCase()) ||
                                                data[1].phone && data[1].phone.toLowerCase().includes(search.toLowerCase()) ||
                                                data[1].email && data[1].email.toLowerCase().includes(search.toLowerCase())
                                            ) {
                                                return data;
                                           }
                                        }).length>0) ? "":
                                        (<tr>
                                            <td colSpan="10" className="text-center">No Data Found!</td>
                                        </tr>):"") : ("")
                                    }
                                </tbody>
                            </Table>
                        </div>
                        
                        {/* Customer Table Mobile */}

                        <div className="customer-table-mobile">
                            <Table>
                                <thead>
                                    <tr>
                                        <th width="40%" onClick={()=>handleSorting("a-z")}>Customer Name</th>
                                        <th width="60%">
                                            <div className="th-filter d-flex justify-content-between align-items-center">
                                                <span onClick={()=>handleSorting("timezone")}>Timezone</span>
                                                {/* Per Page Mobile Dropdown start */}
                                                    <div className="custom-select-wrapper location-filter-select d-flex align-items-center justify-content-end">
                                                        <div className={isViewOpenPage ? "custom-selectDrop open":"custom-selectDrop "}>
                                                            <div className="custom-select__trigger" onClick={()=>setIsViewOpenPage(!isViewOpenPage)}>
                                                                {
                                                                    showPerPage === 999999999 ? 
                                                                    <span>{'ALL'}</span> :
                                                                    <span>{showPerPage}</span>
                                                                }           
                                                            </div>
                                                            <div className="custom-options per-page">
                                                                <span className={showPerPage === 5 ? "custom-option selected":"custom-option"}  onClick={() => { setshowPerPage(5); setInitialPage(0); setLastPage(5); setPostsPerPage(5); setCurrentPage(1); setIsViewOpenPage(false)}}>5</span>
                                                                <span className={showPerPage === 10 ? "custom-option selected":"custom-option"}  onClick={() => { setshowPerPage(10); setInitialPage(0); setLastPage(5); setPostsPerPage(10); setCurrentPage(1); setIsViewOpenPage(false)}}>10</span>
                                                                <span className={showPerPage === 15 ? "custom-option selected":"custom-option"}  onClick={() => { setshowPerPage(15); setInitialPage(0); setLastPage(5); setPostsPerPage(15);setCurrentPage(1); setIsViewOpenPage(false)}}>15</span>
                                                                <span className={showPerPage === 25 ? "custom-option selected":"custom-option"}  onClick={() => { setshowPerPage(25); setInitialPage(0); setLastPage(5); setPostsPerPage(25);setCurrentPage(1); setIsViewOpenPage(false)}}>25</span>
                                                                <span className={showPerPage === 999999999 ? "custom-option selected":"custom-option"} onClick={() => { setshowPerPage(999999999); setInitialPage(0); setLastPage(5); setCurrentPage(1); setPostsPerPage(999999999); setIsViewOpenPage(false)}}>ALL</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                            {/* Per Page Mobile Dropdown end */}
                                                            {/* combine Dropdown start */}
                                                            {/* combine Dropdown end */}

                                                <div className="custom-select-wrapper d-flex align-items-center justify-content-end">
                                                    <div className={isDayViewOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                        <div className="custom-select__trigger" onClick={()=>setIsDayViewOpen(!isDayViewOpen)}>
                                                            <Button variant="link">
                                                                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M17 0H1C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V3.59C0 4.113 0.213 4.627 0.583 4.997L6 10.414V18C6.0002 18.1704 6.04387 18.3379 6.1269 18.4867C6.20992 18.6354 6.32955 18.7605 6.47444 18.8502C6.61934 18.9398 6.78471 18.9909 6.9549 18.9988C7.1251 19.0066 7.29447 18.9709 7.447 18.895L11.447 16.895C11.786 16.725 12 16.379 12 16V10.414L17.417 4.997C17.787 4.627 18 4.113 18 3.59V1C18 0.734784 17.8946 0.48043 17.7071 0.292893C17.5196 0.105357 17.2652 0 17 0ZM10.293 9.293C10.2 9.38571 10.1262 9.4959 10.0759 9.61724C10.0256 9.73857 9.99981 9.86866 10 10V15.382L8 16.382V10C8.00019 9.86866 7.9744 9.73857 7.92412 9.61724C7.87383 9.4959 7.80004 9.38571 7.707 9.293L2 3.59V2H16.001L16.003 3.583L10.293 9.293Z"/>
                                                                </svg>
                                                            </Button>            
                                                        </div>
                                                        <div className="custom-options">
                                                            <span className="custom-option category-title">Last Transaction</span>
                                                            <span className={duration === 'ALL' ? "custom-option selected":"custom-option"}  onClick={() => { setIsDayViewOpen(false); setDuration('ALL'); setDurationContacted(''); handleDayFiltersTransaction('ALL'); }}>ALL</span>
                                                            <span className={duration === '30' ? "custom-option selected":"custom-option"}  onClick={() => { setIsDayViewOpen(false); setDuration('30');setDurationContacted('');handleDayFiltersTransaction('30days'); }}>30 DAYS</span>
                                                            <span className={duration === '30-90' ? "custom-option selected":"custom-option"}  onClick={() => { setIsDayViewOpen(false); setDuration('30-90');setDurationContacted('');handleDayFiltersTransaction('30_90_days'); }}>30-90 DAYS</span>
                                                            <span className={duration === '3-6' ? "custom-option selected":"custom-option"}  onClick={() => { setIsDayViewOpen(false); setDuration('3-6'); setDurationContacted('');handleDayFiltersTransaction('3_6_months'); }}>3-6 MONTHS</span>
                                                            <span className={duration === '6-12' ? "custom-option selected":"custom-option"}  onClick={() => { setIsDayViewOpen(false); setDuration('6-12');setDurationContacted('');handleDayFiltersTransaction('6_12_months'); }}>6-12 MONTHS</span>
                                                            <span className={duration === '1' ? "custom-option selected":"custom-option"} onClick={() => { setIsDayViewOpen(false); setDuration('1'); setDurationContacted('');handleDayFiltersTransaction('more_than_1_year'); }}>1 YEAR</span>

                                                            <span className="custom-option category-title">Last Contacted</span>
                                                            <span className={durationContacted === 'ALL' ? "custom-option selected":"custom-option"}  onClick={() => { setIsDayViewOpen(false); setDurationContacted('ALL'); setDuration(''); handleDayFiltersContacted('ALL'); }}>ALL</span>
                                                            <span className={durationContacted === '30' ? "custom-option selected":"custom-option"}  onClick={() => { setIsDayViewOpen(false); setDurationContacted('30');setDuration(''); handleDayFiltersContacted('30days'); }}>30 DAYS</span>
                                                            <span className={durationContacted === '30-90' ? "custom-option selected":"custom-option"}  onClick={() => { setIsDayViewOpen(false); setDurationContacted('30-90');setDuration(''); handleDayFiltersContacted('30_90_days'); }}>30-90 DAYS</span>
                                                            <span className={durationContacted === '3-6' ? "custom-option selected":"custom-option"}  onClick={() => { setIsDayViewOpen(false); setDurationContacted('3-6'); setDuration(''); handleDayFiltersContacted('3_6_months'); }}>3-6 MONTHS</span>
                                                            <span className={durationContacted === '6-12' ? "custom-option selected":"custom-option"}  onClick={() => { setIsDayViewOpen(false); setDurationContacted('6-12');setDuration(''); handleDayFiltersContacted('6_12_months'); }}>6-12 MONTHS</span>
                                                            <span className={durationContacted === '1' ? "custom-option selected":"custom-option"}  onClick={() => { setIsDayViewOpen(false); setDurationContacted('1'); setDuration(''); handleDayFiltersContacted('more_than_1_year'); }}>1 YEAR</span> 
                                                        </div>
                                                        {/* Filter List Mobile end */}
                                                    </div>
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        search ? (
                                            allCustomerList ? allCustomerList.filter((data) => {
                                                if( data[1].customer_name && data[1].customer_name.toLowerCase().includes(search.toLowerCase()) ||
                                                    data[1].email && data[1].email.toLowerCase().includes(search.toLowerCase()) ||
                                                    data[1].phone && data[1].phone.toLowerCase().includes(search.toLowerCase())
                                                ) {
                                                    return data;
                                               }
                                            }).map((value, index) => {
                                                return(
                                                    <tr key={index} className="cursor-pointer" onClick={() => handleCustomer(value[0])}>
                                                        <td><a>{value[1].customer_name ? value[1].customer_name : "-"}</a></td>
                                                        <td>
                                                            <div className="location-col d-flex justify-content-between align-items-center">
                                                                <span>{value[1].time_zone ? value[1].time_zone : "-"}</span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            }): ("")
                                            
                                        ) : (
                                            customerList && customerList.length > 0 ? (
                                                customerList ? customerList.map((value, index) => {
                                                    return(
                                                        <tr key={index} className="cursor-pointer" onClick={() => handleCustomer(value[0])}>
                                                            <td><a>{value[1].customer_name ? value[1].customer_name : "-"}</a></td>
                                                            <td>
                                                                <div className="location-col d-flex justify-content-between align-items-center">
                                                                <span>{value[1].time_zone ? value[1].time_zone : "-"}</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }): ("")
                                            ) : ("")
                                        )
                                    }
                                    {
                                        loadingData ? (
                                            <tr>
                                                <td colSpan="2" className="text-center">Loading...</td>
                                            </tr>
                                        ) :
                                        ("")
                                    }
                                    {
                                        customerList && customerList.length===0 && loadingData===false && !search? (
                                            <tr>
                                                <td colSpan="2" className="text-center">No Data Found!</td>
                                            </tr>
                                        ) :
                                        ("")
                                    }
                                    {
                                        search ? (allCustomerList ? (allCustomerList.filter((data) => {
                                            if( data[1].customer_name && data[1].customer_name.toLowerCase().includes(search.toLowerCase()) ||
                                                data[1].email && data[1].email.toLowerCase().includes(search.toLowerCase()) ||
                                                data[1].phone && data[1].phone.toLowerCase().includes(search.toLowerCase())
                                            ) {
                                                return data;
                                           }    
                                        }).length>0) ? "":
                                        (<tr>
                                            <td colSpan="2" className="text-center">No Data Found!</td>
                                        </tr>):"") : ("")
                                    }
                                    
                                </tbody>
                            </Table>
                        </div>

                        {
                            search || (!search && pageNumber.length==0)? "" : 
                            (
                                <div className="customer-table-pagination d-none d-md-block">
                                    <div className="table-pagination-row d-flex justify-content-between">
                                        <div className="table-prev">
                                            <Button
                                                    className="btn-next-prev"
                                                    variant="link"
                                                    onClick={()=>handleNavigation('prev')}
                                                    disabled={loading || initialPage===0}>{'< PREV'}
                                            </Button>
                                        </div>
                                        <div className="table-pagination-number">
                                            {
                                                new Array(pageNumber).fill("").map((val,index) => {
                                                        return(
                                                            <Button key={index}
                                                                className={(index+1)===currentPage ? "btn-number active":"btn-number" } variant="link"
                                                                onClick = {()=> setCurrentPage(index + 1)}
                                                                disabled={loading}>
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
                                                disabled={loading || pageNumber<=lastPage}>{"NEXT >"}
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
                                                    disabled={loading || initialPage===0}>{'< PREV'}
                                            </Button>
                                        </div>
                                        <div className="table-pagination-number">
                                            {
                                                new Array(pageNumber).fill("").map((val,index) => {
                                                        return(
                                                            <Button key={index}
                                                                className={(index+1)===currentPage ? "btn-number active":"btn-number" } variant="link"
                                                                onClick = {()=> setCurrentPage(index + 1)}
                                                                disabled={loading}>
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
                                                disabled={loading || pageNumber<=lastPage}>{"NEXT >"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>        
            <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage}/>
        </div>
    );
};


export default CustomerMain;