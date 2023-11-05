import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from 'leaflet'

import { getItemsWithCoords } from '../../../actions';
import config from "../../../config";

const MainMap = (props: any) => {
    const initLat = 53.342609;
    const initLong = -7.603976;
    const initZoom = 8;

    useEffect(() => {
        document.title = `Map - ${config.defaultTitle}`
        props.dispatch(getItemsWithCoords());
        return () => {
            document.title = config.defaultTitle;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="map_page_wrapper">
            <div className="map_header">
                <span>Click on a point on the map to take you to the item.</span>
            </div>

            <MapContainer 
                className="main_map"
                center={[initLat, initLong]} 
                zoom={initZoom} 
            >
                <TileLayer
                    attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {props.items.items && props.items.items.length ?
                    <div>
                        {props.items.items.map( (item, i) => (
                            item.geo && item.geo.latitude && item.geo.longitude ?
                                <Marker 
                                    position={[item.geo.latitude, item.geo.longitude]} 
                                    key={i}
                                    icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
                                >
                                    <Popup>
                                        <Link to={`/items/${item._id}`} target="_blank">
                                            <span><b>{item.title}</b></span>
                                            <br/>
                                            {item.geo.address ?
                                                <div>
                                                    <span>{item.geo.address}</span><br/>
                                                    <br/>
                                                </div>
                                            : null}
                                        </Link>
                                    </Popup>
                                </Marker>
                            : null
                        ) )}     
                    </div>
                : null}
            </MapContainer>
        </div>
    );
}

function mapStateToProps(state: any) {
    return {
        items: state.items
    }
}

export default connect(mapStateToProps)(MainMap);