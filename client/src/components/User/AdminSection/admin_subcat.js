import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-tabs/style/react-tabs.css';
import Select from 'react-select';

import { getAllCats, getAllSubCats  } from '../../../actions';
import { deleteSubcat, updateSubcat  }  from '../../../actions';
import { maxSelectFile, checkMimeType, checkFileSize } from '../../../utils/files';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const AdminSubCat = props => {

    const [formdata, setFormdata] = useState({
        subCat: {
            _id: props.chosenSubCatInfo._id,
            title: props.chosenSubCatInfo.title,
            description: props.chosenSubCatInfo.description,
            parent_cat: props.chosenSubCatInfo.parent_cat,
            subCatIsHidden: props.chosenSubCatInfo.subCatIsHidden || false

        }
    });
    const [allCats, setAllCats] = useState([]);
    const [allSubcats, setAllSubcats] = useState([]);
    const [selectedCatConverted, setSelectedCatConverted] = useState({
        value: '',
        label: ''
    });
    const [allCatsConverted, setAllCatsConverted] = useState([]);
    const [imgSrc, setImgSrc] = useState(`${FS_PREFIX}/assets/media/cover_img_cat/${props.chosenSubCatInfo._id}.jpg`);
    const [saved, setSaved] = useState(false);
    const [catDeleted, setCatDeleted] = useState(false);
    const [selectedSubFiles, setSelectedSubFiles] = useState([]);
    const [selectedCatsLoaded, setSelectedCatsLoaded] = useState(false);
    const [subCatIsHidden, setSubCatIsHidden] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    
    useEffect(() => {
        props.dispatch(getAllCats());
        props.dispatch(getAllSubCats());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.chosenSubCatInfo) {
            setImgSrc(`${FS_PREFIX}/assets/media/cover_img_subcat/${props.chosenSubCatInfo._id}.jpg`);
        }

        if (props.cats && props.cats.length) {
            let tempAllCatsConverted = [];
            let tempSelectedCatConverted;
            props.cats.forEach( cat => {
                tempAllCatsConverted.push({
                    value: cat._id,
                    label: cat.title
                })

                if (cat._id === props.chosenSubCatInfo.parent_cat) {
                    tempSelectedCatConverted = {
                        value: cat._id,
                        label: cat.title
                    }
                }
            })
            setAllCats(props.cats);
            setAllCatsConverted(tempAllCatsConverted);
            setSelectedCatConverted(tempSelectedCatConverted);
            setSelectedCatsLoaded(true);
            setSubCatIsHidden(props.chosenSubCatInfo.subCatIsHidden || false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const handleTabIndex = () => {
        props.getTabIndex(props.index)
    }

    const handleHidden = () => {
        setFormdata({
            ...formdata,
            subCat: {
                ...formdata.subCat,
                subCatIsHidden: !formdata.subCat.subCatIsHidden
            }
        });
    }

    const onImgChange = event => {
        let files = event.target.files;
        if (maxSelectFile(event, 6) && checkMimeType(event) && checkFileSize(event)) {  
            setSelectedFile(files);
        }
        setImgSrc(URL.createObjectURL(event.target.files[0]));
    }

    const onSubmitHandler = () => {
        const data = new FormData();
        if (selectedFile) {
            for(let x = 0; x<selectedFile.length; x++) {
                data.append('file', selectedFile[x])
            }
            axios.post(`${API_PREFIX}/upload-subcat/${props.chosenSubCatInfo._id}`, data, { 
                // receive two parameter endpoint url ,form data 
                onUploadProgress: ProgressEvent => {
                    // setState({
                    //     loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
                    // })
                }
            })
            .then(res => { // then print response status
                toast.success('upload success')
                alert('File uploaded successfully')
            })
            .catch(err => { 
                toast.error('upload fail')
            })
        }
        setImgSrc(imgSrc + '?' + Math.random());
        handleTabIndex();
        props.history.push(`/admin/${props.index}`);
    }

    const addDefaultImg = ev => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    const handleSubCatInput = (event, field) => {
        let tempSubcat = formdata.subCat;
        switch (field) {
                    case 'title':
                        tempSubcat.title = event.target.value;
                        break;
                    case 'description':
                        tempSubcat.description = event.target.value;
                        break;
                    default:
                }
        setFormdata({
            ...formdata,
            subCat: tempSubcat
        });
    }

    const handleCatChange = newValue => {
        setFormdata({
            ...formdata,
            subCat: {
                ...formdata.subCat,
                parent_cat: newValue.value
            }
        });
    }

    const deleteImage = () => {
        let data = {
            path: `/cover_img_subcat/${formdata.subCat._id}.jpg`
        };
        axios.post(`${API_PREFIX}/delete-file`, data  )
        setImgSrc('/assets/media/default/default.jpg');
    }

    const removeSubCat = id => {
        props.dispatch(deleteSubcat(id))
        props.history.push(`/admin/0`)
    }

    const submitForm = e => {
        e.preventDefault();
        props.dispatch(updateSubcat(
            formdata.subCat
        ))
        onSubmitHandler();
        setTimeout(() => {
            props.history.push(`/admin/${props.index}`);
        }, 2000)
    }

    const cancel = () => {
        props.history.push(`/admin/0`)
    }

    return (
        <div className="admin">
            { props.chosenSubCatInfo ? 
                <div>
                    <form onSubmit={submitForm}>
                        <table className="form_input">
                        <tbody>
                            <tr>
                                <td>
                                    <h3>Title</h3>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder='Title'
                                        defaultValue={props.chosenSubCatInfo.title} 
                                        onChange={(event) => handleSubCatInput(event, 'title')}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h3>Description</h3>
                                </td>
                                <td>
                                    <textarea
                                        type="text"
                                        placeholder="Description"
                                        defaultValue={props.chosenSubCatInfo.description} 
                                        onChange={(event) => handleSubCatInput(event, 'description')}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h3>Sub-Category Image</h3>
                                </td>
                                <td>
                                    <img 
                                        className="change_cat_img" 
                                        src={imgSrc} 
                                        onError={addDefaultImg}
                                        alt='sub category cover'
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <div className="form_element">
                                        <input type="file" className="admin_cat_img_input form-control" multiple name="file" accept="image/*" onChange={onImgChange}/>
                                        <br />
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td></td>
                                <td>
                                    <button 
                                        type="button" 
                                        className="btn btn-success btn-block delete" 
                                        onClick={(e) => { if (window.confirm('Are you sure you wish to delete this image?')) deleteImage() }}
                                    >
                                        Delete Image
                                    </button> 
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h3>Visibility</h3>
                                </td>
                                <td>
                                    <div className="admin_cat_visibility">
                                    {/* <div> */}
                                        <input 
                                            type="checkbox" 
                                            checked={formdata.subCat.subCatIsHidden} 
                                            onChange={(event) => handleHidden(event)}
                                        />
                                        <span>Hide this subcategory.</span>
                                    </div>
                                    
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h3>Parent Category</h3>
                                </td>
                                {selectedCatsLoaded ?
                                        <td>
                                            <Select
                                                // key={`cat_${props.items.item._id}`}
                                                defaultValue={selectedCatConverted}
                                                // isMulti
                                                // name="colors"
                                                options={allCatsConverted}
                                                // className="basic-multi-select"
                                                className="basic-single"
                                                classNamePrefix="select"
                                                onChange={handleCatChange}
                                            />
                                        </td>
                                : null}
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <button type="button" 
                                        className="delete" 
                                        onClick={(e) => { if (window.confirm('Are you sure you wish to delete this sub-category?')) removeSubCat(props.chosenSubCatInfo._id) } }
                                    >
                                        Delete Sub-Category
                                    </button>
                                </td>
                            </tr>
                            <tr className="spacer"></tr>
                            <tr>
                                <td>
                                    <button type="submit">Save Changes</button>
                                </td>
                                <td>
                                    <button type="button" onClick={cancel}>Cancel</button>
                                </td>
                            </tr>
                            <tr className="spacer"></tr>
                        </tbody>
                        </table>
                    </form>

                    {catDeleted ?
                        <p className="message">Category deleted!</p>
                    : null}

                    {saved ?
                        <p className="message">All changes saved!</p>
                    : null}
                </div>
            : null }
        </div>
    )
}

function mapStateToProps(state) {
    return {
        cats:state.cats.cats,
        subcats:state.cats.subcats
    }
}

export default withRouter(connect(mapStateToProps)(AdminSubCat));