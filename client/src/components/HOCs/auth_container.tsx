import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { authGetCredentials } from '../../actions';
import { withRouter, RouteComponentProps } from "react-router-dom";

interface AuthenticationCheckProps extends RouteComponentProps {
    redirectTo: string | null;
    dispatch: Function;
    user: {
        login: {
            isAuth: boolean;
        }
    }
}

export default function foo(Component, redirectTo: string | null) {
    const AuthenticationCheck: React.FC<AuthenticationCheckProps> = props => {
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
                        props.history.push('/login');
                    }
                } else {
                    if (redirectTo === 'user') {
                        props.history.push('/user')
                    } 
                }
            } // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.user]);

        if(loading) {
            return <div className="loader">Loading...</div>
        }
        return(
            <Component {...props} />
        )
    }

    function mapStateToProps(state) {
        return {
            user:state.user
        }
    }
    return withRouter(connect(mapStateToProps)(AuthenticationCheck));
}