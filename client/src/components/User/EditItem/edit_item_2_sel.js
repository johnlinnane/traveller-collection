import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

import { getItemById, getPendItemById, updateItem, updatePendItem, clearItem, getFilesFolder } from '../../../actions';
import { getAllCats, getAllSubCats  } from '../../../actions';

const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;


class EditItemSel extends Component { // was PureComponent


    state = {

        dataToUpdate: {
            _id: null,
            category_ref: [],
            subcategory_ref: [],
            tags: []
            
        },
        catsConverted: null,
        subcatsConverted: null,
        tagsConverted: null,
        catList: null,
        subcatList: [],
        subcatsInitialised: false,
        saved: false,

        tagsDisabled: true
       

    }


    componentDidMount() {
        document.title = "Edit Item - Traveller Collection"
        if (this.props.user.login.isAuth) {
            this.props.dispatch(getItemById(this.props.match.params.id))
        } else {
            this.props.dispatch(getPendItemById(this.props.match.params.id))
        }
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
        this.props.dispatch(getFilesFolder({folder: `/items/${this.props.match.params.id}/original`}));
    }


    componentWillUnmount() {
        this.props.dispatch(clearItem())
        document.title = `Traveller Collection`
    }



    componentDidUpdate(prevProps, prevState) {

        if (this.props !== prevProps) {
            if (this.props.items && this.props.items.item && this.props.cats && this.props.subcats) {


                // REFORMAT EXISTING CATEGORIES
                let catsForState = [];
                if (this.props.items.item.category_ref && this.props.items.item.category_ref.length) {
                    this.props.items.item.category_ref.forEach( (catref) => {
                        this.props.cats.forEach( (cat) => {
                            if ( cat._id === catref) {
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

                if (this.props.items.item.subcategory_ref && this.props.items.item.subcategory_ref.length) {



                        // loop through the item subcats
                        this.props.items.item.subcategory_ref.forEach( (subcatref) => {
                            this.props.subcats.forEach( (subcat) => {
                                if ( subcat._id === subcatref) {
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






                let existsForState = {
                    _id: this.props.items.item._id,
                    category_ref: this.props.items.item.category_ref,
                    subcategory_ref: this.props.items.item.subcategory_ref,
                    tags: this.props.items.item.tags,
                }

                let tagsForState = this.props.items.item.tags;
                if (!tagsForState) {
                    tagsForState = []
                }


                


                // GET OPTIONS
                this.getCatOptions()
                this.getSubcatOptions()
                this.renderForm()

                this.setState({
                    catsConverted: catsForState,
                    subcatsConverted: subcatsForState,
                    tagsConverted: tagsForState,
                    dataToUpdate: existsForState
                })
            }
        } 
    }



    addDefaultImg = (ev) => {
        const newImg = '/assets/media/default/default.jpg';
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


    handleInputCats = (newValue) => {
        let catArray = [];
        if (newValue && newValue.length) {
            newValue.forEach( cat => {
                catArray.push(cat.value)
            })
        }

        // make reformatted list of all subcats
        let newSubcatList = [];
        
        // get new cat id
        if (newValue && newValue.length) {

            newValue.forEach( newval => {
                this.props.subcats.forEach( (subcat) => {
                    if (newval.value === subcat.parent_cat){
                        newSubcatList.push({
                            value: subcat._id,
                            label: subcat.title
                        })
                    }
                })
            })
        }
        let latestData = {
            ...this.state.dataToUpdate,
            category_ref: catArray
        }

        this.setState({
            dataToUpdate: latestData,
            subcatList: newSubcatList
        })
    }

    handleInputSubcats = (newValue) => {
        let subcatArray = [];
        if (newValue && newValue.length) {
            newValue.forEach( subcat => {
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




    getCatOptions = () => {
        let catList = [];
        this.props.cats.forEach( cat => {
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
        

        let subcatList = this.state.subcatList;

        // make reformatted list of all subcats
        if (!this.state.subcatsInitialised) {
            if (this.props.items.item.category_ref && this.props.items.item.category_ref.length) {
                this.props.subcats.forEach( (subcat) => {
                    if (this.props.items.item.category_ref.indexOf(subcat.parent_cat) !== -1) {
                        subcatList.push({
                            value: subcat._id,
                            label: subcat.title
                        })
                    }  
                })
            } else {
                this.props.subcats.forEach( subcat => {
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




    renderForm = () => (
        <form onSubmit={this.onSubmit}>
                        

                        <div className="edit_item_container">
                            <Link to={`/items/${this.state.dataToUpdate._id}`} target="_blank" >

                                <div className="container">

                                    <div className="img_back">

                                        { this.props.items.files && this.props.items.files.length ?
                                            <div>
                                            <img src={`${FS_PREFIX}/assets/media/items/${this.props.match.params.id}/original/${this.props.items.files[0].name}`} alt="item main" className="edit_main_img" onError={this.addDefaultImg} />
                                            </div>
                                        : <img src={'/assets/media/default/default.jpg'} alt='default'/> }

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

                    </form>
    )

    render() {

        let items = this.props.items;
        console.log(this.props);

        return (
            
            <div className="main_view">
                <div className="form_input item_form_input edit_page">

                    {
                        items.itemDeleted ?
                            <div className="red_tag">
                                Item Deleted    
                                {this.redirectUser('/user/all-items')}
                            </div>

                        : null
                    }
                    
                    {this.state.tagsConverted && this.state.catsConverted && this.state.subcatsConverted ?
                    
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
        cats:state.cats.cats,
        subcats:state.cats.subcats
    }
}

export default connect(mapStateToProps)(EditItemSel)