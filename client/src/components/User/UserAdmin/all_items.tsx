import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getUserItems, getAllItems } from '../../../actions';

const AllItems = props => {

    useEffect(() => {
        props.dispatch(getUserItems(props.user.login.id))
        props.dispatch(getAllItems())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const showUserItems = items => (
        items.items ?
            items.items.map(item => (
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

    return (
        <div className="user_posts">
            <h4>All Items</h4>
            <table className="item_list">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Creator</th>
                    </tr>
                </thead>
                <tbody>
                    {showUserItems(props.items)}
                </tbody>
            </table>
            
        </div>
    );
}

function mapStateToProps(state) {
    return {
        user:state.user,
        items:state.items
    }
}

export default connect(mapStateToProps)(AllItems)