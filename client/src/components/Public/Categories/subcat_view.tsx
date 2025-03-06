import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from 'leaflet'
import { useParams, useNavigate } from "react-router-dom";

import { getSubcat, getItemsBySubcat, getCatById } from '../../../../src/slices/catsSlice';
import { addDefaultImg } from '../../../utils';
import Breadcrumb from '../../widgetsUI/breadcrumb';
import config from "../../../config";
import { NavInfo } from '../../../types';
import { AppDispatch } from '../../../../src/index';

const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const SubcatView: React.FC = (props: any) => {
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();
    const navigate = useNavigate();

    const [navInfo, setNavInfo] = useState<NavInfo>({
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
        if (params?.id) {
            dispatch(getSubcat(params.id))
            dispatch(getItemsBySubcat(params.id))
        }
        return () => {
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.id]);

    useEffect(() => {
        if (props.catinfo?._id) {

            setNavInfo(prevNavInfo => ({
                ...prevNavInfo,
                catTitle: props.catinfo.title,
                catId: props.catinfo._id
            }));
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
            dispatch(getCatById(props.subcat[0].parent_cat))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.subcat]);

    useEffect(() => {
        if (props.subcatitems && props.subcatitems.length) {
            props.subcatitems.forEach( (item, i) => {
                if (item.geo && item.geo.latitude && item.geo.longitude) {
                    setShowMap(true);
                }
            });
        }
    }, [props.subcatitems]);

    const addItemHandler = () => {
        let paramString = '';
        if (props.catinfo?._id && typeof props.catinfo._id === 'string') {
            paramString = `/${props.catinfo._id}`;
            if (props.subcat[0]?._id && typeof props.subcat[0]?._id === 'string') {
                paramString += `/${props.subcat[0]._id}`;
            }
        }
        navigate(`/create-item${paramString}`);
    }

    const renderAddItem = (isPartOfGrid) => (
        <div 
            className={"btn-group pull-right " + (isPartOfGrid ? 'item_list_card' : 'item_list_add_card')}
            onClick={() => { addItemHandler() }}
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
                    item.geo?.latitude && item.geo?.longitude && !item.isPending?
                        <Marker 
                            position={[item.geo.latitude, item.geo.longitude]} 
                            key={i}
                            icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
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
                        { props.subcatitems.map( (item, i) => !item.isPending && (
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