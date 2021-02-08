import React from 'react';
import { Link } from 'react-router-dom';

const ItemItem = (item) => {



    return (
        <div>
            <Link to={`/items/${item._id}`} className="item_item">



                

                 <div className="widget_item_header">
                    <h2>{item.name}</h2>
                </div>
                 <div className="item_items">
                    <div className="item_author">{item.title}</div>

                    <div className="item_bubble">
                        <strong>Creator</strong> {item.creator}
                    </div>

                    <div className="item_bubble">
                        <strong>Subject</strong> {item.subject}
                    </div>

                    <div className="item_bubble rating">
                        <strong>ID</strong> {item.id}
                    </div>

                 </div>


            </Link>
        </div>
    );
};

export default ItemItem;