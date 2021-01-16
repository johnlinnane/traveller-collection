import React, { Component } from 'react';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'



class Sandbox extends Component {


    state = {
        lat: 52.232579,
        lng: -8.670210,
        zoom: 13,
    }


    render() {
        return (
            <div>
                <Map 
                    center={[this.state.lat, this.state.lng]} 
                    zoom={this.state.zoom} 
                    style={{ width: '25%', height: '250px'}}
                >
                    <TileLayer
                        attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                </Map>
            </div>
        );
    }
}

export default Sandbox;