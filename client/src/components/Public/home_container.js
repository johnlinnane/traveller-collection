import React, { Component } from 'react';
import { connect } from 'react-redux';

import ItemItem from './widgetsUI/item_item';
import { getItems } from '../../actions';
import NewsSlider from './../widgetsUI/Slider/slider';



class HomeContainer extends Component {

    componentDidMount() {
        this.props.dispatch(getItems(4,0,'asc'));
    }


    renderItems = (items) => (
        items.list && items.list.length ?    // list is an array of previously called items!
            items.list.map( (item, i) => (
                <ItemItem {...item} key={item._id}/>
            ))
        : null
    )


    loadmore = () => {
        let count = this.props.items.list.length;
        // console.log(count);
        this.props.dispatch(getItems(4,count,'asc',this.props.items.list))
    }

    
    render() {


        return (
            <div> 
                <NewsSlider
                    type="featured"
                    start={0}
                    amount={3}
                    settings={{
                    dots: false
                    }}
                />
                {this.renderItems(this.props.items)}

                <div 
                    className="loadmore"
                    onClick={this.loadmore}
                >Load More</div>

            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        items:state.items
    }
}


export default connect(mapStateToProps)(HomeContainer);