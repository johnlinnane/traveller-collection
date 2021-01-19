import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';


import { addCat } from '../../../actions';

const mongoose = require('mongoose');
const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const config = require('../../../config_client').get(process.env.NODE_ENV);


class AdminAddCat extends Component {

    state = {
        catdata: {
            _id: mongoose.Types.ObjectId().toHexString(),
            title: '',
            description: ''
        },
        saved: false,
        imgSrc: '/assets/media/default/default.jpg'
    }



    



    addDefaultImg = (ev) => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    cancel = () => {
        this.props.history.push(`/admin/0`)
    }


    handleInput = (event, field, i) => {

        const newCatdata = {
            ...this.state.catdata
        }

        if (field === 'title') {
            newCatdata.title = event.target.value;

        } 
        
        if (field === 'description') {
            newCatdata.description = event.target.value;
        } 

        // copy it back to state
        this.setState({
            catdata: newCatdata,
        })
        console.log(this.state);
    }

    addDefaultImg = (ev) => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    // *************** UPLOAD LOGIC ********************

    onImgChange = (event) => {
        let files = event.target.files;

        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkMimeType(event)) {  
            this.setState({
                selectedFile: files
            })
        }

        this.setState({
            imgSrc: URL.createObjectURL(event.target.files[0])
        })
    }


    onSubmitHandler = () => {
        const data = new FormData();
        
        if (this.state.selectedFile) {
            for(let x = 0; x<this.state.selectedFile.length; x++) {
                data.append('file', this.state.selectedFile[x])
            }
            axios.post(`${API_PREFIX}/upload-cat/${this.state.catdata._id}`, data, { 
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
                    })
                }
            })
            .then(res => { // then print response status
                console.log(res);
                toast.success('upload success')
                alert('File uploaded successfully')
            })
            .catch(err => { 
                toast.error('upload fail')
            })
        }


        this.props.history.push(`/admin/${this.props.index}`);
        
    }

    maxSelectFile=(event)=>{


        let files = event.target.files // create file object
            if (files.length > 1) { 
               const msg = 'Only 1 image can be uploaded at a time'
               event.target.value = null // discard selected file
               console.log(msg)
              return false;
     
          }
        return true;
     
    }

    checkMimeType=(event)=>{
        let files = event.target.files 
        let err = ''
        const types = ['image/png', 'image/jpeg', 'image/gif']
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



    submitForm = (e) => {
        e.preventDefault();
        // console.log(this.state.formdata);

        // dispatch an action, adding updated  formdata + the user id from the redux store
        this.props.dispatch(addCat({
                ...this.state.catdata,
        }));

        this.onSubmitHandler();

        this.setState({
            saved: true
        })

        setTimeout(() => {
            // this.props.history.push(`/user/edit-item-sel/${this.props.items.newitem.itemId}`);
            this.props.history.push(`/admin/0`);
        }, 2000)
    }


    render() {

        return (
            <div className="admin">
                    <div>
                        <form onSubmit={this.submitForm}>
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
                                            defaultValue={this.state.catdata.title} 
                                            onChange={(event) => this.handleInput(event, 'title')}
                                        />

                                    </td>
                                </tr>


                                <tr>
                                    <td>
                                        <h3>Description</h3>
                                    </td>
                                    <td>
                                        <textarea
                                            type="text"
                                            placeholder="Enter category description"
                                            defaultValue={this.state.catdata.description} 
                                            onChange={(event) => this.handleInput(event, 'description')}
                                            rows={6}
                                        />
                                    </td>
                                </tr>



                                <tr>
                                    <td>
                                        <img 
                                            className="change_cat_img" 
                                            src={this.state.imgSrc} 
                                            onError={this.addDefaultImg}
                                            alt='cat cover'
                                        />
                                    </td>
                                    <td>
                                        <div className="form_element">
                                            <input type="file" className="form-control" multiple name="file" accept="image/*" onChange={this.onImgChange}/>
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
                                        <button type="button" onClick={this.cancel}>Cancel</button>
                                    </td>
                                    
                                </tr>

                                <tr className="spacer"></tr>


                            </tbody>
                            </table>
                            
                        </form>

                        {this.state.saved ?
                            <p className="message">Sucessfully added new category!</p>
                        : null}
                        
                    </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        // xxx: state.xxx.xxxx
    }
}


export default withRouter(connect(mapStateToProps)(AdminAddCat));