import React from 'react';
import Slick from 'react-slick';   // uses cdn css

const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

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
                for (let i = 0; i > 11; i++ ) {
                    return(
                        
                        <div key={i}>
                            <p>{i}</p>
                            <div className="featured_item">
                                <div className="featured_image"
                                    style={{
                                        background: `url(${FS_PREFIX}/assets/media/items/5eb4417bf2ff151113f3e11f/thumbnail/0.jpg)`
                                    }}
                                >
                                </div>
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