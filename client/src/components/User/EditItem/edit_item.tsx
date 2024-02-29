import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from 'leaflet'

import { getItemById, updateItem, clearItem, deleteItem, createItem, getParentPdf, deleteChapter, getFilesFolder } from '../../../../src/slices/itemsSlice';
import config from "../../../config";
import { Item } from '../../../types';
import { AppDispatch } from '../../../../src/index';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;


const EditItem = props => {

    const dispatch = useDispatch<AppDispatch>();

    const params = useParams();
    const navigate = useNavigate();

    const [formdata, setFormdata] = useState<Item>({
        _id: '',
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
        location: '',

        is_pdf_chapter: null,
        pdf_item_pages: {
            start: null,
            end: null
        },
        pdf_item_parent_id: '',

        shareDisabled: false,
        isPending: null
    });
    const [initMap, setInitMap] = useState({
        initLat: 53.342609,
        initLong: -7.603976,
        initZoom: 6.5
    });
    const [saved, setSaved] = useState(false);
    const [getParentCalled, setGetParentCalled] = useState(false);
    const [creatingItem, setCreatingItem] = useState<boolean>(false);

    
    useEffect(() => {
        if (typeof params.id === 'string' || params.id === 'new') {
            setFormdata(prevFormData => ({
                ...prevFormData,
                _id: params.id
            }));
        } 
    }, [params?.id]);
    
    
    useEffect(() => {
        if (typeof formdata._id !== 'string') {
            navigate('/');
        } else if (formdata._id === 'new') {
            showConfirmationDialog();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formdata._id]);


    useEffect(() => {
        if (typeof props.items?.newitem?.itemId === 'string' && creatingItem === true) {
            setCreatingItem(false);
            setFormdata(prevFormData => ({
                ...prevFormData,
                _id: props.items.newitem.itemId
            }));
            reloadEditPage(props.items.newitem.itemId);
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.items.newitem, creatingItem]);


    useEffect(() => {
        if (typeof formdata._id === 'string' && formdata._id.length && formdata._id !== 'new') {
            dispatch(getItemById(formdata._id));
            document.title = `Edit Item - ${config.defaultTitle}`;
            dispatch(getFilesFolder({folder: `/items/${formdata._id}/original`}));
        }
        return () => {
            dispatch(clearItem());
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formdata._id]);

    
    useEffect(() => {
        if (props.items.item) {
            let item = props.items.item;
            let newFormdata: Item = {
                ...formdata,
                _id:item._id,
                title:item.title,
                creator:item.creator,
                description:item.description,
                pages:item.pages,
                source:item.source,
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
                category_ref: item.category_ref,
                subcategory_ref: item.subcategory_ref,
                location: item.location,
                is_pdf_chapter: item.is_pdf_chapter,
                pdf_item_parent_id: item.pdf_item_parent_id,
                shareDisabled: item.shareDisabled,
                isPending: item.isPending
            }
            let newLatLng = initMap;

            if (item.external_link && item.external_link.length) {
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

            if (item.geo && item.geo.latitude && item.geo.longitude) {
                newLatLng = {
                    initLat: item.geo.latitude,
                    initLong: item.geo.longitude,
                    initZoom: 6.5
                }
            }

            if (item.pdf_item_pages) {
                newFormdata = {
                    ...newFormdata,
                    pdf_item_pages: {
                        start: item.pdf_item_pages.start || formdata.pdf_item_pages?.start,
                        end: item.pdf_item_pages.end || formdata.pdf_item_pages?.end
                    }
                }
            }
            
            setFormdata(newFormdata);
            setInitMap(newLatLng);
            
            if (props.items.item.is_pdf_chapter ) {
                if (!getParentCalled) {
                    dispatch(getParentPdf(props.items.item.pdf_item_parent_id))
                }
                setGetParentCalled(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.items?.item]);


    const showConfirmationDialog = () => {
        if (window.confirm('Would you like to add a new item to this collection?')) {
            handleCreateItem();
        } else {
            goBackToPreviousPage();
        }
    };

    const handleCreateItem = () => {
        setCreatingItem(true);
        let { _id, ...newItemData } = {
            ...formdata,
            ownerId: 'guest',
            isPending: true
        };
        if (props.user?.login?.isAuth && typeof props.user.login.id === 'string') {
            newItemData = { 
                ...newItemData,
                ownerId: props.user.login.id,
                isPending: false
            };
        }
        try {
            dispatch(createItem(newItemData));
        } catch {
            console.log('Error creating item.')
        }
    };


    const goBackToPreviousPage = () => {
        navigate(-1);
    };

    const reloadEditPage = (itemId: string) => {
        navigate(`/edit-item/${itemId}`);
    };


    const handleInput = <T extends HTMLInputElement | HTMLTextAreaElement>(
        event: React.ChangeEvent<T>,
        name: string,
        level: string | null
    ) => {
        setFormdata(prevFormData => {
            let newFormdata = { ...prevFormData };
    
            const value = event.target.value;
            switch (level) {
                case 'external_link':
                    return {
                        ...newFormdata,
                        external_link: [{
                            ...newFormdata.external_link?.[0],
                            [name]: value || null
                        }]
                    };
                case 'geo':
                    return {
                        ...newFormdata,
                        geo: {
                            ...newFormdata.geo,
                            [name]: value || null
                        }
                    };
                case 'pdf_item_pages':
                    return {
                        ...newFormdata,
                        pdf_item_pages: {
                            ...newFormdata.pdf_item_pages,
                            [name]: value || null
                        }
                    };
                default:
                    return {
                        ...newFormdata,
                        [name]: value
                    };
            }
        });
    };
    

    const MapClickHandler = () => {
        useMapEvents({
            click(e) {
                let lat = Math.round(e.latlng.lat * 1e6) / 1e6;
                let lng = Math.round(e.latlng.lng * 1e6) / 1e6;
                setFormdata({
                    ...formdata,
                    geo: {
                        ...formdata.geo,
                        latitude: lat,
                        longitude: lng
                    }
                });
            },
        });
        return null;
    };

    const handleSwitch = () => {
        setFormdata({
            ...formdata,
            shareDisabled: !formdata.shareDisabled
        });
    }

    const deleteAllMedia = () => {
        let fileData =  {
            section: 'items',
            id: formdata._id,
            fileType: null,
            fileName: null,
            deleteAll: true
        };
        axios.post(`${API_PREFIX}/delete-dir`, fileData  )
            .then(res => {
                alert('Media deleted successfully')
            })
            .catch(err => { 
                alert('No media deleted')
            });
    }

    const deleteThisItem = () => {
        dispatch(deleteItem(formdata._id)); 
        if (formdata.is_pdf_chapter === true) {
            dispatch(deleteChapter(formdata.pdf_item_parent_id, formdata.title))
        }
        deleteAllMedia();
        navigate('/user/all-items');
    }

    const cancel = () => {
        if (typeof formdata._id === 'string') {
            navigate(`/items/${formdata._id}`);
        } else {
            navigate('/');
        }
    }

    const submitForm = e => {
        e.preventDefault();
        dispatch(updateItem({
                ...formdata
            }
        ))
        setSaved(true);
        setTimeout(() => {
            navigate({
                pathname: `/edit-item-sel/${formdata._id}`
            })
        }, 1000)
    }


    const createTextInput = (existing: string | null | undefined, name: string, placeholder: string, inputLabel: string, level: string | null) => {
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
                            defaultValue={existing || undefined} 
                            onChange={(event) => handleInput(event, name, level)}
                        />
                    </div>
                </td>
            </tr>
        )
    }


    const addDefaultImg = ev => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    } 


    const renderForm = () => {
        return (
            <div>
                <form onSubmit={submitForm}>
                    <div className="edit_item_container">
                        <Link to={`/items/${formdata._id}`} target="_blank" >
                            <div className="container">
                                <div className="img_back">
                                    { props.items.files?.length ?
                                        <div>
                                            <img src={`${FS_PREFIX}/assets/media/items/${formdata._id}/original/${props.items.files[0]}`} alt="item main " className="edit_main_img" onError={addDefaultImg} />
                                        </div>
                                    : <img src={'/assets/media/default/default.jpg'} alt='default'/> }
                                </div>
                                <div className="centered edit_img_text"><h2>{formdata.title}</h2></div>
                            </div>
                        </Link>
                    </div>
                    <h2>Edit Item Details</h2>
                    <table>
                    <tbody>
                        {createTextInput(formdata.title,'title', "Enter title", "Title", null)}
                        {createTextInput(formdata.creator,'creator', "Enter creator", "Creator", null)}
                        {createTextInput(formdata.subject,'subject', "General subject matter", "Subject", null)}
                        <tr>
                            <td className="label">
                                Description
                            </td>
                            <td>
                                <textarea
                                    placeholder="Please write as much details as you know about the item here. For example the place of origin, who made it, or owned it previously, what it was made out of, what it was used for, and any other details"
                                    defaultValue={formdata.description || undefined} 
                                    onChange={(event) => handleInput(event, 'description', null)}
                                    rows={18}
                                />
                            </td>
                        </tr>
                        {createTextInput(formdata.source,'source', "Sources of information about the item", "Source", null)}
                        {createTextInput(formdata.date_created,'date_created', "Date item was created", "Date", null)}
                        {formdata.is_pdf_chapter ? 
                            <React.Fragment>
                                <tr><td></td><td></td></tr>
                                <tr><td colSpan={2}><hr /></td></tr>
                                <tr><td></td><td></td></tr>
                                <tr>
                                    <td>
                                        Parent Item
                                    </td>
                                    <td>
                                        <Link to={`/items/${formdata.pdf_item_parent_id}`} target="_blank" >
                                            
                                                {props.parentpdf ?
                                                <u>{props.parentpdf.title}</u>
                                                : 
                                                <u>Link</u>
                                                }
                                        </Link>
                                    </td>
                                </tr>

                                <tr>
                                    <td className="label">
                                        PDF Page Start
                                    </td>
                                    <td>
                                        <div className="form_element">
                                            <input
                                                type="number"
                                                placeholder="Start page from parent item's PDF"
                                                defaultValue={formdata.pdf_item_pages?.start || undefined} 
                                                onChange={(event) => handleInput(event, 'start', 'pdf_item_pages')}
                                            />
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="label">
                                        PDF Page End
                                    </td>
                                    <td>
                                        <div className="form_element">
                                            <input
                                                type="number"
                                                placeholder="End page from parent item's PDF"
                                                defaultValue={formdata.pdf_item_pages?.end || undefined} 
                                                onChange={(event) => handleInput(event, 'end', 'pdf_item_pages')}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        :
                            <tr>
                                <td></td>
                                <td>
                                    <Link to={`/user/chapter-index/${formdata._id}`} target="_blank" >
                                        <button type="button" className="half_width_l">Add Chapter Index (PDF)</button>
                                    </Link>
                                </td>
                            </tr>
                        }
                        <tr><td></td><td></td></tr>
                        <tr><td colSpan={2}><hr /></td></tr>
                        <tr><td></td><td></td></tr>
                        <tr></tr>
                        {createTextInput(formdata.location,'location', "The item's general location ie. Cashel", "Location", null)}
                        {createTextInput(formdata.geo?.address,'address', "Where is the item currently located", "Exact Address", 'geo')}
                        <tr>
                            <td>Geo-location</td>
                            <td>
                                <MapContainer 
                                    className="edit_map"
                                    center={[initMap.initLat, initMap.initLong]} 
                                    zoom={initMap.initZoom} 
                                >
                                    <MapClickHandler />
                                    <TileLayer
                                        attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    { formdata.geo?.latitude && formdata.geo?.longitude ?
                                        <Marker 
                                            position={[formdata.geo.latitude, formdata.geo.longitude]} 
                                            icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
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
                                        defaultValue={formdata.geo?.latitude || undefined} 
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
                                        defaultValue={formdata.geo?.longitude || undefined} 
                                        onChange={(event) => handleInput(event, 'longitude', 'geo')}
                                        className="input_latlng"
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr><td></td><td></td></tr>
                        <tr><td colSpan={2}><hr /></td></tr>
                        <tr><td></td><td></td></tr>


                        {createTextInput(formdata.rights,'rights', "Rights", "Rights", null)}
                        {createTextInput(formdata.further_info,'further_info', "Enter any further info, resources..", "Further Info", null)}
                        {createTextInput(formdata.external_link[0].url,'url', "External link URL ie. https://www...", "External Link", 'external_link')}
                        {createTextInput(formdata.external_link[0].text,'text', "Description of the link", '', "external_link")}

                        <tr><td></td><td></td></tr>
                        <tr><td colSpan={2}><hr /></td></tr>
                        <tr><td></td><td></td></tr>
    
                        {createTextInput(formdata.item_format,'item_format', "The item's format", "Format", null)}
                        {createTextInput(formdata.materials,'materials', "The materials used in the item", "Materials", null)}
                        {createTextInput(formdata.physical_dimensions,'physical_dimensions', "Physical dimensions", "Dimensions", null)}
                        
                        <tr><td></td><td></td></tr>
                        <tr><td colSpan={2}><hr /></td></tr>
                        <tr><td></td><td></td></tr>

                        {createTextInput(formdata.editor,'editor', "Editor's name(s)", "Editor", null)}
                        {createTextInput(formdata.publisher,'publisher', "Publisher", "Publisher", null)}
                        {createTextInput(formdata.language,'language', "ie. Cant, Gammon, Romani", "Language", null)}

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
                                        onChange={(event) => handleInput(event, 'pages', null)}
                                    />
                                </div>
                            </td>
                        </tr>

                        {createTextInput(formdata.reference,'reference', "Reference code", "Ref", null)}

                        <tr>
                            <td className="label">
                                Allow sharing
                            </td>
                            <td>
                                <div className="form_element share_toggle">
                                    <input 
                                        type="checkbox" 
                                        // className="share_toggle"
                                        checked={!formdata.shareDisabled} 
                                        onChange={() => handleSwitch()}
                                    />
                                </div>
                            </td>
                        </tr>

                        <tr><td></td><td></td></tr>
                        <tr><td colSpan={2}><hr /></td></tr>
                        <tr><td></td><td></td></tr>

                        {createTextInput(formdata.contributor,'contributor', "Add your name here", "Contributor", null)}

                        <tr>
                            <td colSpan={2}>
                                
                                <button 
                                    type="button" 
                                    className="delete"
                                    onClick={() => { if (window.confirm('Are you sure you wish to permanently delete this item?')) deleteThisItem() } }
                                >
                                    Delete item
                                </button>
                            </td>
                        </tr>

                        <tr className="half_width">
                            <td colSpan={2} >
                                <button type="button" className="half_width_l" onClick={() => { if (window.confirm('Are you sure you wish to cancel? All data entered will be lost!')) cancel() }}>Cancel</button>
                                <button type="submit" className="half_width_r">Save and Continue</button>
                            </td>
                        </tr>  

                    </tbody>
                    </table>
                    {saved ?
                        <p className="message center">Information saved!</p>
                    : null}
                </form>
            </div>
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
        parentpdf: state.items.parentpdf
    }
}

export default connect(mapStateToProps)(EditItem)