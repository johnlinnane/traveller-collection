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
        // formdata:{
        //     _id:this.props.match.params.id,
        //     title: '',
        //     creator: '',
        //     subject: '',
        //     description: '',
        //     source: '',
        //     date_created: '',
            
        //     contributor: '',
        //     // collection_id: '',     
        //     item_format: '',
        //     materials: '',
        //     physical_dimensions: '',
        //     pages: '',        
        //     editor: '',
        //     publisher: '',
        //     further_info: '',
        //     language: '',
        //     reference: '',
        //     rights: '',
        //     file_format: '',
        //     address: '',
        //     // category_ref: '',
        //     subcategory_ref: '',
        //     // tags: [
        //     //     {
        //     //         id: '',
        //     //         text: ''
        //     //     }
        //     // ],
        //     external_link: {
        //         url: '',
        //         text: ''
        //     },
        //     geo: {
        //         address: ''
        //     }
        // },
        // selectedFile: null,
        // loaded: 0,




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
  
        // isClearable: true,
        // isDisabled: false,
        // isLoading: false,
        // isRtl: false,
        // isSearchable: true
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


        // if (level === 'external_link') {
        //     newFormdata.external_link[name] = event.target.value;
        // } else if (level === 'geo') {
        //     newFormdata.geo[name] = event.target.value;
        // } else if (level === 'tags') {
        //     newFormdata.tags[name] = event.target.value;
        // } else {
        //     newFormdata[name] = event.target.value;
        // }


        // copy it back to state
        this.setState({
            formdata:newFormdata

        })
    }




    


    deletePost = () => {
        this.props.dispatch(deleteItem(this.state.formdata._id));
        this.props.history.push('/user/all-items');
    }



    redirectUser = (url) => {
        setTimeout(() => {
            this.props.history.push(url)
        }, 1000)
    }




    static getDerivedStateFromProps(nextProps, prevState) {
        
        // console.log(nextProps);

        // let formReturn;
        let catReturn;
        let tagReturn;
        let collReturn;

        // *********** GENERAL FORM STUFF *****************************
        if (nextProps.items.item ) {

            // let item = nextProps.items.item;
                        
            // let formdata = prevState.formdata;
            // // console.log(formdata);

            // formdata = {
            //     ...formdata,
            //     _id:item._id,
            //     title:item.title,  //
            //     creator:item.creator,  //
            //     description:item.description,  //
            //     pages:item.pages,  //
            //     // collection_id:item.collection_id,  //
            //     source:item.source,   //

            //     subject: item.subject,
            //     date_created: item.date_created,
            //     // tags: item.tags,
            //     contributor: item.contributor,
            //     item_format: item.item_format,
            //     materials: item.materials,
            //     physical_dimensions: item.physical_dimensions,
            //     editor: item.editor,
            //     publisher: item.publisher,
            //     further_info: item.further_info,
            //     language: item.language,
            //     reference: item.reference,
            //     rights: item.rights,
            //     file_format: item.file_format,
            //     // category_ref: item.category_ref,
            //     subcategory_ref: item.subcategory_ref
            // }

            // console.log(formdata);
            
            // if (item.external_link && item.external_link.length && item.external_link.url) {
            //     formdata = {
            //         ...formdata,
            //         external_link : {
            //             url: item.external_link[0].url,
            //             text: item.external_link[0].text
            //         }
            //     }

            // }
                
            // console.log(formdata);


            // if (item.geo && item.geo.length && item.geo.address) {
            //     formdata = {
            //         ...formdata,
            //         geo: {
            //             address: item.geo.address
            //         }
            //     }
            // }

            // console.log(formdata);
            // formReturn = formdata;
            
            // console.log(formReturn);

        }


        // *********** CATEGORY SELECT *****************************

        let catOptionsFromProps = prevState.catOptions;
        let catsFromProps = prevState.existingCats;
        let catsDone = false;
        // let catOptionsFromProps = [];
        // let catsFromProps = [];
        // console.log(prevState.catsAreUpdated);


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
                    // console.log(catref);
                    let catTitle;
                    nextProps.cats.map( (cat, i) => {
                        // console.log(nextProps.cats);

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
                    value: 'HANDD',
                    label: '~HNAD'
                    // value: tag.value,
                    // label: tag.label
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
            // formdata: {...formReturn},

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


    reformatExistingCats = () => {
        
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


        // let updateData = { ...this.state.formdata }
        let updateData = null

        

        
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

    



    // createTextInput = (stateVar, name, placeholder, label, level) => {
    //     // let string = `this.state.formdata.${variable}`;

    //     return (
    //         <tr>
    //             <td>
    //                 {label}
    //             </td>
    //             <td>
    //                 <div className="form_element">
    //                     <input
    //                         type="text"
    //                         placeholder={placeholder}
    //                         value={stateVar} 
    //                         onChange={(event) => this.handleInput(event, name, level)}
    //                     />
    //                 </div>
    //             </td>
                
    //         </tr>
    //     )
    // }





    // addDefaultImg = (ev) => {
    //     const newImg = '/images/default/default.jpg';
    //     if (ev.target.src !== newImg) {
    //         ev.target.src = newImg
    //     }  
    // } 

    render() {

        console.log(this.props);

        let items = this.props.items;



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
                                {this.redirectUser('/user/all-items')}
                            </div>

                        : null
                    }


                    <form onSubmit={this.submitForm}>
                        
                        <h2>Edit item:</h2>
                        {/* <span>Item : {this.props.items.item.title}</span> */}

                        {/* <img src={`/images/items/${this.state.formdata._id}/sq_thumbnail/0.jpg`} alt="Item" onError={this.addDefaultImg}/> */}

                        <table>
                        <tbody>
                        
                            




                           

                            
                           

                    
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
                                                isDisabled={false}
                                                isLoading={false}
                                                isClearable={true}
                                                isRtl={false}
                                                isSearchable={true}
                                                name="color"
                                                options={this.state.collOptions}
                                                onChange={this.handleChangeColl}
                                            />
                                        : null}
                                       
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


                                       
                                    </div>
                                </td>
                            </tr>  

                           

                            <tr>
                                <td>
                                    Sub-categories 
                                </td>
                                <td>
                                    <div className="form_element">
                                        Selection here
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


