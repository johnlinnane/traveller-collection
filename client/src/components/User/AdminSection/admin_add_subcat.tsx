import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import Select from 'react-select';


import { getAllCats, addSubcat } from '../../../../src/slices/catsSlice';
import { maxSelectFile, checkMimeType } from '../../../utils';
import { Category } from '../../../types';
import { AppDispatch } from '../../../../src/index';

import mongoose from 'mongoose';
const API_PREFIX = process.env.REACT_APP_API_PREFIX;

// interface AdminAddSubcatProps extends RouteComponentProps {
interface AdminAddSubcatProps {
    cats: Category[];
    dispatch: Function;
}

const AdminAddSubCat: React.FC<AdminAddSubcatProps> = props => {

    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();

    const [subcatdata, setSubcatdata] = useState({
        _id: new mongoose.Types.ObjectId().toHexString(),
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
        dispatch(getAllCats());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    interface Cat {
        _id: string;
        title: string;
    }

    useEffect(() => {
        if (props.cats?.length) {
            const tempAllCatsConverted = props.cats.map((cat: Cat) => ({
                value: cat._id,
                label: cat.title,
            }));
            setAllCatsConverted(tempAllCatsConverted);
            setConvertedCatsLoaded(true);
        }
    }, [props.cats]);


    const addDefaultImg = (ev) => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    const cancel = () => {
        navigate(`/admin/0`);
    }

    const handleInput = (event, field) => {

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
        if (maxSelectFile(event, 1) && checkMimeType(event, ['image'])) {  
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
        navigate(`/admin/0`);
    }

    const submitForm = (e) => {
        e.preventDefault();
        dispatch(addSubcat({...subcatdata}));
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

export default connect(mapStateToProps)(AdminAddSubCat);