import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


import { addCat } from '../../actions';

var mongoose = require('mongoose');
const config = require('../../config_client').get(process.env.NODE_ENV);


class AdminAddCat extends Component {

    state = {
        catdata: {
            _id: mongoose.Types.ObjectId().toHexString(),
            title: '',
            description: ''
        },
        saved: false,
        imgSrc: '/media/default/default.jpg'
    }



    



    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
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
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    // *************** UPLOAD LOGIC ********************

    onImgChange = (event) => {
        var files = event.target.files;

        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkMimeType(event)) {  
            this.setState({
                selectedFile: files
            })
        }

        this.setState({
            imgSrc: URL.createObjectURL(event.target.files[0])
        })
    }


    onClickHandler = () => {
        const data = new FormData();
        
        if (this.state.selectedFile) {
            for(var x = 0; x<this.state.selectedFile.length; x++) {
                data.append('file', this.state.selectedFile[x])
            }
            axios.post(`http://${config.IP_ADDRESS}:3001/upload-cat/${this.state.catdata._id}`, data, { 
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

        // this.setState({
        //     imgSrc : this.state.imgSrc + '?' + Math.random()
        // });

        this.props.history.push(`/admin/${this.props.index}`);
        
    }

    maxSelectFile=(event)=>{

        // console.log(event);

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
        //getting file object
        let files = event.target.files 
        //define message container
        let err = ''
        // list allow mime type
        const types = ['image/png', 'image/jpeg', 'image/gif']
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



    submitForm = (e) => {
        e.preventDefault();
        // console.log(this.state.formdata);

        // dispatch an action, adding updated  formdata + the user id from the redux store
        this.props.dispatch(addCat({
                ...this.state.catdata,
        }));

        this.onClickHandler();

        this.setState({
            saved: true
        })

        setTimeout(() => {
            // this.props.history.push(`/user/edit-item-sel/${this.props.items.newitem.itemId}`);
            this.props.history.push(`/admin/0`);
        }, 2000)
    }


    render() {
        // console.log(this.state)

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


                                {/* <tr>
                                    <td>
                                        <img className="change_cat_img" src={`/media/cover_img_cat/XXXX.jpg`} onError={this.addDefaultImg}/>
                                    </td>
                                    <td>
                                        <div className="form_element">
                                            <input type="file" className="form-control" multiple name="file" onChange={this.onChangeHandler}/>
                                            <br />
                                            <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button> 
                                        </div>
                                    </td>
                                </tr>

                             */}

<tr>
                                    <td>
                                        <img 
                                            className="change_cat_img" 
                                            src={this.state.imgSrc} 
                                            onError={this.addDefaultImg}
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
    // console.log(state);

    return {
        // xxx: state.xxx.xxxx
        
    }
}


export default withRouter(connect(mapStateToProps)(AdminAddCat));