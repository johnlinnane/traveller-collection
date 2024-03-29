import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import { getIntroText, updateIntroText} from '../../../slices/introsSlice';
import { maxSelectFile, checkMimeType } from '../../../utils';
import { Intro } from '../../../types';
import { AppDispatch } from '../../../../src/index';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

interface AdminIntroProps {
    text: Intro,
    dispatch: Function;
}

const AdminIntro: React.FC<AdminIntroProps> = props => {

    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();

    const [introData, setIntroData] = useState<Intro>({
        title: '',
        body: ''
    });
    const [saved, setSaved] = useState(false);
    const [imgSrc, setImgSrc] = useState(`${FS_PREFIX}/assets/media/intro/intro.jpg`);
    const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
    
    useEffect(() => {
        dispatch(getIntroText());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.text) {
            let introData = {
                title: props.text.title,
                body: props.text.body
            }
            setIntroData(introData);
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const onImgChange = event => {
        let files = event.target.files;
        if (maxSelectFile(event, 1) && checkMimeType(event, ['image'])) {  
            setSelectedFile(files);
        }
        setImgSrc(URL.createObjectURL(event.target.files[0]));
    }

    const onSubmitHandler = () => {
        const data = new FormData() 
        if (selectedFile?.length) {
            for(let x = 0; x < selectedFile.length; x++) {
                data.append('file', selectedFile[x])
            }
            axios.post(`${API_PREFIX}/upload-intro-img`, data, { 
                onUploadProgress: ProgressEvent => {
                    // this.setState({
                    //     loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
                    // })
                }
            })
            .then(res => { 
                toast.success('upload success')
                alert('File(s) uploaded successfully')
            })
            .catch(err => { 
                toast.error('upload fail')
            })
        }
        // redirectUser(`/items/${props.items.item._id}`)
    }

    const addDefaultImg = ev => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    const handleInput = (event, field) => {
        const newIntroData = {
            ...introData
        }
        if (field === 'title') {
            newIntroData.title = event.target.value;
        }
        if (field === 'body') {
            newIntroData.body = event.target.value;
        }
        setIntroData(newIntroData);
    }

    const submitForm = e => {
        e.preventDefault();
        dispatch(updateIntroText(introData));
        onSubmitHandler();
        setSaved(true);
        setTimeout(() => {
            navigate(`/admin/0`);
        }, 2000)
    }

    const cancel = () => {
        navigate(`/admin/0`);
    }

    return (
        <div className="admin">
            <div className="admin_intro">
                <h1>Edit Intro Page</h1>
                <form onSubmit={submitForm}>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <p>
                                        <b>Heading</b> 
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <textarea
                                        placeholder="Text"
                                        defaultValue={introData.title} 
                                        onChange={(event) => handleInput(event, 'title')}
                                        rows={6}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>
                                        <b>Body Text</b> 
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <textarea
                                        placeholder="Text"
                                        defaultValue={introData.body} 
                                        onChange={(event) => handleInput(event, 'body')}
                                        rows={6}
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p>Change Image</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <img src={imgSrc} onError={addDefaultImg} alt='intro main'/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div className="form_element">
                                        <input type="file" className="form-control intro_input" multiple accept="image/*" name="file" onChange={onImgChange}/>
                                        {/* <button type="button" className="btn btn-success btn-block" onClick={onSubmitHandler}>Upload</button>  */}
                                    </div>
                                </td>
                            </tr>
                            <tr className="intro_buttons">
                                <td>
                                    <button type="submit">Save Changes</button>
                                    <button type="button" onClick={cancel}>Cancel</button>
                                </td>
                            </tr>  
                        </tbody>
                    </table>
                </form>
            </div>
            {saved ?
                <p className="message">Introduction page updated!</p>
            : null}
        </div>
    );
}

function mapStateToProps(state) {
    return {
        text: state.intros.text
    }
}

export default connect(mapStateToProps)(AdminIntro);