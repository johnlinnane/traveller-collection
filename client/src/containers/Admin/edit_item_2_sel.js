import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';




import { getItemById, getPendItemById, updateItem, updatePendItem, clearItem, getFilesFolder } from '../../actions';
import { getAllColls, getAllCats, getAllSubCats  } from '../../actions';



class EditItemSel extends PureComponent {


    state = {

        dataToUpdate: {
            _id: null,
            category_ref: [],
            subcategory_ref: [],
            tags: [],
            collection_id: ''
            
        },
        catsConverted: null,
        subcatsConverted: null,
        collConverted: null,
        tagsConverted: null,
        collList: null,
        catList: null,
        subcatList: [],
        subcatsInitialised: false,
        saved: false,

        tagsDisabled: true,
        collsDisabled: true
       

    }


    componentDidMount() {
        document.title = "Edit Item - Traveller Collection"
        if (this.props.user.login.isAuth) {
            this.props.dispatch(getItemById(this.props.match.params.id))
        } else {
            this.props.dispatch(getPendItemById(this.props.match.params.id))
        }
        this.props.dispatch(getAllColls())
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
        this.props.dispatch(getFilesFolder({folder: `/items/${this.props.match.params.id}/original`}));
    }


    componentWillUnmount() {
        this.props.dispatch(clearItem())
        document.title = `Traveller Collection`
    }



    componentDidUpdate(prevProps, prevState) {

        let item = this.props.items.item;
        // console.log(item)
        if (this.props !== prevProps) {
            if (this.props.items && this.props.items.item && this.props.cats && this.props.colls && this.props.subcats) {


                // REFORMAT EXISTING CATEGORIES
                let catsForState = [];
                if (this.props.items.item.category_ref && this.props.items.item.category_ref.length) {
                    this.props.items.item.category_ref.map( (catref) => {
                        this.props.cats.map( (cat) => {
                            if ( cat._id == catref) {
                                catsForState.push(
                                    {
                                        value: cat._id,
                                        label: cat.title
                                    }
                                )
                            }
                        })
                    })
                }


                // REFORMAT EXISTING SUBCATEGORIES
                let subcatsForState = [];
                // checks if item props have arrived
                // console.log(this.props.items.item.subcategory_ref)

                if (this.props.items.item.subcategory_ref && this.props.items.item.subcategory_ref.length) {


                    // // if there is categories
                    // if (this.props.items.item.category_ref && this.props.items.item.category_ref.length) {
                    //     console.log('there is categories')
                    //     // loop through all subcats
                    //     this.props.subcats.map( (subcat) => {
                    //         // if subcat is part of the chosen cat
                    //         if (this.props.items.item.category_ref.indexOf(subcat.parent_cat) !== -1) {
                    //             subcatsForState.push({
                    //                 value: subcat.subcat_id,
                    //                 label: subcat.title
                    //             })
                    //         }  
                    //     })
                    // } else {



                        // loop through the item subcats
                        this.props.items.item.subcategory_ref.map( (subcatref) => {
                            this.props.subcats.map( (subcat) => {
                                if ( subcat._id == subcatref) {
                                    // make new array of formatted subcats for the form
                                    subcatsForState.push(
                                        {
                                            value: subcat._id,
                                            label: subcat.title
                                        }
                                    )
                                }
                            })
                        })
                    // }
                }





                // if (this.props.items.item.category_ref && this.props.items.item.category_ref.length && this.state.catsConverted) {
                //     console.log('hi');
                //     let catsId = [];
                //     prevState.catsConverted.map( cat => {
                //         catsId.push(cat.value)
                //     })
        
        
                //     let refinedSubcatList = [];
        
                //     prevProps.subcats.map( (subcat, i) => {
                        
                //         if (catsId.indexOf(subcat.parent_cat) !== -1) {
                //             refinedSubcatList.push({
                //                 value: subcat.subcat_id,
                //                 label: subcat.title
                //             })
                //         }
                        
                //     })
                //     subcatsForState = refinedSubcatList;
                // }




                // REFORMAT EXISTING COLLECTION
                let collForState = {value:'', label:''};
                this.props.colls.map( (coll) => {
                    if ( coll.id == this.props.items.item.collection_id) {
                        collForState = {
                            value: coll.id,
                            label: coll.title
                        }
                    }
                })


                let existsForState = {
                    _id: this.props.items.item._id,
                    category_ref: this.props.items.item.category_ref,
                    subcategory_ref: this.props.items.item.subcategory_ref,
                    tags: this.props.items.item.tags,
                    collection_id: this.props.items.item.collection_id
                }

                let tagsForState = this.props.items.item.tags;
                if (!tagsForState) {
                    tagsForState = []
                }


                


                // GET OPTIONS
                this.getCollOptions()
                this.getCatOptions()
                this.getSubcatOptions()
                this.renderForm()

                this.setState({
                    catsConverted: catsForState,
                    subcatsConverted: subcatsForState,
                    collConverted: collForState,
                    tagsConverted: tagsForState,
                    dataToUpdate: existsForState
                })
            }
        } 
    }


