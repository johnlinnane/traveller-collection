import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { getAllColls, getAllCats, getAllSubCats  } from '../../actions';
import { addCat, deleteCat, addSubcat, deleteSubcat, updateCat, updateSubcat  }  from '../../actions';

class AdminCat extends Component {


    state = {
        formdata: {
            cat: {
                _id: this.props.chosenCatInfo._id || null,
                title: this.props.chosenCatInfo.title || null,
                description: this.props.chosenCatInfo.description || null

            },
            subcats: [],
            // presentNewSubcat: {
            //     title: null,
            //     description: null,
            //     parent_cat: this.props.chosenCatInfo._id,
            //     isNew: true
            // },
            // newSubcats: []

            newSubcat: {
                title: null,
                description: null,
                parent_cat: this.props.chosenCatInfo._id
        
            }
            
        },
        imgSrc: `/media/cover_img_cat/${this.props.chosenCatInfo._id}.jpg`,
        saved: false,
        deleted: false,
        subRemoved: false
    }

    componentDidMount() {
        this.props.dispatch(getAllColls())
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
    }

    componentDidUpdate(prevProps) {
    

        if (this.props.subcats && this.props.subcats.length) {
            if (this.props.subcats != prevProps.subcats) {
                let tempSubcats = []

                if (this.props.subcats) {
                    this.props.subcats.map( (subcat, i) => {
                        if (subcat.parent_cat == this.props.chosenCatInfo._id) {
                            tempSubcats.push(subcat)
                        }
                    })
                }
                
                this.setState({
                    formdata: {
                        ...this.state.formdata,
                        subcats: tempSubcats
                    }
                })
            }
        }
    
    }

