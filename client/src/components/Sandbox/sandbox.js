import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'



class Sandbox extends Component {


    state = {
        lat: 37.7749,
        lng: -122.4194,
        zoom: 13,
    }


    render() {
        return (
            <div>
                <Map 
                    center={[this.state.lat, this.state.lng]} 
                    zoom={this.state.zoom} 
                    style={{ width: '100%', height: '900px'}}
                >
                    
                </Map>
            </div>
        );
    }
}

export default Sandbox;