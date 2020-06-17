import React from 'react';
import {css} from 'glamor';
import { Link } from 'react-router-dom';


const NewsItem = ({item}) => {
  
  // let news_item = css({
  //   padding: '20px', 
  //   boxSizing: 'border-box',
  //   borderBottom: '1px solid grey',
  //   ':hover': {
  //     color: 'red'
  //   },
  //   '@media(max-width: 500px)': {
  //     color: 'blue'
  //   }
  // })
  
  // let item_grey = css({
  //   background: 'lightgrey'
  // })

    const addDefaultImg = (ev) => {
        const newImg = '/images/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    } 

    console.log(item);
    return(
      
        // INSERT LINK HERE
        <Link to={`/items/${item._id}`}>


            <div className="search_container news_item item_grey">
              <div className="search_item_image">
                  <img src={`/images/items/${item._id}/original/0.jpg`} 
                      alt="Item" 
                      onError={addDefaultImg}
                      className="search_item_img"/>
                  
              </div>
              
              <div className="search_item_info">
                  <h3>{item.title}</h3>
                  
                  { item.creator ?
                      <div>
                        <b>Creator: </b>{item.creator}
                      </div>
                  : null }
                  
              </div>
            </div>
        </Link>
    )
}

export default NewsItem;


