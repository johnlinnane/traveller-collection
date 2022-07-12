import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-tabs/style/react-tabs.css';

import { getAllCats  } from '../../../actions';
import { deleteCat, updateCat }  from '../../../actions';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

class AdminCat extends Component {


    state = {
        formdata: {
            cat: {
                _id: null,
                title: null,
                description: null,
                catIsHidden: false
            }
            
        },
        imgSrc: `${FS_PREFIX}/assets/media/cover_img_cat/${this.props.chosenCatInfo._id}.jpg`,
        saved: false,
        catDeleted: false,

    }

    componentDidMount() {
        this.props.dispatch(getAllCats());
    }

    componentDidUpdate(prevProps) {
    
        if (this.props !== prevProps) {

            if(this.props.chosenCatInfo ) {
                let tempFormdata = {
                    cat: {
                        ...this.state.formdata.cat,
                        _id: this.props.chosenCatInfo._id,
                        title: this.props.chosenCatInfo.title,
                        description: this.props.chosenCatInfo.description,
                        catIsHidden: this.props.chosenCatInfo.catIsHidden || false
        
                    }
                }

                this.setState({
                    formdata: tempFormdata
                })

            }

        }
    }



    deleteImage = () => {

        let data = {
            path: `/cover_img_cat/${this.state.formdata.cat._id}.jpg`
        };
        
        axios.post(`${API_PREFIX}/delete-file`, data  )

        this.setState({
            imgSrc: '/assets/media/default/default.jpg'
        })
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

            axios.post(`${API_PREFIX}/upload-cat/${this.props.chosenCatInfo._id}`, data, { 
                // receive two parameter endpoint url ,form data 
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
                    })
                }
            })
            .then(res => { // then print response status
                toast.success('upload success')
                alert('File uploaded successfully')
            })
            .catch(err => { 
                toast.error('upload fail')
            })
        }

        





        this.setState({
            imgSrc : this.state.imgSrc + '?' + Math.random()
        });


        this.props.history.push(`/admin/${this.props.index}`);




        
    }

    maxSelectFile=(event)=>{
        let files = event.target.files; // create file object
        if (files.length > 1) { 
            // const msg = 'Only 1 image can be uploaded at a time'
            event.target.value = null;
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
        for(let x = 0; x<files.length; x++) {
         // compare file type find doesn't matach
            if (types.every(type => files[x].type !== type)) {
                // create error message and assign to container   
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


    handleCatInput = (event, field) => {

        let newFormdata = {
            ...this.state.formdata
        }

        if (field === 'cat_title') {
            newFormdata.cat.title = event.target.value;

        } else if (field === 'cat_description') {
            newFormdata.cat.description = event.target.value;
        } 

        this.setState({
            formdata: newFormdata
        })
    }


    handleHidden() {
        this.setState({
            formdata: {
                ...this.state.formdata,
                cat: {
                    ...this.state.formdata.cat,
                    catIsHidden: !this.state.formdata.cat.catIsHidden

                }
                
            }
            
        })
    }

    addDefaultImg = (ev) => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }




    removeCat = (e, id) => {
        this.props.dispatch(deleteCat(id));

        this.setState({
            catDeleted: true
        })

        setTimeout(() => {
            // this.props.history.push(`/user/edit-item-sel/${this.props.items.newitem.itemId}`);
            this.props.history.push(`/admin/0`);
        }, 1000)
    }




    submitForm = (e) => {
        e.preventDefault();

        this.props.dispatch(updateCat(
                this.state.formdata.cat
            
        ))


        this.onSubmitHandler();

        this.setState({
            saved: true
        })

        setTimeout(() => {
            this.props.history.push(`/admin/${this.props.index}`);
        }, 2000)
        
    }

    cancel = () => {
        this.props.history.push(`/admin/0`)
    }



    render() {

        return (
            <div className="admin">
                { this.props.chosenCatInfo ? 
                    <div className="admin_cat_component">
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
                                            placeholder={this.props.chosenCatInfo.title}
                                            defaultValue={this.props.chosenCatInfo.title} 
                                            onChange={(event) => this.handleCatInput(event, 'cat_title')}
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
                                            defaultValue={this.props.chosenCatInfo.description} 
                                            onChange={(event) => this.handleCatInput(event, 'cat_description')}
                                            rows={6}
                                        />
                                    </td>
                                </tr>


                                <tr>
                                    <td>
                                        <h3>Category Image</h3>
                                    </td>
                                    <td>
                                        <img className="change_cat_img" src={this.state.imgSrc} onError={this.addDefaultImg} alt='category cover'/>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <div className="form_element">
                                            <input type="file" className="admin_cat_img_input form-control" multiple name="file" accept="image/*" onChange={this.onImgChange}/>
                                            <br />
                                        </div>
                                    </td>
                                </tr>
                                
                                <tr>
                                    <td></td>
                                    <td>
                                        <button 
                                            type="button" 
                                            className="btn btn-success btn-block delete" 
                                            onClick={(e) => { if (window.confirm('Are you sure you wish to delete this image?')) this.deleteImage() }}
                                        >
                                            Delete Image
                                        </button> 
                                    </td>
                                </tr>
                               

                                <tr>

                                    <td>
                                        <h3>Visibility</h3>
                                    </td>
                                    <td>
                                        <div className="admin_cat_visibility">
                                            <input 
                                                type="checkbox" 
                                                checked={this.state.formdata.cat.catIsHidden} 
                                                onChange={(event) => this.handleHidden(event)}
                                            />
                                            <span>Hide this category.</span>
                                        </div>
                                        
                                    </td>
                                </tr>


                                <tr>
                                    <td colSpan="2">
                                        <button type="button" 
                                            className="delete" 
                                            onClick={(e) => { if (window.confirm('Are you sure you wish to delete this category?')) this.removeCat(e, this.props.chosenCatInfo._id) } }
                                        >
                                            Delete Category
                                        </button>

                                    </td>
                                </tr>

                                <tr className="spacer"></tr>

                                <tr>
                                    <td>
                                        <button type="submit">Save Changes</button>
                                    </td>

                                    <td>
                                        <button type="button" onClick={this.cancel}>Cancel</button>
                                    </td>
                                    
                                </tr>

                                <tr className="spacer"></tr>


                            </tbody>
                            </table>
                            
                        </form>

                        

                        {this.state.catDeleted ?
                            <p className="message">Category deleted!</p>
                        : null}

                        {this.state.saved ?
                            <p className="message">All changes saved!</p>
                        : null}
                        
                    </div>
                : null }
            </div>
    
                

        )
    }
}

function mapStateToProps(state) {
    return {
        cats:state.cats.cats,
        subcats:state.cats.subcats
    }
}

export default withRouter(connect(mapStateToProps)(AdminCat));