import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const ItemList = (props: any) => {

    const itemArray = props.items;

    const showItemList = items => (
        items?.length ?
            items.map(item => (
                <tr key={item._id}> 
                    <td>
                        <Link to={`/edit-item/${item._id}`}>
                            <u>{item.title}</u>
                        </Link>
                    </td>
                    <td>{item.creator}</td>
                </tr>
            ))
        : null
    )

    const showItemCount = items => (
        items?.length ?
            <span>({items.length})</span>
        : null
    )

    return (
        <div className="user_posts">
            <h4>Your Items {showItemCount(itemArray)}</h4>
            <table className="item_list">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Creator</th>
                    </tr>
                </thead>
                <tbody>
                    {showItemList(itemArray)}
                </tbody>
            </table>
        </div>
    );
};

export default ItemList;