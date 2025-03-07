import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import ItemList from './item_list';
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

    return loading ? (
        <div className="form_input">
            <div><br />Loading...</div>
        </div>
    ) : (
        props.items?.items?.length && (
            <ItemList items={props.items.items}/>
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