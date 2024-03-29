import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import { addCat } from '../../../../src/slices/catsSlice';
import { maxSelectFile, checkMimeType, addDefaultImg } from '../../../utils';
import { AppDispatch } from '../../../../src/index';

import mongoose from 'mongoose';
const API_PREFIX = process.env.REACT_APP_API_PREFIX;

// interface AdminAddCatProps extends RouteComponentProps {
interface AdminAddCatProps {
    dispatch: Function;
}

const AdminAddCat: React.FC<AdminAddCatProps> = props => {

    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();

    const [catdata, setCatdata] = useState({
        _id: new mongoose.Types.ObjectId().toHexString(),
        title: '',
        description: ''
    });
    const [saved, setSaved] = useState(false);
    const [imgSrc, setImgSrc] = useState('/assets/media/default/default.jpg');
    const [selectedFile, setSelectedFile] = useState(null);

    const cancel = () => {
        navigate(`/admin/0`);
    }

    const handleInput = (event, field) => {
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
        if (maxSelectFile(event, 1) && checkMimeType(event, ['image'])) {  
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
        navigate(`/admin/0`);
    }

    const submitForm = (e) => {
        e.preventDefault();
        dispatch(addCat({
            ...catdata,
        }));
        onSubmitHandler();
        setSaved(true);
        setTimeout(() => {
            navigate(`/admin/0`);
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

export default connect(mapStateToProps)(AdminAddCat);