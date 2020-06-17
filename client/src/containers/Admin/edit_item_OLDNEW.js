import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


// create alot of actions to bring in the book info
// import { getBook, updateBook, clearBook, deleteBook } from '../../actions';

import { getItemById, updateItem, clearItem, deleteItem } from '../../actions';

import {getAllColls, getAllCats, getAllSubCats  } from '../../actions';



class EditItem extends PureComponent {


    state = {
        formdata:{
            // submit id to find post
            _id:this.props.match.params.id,
            title: '',  //
            creator: '',  //
            subject: '',
            description: '',  //
            source: '',  //
            date_created: '',
            tags: [],
            contributor: '',
            collection_id: '',       //
            item_format: '',
            materials: '',
            physical_dimensions: '',
            pages: '',          //
            editor: '',
            publisher: '',
            further_info: '',
            // external_link: '',
            language: '',
            reference: '',
            rights: '',
            file_format: '',
            // address: '',
            category_ref: [],
            subcategory_ref: []
        },
        otherdata:{
            link_url: '',
            link_text: '',
            address: ''
        },
        fake: {
            test: 'off'
        }
    }


    handleInput = (event, name) => {
        // make a copy of formdata
        const newFormdata = {
            ...this.state.formdata
        }


        // populate the copy with the input value
        newFormdata[name] = event.target.value;


        // copy it back to state
        this.setState({
            formdata:newFormdata

        })
    }

    handleOtherInput = (event, name) => {
        // make a copy of formdata
         
        const newOtherdata = {
            ...this.state.otherdata
        }

        // populate the copy with the input value
        newOtherdata[name] = event.target.value;


        // copy it back to state
        this.setState({
            otherdata:newOtherdata

        })
    }


    submitForm = (e) => {
        e.preventDefault();
        // console.log(this.state.formdata);

        this.props.dispatch(updateItem({
                ...this.state.formdata,
                external_link: {
                    url: this.state.otherdata.link_url,
                    text:this.state.otherdata.link_text
                },
                geo: {
                    address: this.state.otherdata.address
                }
            }
        ))
    }


    deletePost = () => {
        this.props.dispatch(deleteItem(this.props.match.params.id));
        this.props.history.push('/user/all-items');
    }



    redirectUser = () => {
        setTimeout(() => {
            this.props.history.push('/user/all-items')
        }, 1000)
    }


    componentDidMount() {

        this.props.dispatch(getItemById(this.props.match.params.id))
        this.props.dispatch(getAllColls())
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
    }


    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        let item = nextProps.items.item;
        
        // console.log(book);

        // can create a updatedFormdata variable, but no need
        
        this.setState({
            formdata:{
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
                // external_link: item.external_link,
                language: item.language,
                reference: item.reference,
                rights: item.rights,
                file_format: item.file_format,
                // address: item.geo.address,
                category_ref: item.category_ref,
                subcategory_ref: item.subcategory_ref
            }
        })

        if (item.external_link) {
            // console.log(item.external_link[0].url);
            this.setState({
                formfill:{
                    link_url: item.external_link[0].url,
                    link_text: item.external_link[0].text,
                    address: item.geo.address
                },
                otherdata:{
                    
                    // link_url: item.external_link[0].url,
                    // link_text: item.external_link[0].text
                    link_url: 'Hello',
                    link_text: 'Hiiiiii'
                }
            })
            console.log(this.state);
        }

