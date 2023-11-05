import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";

import { getSubcat, getItemsBySubcat, getCatById } from '../../../actions';
import { addDefaultImg } from '../../../utils';
import Breadcrumb from '../../widgetsUI/breadcrumb';
import config from "../../../config";
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const SubcatView: React.FC = (props: any) => {
    
    const [navInfo, setNavInfo] = useState({
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    });
    const [showMap, setShowMap] = useState(false);

    const initLat = 53.342609;
    const initLong = -7.603976
    const initZoom = 8;

    useEffect(() => {
        if (props.match?.params?.id) {
            props.dispatch(getSubcat(props.match.params.id))
            props.dispatch(getItemsBySubcat(props.match.params.id))
        }
        return () => {
            document.title = config.defaultTitle;
        }
    }, [props.match?.params?.id]);

    useEffect(() => {
        if (props.catinfo?._id) {
            let tempNavInfo = {
                ...navInfo,
                catTitle: props.catinfo.title,
                catId: props.catinfo._id,
            }
            setNavInfo(tempNavInfo);
        }
    }, [props.catinfo]);

    useEffect(() => {
        if (props.subcat && props.subcat.length) {
            document.title = `${props.subcat[0].title} - Traveller Collection`
            let tempNavInfo = {
                ...navInfo,
                subCatTitle: props.subcat[0].title,
                subCatId: props.subcat[0]._id
            }
            setNavInfo(tempNavInfo);
            props.dispatch(getCatById(props.subcat[0].parent_cat))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.subcat]);

    useEffect(() => {
        if (props.subcatitems && props.subcatitems.length) {
            let hasMapCount = 0;
            props.subcatitems.forEach( (item, i) => {
                if (item.geo && item.geo.latitude && item.geo.longitude) {
                    hasMapCount++;
                }
            } )
            if (hasMapCount) {
                setShowMap(true);
            }
        }
    }, [props.subcatitems]);

    const addClick = () => {
        // const tempNewItemId = new mongoose.Types.ObjectId().toHexString()
        // this.setState({
        //     newItemId: tempNewItemId
        // })
        // let item = {
        //     _id: tempNewItemId,
        //     subcategory_ref : [this.state.navInfo.subCatId],
        //     category_ref: [this.state.navInfo.catId]
        // }
        // this.props.dispatch(createItem(item))
        setTimeout(() => {
            // this.props.history.push(`/user/edit-item/${tempNewItemId}`);
            props.history.push(`/add_item`);
        }, 1000)
    }

    const renderAddItem = (isPartOfGrid) => (
        <div 
            className={"btn-group pull-right " + (isPartOfGrid ? 'item_list_card' : 'item_list_add_card')}
            onClick={() => { if (window.confirm('Would you like to add an item to this section?')) addClick() }}
        >
            <div className="item_list_img">
                <img src={`/assets/media/icons/add_item_icon.jpg`} 
                    id="add_img"
                    alt="Add an item to this sub-category" 
                    onError={addDefaultImg} />
            </div>
            <div className="item_list_text">
                Add An Item
            </div>
        </div>
    )

    const renderMap = () => (
        <MapContainer 
            className="main_map"
            center={[initLat, initLong]} 
            zoom={initZoom} 
        >
            <TileLayer
                attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {props.subcatitems && props.subcatitems.length ?
                props.subcatitems.map( (item, i) => (
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
        </MapContainer>
    )

    return (
        <div className="subcat_view_component">
            <Breadcrumb navinfo={navInfo}/>
            <div className="main_view subcat_view">
                { props.subcatitems && props.subcatitems.length ?
                    <div className="subcat_view_flex_container">
                        { props.subcat && props.subcat.length  ?
                            <div className="subcat_view_title">
                                <h2>{props.subcat[0].title}</h2>
                            </div>
                        : null}
                        { props.subcatitems.map( (item, i) => (
                                <Link to={`/items/${item._id}`} key={i}>
                                    <div className="item_list_card">
                                        <div key={i} className="item_list_img">
                                            <img src={`${FS_PREFIX}/assets/media/items/${item._id}/sq_thumbnail/0.jpg`} 
                                                alt={item.title} 
                                                onError={addDefaultImg} />
                                        </div>
                                        
                                        <div className="item_list_text">
                                            {item.title}
                                        </div>
                                    
                                    </div>
                                </Link>
                        ))}                                                                
                        {renderAddItem(true)}
                    </div>
                : 
                    <div className="subcat_view_flex_container">
                        { props.subcat && props.subcat.length  ?
                            <div className="subcat_view_title">
                                <h2>{props.subcat[0].title}</h2>
                            </div>
                        : null}
                        {/* <p className="center">There are no items in this section.</p>                                               */}
                        {renderAddItem(false)}
                    </div>
                }

                {showMap ?
                    renderMap()
                : null }
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        subcat: state.cats.subcat,
        subcats: state.cats.subcats,
        subcatitems: state.cats.subcatitems,
        catinfo: state.cats.catinfo
    }
}

export default connect(mapStateToProps)(SubcatView);