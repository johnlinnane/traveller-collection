import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import axios from 'axios';
import { getAllPendItems, deletePendItem, acceptItem } from '../../../../src/slices/itemsSlice';
import PendingItem from './pending_item'
import config from "../../../config";
import { AppDispatch } from '../../../../src/index';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;

const PendingItemsView: React.FC = (props: any) => {

    const dispatch = useDispatch<AppDispatch>();
    
    const [items, setItems] = useState<any[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>('Loading...');

    useEffect(() => {
        document.title = `Pending Items - ${config.defaultTitle}`;
        dispatch(getAllPendItems());
        return () => {
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.items.items?.error) {
            setErrorMsg('There are no pending items.')
        }
    }, [props.items.items?.error]);


    useEffect(() => {
        if (props.items?.items) {
            setItems(props.items.items);
        }
    }, [props.items?.items]);

    const deleteAllMedia = async (id: string) => {
        let fileData =  {
            section: 'items',
            id: id,
            fileType: null,
            fileName: null,
            deleteAll: true
        };
        try {
            await axios.post(`${API_PREFIX}/delete-dir`, fileData);
            console.log('Media deleted successfully');
        } catch (error) {
            console.log('No media deleted');
        }
    }

    const handleChoice = (itemId, choice) => {
        if (choice === 'accept') {
            dispatch(acceptItem(itemId))
        }
        if (choice === 'reject') {
            dispatch(deletePendItem(itemId));
            deleteAllMedia(itemId);
        }
        let tempItems = items;
        let index = tempItems.findIndex(p => p._id === itemId)
        if (index > -1) {
            tempItems.splice(index, 1);
        }
        setItems(tempItems);
    }

    return (
        <div className="main_view p_items_view">
            <h2>Pending Items</h2>
            {items && items.length ?
                items.map( (item, i) => (
                    <PendingItem key={i} item={item} handleChoicePass={handleChoice} />
                ))
            : <p>{errorMsg}</p>}
        </div>
    );
}

function mapStateToProps(state: any) {
    return {
        items:state.items
    }
}

export default connect(mapStateToProps)(PendingItemsView)

