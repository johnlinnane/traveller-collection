import React from 'react';
import { Link } from 'react-router-dom';


const SearchItem = ({item}) => {

    const addDefaultImg = (ev) => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    } 

    return(
      
        // INSERT LINK HERE
        <Link to={`/items/${item._id}`}>


            <div className="search_container news_item item_grey">
              <div className="search_item_image">
                  <img src={`/assets/media/items/${item._id}/original/0.jpg`} 
                      alt="Item" 
                      onError={addDefaultImg}
                      className="search_item_img"/>
                  
              </div>
              
              <div className="search_item_info">
                  <h3>{item.title}</h3>
                  
                  { item.creator ?
                      <span>
                        <b>Creator: </b>{item.creator}
                      </span>
                  : null }
                  
              </div>
            </div>
        </Link>
    )
}

export default SearchItem;


