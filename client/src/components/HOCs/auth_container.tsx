import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { authGetCredentials } from '../../actions';
import { useNavigate } from "react-router-dom";

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

    const { Component, redirectTo } = props;

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        props.dispatch(authGetCredentials()); 
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
