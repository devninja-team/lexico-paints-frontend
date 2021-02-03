import React, {useState} from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./utils/Store";
import './App.scss';
import Header from "./components/Common/Header/Header";
import SideBar from "./components/Common/Sidebar/SideBar";
import CustomerMain from "./components/CustomerMain/CustomerMain";
import AccountInfo from "./components/Account info/AccountInfo";
import Orders from "./components/Account info/Orders/Orders";
import Communication from "./components/Account info/Communication/Communication Main/Communication";
import Account from "./components/Account info/Account/Account";
import Calls from "./components/Account info/Communication/Calls"
import Emails from "./components/Account info/Communication/Emails";
import Texts from "./components/Account info/Communication/Texts";
import Chats from "./components/Account info/Communication/Chats";
import Notes from "./components/Account info/Communication/Notes";
import EmailsMob from "./components/Account info/Communication/EmailsMob";
import ChatsMob from "./components/Account info/Communication/ChatsMob";
import Home from "./components/Home";

function App() {
  const [toggle,setToggle] = useState(false);
  return (
      <Provider store={ store }>
        <div className="App">
            {/* <Header toggle={toggle} setButtonToggle={(t) => setToggle(t)} /> */}
            <Home/>
              {/* <div className="main-wrapper d-flex justify-content-between">
              <SideBar toggle={toggle} />
              <div className={ toggle ? "middle-content open" : "middle-content"} toggle={toggle}>
                <Route exact path="/">
                  <CustomerMain />
                </Route>
                <Route path="/accountinfo">
                  <AccountInfo />
                  <Route exact path="/accountinfo">
                    <Account/>
                  </Route>
                  <Route path="/accountinfo/orders">
                    <Orders/>
                  </Route>
                  <Route path="/accountinfo/communication">
                    <Communication/>
                    <Route exact path="/accountinfo/communication">
                      <Calls />
                    </Route>
                    <Route path="/accountinfo/communication/notes">
                      <Notes />
                    </Route>
                    <Route path="/accountinfo/communication/emails">
                      <Emails />
                    </Route>
                    <Route path="/accountinfo/communication/chats">
                      <Chats />
                    </Route>
                    <Route path="/accountinfo/communication/texts">
                      <Texts />
                    </Route>
                  </Route>
                </Route>
                <Route path="/email-mob">
                  <EmailsMob />
                </Route>
                <Route path="/chat-mob">
                  <ChatsMob />
                </Route>
              </div>
            </div> */}
        </div>
      </Provider>
  );
}

export default App;
