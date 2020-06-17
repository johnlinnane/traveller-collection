import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-js';
import { Link } from 'react-router-dom';

// import { getUserPosts } from '../../actions';
import { getUserItems } from '../../actions';



class UserItems extends Component {


    // componentWillMount() {
    componentDidMount() {
        this.props.dispatch(getUserItems(this.props.user.login.id))
    }



    showUserItems = (user) => (
        user.userItems ?
            user.userItems.map(item => (
                <tr key={item._id}> 
                    <td>
                        <Link to={`/user/edit-item/${item._id}`}>
                            {item.title}
                        </Link>
                    </td>
                    <td>{item.creator}</td>
                </tr>
            ))
        : null
    )

    
    render() {
        // console.log(this.props);

        let user = this.props.user;

        return (
            <div className="user_posts">
                {/* <h4>Your reviews:</h4> */}
                <h4>Your Items</h4>

                <table className="item_list">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Creator</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.showUserItems(user)}
                    </tbody>
                </table>
                
            </div>
        );
    }
}

function mapStateToProps(state) {

    // console.log(state.user);
    return {
        user:state.user
    }
}


export default connect(mapStateToProps)(UserItems)