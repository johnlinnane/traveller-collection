
// check if token is valid

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { auth } from '../../actions';

//  this is a post component
// function that receives a class as an argument
// returns the component !!
// reload determines what type of redirect it should be
export default function(ComposedClass, reload) {

    // make a class to dispatch an action to check if user is authenticated
    class AuthenticationCheck extends Component {


        state = {
            // display loading logo
            loading:true
        }


        // dispatch an action to check if user is authenticated
        // componentWillMount() {
        componentDidMount() {

            this.props.dispatch(auth())
        }

        // componentWillReceiveProps(nextProps) {
        //     // console.log(nextProps);
        //     this.setState({loading:false})
        //     // check if user is authenticated, show them corresponding screen
        //     if(!nextProps.user.login.isAuth) {
        //         // stop infinite loop
        //         if(reload === true) {
        //             this.props.history.push('/login');
        //         }
        //     } else {
        //         // kick back to user page if logged in
        //         if(reload === false) {
        //             this.props.history.push('/user')
        //         }
        //     }
        // }

        // check if props have been received
        componentDidUpdate(prevProps, prevState) {
            if (this.props != prevProps) {
                this.setState({loading:false})
                if(!this.props.user.login.isAuth) {
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

            // console.log(this. props);

            if(this.state.loading) {
                return <div className="loader">Loading...</div>
            }

            // return the actual route, with the data of the user (from react router)
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
    return connect(mapStateToProps)(AuthenticationCheck)
}
