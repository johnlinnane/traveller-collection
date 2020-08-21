import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


import { getAllColls } from '../../actions';
// import { clearItemWithContributor } from '../../actions';
import CollListItem from './list_item';
import NavigationBar from '../../widgetsUI/navigation';



class CollList extends Component {




    componentDidMount() {
        this.props.dispatch(getAllColls());
    }

    state = {
        navInfo: {
            catTitle: null,
            catId: null,
            subCatTitle: null,
            subCatId: null,
            type: 'Collections'
        }
    }


    render() {


        let collections = this.props.collections;

        let items = null;

        if (this.props.collections && this.props.collections.length) {
            items = collections.map( (item, i) => {
                return (
                    <Link key={item._id} to={`/collection/${item.id}`}>
                        <CollListItem item={item}/>
                    </Link>

                )
            })
        }

        return (
            // <div className="coll_list">
            <div>
                <NavigationBar navinfo={this.state.navInfo}/>  

                <div className="main_view">
                    <div>
                            {items}
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        collections: state.collections.colls
    }
}


export default connect(mapStateToProps)(CollList)
