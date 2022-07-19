import React from 'react';
import axios from 'axios';


const Logout = props => {
    
    axios.get(`${process.env.REACT_APP_API_PREFIX}/logout`)
        .then(request => {
            setTimeout( () => {
                props.history.push('/')
            }, 2000)
        })

    return (
        <div className="logout_container">
            <h1>Logged out successfully</h1>
        </div>
    );
};

export default Logout;