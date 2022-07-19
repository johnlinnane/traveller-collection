import React from 'react';
import { Link } from 'react-router-dom';

const User = props => {
    let user = props.user.login;

    return (
        <div className="user_container">
            <div className="avatar">
                <img alt="avatar" src="/assets/media/avatar.png"/>
            </div>

            <div className="nfo">
                <div><span>Name: </span> {user.name}</div>
                <div><span>Lastname: </span> {user.lastname}</div>
                <div><span>Email: </span> {user.email}</div>
                
                <Link to={'/register'}>
                    <div className="register_button">
                        Register a new user
                    </div>
                </Link>
            </div>
            
        </div>
    )
};

export default User;  