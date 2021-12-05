import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, TileLayer, Marker } from 'react-leaflet'


import '../../../../node_modules/react-toastify/dist/ReactToastify.css';


import { addItem, addPendingItem, clearNewItem } from '../../../actions';


class AddItem extends Component {

    state = {
        formdata:{
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
        },
        initMap: {
            initLat: 53.342609,
            initLong: -7.603976,
            initZoom: 6.5
        },
        saved: false
    }

    componentDidMount() {
        document.title = "Add Item - Traveller Collection"
    }

    // clear success message 
    componentWillUnmount() {
        this.props.dispatch(clearNewItem())
    }


    handleInput = (event, name, level) => {
        // console.log(event.target.value);

        let newFormdata = {
            ...this.state.formdata
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

        this.setState({
            formdata: newFormdata
        })
    }


    handleClick(e) {
        console.log(e.latlng.lat);

        let lat = parseFloat(e.latlng.lat).toFixed(6);
        let lng = parseFloat(e.latlng.lng).toFixed(6);

        this.setState({
                formdata: {
                    ...this.state.formdata,
                    geo: {
                        ...this.state.formdata.geo,
                        latitude: lat,
                        longitude: lng
                    }
                }
        })
    }

    cancel = () => {
        this.props.history.push(`/user/all-items`)
    }


    redirectUser = (url) => {
        setTimeout(() => {
            this.props.history.push(url)
        }, 1000)
    }


    submitForm = (e) => {
        e.preventDefault();
        // console.log(this.state.formdata);

        // dispatch an action, adding updated  formdata + the user id from the redux store

        if (this.props.user.login.isAuth) {
            this.props.dispatch(addItem({
                    ...this.state.formdata,
                    ownerId:this.props.user.login.id
            }));

            
        } else {
            console.log('done!');
            this.props.dispatch(addPendingItem({
                
                ...this.state.formdata,
                ownerId:'guest'
            }))
            
        }

        this.setState({
            saved: true
        })

        setTimeout(() => {
            this.props.history.push(`/user/edit-item-sel/${this.props.items.newitem.itemId}`);
        }, 2000)

        
    }


    createTextInput = (existing, name, placeholder, inputLabel, level) => {
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
                            onChange={(event) => this.handleInput(event, name, level)}
                        />
                    </div>
                </td>
            </tr>
        )
    }



    renderForm = () => {
        const formdata = this.state.formdata;

        return (

            <form onSubmit={this.submitForm}>
                        
                <h2>Add an Item</h2>

                <table>
                <tbody>
                
                    {this.createTextInput(formdata.title,'title', "Enter title", "Title")}
                    {this.createTextInput(formdata.creator,'creator', "Enter creator", "Creator")}
                    {this.createTextInput(formdata.subject,'subject', "General subject matter", "Subject")}

                    <tr>
                        <td className="label">
                            Description
                        </td>
                        <td>
                            <textarea
                                type="text"
                                placeholder="Please write as much details as you know about the item here. For example the place of origin, who made it, or owned it previously, what it was made out of, what it was used for, and any other details"
                                defaultValue={formdata.description} 
                                onChange={(event) => this.handleInput(event, 'description')}
                                rows={18}
                            />
                            
                        </td>
                    </tr>

                    {this.createTextInput(formdata.source,'source', "Sources of information about the item", "Source")}
                    {this.createTextInput(formdata.date_created,'date_created', "Date item was created", "Date")}
                        

                    <tr><td></td><td></td></tr>
                    <tr><td colSpan="2"><hr /></td></tr>
                    <tr><td></td><td></td></tr>


                    {this.createTextInput(formdata.location,'location', "The item's general location ie. Cashel", "Location")}
                    {this.createTextInput(formdata.geo.address,'address', "Where is the item currently located", "Exact Address", 'geo')}
                    
                    <tr>
                        <td>Geo-location</td>
                        <td>
                            <Map 
                                className="edit_map"
                                center={[this.state.initMap.initLat, this.state.initMap.initLong]} 
                                zoom={this.state.initMap.initZoom} 
                                onClick={(e) => { this.handleClick(e)}}
                                // style={{ height: this.state.showMap ? '350px' : '0px'}}
                            >
                                <TileLayer
                                    attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />

                                { this.state.formdata.geo.latitude && this.state.formdata.geo.longitude ?
                                    
                                    <Marker 
                                        position={[this.state.formdata.geo.latitude, this.state.formdata.geo.longitude]} 
                                    />
                                : null }
                            </Map>
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
                                    onChange={(event) => this.handleInput(event, 'latitude', 'geo')}
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
                                    onChange={(event) => this.handleInput(event, 'longitude', 'geo')}
                                    className="input_latlng"
                                />
                            </div>
                        </td>
                    </tr>

                    <tr><td></td><td></td></tr>
                    <tr><td colSpan="2"><hr /></td></tr>
                    <tr><td></td><td></td></tr>


                    {this.createTextInput(formdata.rights,'rights', "Rights", "Rights")}
                    {this.createTextInput(formdata.further_info,'further_info', "Enter any further info, resources..", "Further Info")}
                    {this.createTextInput(formdata.external_link[0].url,'url', "External link URL ie. https://www...", "External Link", 'external_link')}
                    {this.createTextInput(formdata.external_link[0].text,'text', "Description of the link", '', "external_link")}


                    <tr><td></td><td></td></tr>
                    <tr><td colSpan="2"><hr /></td></tr>
                    <tr><td></td><td></td></tr>
                   
 
                    {this.createTextInput(formdata.item_format,'item_format', "The item's format", "Format")}
                    {this.createTextInput(formdata.materials,'materials', "The materials used in the item", "Materials")}
                    {this.createTextInput(formdata.physical_dimensions,'physical_dimensions', "Physical dimensions", "Dimensions")}

                    
                    <tr><td></td><td></td></tr>
                    <tr><td colSpan="2"><hr /></td></tr>
                    <tr><td></td><td></td></tr>


                    {this.createTextInput(formdata.editor,'editor', "Editor's name(s)", "Editor")}
                    {this.createTextInput(formdata.publisher,'publisher', "Publisher", "Publisher")}
                    {this.createTextInput(formdata.language,'language', "ie. Cant, Gammon, Romani", "Language")}

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
                                    onChange={(event) => this.handleInput(event, 'pages')}
                                />
                            </div>
                        </td>
                    </tr>

                    {this.createTextInput(formdata.reference,'reference', "Reference code", "Ref")}


                    <tr><td></td><td></td></tr>
                    <tr><td colSpan="2"><hr /></td></tr>
                    <tr><td></td><td></td></tr>


                    {this.createTextInput(formdata.contributor,'contributor', "Add your name here", "Contributor")}

                    <tr className="half_width">
                        <td colSpan="2" >
                       
                            <button type="button" className="half_width_l" onClick={(e) => { if (window.confirm('Are you sure you wish to cancel? All data entered will be lost!')) this.cancel(e) }}>Cancel</button>
                            <button type="submit" className="half_width_r">Save and Continue</button>

                        </td>
                    </tr>  

                </tbody>
                </table>

                {this.state.saved ?
                        <p className="message center">Information saved!</p>
                : null}

            </form>
        )
    }



    render() {
        // console.log(this.props);

        return (
            <div className="main_view">
                <div className="form_input item_form_input edit_page">
                    {this.renderForm()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        items:state.items,
    }
}

export default connect(mapStateToProps)(AddItem)