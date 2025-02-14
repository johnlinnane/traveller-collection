import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { getUserDetails } from '../../../src/slices/userSlice';
import { useNavigate } from "react-router-dom";
import { AppDispatch } from '../../../src/index';

interface AuthenticationCheckProps {
    redirectTo: string | null;
    dispatch: Function;
    user: {
        login: {
            isAuth: boolean;
        }
    }
    Component: React.FC
}

const AuthContainer: React.FC<AuthenticationCheckProps> = (props: any) =>  {
    const dispatch = useDispatch<AppDispatch>();
    
    const { Component, redirectTo } = props;

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        dispatch(getUserDetails()); 
        setLoading(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLoading(false);
        if(props.user?.login) {
            if (!props.user.login.isAuth) {
                if(redirectTo === 'login') {
                    navigate('/login');
                }
            } else {
                if (redirectTo === 'user') {
                    navigate('/user')
                } 
            }
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user]);

    if (loading) {
        return <div className="loader">Loading...</div>
    }

    return <Component {...props} />;
}

function mapStateToProps(state) {
    return {
        user:state.user
    }
}

export default connect(mapStateToProps)(AuthContainer);
