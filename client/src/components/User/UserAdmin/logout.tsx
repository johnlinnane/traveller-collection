import React from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


const Logout = props => {

    const navigate = useNavigate();
    
    axios.get(`${process.env.REACT_APP_API_PREFIX}/logout`)
        .then(request => {
            setTimeout( () => {
                navigate('/');
            }, 2000)
        })

    return (
        <div className="logout_container">
            <h1>Logged out successfully</h1>
            <p>Redirecting to homepage...</p>
        </div>
    );
};

export default Logout;