import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authGetCredentials } from '../../actions';

// this is a post component
// a function that receives a class as an argument
// returns the component !!
// reload determines what type of redirect it should be
export default function foo(ComposedClass, reload) {

    // make a class to dispatch an action to check if user is authenticated
    class AuthenticationCheck extends Component {


        state = {
            loading:false
        }


        componentDidMount() {
            if(this.props.user.login && !this.props.user.login.isAuth) {
                this.props.dispatch(authGetCredentials()); // returns nothing if not logged in
            }   
        }

        componentDidUpdate(prevProps, prevState) {
            if (this.props !== prevProps) {
                this.setState({loading:false})

                if(this.props.user.login && !this.props.user.login.isAuth) {
                    if(reload === true) {
                        this.props.history.push('/login');
                    }
                } else {
                    if(reload === false) {
                        this.props.history.push('/user')
                    }
                }

            }
        }

        render() {
            if(this.state.loading) {
                return <div className="loader">Loading...</div>
            }

            // return the actual route, with the data of the user (from react router)
            return(
                // inject the props of the user from /api/auth-get-user-creds, otherwise no user data
                // {...this.props} is all the properties we're getting from the router
                <ComposedClass {...this.props} user={this.props.user}/>
            )
        }
    }

    function mapStateToProps(state) {
        return {
            user:state.user
        }
    }
    return connect(mapStateToProps)(AuthenticationCheck)
}
