import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';



const config = require('../../config_client').get(process.env.NODE_ENV);


class EditItemFile extends PureComponent {

    state = {
        selectedFiles: []
    }



    // *************** UPLOAD LOGIC ********************

    onChangeHandler = (event) => {
        var file = event.target.files;
        let tempSelectedFiles = this.state.selectedFiles;
        tempSelectedFiles.push(file)

        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkMimeType(event)) {  
            this.setState({
                selectedFiles: tempSelectedFiles
            })
        }
    }



    onClickHandler = () => {
        const data = new FormData() 

        if (this.state.selectedFiles.length) {
            for (let i = 0; i < this.state.selectedFiles.length; i++) {
                data.append(`file_${i}`, this.state.selectedFiles[i][0]);
            }

            axios.post(`http://${config.IP_ADDRESS}:3001/upload-fields/ZZZZZ/${this.state.selectedFiles.length}`, data, {     

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
                // toast.error('upload fail')
            })
        }

       


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
            // toast.error(err[z])
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
            // toast.error(err[z])
            event.target.value = null
        }
        return true;
   
    }    

    // ****************************************************


    render() {

        // console.log('STATE: ', this.state)

        return (
            
            <div className="main_view">
                <div className="rl_container article edit_page">
                    <input 
                        type="file" 
                        className="form-control"  
                        accept="image/*" 
                        onChange={(event) => {this.onChangeHandler(event)}}
                    />

                    <input 
                        type="file" 
                        className="form-control"  
                        accept="image/*" 
                        onChange={(event) => {this.onChangeHandler(event)}}
                    />

                    <div className="form_element">
                        <div className="center">
                            <button type="button" className="btn btn-success btn-block edit_page_3_finish" onClick={this.onClickHandler}>Upload File(s) and Finish</button> 
                        </div>
                    </div>
                  

                </div>
            </div>
        );
    }
}


export default EditItemFile;


