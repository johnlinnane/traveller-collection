import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import {Progress} from 'reactstrap';
import { useParams, useNavigate } from "react-router-dom";

import { getAllCats } from '../../../actions';
import { maxSelectFile, checkMimeType } from '../../../utils';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const CatEdit = props => { 

    const params = useParams();
    const navigate = useNavigate();

    const loaded = 0;
    const [catInfo, setCatInfo] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    
    useEffect(() => {
        props.dispatch(getAllCats());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.cats) {
            props.cats.forEach( cat => {
                if (cat._id === params.id) {
                    setCatInfo({ ...cat });
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);


    const onChangeHandler = (id, event) => {
        let files = event.target.files;

        if (maxSelectFile(event, 1) && checkMimeType(event, ['image'])) {  
            setSelectedFile(files);
        }
    }

    const onSubmitHandler = () => {
        const data = new FormData() 
        if (selectedFile) {
            for(let x = 0; x<selectedFile.length; x++) {
                data.append('file', selectedFile[x])
            }
            axios.post(`${API_PREFIX}/upload-cat/${params.id}`, data, { 
                onUploadProgress: ProgressEvent => {
                    // this.setState({
                    //     loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
                    // })
                }
            })
            .then(res => { // then print response status
                toast.success('upload success')
                alert('File(s) uploaded successfully')
            })
            .catch(err => { 
                toast.error('upload fail')
            })
        }
        redirectUser(`/category/${params.id}`)
    }

    const redirectUser = url => {
        setTimeout(() => {
            navigate(url);
        }, 1000)
    }

    return (
        <div className="main_view">
            <div className="form_input item_form_input edit_page">
                <h3>Change Category Image:</h3>
                <div className="form_element sel_cat">
                    { catInfo ?
                        <div>
                            <h3>{catInfo.title}</h3>
                            <img src={`${FS_PREFIX}/assets/media/cover_img_cat/${catInfo._id}.jpg`} alt='cat cover'/>
                            <br/>
                            <input type="file" className="form-control" name="file" accept="image/*" onChange={(e) => onChangeHandler(catInfo._id, e)} />
                            
                        </div>
                    : null}
                    <button type="button" className="btn btn-success btn-block" onClick={onSubmitHandler}>Finish</button> 
                </div>
                <div className="form-group">
                    <Progress max="100" color="success" value={loaded} >
                        { loaded ?
                            <div>    
                                {Math.round(loaded)}
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
        cats:state.cats.cats
    }
}

export default connect(mapStateToProps)(CatEdit);