import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { withRouter } from "react-router-dom";



import { getInfoText, updateInfoText } from '../../actions';



class AdminInfo extends Component {


    state= {
        formdata: {
            heading_1: '',
            heading_2: '',
            heading_3: '',
            heading_4: '',
            paragraph_1: '',
            paragraph_2: '',
            paragraph_3: '',
            paragraph_4: ''
        }
    }

    componentDidMount() {
        this.props.dispatch(getInfoText());

    }


    componentDidUpdate(prevProps, prevState) {
        if (this.props != prevProps) {

            const infotext = this.props.infotext;

            let formdata = {
                heading_1: infotext.heading_1,
                heading_2: infotext.heading_2,
                heading_3: infotext.heading_3,
                heading_4: infotext.heading_4,
                paragraph_1: infotext.paragraph_1,
                paragraph_2: infotext.paragraph_2,
                paragraph_3: infotext.paragraph_3,
                paragraph_4: infotext.paragraph_4
            }

            this.setState({
                formdata
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



    onClickHandler = (number) => {
        const data = new FormData() 
        
        if (this.state.selectedFile) {
            for(var x = 0; x<this.state.selectedFile.length; x++) {
                data.append('file', this.state.selectedFile[x])
            }

            // HOST-SELECT
            // axios.post(`http://localhost:8000/upload-info/${number}`, data, {
            axios.post(`http://64.227.34.134:8000/upload-info/${number}`, data, { 
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

    cancel = () => {
        this.props.history.push(`/admin`)
    }


    render() {

        console.log(this.props)



        return (



            <div className="admin">
                <div className="admin_info">

                    <h1>Edit Info Page</h1>


                    <form onSubmit={this.submitForm}>
                        <table>
                            <tbody>






                            {/* PARAGRAPH ONE */}
                            
                            <tr>
                                <td>
                                    Paragraph 1 Heading
                                </td>

                                <td>
                                    <input
                                        type="text"
                                        placeholder="Paragraph 1 Heading"
                                        defaultValue={this.state.formdata.heading_1} 
                                        onChange={(event) => this.handleInput(event)}
                                    />
                                </td>
                            </tr>

                            
                            <tr>
                                <td>
                                    Paragraph 1 Body
                                </td>
                                <td>
                                    <textarea
                                        type="text"
                                        placeholder="Paragraph 1 Content"
                                        defaultValue={this.state.formdata.paragraph_1} 
                                        onChange={(event) => this.handleInput(event)}
                                        rows={6}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Paragraph 1 Image</td>
                                <td>
                                    
                                    <img src={`/images/info/1.jpg`} onError={this.addDefaultImg}/>
                                    <div className="form_element">
                                        <input type="file" className="form-control" name="file" onChange={this.onChangeHandler}/>
                                        <br />
                                        <button type="button" className="btn btn-success btn-block" onClick={ () => {this.onClickHandler(1)} }>Upload</button> 
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="2"><hr/></td>
                            </tr>


                            {/* PARAGRAPH TWO */}
                            
                            <tr>
                                <td>
                                    Paragraph 2 Heading
                                </td>

                                <td>
                                    <input
                                        type="text"
                                        placeholder="Paragraph 2 Heading"
                                        defaultValue={this.state.formdata.heading_2} 
                                        onChange={(event) => this.handleInput(event)}
                                    />
                                </td>
                            </tr>

                            
                            <tr>
                                <td>
                                    Paragraph 2 Body
                                </td>
                                <td>
                                    <textarea
                                        type="text"
                                        placeholder="Paragraph 2 Content"
                                        defaultValue={this.state.formdata.paragraph_2} 
                                        onChange={(event) => this.handleInput(event)}
                                        rows={6}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Paragraph 2 Image</td>
                                <td>
                                    <img src={`/images/info/2.jpg`} onError={this.addDefaultImg}/>
                                    <div className="form_element">
                                        <input type="file" className="form-control" name="file" onChange={this.onChangeHandler}/>
                                        <br />
                                        <button type="button" className="btn btn-success btn-block" onClick={ () => {this.onClickHandler(2)} }>Upload</button> 
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="2"><hr/></td>
                            </tr>

                            {/* PARAGRAPH THREE */}
                            
                            <tr>
                                <td>
                                    Paragraph 3 Heading
                                </td>

                                <td>
                                    <input
                                        type="text"
                                        placeholder="Paragraph 3 Heading"
                                        defaultValue={this.state.formdata.heading_3} 
                                        onChange={(event) => this.handleInput(event)}
                                    />
                                </td>
                            </tr>

                            
                            <tr>
                                <td>
                                    Paragraph 3 Body
                                </td>
                                <td>
                                    <textarea
                                        type="text"
                                        placeholder="Paragraph 3 Content"
                                        defaultValue={this.state.formdata.paragraph_3} 
                                        onChange={(event) => this.handleInput(event)}
                                        rows={6}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Paragraph 3 Image</td>
                                <td>
                                    <img src={`/images/info/3.jpg`} onError={this.addDefaultImg}/>
                                    <div className="form_element">
                                        <input type="file" className="form-control" name="file" onChange={this.onChangeHandler}/>
                                        <br />
                                        <button type="button" className="btn btn-success btn-block" onClick={ () => {this.onClickHandler(3)} }>Upload</button> 
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td colSpan="2"><hr/></td>
                            </tr>

                            {/* PARAGRAPH FOUR */}
                            
                            <tr>
                                <td>
                                    Paragraph 4 Heading
                                </td>

                                <td>
                                    <input
                                        type="text"
                                        placeholder="Paragraph 4 Heading"
                                        defaultValue={this.state.formdata.heading_4} 
                                        onChange={(event) => this.handleInput(event)}
                                    />
                                </td>
                            </tr>

                            
                            <tr>
                                <td>
                                    Paragraph 4 Body
                                </td>
                                <td>
                                    <textarea
                                        type="text"
                                        placeholder="Paragraph 4 Content"
                                        defaultValue={this.state.formdata.paragraph_4} 
                                        onChange={(event) => this.handleInput(event)}
                                        rows={6}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Paragraph 4 Image</td>
                                <td>
                                    <img src={`/images/info/4.jpg`} onError={this.addDefaultImg}/>
                                    <div className="form_element">
                                        <input type="file" className="form-control" name="file" onChange={this.onChangeHandler}/>
                                        <br />
                                        <button type="button" className="btn btn-success btn-block" onClick={ () => {this.onClickHandler(4)} }>Upload</button> 
                                    </div>
                                </td>
                            </tr>
                            

                            <tr>
                                <td colSpan="2"><hr/></td>
                            </tr>

                            <tr>
                                <td>
                                    <button type="submit">Save Changes</button>
                                </td>

                                <td>
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
        infotext: state.infos.text
        
    }
}


export default withRouter(connect(mapStateToProps)(AdminInfo));



