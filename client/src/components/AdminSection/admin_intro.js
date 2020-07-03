import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { withRouter } from "react-router-dom";


import { getIntroText, updateIntroText } from '../../actions';


class AdminIntro extends Component {

    



    state = {
        introData: {
            title: '',
            body: ''
        }
    }


    componentDidMount() {
        this.props.dispatch(getIntroText());
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props != prevProps) {
            
            
            let introData = {
                title: this.props.text.title,
                body: this.props.text.body
            }
            


            this.setState({
                introData
            })
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
            // axios.post(`http://localhost:8000/upload-intro-img`, data, { 
            axios.post(`http://64.227.34.134:8000/upload-intro-img`, data, { 
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


    addDefaultImg = (ev) => {
        const newImg = '/images/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }



    handleInput = (event, field) => {

        const newIntroData = {
            ...this.state.introData
        }


        if (field === 'title') {
            newIntroData.title = event.target.value;
        }

        if (field === 'body') {
            newIntroData.body = event.target.value;
        }

        this.setState({
            introData: newIntroData
        })
        // console.log(newFormdata);
    }



    submitForm = (e) => {
        e.preventDefault();



        this.props.dispatch(updateIntroText(
            this.state.introData
        ))

        // console.log({...this.state.formdata.cat});
        // console.log(this.state.formdata.cat);

        // this.props.dispatch(updateCat(
        //         this.state.formdata.cat
            
        // ))

        // this.state.formdata.subcats.map( (subcat) =>{
        //     if (subcat.isModified) {
        //         // console.log(subcat)
        //         this.props.dispatch(updateSubcat(
        //             subcat
        //         ))
        //     }
        // })

        
        // if (this.state.formdata.newSubcat.title) {
        //     const newSubcat = this.state.formdata.newSubcat;
        //     console.log(newSubcat);
        //     this.props.dispatch(addSubcat(
        //         newSubcat
        //     ))
        // }


        
        // this.props.history.push(`/admin`)
    }


    cancel = () => {
        this.props.history.push(`/admin`)
    }

    render() {

        console.log(this.state)

        return (
            <div className="admin">
                <div className="admin_intro">

                    <h1>Edit Intro Page</h1>


                    <form onSubmit={this.submitForm}>
                        <table>
                            <tbody>
                    
                                

                                <tr>
                                    <td>
                                        <p>
                                            <b>Heading</b> 
                                        </p>
                                    </td>
                                </tr>


                                <tr>
                                    <td>
                                        <textarea
                                            type="text"
                                            placeholder="Text"
                                            defaultValue={this.state.introData.title} 
                                            onChange={(event) => this.handleInput(event, 'title')}
                                            rows={6}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <p>
                                            <b>Body Text</b> 
                                        </p>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <textarea
                                            type="text"
                                            placeholder="Text"
                                            defaultValue={this.state.introData.body} 
                                            onChange={(event) => this.handleInput(event, 'body')}
                                            rows={6}
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <p>Change Image</p>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <img src={`/images/intro/intro.jpg`} onError={this.addDefaultImg}/>
                                    </td>
                                </tr>



                                <tr>
                                    
                                    <td>
                                        <div className="form_element">
                                            <input type="file" className="form-control" multiple name="file" onChange={this.onChangeHandler}/>
                                            <br />
                                            <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button> 
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td colSpan="2">
                                        <button type="submit">Save Changes</button>
                                  
                                        <button type="button" onClick={this.cancel}>Cancel</button>
                                    </td>
                                    
                                </tr>  



                            </tbody>
                        </table>
                    </form>


                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    // console.log(state);

    return {
        text: state.intros.text
        
    }
}


export default withRouter(connect(mapStateToProps)(AdminIntro));