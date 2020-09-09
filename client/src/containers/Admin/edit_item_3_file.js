import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {Progress} from 'reactstrap';
import Select from 'react-select';


import { getItemById, getPendItemById, updateItem, updatePendItem, getFilesFolder } from '../../actions';

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
            },
            number_files: null
        },


        itemFiles: [],


        selectedFiles: null,
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
        imgSrc: [`/media/items/${this.props.match.params.id}/original/0.jpg`]

    }

    // checkImage(imageSrc, good, bad) {
    //     var img = new Image();
    //     img.src = imageSrc;
    //     img.onload = good; 
    //     img.onerror = bad;
    // }

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


    // deletePost = () => {
    //     this.props.dispatch(deleteItem(this.state.formdata._id));
    //     this.props.history.push('/user/all-items');
    // }


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
                    subcategory_ref: item.subcategory_ref,
                    number_files: item.number_files
                }

                this.setState({
                    formdata: tempFormdata,
                    imgSrc: [`/media/items/${this.state.formdata._id}/original/0.jpg`]

                })

                // console.log(item);
                if (this.props.items.files && this.props.items.files.length) {
                    console.log(item.files)
                    let tempItemFiles = [];
                    this.props.items.files.forEach( item => {
                        tempItemFiles.push(item.name)
                    })
                    this.setState({
                        itemFiles: tempItemFiles
                    })
                }

                // if (item.number_files) {
                
                //     for (let i = 0; i < item.number_files; i++) {
                //         const path = `/media/items/${this.state.formdata._id}/sq_thumbnail/`;
                //         // this.checkImage(`${path}${i}.jpg`, 
                //         // () => { 
                //             tempExistingImages.push(
                //                 `${path}${i}.jpg`
                //             ) 
                //         // }, 
                //         // () => { console.log(`image ${i} does not exist`) } );
                //     }
                //     this.setState({
                //         itemFiles: tempExistingImages,
                //     })
                // }
            }

            

           

            

            

            
        }
    
        // if (this.state != prevState) {
        //     console.log(tempExistingImages.length);
        //     if (tempExistingImages.length === this.props.items.item.number_files) {
                
        //         // this.setState({
        //         //     existingImgsLoaded: true
        //         // })
        //         this.setState((state, props) => ({
        //             existingImgsLoaded: true
        //         }));
        //     }
        // }
    }




    // *************** UPLOAD LOGIC ********************

    onChangeHandler = (event) => {


        var files = event.target.files;

        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkMimeType(event)) {  
            this.setState({
                selectedFiles: files
            })
        }
        
       
        // let tempImgSrc = URL.createObjectURL(event.target.files[0]);

        let tempImgSrc = []

        Array.from(files).forEach(file => { 
            tempImgSrc.push(URL.createObjectURL(file)) 
        });

        console.log(tempImgSrc)
        
        
        // event.target.files.forEach( (file, i) => {
        //     tempImgSrc.push(file)
        // } )
        


        this.setState({
            imgSrc: tempImgSrc,
            formdata: {
                ...this.state.formdata,
                number_files: parseInt(this.state.formdata.number_files) + 1
            }
        })
    }



    onClickHandler = () => {

        if (this.props.user.login.isAuth) {
            this.props.dispatch(updateItem(
                { 
                    _id: this.state.formdata._id,
                    file_format: this.state.selectedType
                }
            ))
        } else {
            this.props.dispatch(updatePendItem(
                { 
                    _id: this.state.formdata._id,
                    file_format: this.state.selectedType
                }
            ))
        }

        const data = new FormData() 
        
        if (this.state.selectedFiles) {
            for(var x = 0; x<this.state.selectedFiles.length; x++) {
                data.append('file', this.state.selectedFiles[x])
            }

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

        axios.post(`http://${config.IP_ADDRESS}:3001/delete-dir`, fileData  )
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

    deleteImage = (i) => {
        console.log(this.state.itemFiles[i])

        // delete image
        

 
        let data = {
            path: `/items/${this.state.formdata._id}/original/${this.state.itemFiles[i]}`
        };

        
        
        axios.post(`http://${config.IP_ADDRESS}:3001/delete-file`, data  )


        let data2 = {
            path: `/items/${this.state.formdata._id}/sq_thumbnail/${this.state.itemFiles[i]}`
        };
        
        // axios.post(`http://${config.IP_ADDRESS}:3001/delete-file`, data2  )


        // update db

        let tempItemFiles = this.state.itemFiles;
        
        tempItemFiles.splice(i, 1);

        console.log(tempItemFiles);

        this.setState({
            itemFiles: tempItemFiles
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
        console.log(this.props);
        let items = this.props.items;


        return (
            
            <div className="main_view">
                <div className="rl_container article edit_page">
                        
                    <div className="item_container">
                        <Link to={`/items/${this.state.formdata._id}`} target="_blank" >

                            <div className="container">
                                {this.state.itemFiles && this.state.itemFiles.length ?
                                    <div className="img_back">
                                        <img src={`/media/items/${this.state.formdata._id}/original/${this.state.itemFiles[0]}`} alt="item main image" className="edit_main_img" onError={this.addDefaultImg} />
                                    </div>
                                : null }
                                
                                <div className="centered edit_img_text"><h2>{this.state.formdata.title}</h2></div>
                                

                            </div>
                        </Link>
                    </div>

                    <h2>Upload Media File(s)</h2>
                    <p>Under Maintenance !</p>

                    {this.state.itemFiles ?
                        <div>
                                {this.state.itemFiles.map( (img, i) => (
                                    <div key={`card${i}`} className="edit_3_card">

                                        <div className="edit_3_card_left">
                                            <img src={`/media/items/${this.state.formdata._id}/original/${img}`} alt="item main image" className="edit_main_img" onError={this.addDefaultImg} />
                                        </div>
                                        <div className="edit_3_card_right">
                                            <button 
                                                type="button" 
                                                className="btn btn-success btn-block edit_page_3_finish delete" 
                                                onClick={(e) => { if (window.confirm('Delete this image?')) this.deleteImage(i) }}
                                            >
                                                Delete Image
                                            </button>
                                        </div>
                                        
                                    </div>
                                ))}
                            
                            
                                <div className="edit_3_card">
                                    <div className="edit_3_card_left">
                                        <img src="/media/default/default.jpg" alt="item main image" className="edit_main_img" onError={this.addDefaultImg} />
                                    </div>

                                

                                    <div className="edit_3_card_right">
                                        <div>
                                            Add a file
                                        </div>

                                        {this.state.selectedType == 'jpg' ?
                                            <input type="file" className="form-control"  name="file" accept="image/*" onChange={(event) => {this.onChangeHandler(event)}}/>
                                        : this.state.selectedType == 'mp4' ? 
                                            <input type="file" className="form-control"  name="file" accept="video/*" onChange={(event) => {this.onChangeHandler(event)}}/> 
                                        : this.state.selectedType == 'pdf' ? 
                                            <input type="file" className="form-control"  name="file" accept="application/pdf" onChange={(event) => {this.onChangeHandler(event)}}/> 
                                        : <input type="file" className="form-control"  name="file" onChange={(event) => {this.onChangeHandler(event)}}/>
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
                                    </div>
                                </div>
                            </div>
                    : null }    


           



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
    console.log(state)
    return {
        items: state.items,
        files: state.items.files
    }
}


export default connect(mapStateToProps)(EditItemFile)


