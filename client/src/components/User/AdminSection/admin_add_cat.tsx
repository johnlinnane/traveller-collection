import React, { useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';

import { addCat } from '../../../actions';

import { checkMimeType, maxSelectFile } from '../../../utils';

import mongoose from 'mongoose';
const API_PREFIX = process.env.REACT_APP_API_PREFIX;

const AdminAddCat = props => {

    const [catdata, setCatdata] = useState({
        _id: mongoose.Types.ObjectId().toHexString(),
        title: '',
        description: ''
    });
    const [saved, setSaved] = useState(false);
    const [imgSrc, setImgSrc] = useState('/assets/media/default/default.jpg');
    const [selectedFile, setSelectedFile] = useState(null);


    const addDefaultImg = (ev) => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    const cancel = () => {
        props.history.push(`/admin/0`)
    }

    const handleInput = (event, field, i) => {
        const newCatdata = {
            ...catdata
        }
        if (field === 'title') {
            newCatdata.title = event.target.value;
        } 
        if (field === 'description') {
            newCatdata.description = event.target.value;
        } 
        setCatdata(newCatdata);
    }

    const onImgChange = (event) => {
        let files = event.target.files;
        if (maxSelectFile(event, 1) && checkMimeType(event, ['image/png', 'image/jpeg', 'image/gif'])) {  
            setSelectedFile(files)
        }
        setImgSrc(URL.createObjectURL(event.target.files[0]));
    }

    const onSubmitHandler = () => {
        const data = new FormData();
        if (selectedFile) {
            for(let x = 0; x < selectedFile.length; x++) {
                data.append('file', selectedFile[x])
            }
            axios.post(`${API_PREFIX}/upload-cat/${catdata._id}`, data, { 
                // onUploadProgress: ProgressEvent => {
                //     setLoaded((ProgressEvent.loaded / ProgressEvent.total*100));
                // }
            })
            .then(res => { 
                toast.success('upload success')
                alert('File uploaded successfully')
            })
            .catch(err => { 
                toast.error('upload fail')
            })
        }
        props.history.push(`/admin/${props.index}`);
    }

    const submitForm = (e) => {
        e.preventDefault();
        props.dispatch(addCat({
            ...catdata,
        }));
        onSubmitHandler();
        setSaved(true);
        setTimeout(() => {
            props.history.push(`/admin/0`);
        }, 2000)
    }

    return (
        <div className="admin">
            <div>
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
                                    placeholder={"Enter title"}
                                    defaultValue={catdata.title} 
                                    onChange={(event) => handleInput(event, 'title')}
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
                                    placeholder="Enter category description"
                                    defaultValue={catdata.description} 
                                    onChange={(event) => handleInput(event, 'description')}
                                    rows={6}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <img 
                                    className="change_cat_img" 
                                    src={imgSrc} 
                                    onError={addDefaultImg}
                                    alt='cat cover'
                                />
                            </td>
                            <td>
                                <div className="form_element">
                                    <input type="file" className="form-control" multiple name="file" accept="image/*" onChange={onImgChange}/>
                                    <br />
                                </div>
                            </td>
                        </tr>
                        <tr className="spacer"></tr>
                        <tr className="spacer"></tr>
                        <tr>
                            <td>
                                <button type="submit">Add Category</button>
                            </td>
                            <td>
                                <button type="button" onClick={cancel}>Cancel</button>
                            </td>
                        </tr>
                        <tr className="spacer"></tr>
                    </tbody>
                    </table>
                </form>

                {saved ?
                    <p className="message">Sucessfully added new category!</p>
                : null}
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        // xxx: state.xxx.xxxx
    }
}

export default withRouter(connect(mapStateToProps)(AdminAddCat));