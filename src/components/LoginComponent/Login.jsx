import React, {Component} from 'react';
// import {useHistory} from 'react-router-dom'
import './Index.scss';
import LoginLogo from '../../images/westgarth-logo.png';
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
        this.setState({errors: {}, isLoading: false})
        this.props.login(this.state).then((res) => {
            if(res){
                if((res.message === "Username not found." || res.message === "Wrong password." || res.message === "Account blocked. Contact admin.")
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
            <div className="login-page">
                <div className="login-page-center">
                    <form  className="login-form" onSubmit={e => this.handleSubmit(e)}>
                        <div className="login-logo">
                            <a href="/">
                                <img src={LoginLogo} alt=""/>
                            </a>
                        </div>
                        <div className="login-form-list change-password">
                            <div className="change-password-row">
                                <div className="change-password-title msg-alert">
                                    <a href="/">{error}</a>
                                </div>
                            </div>
                            <div className="login-list-row">
                                <div className="login-list">
                                    <label>Email:</label>
                                    <input type="text" name="email" value={email} onChange={e => this.handleChange(e)}  required/>
                                </div>
                                <div className="login-list">
                                    <label>Password:</label>
                                    <input type="password" name="password" value={password} onChange={e => this.handleChange(e)} required/>
                                </div>
                                <div className="login-list login-btn-list">
                                    <button className="login-btn" type="submit" disabled={isLoading}> Login </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect(null, {login})(Login);
