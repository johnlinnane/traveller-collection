import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';




import { getItemById, updateItem, clearItem, deleteItem } from '../../actions';
import { getAllColls, getAllCats, getAllSubCats  } from '../../actions';
// import Tags from '../../widgetsUI/tags';



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
            // collection_id: '',     
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
            // category_ref: '',
            subcategory_ref: '',
            // tags: [
            //     {
            //         id: '',
            //         text: ''
            //     }
            // ],
            external_link: {
                url: '',
                text: ''
            },
            geo: {
                address: ''
            }
        },
        selectedFile: null,
        loaded: 0,
        // categories
        catOptions: [],
        existingCats: [],
        updatedCats: [],
        catsAreUpdated: false,
        // tags
        existingTags: [],
        updatedTags: [],
        tagsAreUpdated: false,
        // collection
        collOptions: [{ value: null, label: 'None' } ],
        existingColl: null,
        updatedColl: null,
        collIsUpdated: false,
  
        isClearable: true,
        isDisabled: false,
        isLoading: false,
        isRtl: false,
        isSearchable: true
    }


    componentDidMount() {
        this.props.dispatch(getItemById(this.props.match.params.id))
        this.props.dispatch(getAllColls())
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
    }


    componentWillUnmount() {
        this.props.dispatch(clearItem())
    }

    handleInput = (event, name, level) => {
        // make a copy of formdata
        const newFormdata = {
            ...this.state.formdata
        }


        if (level === 'external_link') {
            newFormdata.external_link[name] = event.target.value;
        } else if (level === 'geo') {
            newFormdata.geo[name] = event.target.value;
        } else if (level === 'tags') {
            newFormdata.tags[name] = event.target.value;
        } else {
            newFormdata[name] = event.target.value;
        }


        // copy it back to state
        this.setState({
            formdata:newFormdata

        })
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




    static getDerivedStateFromProps(nextProps, prevState) {
        
        // console.log(nextProps);

        let formReturn;
        let catReturn;
        let tagReturn;
        let collReturn;

        // *********** GENERAL FORM STUFF *****************************
        if (nextProps.items.item ) {

            let item = nextProps.items.item;
                        
            let formdata = prevState.formdata;
            // console.log(formdata);

            formdata = {
                ...formdata,
                _id:item._id,
                title:item.title,  //
                creator:item.creator,  //
                description:item.description,  //
                pages:item.pages,  //
                // collection_id:item.collection_id,  //
                source:item.source,   //

                subject: item.subject,
                date_created: item.date_created,
                // tags: item.tags,
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
                // category_ref: item.category_ref,
                subcategory_ref: item.subcategory_ref
            }

            // console.log(formdata);
            
            if (item.external_link && item.external_link.length && item.external_link.url) {
                formdata = {
                    ...formdata,
                    external_link : {
                        url: item.external_link[0].url,
                        text: item.external_link[0].text
                    }
                }

            }
                
            // console.log(formdata);


            if (item.geo && item.geo.length && item.geo.address) {
                formdata = {
                    ...formdata,
                    geo: {
                        address: item.geo.address
                    }
                }
            }

            // console.log(formdata);
            formReturn = formdata;
            
            // console.log(formReturn);

        }


        // *********** CATEGORY SELECT *****************************

        let catOptionsFromProps = prevState.catOptions;
        let catsFromProps = prevState.existingCats;
        let catsDone = false;
        // let catOptionsFromProps = [];
        // let catsFromProps = [];
        console.log(prevState.catsAreUpdated);


        if (nextProps.cats && nextProps.cats.length && !prevState.catsAreUpdated) {
            nextProps.cats.map( (cat, i) => {
                catOptionsFromProps.push({
                    value: cat.cat_id,
                    label: cat.title
                })
            })

            if (nextProps.items && nextProps.items.item && nextProps.items.item.category_ref && nextProps.items.item.category_ref.length ) {
                // console.log(nextProps.items.item.category_ref);
                nextProps.items.item.category_ref.map( (catref, i) => {
                    let catTitle;
                    nextProps.cats.map( (cat, i) => {
                        if (cat.cat_id == catref) {
                            catTitle = cat.title;
                            let element = {
                                value: catref,
                                label: catTitle
                            };
                            if (!catsFromProps.includes(element)) {
                                // console.log('push!');
                                catsFromProps.push(element)
                            }
                        }
                    })
                    
                })
                catsDone = true;
            }
        }

        // console.log(catsFromProps);

        catReturn = {
            catOptions: catOptionsFromProps,
            existingCats: catsFromProps,
            catsAreUpdated: catsDone
        }

        // console.log(catReturn);

        // *********** TAGS SELECT *****************************

        let tagsFromProps = [];

        if (nextProps.items.item && nextProps.items.item.tags) {
            nextProps.items.item.tags.map( tag => {
                tagsFromProps.push({
                    value: tag.value,
                    label: tag.label
                })
            })
            
        }
        tagReturn = {
            existingTags: tagsFromProps,
            tagsAreUpdated: true
        }

        // *********** COLLECTION SELECT *****************************
        let collOptionsFromProps = [];
        let collFromProps = null;


        if (nextProps.colls && nextProps.colls.length) {
            nextProps.colls.map( coll => {
                collOptionsFromProps.push({
                    value: coll.id,
                    label: coll.title
                })
            })

            if (nextProps.items && nextProps.items.item && nextProps.items.item.collection_id) {
                nextProps.colls.map ( coll => {
                    let collTitle = null;
                    if (coll.id == nextProps.items.item.collection_id) {
                        collTitle = coll.title;

                        collFromProps = {
                            value: nextProps.items.item.collection_id,
                            label: collTitle
                        }
                    }
                })
            }

            // console.log(collOptionsFromProps);

            collReturn =  {
                collOptions: collOptionsFromProps,
                existingColl: collFromProps,
                collIsUpdated: true
            }
            // console.log(collReturn);
        }
        // *********** RETURN *****************************

  
        let allColls, prevColls, updateColls = [];
        if (collReturn) {
            allColls = [prevState.collOptions, ...collReturn.collOptions];
            prevColls = collReturn.existingColl;
            updateColls = collReturn.collIsUpdated;
        }




        return {
            formdata: {...formReturn},

            catOptions: catReturn.catOptions,
            existingCats: catReturn.existingCats,
            catsAreUpdated: catReturn.catsAreUpdated,
            
            existingTags: tagReturn.existingTags,
            tagsAreUpdated: tagReturn.tagsAreUpdated,
            
            collOptions: allColls,
            existingColl: prevColls,
            collIsUpdated: updateColls,

            updated: true,
        }

    }

    // CAT HANDLERS

    handleChangeCats = (newValue) => {
        if (newValue && newValue.length) {
            this.setState({ 
                updatedCats: [...newValue]
            });
        } else {
            this.setState({ 
                updatedCats: []
            });
        }


    };

    // onClickHandlerCats = () => {
    //     let updateData = {
    //         _id: this.props.match.params.id,
    //         category_ref: []
    //     };
    //     if (this.state.updatedCats && this.state.updatedCats.length) {
    //         this.state.updatedCats.map( cat => {
    //             updateData.category_ref.push(cat.value);
    //         })
    //     } 
    //     this.props.dispatch(updateItem({
    //         ...updateData
    //     }))
    // }


    // TAG HANDLERS

    handleChangeTags = (newValue) => {
        if (newValue && newValue.length) {
            console.log(newValue)
            this.setState({ 
                updatedTags: [...newValue]
            });

        } else {
            this.setState({ 
                updatedTags: []
            });
        }
    };

    // onClickHandlerTags = () => {
    //     let updateData = {
    //         _id: this.props.match.params.id,
    //         tags: []
    //     };

    //     if (this.state.updatedTags && this.state.updatedTags.length) {
    //         this.state.updatedTags.map( tag => {
    //             updateData.tags.push(tag);
    //         })
    //     } 
    //     this.props.dispatch(updateItem({
    //         ...updateData
    //     }))
    // }

    // COLL HANDLERS

    handleChangeColl = (newValue) => {
        console.log(newValue);
        if (newValue) {
            this.setState({ 
                updatedColl: newValue
            });
        } 
    };

    // onClickHandlerColl = () => {

    //     let updateData = {
    //         _id: this.props.match.params.id,
    //         collection_id: null
    //     };
    //     if (this.state.updatedColl ) {
    //         updateData.collection_id = this.state.updatedColl.value;
    //     } 
    //     this.props.dispatch(updateItem({
    //         ...updateData
    //     }))
    // }

    submitForm = (e) => {
        e.preventDefault();
        // console.log(this.state.formdata);


        let updateData = { ...this.state.formdata }

        

        
        if (this.state.updatedCats && this.state.updatedCats.length) {

            this.state.updatedCats.map( cat => {
                updateData.category_ref.push(cat.value);
            })
        } 

        if (this.state.updatedTags && this.state.updatedTags.length) {
            this.state.updatedTags.map( tag => {
                updateData.tags.push(tag);
            })
        } 
        if (this.state.updatedColl ) {
            updateData.collection_id = this.state.updatedColl.value;
        } 


        // this.onClickHandlerCats();
        // this.onClickHandlerTags();
        // this.onClickHandlerColl();

        // console.log(this.state);

        this.props.dispatch(updateItem({
                ...updateData
                // ...this.state.formdata
            }
        ))
    }

    



    createTextInput = (stateVar, name, placeholder, label, level) => {
        // let string = `this.state.formdata.${variable}`;

        return (
            <tr>
                <td>
                    {label}
                </td>
                <td>
                    <div className="form_element">
                        <input
                            type="text"
                            placeholder={placeholder}
                            value={stateVar} 
                            onChange={(event) => this.handleInput(event, name, level)}
                        />
                    </div>
                </td>
                
            </tr>
        )
    }



    // ************** FILE UPLOAD STUFF *******************

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

    render() {

        let items = this.props.items;

        const {
            isClearable,
            isSearchable,
            isDisabled,
            isLoading,
            isRtl,
        } = this.state;

        return (
            
            
            <div className="rl_container article edit_page">
                {/* { this.state.loaded ? */}
                    
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
                        
                        <h2>Edit item:</h2>

                        <img src={`/images/items/${this.state.formdata._id}/sq_thumbnail/0.jpg`} alt="Item" onError={this.addDefaultImg}/>

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
                            <tr>
                                <td>
                                    Tags
                                </td>
                                <td>
                                    {this.state.tagsAreUpdated && this.props.items && this.props.items.item?
                                        <CreatableSelect
                                            key={`tag_${this.props.items.item._id}`}
                                            defaultValue={this.state.existingTags}
                                            isMulti
                                            onChange={this.handleChangeTags}
                                            options={this.state.updatedTags}
                                        />
                                    : null}
                                    {/* <Tags tags={this.state.formdata.tags} id={this.props.match.params.id}/> */}
                                </td>
                            </tr>
                            {this.createTextInput(this.state.formdata.contributor,'contributor', "contributor", "Contributor")}
                            {this.createTextInput(this.state.formdata.item_format,'item_format', "The item's format", "Format")}
                            {this.createTextInput(this.state.formdata.materials,'materials', "materials", "Materials")}
                            {this.createTextInput(this.state.formdata.physical_dimensions,'physical_dimensions', "Physical dimensions", "Dimensions")}
                            {this.createTextInput(this.state.formdata.editor,'editor', "editor", "Editor")}
                            {this.createTextInput(this.state.formdata.publisher,'publisher', "publisher", "Publisher")}
                            {this.createTextInput(this.state.formdata.further_info,'further_info', "Enter any further info, resources..", "Further Info")}
                            
                            {/* {this.createTextInput(this.state.formdata.external_link.url,'url', "External link url", "URL")} */}
                            {/* {this.createTextInput(this.state.formdata.external_link.text,'text', "External link text", 'Description of the link', "Link Description")} */}

                            {this.createTextInput(this.state.formdata.language,'language', "language", "Language")}
                            {this.createTextInput(this.state.formdata.reference,'reference', "reference", "Ref")}
                            {this.createTextInput(this.state.formdata.rights,'rights', "rights", "Rights")}
                            {/* {this.createTextInput(this.state.formdata.geo.address,'address', "Item address", "Address")} */}
                            
                            <tr>
                                <td>
                                    Collection
                                </td>
                                <td>
                                    <div className="form_element">
                                        {this.state.collIsUpdated && this.props.items && this.props.items.item  ?
                                            <Select
                                                key={`col_${this.props.items.item._id}`}
                                                className="basic-single"
                                                classNamePrefix="select"
                                                defaultValue={this.state.existingColl}
                                                isDisabled={isDisabled}
                                                isLoading={isLoading}
                                                isClearable={isClearable}
                                                isRtl={isRtl}
                                                isSearchable={isSearchable}
                                                name="color"
                                                options={this.state.collOptions}
                                                onChange={this.handleChangeColl}
                                            />
                                        : null}
                                        {/* <select
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
                                        </select> */}
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Category
                                </td>
                                <td>
                                    <div className="form_element">


                                        {this.state.updated && this.state.catsAreUpdated && this.props.items && this.props.items.item ?
                                            <Select
                                                key={`cat_${this.props.items.item._id}`}
                                                defaultValue={this.state.existingCats}
                                                isMulti
                                                name="colors"
                                                options={this.state.catOptions}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                onChange={this.handleChangeCats}
                                            />
                                        : null}


                                        {/* <select
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
                                        </select> */}
                                    </div>
                                </td>
                            </tr>  

                            {/* <tr>
                                <td>
                                    
                                </td>
                                <td>
                                    <span>Selected: 
                                        { this.state.formdata.category_ref && this.state.formdata.category_ref.length > 0 ?
                                            this.state.formdata.category_ref.map( (ref, i) => (
                                                <span>{ref} </span>
                                            )) 
                                        : <span>No categories selected</span>}
                                    </span>
                                </td>
                            </tr> */}

                            <tr>
                                <td>
                                    Sub-categories 
                                </td>
                                <td>
                                    <div className="form_element">
                                        {/* <select
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
                                        </select> */}
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    Upload 
                                </td>
                                <td>
                                    <div className="form_element">
                                        <input type="file" className="form-control" multiple name="file" onChange={this.onChangeHandler}/>
                                        <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button> 

                                    </div>
                                </td>
                            </tr>
                            
                        </tbody>
                        </table>

                        <button type="submit">Submit Edit</button>
                        
                        <div className="delete_post">
                            <div className="button" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.deletePost(e) } }>
                                Delete item
                            </div>
                        </div>

                    </form>
                {/* : <p>Hi</p>} */}
            </div>
            
        );
    }
}

function mapStateToProps(state) {
    return {
        items:state.items,
        colls:state.collections.colls,
        cats:state.cats.cats,
        subcats:state.cats.subcats
    }
}

export default connect(mapStateToProps)(EditItem)