    getTabIndex = () => {
        this.props.setTabIndex(this.props.index)
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
            axios.post(`http://localhost:8000/upload-cat/${this.props.chosenCatInfo._id}`, data, { 
            // axios.post(`http://64.227.34.134:8000/upload-cat/${this.props.chosenCatInfo._id}`, data, { 
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

        this.setState({
            imgSrc : this.state.imgSrc + '?' + Math.random()
        });

        this.getTabIndex();

        
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




    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    handleInput = (event, type, field, subcatId) => {


        // make a copy of formdata
        const newFormdata = {
            ...this.state.formdata
        }


        // console.log(newFormdata);
        if (type === 'cat') {
            if (field === 'cat_title') {
                newFormdata.cat.title = event.target.value;

            } else if (field === 'cat_description') {
                newFormdata.cat.description = event.target.value;
            } 
        }

        if (type === 'subcat') {
            this.state.formdata.subcats.map( (subcat, i ) => {
                if (subcat._id === subcatId) {
                    if (field === 'title') {
                        newFormdata.subcats[i].title = event.target.value;
                    } else if (field === 'description') {
                        newFormdata.subcats[i].description = event.target.value;
                    }
                    newFormdata.subcats[i].isModified = true;
                }
            })
        }

        if (type === 'add_subcat') {
            
            if (field === 'subcat_title') {
                newFormdata.newSubcat.title = event.target.value;
            }  if (field === 'subcat_desc') {
                newFormdata.newSubcat.description = event.target.value;
            }


            

        }


        // copy it back to state
        this.setState({
            formdata: newFormdata

        })
        console.log(newFormdata);
    }


    // addSubcat = () => {
        
    //     if (this.state.formdata.presentNewSubcat.title) {
    //         this.setState({
    //             formdata: {
    //                 ...this.state.formdata,
    //                 subcats: [
    //                     ...this.state.formdata.subcats,
    //                     this.state.formdata.presentNewSubcat
    //                 ]
    //             }
    //         })


    //         this.setState({
                
    //                 presentNewSubcat: {
    //                     title: null,
    //                     description: null,
    //                     parent_cat: this.props.chosenCatInfo._id,
    //                     isNew: true
    //                 }
    //         })
    //     }

        
        // if (this.state.formdata.newSubcat.title) {
        //     const newSubcat = this.state.formdata.newSubcat;
        //     console.log(newSubcat);
        //     // this.props.dispatch(addSubcat(
        //     //     newSubcat
        //     // ))

        //     let refreshedFormdata = {
        //         ...this.state.formdata,
        //             subcats: [
        //                 ...this.state.formdata.subcats,
        //                 newSubcat
        //             ]
        //     }

        //     this.setState({
        //         formdata: refreshedFormdata,
        //         newSubcat: null
                
        //     })
        // }
    // }


    deleteSubcat = (e, id, isNew) => {
        this.props.dispatch(deleteSubcat(id));

        this.setState({
            subRemoved: true
        })

        setTimeout(() => {
            this.props.history.push(`/admin`);
        }, 2000)
    }

    deleteCat = (e, id) => {
        this.props.dispatch(deleteCat(id));

        this.setState({
            deleted: true
        })

        setTimeout(() => {
            // this.props.history.push(`/user/edit-item-sel/${this.props.items.newitem.itemId}`);
            this.props.history.push(`/admin`);
        }, 2000)
        

    }



    submitForm = (e) => {
        e.preventDefault();
        // console.log({...this.state.formdata.cat});
        console.log(this.state.formdata.cat);

        this.props.dispatch(updateCat(
                this.state.formdata.cat
            
        ))

        this.state.formdata.subcats.map( (subcat) =>{
            if (subcat.isModified) {
                // console.log(subcat)
                this.props.dispatch(updateSubcat(
                    subcat
                ))
            }
        })

        
        if (this.state.formdata.newSubcat.title) {
            const newSubcat = this.state.formdata.newSubcat;
            console.log(newSubcat);
            this.props.dispatch(addSubcat(
                newSubcat
            ))
        }

        this.setState({
            saved: true
        })

        setTimeout(() => {
            this.props.history.push(`/admin`);
        }, 2000)
        
    }

    cancel = () => {
        this.props.history.push(`/admin`)
    }



    render() {


        // console.log(this.props)
        return (
            <div className="admin">
                { this.props.chosenCatInfo ? 
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
                                            placeholder={this.props.chosenCatInfo.title}
                                            defaultValue={this.props.chosenCatInfo.title} 
                                            onChange={(event) => this.handleInput(event, 'cat', 'cat_title')}
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
                                            onChange={(event) => this.handleInput(event, 'cat', 'cat_description')}
                                            rows={6}
                                        />
                                    </td>
                                </tr>


                                <tr>
                                    <td>
                                        <img className="change_cat_img" src={this.state.imgSrc} onError={this.addDefaultImg}/>
                                    </td>
                                    <td>
                                        <div className="form_element">
                                            <input type="file" className="form-control" multiple name="file" onChange={this.onChangeHandler}/>
                                            <br />
                                            <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button> 
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <h3>Sub-categories</h3>
                                    </td>
                                </tr>


                                { this.state.formdata.subcats.length ?
                                    this.state.formdata.subcats.map( (subcat, i) => (
                                        subcat.parent_cat == this.props.chosenCatInfo._id ? 
                                            <tr key={i}>
                                                <td>
                                                    <input
                                                        type="text"
                                                        placeholder={subcat.title}
                                                        defaultValue={subcat.title} 
                                                        onChange={(event) => this.handleInput(event, 'subcat', 'title', subcat._id)}
                                                    />
                                                </td>

                                                <td>
                                                    <input
                                                        type="text"
                                                        placeholder="Description"
                                                        defaultValue={subcat.description} 
                                                        onChange={(event) => this.handleInput(event, 'subcat', 'description', subcat._id)}
                                                    />
                                                </td>

                                                <td>
                                                    {/* <button 
                                                        type="button" 
                                                        onClick={(e) => { if (window.confirm('Are you sure you want to remove this subcategory?')) this.deleteSubcat(e, subcat._id) } }
                                                        className="remove">Remove</button> */}

                                                    <div  className="tooltip" onClick={(e) => { if (window.confirm('Are you sure you want to remove this subcategory?')) this.deleteSubcat(e, subcat._id) } }>
                                                        <i className="fa fa-times-circle"></i>
                                                        <span className="tooltiptext">Remove</span>
                                                    </div>

                                                    
                                                    

                                                </td>
                                            </tr>
                                        : null 
                                    ) )    
                                : null }

                                <tr >
                                    <td>

                                        <input
                                            type="text"
                                            placeholder="Add new subcategory"
                                            defaultValue={null} 
                                            onChange={(event) => this.handleInput(event, 'add_subcat', 'subcat_title')}
                                        />
                                    </td>

                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Description"
                                            defaultValue={null} 
                                            onChange={(event) => this.handleInput(event, 'add_subcat', 'subcat_desc')}
                                        />
                                    </td>
                                </tr>
                                

                                {this.state.subRemoved ?
                                    <tr className="spacer">
                                        <td colSpan="2" className="message center">
                                            Subcategory removed!
                                        </td>
                                    </tr>
                                : <tr className="spacer"></tr>}

                                

                                <tr>
                                    <td colSpan="2">
                                        <button type="button" 
                                            className="delete" 
                                            onClick={(e) => { if (window.confirm('Are you sure you wish to delete this category?')) this.deleteCat(e, this.props.chosenCatInfo._id) } }
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

                        

                        {this.state.deleted ?
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
        colls:state.collections.colls,
        cats:state.cats.cats,
        subcats:state.cats.subcats
    }
}

export default withRouter(connect(mapStateToProps)(AdminCat));
