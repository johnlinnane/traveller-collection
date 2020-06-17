import React from 'react';
import {css} from 'glamor';

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

  return(
    
      // INSERT LINK HERE

      <div className="news_item item_grey">

         <h3>{item.title}</h3>
         <div>
           Description: {item.description}
         </div>
         <div>
           Date: {item.date}
         </div>
      </div>
  )
}

export default NewsItem;


