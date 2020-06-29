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

    // renderCatItem = (catId) => {
        
    // }

    navInfo = {
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    }


    render() {
        let cats = this.props.cats;

        let catsMap = null;

        if (cats) {
            catsMap = cats.map( (cat, i) => {
                // console.log(item);
                return (
                    <Link key={cat._id} to={`/category/${cat._id}`}>
                        <CatItem cat={cat}/>
                    </Link>

                )
            })
        }

        // console.log(cats);
        // let cats = this.props.cats;

        return (
            <div>
                <NavigationBar navinfo={this.navInfo}/>
                <div className="main_view">
                    
                    <div className="cat_list">
                        
                        {catsMap}
                    </div>
                </div>
            </div>

            // cats ?
            //     cats.map( (cat, i) => (
            //             <Link key={cat._id} to={`/category/${cat.cat_id}`}>
            //                 <h2>{cat.title}</h2><br/>
            //                 {/* {renderCatItem(cat.cat_id)} */}
            //                 <CatItem catId={cat.cat_id} catInfo={this.props.cats}/>
            //             </Link>
            //     ))
            // : null


            
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