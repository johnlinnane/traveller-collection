import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {Progress} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { addItem, clearNewItem} from '../../actions';
import {getAllColls, getAllCats, getAllSubCats  } from '../../actions';




class AddItem extends Component {


    state = {
        formdata:{
            // $set : {
                title: '',
                creator: '',
                subject: '',
                description: '',
                source: '',
                date_created: '',
                tags: '',
                contributor: '',
                collection_id: '',     
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
                address: '',
                category_ref: '',
                subcategory_ref: ''
            // }
            // $push : {
            //     category_ref: null,
            //     subcategory_ref: null
            // }
        },
        otherdata:{
            link_url: '',
            link_text: '',
            address: ''

        },
        selectedFile: null,
        loaded: 0
    }


    componentDidMount() {
        this.props.dispatch(getAllColls())
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
    }

    handleInput = (event, name) => {
        // make a copy of formdata
        const newFormdata = {
            ...this.state.formdata
        }
        const newOtherdata = {
            ...this.state.otherdata
        }

        // populate the copy with the input value
        newFormdata[name] = event.target.value;
        newOtherdata[name] = event.target.value;

        // copy it back to state
        this.setState({
            formdata:newFormdata,
            otherdata:newOtherdata
        })
    }


    // showNewBook = (book) => (
    //     book.post ?
    //         <div className="conf_link">
    //             Cool !! <Link to={`/books/${book.bookId}`}>
    //                 Click the link to see the post
    //             </Link>
    //         </div>
    //     : null
    // )


    showNewItem = (item) => (
        item.post ?
            <div className="conf_link">
                Cool !! <Link to={`/items/${item.itemId}`}>
                    Click the link to see the item
                </Link>
            </div>
        : null
    )



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

    // createSelectInput(cateogries, this.state.formdata.subcateogry, 'subcategory', "Sub-cateogry")

    // ************** FILE UPLOAD STUFF *******************

    onChangeHandler = (event) => {

        // this.setState({
        //     selectedFile: event.target.files
        //     // loaded: 0
        //   })

        var files = event.target.files;

        if (this.maxSelectFile(event) && this.checkMimeType(event) && this.checkMimeType(event)) {  
            this.setState({
                selectedFile: files
            })
        }
    }



    onClickHandler = () => {
        const data = new FormData() 
        
        // data.append('file', this.state.selectedFile);
        for(var x = 0; x<this.state.selectedFile.length; x++) {
            data.append('file', this.state.selectedFile[x])
        }
        
        axios.post(`http://localhost:8000/upload`, data, { 
                // receive two parameter endpoint url ,form data 
                onUploadProgress: ProgressEvent => {
                    this.setState({
                        loaded: (ProgressEvent.loaded / ProgressEvent.total*100)
                    })
                }
            })
            .then(res => { // then print response status
                console.log(res.statusText)
                toast.success('upload success')
            })
            .catch(err => { 
                toast.error('upload fail')
            })


    }

