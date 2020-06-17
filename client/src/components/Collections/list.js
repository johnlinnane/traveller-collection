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
    // componentWillUnmount() {
    //     this.props.dispatch(clearItemWithContributor());
    // }




    // renderItem = (items) => {
    //     console.log(items);
    //     return ( items.item ?
    //         <div className="br_container">
    //             <div className="br_header">
    //                 <h2>{items.item.title}</h2>
    //                 <h5>{items.item.creator}</h5>
    //                 <div className="br_reviewer">
    //                     {/* <span>Reviewed by: </span>{items.reviewer.name} {items.reviewer.lastname} */}
    //                     <span>Reviewed by: </span>{items.contributor.name} {items.contributor.lastname}
    //                 </div>
    //             </div>

    //             <div className="br_review">
    //                 {items.item.description}
    //             </div>

    //             <div className="br_box">
                    
    //                 <div className="left">
    //                     <div>
    //                         <span>Pages:</span> {items.item.pages}
    //                     </div>
    //                     <div>
    //                         <span>ID:</span> {items.item.id}
    //                     </div>
    //                 </div>
                        
    //                 <div className="right">
    //                     <span>ID</span>
    //                     <div>{items.item.id}</div>
    //                 </div>
    //             </div>


    //         </div>
    //     : null
    // )}


    render() {
        
        // console.log(this.props.collections);
        
        // console.log(this.props.match.params.id);


        let collections = this.props.collections;

        let items = null;

        if (this.props.collections) {
            items = collections.map( (item, i) => {
                // console.log(item);
                return (
                    <Link key={item._id} to={`/collection/${item.id}`}>
                        <CollListItem item={item}/>
                    </Link>

                )
            })
        }

        return (
            // <div className="coll_list">
            <div className="main_view">
                <NavigationBar navinfo={this.state.navInfo}/>  
                <div>
                    {/* {this.props.collections ? */}
                    
                        
                            {items}
                            
                    {/* : null} */}
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
