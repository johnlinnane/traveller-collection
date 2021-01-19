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
            this.props.dispatch(authGetCredentials())
        }

        componentDidUpdate(prevProps, prevState) {
            if (this.props !== prevProps) {
                console.log(this.props)
                this.setState({loading:false})
                console.log('AUTH.JS (this.props.user.login):', this.props.user.login);

                setTimeout( () => {
                    if(!this.props.user.login.isAuth) {
                        console.log('HI')
                        if(reload === true) {
                            this.props.history.push('/login');
                        }
                    } else {
                        if(reload === false) {
                            this.props.history.push('/user')
                        }
                    }
                }, 2000 )

                
            }
        }

        render() {
            console.log('AUTH.JS PROPZ - USER.LOGIN', this.props.user.login)
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
        console.log('REDUX STATE.USER.LOGIN: ', state.user.login)
        return {
            user:state.user
        }
    }
    return connect(mapStateToProps)(AuthenticationCheck)
}
