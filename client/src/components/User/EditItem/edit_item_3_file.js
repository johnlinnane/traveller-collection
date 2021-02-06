import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {Progress} from 'reactstrap';
import Select from 'react-select';

import { getItemById, getPendItemById, updateItem, updatePendItem, getFilesFolder } from '../../../actions';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

class EditItemFile extends Component { // was PureComponent

    state = {
        formdata:{
            _id:this.props.match.params.id,
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
        },

        itemFiles: [],

        selectedFiles: [],
        selectedFilesImg: [],
        selectedFilesNum: 0,

        loaded: 0,
        fileTypes: [
            {
                value: 'jpg',
                label: "Image"
            },
            {
                value: 'pdf',
                label: "Document (PDF)"
            },
            {
                value: 'mp4',
                label: "Video (MP4)"
            },
        ],
        selectedType: 'jpg',
        imgSrc: '/assets/media/default/default.jpg',

        inputKey: Math.random().toString(36)

    }

    componentDidMount() {
        document.title = "Edit Item - Traveller Collection"
        if (this.props.user.login.isAuth) {
            this.props.dispatch(getItemById(this.props.match.params.id))
        } else {
            this.props.dispatch(getPendItemById(this.props.match.params.id))
        }
        this.props.dispatch(getFilesFolder({folder: `/items/${this.props.match.params.id}/original`}))
    }

    componentWillUnmount() {
        document.title = `Traveller Collection`
    }


    componentDidUpdate(prevProps, prevState) {

        if (this.props !== prevProps) {
            let tempFormdata = this.state.formdata;

            if (this.props.items.item ) {

                let item = this.props.items.item;
    
                tempFormdata = {
                    ...this.state.formdata,
                    _id:item._id,
                    title:item.title,  //
                    creator:item.creator,  //
                    description:item.description,  //
                    pages:item.pages,  //
                    source:item.source,   //
    
                    subject: item.subject,
                    date_created: item.date_created,
                    contributor: item.contributor,
                    item_format: item.item_format,
                    materials: item.materials,
                    physical_dimensions: item.physical_dimensions,
                    editor: item.editor,
                    publisher: item.publisher,
                    further_info: item.further_info,
                    language: item.language,
                    reference: item.reference,
                    rights: item.rights,
                    subcategory_ref: item.subcategory_ref,
                    number_files: item.number_files
                }

                this.setState({
                    formdata: tempFormdata,
                    imgSrc: '/assets/media/default/default.jpg'

                })

                if (this.props.items.files && this.props.items.files.length) {
                    let tempItemFiles = [];
                    this.props.items.files.forEach( item => {
                        tempItemFiles.push(item.name)
                    })
                    this.setState({
                        itemFiles: tempItemFiles
                    })
                }
            }
        }
    }




    // *************** UPLOAD LOGIC ********************

