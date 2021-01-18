import React from 'react';

// import '../css/styles.css' (not used)





const SearchHeader = (props) => {





    return (
        <div className="search_input form_input">  

          {/* <div className="logo">Search</div> */}
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