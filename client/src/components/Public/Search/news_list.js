import React from 'react';
import SearchItem from './news_list_item'

function SearchList(props) {
    if (props.news) {
        const items = props.news.map( (item) => {
            return (
                <SearchItem key={item._id} item={item} />
            )
        })
        return (
            <div className="SearchList_component">
                {props.children}  
                {items}
            </div>
        )
    } else {
        return null;
    }
}

export default SearchList;