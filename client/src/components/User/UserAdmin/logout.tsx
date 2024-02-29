import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { connect, useDispatch } from 'react-redux';

import { logOutUser } from '../../../../src/slices/userSlice';
import { AppDispatch } from '../../../../src/index';

const Logout = props => {
    const navigate = useNavigate();
    
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(logOutUser());
    }, []);

    useEffect(() => {
        if (props.user.logoutSuccess) {
            setTimeout( () => {
                navigate('/');
            }, 2000)
        }
    }, [props.user]);

    return (
        <div className="logout_container">
            <h1>Logging out...</h1>
            <p>Redirecting to homepage...</p>
        </div>
    );
};

function mapStateToProps(state: any) {
    return {
        user:state.user
    }
}

export default connect(mapStateToProps)(Logout)