import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getUserItems } from '../../../actions';

const UserItems = props => {

    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (props.user?.login?.id) {
            props.dispatch(getUserItems(props.user.login.id))
        }
    }, [props.user?.login?.id]);

    useEffect(() => {
        if (props.items?.items?.length) {
            setLoading(false);
        };
    }, [props.items?.items]);

    const showUserItems = user => (
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

    return loading ? (
        <div className="form_input">
            <div><br />Loading...</div>
        </div>
    ) : (
        props.items && (
            <div className="user_posts">
                <h4>Your Items</h4>
                <table className="item_list">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Creator</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showUserItems(props.user)}
                    </tbody>
                </table>
            </div>
        )
    );
}

function mapStateToProps(state) {
    return {
        user:state.user,
        items:state.items
    }
}

export default connect(mapStateToProps)(UserItems)