import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Progress} from 'reactstrap';

import { getItemById, getFilesFolder } from '../../../../src/slices/itemsSlice';
import { checkMimeType, checkFileSize, maxSelectFile } from '../../../utils';
import config from "../../../config";
import { AppDispatch } from '../../../../src/index';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const EditItemFile = props => {

    const dispatch = useDispatch<AppDispatch>();

    const params = useParams();
    const navigate = useNavigate();

    const [formdata, setFormdata] = useState({
        _id: params.id,
        title: '',
        creator: '',
        subject: '',
        description: '',
        source: '',
        date_created: '',
        
        contributor: '',
        item_format: '',
        materials: '',
        physical_dimensions: '',
        pages: '',        
        editor: '',
        publisher: '',
        further_info: '',
        language: '',
        reference: '',
        rights: '',
        file_format: '',
        address: '',
        subcategory_ref: '',
   
        external_link: {
            url: '',
            text: ''
        },
        geo: {
            address: ''
        },
        number_files: null
    });

    const [itemFiles, setItemFiles] = useState<string[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [selectedFilesImg, setSelectedFilesImg] = useState<string[]>([]);
    const [selectedFilesNum, setSelectedFilesNum] = useState(0);
    const [imgSrc, setImgSrc] = useState('/assets/media/default/default.jpg');
    const [inputKey, setInputKey] = useState(Math.random().toString(36));

    let loaded = 0;

    useEffect(() => {
        document.title = `Edit Item - ${config.defaultTitle}`;
        dispatch(getItemById(params.id))
        dispatch(getFilesFolder({folder: `/items/${params.id}/original`}))
        return () => {
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const item = props.items?.item;
        if (!item) return;

        setFormdata((prevData) => ({
            ...prevData,
            _id: item._id ?? prevData._id,
            title: item.title ?? prevData.title,
            creator: item.creator ?? prevData.creator,
            description: item.description ?? prevData.description,
            pages: item.pages ?? prevData.pages,
            source: item.source ?? prevData.source,
            subject: item.subject ?? prevData.subject,
            date_created: item.date_created ?? prevData.date_created,
            contributor: item.contributor ?? prevData.contributor,
            item_format: item.item_format ?? prevData.item_format,
            materials: item.materials ?? prevData.materials,
            physical_dimensions: item.physical_dimensions ?? prevData.physical_dimensions,
            editor: item.editor ?? prevData.editor,
            publisher: item.publisher ?? prevData.publisher,
            further_info: item.further_info ?? prevData.further_info,
            language: item.language ?? prevData.language,
            reference: item.reference ?? prevData.reference,
            rights: item.rights ?? prevData.rights,
            subcategory_ref: item.subcategory_ref ?? prevData.subcategory_ref,
            number_files: item.number_files ?? prevData.number_files
        }));
        setImgSrc('/assets/media/default/default.jpg');
    }, [props.items?.item]);

    useEffect(() => {
        if (props.items?.files?.length) {
            setItemFiles(props.items.files.map(item => item));
        }
    }, [props.items?.files]);

    const onChangeHandler = event => {
        let files = event.target.files;
        let tempSelectedFiles: string[] = selectedFiles;
        tempSelectedFiles.push(files)

        let tempSelectedFilesImg: string[] = selectedFilesImg;
        if (files[0] && files[0].type && JSON.stringify(files[0].type).includes('pdf') ) {
            tempSelectedFilesImg.push('/assets/media/icons/pdf.png');
        } else {
            tempSelectedFilesImg.push(URL.createObjectURL(files[0]));
        }

        if (
            maxSelectFile(event, 1) &&
            checkMimeType(event, ['all']) &&
            checkFileSize(event)
        ) {  
            setSelectedFilesNum(selectedFilesNum + 1);
            setSelectedFiles(tempSelectedFiles);
            setSelectedFilesImg(tempSelectedFilesImg);
            setInputKey(Math.random().toString(36));
        }
    }

    const onSubmitHandler = async () => {
        // dispatch(updateItem({ _id: formdata._id}));
        if (selectedFiles.length) {
            let filesForm = new FormData();
            selectedFiles.forEach( (file, i) => {
                filesForm.append('files', file[0]);  
            })
            try {
                await axios.post(`${API_PREFIX}/upload-array/${formdata._id}`, filesForm);
                alert('Item and media updoaded successfully!');
            } catch (err) {
                console.error('UPLOAD ERROR: ', err);
            }
                  
        }
        setTimeout(() => {
            navigate(`/items/${formdata._id}`);
        }, 1000)
    }

    const deleteAllMedia = () => {
        let fileData =  {
            section: 'items',
            id: formdata._id,
            fileType: null,
            fileName: null,
            deleteAll: true
        };
        axios.post(`${API_PREFIX}/delete-dir`, fileData  )
            .then(res => { 
                toast.success('Media deleted successfully')
                alert('Media deleted successfully')
            })
            .catch(err => { 
                toast.error('Media delete fail')
                alert('Media delete fail')
            });

        setImgSrc('/assets/media/default/default.jpg');

        setTimeout(() => {
            navigate(`/edit-item-file/${formdata._id}`)
        }, 1000)
    }

    const deleteImage = i => {
        let data = {
            path: `/items/${formdata._id}/original/${itemFiles[i]}`
        };
        axios.post(`${API_PREFIX}/delete-file`, data)
            .then( res => {
                let tempItemFiles = [...itemFiles];
                tempItemFiles.splice(i, 1);
                setItemFiles(tempItemFiles);
            })
    }

    const cancelInput = i => {
        let tempSelectedFiles = selectedFiles;
        tempSelectedFiles.splice(i, 1);
        let tempSelectedFilesImg = selectedFilesImg;
        tempSelectedFilesImg.splice(i, 1);
        setSelectedFiles(tempSelectedFiles);
        setSelectedFilesImg(tempSelectedFilesImg);
        setSelectedFilesNum(selectedFilesNum - 1);
    }

    const addDefaultImg = ev => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    } 

    return (
        <div className="main_view">
            <div className="form_input item_form_input edit_page">
                <Link to={`/items/${formdata._id}`} target="_blank" >
                    <div className="container">
                        <div className="img_back">
                            <img src={`${FS_PREFIX}/assets/media/items/${formdata._id}/original/${itemFiles[0]}`} alt="item main"  onError={addDefaultImg} />
                        </div>
                        <div className="centered edit_img_text">
                            <h2>{formdata.title}</h2>
                        </div>
                    </div>
                </Link>
                <h2>Upload Media File(s)</h2>
                {itemFiles.length ?
                    <div className="edit_3_list_of_cards">

                        {itemFiles.map( (img, i) => (
                            <div key={`card${i}`} className="edit_3_card">
                                <div className="edit_3_card_left">
                                    { img.includes(`.pdf`) ?
                                        <img src={'/assets/media/icons/pdf.png'} alt="item main"  onError={addDefaultImg} />
                                    : <img src={`${FS_PREFIX}/assets/media/items/${formdata._id}/original/${img}`} alt="item main"  onError={addDefaultImg} /> }
                                </div>
                                <div className="edit_3_card_right">
                                    <button 
                                        type="button" 
                                        className="btn btn-success btn-block  delete" 
                                        onClick={(e) => { if (window.confirm('This will permanently delete this file!')) deleteImage(i) }}
                                    >
                                        Delete File
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                : null }    
                { selectedFilesImg.length === selectedFilesNum ?
                    selectedFilesImg.map( (img, i) => (
                        <div key={`card${i}`} className="edit_3_card">
                            <div className="edit_3_card_left">
                                <img src={img} alt="item main"  onError={addDefaultImg} />
                            </div>
                            <div className="edit_3_card_right">
                            <button 
                                    type="button" 
                                    className="btn btn-success btn-block  cancel" 
                                    onClick={() => cancelInput(i)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))
                : null }
                <div 
                    className="edit_3_card"
                >
                    <div className="edit_3_card_left">
                        <img src={imgSrc} alt="item main" className="edit_main_img" onError={addDefaultImg} />
                    </div>
                    <div className="edit_3_card_right">
                        <label className="edit_3_label">
                            <input 
                                id="file_input"
                                key={`${inputKey}-image`}
                                type="file" 
                                className="form-control"  
                                accept="image/*, video/*, application/pdf" 
                                onChange={event => {onChangeHandler(event)}}
                            />
                            <div className="edit_page_3_button">
                                Add File
                            </div>
                        </label>
                    </div>
                </div>
                <div className="form_element">
                    { props.user && props.user.login && props.user.login.isAuth ?
                        <div className="center">
                            <button 
                                type="button" 
                                className="btn btn-success btn-block edit_page_3_finish delete" 
                                onClick={(e) => { if (window.confirm('Are you sure you wish to delete all media (images, pdfs, videos)?')) deleteAllMedia() }}
                            >
                                Delete All Media Files for this Item
                            </button> 
                        </div>
                    : null }
                    <div className="center">
                        <button type="button" className="btn btn-success btn-block edit_page_3_finish" onClick={onSubmitHandler}>Save and Finish</button> 
                    </div>
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
        items: state.items,
        files: state.items.files
    }
}

export default connect(mapStateToProps)(EditItemFile);