import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getAllItems } from '../../../../src/slices/itemsSlice';

const AllItems = props => {

    const [loading, setLoading] = useState<boolean>(true);

    const { dispatch } = props;

    useEffect(() => {
        if (props.user?.login?.token && typeof props.user?.login?.token === 'string') {
            dispatch(getAllItems())
        }
    }, [props.user?.login?.id, dispatch]);

    useEffect(() => {
        if (props.items?.items?.length) {
            setLoading(false);
        };
    }, [props.items?.items]);

    const showAllItems = items => (
        items.items ?
            items.items.map(item => (
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

    return loading ? (
        <div className="form_input">
            <div><br />Loading...</div>
        </div>
    ) : (
        props.items && (
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
                        {showAllItems(props.items)}
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

export default connect(mapStateToProps)(AllItems)