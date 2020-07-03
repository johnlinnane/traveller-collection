import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';

// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
// import 'react-tabs/style/react-tabs.css';

// import { getAllColls, getAllCats, getAllSubCats  } from '../../actions';
// import { addCat, deleteCat, addSubcat, deleteSubcat, updateCat, updateSubcat  }  from '../../actions';

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


                axios.post(`http://localhost:4500/upload-test`, data, { 
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




    // addDefaultImg = (ev) => {
    //     const newImg = '/images/default/default.jpg';
    //     if (ev.target.src !== newImg) {
    //         ev.target.src = newImg
    //     }  
    // }



    // submitForm = (e) => {
    //     e.preventDefault();
    //     // console.log({...this.state.formdata.cat});
    //     console.log(this.state.formdata.cat);

    //     this.props.dispatch(updateCat(
    //             this.state.formdata.cat
            
    //     ))

    //     this.state.formdata.subcats.map( (subcat) =>{
    //         if (subcat.isModified) {
    //             // console.log(subcat)
    //             this.props.dispatch(updateSubcat(
    //                 subcat
    //             ))
    //         }
    //     })

        
    //     if (this.state.formdata.newSubcat.title) {
    //         const newSubcat = this.state.formdata.newSubcat;
    //         console.log(newSubcat);
    //         this.props.dispatch(addSubcat(
    //             newSubcat
    //         ))
    //     }


        
    //     // this.props.history.push(`/admin`)
    // }


    render() {


        // console.log(this.state)
        return (
            <div className="admin">
                        <form onSubmit={this.submitForm}>
                            <table>
                            <tbody>
                               


                                <tr>
                                    <td>
                                        {/* <img className="change_cat_img" src={`/images/cover_img_cat/${this.props.chosenCatInfo._id}.jpg`} onError={this.addDefaultImg}/> */}
                                    </td>
                                    <td>
                                        <div className="form_element">
                                            <input type="file" className="form-control" multiple name="file" onChange={this.onChangeHandler}/>
                                            <br />
                                            <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button> 
                                        </div>
                                    </td>
                                </tr>

                            </tbody>
                            </table>
                            <button type="button" 
                                className="delete" 
                                onClick={(e) => { if (window.confirm('Are you sure you wish to delete this category?')) this.deleteCat(e, this.props.chosenCatInfo._id) } }
                            >
                                Delete Category
                            </button>
                            <button type="button" onClick={this.cancel}>Cancel</button>
                            <button type="submit">Save Changes</button>
                        </form>
                        
                    </div>
    
                

        )
    }
}

function mapStateToProps(state) {
    return {
        colls:state.collections.colls,
        cats:state.cats.cats,
        subcats:state.cats.subcats
    }
}

export default withRouter(connect(mapStateToProps)(Sandbox));
