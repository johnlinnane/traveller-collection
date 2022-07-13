import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authGetCredentials } from '../../actions';
import { withRouter } from "react-router-dom";

export default function foo(ComposedClass, reload) {

    class AuthenticationCheck extends Component {

        state = {
            loading:false
        }

        componentDidMount() {
            this.props.dispatch(authGetCredentials()); 
        }

        componentDidUpdate(prevProps, prevState) {
            if (this.props !== prevProps) {
                this.setState({loading:false})
                if(this.props.user && this.props.user.login && !this.props.user.login.isAuth) {
                    if(reload === true) {
                        this.props.history.push('/login');
                    }
                } else { 
                    if (reload === false) {
                        this.props.history.push('/user')
                    } 
                } 
            }
        }

        render() {
            if(this.state.loading) {
                return <div className="loader">Loading...</div>
            }
            return(
                <ComposedClass {...this.props} user={this.props.user}/>
            )
        }
    }

    function mapStateToProps(state) {
        return {
            user:state.user
        }
    }
    return withRouter(connect(mapStateToProps)(AuthenticationCheck));
}
