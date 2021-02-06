import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import {Progress} from 'reactstrap';

import { getAllCats } from '../../../actions';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

class CatEdit extends Component { // was PureComponent

    state = {
        catInfo: null,
        selectedFile: null,
        loaded: 0
    
    }

    componentDidMount() {
        this.props.dispatch(getAllCats())
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps ) {

            this.props.cats.forEach( cat => {
                if (cat._id === this.props.match.params.id) {
                    this.setState({
                        catInfo: {...cat}
                    })
                }
            })
        }

    }    

    // *************** UPDLOAD LOGIC ********************

    onChangeHandler = (id, event) => {
        console.log(id);

        let files = event.target.files;

        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkMimeType(event)) {  
            this.setState({
                selectedFile: files
            })
        }
    }



    onSubmitHandler = () => {
        const data = new FormData() 
        
        if (this.state.selectedFile) {
            for(let x = 0; x<this.state.selectedFile.length; x++) {
                data.append('file', this.state.selectedFile[x])
            }

            axios.post(`${API_PREFIX}/upload-cat/${this.props.match.params.id}`, data, { 
                
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
                alert('File(s) uploaded successfully')
            })
            .catch(err => { 
                toast.error('upload fail')
            })
        }
        this.redirectUser(`/category/${this.props.match.params.id}`)


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
        const types = ['image/png', 'image/jpeg', 'image/gif', 'application/pdf']
        for(let i = 0; i < files.length; i++) {
            if (types.every(type => files[i].type !== type)) {
                err += files[i].type+' is not a supported format\n';
            }
        };

        for(let j = 0; j < err.length; j++) { 
            event.target.value = null 
            toast.error(err[j])
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


    redirectUser = (url) => {
        setTimeout(() => {
            this.props.history.push(url)
        }, 1000)
    }


    render() {


        return (
            
            <div className="main_view">
                <div className="form_input item_form_input edit_page">
                        
                    <h3>Change Category Image:</h3>

                    <div className="form_element sel_cat">
                        { this.state.catInfo ?
                            
                                <div>
                                    <h3>{this.state.catInfo.title}</h3>
                                    <img src={`${FS_PREFIX}/assets/media/cover_img_cat/${this.state.catInfo._id}.jpg`} alt='cat cover'/>
                                    <br/>
                                    <input type="file" className="form-control" name="file" accept="image/*" onChange={(e) => this.onChangeHandler(this.state.catInfo._id, e)} />
                                    
                                </div>
                        : null}
                        
                        <button type="button" className="btn btn-success btn-block" onClick={this.onSubmitHandler}>Finish</button> 
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
        cats:state.cats.cats

    }
}


export default connect(mapStateToProps)(CatEdit)


