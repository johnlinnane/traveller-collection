import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// import axios from 'axios';
// import Select from 'react-select';
// import CreatableSelect from 'react-select/creatable';

// import {Progress} from 'reactstrap';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';



import { getItemById, updateItem, clearItem, deleteItem } from '../../actions';
// import { getAllColls, getAllCats, getAllSubCats  } from '../../actions';



class EditItem extends PureComponent {


    state = {
        formdata:{
            _id:this.props.match.params.id,
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
        }


    }


    componentDidMount() {
        this.props.dispatch(getItemById(this.props.match.params.id))

    }


    componentWillUnmount() {
        this.props.dispatch(clearItem())
    }

    // baseline export before adding new stuff
    componentDidUpdate(prevProps) {
        // console.log(prevProps);
        let item = this.props.items.item;
        // console.log(this.state.formdata);

        
        // console.log(book);

        // can create a updatedFormdata variable, but no need
        if (this.props.items !== prevProps.items) {

            let dataForState = {
                formdata:{
                    ...this.state.formdata,
                    _id:item._id,
                    title:item.title,  //
                    creator:item.creator,  //
                    description:item.description,  //
                    pages:item.pages,  //
                    collection_id:item.collection_id,  //
                    source:item.source,   //

                    subject: item.subject,
                    date_created: item.date_created,
                    tags: item.tags,
                    contributor: item.contributor,
                    item_format: item.item_format,
                    materials: item.materials,
                    physical_dimensions: item.physical_dimensions,
                    editor: item.editor,
                    publisher: item.publisher,
                    further_info: item.further_info,
                    language: item.language,
                    reference: item.reference,
                    rights: item.rights,
                    file_format: item.file_format,
                    // address: item.geo.address,
                    category_ref: item.category_ref,
                    subcategory_ref: item.subcategory_ref
                }
            }

            this.setState({
                ...dataForState
            })
            // console.log(item);
            // console.log(this.state);


            if (item.external_link) {
                if (item.external_link[0].url || item.external_link[0].text) {
                    // console.log('yes');
                    dataForState = {
                        formdata: {
                            ...dataForState.formdata,
                            external_link: [
                                {
                                    url: item.external_link[0].url,
                                    text: item.external_link[0].text
                                }
                            ]
                        }
                    }
                    // console.log(dataForState);
                    // console.log(this.state.formdata.external_link);
                    this.setState({
                        dataForState
                    })
                }
            } 

            // console.log(this.state);


            if (item.geo && item.geo.address) {
                // console.log(item.external_link[0].url);
                dataForState = {
                    formdata: {
                        ...dataForState.formdata,
                        geo: {
                            address: item.geo.address
                        }
                    }
                }
                this.setState({
                    ...dataForState
                })
            }
            // console.log(this.state);
            

            
        }

    }


    handleInput = (event, name, level) => {


        // make a copy of formdata
        const newFormdata = {
            ...this.state.formdata
        }

        // console.log(newFormdata);

        if (level === 'external_link') {
            newFormdata[level][0][name] = event.target.value;

        } else if (level === 'geo') {
            newFormdata[level][name] = event.target.value;
        } else {
            newFormdata[name] = event.target.value;
        }


        // copy it back to state
        this.setState({
            formdata: newFormdata

        })
        console.log(newFormdata);
    }




    


    deletePost = () => {
        this.props.dispatch(deleteItem(this.state.formdata._id));
        this.props.history.push('/user/all-items');
    }



    redirectUser = () => {
        setTimeout(() => {
            this.props.history.push('/user/all-items')
        }, 1000)
    }






    submitForm = (e) => {
        e.preventDefault();
        // console.log(this.state.formdata);

        this.props.dispatch(updateItem({
                ...this.state.formdata
            }
        ))
        this.props.history.push(`/user/edit-item-sel/${this.props.items.item._id}`)
    }

    



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
                            defaultValue={existing} 
                            onChange={(event) => this.handleInput(event, name, level)}
                        />
                    </div>
                </td>

