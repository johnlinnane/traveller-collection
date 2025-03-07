import React from 'react';
import { Link } from 'react-router-dom';

import { addDefaultImg } from '../../../utils';
import { Item } from '../../../types';

const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;


interface PendingItemProps {
    item: Item;
    catTitle: string | null;
    subcatTitle: string | null;
    handleChoicePass: (itemId: string, choice: 'accept' | 'reject') => void;
}

const PendingItem: React.FC<PendingItemProps> = (props: any) => {
    return (
        <div className="p_item_card">
            <div className="p_item_img">
                <Link to={`/items/${props.item._id}`} target="_blank">
                    <img src={`${FS_PREFIX}/assets/media/items/${props.item._id}/sq_thumbnail/0.jpg`} alt={props.item.name} onError={addDefaultImg} />
                </Link>
            </div>
            <div className="p_item_text">
                <Link to={`/items/${props.item._id}`} target="_blank">
                    <b>Title:</b> {props.item.title ? props.item.title : '<NO TITLE>'}<br />
                </Link>
                {props.item.creator && (<p><b>Creator:</b> {props.item.creator}</p>)}
                {props.catTitle && (<p><b>Category:</b> {props.catTitle}</p>)}
                {props.subcatTitle && (<p><b>Subcategory:</b> {props.subcatTitle}</p>)}

            </div>
            <div className="p_item_accept">
                <button 
                    type="button" 
                    style={{ margin: '3px' }}
                    onClick={() => { if (window.confirm('This will add the item to the collection.')) props.handleChoicePass(props.item._id, 'accept') } }
                >
                    Accept
                </button>
                <button 
                    type="button" 
                    style={{ margin: '3px' }}
                    onClick={() =>  { if (window.confirm('Are you sure you wish to permanently delete this item and all associated media?')) props.handleChoicePass(props.item._id, 'reject') } }
                >
                    Reject
                </button>
                <Link to={`/items/${props.item._id}`} target="_blank">
                <button 
                    type="button" 
                    style={{ margin: '3px' }}
                >
                    View Item
                </button>
                </Link>
            </div>
        </div>
    );
};

export default PendingItem;