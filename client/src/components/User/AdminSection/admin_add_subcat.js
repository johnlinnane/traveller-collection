import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import Select from 'react-select';


import { getAllCats } from '../../../actions';
import { addSubcat } from '../../../actions';

import mongoose from 'mongoose';
const API_PREFIX = process.env.REACT_APP_API_PREFIX;

const AdminAddSubCat = props => {

    const [subcatdata, setSubcatdata] = useState({
        _id: mongoose.Types.ObjectId().toHexString(),
        title: '',
        description: '',
        parent_cat: ''
    });
    const [saved, setSaved] = useState(false);
    const [allCatsConverted, setAllCatsConverted] = useState([]);
    const [convertedCatsLoaded, setConvertedCatsLoaded] = useState(false);
    const [imgSrc, setImgSrc] = useState('/assets/media/default/default.jpg');
    // const [loaded, setLoaded] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);


    useEffect(() => {
        props.dispatch(getAllCats());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.cats && props.cats.length) {
            let tempAllCatsConverted = [];
            props.cats.forEach( cat => {
                tempAllCatsConverted.push({
                    value: cat._id,
                    label: cat.title
                })
            })
            setAllCatsConverted(tempAllCatsConverted);
            setConvertedCatsLoaded(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);


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

        const newSubcatdata = {
            ...subcatdata
        }

        if (field === 'title') {
            newSubcatdata.title = event.target.value;

        } 
        
        if (field === 'description') {
            newSubcatdata.description = event.target.value;
        } 

        setSubcatdata(newSubcatdata);
    }


    const handleCatChange = (newValue) => {
        let tempSubcatdata = subcatdata;
        tempSubcatdata.parent_cat = newValue.value
        setSubcatdata(tempSubcatdata);
    }

    const onImgChange = (event) => {
        let files = event.target.files;
        if (maxSelectFile(event) && checkMimeType(event) && checkMimeType(event)) {  
            setSelectedFile(files);
        }
        setImgSrc(URL.createObjectURL(event.target.files[0]));
    }


    const onSubmitHandler = () => {
        const data = new FormData();
        
        if (selectedFile) {
            for(let x = 0; x < selectedFile.length; x++) {
                data.append('file', selectedFile[x])
            }
            axios.post(`${API_PREFIX}/upload-subcat/${subcatdata._id}`, data, { 
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

    const maxSelectFile = event => {
        let files = event.target.files;
        if (files.length > 1) { 
            // const msg = 'Only 1 image can be uploaded at a time';
            event.target.value = null;
            return false;
        }
        return true;
    }

    const checkMimeType = event => {
        let files = event.target.files 
        let err = ''
        const types = ['image/png', 'image/jpeg', 'image/gif']
        for(let x = 0; x<files.length; x++) {
            if (types.every(type => files[x].type !== type)) {
                err += files[x].type+' is not a supported format\n';
            }
        };
        for(let z = 0; z<err.length; z++) {
            event.target.value = null 
            toast.error(err[z])
        }
        return true;
    }

    // const checkFileSize = event => {
    //     let files = event.target.files
    //     let size = 15000 
    //     let err = ""; 
    //     for(let x = 0; x<files.length; x++) {
    //         if (files[x].size > size) {
    //             err += files[x].type+'is too large, please pick a smaller file\n';
    //         }
    //     };
    //     for(let z = 0; z<err.length; z++) {
    //         toast.error(err[z])
    //         event.target.value = null
    //     }
    //     return true;
    // }    

    const submitForm = (e) => {
        e.preventDefault();
        props.dispatch(addSubcat({...subcatdata}));
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
                                    defaultValue={subcatdata.title} 
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
                                    defaultValue={subcatdata.description} 
                                    onChange={(event) => handleInput(event, 'description')}
                                    rows={6}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h3>Parent Category</h3>
                            </td>
                            {convertedCatsLoaded ?
                                    <td>
                                        <Select
                                            // key={`cat_${props.items.item._id}`}
                                            // defaultValue={null}
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
                            <td>
                                <img 
                                    className="change_cat_img" 
                                    src={imgSrc} 
                                    onError={addDefaultImg}
                                    alt='parent category cover'
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
                    <p className="message">Sucessfully added new subcategory!</p>
                : null}
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        cats:state.cats.cats
    }
}

export default withRouter(connect(mapStateToProps)(AdminAddSubCat));