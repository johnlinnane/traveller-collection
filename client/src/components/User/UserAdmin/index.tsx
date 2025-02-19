import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect, useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../src/index';
import { getUserDetails } from '../../../../src/slices/userSlice';

const User = props => {

    const dispatch = useDispatch<AppDispatch>();

    interface User {
        name: string | null;
        lastname: string | null;
        email: string | null;
    }

    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        const id = props.user?.login?.id;
        if (id) {
            dispatch(getUserDetails(id))
        }
    }, [props.user?.login]);

    useEffect(() => {
        if (typeof props.user?.details?.email === 'string') {
            setUser(props.user.details);
        }
    }, [props.user?.details]);

    return (
        <div className="user_container">
            <div className="avatar">
                <img alt="avatar" src="/assets/media/avatar.png"/>
            </div>
            {user ? 
                <div className="nfo">

                    <div><span>Name: </span> {user.name}</div>
                    <div><span>Lastname: </span> {user.lastname}</div>
                    <div><span>Email: </span> {user.email}</div>
                    
                    <Link to={'/user/register'}>
                        <div className="register_button">
                            Register a new Admin
                        </div>
                    </Link>
                </div>
            : null }
            
        </div>
    )
};

function mapStateToProps(state) {
    return {
        details:state.details,
        login:state.login
    }
}

export default connect(mapStateToProps)(User)