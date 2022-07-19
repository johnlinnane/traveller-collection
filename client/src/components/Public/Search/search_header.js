import React from 'react';

const SearchHeader = props => {
    return (
        <div className="search_input form_input">  
          <input 
            type="text" 
            onChange={props.keywords}
            placeholder={props.placeholder}
            autoComplete="off"
          />
        </div>
    )
}

export default SearchHeader;  