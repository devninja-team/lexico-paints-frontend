// Action here
import axios from 'axios';
import setAuthorizationToken from "../AuthHeaders";
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
    SET_GLOBAL_SEARCH,
    SET_USER_REGION,
    SET_USER_ACCOUNT,
    SET_GLOBAL_DATA,
    SET_INVOICE_DATA
} from "./types";

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user : {
            isLoggedIn: user.isLoggedIn,
            id: user.id,
            isVerified: user.isVerified,
            isPasswordReset : user.isPasswordReset
        }
    }
}

export function setOtpType(user) {
    return {
        type: SET_OTP_TYPE,
        user : {
            type: user.type,
        }
    }
}
export function setUserRole(user) {
    return {
        type: SET_USER_ROLE,
        user : {
            role: user.role
        }
    }
}
export function setAccountId(user) {
    return {
        type: SET_ACCOUNT_ID,
        user : {
            accountId: user.accountId
        }
    }
}
export function setOtp(user) {
    return {
        type: SET_OTP,
        user : {
            otp: user.otp,
        }
    }
}
export function setAccountHolder(user) {
    return {
        type: SET_ACCOUNT_HOLDER,
        user: {
            holder:user.holder
        }
    }
}
export function setInvestmentCustomerList(user) {
    return {
        type: SET_INVESTMENT_CUSTOMER,
        user: {
            investment_customer_list:user.investment_customer_list
        }
    }
}
export function setWhoAmI(user) {
    return {
        type: SET_WHOAMI,
        user: {
            whoami:user.whoami
        }
    }
}
export function setRoute(user) {
    return {
        type: SET_ROUTE,
        user: {
            route:user.route
        }
    }
}
export function setSearch(user) {
    return {
        type: SET_SEARCH,
        user: {
            search:user.search
        }
    }
}
export function fetchCustomer(user) {
    return {
        type: FETCH_CUSTOMER,
        user: {
            fetch:user.fetch
        }
    }
}
export function fetchTransactionInfo(user) {
    return {
        type: FETCH_TRANSACTION,
        user: {
            fetchTransaction:user.fetchTransaction
        }
    }
}
export function setUserRegion(user) {
    return {
        type: SET_USER_REGION,
        user: {
            userRegion:user.region
        }
    }
}
export function setUserAccount(user) {
    return {
        type: SET_USER_ACCOUNT,
        user: {
            userRegion:user.userAccount
        }
    }
}
export function setGlobalData(user) {
    return {
        type: SET_GLOBAL_DATA,
        user: {
            data:user.data
        }
    }
}
export function setInvoiceData(user) {
    return {
        type: SET_INVOICE_DATA,
        user: {
            data:user.data
        }
    }
}
export function setSession(user) {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminCode');
    localStorage.removeItem('adminRole');
    localStorage.removeItem("whoami");
    localStorage.removeItem("customer_id");
    localStorage.removeItem("customer_type");
    localStorage.removeItem("transaction_id");
    localStorage.removeItem("email-id");
    localStorage.removeItem("global_search");
    localStorage.removeItem("region");
    localStorage.removeItem("route-role");
    localStorage.removeItem("vendor_inventory");
    // window.location.href="/";
    return {
        type: CLEAR_SESSION,
    }
}
export function logout() {
    return dispatch => {
        axios.post('/auth/logout',{}).then((res)=> {
            if(res.data.status === 200) {
                // localStorage.removeItem('jwtToken');
                // localStorage.removeItem('user');
                // localStorage.removeItem('role');
                setAuthorizationToken("","false","7PHs6U33kX","");
                dispatch(setCurrentUser({isLoggedIn: false,id:'',isVerified: false,isPasswordReset: false}));
                dispatch(setUserRole({role:" "}));
                // document.cookie = "id="
                if(localStorage.role === "super_admin" || localStorage.role === "admin") {
                    // document.cookie = "customer_id=0;path=/;";
                    // document.cookie = "transaction_id=0;path=/individualtrans;";
                    localStorage.removeItem("customer_id");
                    localStorage.removeItem("transaction_id");
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminCode');
                    localStorage.removeItem('adminRole');
                    localStorage.removeItem("whoami");
                    localStorage.removeItem("email-id");
                    localStorage.removeItem("customer_type");
                    localStorage.removeItem("global_search");
                    localStorage.removeItem("region");
                    localStorage.removeItem("route-role");
                    localStorage.removeItem("vendor_inventory");
                    window.location.href="/";
                }
                else if(localStorage.role === "user" && localStorage.adminCode && localStorage.adminToken && localStorage.adminRole) {
                    localStorage.user = localStorage.adminCode;
                    localStorage.jwtToken = localStorage.adminToken;
                    localStorage.role = localStorage.adminRole;
                    window.location.href="/customer";
                }
                else {
                    localStorage.removeItem('jwtToken');
                    localStorage.removeItem('user');
                    localStorage.removeItem('role');
                    localStorage.removeItem("customer_id");
                    localStorage.removeItem("transaction_id");
                    localStorage.removeItem("email-id");
                    localStorage.removeItem("customer_type");
                    localStorage.removeItem("global_search");
                    localStorage.removeItem("region");
                    window.location.href="/";                    
                }
                
            }
        }).catch((error) => {
            console.log('error',error);
            dispatch(setSession())
        })
    }
}
export function login(data) {
    return dispatch => {
        return axios.post('/auth/login',data, {
            headers: {
                'Auth-Key':'7PHs6U33kX',
                'Content-Type':'application/json'
            }
        }).then(res => {
            const key = '7PHs6U33kX';
            const { status, message } = res.data;
            // console.log("response from login API",res.data)
            const userCode = res.data["user-code"];
            if(status === 200 && message === "Successfully login.") {
                const token = res.data['token'];
                const userCode = res.data['user-code'];
                const role = res.data['role'];
                // console.log("role",role);
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('user', userCode);
                localStorage.setItem('role', role);
                setAuthorizationToken(token,userCode, key,false);
                dispatch(setCurrentUser({isLoggedIn: true,id:userCode,isVerified:true,isPasswordReset:false }))
                dispatch(setUserRole({role:role}))
            }
            else if (status === 200 && ( message === "Username not found." || message === "Wrong password." || message === "Account blocked. Contact admin.")) {
                return res.data;
            }
            else if (status === 200 && res.data['otp_type'] === "EMAIL") {
                dispatch(setCurrentUser({isLoggedIn: true,id:res.data['user-code'],isVerified:false}))
                setAuthorizationToken(false,userCode, key,"EMAIL");
            }
            else if (status === 200 && res.data['otp_type'] === "SMS") {
                dispatch(setCurrentUser({isLoggedIn: true,id:res.data['user-code'],isVerified:false}))
                setAuthorizationToken(false,userCode, key,"SMS");
            }
            else if(status === 200 && message==="password_reset") {
                dispatch(setCurrentUser({isLoggedIn: true,id:res.data['user-code'],isVerified:true,isPasswordReset:true}))
                setAuthorizationToken(false,userCode, key);
            }
            else if(status === 200 && message === "otp request") {
                dispatch(setCurrentUser({isLoggedIn: true,id:res.data['email'],isVerified:false,isPasswordReset:false}))
                setAuthorizationToken(false,false, key);
                dispatch(setOtpType({type:res.data["phone"]}));
            }
            else {
                return res.data;
            }
        }).catch((error) => {
            console.log('error',error);
        })
    }
}