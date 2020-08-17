import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {Progress} from 'reactstrap';
import Select from 'react-select';


import { getItemById, deleteItem, updateItem } from '../../actions';

const config = require('../../config_client').get(process.env.NODE_ENV);


class EditItemFile extends PureComponent {

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
            // collection_id: '',     
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
            }
        },
        selectedFile: null,
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
        imgSrc: `/media/items/${this.props.match.params.id}/original/0.jpg`

    }

    componentDidMount() {
        this.props.dispatch(getItemById(this.props.match.params.id))
    }


    deletePost = () => {
        this.props.dispatch(deleteItem(this.state.formdata._id));
        this.props.history.push('/user/all-items');
    }


    componentDidUpdate(prevProps, prevState) {

        if (this.props != prevProps) {
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
                    file_format: item.file_format,
                    subcategory_ref: item.subcategory_ref
                }

                this.setState({
                    formdata: tempFormdata,
                    imgSrc: `/media/items/${this.state.formdata._id}/original/0.jpg`

                })
            }

            
        }
    }




    // *************** UPLOAD LOGIC ********************

    onChangeHandler = (event) => {


        var files = event.target.files;

        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkMimeType(event)) {  
            this.setState({
                selectedFile: files
            })
        }

        if (true) {
            let tempImgSrc = URL.createObjectURL(event.target.files[0]);

            console.log(tempImgSrc);

            this.setState({
                imgSrc: tempImgSrc
            })
        }
    }



    onClickHandler = () => {

        this.props.dispatch(updateItem(
            { 
                _id: this.state.formdata._id,
                file_format: this.state.selectedType
            }
        ))

        const data = new FormData() 
        
        if (this.state.selectedFile) {
            for(var x = 0; x<this.state.selectedFile.length; x++) {
                data.append('file', this.state.selectedFile[x])
            }

            // axios.post(`http://${config.IP_ADDRESS}:8000/upload/${this.state.formdata._id}`, data, {     
            axios.post(`http://${config.IP_ADDRESS}:3001/upload/${this.state.formdata._id}`, data, {     
            
                // receive two parameter endpoint url ,form data 
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
                    })
                }
            })
            .then(res => { // then print response status
                // console.log(res.config.data.id);
                // console.log(res.statusText);
                console.log(res);
                alert('File(s) uploaded successfully')
            })
            .catch(err => { 
                toast.error('upload fail')
            })
        }

        setTimeout(() => {
            this.props.history.push(`/items/${this.state.formdata._id}`)
        }, 1000)


    }

    maxSelectFile=(event)=>{

        // console.log(event);

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
        //getting file object
        let files = event.target.files 
        //define message container
        let err = ''
        // list allow mime type
        const types = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'application/pdf', 'video/mp4', 'video/quicktime']
        // loop access array
        for(var x = 0; x<files.length; x++) {
         // compare file type find doesn't matach
            if (types.every(type => files[x].type !== type)) {
                // create error message and assign to container   
                err += files[x].type+' is not a supported format\n';
            }
        };

        for(var z = 0; z<err.length; z++) { // loop create toast massage
            event.target.value = null 
            toast.error(err[z])
        }
        return true;
    }

    checkFileSize=(event)=>{
        let files = event.target.files
        let size = 15000 
        let err = ""; 

        for(var x = 0; x<files.length; x++) {
            if (files[x].size > size) {
                err += files[x].type+'is too large, please pick a smaller file\n';
            }
        };

        for(var z = 0; z<err.length; z++) {
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

        axios.post(`http://localhost:3001/delete-dir`, fileData  )
            // .then(res => { // then print response status
            //     console.log(res);
            //     toast.success('Media deleted successfully')
            //     alert('Media deleted successfully')
            // })
            // .catch(err => { 
            //     toast.error('Media delete fail')
            //     alert('Media delete fail')
            // });

        this.setState({
            imgSrc: '/media/default/default.jpg'
        })
    }


    handleFileType = (newValue) => {
        this.setState({
            selectedType: newValue.value
        })
    }

    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    } 

    


    render() {
        console.log(this.state);
        let items = this.props.items;


        return (
            
            <div className="main_view">
                <div className="rl_container article edit_page">
                        
                    <div className="item_container">
                        <Link to={`/items/${this.state.formdata._id}`} target="_blank" >

                            <div className="container">

                                <div className="img_back">
                                    <img src={this.state.imgSrc} alt="item main image" className="edit_main_img" onError={this.addDefaultImg} />
                                </div>
                                
                                <div className="centered edit_img_text"><h2>{this.state.formdata.title}</h2></div>
                                

                            </div>
                        </Link>
                    </div>
                    <h2>Upload Media File(s)</h2>



                    <div className="form_element">
                        {this.state.selectedType == 'jpg' ?
                            <input type="file" className="form-control" multiple name="file" accept="image/*" onChange={this.onChangeHandler}/>
                        : this.state.selectedType == 'mp4' ? 
                            <input type="file" className="form-control" multiple name="file" accept="video/*" onChange={this.onChangeHandler}/> 
                        : this.state.selectedType == 'pdf' ? 
                            <input type="file" className="form-control" multiple name="file" accept="application/pdf" onChange={this.onChangeHandler}/> 
                        : <input type="file" className="form-control" multiple name="file" onChange={this.onChangeHandler}/>
                        }

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

                        <div className="center">
                            <button type="button" className="btn btn-success btn-block edit_page_3_finish delete" onClick={(e) => { if (window.confirm('Are you sure you wish to delete all media (images, pdfs, videos)?')) this.deleteAllMedia() }}>Delete All Media Files</button> 
                        </div>

                        <div className="center">
                            <button type="button" className="btn btn-success btn-block edit_page_3_finish" onClick={this.onClickHandler}>Upload File(s) and Finish</button> 
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

                    {/* <div className="form-group">
                        <ToastContainer />
                    </div> */}

                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        items:state.items
    }
}


export default connect(mapStateToProps)(EditItemFile)


