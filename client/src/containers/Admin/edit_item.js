import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
// import axios from 'axios';
// import Select from 'react-select';
// import CreatableSelect from 'react-select/creatable';

// import {Progress} from 'reactstrap';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';



import { getItemById, updateItem, clearItem, deleteItem } from '../../actions';
// import { getAllColls, getAllCats, getAllSubCats  } from '../../actions';



class EditItem extends PureComponent {


    state = {
        formdata:{
            _id:this.props.match.params.id,
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
            file_format: '',
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
        this.props.dispatch(getItemById(this.props.match.params.id))

    }


    componentWillUnmount() {
        this.props.dispatch(clearItem())
    }

    // baseline export before adding new stuff
    componentDidUpdate(prevProps) {
        // console.log(prevProps);
        let item = this.props.items.item;
        // console.log(this.state.formdata);

        
        // console.log(book);

        // can create a updatedFormdata variable, but no need
        if (this.props.items !== prevProps.items) {

            let newFormdata = {
                
                ...this.state.formdata,
                _id:item._id,
                title:item.title,  //
                creator:item.creator,  //
                description:item.description,  //
                pages:item.pages,  //
                collection_id:item.collection_id,  //
                source:item.source,   //

                subject: item.subject,
                date_created: item.date_created,
                tags: item.tags,
                contributor: item.contributor,
                item_format: item.item_format,
                materials: item.materials,
                physical_dimensions: item.physical_dimensions,
                editor: item.editor,
                publisher: item.publisher,
                further_info: item.further_info,
                language: item.language,
                reference: item.reference,
                rights: item.rights,
                file_format: item.file_format,
                category_ref: item.category_ref,
                subcategory_ref: item.subcategory_ref,
                location: item.location
                
            }

         

            if (item.external_link) {
                if (item.external_link[0].url || item.external_link[0].text) {
                    newFormdata = {
                        ...newFormdata,
                        external_link: [
                            {
                                url: item.external_link[0].url,
                                text: item.external_link[0].text
                            }
                        ]
                    }
                }
            } 



            if (item.geo) {
                if (item.geo.address || item.geo.latitude || item.geo.longitude ) {
                    newFormdata = {
                        ...newFormdata,
                        geo: {
                            address: item.geo.address,
                            latitude: item.geo.latitude,
                            longitude: item.geo.longitude
                        }
                    }
                }
            }
            
            this.setState({
                formdata: newFormdata
            })
            
        }

    }


    handleInput = (event, name, level) => {


        // make a copy of formdata
        let newFormdata = {
            ...this.state.formdata
        }

        // console.log(newFormdata);

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


        // copy it back to state
        this.setState({
            formdata: newFormdata

        })
        console.log(newFormdata);
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

    


    deletePost = () => {
        this.props.dispatch(deleteItem(this.state.formdata._id));
        this.props.history.push('/user/all-items');
    }



    redirectUser = () => {
        setTimeout(() => {
            this.props.history.push('/user/all-items')
        }, 1000)
    }

    cancel = () => {
        this.props.history.push(`/items/${this.props.match.params.id}`)
    }

   





    submitForm = (e) => {
        e.preventDefault();
        console.log(this.state.formdata);

        this.props.dispatch(updateItem({
                ...this.state.formdata
            }
        ))

        this.setState({
            saved: true
        })

        setTimeout(() => {
            this.props.history.push(`/user/edit-item-sel/${this.props.items.item._id}`)
        }, 1000)
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
                            defaultValue={existing} 
                            onChange={(event) => this.handleInput(event, name, level)}
                        />
                    </div>
                </td>

            </tr>
        )
    }

 

    // ****************************************************

    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    } 


    renderForm = () => {
        // console.log(this.state);

        const items = this.props.items;
        const formdata = this.state.formdata;



        return (
            <div>
            {/* {
                items.updateItem ?
                    <div className="edit_confirm">
                        Post updated, <Link to={`/items/${items.item._id}`}>
                            Click here to see your post
                        </Link>
                    </div>
                : null
            } */}


            {/* {
                items.itemDeleted ?
                    <div className="red_tag">
                        Item Deleted    
                        {this.redirectUser()}
                    </div>

                : null
            } */}


            <form onSubmit={this.submitForm}>
                
                <div className="item_container">
                    <Link to={`/items/${this.state.formdata._id}`} target="_blank" >

                        <div className="container">

                            <div className="img_back">
                                <img src={`/media/items/${formdata._id}/original/0.jpg`} alt="item main image" className="edit_main_img" onError={this.addDefaultImg} />
                            </div>
                            <div className="centered edit_img_text"><h2>{formdata.title}</h2></div>


                        </div>

                    </Link>
                </div>

                <h2>Edit Item Details</h2>


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
                                placeholder="Enter item description"
                                defaultValue={formdata.description} 
                                onChange={(event) => this.handleInput(event, 'description')}
                                rows={18}
                            />
                            
                        </td>
                    </tr>


                    <tr>
                        <td>

                        </td>
                        <td>
                            <Link to={`/chapter-index/${this.state.formdata._id}`} target="_blank" >
                                <button type="button" className="half_width_l">Add Chapter Index (PDF)</button>
                            </Link>

                            
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
                        Click on the map to get geolocation
                        </td>
                    </tr>
                    {this.createTextInput(formdata.geo.latitude,'latitude', "Geo-location latitude ie. 52.232269", "Latitude", 'geo')}
                    {this.createTextInput(formdata.geo.longitude,'longitude', "Geo-location longitude ie. -8.670860", "Longitude", 'geo')}
                    


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

                    

                    <tr>
                        <td colSpan="2">
                            
                            <button 
                                type="button" 
                                className="delete"
                                onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.deletePost(e) } }
                            >
                                Delete item
                            </button>
                        </td>
                    </tr>


                    <tr className="half_width">
                        <td colSpan="2" >
                       
                            <button type="button" className="half_width_l" onClick={this.cancel}>Cancel</button>
                            <button type="submit" className="half_width_r">Save and Continue</button>

                        </td>
                        
                    </tr>  


                </tbody>
                </table>

                {this.state.saved ?
                        <p className="message center">Information saved!</p>
                : null}

                
    

            </form>
            </div>
        )
    }


    render() {
        // console.log(this.state);

        console.log(this.state.formdata);

        let items = this.props.items;
        // console.log(this.props);

        return (
            <div className="main_view">
                <div className="rl_container article edit_page">
                    {/* { items.item ?     */}
                        {this.renderForm()}
                    {/* : null } */}
                </div>

            {/* // <div className="form-group">
            //     <Progress max="100" color="success" value={this.state.loaded} >
            //         { this.state.loaded ?
            //             <div>    
            //                 {Math.round(this.state.loaded,2)}
            //                 %
            //             </div>
            //         :null}
            //     </Progress>
            // </div>

            // <div className="form-group">
            //     <ToastContainer />
            // </div> */}
            </div>
            
        );
    }
}

function mapStateToProps(state) {
    return {
        items:state.items
    }
}

export default connect(mapStateToProps)(EditItem)


