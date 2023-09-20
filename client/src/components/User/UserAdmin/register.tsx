import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { getUsers, userRegister } from '../../../actions';

const Register = props => {

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        props.dispatch(getUsers());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleInputEmail = event => {
        setEmail(event.target.value);
    }

    const handleInputPassword = event => {
        setPassword(event.target.value);
    }

    const handleInputName = event => {
        setName(event.target.value);
    }

    const handleInputLastname = event => {
        setLastname(event.target.value);
    }

    useEffect(() => {
        if (props.user.register === false) {
            setError('Error, try again');
        } else {
            setName(''); 
            setLastname('');
            setEmail('');
            setPassword('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitForm = e => {
        e.preventDefault();
        setError('');

        props.dispatch(userRegister({
            email: email,
            password: password,
            name: name,
            lastname: lastname,
        }, props.user.users))
    }

    const showUsers = user => (
        user.users ?
            user.users.map(item => (
                <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.lastname}</td>
                    <td>{item.email}</td>
                </tr>
            )) 
        : null
    )

    return (
        <div className="form_input">
            <form onSubmit={submitForm}>
                <h2>Add user</h2>
                <div className="form_element">
                    <input
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={handleInputName}
                    />
                </div>
                <div className="form_element">
                    <input
                        type="text"
                        placeholder="Enter Lastname"
                        value={lastname}
                        onChange={handleInputLastname}
                    />
                </div>
                <div className="form_element">
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={handleInputEmail}
                    />
                </div>
                <div className="form_element">
                    <input
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={handleInputPassword}
                    />
                </div>
                <button type="submit">Add user</button>
                <div className="error">
                    {error}
                </div>
            </form>

            <div className="current_users">
                <h4>Current users:</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Lastname</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showUsers(props.user)}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        user:state.user
    }
}

export default connect(mapStateToProps)(Register)