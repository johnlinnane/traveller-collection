import React from 'react';
import { Link } from 'react-router-dom';
import { addDefaultImg } from '../../../utils';
import { Item } from '../../../types';
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

interface PendingItemProps {
    item: Item;
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
                <b>Title:</b> {props.item.title}<br />
                <b>Creator:</b> {props.item.creator}<br />
            </div>
            <div className="p_item_accept">
                <button 
                    type="button" 
                    onClick={() => { if (window.confirm('This will add the item to the collection.')) props.handleChoicePass(props.item._id, 'accept') } }
                >
                    Accept
                </button>
                <button 
                    type="button" 
                    onClick={() =>  { if (window.confirm('Are you sure you wish to permanently delete this item and all associated media?')) props.handleChoicePass(props.item._id, 'reject') } }
                >
                    Reject
                </button>
            </div>
        </div>
    );
};

export default PendingItem;