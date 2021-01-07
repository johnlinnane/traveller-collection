import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-tabs/style/react-tabs.css';
import Select from 'react-select';

import { getAllCats, getAllSubCats  } from '../../../actions';
import { deleteSubcat, updateSubcat  }  from '../../../actions';


const config = require('../../../config_client').get(process.env.NODE_ENV);


class AdminSubCat extends Component {


    state = {
        formdata: {
            
            subCat: {
                _id: this.props.chosenSubCatInfo._id,
                title: this.props.chosenSubCatInfo.title,
                description: this.props.chosenSubCatInfo.description,
                parent_cat: this.props.chosenSubCatInfo.parent_cat

            },
            // theseSubcats: [],
            


            // newSubcat: {
            //     title: null,
            //     description: null,
            //     parent_cat: this.props.chosenSubCatInfo._id
        
            // }
            
        },
        allCats: [],
        allSubcats: [],
        selectedCatConverted: {
            value: '',
            label: ''
        },
        allCatsConverted: [],

        imgSrc: `/media/cover_img_cat/${this.props.chosenSubCatInfo._id}.jpg`,
        // imgSrcSubs: [],
        saved: false,
        catDeleted: false,

        selectedSubFiles: [],
        selectedCatsLoaded: false

        // subRemoved: false

    }

    componentDidMount() {
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
    }

    componentDidUpdate(prevProps) {
    
        if (this.props !== prevProps) {

            if (this.props.chosenSubCatInfo) {
                this.setState({
                    imgSrc: `/media/cover_img_subcat/${this.props.chosenSubCatInfo._id}.jpg`
                })
            }


            if (this.props.cats && this.props.cats.length) {
                let tempAllCatsConverted = [];
                let tempSelectedCatConverted;
                this.props.cats.forEach( cat => {
                    tempAllCatsConverted.push({
                        value: cat._id,
                        label: cat.title
                    })

                    if (cat._id === this.props.chosenSubCatInfo.parent_cat) {
                        tempSelectedCatConverted = {
                            value: cat._id,
                            label: cat.title
                        }
                    }
                })



                this.setState({
                    allCats: this.props.cats,
                    allCatsConverted: tempAllCatsConverted,
                    selectedCatConverted: tempSelectedCatConverted,
                    selectedCatsLoaded: true
                })
            }



        }
    
    }

    // not used
    handleTabIndex = () => {
        this.props.getTabIndex(this.props.index)
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


    onClickHandler = () => {
        const data = new FormData();
        
        if (this.state.selectedFile) {
            for(let x = 0; x<this.state.selectedFile.length; x++) {
                data.append('file', this.state.selectedFile[x])
            }

            axios.post(`http://${config.IP_ADDRESS}:3001/upload-subcat/${this.props.chosenSubCatInfo._id}`, data, { 
            // axios.post(`http://${config.IP_ADDRESS}:8000/upload-cat/${this.props.chosenSubCatInfo._id}`, data, { 
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
                alert('File uploaded successfully')
            })
            .catch(err => { 
                toast.error('upload fail')
            })
        }







        this.setState({
            imgSrc : this.state.imgSrc + '?' + Math.random()
        });

        // not used
        this.handleTabIndex();

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



    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }



    handleSubCatInput(event, field) {

        let tempSubcat = this.state.formdata.subCat;

        switch (field) {
                    case 'title':
                        tempSubcat.title = event.target.value;
                        break;
                    case 'description':
                        tempSubcat.description = event.target.value;
                        break;
                    default:
                }
        this.setState({
            formdata: {
                ...this.state.formdata,
                subCat: tempSubcat
            }
        })


    }


    handleCatChange = (newValue) => {
        console.log(newValue)




        this.setState({
            formdata: {
                ...this.state.formdata,
                subCat: {
                    ...this.state.formdata.subCat,
                    parent_cat: newValue.value
                }
            }
        })
    }

    deleteImage = () => {

        let data = {
            path: `/cover_img_subcat/${this.state.formdata.subCat._id}.jpg`
        };
        
        axios.post(`http://${config.IP_ADDRESS}:3001/delete-file`, data  )

        this.setState({
            imgSrc: '/media/default/default.jpg'
        })
    }



    removeSubCat = (id) => {

        console.log(id)
        this.props.dispatch(deleteSubcat(id))
        this.props.history.push(`/admin/0`)
    }


    submitForm = (e) => {
        e.preventDefault();


        this.props.dispatch(updateSubcat(
            this.state.formdata.subCat
        ))

        this.onClickHandler();


        setTimeout(() => {
            this.props.history.push(`/admin/${this.props.index}`);
        }, 2000)
        
    }

    cancel = () => {
        this.props.history.push(`/admin/0`)
    }



    render() {

        console.log(this.state)

        return (
            <div className="admin">
                { this.props.chosenSubCatInfo ? 
                    <div>
                        <form onSubmit={this.submitForm}>
                            <table className="form_input">
                            <tbody>
                                


                                <tr>
                                    <td>
                                        <h3>Title</h3>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder='Title'
                                            defaultValue={this.props.chosenSubCatInfo.title} 
                                            onChange={(event) => this.handleSubCatInput(event, 'title')}
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
                                            placeholder="Description"
                                            defaultValue={this.props.chosenSubCatInfo.description} 
                                            onChange={(event) => this.handleSubCatInput(event, 'description')}
                                        />
                                    </td>
                                </tr>


                                <tr>
                                    <td>
                                        <h3>Sub-Category Image</h3>
                                    </td>
                                    <td>
                                        <img 
                                            className="change_cat_img" 
                                            src={this.state.imgSrc} 
                                            onError={this.addDefaultImg}
                                            alt='sub category cover'
                                        />
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
                                        <h3>Parent Category</h3>
                                    </td>
                                    {this.state.selectedCatsLoaded ?
                                            <td>
                                                <Select
                                                    // key={`cat_${this.props.items.item._id}`}
                                                    defaultValue={this.state.selectedCatConverted}
                                                    // isMulti
                                                    // name="colors"
                                                    options={this.state.allCatsConverted}
                                                    // className="basic-multi-select"
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    onChange={this.handleCatChange}
                                                />



                                            </td>
                                    : null}
                                </tr>

                         

                                

                                <tr>
                                    <td colSpan="2">
                                        <button type="button" 
                                            className="delete" 
                                            onClick={(e) => { if (window.confirm('Are you sure you wish to delete this sub-category?')) this.removeSubCat(this.props.chosenSubCatInfo._id) } }
                                        >
                                            Delete Sub-Category
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

export default withRouter(connect(mapStateToProps)(AdminSubCat));
