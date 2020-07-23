import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// import PanelView from '../PanelView/panel_view';




import { getCollById, searchItem } from '../../actions';
// import { getCollWithItems } from '../../actions';
import NavigationBar from '../../widgetsUI/navigation';



class Collection  extends Component {

    state = {
        info: []
    }

    navInfo = {
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        collTitle: null,
        collId: null,
        type: 'Collections'
    }


    componentDidMount() {
        let queryId = this.props.match.params.id;
        this.props.dispatch(getCollById(queryId));
        this.props.dispatch(searchItem('collection_id', queryId))
    }




    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }


    renderColl = (coll) => {
        let imageId = null;

        if (coll && coll.length) {
          imageId = coll[0].cover_item;
        
        }
        return ( coll && coll.length ?
            <div>
                <h1>{coll[0].title}</h1> 
                <hr />

                <h2>Description</h2> {coll[0].description}
                <h2>Subject</h2> {coll[0].subject}
                { coll[0].format ? 
                    <span><h2>Format</h2>{coll[0].format}</span>
                : null }
                <hr />
                <h1>Items</h1>
                <hr />
            </div>
            : null
        )

    }





    renderGrid = () => {
        return(
            <div className="coll_grid_row">
                <div className="coll_grid_column">

                    { this.props.items ? 
                        this.props.items.map ( (item, i) => (
                            <Link to={`/items/${item._id}`}key={i}>
                                <figure>
                                    <img src={`/media/items/${item._id}/sq_thumbnail/0.jpg`} 
                                        alt={item.title} 
                                        onError={this.addDefaultImg} />
                                    <figcaption>{item.title}</figcaption>
                                </figure>
                            </Link>
                        ))
                    : <p className="center">There are no items in this category.</p> }

                </div>
            </div>
    )}
 

    getCollName = () => {
        if (this.props.coll && this.props.coll.length) {
            this.navInfo.collTitle = this.props.coll[0].title;
            this.navInfo.collId = this.props.coll[0].id;
        }
    }


    render() {
        // console.log(this.props.coll);
        console.log(this.props);
        this.getCollName();
        
        return (
            <div>
                <NavigationBar navinfo={this.navInfo}/>

                <div className="main_view">

                  
                    {this.renderColl(this.props.coll)}
               
                    {this.renderGrid()}

                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    console.log(state);
    return {
        items: state.items.data,
        coll: state.collections.coll

    }
}


export default connect(mapStateToProps)(Collection)