            </tr>
        )
    }

 

    // ****************************************************

    addDefaultImg = (ev) => {
        const newImg = '/images/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    } 


    renderForm = () => {
        // console.log(this.state);

        let items = this.props.items;

        return (
            <div>
            {/* {
                items.updateItem ?
                    <div className="edit_confirm">
                        Post updated, <Link to={`/items/${items.item._id}`}>
                            Click here to see your post
                        </Link>
                    </div>
                : null
            } */}


            {/* {
                items.itemDeleted ?
                    <div className="red_tag">
                        Item Deleted    
                        {this.redirectUser()}
                    </div>

                : null
            } */}


            <form onSubmit={this.submitForm}>
                
                <h2>Edit item:</h2>
                <div className="item_container">
                    <img src={`/images/items/${items.item._id}/original/0.jpg`} alt="Item" onError={this.addDefaultImg}/>
                </div>

                <table>
                <tbody>
                
                    {this.createTextInput(items.item.title,'title', "Enter title", "Title")}
                    {this.createTextInput(items.item.creator,'creator', "Enter creator", "Creator")}




                    <tr>
                        <td className="label">
                            Description
                        </td>
                        <td>
                            <textarea
                                type="text"
                                placeholder="Enter item description"
                                defaultValue={items.item.description} 
                                onChange={(event) => this.handleInput(event, 'description')}
                                rows={18}
                            />
                            
                        </td>
                    </tr>

                    {/* {this.createTextInput(items.item.description,'description', "Enter item description", "Description")} */}




                    
                    <tr>
                        <td className="label">
                            Pages
                        </td>
                        <td>
                            <div className="form_element">
                                <input
                                    type="number"
                                    placeholder="Enter pages"
                                    defaultValue={items.item.pages} 
                                    onChange={(event) => this.handleInput(event, 'pages')}                        />
                            </div>
                        </td>
                    </tr>

                    {this.createTextInput(items.item.source,'source', "Enter item source", "Source")}
                    {this.createTextInput(items.item.subject,'subject', "Subject", "Subject")}
                    {this.createTextInput(items.item.date_created,'date_created', "Date item was created", "Date")}
                
                    {this.createTextInput(items.item.contributor,'contributor', "contributor", "Contributor")}

                    <tr><td></td><td></td></tr>
                    <tr><td></td><td></td></tr>
                    <tr><td></td><td></td></tr>
 
                    {this.createTextInput(items.item.item_format,'item_format', "The item's format", "Format")}
                    {this.createTextInput(items.item.materials,'materials', "materials", "Materials")}
                    {this.createTextInput(items.item.physical_dimensions,'physical_dimensions', "Physical dimensions", "Dimensions")}
                    {this.createTextInput(items.item.editor,'editor', "editor", "Editor")}
                    {this.createTextInput(items.item.publisher,'publisher', "publisher", "Publisher")}
                    {this.createTextInput(items.item.further_info,'further_info', "Enter any further info, resources..", "Further Info")}
                    
                    <tr><td></td><td></td></tr>
                    <tr><td></td><td></td></tr>
                    <tr><td></td><td></td></tr>

                    { items.item.external_link && items.item.external_link[0].url ?
                        this.createTextInput(items.item.external_link[0].url,'url', "External link url", "URL", 'external_link')
                    : this.createTextInput(this.state.formdata.external_link[0].url,'url', "External link url", "URL", 'external_link') }
                    {/* : null } */}

                    { items.item.external_link && items.item.external_link[0].text ?
                        this.createTextInput(items.item.external_link[0].text,'text', "External link text", 'Description of the link', "external_link")
                    : this.createTextInput(this.state.formdata.external_link[0].text,'text', "External link text", 'Description of the link', "external_link") }
                    {/* : null } */}

                    <tr><td></td><td></td></tr>
                    <tr><td></td><td></td></tr>
                    <tr><td></td><td></td></tr>
                    
                    {this.createTextInput(items.item.language,'language', "language", "Language")}
                    {this.createTextInput(items.item.reference,'reference', "reference", "Ref")}
                    {this.createTextInput(items.item.rights,'rights', "rights", "Rights")}
                    { items.item.geo ?
                        this.createTextInput(items.item.geo.address,'address', "Where is the item currently located", "Address", 'geo')
                    : null }

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

                    <tr>
                        <td></td>
                        <td>
                            
                            <button 
                                type="button" 
                                className="delete"
                                onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.deletePost(e) } }
                            >
                                Delete item
                            </button>
                            
                            
                            {/* <div className="delete_post">
                                <div className="button" 
                                    onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.deletePost(e) } }>
                                    Delete item
                                </div>
                            </div> */}
                        </td>
                    </tr>


                </tbody>
                </table>

                
    

            </form>
            </div>
        )
    }


    render() {
        // console.log(this.state);

        console.log(this.state.formdata);

        let items = this.props.items;
        // console.log(this.props);

        return (
            <div className="main_view">
                <div className="rl_container article edit_page">
                    { items.item ?    
                        this.renderForm()
                    : null }
                </div>

            {/* // <div className="form-group">
            //     <Progress max="100" color="success" value={this.state.loaded} >
            //         { this.state.loaded ?
            //             <div>    
            //                 {Math.round(this.state.loaded,2)}
            //                 %
            //             </div>
            //         :null}
            //     </Progress>
            // </div>

            // <div className="form-group">
            //     <ToastContainer />
            // </div> */}
            </div>
            
        );
    }
}

function mapStateToProps(state) {
    return {
        items:state.items
    }
}

export default connect(mapStateToProps)(EditItem)


