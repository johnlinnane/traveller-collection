import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {Progress} from 'reactstrap';
import Select from 'react-select';
import { getItemById, getPendItemById, updateItem, updatePendItem, getFilesFolder } from '../../../actions';
import config from "../../../config";
const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const EditItemFile = props => {

    const [formdata, setFormdata] = useState({
        _id:props.match.params.id,
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
        address: '',
        subcategory_ref: '',
   
        external_link: {
            url: '',
            text: ''
        },
        geo: {
            address: ''
        },
        number_files: null
    });
    const [itemFiles, setItemFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFilesImg, setSelectedFilesImg] = useState([]);
    const [selectedFilesNum, setSelectedFilesNum] = useState(0);
    let loaded = 0;
    const fileTypes = [
        {
            value: 'jpg',
            label: "Image"
        },
        {
            value: 'pdf',
            label: "Document (PDF)"
        },
        {
            value: 'mp4',
            label: "Video (MP4)"
        }
    ];
    const [selectedType, setSelectedType] = useState('jpg');
    const [imgSrc, setImgSrc] = useState('/assets/media/default/default.jpg');
    const [inputKey, setInputKey] = useState(Math.random().toString(36));

    useEffect(() => {
        document.title = `Edit Item - ${config.defaultTitle}`;
        if (props.user && props.user.login && props.user.login.isAuth) {
            props.dispatch(getItemById(props.match.params.id))
        } else {
            props.dispatch(getPendItemById(props.match.params.id))
        }
        props.dispatch(getFilesFolder({folder: `/items/${props.match.params.id}/original`}))
        return () => {
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        let tempFormdata = formdata;
        if (props.items.item ) {
            let item = props.items.item;
            tempFormdata = {
                ...formdata,
                _id:item._id,
                title:item.title,  //
                creator:item.creator,  //
                description:item.description,  //
                pages:item.pages,  //
                source:item.source,   //

                subject: item.subject,
                date_created: item.date_created,
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
                subcategory_ref: item.subcategory_ref,
                number_files: item.number_files
            }
            setFormdata(tempFormdata);
            setImgSrc('/assets/media/default/default.jpg');
            if (props.items.files && props.items.files.length) {
                let tempItemFiles = [];
                props.items.files.forEach( item => {
                    tempItemFiles.push(item.name)
                })
                setItemFiles(tempItemFiles);
            }
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onChangeHandler = event => {

        const file = event.target.files;
        let tempSelectedFiles = selectedFiles;
        tempSelectedFiles.push(file)

        let tempSelectedFilesImg = selectedFilesImg;
        if (file[0] && file[0].type && JSON.stringify(file[0].type).includes('pdf') ) {
            tempSelectedFilesImg.push('/assets/media/icons/pdf.png');
        } else {
            tempSelectedFilesImg.push(URL.createObjectURL(file[0]));
        }

        if (maxSelectFile(event) && checkMimeType(event) && checkFileSize(event)) {  
            setSelectedFilesNum(selectedFilesNum + 1);
            setSelectedFiles(tempSelectedFiles);
            setSelectedFilesImg(tempSelectedFilesImg);
            setInputKey(Math.random().toString(36));
        }
    }

    const onSubmitHandler = () => {
        if (props.user.login.isAuth) {
            props.dispatch(updateItem(
                { 
                    _id: formdata._id
                }
            ))
        } else {
            props.dispatch(updatePendItem(
                { 
                    _id: formdata._id
                }
            ))
        }
        if (selectedFiles.length) {
            let formdata = new FormData() 

            selectedFiles.forEach( (file, i) => {
                formdata.append('files', file[0]);  
            })
            axios.post(`${API_PREFIX}/upload-array/${formdata._id}`, formdata)
                .then(res => { // then print response status
                    alert('File(s) uploaded successfully')
                })
                .catch(err => { 
                    console.error('UPLOAD ERROR: ', err)
                })
        }
        setTimeout(() => {
            props.history.push(`/items/${formdata._id}`)
        }, 1000)
    }

    const maxSelectFile = event => {
        let files = event.target.files;
        if (files.length > 6) { 
            // const msg = 'Only 6 images can be uploaded at a time';
            event.target.value = null;
            return false;
        }
        return true;
    }

    const checkMimeType = event => {
        let files = event.target.files 
        let err = ''
        const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'video/mp4', 'video/quicktime']
        for(let x = 0; x<files.length; x++) {
            if (types.every(type => files[x].type !== type)) {
                err += files[x].type+' is not a supported format\n';
            }
        };

        for(let z = 0; z<err.length; z++) { // loop create toast massage
            event.target.value = null 
            toast.error(err[z])
        }
        return true;
    }

    const checkFileSize = event => {
        let files = event.target.files
        let size = 15000 
        let err = ""; 

        for(let x = 0; x<files.length; x++) {
            if (files[x].size > size) {
                err += files[x].type+'is too large, please pick a smaller file\n';
            }
        };

        for(let z = 0; z<err.length; z++) {
            toast.error(err[z])
            event.target.value = null
        }
        return true;
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
                toast.success('Media deleted successfully')
                alert('Media deleted successfully')
            })
            .catch(err => { 
                toast.error('Media delete fail')
                alert('Media delete fail')
            });

        setImgSrc('/assets/media/default/default.jpg');

        setTimeout(() => {
            props.history.push(`/user/edit-item-file/${formdata._id}`)
        }, 1000)
    }

    const deleteImage = i => {
        let data = {
            path: `/items/${formdata._id}/original/${itemFiles[i]}`
        };
        axios.post(`${API_PREFIX}/delete-file`, data)
            .then( res => {
                let tempItemFiles = [...itemFiles];
                tempItemFiles.splice(i, 1);
                setItemFiles(tempItemFiles);
            })
    }

    const cancelInput = i => {
        let tempSelectedFiles = selectedFiles;
        tempSelectedFiles.splice(i, 1);
        let tempSelectedFilesImg = selectedFilesImg;
        tempSelectedFilesImg.splice(i, 1);
        setSelectedFiles(tempSelectedFiles);
        setSelectedFilesImg(tempSelectedFilesImg);
        setSelectedFilesNum(selectedFilesNum - 1);
    }

    const handleFileType = newValue => {
        setSelectedType(newValue.value);
    }

    const addDefaultImg = ev => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    } 

    return (
        <div className="main_view">
            <div className="form_input item_form_input edit_page">
                <Link to={`/items/${formdata._id}`} target="_blank" >
                    <div className="container">
                        <div className="img_back">
                            <img src={`${FS_PREFIX}/assets/media/items/${formdata._id}/original/${itemFiles[0]}`} alt="item main"  onError={addDefaultImg} />
                        </div>
                        <div className="centered edit_img_text">
                            <h2>{formdata.title}</h2>
                        </div>
                    </div>
                </Link>
                <h2>Upload Media File(s)</h2>
                {itemFiles.length ?
                    <div className="edit_3_list_of_cards">

                        {itemFiles.map( (img, i) => (
                            <div key={`card${i}`} className="edit_3_card">
                                <div className="edit_3_card_left">
                                    { img.includes(`.pdf`) ?
                                        <img src={'/assets/media/icons/pdf.png'} alt="item main"  onError={addDefaultImg} />
                                    : <img src={`${FS_PREFIX}/assets/media/items/${formdata._id}/original/${img}`} alt="item main"  onError={addDefaultImg} /> }
                                </div>
                                <div className="edit_3_card_right">
                                    <button 
                                        type="button" 
                                        className="btn btn-success btn-block  delete" 
                                        onClick={(e) => { if (window.confirm('This will permanently delete this file!')) deleteImage(i) }}
                                    >
                                        Delete File
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                : null }    
                { selectedFilesImg.length === selectedFilesNum ?
                    selectedFilesImg.map( (img, i) => (
                        <div key={`card${i}`} className="edit_3_card">
                            <div className="edit_3_card_left">
                                <img src={img} alt="item main"  onError={addDefaultImg} />
                            </div>
                            <div className="edit_3_card_right">
                            <button 
                                    type="button" 
                                    className="btn btn-success btn-block  cancel" 
                                    onClick={() => cancelInput(i)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))
                : null }
                <div 
                    className="edit_3_card"
                >
                    <div className="edit_3_card_left">
                        <img src={imgSrc} alt="item main" className="edit_main_img" onError={addDefaultImg} />
                    </div>
                    <div className="edit_3_card_right">
                        <label className="edit_3_label">
                            {selectedType === 'jpg' ?
                                <input 
                                    id="file_input"
                                    key={inputKey}
                                    type="file" 
                                    className="form-control"  
                                    accept="image/*" 
                                    onChange={event => {onChangeHandler(event)}}
                                />
                            : selectedType === 'mp4' ? 
                                <input 
                                    id="file_input"
                                    key={inputKey}
                                    type="file" 
                                    className="form-control"  
                                    accept="video/*" 
                                    onChange={event => {onChangeHandler(event)}}
                                /> 
                            : selectedType === 'pdf' ? 
                                <input 
                                    id="file_input"
                                    key={inputKey}
                                    type="file" 
                                    className="form-control"  
                                    accept="application/pdf" 
                                    onChange={event => {onChangeHandler(event)}}
                                /> 
                            : <input 
                                id="file_input"
                                key={inputKey}
                                type="file" 
                                className="form-control"  
                                onChange={event => {onChangeHandler(event)}}/>
                            }

                            <div className="edit_page_3_button">
                                Add File
                            </div>
                        </label>
                        <p>Select File Type:</p>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            defaultValue={fileTypes[0]}
                            // isDisabled={isDisabled}
                            // isLoading={isLoading}
                            // isClearable={isClearable}
                            // isRtl={isRtl}
                            // isSearchable={isSearchable}
                            name="color"
                            options={fileTypes}
                            onChange={handleFileType}
                        />
                    </div>
                </div>
                <div className="form_element">
                    { props.user && props.user.login && props.user.login.isAuth ?
                        <div className="center">
                            <button 
                                type="button" 
                                className="btn btn-success btn-block edit_page_3_finish delete" 
                                onClick={(e) => { if (window.confirm('Are you sure you wish to delete all media (images, pdfs, videos)?')) deleteAllMedia() }}
                            >
                                Delete All Media Files for this Item
                            </button> 
                        </div>
                    : null }
                    <div className="center">
                        <button type="button" className="btn btn-success btn-block edit_page_3_finish" onClick={onSubmitHandler}>Save and Finish</button> 
                    </div>
                </div>
                <div className="form-group">
                    <Progress max="100" color="success" value={loaded} >
                        { loaded ?
                            <div>    
                                {Math.round(loaded,2)}
                                %
                            </div>
                        :null}
                    </Progress>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        items: state.items,
        files: state.items.files
    }
}

export default connect(mapStateToProps)(EditItemFile);