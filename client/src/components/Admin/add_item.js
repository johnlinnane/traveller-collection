import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import {Progress} from 'reactstrap';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { addItem, clearNewItem } from '../../actions';
// import {getAllColls, getAllCats, getAllSubCats, updateItem  } from '../../actions';
// import moment from 'moment-js';



class AddItem extends Component {

    state = {
        formdata:{
            title: '',
            creator: '',
            subject: '',
            description: '',
            source: '',
            date_created: '',
            
            contributor: '',
            item_format: '',
            materials: '',
            physical_dimensions: '',
            pages: '',        
            editor: '',
            publisher: '',
            further_info: '',
            language: '',
            reference: '',
            rights: '',
            file_format: '',
            external_link: [
                {
                    url: '',
                    text: ''
                }
            ],
            geo: {
                address: ''
            }

        },
        saved: false
    }


    // clear success message 
    componentWillUnmount() {
        this.props.dispatch(clearNewItem())
    }

    handleInput = (event, name, level) => {
        // console.log(event.target.value);

        const newFormdata = {
            ...this.state.formdata
        }

        if (level === 'external_link') {
            newFormdata[level][0][name] = event.target.value;

        } else if (level === 'geo') {
            newFormdata[level][name] = event.target.value;
        
        } else {
            newFormdata[name] = event.target.value;
        }

        // add date created!
        // {moment(item.createAt).format("MM/DD/YY")}
        // console.log(newFormdata)

        this.setState({
            formdata:newFormdata
        })
    }



    // showNewItem = (item) => (
    //     item.post ?
    //         <div className="conf_link">
    //             New Item Added
    //         </div>
    //     : null
    // )



    createTextInput = (existing, name, placeholder, inputLabel, level) => {
        return (
            <tr>
                <td>
                    {inputLabel}
                </td>
                <td>
                    <div className="form_element">
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={existing} 
                            onChange={(event) => this.handleInput(event, name, level)}
                        />
                    </div>
                </td>
            </tr>
        )
    }

    redirectUser = (url) => {
        setTimeout(() => {
            this.props.history.push(url)
        }, 1000)
    }


    submitForm = (e) => {
        e.preventDefault();
        // console.log(this.state.formdata);

        // dispatch an action, adding updated  formdata + the user id from the redux store
        this.props.dispatch(addItem({
                ...this.state.formdata,
                ownerId:this.props.user.login.id
        }));
        this.setState({
            saved: true
        })

        setTimeout(() => {
            this.props.history.push(`/user/edit-item-sel/${this.props.items.newitem.itemId}`);
        }, 2000)
    }


    render() {
        // console.log(this.props);

        return (
            <div className="main_view">
                <div className="rl_container article edit_page">
                    <form onSubmit={this.submitForm}>
                        
                        {/* <h2>Add a review</h2> */}
                        <h2>Add an item</h2>


                        <table>
                        <tbody>

                            {this.createTextInput(this.state.formdata.title,'title', "Enter title", "Title")}
                            {this.createTextInput(this.state.formdata.creator,'creator', "Enter creator", "Creator")}

                            <tr>
                                <td className="label">
                                    Description
                                </td>
                                <td>
                                    <textarea
                                        value={this.state.formdata.description}
                                        onChange={(event) => this.handleInput(event, 'description')}
                                    />
                                </td>
                            </tr>

                            
                            <tr>
                                <td className="label">
                                    Pages
                                </td>
                                <td>
                                    <div className="form_element">
                                        <input
                                            type="number"
                                            placeholder="Enter pages"
                                            value={this.state.formdata.pages} 
                                            onChange={(event) => this.handleInput(event, 'pages')}                        />
                                    </div>
                                </td>
                            </tr>

                            {this.createTextInput(this.state.formdata.source,'source', "Enter item source", "Source")}
                            {this.createTextInput(this.state.formdata.subject,'subject', "Subject", "Subject")}
                            {this.createTextInput(this.state.formdata.date_created,'date_created', "Date item was created", "Date")}
                            {this.createTextInput(this.state.formdata.contributor,'contributor', "contributor", "Contributor")}
                            {this.createTextInput(this.state.formdata.item_format,'item_format', "The item's format", "Format")}
                            {this.createTextInput(this.state.formdata.materials,'materials', "materials", "Materials")}
                            {this.createTextInput(this.state.formdata.physical_dimensions,'physical_dimensions', "Physical dimensions", "Dimensions")}
                            {this.createTextInput(this.state.formdata.editor,'editor', "editor", "Editor")}
                            {this.createTextInput(this.state.formdata.publisher,'publisher', "publisher", "Publisher")}
                            {this.createTextInput(this.state.formdata.further_info,'further_info', "Enter any further info, resources..", "Further Info")}
                            
                            {this.createTextInput(this.state.formdata.external_link[0].url,'url', "External link url", "URL", 'external_link')}
                            {this.createTextInput(this.state.formdata.external_link[0].text,'text', "External link text", 'Description of the link', "external_link")}

                            {this.createTextInput(this.state.formdata.language,'language', "language", "Language")}
                            {this.createTextInput(this.state.formdata.reference,'reference', "reference", "Ref")}
                            {this.createTextInput(this.state.formdata.rights,'rights', "rights", "Rights")}

                            {this.createTextInput(this.state.formdata.geo.address,'address', "Item address", "Address", 'geo')}
                        
                            
                            <tr>
                                <td></td>
                                <td></td>
                            </tr>


                            <tr>
                                <td></td>
                                <td>
                                    <button type="submit">Save and Continue</button>
                                </td>
                            </tr>


                        </tbody>
                        </table>

                        {/* <div className="form-group">
                            <Progress max="100" color="success" value={this.state.loaded} >
                                { this.state.loaded ?
                                    <div>    
                                        {Math.round(this.state.loaded,2)}
                                        %
                                    </div>
                                :null}
                            </Progress>
                        </div>


                        <div className="form-group">
                            <ToastContainer />
                        </div> */}


                        {/* {
                            // if new book exists
                            this.props.items.newitem ?
                                this.showNewItem(this.props.items.newitem)
                            : null


                        } */}

                    </form>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    // console.log(state); 
    return {
        items:state.items,
        colls:state.collections.colls,
        cats:state.cats.cats,
        subcats:state.cats.subcats,
        latest:state.latest
    }
}

export default connect(mapStateToProps)(AddItem)


