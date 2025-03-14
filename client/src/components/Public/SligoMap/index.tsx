import React, { useState, useRef, useEffect } from 'react';import { connect } from 'react-redux';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'; // LayersControl, LayerGroup, Circle, FeatureGroup, Rectangle
import { Link } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
// import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from 'leaflet'

const STADIA_MAPS_API_KEY = process.env.REACT_APP_STADIA_MAPS_API_KEY;

const SligoMap = (props: any) => {

    // var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // });



    const wrapperStyles = {
        // position: 'relative',
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
    };

    const mainMapStyles = {
        width: '100vw',
        height: '100vh',
        margin: '0'   
    }

    const [isVisible, setIsVisible] = useState(true);
    const [selectedType, setSelectedType] = useState<null | 'halting' | 'recent' | 'traditional'>(null);
    const imageRef = useRef(null);
    

    const stadiaURL = `https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg?api_key=${STADIA_MAPS_API_KEY}`;

    // Close the image when clicking outside
    const handleClickOutside = (event) => {
        if (imageRef.current && !imageRef.current.contains(event.target)) {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    const siteData = [
        {
            siteType: 'halting',
            title: 'Test Halting Site',
            lat: 54.250159,
            long: -8.745358
        },
        {
            siteType: 'halting',
            title: 'Test Halting Site 2',
            lat: 54.275837,
            long: -8.466647
        },
        {
            siteType: 'recent',
            title: 'Test Recent Site',
            lat: 54.19669618071106,
            long: -8.62453610206479
        },
        {
            siteType: 'recent',
            title: 'Test Recent Site 2',
            lat: 54.18784344217345,
            long: -8.714913148770755
        },
        {
            siteType: 'traditional',
            title: 'Test Traditional Site',
            lat: 54.25090159803158, 
            long: -8.78571412294487
        },
        {
            siteType: 'traditional',
            title: 'Test Traditional Site 2',
            lat: 54.11649181306498, 
            long: -8.691072525972512
        }
    ]

    return (
        <div
            id='wrapper'
            style={wrapperStyles}
        >
            <img
                alt="MapUpdated"
                src="/assets/media/sligo-map/Frame1of3.png"
                style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    // width: isVisible ? '100%' : '200%', 
                    height: '100%',
                    // height: isVisible ? '100%' : '200%', 
                    objectFit: 'cover', 
                    zIndex: 1,
                    opacity: isVisible ? '1' : '0', 
                    transition: 'opacity 1s ease, width 1s ease, height 1s ease'
                }}
            />
            <img
                ref={imageRef}
                id='title'
                alt="MapUpdated"
                src="/assets/media/sligo-map/Headings - Title.png"
                style={{ 
                    position: 'absolute',
                    top: '10vh',
                    left: 0,
                    right: 0,
                    margin: 'auto',
                    width: '50%',
                    // height: '100%',
                    objectFit: 'cover', 
                    zIndex: 1,
                    
                    opacity: isVisible ? '1' : '0', 
                    transition: 'opacity 1s ease'
                }}
            />
            <div
                style={{ 
                    position: 'absolute',
                    top: isVisible ? '70vh' : '80vh',
                    left: 0,
                    right: 0,
                    margin: 'auto',
                    // width: '10%',
                    // // height: '100%',
                    textAlign: 'center',
                    objectFit: 'cover', 
                    zIndex: 1,
                    
                    // opacity: isVisible ? '1' : '0', 
                    // transition: 'opacity 1s ease'
                    transition: 'top 1s ease'
                }}
            >
                <img
                    ref={imageRef}
                    alt="MapUpdated"
                    src="/assets/media/sligo-map/Buttons - Halting Sites.png"
                    style={{ 
                        // position: 'absolute',
                        // top: '50vh',
                        // left: 0,
                        // right: 0,
                        // margin: 'auto',
                        // width: '10%',
                        height: '70px',
                        padding: '5px',
                        // objectFit: 'cover', 
                        // zIndex: 1,
                        
                        // opacity: isVisible ? '1' : '0', 
                        // transition: 'opacity 1s ease',
                        cursor: 'pointer'
                        
                    }}
                    onClick={() => {
                        setSelectedType('halting');
                    }}
                />

                <img
                    ref={imageRef}
                    alt="MapUpdated"
                    src="/assets/media/sligo-map/Buttons - Recent Sites.png"
                    style={{ 
                        // position: 'absolute',
                        // top: '10vh',
                        // left: 0,
                        // right: 0,
                        // margin: 'auto',
                        // width: '10%',
                        // height: '100%',
                        height: '70px',
                        padding: '5px',
                        // objectFit: 'cover', 
                        // zIndex: 1,
                        
                        // opacity: isVisible ? '1' : '0', 
                        // transition: 'opacity 1s ease'
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        setSelectedType('recent');
                    }}
                />
                <img
                    ref={imageRef}
                    alt="MapUpdated"
                    src="/assets/media/sligo-map/Buttons - Traditional Sites.png"
                    style={{ 
                        // position: 'absolute',
                        // top: '10vh',
                        // left: 0,
                        // right: 0,
                        // margin: 'auto',
                        // width: '10%',
                        // height: '100%',
                        height: '70px',
                        padding: '5px',
                        // objectFit: 'cover', 
                        // zIndex: 1,
                        
                        // opacity: isVisible ? '1' : '0', 
                        // transition: 'opacity 1s ease'
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        setSelectedType('traditional');
                    }}
                /> 
            </div>

            <img
                ref={imageRef}
                id='title'
                alt="MapUpdated"
                src="/assets/media/sligo-map/Headings - Subtitle.png"
                style={{ 
                    position: 'absolute',
                    bottom: '10vh',
                    left: 0,
                    right: 0,
                    margin: 'auto',
                    width: '50%',
                    // width: '50%',
                    // height: '100%',
                    objectFit: 'cover', 
                    zIndex: 1,
                    
                    opacity: isVisible ? '1' : '0', 
                    transition: 'opacity 1s ease'
                }}
            />

            

            <MapContainer 
                className="main_map"
                center={[54.20638315779152, -8.57869767149748]} 
                zoom={10}
                style={mainMapStyles} 
            >
                <TileLayer
                    attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url={stadiaURL}
                />
                
                {/* <LayersControl position="topright">
                    <LayersControl.Overlay name="Halting Sites">
                        <Marker position={[54.20638315779152, -8.57869767149748]}>
                            <Popup>
                                A pretty CSS3 popup. <br /> Easily customizable.
                            </Popup>
                        </Marker>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay checked name="Traditional Sites">
                        <LayerGroup>
                            <Circle
                                center={[54.30638315779152, -8.57869767149748]}
                                pathOptions={{ fillColor: 'blue' }}
                                radius={1000}
                            />
                            <Circle
                                center={[54.40638315779152, -8.57869767149748]}
                                pathOptions={{ fillColor: 'red' }}
                                radius={1000}
                                stroke={false}
                            />
                            <LayerGroup>
                                <Circle
                                center={[54.50638315779152, -8.57869767149748]}
                                pathOptions={{ color: 'green', fillColor: 'green' }}
                                radius={1000}
                                />
                            </LayerGroup>
                        </LayerGroup>
                    </LayersControl.Overlay>
                    <LayersControl.Overlay name="Recent Sites">
                        <FeatureGroup pathOptions={{ color: 'purple' }}>
                            <Popup>Popup in FeatureGroup</Popup>
                            <Circle center={[54.60638315779152, -8.57869767149748]} radius={200} />
                            <Rectangle bounds={[[54.49, -8.08], [55.5, -9.06]]} />
                        </FeatureGroup>
                    </LayersControl.Overlay>
                </LayersControl> */}

                
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


                <div>
                {siteData.map((site, i) => {
                    return (
                        site.siteType === selectedType ?
                        <Marker 
                            position={[site.lat, site.long]} 
                            
                            key={i}
                            icon={new Icon({iconUrl: '/assets/media/sligo-map/Marker.png', iconSize: [25, 25], iconAnchor: [0, 0]})}
                        >
                            <Popup>
                                <Link to={`/`} target="_blank">
                                    <span><b>{site.title}</b></span>
                                    <br/>
                                    <div>
                                        <span>Address</span><br/>
                                        <br/>
                                    </div>
                                </Link>
                            </Popup>
                        </Marker>
                        : null
                    )
                })}
                </div>


            </MapContainer>

            {/* <img 
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
            /> */}

        </div>
        
    );
}

function mapStateToProps(state: any) {
    return {
        items: state.items
    }
}

export default connect(mapStateToProps)(SligoMap);