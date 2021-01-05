import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import { getSubcat, getItemsBySubcat, getCatById } from '../../../actions';
import { addItem } from '../../../actions';
import NavigationBar from '../widgetsUI/navigation';


var mongoose = require('mongoose');

class SubcatView  extends Component {
    
   

    state = {
        newItemId: null,
        
        navInfo: {
            catTitle: null,
            catId: null,
            subCatTitle: null,
            subCatId: null,
            type: 'Categories'
        },
        catDispatched: false,

        initLat: 53.342609,
        initLong: -7.603976,
        initZoom: 8,
        showMap: false
  
    }
    


    componentDidMount() {
        this.props.dispatch(getSubcat(this.props.match.params.id))
        this.props.dispatch(getItemsBySubcat(this.props.match.params.id))
    }




    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }


    componentDidUpdate(prevProps, prevState) {

        
        if (prevProps !== this.props) {
            if (this.props.subcat && !this.state.catDispatched) {
                document.title = `${this.props.subcat.title} - Traveller Collection`
                this.props.dispatch(getCatById(this.props.subcat.parent_cat))
                this.setState({
                    catDispatched: true
                })
            }

            if (this.props.catinfo && this.props.subcat) {

                let tempNavInfo = {
                    ...this.state.navInfo,
                    catTitle: this.props.catinfo.title,
                    catId: this.props.catinfo._id,
                    subCatTitle: this.props.subcat.title,
                    subCatId: this.props.subcat._id
                }

                this.setState({
                    navInfo: tempNavInfo
                })
            }
           
            if (this.props.subcatitems !== prevProps.subcatitems) {
                if (this.props.subcatitems && this.props.subcatitems.length) {
                    let hasMapCount = 0;
                    this.props.subcatitems.forEach( (item, i) => {
                        if (item.geo && item.geo.latitude && item.geo.longitude) {
                            hasMapCount++;
                        }
                    } )
                    if (hasMapCount) {
                        this.setState({
                            showMap: true
                        })
                    }
                }
            }
        }
    }
    componentWillUnmount() {
        document.title = `Traveller Collection`
    }

    addClick = () => {

        const tempNewItemId = mongoose.Types.ObjectId().toHexString()

        this.setState({
            newItemId: tempNewItemId
        })
        

        let item = {
            _id: tempNewItemId,
            subcategory_ref : [this.state.navInfo.subCatId],
            category_ref: [this.state.navInfo.catId]
        }
        
        this.props.dispatch(addItem(item))
        
        setTimeout(() => {
            this.props.history.push(`/user/edit-item/${tempNewItemId}`)
        }, 1000)

    }



    renderAddItem = () => (
        <figure 
            className="item_list_add item_list_figure"
            onClick={() => { if (window.confirm('Would you like to add an item to this section?')) this.addClick() }}
        >
            <img src={`/media/icons/add_item_icon.jpg`} 
                id="add_img"
                alt="Add an item to this sub-category" 
                onError={this.addDefaultImg} />
            <figcaption className="item_list_add_text">Add Item</figcaption>
        </figure>
    )



    renderItems = () => {
        return(
                <div className="subcat_render_items">
                    { this.props.subcatitems.map( (item, i) => (
                        <div key={i}>
                            <Link to={`/items/${item._id}`} key={i}>
                                <figure key={i}  className="item_list_figure">
                                    <img src={`/media/items/${item._id}/sq_thumbnail/0.jpg`} 
                                        alt={item.title} 
                                        onError={this.addDefaultImg} />
                                    <figcaption>{item.title}</figcaption>
                                </figure>
                                
                            </Link>
                        </div>
                    ))}
                    
                    {this.renderAddItem()}
                </div>
                    
        
        )
    }

    renderMap = () => (
            <Map 
                className="main_map"
                center={[this.state.initLat, this.state.initLong]} 
                zoom={this.state.initZoom} 
                // style={{ height: this.state.showMap ? '350px' : '0px'}}
            >
                <TileLayer
                    attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />


                {this.props.subcatitems && this.props.subcatitems.length ?
                    this.props.subcatitems.map( (item, i) => (
                        item.geo && item.geo.latitude && item.geo.longitude ?
                            <Marker 
                                position={[item.geo.latitude, item.geo.longitude]} 
                                key={i}
                            >   
                                <Popup>
                                    <Link to={`/items/${item._id}`} target="_blank">
                                        <span><b>{item.title}</b></span>
                                        <br/>
                                        {item.address ?
                                            <div>
                                                <span>{item.address}</span><br/>
                                                <br/>
                                            </div>
                                        : null}
                                        <span>{item.geo.latitude}, {item.geo.longitude}</span><br/>
                                    </Link>
                                </Popup>
                            </Marker>
                        : null
                    ))
                : null }



            </Map>
    )

    render() {


        

    
        return (
            <div className="subcat_view_component">
                <NavigationBar navinfo={this.state.navInfo}/>
                    <div className="main_view cat_view">
                        
                        { this.props.subcat && this.props.subcat.title ?
                            <h2 className="title">{this.props.subcat.title}</h2>
                        : null}

                        { this.props.subcat && this.props.subcat.description ?
                            <p className="description">{this.props.subcat.description}</p>
                        : null}

                        <hr />
                        <div className="cat_grid_flex_container">
                            <div className="cat_grid_column">
                                { this.props.subcatitems && this.props.subcatitems.length ?
                                    this.renderItems()
                            
                                : 
                                <div>
                                    <p className="center">There are no items in this section.</p>
                                    
                                    {this.renderAddItem()}
                                </div>
                                }
                            </div>
                        </div>     

                        {this.state.showMap ?
                            this.renderMap()
                        : null }
                        


                    </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    // console.log(state)
    return {
        // catitems: state.cats.catitems,
        // catinfo: state.cats.catinfo,
        subcat: state.cats.subcat,
        subcats: state.cats.subcats,
        subcatitems: state.cats.subcatitems,
        catinfo: state.cats.catinfo
        
    }
}


export default connect(mapStateToProps)(SubcatView)