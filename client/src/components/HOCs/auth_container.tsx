import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { authGetCredentials } from '../../actions';
import { withRouter } from "react-router-dom";

export default function foo(ComposedClass, redirectToLogin) {
    const AuthenticationCheck = props => {
        const [loading, setLoading] = useState(false);

        useEffect(() => {
            props.dispatch(authGetCredentials()); 
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        useEffect(() => {
            setLoading(false);
            if(props.user && props.user.login) {
                if (!props.user.login.isAuth) {
                    if(redirectToLogin === true) {
                        props.history.push('/login');
                    }
                } else {
                    if (redirectToLogin === false) {
                        props.history.push('/user')
                    } 
                }
            }
        }, [props]);

        if(loading) {
            return <div className="loader">Loading...</div>
        }
        return(
            <ComposedClass {...props} user={props.user}/>
        )
    }

    function mapStateToProps(state) {
        return {
            user:state.user
        }
    }
    return withRouter(connect(mapStateToProps)(AuthenticationCheck));
}