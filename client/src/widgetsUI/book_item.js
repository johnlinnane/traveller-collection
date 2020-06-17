import React from 'react';
import { Link } from 'react-router-dom';

const BookItem = (item) => {



    return (
        <div>
            <Link to={`/items/${item._id}`} className="book_item">



                

                 <div className="book_header">
                    <h2>{item.name}</h2>
                </div>
                 <div className="book_items">
                    <div className="book_author">{item.title}</div>

                    <div className="book_bubble">
                        <strong>Creator</strong> {item.creator}
                    </div>

                    <div className="book_bubble">
                        <strong>Subject</strong> {item.subject}
                    </div>

                    <div className="book_bubble rating">
                        <strong>ID</strong> {item.id}
                    </div>

                 </div>


            </Link>
        </div>
    );
};

export default BookItem;