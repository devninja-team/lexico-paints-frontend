import React from "react";
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
import { useHistory } from 'react-router-dom';
import {connect} from "react-redux";
import {logout, setSession} from "../../utils/Actions";
import {roundList} from "../../utils/drop-down-list";
import axios from 'axios';
import {Link} from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner'
import Accordion from 'react-bootstrap/Accordion'
import SearchIcon from '../../assets/images/search-icon.svg';
import OrderByIcon from '../../assets/images/orderby-arrow.png';
import SessionModal from '../Modals/SessionModal';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import AsyncSelect from 'react-select/async'

let countryDropDownHeader = [];
let countryListArray=[];
const Publish = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const[showPerPage,setshowPerPage] = useState('25');
    const[isViewOpen,setIsViewOpen] = useState(false);
    const [publishDetailList, setPublishDetaiList] = useState();
    const [allPublishDetailList, setAllPublishDetaiList] = useState();
    const [recommend, setRecommend] = useState(false);
    const [recommendBody, setRecommendBody] = useState();

    const [vendorId, setVendorId] = useState();
    const query = useSelector(state => state.userRegion);



    //asc-desc flag
    const [order, setOrder] = useState('desc');

    //search var
    const [search, setSearch] = useState();
    const [openSearch, setOpenSearch] = useState(false);

    //custom pagination vars
    const [currentPage,setCurrentPage] = useState(1);
    const [postsPerPage,setPostsPerPage] = useState(25);
    const [pageNumber,setPageNumber] = useState([]);
    const [indexOfAllFirstPage,setIndexOfFirstPage] = useState();
    const [indexOfAllLastPage,setIndexOfLastPage] = useState();
    const [loadingData,setLoadingData] = useState();
    const [initialPage,setInitialPage] = useState(0);
    const [lastPage,setLastPage] = useState(10);



    //modal vars
    const [sessionMessage, setSessionMessage] = useState("");
    const [isSessionModal, setIsSessionModal] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [publishModal, setPublishModal] = useState(false);

    //sorting vars
    const[sortOrder,setSortOrder] = useState('asc');

    //spinner vars
    const [isSpinner, setIsSpinner] = useState(false);

    //filter dropdowns
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [isRegionOpen, setIsRegionOpen] = useState(false);
    const [isSubRegionOpen, setIsSubRegionOpen] = useState(false);
    const [isSizeOpen, setIsSizeOpen] = useState(false);
    const [isColorOpen, setIsColorOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);
    const [isNameOpen, setIsNameOpen] = useState(false);
    const [isStockOpen, setIsStockOpen] = useState(false);
    const [isProducerOpen, setIsProducerOpen] = useState(false);
    const [isPublishTypeOpen, setIsPublishTypeOpen] = useState(false);
    const [isBusinessLogicOpen, setIsBusinessLogicOpen] = useState(false);
    const [isETAOpen, setIsETAOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isVendorOpen, setIsVendorOpen] = useState(false);
    const [isMPOpen, setIsMPOpen] = useState(false);
    const [winePriceMin, setWinePriceMin] = useState(300);
    const [winePriceMax, setWinePriceMax] = useState(10000);


    const [countryDropDownValue, setCountryDropDownValue] = useState("");
    const [regionDropDownValue, setRegionDropDownValue] = useState("");
    const [subRegionDropDownValue, setSubRegionDropDownValue] = useState("");
    const [sizeDropDownValue, setSizeDropDownValue] = useState([
        {value: "3x750ml", label: "3x750ml"},
        {value: "6x750ml", label: "6x750ml"},
        {value: "12x750ml", label: "12x750ml"}
    ]);
    const [colorDropDownValue, setColorDropDownValue] = useState("");
    const [typeDropDownValue, setTypeDropDownValue] = useState("");
    const [yearDropDownValue, setYearDropDownValue] = useState("");
    const [stockDropDownValue, setStockDropDownValue] = useState("");
    const [nameDropDownValue, setNameDropDownValue] = useState("");
    const [producerDropDownValue, setProducerDropDownValue] = useState("");
    const [publishTypeDropDownValue, setPublishTypeDropDownValue] = useState("");
    const [businessLogicDropDownValue, setBusinessLogicDropDownValue] = useState("Yes");
    const [etaDropDownValue, setETADropDownValue] = useState("");
    const [locationDropDownValue, setLocationDropDownValue] = useState("");
    const [vendorDropDownValue, setVendorDropDownValue] = useState("");
    const [mpDropDownValue, setMpDropDownValue] = useState("");

    
    const [countryList, setCountryList] = useState("");
    const [regionList , setRegionList] = useState();
    const [subRegionList, setSubRegionList] = useState();
    const [colorList, setColorList] = useState();
    const [typeList, setTypeList] = useState();
    const [yearList, setYearList] = useState();
    const [sizeList, setSizeList] = useState();
    const [stockList, setStockList] = useState();
    const [nameList, setNameList] = useState();
    const [publishList, setPublishList] = useState();
    const [producerList, setProducerList] = useState();
    const [businessLogicList, setBusinessLogicList] = useState();
    const [etaList, setETAList] = useState();
    const [locationList, setLocationList] = useState();
    const [vendorList, setVendorList] = useState();
    const [allVendorList, setAllVendorList] = useState();
    const [mpList, setMpList] = useState();

    const [isFilterOpen, setIsFilterOpen] = useState(true);
    const [isStockFilterOpen, setIsStockFilterOpen] = useState(false);
    const [isParameterFilterOpen, setIsParameterFilterOpen] = useState(false);

    const [name, setName] = useState();
    const [producer, setProducer] = useState();
    const [vendor, setVendor] = useState("");

    //select all flag
    const [selectAll, setSelectAll] = useState(false);
    const [selectIndividual, setIndividual] = useState(false);

    //bulk publish wine
    const [isCondition1Open, setIsCondition1Open] = useState(false);
    const [isCondition2Open, setIsCondition2Open] = useState(false);
    const [isCondition3Open, setIsCondition3Open] = useState(false);
    const [isCondition4Open, setIsCondition4Open] = useState(false);
    const [isCondition5Open, setIsCondition5Open] = useState(false);
    const [isCondition6Open, setIsCondition6Open] = useState(false);

    const [condition1DropDownValue, setCondition1DropDownValue] = useState("");
    const [condition2DropDownValue, setCondition2DropDownValue] = useState("");
    const [condition3DropDownValue, setCondition3DropDownValue] = useState("");
    const [condition4DropDownValue, setCondition4DropDownValue] = useState("");
    const [condition5DropDownValue, setCondition5DropDownValue] = useState("");
    const [condition6DropDownValue, setCondition6DropDownValue] = useState("");

    const [condition1Margin, setCondition1Margin] = useState();
    const [condition2Margin, setCondition2Margin] = useState();
    const [condition3Margin, setCondition3Margin] = useState();
    const [condition4Margin, setCondition4Margin] = useState();
    const [condition5Margin, setCondition5Margin] = useState();
    const [condition6Margin, setCondition6Margin] = useState();
    
    const [condition1Margin2, setCondition1Margin2] = useState();
    const [condition2Margin2, setCondition2Margin2] = useState();
    const [condition3Margin2, setCondition3Margin2] = useState();
    const [condition4Margin2, setCondition4Margin2] = useState();
    const [condition5Margin2, setCondition5Margin2] = useState();
    const [condition6Margin2, setCondition6Margin2] = useState();

    const [condition1Qty, setCondition1Qty] = useState();
    const [condition2Qty, setCondition2Qty] = useState();
    const [condition3Qty, setCondition3Qty] = useState();
    const [condition4Qty, setCondition4Qty] = useState();
    const [condition5Qty, setCondition5Qty] = useState();
    const [condition6Qty, setCondition6Qty] = useState();


    const [minBP, setMinBP] = useState();
    const [maxBP, setMaxBP] = useState();

    const [minCSR, setMinCSR] = useState();
    const [maxCSR, setMaxCSR] = useState();

    const [minDD, setMinDD] = useState();
    const [maxDD, setMaxDD] = useState();

    const [minAlcohol, setMinAlcohol] = useState();
    const [maxAlcohol, setMaxAlcohol] = useState();

    const [isCriticOpen, setIsCriticOpen] = useState(false);
    const [isDrinkingOpen, setIsDrinkingOpen] = useState(false);
    const [criticList, setCriticList] = useState();
    const [drinkList, setDrinkList] = useState();
    const [criticDropDownValue, setCriticDropDownValue] = useState();
    const [drinkingDropDownValue, setDrinkingDropDownValue] = useState();


    const [publishError,setPublishError] = useState("");

    //Edit modal vars
    const [editPublishModal, setEditPublishModal] = useState(false);
    const [salePrice, setSalePrice] = useState("");
    const [editLwin18, setEditLwin18] = useState("");
    const [saleID, setSaleID] = useState("");

    //search vars
    const [countrySearch, setCountrySearch] = useState("");

    const [countryHeader, setCountryHeader] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState();
    const [selectedWines, setSelectedWines] = useState();
    const [selectedProducer, setSelectedProducer] = useState();
    const [selectedRegion, setSelectedRegion] = useState();
    const [selectedSubRegion, setSelectedSubRegion] = useState();
    const [selectedColor, setSelectedColor] = useState();
    const [selectedType, setSelectedType] = useState();
    const [selectedYear, setSelectedYear] = useState();
    const [selectedSize, setSelectedSize] = useState();
    const [selectedStock, setSelectedStock] = useState();
    const [selectedPublish, setSelectedPublish] = useState();
    const [selectedBusiness, setSelectedBusiness] = useState();
    const [selectedEta, setSelectedEta] = useState();
    const [selectedLocation, setSelectedLocation] = useState();
    const [selectedVendor, setSelectedVendor] = useState();
    
    //backend pagination
    const [currentBackendPage, setCurrentBackendPage] = useState(0);
    const [totalBackendPages, setTotalBackendPages] = useState();


    useEffect(() => {
        // fetchPublishDetails();
        // handleFilterAPI(false,"");
    },[]);
    // useEffect(() => {
    //     if(name==="") {
    //         setIsNameOpen(false);
    //         setNameDropDownValue("");
    //     }
    // },[name]);
    useEffect(() => {
        if(producer==="") {
            setIsProducerOpen(false);
            setProducerDropDownValue("");
        }
    },[producer]);
    useEffect(() => {
        if(vendor==="") {
            setIsVendorOpen(false);
            setVendorDropDownValue("");
        }
    },[vendor]);
    
    useEffect(() => {
        handleFilterAPI(false,"",1,winePriceMin, winePriceMax);
    },[countryDropDownValue, regionDropDownValue, subRegionDropDownValue, colorDropDownValue, typeDropDownValue, 
       yearDropDownValue, sizeDropDownValue, nameDropDownValue, stockDropDownValue, producerDropDownValue, 
       publishTypeDropDownValue, businessLogicDropDownValue, etaDropDownValue, locationDropDownValue, vendorDropDownValue, mpDropDownValue]);
    useEffect(() => {
        if(allPublishDetailList && allPublishDetailList.length > 0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setIndexOfFirstPage(indexOfFirstPage);
            setIndexOfLastPage(indexOfLastPost);
            
            setPublishDetaiList(allPublishDetailList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allPublishDetailList.length/postsPerPage);i++) {
                setPageNumber(...[i])
            }
        }
    },[currentPage,postsPerPage]);

    const handleSorting = (field) => {
        if(publishDetailList && publishDetailList.length>0) {
            let sortedArray=[];
            if(sortOrder == "asc") {
                setSortOrder('desc');
            }else {
                setSortOrder('asc');
            }
            if(search) {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "PRODUCER" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.PRODUCER?a.PRODUCER.toLowerCase():""
                                    var nameB=b.PRODUCER?b.PRODUCER.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "NAME" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():""
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SUBREGION" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SUBREGION?a.SUBREGION.toLowerCase():""
                                    var nameB=b.SUBREGION?b.SUBREGION.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "IS_PUBLISHED" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.IS_PUBLISHED?a.IS_PUBLISHED.toLowerCase():""
                                    var nameB=b.IS_PUBLISHED?b.IS_PUBLISHED.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "REGION" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.REGION?a.REGION.toLowerCase():""
                                    var nameB=b.REGION?b.REGION.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "COUNTRY" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.COUNTRY?a.COUNTRY.toLowerCase():""
                                    var nameB=b.COUNTRY?b.COUNTRY.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "YEAR" :
                                sortedArray = publishDetailList.sort( function(a, b) {
                                    var nameA=a.YEAR?a.YEAR.toLowerCase():""
                                    var nameB=b.YEAR?b.YEAR.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SIZE_VALUE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SIZE_VALUE?a.SIZE_VALUE.toLowerCase():""
                                    var nameB=b.SIZE_VALUE?b.SIZE_VALUE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRICE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.PRICE?parseFloat(a.PRICE):""
                                    var nameB=b.PRICE?parseFloat(b.PRICE):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "USMP" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.USMP?parseFloat(a.USMP):""
                                    var nameB=b.USMP?parseFloat(b.USMP):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "QTY" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.QTY?a.QTY.toLowerCase():""
                                    var nameB=b.QTY?b.QTY.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SALE_PRICE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SALE_PRICE?parseFloat(a.SALE_PRICE):""
                                    var nameB=b.SALE_PRICE?parseFloat(b.SALE_PRICE):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SALE_QTY" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SALE_QTY?a.SALE_QTY.toLowerCase():""
                                    var nameB=b.SALE_QTY?b.SALE_QTY.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "STOCK_TYPE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.STOCK_TYPE?a.STOCK_TYPE.toLowerCase():""
                                    var nameB=b.STOCK_TYPE?b.STOCK_TYPE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "STOCK_SOURCE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.STOCK_SOURCE?a.STOCK_SOURCE.toLowerCase():""
                                    var nameB=b.STOCK_SOURCE?b.STOCK_SOURCE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "ETA" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.ETA?a.ETA.toLowerCase():""
                                    var nameB=b.ETA?b.ETA.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            default:console.log("check sorting Label 1"); break;
                        }
                        setAllPublishDetaiList([...sortedArray]);
                        break;
    
                    case 'desc' :
                        switch(field) {
                            case "PRODUCER" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.PRODUCER?a.PRODUCER.toLowerCase():""
                                    var nameB=b.PRODUCER?b.PRODUCER.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "NAME" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():""
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SUBREGION" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SUBREGION?a.SUBREGION.toLowerCase():""
                                    var nameB=b.SUBREGION?b.SUBREGION.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "REGION" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.REGION?a.REGION.toLowerCase():""
                                    var nameB=b.REGION?b.REGION.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "IS_PUBLISHED" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.IS_PUBLISHED?a.IS_PUBLISHED.toLowerCase():""
                                    var nameB=b.IS_PUBLISHED?b.IS_PUBLISHED.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "COUNTRY" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.COUNTRY?a.COUNTRY.toLowerCase():""
                                    var nameB=b.COUNTRY?b.COUNTRY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "YEAR" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.YEAR?a.YEAR.toLowerCase():""
                                    var nameB=b.YEAR?b.YEAR.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SIZE_VALUE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SIZE_VALUE?a.SIZE_VALUE.toLowerCase():""
                                    var nameB=b.SIZE_VALUE?b.SIZE_VALUE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRICE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.PRICE?parseFloat(a.PRICE):""
                                    var nameB=b.PRICE?parseFloat(b.PRICE):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "USMP" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.USMP?parseFloat(a.USMP):""
                                    var nameB=b.USMP?parseFloat(b.USMP):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "QTY" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.QTY?a.QTY.toLowerCase():""
                                    var nameB=b.QTY?b.QTY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SALE_PRICE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SALE_PRICE?parseFloat(a.SALE_PRICE):""
                                    var nameB=b.SALE_PRICE?parseFloat(b.SALE_PRICE):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SALE_QTY" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SALE_QTY?a.SALE_QTY.toLowerCase():""
                                    var nameB=b.SALE_QTY?b.SALE_QTY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "STOCK_TYPE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.STOCK_TYPE?a.STOCK_TYPE.toLowerCase():""
                                    var nameB=b.STOCK_TYPE?b.STOCK_TYPE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "STOCK_SOURCE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.STOCK_SOURCE?a.STOCK_SOURCE.toLowerCase():""
                                    var nameB=b.STOCK_SOURCE?b.STOCK_SOURCE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "ETA" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.ETA?a.ETA.toLowerCase():""
                                    var nameB=b.ETA?b.ETA.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            default:console.log("check sorting Label 2"); break;
                        }
                        setAllPublishDetaiList([...sortedArray]);
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }else {
                switch (sortOrder) {
                    case 'asc' :
                        switch(field) {
                            case "PRODUCER" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.PRODUCER?a.PRODUCER.toLowerCase():""
                                    var nameB=b.PRODUCER?b.PRODUCER.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "NAME" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():""
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SUBREGION" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SUBREGION?a.SUBREGION.toLowerCase():""
                                    var nameB=b.SUBREGION?b.SUBREGION.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "REGION" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.REGION?a.REGION.toLowerCase():""
                                    var nameB=b.REGION?b.REGION.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "IS_PUBLISHED" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.IS_PUBLISHED?a.IS_PUBLISHED.toLowerCase():""
                                    var nameB=b.IS_PUBLISHED?b.IS_PUBLISHED.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "COUNTRY" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.COUNTRY?a.COUNTRY.toLowerCase():""
                                    var nameB=b.COUNTRY?b.COUNTRY.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "YEAR" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.YEAR?a.YEAR.toLowerCase():""
                                    var nameB=b.YEAR?b.YEAR.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SIZE_VALUE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SIZE_VALUE?a.SIZE_VALUE.toLowerCase():""
                                    var nameB=b.SIZE_VALUE?b.SIZE_VALUE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRICE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.PRICE?parseFloat(a.PRICE):""
                                    var nameB=b.PRICE?parseFloat(b.PRICE):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "USMP" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.USMP?parseFloat(a.USMP):""
                                    var nameB=b.USMP?parseFloat(b.USMP):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "QTY" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.QTY?a.QTY.toLowerCase():""
                                    var nameB=b.QTY?b.QTY.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SALE_PRICE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SALE_PRICE?parseFloat(a.SALE_PRICE):""
                                    var nameB=b.SALE_PRICE?parseFloat(b.SALE_PRICE):""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SALE_QTY" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SALE_QTY?a.SALE_QTY.toLowerCase():""
                                    var nameB=b.SALE_QTY?b.SALE_QTY.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "STOCK_TYPE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.STOCK_TYPE?a.STOCK_TYPE.toLowerCase():""
                                    var nameB=b.STOCK_TYPE?b.STOCK_TYPE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "STOCK_SOURCE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.STOCK_SOURCE?a.STOCK_SOURCE.toLowerCase():""
                                    var nameB=b.STOCK_SOURCE?b.STOCK_SOURCE.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "ETA" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.ETA?a.ETA.toLowerCase():""
                                    var nameB=b.ETA?b.ETA.toLowerCase():""
                                    if (nameA < nameB) //sort string ascending
                                        return -1
                                    if (nameA > nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            default:console.log("check sorting Label 1"); break;
                        }
                        // setPublishDetaiList([...sortedArray]);
                        paginate();
                        break;
    
                    case 'desc' :
                        switch(field) {
                            case "PRODUCER" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.PRODUCER?a.PRODUCER.toLowerCase():""
                                    var nameB=b.PRODUCER?b.PRODUCER.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "NAME" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.NAME?a.NAME.toLowerCase():""
                                    var nameB=b.NAME?b.NAME.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SUBREGION" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SUBREGION?a.SUBREGION.toLowerCase():""
                                    var nameB=b.SUBREGION?b.SUBREGION.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "REGION" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.REGION?a.REGION.toLowerCase():""
                                    var nameB=b.REGION?b.REGION.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "IS_PUBLISHED" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.IS_PUBLISHED?a.IS_PUBLISHED.toLowerCase():""
                                    var nameB=b.IS_PUBLISHED?b.IS_PUBLISHED.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "COUNTRY" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.COUNTRY?a.COUNTRY.toLowerCase():""
                                    var nameB=b.COUNTRY?b.COUNTRY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "YEAR" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.YEAR?a.YEAR.toLowerCase():""
                                    var nameB=b.YEAR?b.YEAR.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SIZE_VALUE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SIZE_VALUE?a.SIZE_VALUE.toLowerCase():""
                                    var nameB=b.SIZE_VALUE?b.SIZE_VALUE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "PRICE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.PRICE?parseFloat(a.PRICE):""
                                    var nameB=b.PRICE?parseFloat(b.PRICE):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "USMP" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.USMP?parseFloat(a.USMP):""
                                    var nameB=b.USMP?parseFloat(b.USMP):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "QTY" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.QTY?a.QTY.toLowerCase():""
                                    var nameB=b.QTY?b.QTY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SALE_PRICE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SALE_PRICE?parseFloat(a.SALE_PRICE):""
                                    var nameB=b.SALE_PRICE?parseFloat(b.SALE_PRICE):""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "SALE_QTY" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.SALE_QTY?a.SALE_QTY.toLowerCase():""
                                    var nameB=b.SALE_QTY?b.SALE_QTY.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "STOCK_TYPE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.STOCK_TYPE?a.STOCK_TYPE.toLowerCase():""
                                    var nameB=b.STOCK_TYPE?b.STOCK_TYPE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "STOCK_SOURCE" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.STOCK_SOURCE?a.STOCK_SOURCE.toLowerCase():""
                                    var nameB=b.STOCK_SOURCE?b.STOCK_SOURCE.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            case "ETA" :
                                sortedArray = allPublishDetailList.sort( function(a, b) {
                                    var nameA=a.ETA?a.ETA.toLowerCase():""
                                    var nameB=b.ETA?b.ETA.toLowerCase():""
                                    if (nameA > nameB) //sort string ascending
                                        return -1
                                    if (nameA < nameB)
                                        return 1
                                    return 0 //default return value (no sorting)
                                });
                            break;
                            default:console.log("check sorting Label 2"); break;
                        }
                        // setPublishDetaiList([...sortedArray]);
                        paginate();
                        break;
                    default: console.log('check sorting Label 3'); break;
                }
            }
        }
    }
    const paginate = () => {
        if(allPublishDetailList && allPublishDetailList.length>0) {
            var indexOfLastPost = currentPage * postsPerPage;
            var indexOfFirstPage = indexOfLastPost - postsPerPage;
            setPublishDetaiList(allPublishDetailList.slice(indexOfFirstPage,indexOfLastPost));
            for(let i=1; i<=Math.ceil(allPublishDetailList.length/postsPerPage);i++) {
                setPageNumber(...[i])
            }
        }
    }
    const handleFilterProducerAPI = (query_string) => {
        setInitialPage(0);
        setCurrentPage(1);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        axios
        .post("/publish/search_producer"+query,{
            country:countryDropDownValue ===""||countryDropDownValue ===null ? "":countryDropDownValue.map(data => data.value),
            region:regionDropDownValue ===""||regionDropDownValue ===null ? "":regionDropDownValue.map(data => data.value),
            subregion:subRegionDropDownValue ===""||subRegionDropDownValue ===null ? "":subRegionDropDownValue.map(data => data.value),
            color:colorDropDownValue ===""||colorDropDownValue ===null ? "":colorDropDownValue.map(data => data.value),
            type:typeDropDownValue ===""||typeDropDownValue ===null ? "":typeDropDownValue.map(data => data.value),
            year:yearDropDownValue ===""||yearDropDownValue === null ? "":yearDropDownValue.map(data => data.value),
            size:sizeDropDownValue ===""||sizeDropDownValue ===null ? "":sizeDropDownValue.map(data => data.value),
            name:nameDropDownValue,
            stock_type:stockDropDownValue ===""||stockDropDownValue === null ? "":stockDropDownValue.map(data => data.value),
            publish_type: publishTypeDropDownValue,
            b_logic: businessLogicDropDownValue,
            delivery_eta: etaDropDownValue,
            wine_location: locationDropDownValue,
            vendors: vendorDropDownValue,
            market_price_follow: mpDropDownValue,
            min_price: winePriceMin,
            max_price: winePriceMax,
            q:query_string
        }).then((res) => {
            if(res.data.name) {
                setProducerList(res.data.name);
            }
        })
        .catch((error) => {
            console.log(error);
            // dispatch(setSession());
            // const server_code = error.response.status;
            // const server_message = error.response.statusText;
            // if(server_code && server_message) {
            //     setSessionMessage(server_message);
            //     setIsSessionModal(true);
            // }
        })
    }
    const handleFilterWineAPI = (query_string) => {
        setInitialPage(0);
        setCurrentPage(1);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        axios
        .post("/publish/search_wine/"+query, {
            country:countryDropDownValue ===""||countryDropDownValue ===null ? "":countryDropDownValue.map(data => data.value),
            region:regionDropDownValue ==="" ? "":regionDropDownValue.map(data => data.value),
            subregion:subRegionDropDownValue ==="" ? "":subRegionDropDownValue.map(data => data.value),
            color:colorDropDownValue ==="" ? "":colorDropDownValue.map(data => data.value),
            type:typeDropDownValue ==="" ? "":typeDropDownValue.map(data => data.value),
            year:yearDropDownValue ==="" ? "":yearDropDownValue.map(data => data.value),
            size:sizeDropDownValue ==="" ? "":sizeDropDownValue.map(data => data.value),
            producer:producerDropDownValue,
            stock_type:stockDropDownValue ==="" ? "":stockDropDownValue.map(data => data.value),
            publish_type: publishTypeDropDownValue,
            b_logic: businessLogicDropDownValue,
            delivery_eta: etaDropDownValue,
            wine_location: locationDropDownValue,
            vendors: vendorDropDownValue,
            market_price_follow: mpDropDownValue,
            min_price: winePriceMin,
            max_price: winePriceMax,
            q:query_string
        }).then((res) => {
            if(res.data.name) {
                setNameList(res.data.name);
            }
        })
        .catch((error) => {
            console.log(error);
            // dispatch(setSession());
            // const server_code = error.response.status;
            // const server_message = error.response.statusText;
            // if(server_code && server_message) {
            //     setSessionMessage(server_message);
            //     setIsSessionModal(true);
            // }
        })
    }
    const handleFilterAPI = (isUpdate, recommendValue, page_num, min, max) => {
        setIsSpinner(true);
        setInitialPage(0);
        setCurrentPage(1);
        setPublishError("");
        setCurrentBackendPage(page_num);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }

        setAllPublishDetaiList([]);
        setPublishDetaiList([]);
        setLoadingData(true);
        // console.log("sizeList",sizeList)
        // console.log("size dropdown value",min, max)
        if(isUpdate) {
            setIsSpinner(true);
            axios
            .post("/publish"+query, {
                country:countryDropDownValue ==="" || countryDropDownValue ===null ? "":countryDropDownValue.map(data => data.value),
                region:regionDropDownValue ===""||regionDropDownValue ===null ? "":regionDropDownValue.map(data => data.value),
                subregion:subRegionDropDownValue ===""||subRegionDropDownValue ===null ? "":subRegionDropDownValue.map(data => data.value),
                color:colorDropDownValue ===""||colorDropDownValue ===null ? "":colorDropDownValue.map(data => data.value),
                type:typeDropDownValue ===""||typeDropDownValue ===null ? "":typeDropDownValue.map(data => data.value),
                year:yearDropDownValue ===""||yearDropDownValue ===null ? "":yearDropDownValue.map(data => data.value),
                size:sizeDropDownValue ===""||sizeDropDownValue ===null ? "":sizeDropDownValue.map(data => data.value),
                producer:producerDropDownValue,
                stock_type:stockDropDownValue ===""||stockDropDownValue === null ? "":stockDropDownValue.map(data => data.value),
                publish_type:publishTypeDropDownValue,
                b_logic: businessLogicDropDownValue,
                delivery_eta: etaDropDownValue,
                name:nameDropDownValue,
                wine_location: locationDropDownValue,
                vendors: vendorDropDownValue,
                market_price_follow: mpDropDownValue,
                min_price: min,
                max_price: max,
                recommend:"1",
                recommend_values: recommendValue,
                page_num,
                per_page:1000

            }).then((res) => {
                // console.log("publish data", res.data)
                var indexOfLastPost = 1 * postsPerPage;
                var indexOfFirstPage = indexOfLastPost - postsPerPage;
                setIndexOfFirstPage(indexOfFirstPage);
                setIndexOfLastPage(indexOfLastPost);
                let selectEnableArray=[];
                let color;
                if(res.data.results) {
                    setLoadingData(false);
                    res.data.results.map((value, index) => {
                        if(index===0 || (index%2===0)) {
                            value.color = 1;
                        } else {
                            value.color = 2;
                        }
                        value.isSelected = false;
                        if(selectEnableArray.indexOf(value.LWIN18)>=0) {
                            value.showSelect = false;
                        } else {
                            value.showSelect = true;
                        }
                        selectEnableArray.push(value.LWIN18);
                    })
                    setAllPublishDetaiList(res.data.results);
                    setPublishDetaiList(res.data.results.slice(indexOfFirstPage,indexOfLastPost));
                    setLoadingData(false);
                    for(let i=1; i<=Math.ceil(res.data.results.length/postsPerPage);i++) {
                        setPageNumber(...[i])
                    }
                }
                if(res.data.filters) {
                    let countryArray = [], regionArray = [], subRegionArray = [];
                    let colorArray = [], typeArray = [], yaerArray = [], sizeArray = [];
                    let stockArray = [], publishArray = [], businessArray = [];
                    let etaArray = [], locationArray = [], vendorArray=[];
                    res.data.filters.country.map((data) => {
                        countryArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    });
                    res.data.filters.region.map((data) => {
                        regionArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                    res.data.filters.subregion.map((data) => {
                        subRegionArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                   
                    res.data.filters.color.map((data) => {
                        colorArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                    res.data.filters.classification.map((data) => {
                        typeArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                    res.data.filters.year.map((data) => {
                        yaerArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                    res.data.filters.size.map((data) => {
                        sizeArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                    res.data.filters.stock_type.map((data) => {
                        stockArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                    // res.data.filters.publish_type.map((data) => {
                    //     publishArray.push(
                    //         {
                    //             value: data,
                    //             label: data
                    //         }
                    //     )
                    // })
                    // res.data.filters.business_logic.map((data) => {
                    //     businessArray.push(
                    //         {
                    //             value: data,
                    //             label: data
                    //         }
                    //     )
                    // })
                    // res.data.filters.delivery_eta.map((data) => {
                    //     etaArray.push(
                    //         {
                    //             value: data,
                    //             label: data
                    //         }
                    //     )
                    // })
                    // res.data.filters.wine_location.map((data) => {
                    //     locationArray.push(
                    //         {
                    //             value: data,
                    //             label: data
                    //         }
                    //     )
                    // })
                    // res.data.filters.vendors.map((data) => {
                    //     vendorArray.push(
                    //         {
                    //             value: data,
                    //             label: data
                    //         }
                    //     )
                    // });
                    setCountryList(countryArray);
                    setRegionList(regionArray);
                    setSubRegionList(subRegionArray);
                    setColorList(colorArray);
                    setTypeList(typeArray);
                    setYearList(yaerArray);
                    setSizeList(sizeArray);
                    setStockList(stockArray);
                    setPublishList(res.data.filters.publish_type);
                    setBusinessLogicList(res.data.filters.business_logic);
                    setETAList(res.data.filters.delivery_eta);
                    setLocationList(res.data.filters.wine_location);
                    setVendorList(res.data.filters.vendors);
                    setAllVendorList(res.data.filters.vendors);
                    setMpList(res.data.filters.market_price_follow);
                    
                }
                if(res.data.margins) {
                    // setCondition1(res.data.margins.condition1);
                    // setCondition2(res.data.margins.condition2);
                    // setCondition3(res.data.margins.condition3);
                    // setCondition4(res.data.margins.condition4);
                    // setCondition5(res.data.margins.condition5);
                    // setCondition6(res.data.margins.condition6);
                    setCondition1DropDownValue(res.data.margins.condition1.round?res.data.margins.condition1.round:"10");
                    setCondition2DropDownValue(res.data.margins.condition2.round?res.data.margins.condition2.round:"10");
                    setCondition3DropDownValue(res.data.margins.condition3.round?res.data.margins.condition3.round:"10");
                    setCondition4DropDownValue(res.data.margins.condition4.round?res.data.margins.condition4.round:"10");
                    setCondition5DropDownValue(res.data.margins.condition5.round?res.data.margins.condition5.round:"10");
                    setCondition6DropDownValue(res.data.margins.condition6.round?res.data.margins.condition6.round:"10");
                    
                    setCondition1Margin(res.data.margins.condition1.margin?res.data.margins.condition1.margin:"");
                    setCondition2Margin(res.data.margins.condition2.margin?res.data.margins.condition2.margin:"");
                    setCondition3Margin(res.data.margins.condition3.margin?res.data.margins.condition3.margin:"");
                    setCondition4Margin(res.data.margins.condition4.margin?res.data.margins.condition4.margin:"");
                    setCondition5Margin(res.data.margins.condition5.margin?res.data.margins.condition5.margin:"");
                    setCondition6Margin(res.data.margins.condition6.margin?res.data.margins.condition6.margin:"");

                    setCondition1Margin2(res.data.margins.condition1.margin2?res.data.margins.condition1.margin2:"");
                    setCondition2Margin2(res.data.margins.condition2.margin2?res.data.margins.condition2.margin2:"");
                    setCondition3Margin2(res.data.margins.condition3.margin2?res.data.margins.condition3.margin2:"");
                    setCondition4Margin2(res.data.margins.condition4.margin2?res.data.margins.condition4.margin2:"");
                    setCondition5Margin2(res.data.margins.condition5.margin2?res.data.margins.condition5.margin2:"");
                    setCondition6Margin2(res.data.margins.condition6.margin2?res.data.margins.condition6.margin2:"");

                    setCondition1Qty(res.data.margins.condition1.qty?res.data.margins.condition1.qty:"");
                    setCondition2Qty(res.data.margins.condition2.qty?res.data.margins.condition2.qty:"");
                    setCondition3Qty(res.data.margins.condition3.qty?res.data.margins.condition3.qty:"");
                    setCondition4Qty(res.data.margins.condition4.qty?res.data.margins.condition4.qty:"");
                    setCondition5Qty(res.data.margins.condition5.qty?res.data.margins.condition5.qty:"");
                    setCondition6Qty(res.data.margins.condition6.qty?res.data.margins.condition6.qty:"");
                }
                if(res.data.recommendation) {
                    setMinAlcohol(res.data.recommendation.alcohol.min);
                    setMaxAlcohol(res.data.recommendation.alcohol.max);

                    setMinBP(res.data.recommendation.bottle_price.min);
                    setMaxBP(res.data.recommendation.bottle_price.max);

                    setMinCSR(res.data.recommendation.critics_scores.min);
                    setMaxCSR(res.data.recommendation.critics_scores.max);

                    setCriticList(res.data.recommendation.drink_dates.critics);
                    setDrinkList(res.data.recommendation.drink_dates.critics);

                    setMinDD(res.data.recommendation.drink_dates.min);
                    setMaxDD(res.data.recommendation.drink_dates.max);
                }
                if(res.data.info) {
                    setTotalBackendPages(res.data.info.total_pages);
                }
                setLoadingData(false);
                setIsSpinner(false);
            })
            .catch((error) => {
                console.log(error);
                setIsSpinner(false);
                // dispatch(setSession());
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
        } else { 
            setIsSpinner(true);
            axios
            .post("/publish"+query, {
                country:countryDropDownValue ==="" || countryDropDownValue ===null? "":countryDropDownValue.map(data => data.value),
                region:regionDropDownValue ===""||regionDropDownValue ===null ? "":regionDropDownValue.map(data => data.value),
                subregion:subRegionDropDownValue ===""||subRegionDropDownValue ===null ? "":subRegionDropDownValue.map(data => data.value),
                color:colorDropDownValue ===""||colorDropDownValue ===null ? "":colorDropDownValue.map(data => data.value),
                type:typeDropDownValue ===""||typeDropDownValue === null ? "":typeDropDownValue.map(data => data.value),
                year:yearDropDownValue ===""||yearDropDownValue === null ? "":yearDropDownValue.map(data => data.value),
                size:sizeDropDownValue ==="" ||sizeDropDownValue === null? "":sizeDropDownValue.map(data => data.value),
                producer:producerDropDownValue,
                stock_type:stockDropDownValue ===""||stockDropDownValue === null ? "":stockDropDownValue.map(data => data.value),
                publish_type:publishTypeDropDownValue,
                b_logic: businessLogicDropDownValue,
                delivery_eta: etaDropDownValue,
                wine_location: locationDropDownValue,
                name:nameDropDownValue,
                vendors: vendorDropDownValue,
                market_price_follow: mpDropDownValue,
                min_price: min,
                max_price: max,
                page_num,
                per_page:1000
            }).then((res) => {
                // console.log("Publish API response:", res.data)
                var indexOfLastPost = 1 * postsPerPage;
                var indexOfFirstPage = indexOfLastPost - postsPerPage;
                setIndexOfFirstPage(indexOfFirstPage);
                setIndexOfLastPage(indexOfLastPost);
                if(res.data.results) {
                setLoadingData(false);
                let selectEnableArray = [];
                let color;
                res.data.results.map((value, index) => {
                    if(index===0 || (index%2===0)) {
                        value.color = 1;
                    } else {
                        value.color = 2;
                    }
                    value.isSelected = false;
                    if(selectEnableArray.indexOf(value.LWIN18)>=0) {
                        value.showSelect = false;
                    } else {
                        value.showSelect = true;
                    }
                    selectEnableArray.push(value.LWIN18);
                })
                    setAllPublishDetaiList(res.data.results);
                    setPublishDetaiList(res.data.results.slice(indexOfFirstPage,indexOfLastPost));
                    setLoadingData(false);
                    for(let i=1; i<=Math.ceil(res.data.results.length/postsPerPage);i++) {
                        setPageNumber(...[i])
                    }
                }
                if(res.data.filters) {
                    // setCountryList(res.data.filters.country);
                    let countryArray = [], regionArray = [], subRegionArray = [];
                    let colorArray = [], typeArray = [], yaerArray = [], sizeArray = [];
                    let stockArray = [], publishArray = [], businessArray = [];
                    let etaArray = [], locationArray = [], vendorArray=[];
                    res.data.filters.country.map((data) => {
                        countryArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    });
                    res.data.filters.region.map((data) => {
                        regionArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                    res.data.filters.subregion.map((data) => {
                        subRegionArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                   
                    res.data.filters.color.map((data) => {
                        colorArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                    res.data.filters.classification.map((data) => {
                        typeArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                    res.data.filters.year.map((data) => {
                        yaerArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                    res.data.filters.size.map((data) => {
                        sizeArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                    res.data.filters.stock_type.map((data) => {
                        stockArray.push(
                            {
                                value: data,
                                label: data
                            }
                        )
                    })
                    // res.data.filters.publish_type.map((data) => {
                    //     publishArray.push(
                    //         {
                    //             value: data,
                    //             label: data
                    //         }
                    //     )
                    // })
                    // res.data.filters.business_logic.map((data) => {
                    //     businessArray.push(
                    //         {
                    //             value: data,
                    //             label: data
                    //         }
                    //     )
                    // })
                    // res.data.filters.delivery_eta.map((data) => {
                    //     etaArray.push(
                    //         {
                    //             value: data,
                    //             label: data
                    //         }
                    //     )
                    // })
                    // res.data.filters.wine_location.map((data) => {
                    //     locationArray.push(
                    //         {
                    //             value: data,
                    //             label: data
                    //         }
                    //     )
                    // })
                    // res.data.filters.vendors.map((data) => {
                    //     vendorArray.push(
                    //         {
                    //             value: data,
                    //             label: data
                    //         }
                    //     )
                    // });
                    setCountryList(countryArray)
                    setRegionList(regionArray);
                    setSubRegionList(subRegionArray);
                    setColorList(colorArray);
                    setTypeList(typeArray);
                    setYearList(yaerArray);
                    setSizeList(sizeArray);
                    setStockList(stockArray);
                    setPublishList(res.data.filters.publish_type);
                    setBusinessLogicList(res.data.filters.business_logic);
                    setETAList(res.data.filters.delivery_eta);
                    setLocationList(res.data.filters.wine_location);
                    setVendorList(res.data.filters.vendors);
                    setAllVendorList(res.data.filters.vendors);
                    setMpList(res.data.filters.market_price_follow);
                }
                if(res.data.margins) {
                    setCondition1DropDownValue(res.data.margins.condition1.round?res.data.margins.condition1.round:"10");
                    setCondition2DropDownValue(res.data.margins.condition2.round?res.data.margins.condition2.round:"10");
                    setCondition3DropDownValue(res.data.margins.condition3.round?res.data.margins.condition3.round:"10");
                    setCondition4DropDownValue(res.data.margins.condition4.round?res.data.margins.condition4.round:"10");
                    setCondition5DropDownValue(res.data.margins.condition5.round?res.data.margins.condition5.round:"10");
                    setCondition6DropDownValue(res.data.margins.condition6.round?res.data.margins.condition6.round:"10");
                    
                    setCondition1Margin(res.data.margins.condition1.margin?res.data.margins.condition1.margin:"");
                    setCondition2Margin(res.data.margins.condition2.margin?res.data.margins.condition2.margin:"");
                    setCondition3Margin(res.data.margins.condition3.margin?res.data.margins.condition3.margin:"");
                    setCondition4Margin(res.data.margins.condition4.margin?res.data.margins.condition4.margin:"");
                    setCondition5Margin(res.data.margins.condition5.margin?res.data.margins.condition5.margin:"");
                    setCondition6Margin(res.data.margins.condition6.margin?res.data.margins.condition6.margin:"");

                    setCondition1Margin2(res.data.margins.condition1.margin2?res.data.margins.condition1.margin2:"");
                    setCondition2Margin2(res.data.margins.condition2.margin2?res.data.margins.condition2.margin2:"");
                    setCondition3Margin2(res.data.margins.condition3.margin2?res.data.margins.condition3.margin2:"");
                    setCondition4Margin2(res.data.margins.condition4.margin2?res.data.margins.condition4.margin2:"");
                    setCondition5Margin2(res.data.margins.condition5.margin2?res.data.margins.condition5.margin2:"");
                    setCondition6Margin2(res.data.margins.condition6.margin2?res.data.margins.condition6.margin2:"");

                    setCondition1Qty(res.data.margins.condition1.qty?res.data.margins.condition1.qty:"");
                    setCondition2Qty(res.data.margins.condition2.qty?res.data.margins.condition2.qty:"");
                    setCondition3Qty(res.data.margins.condition3.qty?res.data.margins.condition3.qty:"");
                    setCondition4Qty(res.data.margins.condition4.qty?res.data.margins.condition4.qty:"");
                    setCondition5Qty(res.data.margins.condition5.qty?res.data.margins.condition5.qty:"");
                    setCondition6Qty(res.data.margins.condition6.qty?res.data.margins.condition6.qty:"");
                }
                if(res.data.recommendation) {
                    setMinAlcohol(res.data.recommendation.alcohol.min);
                    setMaxAlcohol(res.data.recommendation.alcohol.max);

                    setMinBP(res.data.recommendation.bottle_price.min);
                    setMaxBP(res.data.recommendation.bottle_price.max);

                    setMinCSR(res.data.recommendation.critics_scores.min);
                    setMaxCSR(res.data.recommendation.critics_scores.max);

                    setCriticList(res.data.recommendation.critics_scores.critics);
                    setDrinkList(res.data.recommendation.drink_dates.critics);

                    setMinDD(res.data.recommendation.drink_dates.min);
                    setMaxDD(res.data.recommendation.drink_dates.max);
                }
                if(res.data.info) {
                    setTotalBackendPages(res.data.info.total_pages);
                }
                setLoadingData(false);
                setIsSpinner(false);
            })
            .catch((error) => {
                console.log(error);
                setIsSpinner(false);
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
    const handleCheck = (id, checkValue) => {
        let newList;
        newList = allPublishDetailList.map((value, index) => {
            if(value.LWIN18===id) {
                value.isSelected = checkValue;
            }
            return value;
        })
        // setPublishDetaiList(newList);
        paginate();

    }
    const handleAllCheck = (allCheck) => {
        let newList;
        newList = allPublishDetailList.map((value, index) => {
            value.isSelected = allCheck;
            return value;
        })
        // setPublishDetaiList(newList);
        paginate();
    }
    const handlePublishBtn = () => {
        let lwinList = [];
        setPublishError("");
        allPublishDetailList.map((value) => {
            if(value.isSelected === true) {
                lwinList.push(value.LWIN18);
            }
        });
        const margin = {
            "condition1": {
                "margin": condition1Margin,
                "qty": condition1Qty,
                "round": condition1DropDownValue
            },
            "condition2": {
                "margin": condition2Margin,
                "qty": condition3Qty,
                "round": condition3DropDownValue
            },
            "condition3": {
                "margin": condition3Margin,
                "qty": condition3Qty,
                "round": condition3DropDownValue
            },
            "condition4": {
                "margin": condition4Margin,
                "qty": condition4Qty,
                "round": condition4DropDownValue
            },
            "condition5": {
                "margin": condition5Margin,
                "qty": condition5Qty,
                "round": condition5DropDownValue
            },
            "condition6": {
                "margin": condition6Margin,
                "qty": condition6Qty,
                "round": condition6DropDownValue
            },
        }
        if(lwinList.length>0) {
            setIsSpinner(true);
            axios
            .post("/publish/sales"+query, {
                lwin: lwinList,
                margins: margin
            }).then((res) => {
                if(res.data === "Wine published as per business logic"){
                    setIsSpinner(false);
                    setSuccess("Wine published successfully!")
                    setError("");
                    setPublishModal(true);
                    setSelectAll(false);
                } else {
                    setError(res.data);
                    setSuccess("");
                    setIsSessionModal(true);
                }
                handleFilterAPI(false, "", 1, winePriceMin, winePriceMax);
            })
            .catch((error) => {
                console.log(error);
                // dispatch(setSession());
                const server_code = error.response.status;
                const server_message = error.response.statusText;
                if(server_code && server_message) {
                    setIsSpinner(false);
                    setSessionMessage(server_message);
                    setIsSessionModal(true);
                }
                
            })
        } else {
            setPublishError("Please select wine");
        }
    }
    const handleUpdateBtn = () => {
        const recommend = {
            "alcohol": {
                "min": minAlcohol,
                "max": maxAlcohol
            },
            "bottle_price": {
                "min": minBP,
                "max": maxBP

            },
            "critics_scores": {
                "min": minCSR,
                "max": maxCSR,
                "critics": criticDropDownValue
            },
            "drink_dates": {
                "min": minDD,
                "max": maxDD,
                "critics": drinkingDropDownValue
            }
        }
        setRecommendBody(recommend);
        handleFilterAPI(true, recommend, 1, winePriceMin, winePriceMax);
    }
    const handleUnPublishBtn = () => {
        let lwinList = [];
        setPublishError("");
        allPublishDetailList.map((value) => {
            if(value.isSelected === true) {
                lwinList.push(value.LWIN18);
            }
        });
        if(lwinList.length>0) {
            setIsSpinner(true);
            axios
            .post("/publish/unpublish"+query, {
                lwin: lwinList
            }).then((res) => {
                if(res.data==="Wine unpublished!") {
                    setSuccess("Wine unpublished!");
                    setSuccess("");
                    setPublishModal(true);
                    handleFilterAPI(false, "", 1, winePriceMin, winePriceMax);
                } else {
                    setError(res.data);
                    setSuccess("");
                    setPublishModal(true);
                }
            })
            .catch((error) => {
                console.log(error);
                // dispatch(setSession());
                const server_code = error.response.status;
                const server_message = error.response.statusText;
                if(server_code && server_message) {
                    setIsSpinner(false);
                    setSessionMessage(server_message);
                    setIsSessionModal(true);
                }
            })
        } else {
            setPublishError("Please select wine");
        }
    }
    const handleRefreshBusinessLogic = () => {
        setIsSpinner(true);
        axios
            .post("/publish/business_logic/"+query, {
                key:"UKJI786UJ"
            }).then((res) => {
                if(res.data.message==="Refresh Done!") {
                    setError("");
                    setIsSpinner(false);
                    setSuccess("Refresh Done!");
                    setPublishModal(true);    
                    handleFilterAPI(false, "", 1, winePriceMin, winePriceMax);
                } else {
                    setSuccess("");
                    setIsSpinner(false);
                    setError(res.data.message);
                    setPublishModal(true);
                    // handleFilterAPI(false, "", 1);
                }
            })
            .catch((error) => {
                console.log(error);
                // dispatch(setSession());
                const server_code = error.response.status;
                const server_message = error.response.statusText;
                if(server_code && server_message) {
                    setSessionMessage(server_message);
                    setIsSessionModal(true);
                }
            })
    }
    const handleEditPublish = (e) => {
        e.preventDefault();
        axios.post('/publish/edit_sale_price/'+query,{
            wine_id: editLwin18,
            price: salePrice,
            sale_id: saleID
        }).then((res) => {
            if(res.data.message === "price updated") {
                setSuccess("Price Successfully Updated!");
                handleFilterAPI(false, "",1, winePriceMin, winePriceMax);
            } else {
                setSuccess("");
                setError(res.data.message);
            }
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
    const handleVendorList = (query) => {
        if(vendorList && vendorList.length>0) {
            let filterData = vendorList.filter((value) => {
                if(value.toLowerCase().includes(query.toLowerCase())) {
                    return value;
                }
            });
            setAllVendorList(filterData);
        }
    }
    const handleCloseDropDowns = (type) => {
        switch(type){
            case "publish":
                setIsBusinessLogicOpen(false);
                setIsETAOpen(false);
                setIsLocationOpen(false);
                setIsVendorOpen(false);
                setIsMPOpen(false);
                // setIsPublishTypeOpen(false);
                setIsCriticOpen(false);
                setIsDrinkingOpen(false);
            break;
            case "business logic":
                // setIsBusinessLogicOpen(false);
                setIsETAOpen(false);
                setIsLocationOpen(false);
                setIsVendorOpen(false);
                setIsMPOpen(false);
                setIsPublishTypeOpen(false);
                setIsCriticOpen(false);
                setIsDrinkingOpen(false);
            break;
            case "eta":
                setIsBusinessLogicOpen(false);
                // setIsETAOpen(false);
                setIsLocationOpen(false);
                setIsVendorOpen(false);
                setIsMPOpen(false);
                setIsPublishTypeOpen(false);
                setIsCriticOpen(false);
                setIsDrinkingOpen(false);
            break;
            case "location":
                setIsBusinessLogicOpen(false);
                setIsETAOpen(false);
                // setIsLocationOpen(false);
                setIsVendorOpen(false);
                setIsMPOpen(false);
                setIsPublishTypeOpen(false);
                setIsCriticOpen(false);
                setIsDrinkingOpen(false);
            break;
            case "vendor":
                setIsBusinessLogicOpen(false);
                setIsETAOpen(false);
                setIsLocationOpen(false);
                // setIsVendorOpen(false);
                setIsMPOpen(false);
                setIsPublishTypeOpen(false);
                setIsCriticOpen(false);
                setIsDrinkingOpen(false);
            break;
            case "mp":
                setIsBusinessLogicOpen(false);
                setIsETAOpen(false);
                setIsLocationOpen(false);
                setIsVendorOpen(false);
                // setIsMPOpen(false);
                setIsPublishTypeOpen(false);
                setIsCriticOpen(false);
                setIsDrinkingOpen(false);
            break;
            case "critic":
                setIsBusinessLogicOpen(false);
                setIsETAOpen(false);
                setIsLocationOpen(false);
                setIsVendorOpen(false);
                setIsMPOpen(false);
                setIsPublishTypeOpen(false);
                setIsDrinkingOpen(false);
            break;
            case "drinking":
                setIsBusinessLogicOpen(false);
                setIsETAOpen(false);
                setIsLocationOpen(false);
                setIsVendorOpen(false);
                setIsMPOpen(false);
                setIsPublishTypeOpen(false);
                setIsCriticOpen(false);
            break;
            case "all":
                setIsBusinessLogicOpen(false);
                setIsETAOpen(false);
                setIsLocationOpen(false);
                setIsVendorOpen(false);
                setIsMPOpen(false);
                setIsPublishTypeOpen(false);
                setIsCriticOpen(false);
                setIsDrinkingOpen(false);
            break;
                default: console.log("wrong input..")
        }
    }

    const handleBulkSave = () => {
        const marginBody = {
            margins: {
                condition1: {
                    margin: condition1Margin,
                    margin2: condition1Margin2,
                    qty: condition1Qty,
                    round: condition1DropDownValue
                },
                condition2: {
                    margin: condition2Margin,
                    margin2: condition2Margin2,
                    qty: condition2Qty,
                    round: condition2DropDownValue
                },
                condition3: {
                    margin: condition3Margin,
                    margin2: condition3Margin2,
                    qty: condition3Qty,
                    round: condition3DropDownValue
                },
                condition4: {
                    margin: condition4Margin,
                    margin2: condition4Margin2,
                    qty: condition4Qty,
                    round: condition4DropDownValue
                },
                condition5: {
                    margin: condition5Margin,
                    margin2: condition5Margin2,
                    qty: condition5Qty,
                    round: condition5DropDownValue
                },
                condition6: {
                    margin: condition6Margin,
                    margin2: condition6Margin2,
                    qty: condition6Qty,
                    round: condition6DropDownValue
                }
            }

        }
        // console.log("save margin POST body:", marginBody)
        axios.post('/publish/save_margin/'+query,{
            save_margin:marginBody
        }).then((res) => {
            // console.log("save margin api response:", res.data)
            if(res.data.message === "Saved") {
                setSuccess("Margin Updated!");
                handleFilterAPI(false, "",1, winePriceMin, winePriceMax);
            } else {
                setSuccess("");
                setError(res.data.message);
            }
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
    const getWineList = (value, callback) => {
        // console.log("producer search", value)
        setInitialPage(0);
        setCurrentPage(1);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        return axios
        .post("/publish/search_wine/"+query, {
            country:countryDropDownValue ===""||countryDropDownValue ===null ? "":countryDropDownValue.map(data => data.value),
            region:regionDropDownValue ==="" ? "":regionDropDownValue.map(data => data.value),
            subregion:subRegionDropDownValue ==="" ? "":subRegionDropDownValue.map(data => data.value),
            color:colorDropDownValue ==="" ? "":colorDropDownValue.map(data => data.value),
            type:typeDropDownValue ==="" ? "":typeDropDownValue.map(data => data.value),
            year:yearDropDownValue ==="" ? "":yearDropDownValue.map(data => data.value),
            size:sizeDropDownValue ==="" ? "":sizeDropDownValue.map(data => data.value),
            producer:producerDropDownValue,
            stock_type:stockDropDownValue ==="" ? "":stockDropDownValue.map(data => data.value),
            publish_type: publishTypeDropDownValue,
            b_logic: businessLogicDropDownValue,
            delivery_eta: etaDropDownValue,
            wine_location: locationDropDownValue,
            vendors: vendorDropDownValue,
            market_price_follow: mpDropDownValue,
            min_price: winePriceMin,
            max_price: winePriceMax,
            q:value
        }).then((res) => {
            if(res.data.name) {
                let wineArray = [];
                (res.data.name).map((data) => {
                    wineArray.push(
                        {
                            value: data,
                            label: data
                        }
                    )
                });
                // console.log("array", producerArray)
                return wineArray.splice(0,50)
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }
    const getProducerList = (value, callback) => {
        setInitialPage(0);
        setCurrentPage(1);
        if(window.screen.width<=480) {
            setLastPage(5);
        } else {
            setLastPage(10);
        }
        return axios
        .post("/publish/search_producer"+query,{
            country:countryDropDownValue ===""||countryDropDownValue ===null ? "":countryDropDownValue.map(data => data.value),
            region:regionDropDownValue ===""||regionDropDownValue ===null ? "":regionDropDownValue.map(data => data.value),
            subregion:subRegionDropDownValue ===""||subRegionDropDownValue ===null ? "":subRegionDropDownValue.map(data => data.value),
            color:colorDropDownValue ===""||colorDropDownValue ===null ? "":colorDropDownValue.map(data => data.value),
            type:typeDropDownValue ===""||typeDropDownValue ===null ? "":typeDropDownValue.map(data => data.value),
            year:yearDropDownValue ===""||yearDropDownValue === null ? "":yearDropDownValue.map(data => data.value),
            size:sizeDropDownValue ===""||sizeDropDownValue ===null ? "":sizeDropDownValue.map(data => data.value),
            name:nameDropDownValue,
            stock_type:stockDropDownValue ===""||stockDropDownValue === null ? "":stockDropDownValue.map(data => data.value),
            publish_type: publishTypeDropDownValue,
            b_logic: businessLogicDropDownValue,
            delivery_eta: etaDropDownValue,
            wine_location: locationDropDownValue,
            vendors: vendorDropDownValue,
            market_price_follow: mpDropDownValue,
            min_price: winePriceMin,
            max_price: winePriceMax,
            q:value
        }).then((res) => {
            // console.log(res.data)
            if(res.data.name) {
                let producerArray = [];
                (res.data.name).map((data) => {
                    producerArray.push(
                        {
                            value: data,
                            label: data
                        }
                    )
                });
                // console.log("array", producerArray)
                return producerArray.splice(0,50)
            }
        })
        .catch((error) => {
            console.log(error);
        })
    }
    return (
        
        <div className="transaction-page">
            <div className="customers-content">
                <div className="top-head d-flex align-items-center justify-content-between my-2 flex-wrap h-auto">
                    <div className="title d-flex justify-content-start align-items-center">
                        <h1 className="mb-0 font-35">Publish Details</h1>
                    </div>
                    <div className="header justify-content-end flex-fill mt-3 mt-md-0">
                        <div className="right-side search-page-dropbox">
                        <Button className="reset-btn mr-3" onClick={() => {setRecommend(true); handleFilterAPI(false,"",1, winePriceMin, winePriceMax)}}>Update</Button>
                        <Button className="reset-btn" onClick={() => window.location.href="/publish"}>Reset All Filters</Button>
                            {/* <div className={openSearch ? "search-opt show" : "search-opt"}>
                                <input placeholder="Search by name and producer" type="text" value={search} onChange={(e) => { setSearch(e.target.value)}}/>
                                <img src={SearchIcon} onClick={() => setOpenSearch(!openSearch)}/>
                            </div> */}
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
                                            <span className={showPerPage === 100 ? "custom-option selected":"custom-option"} data-value="volvo" onClick={() => { setshowPerPage(100); setPostsPerPage(100); setCurrentPage(1); setIsViewOpen(false)}}>100</span>
                                            <span className={showPerPage === 250 ? "custom-option selected":"custom-option"} data-value="volvo" onClick={() => { setshowPerPage(250); setPostsPerPage(250); setCurrentPage(1); setIsViewOpen(false)}}>250</span>
                                            <span className={showPerPage === 500 ? "custom-option selected":"custom-option"} data-value="volvo" onClick={() => { setshowPerPage(500); setPostsPerPage(500); setCurrentPage(1); setIsViewOpen(false)}}>500</span>
                                            <span className={showPerPage === 1000 ? "custom-option selected":"custom-option"} data-value="volvo" onClick={() => { setshowPerPage(1000); setPostsPerPage(1000); setCurrentPage(1); setIsViewOpen(false)}}>1000</span>
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
                </div>
            </div>
            
          
        <Accordion defaultActiveKey="0" className="mb-2">
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={() => setIsFilterOpen(!isFilterOpen)}>
                        {isFilterOpen ? "Hide Wine Filters" : "Show Wine Filters"}
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                <Card.Body>
                    <div className="account-info-detail" >
                        <div className="storage-details-block">
                            <div className="storage-details-row d-flex">
                                <div className="storage-details-list">
                                    <div className="storage-addr">
                                        <div className="d-flex publish-country-dropdown">
                                        <div className="dropUp">
                                            <label>Country:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                            <Select
                                                isMulti
                                                closeMenuOnSelect={true}
                                                options={countryList?countryList:[]}
                                                className="basic-multi-select"
                                                name="colors"
                                                id="country-dropdown"
                                                classNamePrefix="select"
                                                placeholder="Select Country"
                                                onChange = {(selectedCountry)=> {setCountryDropDownValue(selectedCountry);} }
                                                value={selectedCountry}
                                            />
                                            </div>                                                
                                        </div>

                                        <div className="dropUp">
                                            <label>Region:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <Select
                                                    isMulti
                                                    closeMenuOnSelect={true}
                                                    options={regionList?regionList:[]}
                                                    className="basic-multi-select"
                                                    name="colors"
                                                    classNamePrefix="select"
                                                    placeholder="Select Region"
                                                    onChange = {(selectedRegion)=> {setRegionDropDownValue(selectedRegion);} }
                                                    value={selectedRegion}
                                                />
                                            </div>                                                
                                        </div>
                                        <div className="dropUp">
                                            <label>Subregion:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <Select
                                                    isMulti
                                                    closeMenuOnSelect={true}
                                                    options={subRegionList?subRegionList:[]}
                                                    className="basic-multi-select"
                                                    name="colors"
                                                    classNamePrefix="select"
                                                    placeholder="Select Subregion"
                                                    onChange = {(selectedSubRegion)=> {setSubRegionDropDownValue(selectedSubRegion);} }
                                                    value={selectedSubRegion}
                                                />
                                            </div> 
                                        </div>
                                        <div className="dropUp">
                                            <label>Search Producers:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                {/* <div className={isProducerOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" >
                                                        <span><input className="search-input" type="text" value={producer}  onFocus={() => handleCloseDropDowns("all")} onChange={(e)=>{setIsProducerOpen(true); setProducer(e.target.value); handleFilterProducerAPI(e.target.value)}}
                                                                placeholder="Search Producers"></input></span>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            producerList && producerList.length>0 ? (
                                                                producerList.map((value, index) => {
                                                                    return (
                                                                        <span className={producerDropDownValue === value ? "custom-option selected":"custom-option"} onClick={() => { setProducerDropDownValue(value); setProducer(value); setIsProducerOpen(false)}}>{value}</span>
                                                                    )
                                                                }) 
                                                            ):(
                                                                <span className="custom-option">{"No Producer found!"}</span>
                                                            )
                                                        }
                                                    </div>
                                                </div> */}
                                                <AsyncSelect
                                                    closeMenuOnSelect={true}
                                                    className="basic-multi-select"
                                                    name="colors"
                                                    id="producer-dropdown"
                                                    classNamePrefix="select"
                                                    placeholder="Type to see Producer List"
                                                    onChange = {(selectedProducer)=> {setSelectedProducer(selectedProducer); setProducerDropDownValue(selectedProducer.value);} }
                                                    value={selectedProducer}
                                                    loadOptions={getProducerList}
                                                />
                                            </div>
                                        </div>
                                        <div className="dropUp">
                                            <label>Search Wines:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                {/* <div className={isNameOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" >
                                                        <span><input className="search-input" type="text" value={name} onFocus={() => handleCloseDropDowns("all")} onChange={(e)=>{setIsNameOpen(true); setName(e.target.value); handleFilterWineAPI(e.target.value)}}
                                                                placeholder="Search Wines"></input></span>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            nameList && nameList.length>0 ? (
                                                                nameList.map((value, index) => {
                                                                    return (
                                                                        <span className={nameDropDownValue === value ? "custom-option selected":"custom-option"} onClick={() => { setNameDropDownValue(value); setName(value); setIsNameOpen(false)}}>{value}</span>
                                                                    )
                                                                }) 
                                                            ):(
                                                                <span className="custom-option">{"No Wine found!"}</span>
                                                            )
                                                        }
                                                    </div>
                                                </div> */}
                                                <AsyncSelect
                                                    closeMenuOnSelect={true}
                                                    className="basic-multi-select"
                                                    name="colors"
                                                    id="wine-dropdown"
                                                    classNamePrefix="select"
                                                    placeholder="Type to see Wine List"
                                                    onChange = {(selectedWines)=> {setSelectedWines(selectedWines); setNameDropDownValue(selectedWines.value);} }
                                                    value={selectedWines}
                                                    loadOptions={getWineList}
                                                />
                                            </div>
                                        </div>
                                        <div className="dropUp">
                                            <label>Classification:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <Select
                                                    isMulti
                                                    closeMenuOnSelect={true}
                                                    options={typeList?typeList:[]}
                                                    className="basic-multi-select"
                                                    name="colors"
                                                    classNamePrefix="select"
                                                    placeholder="Select Classification"
                                                    onChange = {(selectedType)=> {setTypeDropDownValue(selectedType);} }
                                                    value={selectedType}
                                                />
                                            </div>
                                        </div>
                                        <div className="dropUp">
                                            <label>Vintage:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <Select
                                                    isMulti
                                                    closeMenuOnSelect={true}
                                                    options={yearList?yearList:[]}
                                                    className="basic-multi-select"
                                                    name="colors"
                                                    classNamePrefix="select"
                                                    placeholder="Select Vintage"
                                                    onChange = {(selectedYear)=> {setYearDropDownValue(selectedYear);} }
                                                    value={selectedYear}
                                                />
                                            </div>
                                        </div>
                                        <div className="dropUp">
                                            <label>Color:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <Select
                                                    isMulti
                                                    closeMenuOnSelect={true}
                                                    options={colorList?colorList:[]}
                                                    className="basic-multi-select"
                                                    name="colors"
                                                    classNamePrefix="select"
                                                    placeholder="Select Color"
                                                    onChange = {(selectedColor)=> {setColorDropDownValue(selectedColor);} }
                                                    value={selectedColor}
                                                />
                                            </div>
                                        </div>
                                        <div className="dropUp">
                                            <label>Size:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <Select
                                                    isMulti
                                                    closeMenuOnSelect={true}
                                                    options={sizeList?sizeList:[]}
                                                    className="basic-multi-select"
                                                    name="colors"
                                                    classNamePrefix="select"
                                                    placeholder="Select Size"
                                                    onChange = {(selectedSize)=> {setSizeDropDownValue(selectedSize);}}
                                                    value={selectedSize}
                                                    defaultValue={[
                                                        {value: "3x750ml", label: "3x750ml"},
                                                        {value: "6x750ml", label: "6x750ml"},
                                                        {value: "12x750ml", label: "12x750ml"}
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                        <div className="dropUp">
                                            <label>Wine Price Range:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                            <div className="bulk-content-block d-flex">
                                                <div className="bulk-content-value d-flex align-items-center f">
                                                    <input className="custom-input" placeholder="Min" type="number" value={winePriceMin} onChange={(e) => setWinePriceMin(e.target.value)} onBlur={(e) => handleFilterAPI(false,"",1, e.target.value, winePriceMax)}></input>
                                                </div>
                                                <div className="bulk-content-value d-flex align-items-center">
                                                    <input className="custom-input" placeholder="Max" type="number" value={winePriceMax} onChange={(e) => setWinePriceMax(e.target.value)} onBlur={(e) => handleFilterAPI(false,"",1, winePriceMin, e.target.value)}></input>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex publish-country-dropdown top-hr">
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        <Accordion  className="mb-2">
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={() => setIsStockFilterOpen(!isStockFilterOpen)}>
                        {isStockFilterOpen ? "Hide Stock Details Filters" : "Show Stock Details Filters"}
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                <Card.Body>
                    <div className="account-info-detail" >
                        <div className="storage-details-block">
                            <div className="storage-details-row d-flex">
                                <div className="storage-details-list">
                                    <div className="storage-addr">
                                    <div className="d-flex publish-country-dropdown">
                                        <div className="dropUp">
                                            <label>Publish Type:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isPublishTypeOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{setIsPublishTypeOpen(!isPublishTypeOpen); handleCloseDropDowns("publish");}}>
                                                        <span>{publishTypeDropDownValue ? publishTypeDropDownValue : "All"}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            publishList && publishList.length>0 ? (
                                                                publishList.map((value, index) => {
                                                                    return (
                                                                        <span className={publishTypeDropDownValue === value ? "custom-option selected":"custom-option"} 
                                                                            onClick={() => { setPublishTypeDropDownValue(value); setIsPublishTypeOpen(false)}}>{value}
                                                                        </span>
                                                                    )
                                                                }) 
                                                            ):""
                                                        }
                                                        <span className={publishTypeDropDownValue === "" ? "custom-option selected":"custom-option"} onClick={() => { setPublishTypeDropDownValue("");setIsPublishTypeOpen(false)}}>{"All"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dropUp">
                                            <label>Wine Location:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isLocationOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{setIsLocationOpen(!isLocationOpen); handleCloseDropDowns("location");}}>
                                                        <span>{locationDropDownValue ? locationDropDownValue : "All"}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            locationList && locationList.length>0 ? (
                                                                locationList.map((value, index) => {
                                                                    return (
                                                                        <span className={locationDropDownValue === value ? "custom-option selected":"custom-option"} 
                                                                            onClick={() => { setLocationDropDownValue(value); setIsLocationOpen(false)}}>{value}
                                                                        </span>
                                                                    )
                                                                }) 
                                                            ):""
                                                        }
                                                        <span className={locationDropDownValue === "" ? "custom-option selected":"custom-option"} onClick={() => { setLocationDropDownValue(""); setIsLocationOpen(false)}}>{"All"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dropUp">
                                            <label>Delivery ETA:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isETAOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{setIsETAOpen(!isETAOpen); handleCloseDropDowns("eta");}}>
                                                        <span>{etaDropDownValue ? etaDropDownValue : "All"}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            etaList && etaList.length>0 ? (
                                                                etaList.map((value, index) => {
                                                                    return (
                                                                        <span className={etaDropDownValue === value ? "custom-option selected":"custom-option"} 
                                                                            onClick={() => { setETADropDownValue(value); setIsETAOpen(false)}}>{value}
                                                                        </span>
                                                                    )
                                                                }) 
                                                            ):""
                                                        }
                                                        <span className={etaDropDownValue === "" ? "custom-option selected":"custom-option"} onClick={() => { setETADropDownValue(""); setIsETAOpen(false)}}>{"All"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                        <div className="d-flex publish-country-dropdown top-hr">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        <Accordion  className="mb-2">
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={() => setIsParameterFilterOpen(!isParameterFilterOpen)}>
                        {isParameterFilterOpen ? "Hide Parameter Filters" : "Show Parameter Filters"}
                    </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                <Card.Body>
                    <div className="account-info-detail" >
                        <div className="storage-details-block">
                            <div className="storage-details-row d-flex">
                                <div className="storage-details-list">
                                    <div className="storage-addr">
                                    <div className="d-flex publish-country-dropdown">
                                        <div className="dropUp">
                                            <label>Business Logic:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isBusinessLogicOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{setIsBusinessLogicOpen(!isBusinessLogicOpen);handleCloseDropDowns("business logic");}}>
                                                        <span>{businessLogicDropDownValue ? businessLogicDropDownValue : "All"}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            businessLogicList && businessLogicList.length>0 ? (
                                                                businessLogicList.map((value, index) => {
                                                                    return (
                                                                        <span className={businessLogicDropDownValue === value ? "custom-option selected":"custom-option"} 
                                                                            onClick={() => { setBusinessLogicDropDownValue(value); setIsBusinessLogicOpen(false)}}>{value}
                                                                        </span>
                                                                    )
                                                                }) 
                                                            ):""
                                                        }
                                                        <span className={businessLogicDropDownValue === "" ? "custom-option selected":"custom-option"} onClick={() => { setBusinessLogicDropDownValue("");setIsBusinessLogicOpen(false)}}>{"All"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dropUp">
                                            <label>At Market Price:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isMPOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger" onClick={()=>{setIsMPOpen(!isMPOpen); handleCloseDropDowns("mp");}}>
                                                        <span>{mpDropDownValue ? mpDropDownValue : "All"}</span>
                                                        <div className="arrow">
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            mpList && mpList.length>0 ? (
                                                                mpList.map((value, index) => {
                                                                    return (
                                                                        <span className={mpDropDownValue === value ? "custom-option selected":"custom-option"} 
                                                                            onClick={() => { setMpDropDownValue(value); setIsMPOpen(false)}}>{value}
                                                                        </span>
                                                                    )
                                                                }) 
                                                            ):""
                                                        }
                                                        <span className={mpDropDownValue === "" ? "custom-option selected":"custom-option"} onClick={() => { setMpDropDownValue(""); setIsMPOpen(false)}}>{"All"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="dropUp">
                                            <label>Stock Type:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <Select
                                                    isMulti
                                                    closeMenuOnSelect={true}
                                                    options={stockList?stockList:[]}
                                                    className="basic-multi-select"
                                                    name="colors"
                                                    classNamePrefix="select"
                                                    placeholder="Select Stock Type"
                                                    onChange = {(selectedStock)=> {setStockDropDownValue(selectedStock);} }
                                                    value={selectedStock}
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="dropUp">
                                            <label>Vendor:</label>
                                            <div className="custom-select-wrapper d-flex align-items-center">
                                                <div className={isVendorOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                    <div className="custom-select__trigger">
                                                        <input className="search-input" type="text" value={vendor} onFocus={() => handleCloseDropDowns("all")}  onClick={() => {setIsVendorOpen(!isVendorOpen);}} onChange={(e)=>{setIsVendorOpen(true); setVendor(e.target.value); handleVendorList(e.target.value);}}
                                                            placeholder="Select Vendor">
                                                        </input>
                                                        <div className="arrow" onClick={() => {setIsVendorOpen(!isVendorOpen); handleCloseDropDowns("vendor");}}>
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="custom-options">
                                                        {
                                                            vendorList && vendorList.length>0 && vendor===""? (
                                                                vendorList.map((value, index) => {
                                                                    return (
                                                                        <span className={vendorDropDownValue === value ? "custom-option selected":"custom-option"} 
                                                                            onClick={() => { setVendorDropDownValue(value); setVendor(value); setIsVendorOpen(false)}}>{value}
                                                                        </span>
                                                                    )
                                                                }) 
                                                            ):""
                                                        }
                                                        {
                                                            allVendorList && allVendorList.length>0 && vendor!==""? (
                                                                allVendorList.map((value, index) => {
                                                                    return (
                                                                        <span className={vendorDropDownValue === value ? "custom-option selected":"custom-option"} 
                                                                            onClick={() => { setVendorDropDownValue(value); setVendor(value); setIsVendorOpen(false)}}>{value}
                                                                        </span>
                                                                    )
                                                                }) 
                                                            ):""
                                                        }
                                                        {
                                                            allVendorList && allVendorList.length===0 && vendor!=="" ? 
                                                                <span className="custom-option">{"No Vendor found!"}</span>:
                                                            ""
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </div>
                                        <div className="d-flex publish-country-dropdown top-hr">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        
        <Accordion defaultActiveKey="0" className="mb-2">
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        Bulk Publish
                    </Accordion.Toggle>
                    <div className="publish-btn d-flex align-items-center flex-column">
                        <Button className="btn" onClick={() => {setRecommend(true); handleBulkSave();}}>Save</Button>
                    </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                <Card.Body>
                <div className="bulk-publish-block my-3">
                    <div className="bulk-block">
                        <div className="bulk-row d-flex">
                            <div className="bulk-content">
                                <ul className="m-0 p-0">
                                    <li className="d-flex justify-content-between align-items-end mb-3">
                                        <div className="bulk-content-lable">
                                            <label>If price range is $0-$500:</label>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label>Margin</label>
                                            <input className="custom-input" type="number" value={condition1Margin} onChange={(e) => setCondition1Margin(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label>Margin Missing USMP</label>
                                            <input className="custom-input" type="number" value={condition1Margin2} onChange={(e) => setCondition1Margin2(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label>Quantity</label>
                                            <input className="custom-input" type="number" value={condition1Qty} onChange={(e) => setCondition1Qty(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column">
                                            <div className="dropUp">
                                                <label>Round</label>
                                                <div className="custom-select-wrapper d-flex align-items-center mb-0">
                                                    <div className={isCondition1Open ? "custom-selectDrop open":"custom-selectDrop "}>
                                                        <div className="custom-select__trigger" onClick={()=>setIsCondition1Open(!isCondition1Open)}>
                                                            <span>{condition1DropDownValue ? condition1DropDownValue : ""}</span>
                                                            <div className="arrow">
                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="custom-options">
                                                            {
                                                                roundList && roundList.length>0 ? (
                                                                    roundList.map((value, index) => {
                                                                        return (
                                                                            <span key={index} className={condition1DropDownValue === value ? "custom-option selected":"custom-option"} onClick={() => { setCondition1DropDownValue(value); setIsCondition1Open(false)}}>{value}</span>
                                                                        )
                                                                    }) 
                                                                ):""
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li className="d-flex justify-content-between align-items-end mb-3">
                                        <div className="bulk-content-lable">
                                            <label>If price range is $501-$1000:</label>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Margin</label>
                                            <input className="custom-input" type="number" value={condition2Margin} onChange={(e) => setCondition2Margin(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Margin Missing USMP</label>
                                            <input className="custom-input" type="number" value={condition2Margin2} onChange={(e) => setCondition2Margin2(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Quantity</label>
                                            <input className="custom-input" type="number" value={condition2Qty} onChange={(e) => setCondition2Qty(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column">
                                            <div className="dropUp">
                                                    <label className="d-block d-md-none">Round</label>
                                                    <div className="custom-select-wrapper d-flex align-items-center mb-0">
                                                        <div className={isCondition2Open ? "custom-selectDrop open":"custom-selectDrop "}>
                                                            <div className="custom-select__trigger" onClick={()=>setIsCondition2Open(!isCondition2Open)}>
                                                                <span>{condition2DropDownValue ? condition2DropDownValue : ""}</span>
                                                                <div className="arrow">
                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="custom-options">
                                                                {
                                                                    roundList && roundList.length>0 ? (
                                                                        roundList.map((value, index) => {
                                                                            return (
                                                                                <span className={condition2DropDownValue === value ? "custom-option selected":"custom-option"} onClick={() => { setCondition2DropDownValue(value); setIsCondition2Open(false)}}>{value}</span>
                                                                            )
                                                                        }) 
                                                                    ):""
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                    </li>
                                    <li className="d-flex justify-content-between align-items-end mb-3">
                                        <div className="bulk-content-lable">
                                            <label>If price range is $1001-$2500:</label>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Margin</label>
                                            <input className="custom-input" type="number" value={condition3Margin} onChange={(e) => setCondition3Margin(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Margin Missing USMP</label>
                                            <input className="custom-input" type="number" value={condition3Margin2} onChange={(e) => setCondition3Margin2(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Quantity</label>
                                            <input className="custom-input" type="number" value={condition3Qty} onChange={(e) => setCondition3Qty(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column">
                                            <div className="dropUp">
                                                <label className="d-block d-md-none">Round</label>
                                                    <div className="custom-select-wrapper d-flex align-items-center mb-0">
                                                        <div className={isCondition3Open ? "custom-selectDrop open":"custom-selectDrop "}>
                                                            <div className="custom-select__trigger" onClick={()=>setIsCondition3Open(!isCondition3Open)}>
                                                                <span>{condition3DropDownValue ? condition3DropDownValue : ""}</span>
                                                                <div className="arrow">
                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="custom-options">
                                                                {
                                                                    roundList && roundList.length>0 ? (
                                                                        roundList.map((value, index) => {
                                                                            return (
                                                                                <span className={condition3DropDownValue === value ? "custom-option selected":"custom-option"} onClick={() => { setCondition3DropDownValue(value); setIsCondition3Open(false)}}>{value}</span>
                                                                            )
                                                                        }) 
                                                                    ):""
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                    </li>
                                    <li className="d-flex justify-content-between align-items-end mb-3">
                                        <div className="bulk-content-lable">
                                            <label>If price range is $2501-$5000:</label>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Margin</label>
                                            <input className="custom-input" type="number" value={condition4Margin} onChange={(e) => setCondition4Margin(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Margin Missing USMP</label>
                                            <input className="custom-input" type="number" value={condition4Margin2} onChange={(e) => setCondition4Margin2(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Quantity</label>
                                            <input className="custom-input" type="number" value={condition4Qty} onChange={(e) => setCondition4Qty(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column">
                                            <div className="dropUp">
                                                    <label className="d-block d-md-none">Round</label>
                                                    <div className="custom-select-wrapper d-flex align-items-center mb-0">
                                                        <div className={isCondition4Open ? "custom-selectDrop open":"custom-selectDrop "}>
                                                            <div className="custom-select__trigger" onClick={()=>setIsCondition4Open(!isCondition4Open)}>
                                                                <span>{condition4DropDownValue ? condition4DropDownValue : ""}</span>
                                                                <div className="arrow">
                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="custom-options">
                                                                {
                                                                    roundList && roundList.length>0 ? (
                                                                        roundList.map((value, index) => {
                                                                            return (
                                                                                <span className={condition4DropDownValue === value ? "custom-option selected":"custom-option"} onClick={() => { setCondition4DropDownValue(value); setIsCondition4Open(false)}}>{value}</span>
                                                                            )
                                                                        }) 
                                                                    ):""
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                    </li>
                                    <li className="d-flex justify-content-between align-items-end mb-3">
                                        <div className="bulk-content-lable">
                                            <label>If price range is $5001-$10000:</label>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Margin</label>
                                            <input className="custom-input" type="number" value={condition5Margin} onChange={(e) => setCondition5Margin(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Margin Missing USMP</label>
                                            <input className="custom-input" type="number" value={condition5Margin2} onChange={(e) => setCondition5Margin2(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Quantity</label>
                                            <input className="custom-input" type="number" value={condition5Qty} onChange={(e) => setCondition5Qty(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column">
                                            <div className="dropUp">
                                                    <label className="d-block d-md-none">Round</label>
                                                    <div className="custom-select-wrapper d-flex align-items-center mb-0">
                                                        <div className={isCondition5Open ? "custom-selectDrop open":"custom-selectDrop "}>
                                                            <div className="custom-select__trigger" onClick={()=>setIsCondition5Open(!isCondition5Open)}>
                                                                <span>{condition5DropDownValue ? condition5DropDownValue : ""}</span>
                                                                <div className="arrow">
                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="custom-options">
                                                                {
                                                                    roundList && roundList.length>0 ? (
                                                                        roundList.map((value, index) => {
                                                                            return (
                                                                                <span className={condition5DropDownValue === value ? "custom-option selected":"custom-option"} onClick={() => { setCondition5DropDownValue(value); setIsCondition5Open(false)}}>{value}</span>
                                                                            )
                                                                        }) 
                                                                    ):""
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                    </li>
                                    <li className="d-flex justify-content-between align-items-end mb-3">
                                        <div className="bulk-content-lable">
                                            <label>If price is more than $10000:</label>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                                <label className="d-block d-md-none">Margin</label>
                                            <input className="custom-input"type="number" value={condition6Margin} onChange={(e) => setCondition6Margin(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Margin Missing USMP</label>
                                            <input className="custom-input" type="number" value={condition6Margin2} onChange={(e) => setCondition6Margin2(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-block d-md-none">Quantity</label>
                                            <input className="custom-input" type="number" value={condition6Qty} onChange={(e) => setCondition6Qty(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column">
                                            <div className="dropUp">
                                                    <label className="d-block d-md-none">Round</label>
                                                    <div className="custom-select-wrapper d-flex align-items-center mb-0">
                                                        <div className={isCondition6Open ? "custom-selectDrop open":"custom-selectDrop "}>
                                                            <div className="custom-select__trigger" onClick={()=>setIsCondition6Open(!isCondition6Open)}>
                                                                <span>{condition6DropDownValue ? condition6DropDownValue : ""}</span>
                                                                <div className="arrow">
                                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                            <div className="custom-options">
                                                                {
                                                                    roundList && roundList.length>0 ? (
                                                                        roundList.map((value, index) => {
                                                                            return (
                                                                                <span className={condition6DropDownValue === value ? "custom-option selected":"custom-option"} onClick={() => { setCondition6DropDownValue(value); setIsCondition6Open(false)}}>{value}</span>
                                                                            )
                                                                        }) 
                                                                    ):""
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        
        <Accordion defaultActiveKey="0" className="mb-2">
            <Card>
                <Card.Header>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        Recommendation Section 
                    </Accordion.Toggle>
                    <Button className="reset-btn" onClick={() => handleFilterAPI(false,"",1, winePriceMin, winePriceMax)}>Reset</Button>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                <Card.Body>
                <div className="bulk-publish-block my-3">
                    <div className="bulk-block">
                        <div className="bulk-row d-flex">
                            <div className="bulk-content bulk-content-recommendation">
                                <ul className="m-0 p-0">
                                    <li className="d-flex justify-content-between align-items-end mb-3">
                                        <div className="bulk-content-lable">
                                            <label>Bottle Price:</label>
                                        </div>
                                        <div className="bulk-content-value bulk-content-value-drop d-flex align-items-center flex-column">
                                            <div className="dropUp mr-2 invisible">
                                                <div className="custom-select-wrapper d-flex align-items-center mb-0">
                                                    <div className="custom-selectDrop">
                                                        <div className="custom-select__trigger" onClick={()=>{setIsCriticOpen(!isCriticOpen); handleCloseDropDowns('critic')}}>
                                                            <span>{criticDropDownValue ? criticDropDownValue : "All"}</span>
                                                            <div className="arrow">
                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="custom-options">
                                                            {
                                                                criticList && criticList.length>0 ? (
                                                                    criticList.map((value, index) => {
                                                                        return (
                                                                            <span className={criticDropDownValue === value ? "custom-option selected":"custom-option"} onClick={() => { setCriticDropDownValue(value); setIsCriticOpen(false)}}>{value}</span>
                                                                        )
                                                                    }) 
                                                                ):""
                                                            }
                                                            <span className={criticDropDownValue === "" ? "custom-option selected":"custom-option"} onClick={() => { setCriticDropDownValue(""); setIsCriticOpen(false)}}>{"All"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label> Min</label>
                                            <input className="custom-input" type="number" value={minBP} onChange={(e) => setMinBP(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label>Max</label>
                                            <input className="custom-input" type="number" value={maxBP} onChange={(e) => setMaxBP(e.target.value)}></input>
                                        </div>
                                    </li>
                                    <li className="d-flex justify-content-between align-items-end mb-3">
                                        <div className="bulk-content-lable">
                                            <label>Critic Score Range:</label>
                                        </div>
                                        <div className="bulk-content-value bulk-content-value-drop d-flex align-items-center flex-column">
                                            <div className="dropUp mr-2">
                                                <div className="custom-select-wrapper d-flex align-items-center mb-0">
                                                    <div className={isCriticOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                        <div className="custom-select__trigger" onClick={()=>{setIsCriticOpen(!isCriticOpen);handleCloseDropDowns('critic')}}>
                                                            <span>{criticDropDownValue ? criticDropDownValue : "All"}</span>
                                                            <div className="arrow">
                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="custom-options">
                                                            {
                                                                criticList && criticList.length>0 ? (
                                                                    criticList.map((value, index) => {
                                                                        return (
                                                                            <span className={criticDropDownValue === value ? "custom-option selected":"custom-option"} onClick={() => { setCriticDropDownValue(value); setIsCriticOpen(false)}}>{value}</span>
                                                                        )
                                                                    }) 
                                                                ):""
                                                            }
                                                            <span className={criticDropDownValue === "" ? "custom-option selected":"custom-option"} onClick={() => { setCriticDropDownValue(""); setIsCriticOpen(false)}}>{"All"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-md-none">Min</label>
                                            <input className="custom-input" type="number" value={minCSR} onChange={(e) => setMinCSR(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-md-none">Max</label>
                                            <input className="custom-input" type="number" value={maxCSR} onChange={(e) => setMaxCSR(e.target.value)}></input>
                                        </div>
                                    </li>
                                    <li className="d-flex justify-content-between align-items-end mb-3">
                                        <div className="bulk-content-lable">
                                            <label>Drinking dates:</label>
                                        </div>
                                        <div className="bulk-content-value bulk-content-value-drop d-flex align-items-center flex-column">
                                            <div className="dropUp mr-2">
                                                <div className="custom-select-wrapper d-flex align-items-center mb-0">
                                                    <div className={isDrinkingOpen ? "custom-selectDrop open":"custom-selectDrop "}>
                                                        <div className="custom-select__trigger" onClick={()=>{setIsDrinkingOpen(!isDrinkingOpen);handleCloseDropDowns('drinking')}}>
                                                            <span>{drinkingDropDownValue ? drinkingDropDownValue : "All"}</span>
                                                            <div className="arrow">
                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="custom-options">
                                                            {
                                                                drinkList && drinkList.length>0 ? (
                                                                    drinkList.map((value, index) => {
                                                                        return (
                                                                            <span className={drinkingDropDownValue === value ? "custom-option selected":"custom-option"} onClick={() => { setDrinkingDropDownValue(value); setIsDrinkingOpen(false)}}>{value}</span>
                                                                        )
                                                                    }) 
                                                                ):""
                                                            }
                                                            <span className={drinkingDropDownValue === "" ? "custom-option selected":"custom-option"} onClick={() => { setDrinkingDropDownValue(""); setIsDrinkingOpen(false)}}>{"All"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-md-none">Min</label>
                                            <input className="custom-input" type="number" value={minDD} onChange={(e) => setMinDD(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-md-none">Max</label>
                                            <input className="custom-input" type="number" value={maxDD} onChange={(e) => setMaxDD(e.target.value)}></input>
                                        </div>
                                    </li>
                                    <li className="d-flex justify-content-between align-items-end mb-3">
                                        <div className="bulk-content-lable">
                                            <label>Alcohol%:</label>
                                        </div>
                                        <div className="bulk-content-value bulk-content-value-drop d-flex align-items-center flex-column">
                                            <div className="dropUp mr-2 invisible">
                                                <div className="custom-select-wrapper d-flex align-items-center mb-0">
                                                    <div className="custom-selectDrop">
                                                        <div className="custom-select__trigger" onClick={()=>{setIsCriticOpen(!isCriticOpen); handleCloseDropDowns('critic')}}>
                                                            <span>{criticDropDownValue ? criticDropDownValue : "Select a critic"}</span>
                                                            <div className="arrow">
                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M10 20C4.477 20 0 15.523 0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20ZM10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18ZM10 11.828L13.536 8.293C13.7246 8.11084 13.9772 8.01005 14.2394 8.01233C14.5016 8.0146 14.7524 8.11977 14.9378 8.30518C15.1232 8.49059 15.2284 8.7414 15.2307 9.0036C15.233 9.2658 15.1322 9.5184 14.95 9.707L10.707 13.95C10.5195 14.1375 10.2652 14.2428 10 14.2428C9.73484 14.2428 9.48053 14.1375 9.293 13.95L5.05 9.707C4.86784 9.5184 4.76705 9.2658 4.76933 9.0036C4.7716 8.7414 4.87677 8.49059 5.06218 8.30518C5.24759 8.11977 5.4984 8.0146 5.7606 8.01233C6.0228 8.01005 6.2754 8.11084 6.464 8.293L10 11.828Z" fill="#8D8D8D"/>
                                                                </svg>
                                                            </div>
                                                        </div>
                                                        <div className="custom-options">
                                                            {
                                                                criticList && criticList.length>0 ? (
                                                                    criticList.map((value, index) => {
                                                                        return (
                                                                            <span className={criticDropDownValue === value ? "custom-option selected":"custom-option"} onClick={() => { setCriticDropDownValue(value); setIsCriticOpen(false)}}>{value}</span>
                                                                        )
                                                                    }) 
                                                                ):""
                                                            }
                                                            <span className={criticDropDownValue === "" ? "custom-option selected":"custom-option"} onClick={() => { setCriticDropDownValue(""); setIsCriticOpen(false)}}>{"All"}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-md-none">Min</label>
                                            <input className="custom-input" type="number" value={minAlcohol} onChange={(e) => setMinAlcohol(e.target.value)}></input>
                                        </div>
                                        <div className="bulk-content-value d-flex align-items-center flex-column mx-2">
                                            <label className="d-md-none">Max</label>
                                            <input className="custom-input" type="number" value={maxAlcohol} onChange={(e) => setMaxAlcohol(e.target.value)}></input>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div className="bulk-publish-btn d-flex justify-content-between align-items-start">
                                <div className="publish-btn d-flex align-items-center flex-column">
                                    <Button className="btn" onClick={() => handleUpdateBtn()}>Update</Button>
                                </div>
                                {/* <div className="unpublish-btn">
                                    <Button className="btn" onClick={() => handleUnPublishBtn()}>Unpublish</Button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        

        <div className="select-drop d-flex align-items-center justify-content-end flex-column flex-sm-row">
            <Form.Check name="SelectAll" onChange={(e) => {setSelectAll(e.target.checked); handleAllCheck(e.target.checked)}} checked={selectAll} label={selectAll ? "Deselect All" : "Select All"} id="SelectAll" />
            <div className="bulk-publish-btn bulk-publish-btn-head">
                <div className="d-flex justify-content-sm-between justify-content-center align-items-start flex-wrap flex-sm-nowrap">
                    <div className="publish-btn d-flex align-items-center flex-column mt-2 mt-sm-0">
                        <Button className="btn" onClick={() => handlePublishBtn()}>Publish</Button>
                        
                    </div>
                    <div className="unpublish-btn mt-2 mt-sm-0">
                        <Button className="btn" onClick={() => handleUnPublishBtn()}>Unpublish</Button>
                    </div>
                    <div className="unpublish-btn ml-3 text-nowrap mt-2 mt-sm-0">
                        <Button className="btn" onClick={() => handleRefreshBusinessLogic()}>Refresh Business Logic</Button>
                    </div>
                </div>
                <div className="publish-btn">
                    <span className="error-text-publish">{publishError ? publishError : ""}</span>
                </div>
            </div>
        </div>
        
            <div className="all-customer-wrapper">
                <div className="all-customer-data">
                    <div className="customer-table">
                        <Table responsive>
                            <thead>
                            <tr>
                                <th></th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("PRODUCER")}>Producer</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("NAME")}>Name</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("COUNTRY")}>Country</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("REGION")}>Region</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("SUBREGION")}>Subregion</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("YEAR")}>Year</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("SIZE_VALUE")}>Size</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("PRICE")}>Listed Price</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("QTY")}>Qty Available</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("SALE_PRICE")}>Publish Price</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("SALE_QTY")}>Publish Qty</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("STOCK_SOURCE")}>Stock Source</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("STOCK_TYPE")}>Stock Type</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("ETA")}>ETA</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("USMP")}>Market Price</th>
                                <th className="cursor-pointer" onClick={()=>handleSorting("IS_PUBLISHED")}> Publish</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                                {
                                    search ? (
                                        allPublishDetailList && allPublishDetailList.length > 0 ? (
                                            allPublishDetailList.filter((data) => {
                                                if(
                                                    data.PRODUCER && data.PRODUCER.toLowerCase().includes(search.toLowerCase())||
                                                    data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase())
                                                ) {
                                                    return data;
                                                }
                                            }).map((value, index) => {
                                                return (
                                                    <tr key={index} className={value.color === 1 ? "color-1" :"color-2"}>
                                                        <td>
                                                            {
                                                                value.showSelect ? (
                                                                    <Form.Check checked={value.isSelected===true} onChange={(e) => {handleCheck(value.LWIN18, e.target.checked)}}></Form.Check>
                                                                ): ""
                                                            }
                                                        </td>
                                                        <td>{value.PRODUCER ? value.PRODUCER:"-"}</td>
                                                        <td>{value.NAME ? value.NAME:"-"}</td>
                                                        <td>{value.COUNTRY ? value.COUNTRY:"-"}</td>
                                                        <td>{value.REGION ? value.REGION:"-"}</td>
                                                        <td>{value.SUBREGION ? value.SUBREGION:"-"}</td>
                                                        <td>{value.YEAR ? value.YEAR:"-"}</td>
                                                        <td>{value.SIZE_VALUE ? value.SIZE_VALUE:"-"}</td>
                                                        <td>{value.PRICE ? value.PRICE:"-"}</td>
                                                        <td>{value.QTY ? value.QTY:"-"}</td>
                                                        <td>{value.SALE_PRICE ? value.SALE_PRICE:"-"}</td>
                                                        <td>{value.SALE_QTY ? value.SALE_QTY:"-"}</td>
                                                        <td>{value.STOCK_SOURCE ? value.STOCK_SOURCE:"-"}</td>
                                                        <td>{value.STOCK_TYPE ? value.STOCK_TYPE:"-"}</td>
                                                        <td>{value.ETA ? value.ETA:"-"}</td>
                                                        <td>{value.USMP ? value.USMP:"-"}</td>
                                                        <td>{value.IS_PUBLISHED && value.IS_PUBLISHED === "0" ? (<span className="not-published-text">No</span>):
                                                            (<span className="published-text">Yes</span>)}
                                                        </td>
                                                        <td>
                                                            <span className="cursor-pointer" onClick={() => {
                                                                setSalePrice(value.SALE_PRICE);
                                                                setEditLwin18(value.LWIN18);
                                                                setSaleID(value.SALE_ID);
                                                                setEditPublishModal(true);
                                                            }}>
                                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M4.03984 15.625C4.08672 15.625 4.13359 15.6203 4.18047 15.6133L8.12266 14.9219C8.16953 14.9125 8.21406 14.8914 8.24688 14.8563L18.182 4.92109C18.2038 4.89941 18.221 4.87366 18.2328 4.8453C18.2445 4.81695 18.2506 4.78656 18.2506 4.75586C18.2506 4.72516 18.2445 4.69477 18.2328 4.66642C18.221 4.63806 18.2038 4.61231 18.182 4.59063L14.2867 0.692969C14.2422 0.648438 14.1836 0.625 14.1203 0.625C14.057 0.625 13.9984 0.648438 13.9539 0.692969L4.01875 10.6281C3.98359 10.6633 3.9625 10.7055 3.95312 10.7523L3.26172 14.6945C3.23892 14.8201 3.24707 14.9493 3.28545 15.071C3.32384 15.1927 3.39132 15.3032 3.48203 15.393C3.63672 15.543 3.83125 15.625 4.03984 15.625ZM5.61953 11.5375L14.1203 3.03906L15.8383 4.75703L7.3375 13.2555L5.25391 13.6234L5.61953 11.5375ZM18.625 17.5938H1.375C0.960156 17.5938 0.625 17.9289 0.625 18.3438V19.1875C0.625 19.2906 0.709375 19.375 0.8125 19.375H19.1875C19.2906 19.375 19.375 19.2906 19.375 19.1875V18.3438C19.375 17.9289 19.0398 17.5938 18.625 17.5938Z" fill="#0085FF"/>
                                                                </svg>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        ) : ("")
                                    )
                                    :
                                    publishDetailList && publishDetailList.length > 0 ? (
                                        publishDetailList.map((value, index) => {
                                            return (
                                                <tr key={index} className={value.color === 1 ? "color-1" :"color-2"}>
                                                     <td>
                                                     {
                                                        value.showSelect ? (
                                                            <Form.Check checked={value.isSelected===true} onChange={(e) => {handleCheck(value.LWIN18, e.target.checked)}}></Form.Check>
                                                        ): ""
                                                    }
                                                     </td>
                                                    <td>{value.PRODUCER ? value.PRODUCER:"-"}</td>
                                                    <td>{value.NAME ? value.NAME:"-"}</td>
                                                    <td>{value.COUNTRY ? value.COUNTRY:"-"}</td>
                                                    <td>{value.REGION ? value.REGION:"-"}</td>
                                                    <td>{value.SUBREGION ? value.SUBREGION:"-"}</td>
                                                    <td>{value.YEAR ? value.YEAR:"-"}</td>
                                                    <td>{value.SIZE_VALUE ? value.SIZE_VALUE:"-"}</td>
                                                    <td>{value.PRICE ? value.PRICE:"-"}</td>
                                                    <td>{value.QTY ? value.QTY:"-"}</td>
                                                    <td>{value.SALE_PRICE ? value.SALE_PRICE:"-"}</td>
                                                    <td>{value.SALE_QTY ? value.SALE_QTY:"-"}</td>
                                                    <td>{value.STOCK_SOURCE ? value.STOCK_SOURCE:"-"}</td>
                                                    <td>{value.STOCK_TYPE ? value.STOCK_TYPE:"-"}</td>
                                                    <td>{value.ETA ? value.ETA:"-"}</td>
                                                    <td>{value.USMP ? value.USMP:"-"}</td>
                                                    <td>{value.IS_PUBLISHED && value.IS_PUBLISHED === "0" ? (<span className="not-published-text">No</span>):
                                                        (<span className="published-text">Yes</span>)}
                                                    </td>
                                                    <td><span onClick={() => {
                                                            setSalePrice(value.SALE_PRICE);
                                                            setEditLwin18(value.LWIN18);
                                                            setSaleID(value.SALE_ID);
                                                            setEditPublishModal(true);
                                                        }}>
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M4.03984 15.625C4.08672 15.625 4.13359 15.6203 4.18047 15.6133L8.12266 14.9219C8.16953 14.9125 8.21406 14.8914 8.24688 14.8563L18.182 4.92109C18.2038 4.89941 18.221 4.87366 18.2328 4.8453C18.2445 4.81695 18.2506 4.78656 18.2506 4.75586C18.2506 4.72516 18.2445 4.69477 18.2328 4.66642C18.221 4.63806 18.2038 4.61231 18.182 4.59063L14.2867 0.692969C14.2422 0.648438 14.1836 0.625 14.1203 0.625C14.057 0.625 13.9984 0.648438 13.9539 0.692969L4.01875 10.6281C3.98359 10.6633 3.9625 10.7055 3.95312 10.7523L3.26172 14.6945C3.23892 14.8201 3.24707 14.9493 3.28545 15.071C3.32384 15.1927 3.39132 15.3032 3.48203 15.393C3.63672 15.543 3.83125 15.625 4.03984 15.625ZM5.61953 11.5375L14.1203 3.03906L15.8383 4.75703L7.3375 13.2555L5.25391 13.6234L5.61953 11.5375ZM18.625 17.5938H1.375C0.960156 17.5938 0.625 17.9289 0.625 18.3438V19.1875C0.625 19.2906 0.709375 19.375 0.8125 19.375H19.1875C19.2906 19.375 19.375 19.2906 19.375 19.1875V18.3438C19.375 17.9289 19.0398 17.5938 18.625 17.5938Z" fill="#0085FF"/>
                                                            </svg>
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    ) : ("")
                                }
                                {
                                    loadingData ? (
                                        <tr>
                                            <td colSpan="15" className="text-center">Loading...</td>
                                        </tr>
                                    ) :
                                    ("")
                                }
                                {
                                    publishDetailList && publishDetailList.length===0 && loadingData===false && !search? (
                                        <tr>
                                            <td colSpan="15" className="text-center">No Data found!</td>
                                        </tr>
                                    ) :
                                    ("")
                                }
                                {
                                    search ? (allPublishDetailList ? (allPublishDetailList.filter((data) => {
                                    if(
                                        data.PRODUCER && data.PRODUCER.toLowerCase().includes(search.toLowerCase())||
                                        data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase())
                                    ) {
                                        return data;
                                    }
                                    }).length>0) ? "":
                                    (<tr>
                                        <td colSpan="15" className="text-center">No Data Found!</td>
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
                                allPublishDetailList && allPublishDetailList.length > 0 ? (
                                    allPublishDetailList.filter((data) => {
                                        if(
                                            data.PRODUCER && data.PRODUCER.toLowerCase().includes(search.toLowerCase())||
                                            data.NAME && data.NAME.toLowerCase().includes(search.toLowerCase())
                                        ) {
                                            return data;
                                        }
                                    }).map((value, index) => {
                                        return (
                                            <div className="mobile-table-list" key={index}>
                                                <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                    <div className="th">
                                                    {
                                                        value.showSelect ? (
                                                            <Form.Check checked={value.isSelected===true} onChange={(e) => {handleCheck(value.LWIN18, e.target.checked)}}></Form.Check>
                                                        ): ""
                                                    }
                                                    </div>
                                                    <div className="th">
                                                        <span onClick={() => {
                                                            setSalePrice(value.SALE_PRICE);
                                                            setEditLwin18(value.LWIN18);
                                                            setSaleID(value.SALE_ID);
                                                            setEditPublishModal(true);
                                                        }}>
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M4.03984 15.625C4.08672 15.625 4.13359 15.6203 4.18047 15.6133L8.12266 14.9219C8.16953 14.9125 8.21406 14.8914 8.24688 14.8563L18.182 4.92109C18.2038 4.89941 18.221 4.87366 18.2328 4.8453C18.2445 4.81695 18.2506 4.78656 18.2506 4.75586C18.2506 4.72516 18.2445 4.69477 18.2328 4.66642C18.221 4.63806 18.2038 4.61231 18.182 4.59063L14.2867 0.692969C14.2422 0.648438 14.1836 0.625 14.1203 0.625C14.057 0.625 13.9984 0.648438 13.9539 0.692969L4.01875 10.6281C3.98359 10.6633 3.9625 10.7055 3.95312 10.7523L3.26172 14.6945C3.23892 14.8201 3.24707 14.9493 3.28545 15.071C3.32384 15.1927 3.39132 15.3032 3.48203 15.393C3.63672 15.543 3.83125 15.625 4.03984 15.625ZM5.61953 11.5375L14.1203 3.03906L15.8383 4.75703L7.3375 13.2555L5.25391 13.6234L5.61953 11.5375ZM18.625 17.5938H1.375C0.960156 17.5938 0.625 17.9289 0.625 18.3438V19.1875C0.625 19.2906 0.709375 19.375 0.8125 19.375H19.1875C19.2906 19.375 19.375 19.2906 19.375 19.1875V18.3438C19.375 17.9289 19.0398 17.5938 18.625 17.5938Z" fill="#0085FF"/>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <div className="th">
                                                        <label onClick={()=>handleSorting("ETA")}>ETA</label>
                                                        <span>{value.ETA ? value.ETA: ""}</span>
                                                    </div>
                                                </div>
                                                <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                    <div className="th">
                                                        <label onClick={()=>handleSorting("PRODUCER")}>Producer</label>
                                                        <span>{value.PRODUCER ? value.PRODUCER: ""}</span>
                                                    </div>
                                                    <div className="th">
                                                        <label onClick={()=>handleSorting("NAME")}>Name</label>
                                                        <span>{value.NAME ? value.NAME: ""}</span>
                                                    </div>
                                                    <div className="th">
                                                        <label onClick={()=>handleSorting("COUNTRY")}>Country</label>
                                                        <span>{value.COUNTRY ? value.COUNTRY: ""}</span>
                                                    </div>
                                                </div>
                                                <div className="mobile-table-td">
                                                    <div className="mobile-table-td-row">
                                                        <div className="td-list d-flex justify-content-between">
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("REGION")}>Region</label>
                                                                <span><strong>{value.REGION ? value.REGION : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("SUBREGION")}>Subregion</label>
                                                                <span><strong>{value.SUBREGION ? value.SUBREGION : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("YEAR")}>Year</label>
                                                                <span><strong>{value.YEAR ? value.YEAR : "-"}</strong></span>
                                                            </div>
                                                        </div>
                                                        <div className="td-list d-flex justify-content-between">
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("SIZE_VALUE")}>Size</label>
                                                                <span><strong>{value.SIZE_VALUE ? value.SIZE_VALUE : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("PRICE")}>Listed Price</label>
                                                                <span><strong>{value.PRICE ? value.PRICE : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("QTY")}>Qty</label>
                                                                <span><strong>{value.QTY ? value.QTY : "-"}</strong></span>
                                                            </div>
                                                        </div>
                                                        <div className="td-list d-flex justify-content-between">
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("SALE_PRICE")}>Publish Price</label>
                                                                <span><strong>{value.SALE_PRICE ? value.SALE_PRICE : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("SALE_QTY")}>Publish Qty</label>
                                                                <span><strong>{value.SALE_QTY ? value.SALE_QTY : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("STOCK_TYPE")}>Stock Type</label>
                                                                <span><strong>{value.STOCK_TYPE ? value.STOCK_TYPE : "-"}</strong></span>
                                                            </div>
                                                        </div>
                                                        <div className="td-list d-flex justify-content-between">
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("USMP")}>Market Price</label>
                                                                <span><strong>{value.USMP ? value.USMP : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("STOCK_SOURCE")}>Stock Source</label>
                                                                <span><strong>{value.STOCK_SOURCE ? value.STOCK_SOURCE : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("IS_PUBLISHED")}>Publish</label>
                                                                {
                                                                    value.IS_PUBLISHED && value.IS_PUBLISHED==="0" ? (
                                                                        <span><strong>No</strong></span>
                                                                    ) : (
                                                                        <span><strong>Yes</strong></span>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : ("")
                                    )
                                    :
                                    publishDetailList && publishDetailList.length > 0 ? (
                                        publishDetailList.map((value, index) => {
                                            return (
                                                <div className="mobile-table-list" key={index}>
                                                <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                    <div className="th">
                                                    {
                                                        value.showSelect ? (
                                                            <Form.Check checked={value.isSelected===true} onChange={(e) => {handleCheck(value.LWIN18, e.target.checked)}}></Form.Check>
                                                        ): ""
                                                    }
                                                    </div>
                                                    <div className="th">
                                                        <span onClick={() => {
                                                            setSalePrice(value.SALE_PRICE);
                                                            setEditLwin18(value.LWIN18);
                                                            setSaleID(value.SALE_ID);
                                                            setEditPublishModal(true);
                                                        }}>
                                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M4.03984 15.625C4.08672 15.625 4.13359 15.6203 4.18047 15.6133L8.12266 14.9219C8.16953 14.9125 8.21406 14.8914 8.24688 14.8563L18.182 4.92109C18.2038 4.89941 18.221 4.87366 18.2328 4.8453C18.2445 4.81695 18.2506 4.78656 18.2506 4.75586C18.2506 4.72516 18.2445 4.69477 18.2328 4.66642C18.221 4.63806 18.2038 4.61231 18.182 4.59063L14.2867 0.692969C14.2422 0.648438 14.1836 0.625 14.1203 0.625C14.057 0.625 13.9984 0.648438 13.9539 0.692969L4.01875 10.6281C3.98359 10.6633 3.9625 10.7055 3.95312 10.7523L3.26172 14.6945C3.23892 14.8201 3.24707 14.9493 3.28545 15.071C3.32384 15.1927 3.39132 15.3032 3.48203 15.393C3.63672 15.543 3.83125 15.625 4.03984 15.625ZM5.61953 11.5375L14.1203 3.03906L15.8383 4.75703L7.3375 13.2555L5.25391 13.6234L5.61953 11.5375ZM18.625 17.5938H1.375C0.960156 17.5938 0.625 17.9289 0.625 18.3438V19.1875C0.625 19.2906 0.709375 19.375 0.8125 19.375H19.1875C19.2906 19.375 19.375 19.2906 19.375 19.1875V18.3438C19.375 17.9289 19.0398 17.5938 18.625 17.5938Z" fill="#0085FF"/>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <div className="th">
                                                        <label onClick={()=>handleSorting("ETA")}>ETA</label>
                                                        <span>{value.ETA ? value.ETA: ""}</span>
                                                    </div>
                                                </div>
                                                <div className="mobile-table-th d-flex align-items-center justify-content-between">
                                                    <div className="th">
                                                        <label onClick={()=>handleSorting("PRODUCER")}>Producer</label>
                                                        <span>{value.PRODUCER ? value.PRODUCER: ""}</span>
                                                    </div>
                                                    <div className="th">
                                                        <label onClick={()=>handleSorting("NAME")}>Name</label>
                                                        <span>{value.NAME ? value.NAME: ""}</span>
                                                    </div>
                                                    <div className="th">
                                                        <label onClick={()=>handleSorting("COUNTRY")}>Country</label>
                                                        <span>{value.COUNTRY ? value.COUNTRY: ""}</span>
                                                    </div>
                                                </div>
                                                <div className="mobile-table-td">
                                                    <div className="mobile-table-td-row">
                                                        <div className="td-list d-flex justify-content-between">
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("REGION")}>Region</label>
                                                                <span><strong>{value.REGION ? value.REGION : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("SUBREGION")}>Subregion</label>
                                                                <span><strong>{value.SUBREGION ? value.SUBREGION : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("YEAR")}>Year</label>
                                                                <span><strong>{value.YEAR ? value.YEAR : "-"}</strong></span>
                                                            </div>
                                                        </div>
                                                        <div className="td-list d-flex justify-content-between">
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("SIZE_VALUE")}>Size</label>
                                                                <span><strong>{value.SIZE_VALUE ? value.SIZE_VALUE : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("PRICE")}>Listed Price</label>
                                                                <span><strong>{value.PRICE ? value.PRICE : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("QTY")}>Qty</label>
                                                                <span><strong>{value.QTY ? value.QTY : "-"}</strong></span>
                                                            </div>
                                                        </div>
                                                        <div className="td-list d-flex justify-content-between">
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("SALE_PRICE")}>Publish Price</label>
                                                                <span><strong>{value.SALE_PRICE ? value.SALE_PRICE : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("SALE_QTY")}>Publish Qty</label>
                                                                <span><strong>{value.SALE_QTY ? value.SALE_QTY : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("STOCK_TYPE")}>Stock Type</label>
                                                                <span><strong>{value.STOCK_TYPE ? value.STOCK_TYPE : "-"}</strong></span>
                                                            </div>
                                                        </div>
                                                        <div className="td-list d-flex justify-content-between">
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("USMP")}>Market Price</label>
                                                                <span><strong>{value.USMP ? value.USMP : "-"}</strong></span>
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("IS_PUBLISHED")}>Publish</label>
                                                                {
                                                                    value.IS_PUBLISHED && value.IS_PUBLISHED==="0" ? (
                                                                        <span><strong>No</strong></span>
                                                                    ) : (
                                                                        <span><strong>Yes</strong></span>
                                                                    )
                                                                }
                                                            </div>
                                                            <div className="td">
                                                                <label onClick={()=>handleSorting("STOCK_SOURCE")}>Stock Source</label>
                                                                <span><strong>{value.STOCK_SOURCE ? value.STOCK_SOURCE : "-"}</strong></span>
                                                            </div>
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
                                    publishList && publishList.length===0 && loadingData===false && !search? (
                                        <div className="mobile-table-list text-center">
                                            No Data Found!
                                        </div>
                                    ) :
                                    ("")
                                }
                                {
                                    search ? (allPublishDetailList ? (allPublishDetailList.filter((data) => {
                                    if(
                                        data.PRODUCER && data.PRODUCER.toLowerCase().includes(search.toLowerCase())||
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
                                                onClick={()=>{
                                                    if(recommend) {
                                                        handleFilterAPI(true, recommendBody, currentBackendPage-1, winePriceMin, winePriceMax)
                                                    } else {
                                                        handleFilterAPI(false, "", currentBackendPage-1, winePriceMin, winePriceMax)
                                                    }
                                                }}
                                                disabled={loadingData || currentBackendPage===1}>{'<PREV'}
                                        </Button>
                                    </div>
                                    <div className="d-flex">
                                    <div className="table-prev">
                                        <Button
                                                className="btn-next-prev"
                                                variant="link"
                                                onClick={()=>handleNavigation('prev')}
                                                disabled={loadingData || initialPage===0}>{'< '}
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
                                            disabled={loadingData || pageNumber<=lastPage}>{" >"}
                                        </Button>
                                    </div>
                                    </div>
                                    <div className="table-prev">
                                        <Button
                                            className="btn-next-prev"
                                            variant="link"
                                            onClick={()=>{
                                                if(recommend) {
                                                    handleFilterAPI(true, recommendBody, currentBackendPage+1, winePriceMin, winePriceMax)
                                                } else {
                                                    handleFilterAPI(false, "", currentBackendPage+1, winePriceMin, winePriceMax)
                                                }
                                            }}
                                            disabled={loadingData || currentBackendPage>=totalBackendPages}>{"NEXT>"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    {
                        search || (!search && pageNumber.length==0)? "" : 
                        (
                            <div className="customer-table-pagination publish-wine d-block d-md-none">
                                <div className="table-pagination-row d-flex justify-content-between">
                                    <div className="table-prev">
                                        <Button
                                                className="btn-next-prev"
                                                variant="link"
                                                onClick={()=>{
                                                    if(recommend) {
                                                        handleFilterAPI(true, recommendBody, currentBackendPage-1, winePriceMin, winePriceMax)
                                                    } else {
                                                        handleFilterAPI(false, "", currentBackendPage-1, winePriceMin, winePriceMax)
                                                    }
                                                }}
                                                disabled={loadingData || currentBackendPage===1}>{'<PREV'}
                                        </Button>
                                    </div>
                                    <div className="table-prev">
                                        <Button
                                                className="btn-next-prev"
                                                variant="link"
                                                onClick={()=>handleMobNavigation('prev')}
                                                disabled={loadingData || initialPage===0}>{'< '}
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
                                            disabled={loadingData || pageNumber<=lastPage}>{" >"}
                                        </Button>
                                    </div>
                                    <div className="table-prev">
                                        <Button
                                            className="btn-next-prev"
                                            variant="link"
                                            onClick={()=>{
                                                if(recommend) {
                                                    handleFilterAPI(true, recommendBody, currentBackendPage+1, winePriceMin, winePriceMax)
                                                } else {
                                                    handleFilterAPI(false, "", currentBackendPage+1, winePriceMin, winePriceMax)
                                                }
                                            }}
                                            disabled={loadingData || currentBackendPage>=totalBackendPages}>{"NEXT>"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    </div>
                </div>
                <Modal show={publishModal}
                    onHide={() => setPublishModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>WINE PUBLISH</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="change-address-body">
                            <div className="change-address-wrapper">
                                <div className="change-address-list d-flex align-items-center street-filed">
                                    <label></label>
                                    <span className="error-text">{error}</span>
                                    <span className="success-text">{success}</span>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="button" onClick = {() => setPublishModal(false)}className="save-btn">OK</Button>
                    </Modal.Footer>
                </Modal>
                <SessionModal show={isSessionModal} onHide={() => setIsSessionModal(false)} message={sessionMessage}/>
                <Modal show={editPublishModal}
                       onHide={() => setEditPublishModal(false)} className="custom-modal user-updated-modal">
                    <Modal.Header closeButton>
                        <Modal.Title>EDIT PUBLISH DETAILS</Modal.Title>
                    </Modal.Header>
                    <form onSubmit={(e) => handleEditPublish(e)}>
                        <Modal.Body>
                            <div className="change-address-body">
                                <div className="change-address-wrapper">
                                    <div className="change-address-list d-flex align-items-center street-filed">
                                        <label>Publish Price:</label>
                                        <input type="text" className="text-input" value = {salePrice?salePrice:""} onChange = {(e) => {setError(""); setSuccess(""); setSalePrice(e.target.value)}} required></input>
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
                
                {
                    isSpinner ? (<>
                    <div className="spinner-hide-show"><Spinner animation="border" variant="primary" /></div></>) : ""
                }
        </div>
    )
};

export default connect(null,{logout})(Publish);
