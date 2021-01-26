import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;
class Sandbox extends Component {


    componentDidMount() {
        this.apiCall();
    }

    apiCall = () => {
        axios.post(`${API_PREFIX}/cookie-tester`, {someVar:4}, {withCredentials: true}, (req, res) => {
            console.log(API_PREFIX)
            // console.log(res)
        })
        // .then(console.log(res => console.log(res)))
        // .then(res => res.cookie('test_cookie', 'KOOKIE KONTENTZ'))
        // .then(res => res.json())
        // .then(json => console.log(json))
        
    }



    render() {

        

        return (
            <div>
                <p>Sandbox Testing Area</p>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        items:state.items,
    }
}

export default connect(mapStateToProps)(Sandbox)


