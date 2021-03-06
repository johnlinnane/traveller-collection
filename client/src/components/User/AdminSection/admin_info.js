import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { withRouter } from "react-router-dom";

import { getInfoText, updateInfoText } from '../../../actions';

const mongoose = require('mongoose');
const API_PREFIX = process.env.REACT_APP_API_PREFIX;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

class AdminInfo extends Component {

    state= {
        formdata: {
            sections: [],
            iconsCaption: ''
        },
        selectedFiles: [],
        imgUrls: [],
        iconImgSrc: `${FS_PREFIX}/assets/media/info/icons.jpg`,
        selectedIconImg: ''
        
    }

    componentDidMount() {
        this.props.dispatch(getInfoText());
    }


    componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps) {

            const infotext = this.props.infotext;

            if (infotext.sections && infotext.sections.length) {

                let tempSections = [];
                let tempIconsCaption = infotext.iconsCaption || this.state.formdata.tempIconsCaption;
                let tempImgUrls = [];
                let tempKey = '';

                infotext.sections.forEach( (section, i) => {
                    tempSections[i] = {
                        heading: section.heading,
                        paragraph: section.paragraph,
                        item_id: section.item_id,
                    }

                    tempKey = tempKey + section.heading;

                    tempImgUrls[i] = `${FS_PREFIX}/assets/media/info/${i}.jpg`;
                } )



                this.setState({
                    formdata: {
                        ...this.state.formdata,
                        sections: tempSections,
                        iconsCaption: tempIconsCaption
                    },
                    imgUrls: tempImgUrls,
                    key: tempKey
                })
            }
        }
    }






    // *************** UPLOAD LOGIC ********************

    onChangeHandler = (event, i, name) => {


        let files = event.target.files;

        if (i) {
            if (this.maxSelectFile(event) && this.checkMimeType(event)) {  
                let tempSelectedFiles = this.state.selectedFiles;
                tempSelectedFiles[i] = files[0];

                this.setState({
                    selectedFiles: tempSelectedFiles
                })
            }

            let tempImgSrc = this.state.imgUrls;
            tempImgSrc[i] = URL.createObjectURL(event.target.files[0]);

            this.setState({
                imgSrc: tempImgSrc
            })
        }
        if (name) {
            if (this.maxSelectFile(event) && this.checkMimeType(event)) {  
                let tempSelectedIconImg = this.state.selectedIconImg;
                tempSelectedIconImg = files[0];

                this.setState({
                    selectedIconImg: tempSelectedIconImg
                })
            }

            let tempIconImgSrc = this.state.iconImgSrc;
            tempIconImgSrc = URL.createObjectURL(event.target.files[0]);

            this.setState({
                iconImgSrc: tempIconImgSrc
            })
        }
    }



    onSubmitHandler = (i) => {
        const data = new FormData() 
        
        if (this.state.selectedFiles && this.state.selectedFiles.length) {

            data.append('file', this.state.selectedFiles[i])

            axios.post(`${API_PREFIX}/upload-info/${i}`, data, {
                
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
                    })
                }
            })
            .then(res => { // then print response status
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


    uploadIconsImg = (name) => {
        const data = new FormData() 
        
        if (this.state.selectedIconImg) {

            data.append('file', this.state.selectedIconImg)

            axios.post(`${API_PREFIX}/upload-info/${name}`, data, {
                
                // receive two parameter endpoint url ,form data 
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
                    })
                }
            })
            .then(res => { // then print response status
                console.log(res);
                toast.success('upload success')
                alert('Files uploaded successfully')
            })
            .catch(err => { 
                toast.error('upload fail')
            })
        }
    }



    maxSelectFile=(event)=>{


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
        let files = event.target.files 
        let err = ''
        const types = ['image/png', 'image/jpeg', 'image/gif']
        for(let x = 0; x < files.length; x++) {
            if (types.every(type => files[x].type !== type)) {
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
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    cancel = () => {
        this.props.history.push(`/admin/0`)
    }



    handleInput = (event, i, field) => {

        let newFormdata = {
            ...this.state.formdata
        }


        if (field === 'heading') {
            newFormdata.sections[i].heading = event.target.value
        }

        if (field === 'paragraph') {
            newFormdata.sections[i].paragraph = event.target.value
        }

        if (field === 'icons') {
            newFormdata.iconsCaption = event.target.value
        }


        this.setState({
            formdata: {
                ...this.state.formdata,
                ...newFormdata
            }
        })
    }

    addSection = () => {
        this.setState({
            formdata: {
                ...this.state.formdata,
                sections: [
                    ...this.state.formdata.sections,
                    {
                        heading: '',
                        paragraph: '',
                        item_id: mongoose.Types.ObjectId().toHexString()
                    }
                ]
            }
        })
    }

    removeSection = (index) => {

        console.log('remove section: ' + this.state.formdata.sections[index].heading)

        let tempSections = this.state.formdata.sections;
        tempSections.splice(index, 1);

        this.setState({
            formdata: {
                ...this.state.formdata,
                sections: tempSections
            }
        })

    }


    submitForm = (e) => {
        e.preventDefault();



        this.props.dispatch(updateInfoText(
            this.state.formdata
        ))

        if (this.state.selectedFiles && this.state.selectedFiles.length) {
            this.state.selectedFiles.forEach( (file, i) => {
                this.onSubmitHandler(i)
            })
        }

        if (this.state.selectedIconImg) {
            this.uploadIconsImg('icons')
        }
        
   
        this.setState({
            saved: true
        })

        setTimeout(() => {
            this.props.history.push(`/admin/0`);
        }, 2000)
        
    }



    renderRows = () => (
        

        this.state.formdata.sections.map( (section, i) => (



            <React.Fragment key={section.item_id}>

                <tr>
                    <td>
                        Paragraph {i+1} Heading
                    </td>

                    <td>
                        <input
                            key={`heading${i}`}
                            type="text"
                            placeholder={`Paragraph ${i+1} Heading`}
                            defaultValue={section.heading} 
                            onChange={(event) => this.handleInput(event, i, 'heading')}
                        />
                    </td>
                </tr>

                
                <tr>
                    <td>
                        Paragraph {i + 1} Body
                    </td>
                    <td>
                        <textarea
                            key={`para${i}`}
                            type="text"
                            placeholder={`Paragraph ${i+1} Content`}
                            defaultValue={section.paragraph} 
                            onChange={(event) => this.handleInput(event, i, 'paragraph')}
                            rows={6}
                        />
                    </td>
                </tr>

                <tr>
                    <td>Paragraph {i + 1} Image</td>
                    <td>
                        
                        <img src={this.state.imgUrls[i]} onError={this.addDefaultImg} alt='paragraph'/>
                        <div className="form_element">
                            <input type="file" className="form-control" name="file" accept="image/*" onChange={(event) => this.onChangeHandler(event, i)}/>
                            {/* <button type="button" className="btn btn-success btn-block" onClick={ () => {this.onSubmitHandler(i)} }>Upload</button>  */}
                        </div>
                    </td>
                </tr>

                <tr>
                    <td></td>
                    <td>
                        <button 
                            type="button" 
                            className="btn btn-success btn-block delete" 
                            onClick={() => { this.removeSection(i) }}
                        >
                            Remove Section
                        </button> 
                    </td>
                    
                </tr>

                <tr>
                    <td colSpan="2"><hr/></td>
                </tr>

            </React.Fragment>
        ))
    )


    renderIcons = () => (
        <React.Fragment>
            <tr>
                <td>
                    Icons caption
                </td>
                <td>
                    <input
                        type="text"
                        placeholder="Caption for icons"
                        defaultValue={this.state.formdata.iconsCaption} 
                        onChange={(event) => this.handleInput(event, null, 'icons')}
                    />
                </td>
            </tr>


            <tr>
                <td>Icons Image</td>
                <td>
                    <img src={this.state.iconImgSrc} onError={this.addDefaultImg} alt='icons'/>
                    <div className="form_element">
                        <input type="file" className="form-control" name="file" accept="image/*" onChange={(event) => this.onChangeHandler(event, null, 'icons')}/>
                    </div>
                </td>
            </tr>

            <tr>
                <td colSpan="2"><hr/></td>
            </tr>
        </React.Fragment>
    )


    render() {
        console.log(this.state)

        return (
            <div className="admin form_input">
                <div className="admin_info">

                    <h1>Edit Info Page</h1>

                    <form onSubmit={this.submitForm}>
                        <table className="admin_info_table_section" >
                            <tbody>


                                {this.state.formdata.sections ?
                                    this.renderRows()
                                : null }

                                
                                <tr><td></td><td></td></tr>

                                <tr>
                                    <td>
                                        Add Section
                                    </td>
                                    <td>
                                        <button 
                                            type="button" 
                                            onClick={(e) => { this.addSection() }}
                                        >
                                            Click here to add another section
                                        </button> 
                                    </td>
                                </tr>
                                
                                <tr><td></td><td></td></tr>

                                <tr>
                                    <td colSpan="2"><hr/></td>
                                </tr>

                                {this.renderIcons()}

                                

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

                    {this.state.saved ?
                        <p className="message center">Information page updated!</p>
                    : null}

                    
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



