import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import '../../../../node_modules/react-toastify/dist/ReactToastify.css';

import config from "../../../config";
import { createItem, createPendingItem, clearNewItem } from '../../../actions';

const AddItem = props => {

    const [formdata, setFormdata] = useState({
        title: '',
        creator: '',
        subject: '',
        description: '',
        source: '',
        date_created: '',
        
        contributor: '',
        item_format: '',
        materials: '',
        physical_dimensions: '',
        pages: '',        
        editor: '',
        publisher: '',
        further_info: '',
        language: '',
        reference: '',
        rights: '',
        external_link: [
            {
                url: '',
                text: ''
            }
        ],
        geo: {
            address: '',
            latitude: null,
            longitude: null
        },
        location: ''
    });
    const [saved, setSaved] = useState(false);
    const initMap = {
        initLat: 53.342609,
        initLong: -7.603976,
        initZoom: 6.5
    }

    useEffect(() => {
        document.title = `Add Item - ${config.defaultTitle}`;
        return () => {
            document.title = config.defaultTitle;
            props.dispatch(clearNewItem())
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.items.newitem?.itemId) {
            props.history.push(`/user/edit-item-sel/${props.items.newitem.itemId}`);
        }
    }, [props.items.newitem]);

    const handleInput = (event, name, level) => {
        let newFormdata = {
            ...formdata
        }
        if (level === 'external_link') {
            newFormdata.external_link[0][name] = event.target.value;
        } else if (level === 'geo') {
            newFormdata.geo[name] = event.target.value;
            if (event.target.value === '') {
                newFormdata.geo[name] = '';
            }
        } else {
            newFormdata[name] = event.target.value;
        }
        setFormdata(newFormdata);
    }

    const handleClick = e => {
        let lat = parseFloat(e.latlng.lat).toFixed(6);
        let lng = parseFloat(e.latlng.lng).toFixed(6);
        setFormdata({
            ...formdata,
            geo: {
                ...formdata.geo,
                latitude: lat,
                longitude: lng
            }
        });
    }

    const cancel = () => {
        props.history.push(`/user/all-items`)
    }

    const submitForm = e => {
        e.preventDefault();
        if (props.user.login.isAuth) {
            props.dispatch(createItem({
                    ...formdata,
                    ownerId:props.user.login.id
            }));
        } else {
            props.dispatch(createPendingItem({
                ...formdata,
                ownerId:'guest'
            }))
        }
        setSaved(true);
    }

    const createTextInput = (existing, name, placeholder, inputLabel, level) => {
        return (
            <tr>
                <td>
                    {inputLabel}
                </td>
                <td>
                    <div className="form_element">
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={existing} 
                            onChange={(event) => handleInput(event, name, level)}
                        />
                    </div>
                </td>
            </tr>
        )
    }

    const renderForm = () => {
        return (
            <form onSubmit={submitForm}>
                <h2>Add an Item</h2>
                <table>
                <tbody>

                    {createTextInput(formdata.title,'title', "Enter title", "Title")}
                    {createTextInput(formdata.creator,'creator', "Enter creator", "Creator")}
                    {createTextInput(formdata.subject,'subject', "General subject matter", "Subject")}

                    <tr>
                        <td className="label">
                            Description
                        </td>
                        <td>
                            <textarea
                                type="text"
                                placeholder="Please write as much details as you know about the item here. For example the place of origin, who made it, or owned it previously, what it was made out of, what it was used for, and any other details"
                                defaultValue={formdata.description} 
                                onChange={(event) => handleInput(event, 'description')}
                                rows={18}
                            />
                            
                        </td>
                    </tr>

                    {createTextInput(formdata.source,'source', "Sources of information about the item", "Source")}
                    {createTextInput(formdata.date_created,'date_created', "Date item was created", "Date")}

                    <tr><td></td><td></td></tr>
                    <tr><td colSpan="2"><hr /></td></tr>
                    <tr><td></td><td></td></tr>

                    {createTextInput(formdata.location,'location', "The item's general location ie. Cashel", "Location")}
                    {createTextInput(formdata.geo.address,'address', "Where is the item currently located", "Exact Address", 'geo')}
                    
                    <tr>
                        <td>Geo-location</td>
                        <td>
                            <MapContainer 
                                className="edit_map"
                                center={[initMap.initLat, initMap.initLong]} 
                                zoom={initMap.initZoom} 
                                onClick={(e) => { handleClick(e)}}
                                // style={{ height: showMap ? '350px' : '0px'}}
                            >
                                <TileLayer
                                    attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                { formdata.geo.latitude && formdata.geo.longitude ?
                                    
                                    <Marker 
                                        position={[formdata.geo.latitude, formdata.geo.longitude]} 
                                    />
                                : null }
                            </MapContainer>
                            <br/>
                            Click on the map to set geolocation
                        </td>
                    </tr>
                    
                    <tr>
                        <td className="label">
                            Latitude
                        </td>
                        <td>
                            <div className="form_element">
                                <input
                                    type="number"
                                    placeholder="Geo-location latitude ie. 52.232269"
                                    defaultValue={formdata.geo.latitude} 
                                    onChange={(event) => handleInput(event, 'latitude', 'geo')}
                                    className="input_latlng"
                                />
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td className="label">
                            Longitude
                        </td>
                        <td>
                            <div className="form_element">
                                <input
                                    type="number"
                                    placeholder="Geo-location longitude ie. -8.670860"
                                    defaultValue={formdata.geo.longitude} 
                                    onChange={(event) => handleInput(event, 'longitude', 'geo')}
                                    className="input_latlng"
                                />
                            </div>
                        </td>
                    </tr>

                    <tr><td></td><td></td></tr>
                    <tr><td colSpan="2"><hr /></td></tr>
                    <tr><td></td><td></td></tr>

                    {createTextInput(formdata.rights,'rights', "Rights", "Rights")}
                    {createTextInput(formdata.further_info,'further_info', "Enter any further info, resources..", "Further Info")}
                    {createTextInput(formdata.external_link[0].url,'url', "External link URL ie. https://www...", "External Link", 'external_link')}
                    {createTextInput(formdata.external_link[0].text,'text', "Description of the link", '', "external_link")}

                    <tr><td></td><td></td></tr>
                    <tr><td colSpan="2"><hr /></td></tr>
                    <tr><td></td><td></td></tr>
 
                    {createTextInput(formdata.item_format,'item_format', "The item's format", "Format")}
                    {createTextInput(formdata.materials,'materials', "The materials used in the item", "Materials")}
                    {createTextInput(formdata.physical_dimensions,'physical_dimensions', "Physical dimensions", "Dimensions")}
                    
                    <tr><td></td><td></td></tr>
                    <tr><td colSpan="2"><hr /></td></tr>
                    <tr><td></td><td></td></tr>

                    {createTextInput(formdata.editor,'editor', "Editor's name(s)", "Editor")}
                    {createTextInput(formdata.publisher,'publisher', "Publisher", "Publisher")}
                    {createTextInput(formdata.language,'language', "ie. Cant, Gammon, Romani", "Language")}

                    <tr>
                        <td className="label">
                            Pages
                        </td>
                        <td>
                            <div className="form_element">
                                <input
                                    type="number"
                                    placeholder="Enter number of pages"
                                    defaultValue={formdata.pages} 
                                    onChange={(event) => handleInput(event, 'pages')}
                                />
                            </div>
                        </td>
                    </tr>

                    {createTextInput(formdata.reference,'reference', "Reference code", "Ref")}

                    <tr><td></td><td></td></tr>
                    <tr><td colSpan="2"><hr /></td></tr>
                    <tr><td></td><td></td></tr>

                    {createTextInput(formdata.contributor,'contributor', "Add your name here", "Contributor")}

                    <tr className="half_width">
                        <td colSpan="2" >
                       
                            <button type="button" className="half_width_l" onClick={(e) => { if (window.confirm('Are you sure you wish to cancel? All data entered will be lost!')) cancel(e) }}>Cancel</button>
                            <button type="submit" className="half_width_r">Save and Continue</button>

                        </td>
                    </tr>  
                </tbody>
                </table>

                {saved ?
                        <p className="message center">Information saved!</p>
                : null}
            </form>
        )
    }

    return (
        <div className="main_view">
            <div className="form_input item_form_input edit_page">
                {renderForm()}
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        items:state.items,
    }
}

export default connect(mapStateToProps)(AddItem)