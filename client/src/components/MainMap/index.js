import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import { getItemsWithCoords } from '../../actions';



class MainMap extends Component {

    state = {
        initLat: 53.342609,
        initLong: -7.603976,
        initZoom: 8

        
    }

    componentDidMount() {
        document.title = `Map - Traveller Collection`
        this.props.dispatch(getItemsWithCoords());
    }

    componentWillUnmount() {
        document.title = `Traveller Collection`
    }

    render() {

        console.log(this.props)


        return (
            <div>
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



                    {/* <Marker 
                        position={[this.state.initLat, this.state.initLong]} 
                        // key={incident['incident_number']} 
                    >
                        <Popup>
                            <span><b>Title</b></span>
                            <br/>
                            <span>address</span><br/>
                            <br/>
                            <span>{this.state.initLat}, {this.state.initLong}</span><br/>
                        </Popup>
                    </Marker> */}

                    {this.props.items.items && this.props.items.items.length ?
                        <div>
                            {this.props.items.items.map( (item, i) => (
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
                            ) )}     
                        </div>
                    : null}


                </Map>

                


            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        items: state.items

    }
}


export default connect(mapStateToProps)(MainMap)