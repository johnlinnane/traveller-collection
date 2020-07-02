import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {Progress} from 'reactstrap';

import { getItemById, deleteItem } from '../../actions';


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
        loaded: 0
    
    }

    componentDidMount() {
        this.props.dispatch(getItemById(this.props.match.params.id))
    }


    deletePost = () => {
        this.props.dispatch(deleteItem(this.state.formdata._id));
        this.props.history.push('/user/all-items');
    }


   


    static getDerivedStateFromProps(nextProps, prevState) {

        let formdata = prevState.formdata;
        if (nextProps.items.item ) {

            let item = nextProps.items.item;

            formdata = {
                ...formdata,
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
        }
        return {
            formdata: formdata
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
    }



    onClickHandler = () => {
        const data = new FormData() 
        
        if (this.state.selectedFile) {
            for(var x = 0; x<this.state.selectedFile.length; x++) {
                data.append('file', this.state.selectedFile[x])
            }

            // HOST-SELECT
            // axios.post(`http://localhost:8000/upload/${this.state.formdata._id}`, data, { 
            axios.post(`http://64.227.34.134:8000/upload/${this.state.formdata._id}`, data, { 
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
                toast.success('upload success')
                alert('Files uploaded successfully')
            })
            .catch(err => { 
                toast.error('upload fail')
            })
        }
        this.redirectUser(`/items/${this.props.items.item._id}`)


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


    redirectUser = (url) => {
        setTimeout(() => {
            this.props.history.push(url)
        }, 1000)
    }

    // addDefaultImg = (ev) => {
    //     const newImg = '/images/default/default.jpg';
    //     if (ev.target.src !== newImg) {
    //         ev.target.src = newImg
    //     }  
    // } 

    render() {
        // console.log(this.state);
        let items = this.props.items;


        return (
            
            <div className="main_view">
                <div className="rl_container article edit_page">
                        
                    <h2>Upload files:</h2>

                    {this.props.items && this.props.items.item ?
                        <span>Item: {this.props.items.item.title}</span>
                    : null }


                    {/* <img src={`/images/items/${this.props.match.params.id}/sq_thumbnail/0.jpg`} alt="Item" onError={this.addDefaultImg}/> */}


                    <div className="form_element">
                        <input type="file" className="form-control" multiple name="file" onChange={this.onChangeHandler}/>
                        <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Finish</button> 
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