    onChangeHandler = (event) => {

        const file = event.target.files;
        console.log('.FILES: ', event.target.files);

        let tempSelectedFiles = this.state.selectedFiles;
        tempSelectedFiles.push(file)

        let tempSelectedFilesImg = this.state.selectedFilesImg;
        if (file[0] && file[0].type && JSON.stringify(file[0].type).includes('pdf') ) {
            tempSelectedFilesImg.push('/assets/media/icons/pdf.png');
        } else {
            tempSelectedFilesImg.push(URL.createObjectURL(file[0]));
        }


        

        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkMimeType(event)) {  
            this.setState({
                selectedFilesNum: this.state.selectedFilesNum + 1,
                selectedFiles: tempSelectedFiles,
                selectedFilesImg: tempSelectedFilesImg,
                inputKey: Math.random().toString(36)
            
            })
        }
    }



    onSubmitHandler = () => {
        console.log('ONSUBMITHANDLER TRIGGERED for', this.state.formdata._id)

        if (this.props.user.login.isAuth) {
            this.props.dispatch(updateItem(
                { 
                    _id: this.state.formdata._id
                }
            ))
        } else {
            this.props.dispatch(updatePendItem(
                { 
                    _id: this.state.formdata._id
                }
            ))
        }


        if (this.state.selectedFiles.length) {
            let formdata = new FormData() 

            this.state.selectedFiles.forEach( (file, i) => {
                formdata.append('files', file[0]);  
            })

            axios.post(`${API_PREFIX}/upload-array/${this.state.formdata._id}`, formdata)
                .then(res => { // then print response status
                    console.log(res);
                    alert('File(s) uploaded successfully')
                })
                .catch(err => { 
                    console.error('UPLOAD ERROR: ', err)
                })
        }




        // setTimeout(() => {
        //     this.props.history.push(`/items/${this.state.formdata._id}`)
        // }, 1000)


    }

    maxSelectFile=(event)=>{
        let files = event.target.files // create file object
            if (files.length > 6) { 
               const msg = 'Only 6 images can be uploaded at a time'
               event.target.value = null // discard selected file
               console.log(msg)
                return false;
          }
        return true;
    }

    checkMimeType=(event)=>{
        let files = event.target.files 
        let err = ''
        const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'video/mp4', 'video/quicktime']
        for(let x = 0; x<files.length; x++) {
            if (types.every(type => files[x].type !== type)) {
                err += files[x].type+' is not a supported format\n';
            }
        };

        for(let z = 0; z<err.length; z++) { // loop create toast massage
            event.target.value = null 
            toast.error(err[z])
        }
        return true;
    }

    checkFileSize=(event)=>{
        let files = event.target.files
        let size = 15000 
        let err = ""; 

        for(let x = 0; x<files.length; x++) {
            if (files[x].size > size) {
                err += files[x].type+'is too large, please pick a smaller file\n';
            }
        };

        for(let z = 0; z<err.length; z++) {
            toast.error(err[z])
            event.target.value = null
        }
        return true;
    }    

    // ****************************************************

    deleteAllMedia = () => {
        let fileData =  {
            section: 'items',
            id: this.state.formdata._id,
            fileType: null,
            fileName: null,
            deleteAll: true
        };

        axios.post(`${API_PREFIX}/delete-dir`, fileData  )
            .then(res => { 
                console.log(res);
                toast.success('Media deleted successfully')
                alert('Media deleted successfully')
            })
            .catch(err => { 
                toast.error('Media delete fail')
                alert('Media delete fail')
            });

        this.setState({
            imgSrc: '/assets/media/default/default.jpg'
        })

        setTimeout(() => {
            this.props.history.push(`/user/edit-item-file/${this.state.formdata._id}`)
        }, 1000)
    }



    deleteImage =  (i) => {
        console.log(this.state.itemFiles[i])

        let data = {
            path: `/items/${this.state.formdata._id}/original/${this.state.itemFiles[i]}`
        };
        
        axios.post(`${API_PREFIX}/delete-file`, data  )
            .then( res => {
                console.log(res.data);
                let tempItemFiles = [...this.state.itemFiles];
                tempItemFiles.splice(i, 1);
                console.log('FILES REMAINING: ',tempItemFiles);
                this.setState({
                    itemFiles: tempItemFiles
                })
            })


    }



    cancelInput = (i) => {
        
        let tempSelectedFiles = this.state.selectedFiles;
        tempSelectedFiles.splice(i, 1);

        let tempSelectedFilesImg = this.state.selectedFilesImg;
        tempSelectedFilesImg.splice(i, 1);

        this.setState({
            selectedFiles: tempSelectedFiles,
            selectedFilesImg: tempSelectedFilesImg,
            selectedFilesNum: this.state.selectedFilesNum - 1
        })
    }


    handleFileType = (newValue) => {
        this.setState({
            selectedType: newValue.value
        })
    }


    addDefaultImg = (ev) => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    } 



    render() {
        console.log(this.state);
        console.log('selectedFilesImg', this.state.selectedFilesImg.length, 'selectedFilesNum', this.state.selectedFilesNum)

        return (
            
            <div className="main_view">
                <div className="form_input item_form_input edit_page">
                        
                        <Link to={`/items/${this.state.formdata._id}`} target="_blank" >

                            <div className="container">
                                <div className="img_back">
                                    <img src={`${FS_PREFIX}/assets/media/items/${this.state.formdata._id}/original/${this.state.itemFiles[0]}`} alt="item main"  onError={this.addDefaultImg} />
                                </div>
                                
                                <div className="centered edit_img_text">
                                    <h2>{this.state.formdata.title}</h2>
                                </div>
                                

                            </div>
                        </Link>

                    <h2>Upload Media File(s)</h2>

                    {this.state.itemFiles.length ?
                        <div className="edit_3_list_of_cards">

                            {this.state.itemFiles.map( (img, i) => (
                                <div key={`card${i}`} className="edit_3_card">
                                    <div className="edit_3_card_left">
                                        { img.includes(`.pdf`) ?
                                            <img src={'/assets/media/icons/pdf.png'} alt="item main"  onError={this.addDefaultImg} />
                                        : <img src={`${FS_PREFIX}/assets/media/items/${this.state.formdata._id}/original/${img}`} alt="item main"  onError={this.addDefaultImg} /> }
                                    </div>
                                    <div className="edit_3_card_right">
                                        <button 
                                            type="button" 
                                            className="btn btn-success btn-block  delete" 
                                            onClick={(e) => { if (window.confirm('This will permanently delete this file!')) this.deleteImage(i) }}
                                        >
                                            Delete File
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    : null }    
                            
                    { this.state.selectedFilesImg.length === this.state.selectedFilesNum ?
                        this.state.selectedFilesImg.map( (img, i) => (
                            <div key={`card${i}`} className="edit_3_card">

                                <div className="edit_3_card_left">
                                    <img src={img} alt="item main"  onError={this.addDefaultImg} />
                                </div>
                                <div className="edit_3_card_right">
                                <button 
                                        type="button" 
                                        className="btn btn-success btn-block  cancel" 
                                        onClick={() => this.cancelInput(i)}
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
                            <img src={this.state.imgSrc} alt="item main" className="edit_main_img" onError={this.addDefaultImg} />
                        </div>

                        <div className="edit_3_card_right">
                            
                            <label className="edit_3_label">
                                {this.state.selectedType === 'jpg' ?
                                    <input 
                                        id="file_input"
                                        key={this.state.inputKey}
                                        type="file" 
                                        className="form-control"  
                                        accept="image/*" 
                                        onChange={(event) => {this.onChangeHandler(event)}}
                                    />
                                : this.state.selectedType === 'mp4' ? 
                                    <input 
                                        id="file_input"
                                        key={this.state.inputKey}
                                        type="file" 
                                        className="form-control"  
                                        accept="video/*" 
                                        onChange={(event) => {this.onChangeHandler(event)}}
                                    /> 
                                : this.state.selectedType === 'pdf' ? 
                                    <input 
                                        id="file_input"
                                        key={this.state.inputKey}
                                        type="file" 
                                        className="form-control"  
                                        accept="application/pdf" 
                                        onChange={(event) => {this.onChangeHandler(event)}}
                                    /> 
                                : <input 
                                    id="file_input"
                                    key={this.state.inputKey}
                                    type="file" 
                                    className="form-control"  
                                    onChange={(event) => {this.onChangeHandler(event)}}/>
                                }

                                <div className="edit_page_3_button">
                                    Add File
                                </div>
                            </label>

                            <p>Select File Type:</p>

                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue={this.state.fileTypes[0]}
                                // isDisabled={isDisabled}
                                // isLoading={isLoading}
                                // isClearable={isClearable}
                                // isRtl={isRtl}
                                // isSearchable={isSearchable}
                                name="color"
                                options={this.state.fileTypes}
                                onChange={this.handleFileType}
                            />
                        </div>
                    </div>
                    


                    <div className="form_element">

                        { this.props.user.login.isAuth ?
                            <div className="center">
                                <button 
                                    type="button" 
                                    className="btn btn-success btn-block edit_page_3_finish delete" 
                                    onClick={(e) => { if (window.confirm('Are you sure you wish to delete all media (images, pdfs, videos)?')) this.deleteAllMedia() }}
                                >
                                    Delete All Media Files for this Item
                                </button> 
                            </div>
                        : null }

                        <div className="center">
                            <button type="button" className="btn btn-success btn-block edit_page_3_finish" onClick={this.onSubmitHandler}>Save and Finish</button> 
                        </div>
                    </div>

                  


                    <div className="form-group">
                        <Progress max="100" color="success" value={this.state.loaded} >
                            { this.state.loaded ?
                                <div>    
                                    {Math.round(this.state.loaded,2)}
                                    %
                                </div>
                            :null}
                        </Progress>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        items: state.items,
        files: state.items.files
    }
}


export default connect(mapStateToProps)(EditItemFile)


