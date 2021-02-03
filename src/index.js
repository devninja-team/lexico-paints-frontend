import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import store from './utils/Store';
import { Provider } from "react-redux";
import setAuthorizationToken from "./utils/AuthHeaders";
import {setCurrentUser, setUserRegion, setUserRole, setWhoAmI} from "./utils/Actions";
import axios from 'axios';
//baseURL of API
axios.defaults.baseURL = "https://crmapi.tftc.company";
if(localStorage.getItem("region") === "UK") {
    console.log("REGION UK")
    store.dispatch(setUserRegion({region:"?region=UK"}));
} else {
    console.log("REGION US")
}
if(localStorage.jwtToken && localStorage.user && localStorage.role) {
    const token = localStorage.jwtToken;
    const user = localStorage.user;
    const role  = localStorage.role
    setAuthorizationToken(token,user,'7PHs6U33kX',false);
    store.dispatch(setCurrentUser({isLoggedIn:true,id:localStorage.user,isVerified:true,isPasswordReset: false}));
    store.dispatch(setUserRole({role:role}));

    if(localStorage.whoami) {
        store.dispatch(setWhoAmI({whoami:localStorage.whoami}));
    }
}
ReactDOM.render(
    <Provider store = {store}>
        <App />
    </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