    maxSelectFile=(event)=>{
        let files = event.target.files // create file object
            if (files.length > 6) { 
               const msg = 'Only 6 images can be uploaded at a time'
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
        // if (err !== '') { // if message not same old that mean has error 
        //     event.target.value = null // discard selected file
        //     console.log(err)
        //     return false; 
        // }
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

        // if (err !== '') {
        //     event.target.value = null
        //     console.log(err)
        //     return false
        // }
        for(var z = 0; z<err.length; z++) {
            toast.error(err[z])
            event.target.value = null
        }
        return true;
   
    }    

    // ****************************************************



    submitForm = (e) => {
        e.preventDefault();
        
        // console.log(this.state.formdata);

        // dispatch an action, adding updated  formdata + the user id from the redux store
        this.props.dispatch(addItem({
                ...this.state.formdata,
                ownerId:this.props.user.login.id,
                external_link: {
                    url: this.state.otherdata.link_url,
                    text:this.state.otherdata.link_text
                },
                geo: {
                    address: this.state.otherdata.address
                }

        }));
        this.props.history.push('/user/user-items');

    }


    setSelector = (test) => {
        var el = document.getElementById("collSelect");

        if (test && el) {
            console.log('selected')
            el.selected = false;
        }
    }


    // clear success message 
    componentWillUnmount() {
        this.props.dispatch(clearNewItem())
    }


    render() {
        console.log(this.props);

        return (
            <div className="rl_container article">
                <form onSubmit={this.submitForm}>
                    
                    {/* <h2>Add a review</h2> */}
                    <h2>Add an item</h2>




                    {this.createTextInput(this.state.formdata.title,'title', "Enter item title")}
                    {this.createTextInput(this.state.formdata.creator,'creator', "Item creator")}
                    {this.createTextInput(this.state.formdata.subject,'subject', "Item subject")}

                    <textarea
                        placeholder="Describe the item here..."
                        value={this.state.formdata.description}
                        onChange={(event) => this.handleInput(event, 'description')}
                    />


                    {this.createTextInput(this.state.formdata.source,'source', "Item source")}
                    {this.createTextInput(this.state.formdata.date_created,'date_created', "Date created")}
                    {this.createTextInput(this.state.formdata.tags,'tags', "Item tags")}
                    {this.createTextInput(this.state.formdata.contributor,'contributor', "Item contributor")}


                    <div className="form_element">
                        <select 
                            value={this.state.formdata.collection_id}
                            onChange={(event) => this.handleInput(event, 'collection_id')}
                        >

                            <option value="" disabled selected>Collection</option>
                            <option value={null} >* None</option>
                            


                            { this.props.colls && this.props.colls.length ?
                                this.props.colls.map ( (coll, i) => (
                                    <option value={`"${coll.id}"`}>{coll.title}</option>
                                ))
                            : null }

                            {/* // <option value="2">Hugh Lane Collection</option>
                            // <option value="5">James Collins Collection</option>
                            // <option value="6">National Photographic Collection</option>
                            // <option value="7">Micheal O hAodha</option>
                            // <option value="8">National Library of Ireland</option>
                            // <option value="9">Public Museum Cork</option>
                            // <option value="10">A Bird in the House, God Bless Her</option>
                            // <option value="11">Irish Folklore Commission (Est 1935 – Now The National Folklore Collection UCD)</option>
                            // <option value="12">Na Píobairí Uilleann / The Uilleann Pipers (NPU)</option>
                            // <option value="13">Rosaleen McDonagh</option>
                            // <option value="14">Publications</option>
                            // <option value="15">Irish Traveller's Photo Gallery</option>
                            // <option value="16">Music</option>
                            // <option value="17">Gmelch, Sharon & George</option>
                            // <option value="18">Dr Abdul Bulbulia</option>
                            // <option value="19">Irish Traveller's Resource Collection, compiled by Aileen L'Amie for the University of Ulster</option> */}

                        </select>
                    </div>

                    {/* {this.setSelector(true)} */}
                    
                    <div className="form_element">
                        <select
                            value={this.state.formdata.category_ref}
                            onChange={(event) => this.handleInput(event, 'category_ref')}
                        >   
                            <option value="" disabled selected>Category</option>

                            <option value={null} >* None</option>

                            { this.props.cats && this.props.cats.length ?
                                this.props.cats.map ( (cat, i) => (
                                    <option value={`"${cat.cat_id}"`}>{cat.title}</option>
                                ))
                            : null }

                            {/* <option value="1">Geography</option>
                            <option value="2">History</option>
                            <option value="3">Literature</option>
                            <option value="4">Photography</option>
                            <option value="5">Music</option>

                            <option value="6">Theatre</option>
                            <option value="7">Visual Arts</option>
                            <option value="8">Language</option>
                            <option value="9">Heritage</option>
                            <option value="10">Politics</option>
                            <option value="11">Film</option>
                            <option value="12">Radio</option>
                            <option value="13">Traveller Organisations</option> */}

                        </select>
                    </div>                    
                    
                    <div className="form_element">
                        <select
                            value={this.state.formdata.subcategory_ref}
                            onChange={(event) => this.handleInput(event, 'subcategory_ref')}
                        >
                            <option value="" disabled selected>Sub Category</option>
                            <option value={null} >* None</option>

                            { this.props.subcats && this.props.subcats.length ?
                                this.props.subcats.map ( (subcat, i) => (
                                    <option value={`"${subcat.subcat_id}"`}>{subcat.title}</option>
                                ))
                            : null }

                            {/* <option value="1">Geography</option>
                            <option value="2">History</option>
                            <option value="3">Literature</option>
                            <option value="4">Photography</option>
                            <option value="5">Music</option>

                            <option value="6">Theatre</option>
                            <option value="7">Visual Arts</option>
                            <option value="8">Language</option>
                            <option value="9">Heritage</option>
                            <option value="10">Politics</option>
                            <option value="11">Film</option>
                            <option value="12">Radio</option>
                            <option value="13">Traveller Organisations</option> */}

                        </select>
                    </div>


                    {this.createTextInput(this.state.formdata.item_format,'item_format', "Item item_format")}
                    {this.createTextInput(this.state.formdata.materials,'materials', "Item materials")}
                    {this.createTextInput(this.state.formdata.physical_dimensions,'physical_dimensions', "Physical dimensions")}


                    <div className="form_element">
                        <input
                            type="number"
                            placeholder="Number of pages"
                            value={this.state.formdata.pages} 
                            onChange={(event) => this.handleInput(event, 'pages')}                        />
                    </div>

                    {this.createTextInput(this.state.formdata.editor,'editor', "Item editor")}
                    {this.createTextInput(this.state.formdata.publisher,'publisher', "Item publisher")}
                    {this.createTextInput(this.state.formdata.further_info,'further_info', "Further info")}
                    {this.createTextInput(this.state.otherdata.link_url,'link_url', "External link url")}
                    {this.createTextInput(this.state.otherdata.link_text,'link_text', "External link text")}

                    {this.createTextInput(this.state.formdata.language,'language', "Item language")}
                    {this.createTextInput(this.state.formdata.reference,'reference', "Item reference")}
                    {this.createTextInput(this.state.formdata.rights,'rights', "Item rights")}
                    {this.createTextInput(this.state.formdata.file_format,'file_format', "File format")}
                    {this.createTextInput(this.state.otherdata.address,'address', "Item address")}

                    <div className="form_element">
                        <input type="file" className="form-control" multiple name="file" onChange={this.onChangeHandler}/>
                    </div>

                    <div className="form-group">
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
                    </div>


                    <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button> 



                  




                    <button type="submit">Submit Item</button>

                    {
                        // if new book exists
                        this.props.items.newitem ?
                            this.showNewItem(this.props.items.newitem)
                        : null


                    }


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

export default connect(mapStateToProps)(AddItem)


