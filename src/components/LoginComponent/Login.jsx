import React, {Component} from 'react';
// import {useHistory} from 'react-router-dom'
import './Index.css';
import LoginLogo from '../../assets/images/u3.png';
import {connect} from 'react-redux';
import {login} from '../../utils/Actions/index'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email:'',
            password:'',
            error:'',
            isLoading: false
        };
    }
    handleSubmit = (e,dispatch) => {
        e.preventDefault();
        this.setState({errors: "", isLoading: false})
        this.props.login({
            username: this.state.email,
            password: this.state.password
        }).then((res) => {
            if(res){
                console.log("res",res)
                if((res.message === "Username not found." || res.message === "Wrong password." || res.message === "Username or password not valid")
                    && res.status === 200) {
                        if(res.message === "Account blocked. Contact admin.") {
                            this.setState({...this.state,error:"Your Account is not active. contact admin"})
                        }else {
                            this.setState({...this.state,error:res.message});
                        }
                }
            }
        })
    }
    handleChange = (e) => {
        this.setState({ [e.target.name] : e.target.value})
    }
    render() {
        const { email, password, isLoading, error } = this.state;
        return (
            // <div className="login-page">
            //     <div className="login-page-center">
            //         <form  className="login-form" onSubmit={e => this.handleSubmit(e)}>
            //             <div className="login-logo">
            //                 <a href="/">
            //                     <img src={LoginLogo} alt=""/>
            //                 </a>
            //             </div>
            //             <div className="login-form-list change-password">
            //                 <div className="change-password-row">
            //                     <div className="change-password-title msg-alert">
            //                         <a href="/">{error}</a>
            //                     </div>
            //                 </div>
            //                 <div className="login-list-row">
            //                     <div className="login-list">
            //                         <label>Email:</label>
            //                         <input type="text" name="email" value={email} onChange={e => this.handleChange(e)}  required/>
            //                     </div>
            //                     <div className="login-list">
            //                         <label>Password:</label>
            //                         <input type="password" name="password" value={password} onChange={e => this.handleChange(e)} required/>
            //                     </div>
            //                     <div className="login-list login-btn-list">
            //                         <button className="login-btn" type="submit" disabled={isLoading}> Login </button>
            //                     </div>
            //                 </div>
            //             </div>
            //         </form>
            //     </div>
            // </div>
            <div className="userFrom">
                <div class="container text-center">
                    <div class="myCard">
                            <div class="row cardRow">
                                <div class="col-md-6">
                                    <div class="leftContent d-none d-md-flex align-item-center justify-content-center">
                                        { <img src={LoginLogo} class="userimage" height="260px" width="260px" alt="UserImage"/> }
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-content">
                                        <div class="rightContent d-md-flex align-item-center justify-content-center flex-column">
                                            <form class="myForm text-center" onSubmit={e => this.handleSubmit(e)}>
                                                <div class="formTitle pb-5">
                                                    <header class="userTitle">Lexico Login</header>
                                                </div>
                                                <div class="form-group">
                                                    <i class="fa fa-user" aria-hidden="true" style={{/*fontSize: "20px",padding: "15px"*/}}></i>
                                                    <input type="text" class="myInput"  value={email} name="email" onChange={e => this.handleChange(e)}  placeholder="Username" required/>
                                                </div>
                                                <div class="form-group">
                                                    <i class="fa fa-lock" aria-hidden="true"></i>
                                                    <input type="password" class="myInput"value={password} name="password" onChange={e => this.handleChange(e)} placeholder="Password" required/>
                                                </div>
                                                <div class="button pt-3">
                                                    <input type="submit" class="butt btn btn-success p-2" style={{borderRadius: "50px"}} value="Login" disabled={isLoading}/>
                                                </div>
                                            </form>
                                            <div class="forget pt-2">
                                                <a href="#"><span class="pt-3 text-dark">Forgot Username / Password?</span></a>
                                            </div>
                                            <div class="forget pt-2">
                                                <span class="pt-3 text-dark">{error}</span>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, {login})(Login);
