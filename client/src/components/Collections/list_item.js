import React from 'react';
// import {css} from 'glamor';

// const CollsItem = ({item}) => {
const CollListItem = (props) => {
    
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

      
    console.log(props)

    return(
      
        // INSERT LINK HERE

        // <div className="coll_list_item">
        <div>
            
            {/* <img src={`/images/items/${props.item.cover_item}/sq_thumbnail/0.jpg`} */}
            {/* <img src={`/images/cover_img_coll/${props.item.id}.jpg`}
                alt={"Item"}
                // onError={"if (this.src != '/images/default/default.jpg') this.src = '/images/default/default.jpg';"} />
                onError={addDefaultImg} 
            />

            <div className="overlay">
                <h3>{props.item.title}</h3>
            </div> */}



            <div className="cat_list">
                <div className="container">

                    <div className="img_back">
                        <img src={`/images/cover_img_coll/${props.item.id}.jpg`} alt="category cover" onError={addDefaultImg} />
                    </div>
                    <div class="centered"><h1>{props.item.title}</h1></div>

                    
                </div>
            </div>

            {/* <img onError={this.addDefaultImg} className="img-responsive" src={newsImage} alt={headline}/> */}
            

            {/* <div className="description">
                {props.item.description}
            </div> */}
            
        </div>
    )
}

export default CollListItem;


