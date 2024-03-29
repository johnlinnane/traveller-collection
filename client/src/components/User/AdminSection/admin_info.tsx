import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

import { getInfoText, updateInfoText} from '../../../slices/infosSlice';
import { maxSelectFile, checkMimeType } from '../../../utils';
import { Info } from '../../../types';
import { AppDispatch } from '../../../../src/index';

// import mongoose from 'mongoose';
const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

interface AdminInfoProps {
// interface AdminInfoProps extends RouteComponentProps {
    infotext: Info;
    dispatch: Function;
}

const AdminInfo: React.FC<AdminInfoProps> = props => {

    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate();

    type LocalInfo = Omit<Info, 'sections'> & {
        sections: {
            item_id: string;
            heading: string;
            paragraph: string;
        }[];
    };

    const [formdata, setFormdata] = useState<LocalInfo>({
        sections: [],
        iconsCaption: ''
    });
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [imgUrls, setImgUrls] = useState([]);
    const [iconImgSrc, setIconImgSrc] = useState(`${FS_PREFIX}/assets/media/info/icons.jpg`);
    const [selectedIconImg, setSelectedIconImg] = useState<string | Blob | null>(null);
    // const [imgSrc, setImgSrc] = useState('');
    const [saved, setSaved] = useState(null);


    useEffect(() => {
        dispatch(getInfoText());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.infotext?.sections?.length) {
            const tempSections = props.infotext.sections.map((section, i: number) => ({
                heading: section.heading,
                paragraph: section.paragraph,
                item_id: section.item_id,
            }));
            setFormdata(prevFormData => ({
                ...prevFormData,
                sections: tempSections,
            }));

            const tempImgUrls = props.infotext.sections.map((_, i: number) => 
                `${FS_PREFIX}/assets/media/info/${i}.jpg`
            );
            setImgUrls(tempImgUrls);
        }
    }, [props.infotext?.sections]);

    useEffect(() => {
        if (props.infotext?.iconsCaption) {
            setFormdata(prevFormData => ({
                ...prevFormData,
                iconsCaption: props.infotext.iconsCaption
            }));
        }
    }, [props.infotext?.iconsCaption]);

    const onChangeHandler = (event, i, name?) => {
        let files = event.target.files;
        if (i) {
            if (maxSelectFile(event, 1) && checkMimeType(event, ['image'])) {  
                let tempSelectedFiles = selectedFiles;
                tempSelectedFiles[i] = files[0];
                setSelectedFiles(tempSelectedFiles);
            }
            let tempImgSrc = imgUrls;
            tempImgSrc[i] = URL.createObjectURL(event.target.files[0]);
            // setImgSrc(tempImgSrc);
        }
        if (name) {
            if (maxSelectFile(event, 1) && checkMimeType(event, ['image'])) {  
                setSelectedIconImg(files[0]);
            }
            let tempIconImgSrc = iconImgSrc;
            tempIconImgSrc = URL.createObjectURL(event.target.files[0]);
            setIconImgSrc(tempIconImgSrc);
        }
    }

    const onSubmitHandler = i => {
        const data = new FormData() 
        if (selectedFiles && selectedFiles.length) {
            data.append('file', selectedFiles[i])
            axios.post(`${API_PREFIX}/upload-info/${i}`, data, {
                onUploadProgress: ProgressEvent => {
                    // setState({
                    //     loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
                    // })
                }
            })
            .then(res => { 
                toast.success('Upload success')
                alert('Files uploaded successfully')
            })
            .catch(err => { 
                toast.error('Upload fail')
            })
        }
        // redirectUser(`/items/${props.items.item._id}`)
    }

    const uploadIconsImg = name => {
        const data = new FormData() 
        if (selectedIconImg) {
            data.append('file', selectedIconImg)
            axios.post(`${API_PREFIX}/upload-info/${name}`, data, {
                // receive two parameter endpoint url ,form data 
                onUploadProgress: ProgressEvent => {
                    // setState({
                    //     loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
                    // })
                }
            })
            .then(res => { 
                toast.success('Upload success')
                alert('Files uploaded successfully')
            })
            .catch(err => { 
                toast.error('Upload fail')
            })
        }
    }

    const addDefaultImg = ev => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg;
        }  
    }

    const cancel = () => {
        navigate(`/admin/0`);
    }

    const handleInput = (event, i, field) => {
        let newFormdata = {
            ...formdata
        }
        if (field === 'heading') {
            newFormdata.sections[i].heading = event.target.value;
        }
        if (field === 'paragraph') {
            newFormdata.sections[i].paragraph = event.target.value;
        }
        if (field === 'icons') {
            newFormdata.iconsCaption = event.target.value;
        }
        setFormdata({
            ...formdata,
            ...newFormdata
        });
    }

    // const addSection = () => {
    //     setFormdata({
    //         ...formdata,
    //         sections: [
    //             ...formdata.sections,
    //             {
    //                 heading: '',
    //                 paragraph: '',
    //                 item_id: new mongoose.Types.ObjectId().toHexString()
    //             }
    //         ]
    //     });
    // }

    const removeSection = index => {
        let tempSections = formdata.sections;
        tempSections.splice(index, 1);
        setFormdata({
            ...formdata,
            sections: tempSections
        });
    }

    const submitForm = e => {
        e.preventDefault();
        dispatch(updateInfoText(
            formdata
        ))
        if (selectedFiles && selectedFiles.length) {
            for (let i = 0; i < selectedFiles.length; ++i) {
                onSubmitHandler(i);
            }
        }
        if (selectedIconImg) {
            uploadIconsImg('icons');
        }
        setSaved(true);
        setTimeout(() => {
            navigate(`/admin/0`);
        }, 2000)
    }

    const renderRows = () => (
        formdata.sections.map( (section, i) => (
            <React.Fragment key={section.item_id}>
                <tr>
                    <td>
                        Paragraph {i+1} Heading
                    </td>
                    <td>
                        <input
                            key={`heading${i}`}
                            type="text"
                            placeholder={`Paragraph ${i+1} Heading`}
                            defaultValue={section.heading} 
                            onChange={(event) => handleInput(event, i, 'heading')}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        Paragraph {i + 1} Body
                    </td>
                    <td>
                        <textarea
                            key={`para${i}`}
                            placeholder={`Paragraph ${i+1} Content`}
                            defaultValue={section.paragraph} 
                            onChange={(event) => handleInput(event, i, 'paragraph')}
                            rows={6}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Paragraph {i + 1} Image</td>
                    <td>
                        
                        <img src={imgUrls[i]} onError={addDefaultImg} alt='paragraph'/>
                        <div className="form_element">
                            <input type="file" className="form-control" name="file" accept="image/*" onChange={(event) => onChangeHandler(event, i)}/>
                            {/* <button type="button" className="btn btn-success btn-block" onClick={ () => {onSubmitHandler(i)} }>Upload</button>  */}
                        </div>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <button 
                            type="button" 
                            className="btn btn-success btn-block delete" 
                            onClick={() => { removeSection(i) }}
                        >
                            Remove Section
                        </button> 
                    </td>
                </tr>
                <tr>
                    <td colSpan={2}><hr/></td>
                </tr>
            </React.Fragment>
        ))
    )

    const renderIcons = () => (
        <React.Fragment>
            <tr>
                <td>
                    Icons caption
                </td>
                <td>
                    <input
                        type="text"
                        placeholder="Caption for icons"
                        defaultValue={formdata.iconsCaption} 
                        onChange={(event) => handleInput(event, null, 'icons')}
                    />
                </td>
            </tr>
            <tr>
                <td>Icons Image</td>
                <td>
                    <img src={iconImgSrc} onError={addDefaultImg} alt='icons'/>
                    <div className="form_element">
                        <input type="file" className="form-control" name="file" accept="image/*" onChange={(event) => onChangeHandler(event, null, 'icons')}/>
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan={2}><hr/></td>
            </tr>
        </React.Fragment>
    )


    return (
        <div className="admin form_input">
            <div className="admin_info">
                <h1>Edit About Page</h1>
                <form onSubmit={submitForm}>
                    <table className="admin_info_table_section" >
                        <tbody>
                            {formdata.sections ?
                                renderRows()
                            : null }
                            <tr><td></td><td></td></tr>
                            {/* <tr>
                                <td>
                                    Add Section
                                </td>
                                <td>
                                    <button 
                                        type="button" 
                                        onClick={(e) => { addSection() }}
                                    >
                                        Click here to add another section
                                    </button> 
                                </td>
                            </tr>
                            <tr><td></td><td></td></tr>
                            <tr>
                                <td colSpan={2}><hr/></td>
                            </tr> */}
                            {renderIcons()}
                            <tr>
                                <td>
                                    <button type="submit">Save Changes</button>
                                </td>

                                <td>
                                    <button type="button" onClick={cancel}>Cancel</button>
                                </td>
                            </tr>                  

                        </tbody>
                    </table>
                </form>
                {saved ?
                    <p className="message center">Information page updated!</p>
                : null}
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        infotext: state.infos.text
    }
}

export default connect(mapStateToProps)(AdminInfo);