import React, {useState} from 'react';
import ReplyEmail from "../../Modals/ReplyEmail";
import Button from "react-bootstrap/Button";
import ReplyChat from "../../Modals/ReplyChat";
import AccountInfo from '../AccountInfo';

const ChatsMob = () => {
    const [showReply,setshowReply] = useState(false);
    return (
        <div>
            <div className="chat-mobile">
                <div className="head">
                    <AccountInfo />
                </div>
                <div className="chat-mobile-detail">
                    <div className="head-title d-flex justify-content-between">
                        <div className="title-chat">
                            <span>Chat</span>
                        </div>
                        <div className="head-date-customer d-flex">
                            <div className="date-customer">
                                <label>Date</label>
                                <span>dd mmm yyyy</span>
                            </div>
                            <div className="date-customer">
                                <label>Customer</label>
                                <span>Customer Chat ID</span>
                            </div>
                        </div>
                    </div>
                    <div className="chat-mobile-block">
                        <div className="chat-mobile-scroll">
                            <div className="chatting-row">
                                <div className="msg-list you-msg d-flex">
                                    <div className="thumbnail"></div>
                                    <div className="msg-content">
                                        <div className="msg-detail">
                                            <div className="text-msg">Hey there!</div>
                                            <div className="text-msg">How can we help you buy wine today?</div>
                                        </div>
                                        <div className="msg-time d-flex">
                                            <span>4d</span>
                                            <span> · Custom Bot</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="msg-note">
                                    <p>Ernie gave reply options: Questions about shipping?, Questions about tariffs?, Questions about buying wine? and When are pre-arrivals available? 4d ago</p>
                                </div>
                                <div className="msg-list user-msg d-flex">
                                    <div className="thumbnail"></div>
                                    <div className="msg-content">
                                        <div className="msg-detail">
                                            <div className="text-msg">When are pre-arrivals available?</div>
                                        </div>
                                        <div className="msg-time d-flex">
                                            <span>4d</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="msg-list you-msg d-flex">
                                    <div className="thumbnail"></div>
                                    <div className="msg-content">
                                        <div className="msg-detail">
                                            <div className="text-msg">Pre-arrival simply means its not yet immediately available in our Californian warehouse. We'll only ship these wines once they've been purchased.  If tariffs need to be paid on them,  tariffs will be charged.</div>
                                            <div className="text-msg">The quickest delivery is usually available in 10-14 days. There is also a less expensive but slower 60-90 day option.</div>
                                        </div>
                                        <div className="msg-time d-flex">
                                            <span>4d</span>
                                            <span> · Custom Bot</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="msg-note">
                                    <p>Ernie gave reply options: Questions about shipping?, Questions about tariffs?, Questions about buying wine? and When are pre-arrivals available? 4d ago</p>
                                </div>
                            </div>
                        </div>
                        <div className="chat-reply">
                            <Button variant="primary" className="chat-reply-btn" onClick={()=>setshowReply(true)}>Reply</Button>
                        </div>
                    </div>
                </div>
            </div>
            <ReplyChat
                className="chat-reply-mobile-modal"
                show={showReply}
                onHide={() => setshowReply(false)}
            />
        </div>
    );
};

export default ChatsMob;