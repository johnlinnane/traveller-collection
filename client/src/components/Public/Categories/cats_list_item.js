import React from 'react';

const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const CatItem = (props) => {
    

    const addDefaultImg = (ev) => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
        
    } 

    

    
    return (
        <div className="cat_item_card">
            <div className="cat_item_img">
                    <img src={`${FS_PREFIX}/assets/media/cover_img_cat/${props.cat._id}.jpg`} alt="category cover" onError={addDefaultImg} />
            </div>

            <div className="cat_item_text">
                <h2><b>{props.cat.title}</b></h2>
                {props.cat.description ? props.cat.description : null }<br />


            </div>

           





        </div>
    );
};

export default CatItem;