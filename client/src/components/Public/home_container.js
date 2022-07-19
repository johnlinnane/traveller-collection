import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import ItemListOldHomepage from './../widgetsUI/item_list_old_homepage';
import { getItems } from '../../actions';
import SlickCarouselOldHomepage from './../widgetsUI/Slider/slider';

function HomeContainer(props) {

    useEffect(() => {
        props.dispatch(getItems(4,0,'asc'));
    });

    const renderItems = () => (
        props.items.list && props.items.list.length ? 
            props.items.list.map( (item, i) => (
                <ItemListOldHomepage {...item} key={item._id}/>
            ))
        : null
    )

    const loadmore = () => {
        let count = props.items.list.length;
        props.dispatch(getItems(4,count,'asc',props.items.list))
    }
    
    return (
        <div> 
            <SlickCarouselOldHomepage
                type="featured"
                start={0}
                amount={3}
                settings={{
                dots: false
                }}
            />
            {renderItems(props.items)}

            <div 
                className="loadmore"
                onClick={loadmore}
            >Load More</div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        items:state.items
    }
}

export default connect(mapStateToProps)(HomeContainer);