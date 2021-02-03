// import _ from 'lodash';
import {
    SET_CURRENT_USER, 
    SET_OTP_TYPE, 
    SET_USER_ROLE, 
    SET_ACCOUNT_ID, 
    SET_OTP, 
    SET_ACCOUNT_HOLDER,
    SET_INVESTMENT_CUSTOMER,
    SET_WHOAMI,
    SET_ROUTE,
    CLEAR_SESSION,
    SET_SEARCH, 
    FETCH_CUSTOMER,
    FETCH_TRANSACTION,
    SET_USER_REGION,
    SET_USER_ACCOUNT, 
    SET_GLOBAL_DATA,
    SET_INVOICE_DATA
} from '../Actions/types';

const initialState = {
    isAuthenticated: false,
    isVerified:false,
    isPasswordReset:false,
    user: {},
    type:"",
    role:"",
    account_id:"",
    otp:"",
    holder_id:"",
    investment_customer_list:"",
    whoami: "",
    route:"",
    search:"",
    fetch:true,
    fetchTransaction:true,
    userRegion:"",
    userAccount:"",
    data:"",
    invoiceData:""
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_USER: return {
            ...state,
            isAuthenticated: action.user.isLoggedIn,
            user: action.user.id,
            isVerified: action.user.isVerified,
            isPasswordReset: action.user.isPasswordReset
        }
        case SET_OTP_TYPE: return {
            ...state,
            type: action.user.type
        }
        case SET_USER_ROLE: return {
            ...state,
            role: action.user.role
        }
        case SET_ACCOUNT_ID: return {
            ...state,
            account_id: action.user.accountId
        }
        case SET_OTP: return {
            ...state,
            otp: action.user.otp
        }
        case SET_ACCOUNT_HOLDER: return {
            ...state,
            holder_id: action.user.holder
        }
        case SET_INVESTMENT_CUSTOMER: return {
            ...state,
            investment_customer_list: action.user.investment_customer_list
        }
        case SET_WHOAMI: return {
            ...state,
            whoami: action.user.whoami
        }
        case SET_ROUTE: return {
            ...state,
            route: action.user.route
        }
        case SET_SEARCH: return {
            ...state,
            search: action.user.search
        }
        case CLEAR_SESSION: return {
            ...state,
        }
        case FETCH_CUSTOMER: return {
            ...state,
            fetch: action.user.fetch
        }
        case FETCH_TRANSACTION: return {
            ...state,
            fetchTransaction: action.user.fetchTransaction
        }
        case SET_USER_REGION: return {
            ...state,
            userRegion: action.user.userRegion
        }
        case SET_USER_ACCOUNT: return {
            ...state,
            userRegion: action.user.userAccount
        }
        case SET_GLOBAL_DATA: return {
            ...state,
            data: action.user.data
        }
        case SET_INVOICE_DATA: return {
            ...state,
            invoiceData: action.user.data
        }
        default: return state
    }
}

export default reducer;