import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { getAllPendItems, deletePendItem, acceptItem } from '../../../actions';
import PendingItemCard from './pending_item_card'
import config from "../../../config";
const API_PREFIX = process.env.REACT_APP_API_PREFIX;

const PendingItemsView: React.FC = (props: any) => {

    const [items, setItems] = useState(null);

    useEffect(() => {
        document.title = `Pending Items - ${config.defaultTitle}`;
        props.dispatch(getAllPendItems());
        return () => {
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.items && props.items.items) {
            setItems(props.items.items);
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const deleteAllMedia = (id) => {
        let fileData =  {
            section: 'items',
            id: id,
            fileType: null,
            fileName: null,
            deleteAll: true
        };
        axios.post(`${API_PREFIX}/delete-dir`, fileData  )
            .then(res => { 
                console.log('Media deleted successfully')
            })
            .catch(err => { 
                console.log('No media deleted')
            });
    }

    const handleChoice = (itemId, choice) => {
        if (choice === 'accept') {
            props.dispatch(acceptItem(itemId, props.user.login.id))
        }
        if (choice === 'reject') {
            props.dispatch(deletePendItem(itemId));
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
                    <PendingItemCard key={i} item={item} handleChoicePass={handleChoice} />
                ))
            : <p>There are no pending items.</p>}
        </div>
    );
}

function mapStateToProps(state: any) {
    return {
        items:state.items
    }
}

export default connect(mapStateToProps)(PendingItemsView)

