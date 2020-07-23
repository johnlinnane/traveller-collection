import React from 'react';
import Slick from 'react-slick';   // uses cdn css
import { Link } from 'react-router-dom';

import style from './slider.module.css';

const ItemImageSlider = (props) => {


    let template = null;

    const settings = {
        dots: false,
        infinite: true,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        ...props.settings
    }



            template = () => {
                console.log('template');
                // props.data.list.map( (item, i) => {
                for (let i = 0; i > 11; i++ ) {
                    return(
                        
                        <div key={i}>
                            <p>{i}</p>
                            {/* <div className={style.featured_item}> */}
                            <div className="featured_item">
                                {/* <div className={style.featured_image} */}
                                <div className="featured_image"
                                    style={{
                                        // background: `url(/media/items/${item._id}/thumbnail/0.jpg)`
                                        background: `url(/media/items/5eb4417bf2ff151113f3e11f/thumbnail/0.jpg)`
                                    }}
                                >
                                </div>

                                {/* <Link to={`./items/${item._id}`}>
                                    <div className={style.featured_caption}>
                                        {item.title}
                                    </div>
                                </Link> */}
                            </div>
                        </div>
                    )
            }}





    return(
        <Slick {...settings}>
            {template()}
        </Slick>
    )
}

export default ItemImageSlider;