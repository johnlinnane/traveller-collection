import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';



import NavigationBar from '../../widgetsUI/navigation';
import { getAllCats } from '../../actions';
// import { getItemsByCat } from '../../actions';

import CatItem from './cats_list_item';





class CatList extends Component {


    componentDidMount() {
        this.props.dispatch(getAllCats());
        // this.props.dispatch(getItemsByCat(this.props.catInfo.cat_id));
        // this.props.dispatch(getItemsWithCat(this.props.catInfo.cat_id));

    }

    navInfo = {
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    }


    render() {
        let cats = this.props.cats;

        return (
            <div>
                <NavigationBar navinfo={this.navInfo}/>
                <div className="main_view">
                    
                    {/* <div className="cat_list"> */}
                    <div className="cat_items_view">
                        <h2>Categories</h2>

                        { cats && cats.length ?
                            cats.map( (cat, i) => (
                                <Link key={cat._id} to={`/category/${cat._id}`}>
                                    <CatItem cat={cat}/>
                                </Link>
                        
                            ))
                        : null }
                    </div>
                </div>
            </div>

            
        );
    }
}

function mapStateToProps(state) {
    // console.log(state);
    return {
        cats: state.cats.cats,
        items: state.cats.catitems
    }
}


export default connect(mapStateToProps)(CatList)