import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { createItem, clearItemFromState } from '../../../../src/slices/itemsSlice';
import { AppDispatch } from '../../../../src/index';
import { Item } from '../../../types';
import config from "../../../config";

const CreateItem = props => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const params = useParams();

    const [creatingItem, setCreatingItem] = useState<boolean>(false);

    const newItemData: Item = {
        _id: '',
        title: '',
        creator: '',
        subject: '',
        description: '',
        source: '',
        date_created: '',
        contributor: '',
        item_format: '',
        materials: '',
        physical_dimensions: '',
        pages: '',        
        editor: '',
        publisher: '',
        further_info: '',
        language: '',
        reference: '',
        rights: '',
        external_link: [
            {
                url: '',
                text: ''
            }
        ],
        geo: {
            address: '',
            latitude: null,
            longitude: null
        },
        location: '',

        is_pdf_chapter: null,
        pdf_item_pages: {
            start: null,
            end: null
        },
        pdf_item_parent_id: '',

        shareDisabled: false,
        isPending: null,
        category_ref: null,
        subcategory_ref: null, 

    };

    useEffect(() => {
        if (typeof props.items?.newitem?.itemId === 'string' && creatingItem === true) {
            setCreatingItem(false);
            navigate(`/edit-item/${props.items.newitem.itemId}`);
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.items.newitem, creatingItem]);

    useEffect(() => {
        return () => {
            dispatch(clearItemFromState());
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCreateItem = () => {
        setCreatingItem(true);
    
        const userIsLoggedIn = props.user?.login?.isAuth && typeof props.user.login.token === 'string';

        const updatedNewItemData = {
            ...newItemData,
            category_ref: params.c ? [params.c] : null,
            subcategory_ref: params.s ? [params.s] : null,
            ownerId: userIsLoggedIn ? props.user.login.id : 'guest',
            isPending: userIsLoggedIn ? false : true,
        };
    
        try {
            dispatch(createItem(updatedNewItemData));
        } catch (error) {
            console.error('Error creating item:', error);
        }
    };

    return (
        <div className="form_input">
            <h1>This will create a new item.</h1>
            <button 
                type="button" 
                style={{ margin: '3px' }}
                onClick={() => {handleCreateItem()}}
            >
                Create New Item
            </button>
            <button 
                type="button" 
                style={{ margin: '3px' }}
                onClick={() => {navigate(-1)}}
            >
                Cancel
            </button>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        items:state.items,
    }
}

export default connect(mapStateToProps)(CreateItem)