    // deletePost = () => {
    //     this.props.dispatch(deleteItem(this.state.formdata._id));
    //     this.props.history.push('/user/all-items');
    // }

    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    } 

    redirectUser = (url) => {
        setTimeout(() => {
            this.props.history.push(url)
        }, 1000)
    }


    handleInputTags = (newValue) => {
       
        let latestData = {
            ...this.state.dataToUpdate,
            tags: newValue
        }

        let catchData = {
            ...this.state.dataToUpdate,
            tags: []
        }


        if (newValue == null) {
            this.setState({
                dataToUpdate: catchData
            })
        } else {
            this.setState({
                dataToUpdate: latestData
            })
        }
    }

    handleInputColl = (newValue) => {
        let latestData = {
            ...this.state.dataToUpdate,
            collection_id: newValue.value
        }
        this.setState({
            dataToUpdate: latestData
        })
    }

    handleInputCats = (newValue) => {
        let catArray = [];
        if (newValue && newValue.length) {
            newValue.map( cat => {
                catArray.push(cat.value)
            })
        }
        

        // console.log(newValue);


        // make reformatted list of all subcats
        let newSubcatList = [];

        
        // get new cat id
        if (newValue && newValue.length) {


            // loop through subcats
            // console.log('new list written')

            newValue.map( newval => {
                // console.log(newval)
                this.props.subcats.map( (subcat) => {
                    // console.log(newval.value, subcat.parent_cat);
                    if (newval.value == subcat.parent_cat){
                        newSubcatList.push({
                            value: subcat._id,
                            label: subcat.title
                        })
                    }
                })
            })
            // console.log(newSubcatList);
        }


        


        // send new array to state



  




        let latestData = {
            ...this.state.dataToUpdate,
            category_ref: catArray
        }





        this.setState({
            dataToUpdate: latestData,
            subcatList: newSubcatList
        })
        // console.log(latestData);

    }

    handleInputSubcats = (newValue) => {
        let subcatArray = [];
        if (newValue && newValue.length) {
            newValue.map( subcat => {
                subcatArray.push(subcat.value)
            })
        }
        let latestData = {
            ...this.state.dataToUpdate,
            subcategory_ref: subcatArray
        }
        this.setState({
            dataToUpdate: latestData
        })
    }




    onSubmit = (e) => {
        e.preventDefault();
        if (this.props.user.login.isAuth) {
            this.props.dispatch(updateItem(
                { ...this.state.dataToUpdate }
            ))
        } else {
            this.props.dispatch(updatePendItem(
                { ...this.state.dataToUpdate }
            ))
        }
        


        this.setState({
            saved: true
        })

        setTimeout(() => {
            this.props.history.push(`/user/edit-item-file/${this.props.match.params.id }`)
        }, 1000)

    }


    getCollOptions = () => {
        
        let collList = [
            {
                value: 0,
                label: 'None'
            }
        ];
        this.props.colls.map( coll => {
            collList.push({
                value: coll.id,
                label: coll.title
            })
        })
        this.setState({
            collList
        })
    }


    getCatOptions = () => {
        let catList = [];
        this.props.cats.map( cat => {
            catList.push({
                value: cat._id,
                label: cat.title
            })
        })
        this.setState({
            catList
        })

        
    }



    getSubcatOptions = () => {
        
        // console.log('full list written')

        let subcatList = this.state.subcatList;
        // make reformatted list of all subcats
  
        if (!this.state.subcatsInitialised) {
            if (this.props.items.item.category_ref && this.props.items.item.category_ref.length) {
                // loop through all subcats
                this.props.subcats.map( (subcat) => {
                    // if subcat is part of the chosen cat
                    if (this.props.items.item.category_ref.indexOf(subcat.parent_cat) !== -1) {
                        subcatList.push({
                            value: subcat._id,
                            label: subcat.title
                        })
                    }  
                })
            } else {
                this.props.subcats.map( subcat => {
                    subcatList.push({
                        value: subcat._id,
                        label: subcat.title
                    })
                })
            }

            this.setState({
                subcatList,
                subcatsInitialised: true
            })
        }
    }


    // refineSubcatList = () => {
    //     // if cat is selected
    //     if (this.state.catsConverted && this.state.catsConverted.length) {
    //         let catsId = [];
    //         this.state.catsConverted.map( cat => {
    //             catsId.push(cat.value)
    //         })


    //         let refinedSubcatList = [];

    //         this.props.subcats.map( (subcat, i) => {
                
    //             if (catsId.indexOf(subcat.parent_cat) !== -1) {
    //                 refinedSubcatList.push({
    //                     value: subcat.subcat_id,
    //                     label: subcat.title
    //                 })
    //             }
                
    //         })
    //         this.setState({subcatList: refinedSubcatList})
    //     }
        
    // }


    renderForm = () => (
        <form onSubmit={this.onSubmit}>
                        

                        <div className="item_container">
                            <Link to={`/items/${this.state.dataToUpdate._id}`} target="_blank" >

                                <div className="container">

                                    <div className="img_back">

                                        { this.props.items.files && this.props.items.files.length ?
                                            <div>
                                            <img src={`/media/items/${this.props.match.params.id}/original/${this.props.items.files[0].name}`} alt="item main image" className="edit_main_img" onError={this.addDefaultImg} />
                                            </div>
                                        : <img src={'/media/default/default.jpg'} /> }

                                    </div>
                                    {this.props.items && this.props.items.item ?
                                        <div className="centered edit_img_text"><h2>{this.props.items.item.title}</h2></div>
                                    : null}

                                </div>
                            </Link>
                        </div>


                        <h2>Edit Item Categories</h2>
                       
                        <table>
                        <tbody>
                            
                            {this.state.tagsDisabled === true ?
                                null
                            :
                                <tr>
                                    <td>
                                        Tags
                                    </td>
                                    <td>
                                        <div className="form_element select">
                                            <CreatableSelect
                                                defaultValue={this.state.tagsConverted}
                                                isMulti
                                                onChange={this.handleInputTags}
                                                options={this.state.tagsConverted}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            }
                          
                            {this.state.collsDisabled === true ?
                                null
                            :
                                <tr>
                                    <td>
                                        Collection
                                    </td>
                                    <td>
                                        <div className="form_element select">
                                            <Select
                                                className="basic-single"
                                                classNamePrefix="select"
                                                defaultValue={this.state.collConverted}
                                                isDisabled={false}
                                                isLoading={false}
                                                isClearable={true}
                                                isRtl={false}
                                                isSearchable={true}
                                                name="color"
                                                options={this.state.collList}
                                                onChange={this.handleInputColl}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            }


                            <tr>
                                <td>
                                    Category
                                </td>
                                <td>
                                    <div className="form_element select">
                                        <Select
                                            key={`cat_${this.props.items.item._id}`}
                                            defaultValue={this.state.catsConverted}
                                            isMulti
                                            name="colors"
                                            options={this.state.catList}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            onChange={this.handleInputCats}
                                        />
                                    </div>
                                </td>
                            </tr>  

                           
                            { this.state.catsConverted ?
                                <tr>
                                    <td>
                                        Sub-categories 
                                    </td>
                                    <td>

                                        <div className="form_element select">
                                            <Select
                                                key={`cat_${this.props.items.item._id}`}
                                                defaultValue={this.state.subcatsConverted}
                                                isMulti
                                                name="colors"
                                                options={this.state.subcatList}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                onChange={this.handleInputSubcats}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            : null }

                                <tr>
                                    
                                    <td colSpan="2" className="center">
                                        <button type="submit" className="edit_page_2_save">Save and Continue</button>
                                    </td>
                                </tr>
                            
                            
                        </tbody>
                        </table>

                        
                        
                        {/* <div className="delete_post">
                            <div className="button" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.deletePost(e) } }>
                                Delete item
                            </div>
                        </div> */}

                    </form>
    )

    render() {
        // console.log('rendered');

        let items = this.props.items;

        // console.log(this.state);
        console.log(this.props);

        // this.refineSubcatList();



        return (
            
            <div className="main_view">
                <div className="rl_container article edit_page">
                    
                    {/* {
                        items.updateItem ?
                            <div className="edit_confirm">
                                Post updated, <Link to={`/items/${items.item._id}`}>
                                    Click here to see your post
                                </Link>
                            </div>
                        : null
                    } */}


                    {
                        items.itemDeleted ?
                            <div className="red_tag">
                                Item Deleted    
                                {this.redirectUser('/user/all-items')}
                            </div>

                        : null
                    }
                    
                    {this.state.tagsConverted && this.state.catsConverted && this.state.subcatsConverted && this.state.collConverted ?
                    
                        this.renderForm()
                    : null }

                    {this.state.saved ?
                        <p className="message center">Information saved!</p>
                    : null}

                        
                </div>
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

export default connect(mapStateToProps)(EditItemSel)


