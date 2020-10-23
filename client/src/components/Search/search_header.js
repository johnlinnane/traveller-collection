import React from 'react';

// import '../css/styles.css' (not used)





const SearchHeader = (props) => {





    return (
        <div className="search_input rl_container">  

          {/* <div className="logo">Search</div> */}
          <input 
            type="text" 
            onChange={props.keywords}
            placeholder={props.placeholder}
            
          />
    
        </div>
    )
  
}

export default SearchHeader;  