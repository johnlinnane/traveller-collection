import React, { Component } from 'react';
import { connect } from 'react-redux';

import { loginUser } from '../../../actions';


class Login extends Component {
    
    state = {
        email:'',
        password:'',
        error:'',
        success:false
    }


    handleInputEmail = (event) => {
        this.setState({email:event.target.value})
    }

    handleInputPassword = (event) => {
        this.setState({password:event.target.value})
    }

    componentDidMount() {
        document.title = "Login - Traveller Collection";
    }
    
    componentWillUnmount() {
        document.title = `Traveller Collection`
    }


    // redirect to user screen when login
    componentDidUpdate(prevProps, prevState) {

        if (this.props !== prevProps) {

            if (this.props.user.login && this.props.user.login.isAuth) {
                this.props.history.push('/user')
            }
        }
    }


    submitForm = (e) => {
        e.preventDefault();
        // login and set cookie
        this.props.dispatch(loginUser(this.state))
    }
    
    
    render() {
        let user = this.props.user;


        return (
            <div className="form_input">
                <form onSubmit={this.submitForm}>
                    <h2>Log in here</h2>

                    <div className="form_element">
                        <input 
                            type="email"
                            placeholder="Enter your email"
                            value={this.state.email}
                            onChange={this.handleInputEmail}
                            autoComplete="off"
                        />
                    </div>


                    <div className="form_element">
                        <input 
                            type="password"
                            placeholder="Enter your password"
                            value={this.state.password}
                            onChange={this.handleInputPassword}
                            autoComplete="off"
                        />
                    </div>

                    <button type="submit">Log in</button>

                    <div className="error">
                        {
                            user.login ?
                                <div>{user.login.message}</div>
                            : null
                        }
                    </div>    
                    

                </form>



            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        user:state.user
    }
}

export default connect(mapStateToProps)(Login)