import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import {Progress} from 'reactstrap';

import { getAllCats } from '../../../actions';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const CatEdit = props => { 

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
                if (cat._id === props.match.params.id) {
                    setCatInfo(...cat);
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);


    const onChangeHandler = (id, event) => {
        let files = event.target.files;

        if (maxSelectFile(event) && checkMimeType(event) && checkMimeType(event)) {  
            setSelectedFile(files);
        }
    }

    const onSubmitHandler = () => {
        const data = new FormData() 
        if (selectedFile) {
            for(let x = 0; x<selectedFile.length; x++) {
                data.append('file', selectedFile[x])
            }
            axios.post(`${API_PREFIX}/upload-cat/${props.match.params.id}`, data, { 
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
        redirectUser(`/category/${props.match.params.id}`)
    }

    const maxSelectFile = event => {
        let files = event.target.files; // create file object
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
        const types = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf']
        for(let i = 0; i < files.length; i++) {
            if (types.every(type => files[i].type !== type)) {
                err += files[i].type+' is not a supported format\n';
            }
        };

        for(let j = 0; j < err.length; j++) { 
            event.target.value = null 
            toast.error(err[j])
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


    const redirectUser = url => {
        setTimeout(() => {
            props.history.push(url)
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
        cats:state.cats.cats
    }
}

export default connect(mapStateToProps)(CatEdit);