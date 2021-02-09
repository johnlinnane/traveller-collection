import React, { Component } from 'react';
import { connect } from 'react-redux';
import { authGetCredentials } from '../../actions';
import { withRouter } from "react-router-dom";

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
            // if(!this.props.user.login) {
            //     this.props.dispatch(authGetCredentials()); // returns nothing if not logged in
            // }
            
            // if(this.props.user.login && !this.props.user.login.isAuth) {
            //     this.props.dispatch(authGetCredentials()); 
            // }  
            // console.log('authgetcredentials about to be called')
            this.props.dispatch(authGetCredentials()); // THIS IS NOT CALLED BEFORE EVERYTHING ELSE! AFTER THE FIRST RENDER
            // console.log('authgetcredentials called')
            
        }

        componentDidUpdate(prevProps, prevState) {
            if (this.props !== prevProps) {
                this.setState({loading:false})

                // if(this.props.user.login && !this.props.user.login.isAuth) {
                if(this.props.user && this.props.user.login && !this.props.user.login.isAuth) {
                    console.log('user is not authenticated')
                    if(reload === true) {
                        console.log('push to login')
                        this.props.history.push('/login');
                    }
                // else { ..
                } else { 
                    // console.log('user is authenticated')
                    if (reload === false) {
                        console.log('push to user')
                        this.props.history.push('/user')
                    } else {
                        // console.log('Reload is null... Proceed!!')
                    }
                } 

            }
        }

        render() {
            // console.log(this.props)
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
        // console.log(state.user)
        return {
            user:state.user
        }
    }
    return withRouter(connect(mapStateToProps)(AuthenticationCheck))
}
