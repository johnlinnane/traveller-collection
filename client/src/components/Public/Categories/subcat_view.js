import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import { getSubcat, getItemsBySubcat, getCatById } from '../../../actions';
import { addItem } from '../../../actions';
import NavigationBar from '../../widgetsUI/navigation';


const mongoose = require('mongoose');
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

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

        initLat: 53.342609,
        initLong: -7.603976,
        initZoom: 8,
        showMap: false
  
    }
    


    componentDidMount() {
        // console.log(this.props.match.params.id);
        this.props.dispatch(getSubcat(this.props.match.params.id))

        this.props.dispatch(getItemsBySubcat(this.props.match.params.id))
    }




    addDefaultImg = (ev) => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }


    componentDidUpdate(prevProps, prevState) {

        
        if (prevProps !== this.props) {


            if (this.props.subcat !== prevProps.subcat) {
                if (this.props.subcat && this.props.subcat.length) {

                    document.title = `${this.props.subcat[0].title} - Traveller Collection`

                    let tempNavInfo = {
                        ...this.state.navInfo,
                        subCatTitle: this.props.subcat[0].title,
                        subCatId: this.props.subcat[0]._id
                    }
    
                    this.setState({
                        navInfo: tempNavInfo
                    })

                    this.props.dispatch(getCatById(this.props.subcat[0].parent_cat))
                }
            }

            if (this.props.catinfo) {

                let tempNavInfo = {
                    ...this.state.navInfo,
                    catTitle: this.props.catinfo.title,
                    catId: this.props.catinfo._id,
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

        // const tempNewItemId = mongoose.Types.ObjectId().toHexString()

        // this.setState({
        //     newItemId: tempNewItemId
        // })
        

        // let item = {
        //     _id: tempNewItemId,
        //     subcategory_ref : [this.state.navInfo.subCatId],
        //     category_ref: [this.state.navInfo.catId]
        // }
        
        // this.props.dispatch(addItem(item))
        
        setTimeout(() => {
            // this.props.history.push(`/user/edit-item/${tempNewItemId}`);
            this.props.history.push(`/add_item`);
        }, 1000)

    }



    renderAddItem = (isPartOfGrid) => (
        <div 

        className={"btn-group pull-right " + (isPartOfGrid ? 'item_list_card' : 'item_list_add_card')}
            onClick={() => { if (window.confirm('Would you like to add an item to this section?')) this.addClick() }}
        >
            <div className="item_list_img">
                <img src={`/assets/media/icons/add_item_icon.jpg`} 
                    id="add_img"
                    alt="Add an item to this sub-category" 
                    onError={this.addDefaultImg} />
            </div>
            
            <div className="item_list_text">
                Add An Item
            </div>
        </div>


    )



    renderMap = () => (
            <Map 
                className="main_map"
                center={[this.state.initLat, this.state.initLong]} 
                zoom={this.state.initZoom} 
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
        console.log(this.props.subcat)
        return (
            <div className="subcat_view_component">
                <NavigationBar navinfo={this.state.navInfo}/>
                    <div className="main_view subcat_view">
                        

                        { this.props.subcatitems && this.props.subcatitems.length ?
                            <div className="subcat_view_flex_container">

                                { this.props.subcat && this.props.subcat.length  ?
                                    <div className="subcat_view_title">
                                        <h2>{this.props.subcat[0].title}</h2>
                                    </div>
                                : null}
                                
                                
                                { this.props.subcatitems.map( (item, i) => (
                                        <Link to={`/items/${item._id}`} key={i}>
                                            <div className="item_list_card">
                                                <div key={i} className="item_list_img">
                                                    <img src={`${FS_PREFIX}/assets/media/items/${item._id}/sq_thumbnail/0.jpg`} 
                                                        alt={item.title} 
                                                        onError={this.addDefaultImg} />
                                                </div>
                                                
                                                <div className="item_list_text">
                                                    {item.title}
                                                </div>
                                            
                                            </div>
                                        </Link>
                                ))}                                                                
                                {this.renderAddItem(true)}
                            </div>

                        : 
                        
                            <div className="subcat_view_flex_container">
                                { this.props.subcat && this.props.subcat.length  ?
                                    <div className="subcat_view_title">
                                        <h2>{this.props.subcat[0].title}</h2>
                                    </div>
                                : null}
                                {/* <p className="center">There are no items in this section.</p>                                               */}
                                {this.renderAddItem(false)}
                            </div>
                        }

                        {this.state.showMap ?
                            this.renderMap()
                        : null }
                        


                    </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        subcat: state.cats.subcat,
        subcats: state.cats.subcats,
        subcatitems: state.cats.subcatitems,
        catinfo: state.cats.catinfo
    }
}


export default connect(mapStateToProps)(SubcatView)