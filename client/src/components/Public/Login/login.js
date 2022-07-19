import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { loginUser } from '../../../actions';
import config from "../../../config";

function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error] = useState('');
    const [success] = useState(false);


    const handleInputEmail = (event) => {
        setEmail(event.target.value);
    }

    const handleInputPassword = (event) => {
        setPassword(event.target.value);
    }

    useEffect(() => {
        document.title = `Login - ${config.defaultTitle}`;
        return () => {
            document.title = config.defaultTitle;
        }
    }, []);

    useEffect(() => {
        if (props.user.login && props.user.login.isAuth) {
            props.history.push('/user');
        }
    }, [props]);

    const submitForm = (e) => {
        e.preventDefault();
        props.dispatch(loginUser({
            email,
            password,
            error,
            success
        }))
    }

    return (
        <div className="form_input">
            <form onSubmit={submitForm}>
                <h2>Log in here</h2>
                <div className="form_element">
                    <input 
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleInputEmail}
                        autoComplete="off"
                    />
                </div>
                <div className="form_element">
                    <input 
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={handleInputPassword}
                        autoComplete="off"
                    />
                </div>
                <button type="submit">Log in</button>
                <div className="error">
                    {
                        props.user.login ?
                            <div>{props.user.login.message}</div>
                        : null
                    }
                </div>    
            </form>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        user:state.user
    }
}

export default connect(mapStateToProps)(Login)