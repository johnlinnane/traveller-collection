import React from 'react';

// import '../css/styles.css' (not used)





const SearchHeader = (props) => {





    return (
      // <header>
      <div className="rl_container">
      <div className="search_input">  

        {/* <div className="logo">Search</div> */}
        <input 
          type="text" 
          onChange={props.keywords}
          placeholder={props.placeholder}
          
        />
  
      </div>
      </div>
      // </header>
    )
  
}

export default SearchHeader;  