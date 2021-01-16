import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

class Sandbox extends Component {





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


                axios.post(`http://localhost:4500/upload-sharp`, data, { 
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
        // this.redirectUser(`/items/${this.props.items.item._id}`)


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


    render() {
        return (
            <div>
                <form onSubmit={this.submitForm}>
                    <table>
                    <tbody>


                        <tr>

                            <td>
                                <input type="file" className="form-control" multiple name="file" onChange={this.onChangeHandler}/>
                            </td>

                            <td>
                                <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button> 
                            </td>

                        </tr>


                    </tbody>
                    </table>
                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        // colls:state.collections.colls,
        // cats:state.cats.cats,
        // subcats:state.cats.subcats
    }
}

export default withRouter(connect(mapStateToProps)(Sandbox));