        if (item.geo) {
            this.setState({
                otherdata:{
                    address: item.geo.address
                }
            })
        }

    }

    componentWillUnmount() {
        this.props.dispatch(clearItem())
    }


    createTextInput = (stateVar, name, placeholder, type) => {
        // let string = `this.state.formdata.${variable}`;

        return (
            <div className="form_element">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={stateVar} 
                    onChange={(event) => this.handleInput(event, name)}
                />
            </div>
        )
    }

    createOtherTextInput = (stateVar, name, placeholder, type) => {
        // let string = `this.state.formdata.${variable}`;

        return (
            <div className="form_element">
                <input
                    type="text"
                    placeholder={placeholder}
                    value={stateVar} 
                    onChange={(event) => this.handleOtherInput(event, name)}
                />
            </div>
        )
    }



    // <div className="form_element">
    //     <input
    //         type="text"
    //         placeholder="Enter title"
    //         value={this.state.formdata.title} 
    //         onChange={(event) => this.handleInput(event, 'title')}
    //     />
    // </div>


    createSelectInput = (db, value, name, placeholder) => {
        return (
            <div className="form_element">
                <select
                    value={value}
                    onChange={(event) => this.handleInput(event, name)}
                >
                    <option value="" disabled selected>{placeholder}</option>
                    <option value={null} >N/A</option>

                    {db.map( (option, i) => (
                        <option key={i} value={option.id}>{option.title}</option>
                    ) )}
                </select>
            </div>
        )
    }



    render() {
        // console.log(this.state.otherdata);

        let items = this.props.items;

        return (
            <div className="rl_container article">

                {
                    items.updateItem ?
                        <div className="edit_confirm">
                            Post updated, <Link to={`/items/${items.item._id}`}>
                                Click here to see your post
                            </Link>
                        </div>
                    : null
                }


                {
                    items.itemDeleted ?
                        <div className="red_tag">
                            Item Deleted
                            {this.redirectUser()}
                        </div>

                    : null
                }


                <form onSubmit={this.submitForm}>
                    
                    <h2>Select item to edit:</h2>
                    {this.createTextInput(this.state.formdata.title,'title', "Enter title")}
                    {this.createTextInput(this.state.formdata.creator,'creator', "Enter creator")}

                    <textarea
                        value={this.state.formdata.description}
                        onChange={(event) => this.handleInput(event, 'description')}
                    />

                    <div className="form_element">
                        <input
                            type="number"
                            placeholder="Enter pages"
                            value={this.state.formdata.pages} 
                            onChange={(event) => this.handleInput(event, 'pages')}                        />
                    </div>

                    {this.createTextInput(this.state.formdata.source,'source', "Enter item source")}
                    {this.createTextInput(this.state.formdata.subject,'subject', "Subject")}
                    {this.createTextInput(this.state.formdata.date_created,'date_created', "contributor")}
                    <p> TAGS </p>
                    {this.createTextInput(this.state.formdata.contributor,'contributor', "contributor")}
                    {this.createTextInput(this.state.formdata.item_format,'item_format', "item_format")}
                    {this.createTextInput(this.state.formdata.materials,'materials', "materials")}
                    {this.createTextInput(this.state.formdata.physical_dimensions,'physical_dimensions', "physical_dimensions")}
                    {this.createTextInput(this.state.formdata.editor,'editor', "editor")}
                    {this.createTextInput(this.state.formdata.publisher,'publisher', "publisher")}
                    {this.createOtherTextInput(this.state.formdata.further_info,'further_info', "further_info")}
                    
                    {this.createOtherTextInput(this.state.formfill.link_url,'link_url', "link_url")} */}
                    {this.createTextInput(this.state.formfill.link_text,'link_text', "link_text")}

                    {this.createTextInput(this.state.formdata.language,'language', "language")}
                    {this.createTextInput(this.state.formdata.reference,'reference', "reference")}
                    {this.createTextInput(this.state.formdata.rights,'rights', "rights")}
                    {this.createTextInput(this.state.formdata.file_format,'file_format', "file_format")}
                    {this.createOtherTextInput(this.state.formfill.address,'address', "address")}
                    
                    
                    <div className="form_element">
                        <select
                            value={this.state.formdata.collection_id}
                            onChange={(event) => this.handleInput(event, 'collection_id')}
                        >
                            <option value="" disabled selected>Collection</option>
                            <option value={null} >* None</option>

                            { this.props.colls && this.props.colls.length ?
                                this.props.colls.map ( (coll, i) => (
                                    <option key={i} value={`"${coll.id}"`}>{coll.title}</option>
                                ))
                            : null }
                        </select>
                    </div>


                    <div className="form_element">
                        <select
                            value={this.state.formdata.category_ref}
                            onChange={(event) => this.handleInput(event, 'category_ref')}
                        >   
                            <option value="" disabled selected>Category</option>

                            <option value="">* None</option>

                            { this.props.cats && this.props.cats.length ?
                                this.props.cats.map ( (cat, i) => (
                                    <option key={i} value={`"${cat.cat_id}"`}>{cat.title}</option>
                                ))
                            : null }
                        </select>
                    </div>  

                    <p>Existing categories: 
                        { this.state.formdata.category_ref.length < 1 ?
                            this.state.formdata.category_ref.map( (ref, i) => (
                                <span>{ref} </span>
                            )) 
                        : <span>No categories selected</span>}
                    </p>

                    <div className="form_element">
                        <select
                            value={this.state.formdata.subcategory_ref}
                            onChange={(event) => this.handleInput(event, 'subcategory_ref')}
                        >
                            <option value="" disabled selected>Sub Category</option>
                            <option value="" >* None</option>

                            { this.props.subcats && this.props.subcats.length ?
                                this.props.subcats.map ( (subcat, i) => (
                                    <option key={i} value={`"${subcat.subcat_id}"`}>{subcat.title}</option>
                                ))
                            : null }
                        </select>
                    </div>






                    <button type="submit">Submit Edit</button>
                    
                    <div className="delete_post">
                        <div className="button" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.deletePost(e) } }>
                            Delete item
                        </div>


           



                    </div>




                </form>
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
        subcats:state.cats.subcats
    }
}

export default connect(mapStateToProps)(EditItem)


