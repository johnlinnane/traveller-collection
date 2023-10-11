import React from 'react';
import SearchItem from './search_list_item'

function SearchList(props) {
    if (props.results && props.results.length) {
        const items = props.results.map( (item) => {
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