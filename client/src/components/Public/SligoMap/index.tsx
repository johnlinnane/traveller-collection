import React from 'react';
import { connect } from 'react-redux';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
// import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from 'leaflet'

const SligoMap = (props: any) => {

    var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });


    return (
        <div
            style={{
                position: 'relative', // Set container position to relative
                width: '100vw', // 100% of viewport width
                height: '100vh', // 100% of viewport height
                margin: 0,
                padding: 0,
                overflow: 'hidden'
            }}
        >
            {/* <img
                alt="MapUpdated"
                src="/assets/media/sligo-map/MapUpdated.png"
                style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', 
                    zIndex: -1 
                }}
            /> */}

            

            <MapContainer 
                className="main_map"
                center={[54.20638315779152, -8.57869767149748]} 
                zoom={9} 
            >
                <TileLayer
                    attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
                />
                


                {/* {props.items.items && props.items.items.length ?
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
                : null} */}
            </MapContainer>

            <img 
                alt="Leafy Frame"
                src="/assets/media/sligo-map/Frame-Full.png"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />

        </div>
        
    );
}

function mapStateToProps(state: any) {
    return {
        // items: state.items
    }
}

export default connect(mapStateToProps)(SligoMap);