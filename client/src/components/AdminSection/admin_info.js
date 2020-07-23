import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { withRouter } from "react-router-dom";



import { getInfoText, updateInfoText } from '../../actions';



class AdminInfo extends Component {


    state= {
        
        formdata: {
            sections: [
                {
                    heading: '',
                    paragraph: ''
                },
                {
                    heading: '',
                    paragraph: ''
                },
                {
                    heading: '',
                    paragraph: ''
                },
                {
                    heading: '',
                    paragraph: ''
                }
            ]
            
        }
    }

    componentDidMount() {
        this.props.dispatch(getInfoText());

    }


    componentDidUpdate(prevProps, prevState) {
        if (this.props != prevProps) {

            const infotext = this.props.infotext;

            if (infotext.sections && infotext.sections.length) {
                let formdata = {
                    sections: [
                        {
                            heading: infotext.sections[0].heading,
                            paragraph: infotext.sections[0].paragraph
                        },
                        {
                            heading: infotext.sections[1].heading,
                            paragraph: infotext.sections[1].paragraph
                        },
                        {
                            heading: infotext.sections[2].heading,
                            paragraph: infotext.sections[2].paragraph
                        },
                        {
                            heading: infotext.sections[3].heading,
                            paragraph: infotext.sections[3].paragraph
                        }
                    ]
                    
                }
                this.setState({
                    formdata
                })
            }

            
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
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    cancel = () => {
        this.props.history.push(`/admin`)
    }



    handleInput = (event, i, field) => {

        const newFormdata = {
            ...this.state.formdata
        }


        if (field === 'heading') {
            newFormdata.sections[i].heading = event.target.value
        }

        if (field === 'paragraph') {
            newFormdata.sections[i].paragraph = event.target.value
        }

        this.setState({
            formdata: newFormdata
        })
    }



    submitForm = (e) => {
        e.preventDefault();



        this.props.dispatch(updateInfoText(
            this.state.formdata
        ))

   
        this.setState({
            saved: true
        })

        setTimeout(() => {
            this.props.history.push(`/admin`);
        }, 2000)
        
    }



    renderRows = () => (
        this.state.formdata.sections.map( (section, i) => (



        <section className="info_table_section" key={i}>
            <tr>
                <td>
                    Paragraph {i+1} Heading
                </td>

                <td>
                    <input
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
                    
                    <img src={`/media/info/${i+1}.jpg`} onError={this.addDefaultImg}/>
                    <div className="form_element">
                        <input type="file" className="form-control" name="file" onChange={this.onChangeHandler}/>
                        <br />
                        <button type="button" className="btn btn-success btn-block" onClick={ () => {this.onClickHandler(i+1)} }>Upload</button> 
                    </div>
                </td>
            </tr>

            <tr>
                <td colSpan="2"><hr/></td>
            </tr>

            </section>








        ))
    )


    render() {

        console.log(this.state)



        return (



            <div className="admin">
                <div className="admin_info">

                    <h1>Edit Info Page</h1>


                    <form onSubmit={this.submitForm}>
                        <table>
                            <tbody>



                            {this.renderRows()}


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



