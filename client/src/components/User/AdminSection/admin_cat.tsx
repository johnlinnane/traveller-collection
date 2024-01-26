import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-tabs/style/react-tabs.css';

import { getAllCats  } from '../../../actions';
import { deleteCat, updateCat }  from '../../../actions';
import { maxSelectFile, checkMimeType } from '../../../utils';
import { Category } from '../../../types';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

interface AdminCatProps extends RouteComponentProps {
    chosenCatInfo: Category;
    dispatch: Function;
    index: number;
    getTabIndex: Function;
};

const AdminCat = (props: AdminCatProps): JSX.Element => {

    interface FormDataState {
        cat: Category
    };

    const [formdata, setFormdata] = useState<FormDataState>({
        cat: {
            _id: null,
            title: null,
            description: null,
            catIsHidden: false
        }
    });
    const [imgSrc, setImgSrc] = useState(`${FS_PREFIX}/assets/media/cover_img_cat/${props.chosenCatInfo._id}.jpg`);
    const [saved, setSaved] = useState(false);
    const [catDeleted, setCatDeleted] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    
    useEffect(() => {
        props.dispatch(getAllCats());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(props.chosenCatInfo ) {
            let tempFormdata = {
                cat: {
                    ...formdata.cat,
                    _id: props.chosenCatInfo._id,
                    title: props.chosenCatInfo.title,
                    description: props.chosenCatInfo.description,
                    catIsHidden: props.chosenCatInfo.catIsHidden || false
                }
            }
            setFormdata(tempFormdata);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const deleteImage = () => {
        let data = {
            path: `/cover_img_cat/${formdata.cat._id}.jpg`
        };
        axios.post(`${API_PREFIX}/delete-file`, data  )
        setImgSrc('/assets/media/default/default.jpg');
    }

    const onImgChange = (event) => {
        let files = event.target.files;
        if (files.length) {
            if (maxSelectFile(event, 1) && checkMimeType(event, ['image'])) {  
                setSelectedFiles(files);
            }
            setImgSrc(URL.createObjectURL(files[0]));
        }
    }

    const onSubmitHandler = () => {
        const data = new FormData();
        if (selectedFiles) {
            for(let x = 0; x < selectedFiles.length; x++) {
                data.append('file', selectedFiles[x])
            }
            axios.post(`${API_PREFIX}/upload-cat/${props.chosenCatInfo._id}`, data)
            .then(res => { 
                toast.success('upload success')
                alert('File uploaded successfully')
            })
            .catch(err => { 
                toast.error('upload fail')
            })
        }
        setImgSrc(imgSrc + '?' + Math.random());
        props.history.push(`/admin/${props.index}`);
    }

    const handleCatInput = (event, field) => {
        let newFormdata = {
            ...formdata
        }
        if (field === 'cat_title') {
            newFormdata.cat.title = event.target.value;

        } else if (field === 'cat_description') {
            newFormdata.cat.description = event.target.value;
        } 
        setFormdata(newFormdata);
    }

    const handleHidden = () => {
        setFormdata({
            ...formdata,
            cat: {
                ...formdata.cat,
                catIsHidden: !formdata.cat.catIsHidden
            }
        });
    }

    const addDefaultImg = (ev) => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    const removeCat = (e, id) => {
        props.dispatch(deleteCat(id));
        setCatDeleted(true);
        setTimeout(() => {
            props.history.push(`/admin/0`);
        }, 1000)
    }

    const submitForm = (e) => {
        e.preventDefault();
        props.dispatch(updateCat(
                formdata.cat
        ))
        onSubmitHandler();
        setSaved(true);
        setTimeout(() => {
            props.history.push(`/admin/${props.index}`);
        }, 2000)
        
    }

    const cancel = () => {
        props.history.push(`/admin/0`)
    }

    return (
        <div className="admin">
            { props.chosenCatInfo ? 
                <div className="admin_cat_component">
                    <form onSubmit={submitForm}>
                        <table>
                        <tbody>
                            <tr>
                                <td>
                                    <h3>Title</h3>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={props.chosenCatInfo.title}
                                        defaultValue={props.chosenCatInfo.title} 
                                        onChange={(event) => handleCatInput(event, 'cat_title')}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h3>Description</h3>
                                </td>
                                <td>
                                    <textarea
                                        placeholder="Enter category description"
                                        defaultValue={props.chosenCatInfo.description} 
                                        onChange={(event) => handleCatInput(event, 'cat_description')}
                                        rows={6}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <h3>Category Image</h3>
                                </td>
                                <td>
                                    <img className="change_cat_img" src={imgSrc} onError={addDefaultImg} alt='category cover'/>
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
                                        <input 
                                            type="checkbox" 
                                            checked={formdata.cat.catIsHidden} 
                                            onChange={() => handleHidden()}
                                        />
                                        <span>Hide this category.</span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}>
                                    <button type="button" 
                                        className="delete" 
                                        onClick={(e) => { if (window.confirm('Are you sure you wish to delete this category?')) removeCat(e, props.chosenCatInfo._id) } }
                                    >
                                        Delete Category
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

export default connect(mapStateToProps)(AdminCat);