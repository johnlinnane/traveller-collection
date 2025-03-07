import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import ItemList from './item_list';
import { getUserItems } from '../../../../src/slices/userSlice';

const UserItems = props => {

    const [loading, setLoading] = useState<boolean>(true);

    const { dispatch } = props;

    useEffect(() => {
        if (props.user?.login?.token && typeof props.user?.login?.token === 'string') {
            dispatch(getUserItems(props.user.login.token))
        }
    }, [props.user?.login?.id, dispatch]);

    useEffect(() => {
        if (props.user?.userItems?.length) {
            setLoading(false);
        };
    }, [props.user?.userItems]);

    return loading ? (
        <div className="form_input">
            <div><br />Loading...</div>
        </div>
    ) : (
        props.user && (
            <ItemList items={props.user.userItems}/>
        )
    );
}

function mapStateToProps(state) {
    return {
        user:state.user
    }
}

export default connect(mapStateToProps)(UserItems)