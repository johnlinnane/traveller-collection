import React from 'react';
import NewsItem from './news_list_item'

// access the props from index.js
const NewsList = (props) => {



    if (props.news) {



        const items = props.news.map( (item) => {
            return (
                <NewsItem key={item._id} item={item} />
            )
        })

        return (
          <div className="newslist_component">
            {props.children}  
            {items}
          </div>
        )
    } else {
      return null;
    }

    
}

export default NewsList;