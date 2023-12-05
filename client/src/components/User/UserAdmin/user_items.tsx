import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getUserItems } from '../../../actions';

const UserItems = props => {

    const [loading, setLoading] = useState<boolean>(true);

    const { dispatch } = props;

    useEffect(() => {
        if (props.user?.login?.id) {
            dispatch(getUserItems(props.user.login.id))
        }
    }, [props.user?.login?.id, dispatch]);

    useEffect(() => {
        if (props.user?.userItems?.length) {
            setLoading(false);
        };
    }, [props.user?.userItems]);

    const showUserItems = user => (
        user.userItems ?
            user.userItems.map(item => (
                <tr key={item._id}> 
                    <td>
                        <Link to={`/edit-item/${item._id}`}>
                            {item.title}
                        </Link>
                    </td>
                    <td>{item.creator}</td>
                </tr>
            ))
        : null
    )

    const showNumberOfItems = user => (
        user.userItems && user.userItems.length ?
            <span>({user.userItems.length})</span>
        : null
    )

    return loading ? (
        <div className="form_input">
            <div><br />Loading...</div>
        </div>
    ) : (
        props.user && (
            <div className="user_posts">
                <h4>Your Items {showNumberOfItems(props.user)}</h4>
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
        user:state.user
    }
}

export default connect(mapStateToProps)(UserItems)