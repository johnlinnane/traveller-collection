import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { getUserAuth } from '../../../src/slices/userSlice';
import { useNavigate } from "react-router-dom";
import { AppDispatch } from '../../../src/index';

interface AuthenticationCheckProps {
    redirectTo: string | null;
    dispatch: Function;
    user: {
        login: {
            isAuth: boolean;
            id: string;
        }
    }
    Component: React.FC
}

const AuthContainer: React.FC<AuthenticationCheckProps> = (props: any) =>  {
    const dispatch = useDispatch<AppDispatch>();
    
    const { Component, redirectTo } = props;

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [loadComponent, setLoadComponent] = useState(null);

    useEffect(() => {
        if (!props.user?.login?.isAuth) {
            dispatch(getUserAuth());
        } 
        setLoading(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
    }, [props.user]);

    useEffect(() => {
        if(props.user?.login) {
            if (!props.user.login.isAuth && redirectTo === 'login') {
                navigate('/login');
            } else if (redirectTo === 'user') {
                navigate('/user')
            }
            setLoading(false);
            setLoadComponent(true);
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user?.login]);

    if (loading) {
        return <div className="loader">Loading...</div>
    }

    if (loadComponent) {
        return <Component {...props} />;
    }
}

function mapStateToProps(state) {
    return {
        user:state.user
    }
}

export default connect(mapStateToProps)(AuthContainer);
