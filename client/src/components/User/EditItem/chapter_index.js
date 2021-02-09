import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


import { getItemById, updateItem, addItem } from '../../../actions';

const mongoose = require('mongoose');

class ChapterIndex extends Component { // was PureComponent


    state = {
        formdata: {
            _id: this.props.match.params.id,
            pdf_page_index: []
            
        },
       
        saved: false,
        cancelled: false
       

    }



    componentDidMount() {
        document.title = "Chapter Index - Traveller Collection"
        this.props.dispatch(getItemById(this.props.match.params.id))
        
 
    }

    
    componentWillUnmount() {
        document.title = `Traveller Collection`
    }




    componentDidUpdate(prevProps, prevState) {

        if (this.props !== prevProps) {
            if (this.props.items.item) {
                if(this.props.items.item !== prevProps.items.item) {

                    let tempFormdata = {
                        ...this.state.formdata,
                        ...this.props.items.item
                    }

                    this.setState({
                        formdata: tempFormdata
                    })
                }
            }
            
              
        } 


    }


    handleInput(event, field, i) {
        
        let newData = this.state.formdata.pdf_page_index;

        


        switch(field) {
            case 'page':
                newData[i].page = event.target.value;
                break;
            case 'heading':
                newData[i].heading = event.target.value;

                break;
            case 'description':
                newData[i].description = event.target.value;

                break;
            default:
                // code block
        }

        console.log(newData);

        this.setState({
            formdata: {
                ...this.state.formdata,
                pdf_page_index: newData
                
            }
        }) 
    }


    addField = () => {
        let newFormdata = {
            ...this.state.formdata,
            pdf_page_index: [
                ...this.state.formdata.pdf_page_index,
                {
                    description: "",
                    heading: "",
                    page: null
                }
            ]
            
        }
        this.setState({
            formdata: newFormdata
        }) 

    }

    removeField = () => {

        let newArray = this.state.formdata.pdf_page_index;
        newArray.pop();

        console.log(newArray);
        let newFormdata = {
            ...this.state.formdata,
            pdf_page_index: newArray
            
            
        }

        this.setState({
            formdata: newFormdata
        }) 

    }

    cancel = () => {
        this.setState({
            cancelled: true
        })
    }


    createItem = (i) => {

        const chapterItemId = mongoose.Types.ObjectId().toHexString()

        let temp_pdf_page_index = this.state.formdata.pdf_page_index;

        temp_pdf_page_index[i] = {
            ...this.state.formdata.pdf_page_index[i],
            has_child: true,
            child_id: chapterItemId
        }



        let newFormdata = {
            ...this.state.formdata,
            pdf_page_index: temp_pdf_page_index
            
        }

        this.setState({
            formdata: newFormdata
        })

        let temp_has_chapter_children = false;

        this.state.formdata.pdf_page_index.forEach(chapt => {
            if (chapt.has_child) {
                temp_has_chapter_children = true;
            }
        })

        this.setState({
            formdata: {
                ...this.state.formdata,
                has_chapter_children: temp_has_chapter_children
            }
        })

        console.log(this.state.formdata)
        this.props.dispatch(updateItem(
            { ...this.state.formdata }
        ))

        let chapterItem = {
            _id: chapterItemId,
            title: this.state.formdata.pdf_page_index[i].heading,
            description: this.state.formdata.pdf_page_index[i].description,
            is_pdf_chapter: true,
            pdf_item_pages: {
                start: this.state.formdata.pdf_page_index[i].page,
                end: null
            },
            pdf_item_parent_id: this.props.items.item._id,
            subcategory_ref : this.props.items.item.subcategory_ref,
            category_ref: this.props.items.item.category_ref,

            creator: '',
            subject: '',
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
            external_link: [
                {
                    url: '',
                    text: ''
                }
            ],
            geo: {
                address: '',
                latitude: null,
                longitude: null
            },
            location: ''


        }
        
        this.props.dispatch(addItem(chapterItem))
        
        // setTimeout(() => {
        //     this.props.history.push(`/user/edit-item/${chapterItem._id}`)
        // }, 1000)

    }


    onSubmit = (e) => {
        e.preventDefault();





        this.props.dispatch(updateItem(
            { ...this.state.formdata }
        ))

        


        this.setState({
            saved: true
        })

        // setTimeout(() => {
        //     this.props.history.push(`/user/edit-item-file/${this.props.match.params.id }`)
        // }, 1000)

    }


    renderChapters = () => {
                return (
                        this.state.formdata.pdf_page_index.map( (chapt, i) => (
                      

                            <div className="index_form_grid_container" key={i}>
                                <div>
                                    <input
                                        type="number"
                                        placeholder="Page Number"
                                        defaultValue={chapt.page}
                                        onChange={(event) => this.handleInput(event, 'page', i)}
                                        
                                    />
                                </div>
                            
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Chapter Title"
                                        defaultValue={chapt.heading}
                                        onChange={(event) => this.handleInput(event, 'heading', i)}
                                    />

                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Chapter Description"
                                        defaultValue={chapt.description}
                                        onChange={(event) => this.handleInput(event, 'description', i)}
                                    />

                                </div>
                                {/* { chapt.has_child ? */}
                                { false ?
                                    <div className="index_form_grid_button">
                                        <Link to={`/items/${chapt.child_id}`} target='_blank'>
                                            
                                            View Item
                                        </Link>
                                    </div>
                                :
                                    // <td>
                                    //     <button 
                                    //         type="button" 
                                    //         className="index_create_item" 
                                    //         onClick={() => { if (window.confirm('This will make this chapter into its own separate item.')) this.createItem(i) } }
                                    //     >
                                    //         Create Item
                                    //     </button>

                                    // </td>

                                    <div 
                                        onClick={() => { if (window.confirm('This will make this chapter into its own separate item.')) this.createItem(i) } }
                                        className="index_form_grid_button"
                                    >
                                        {/* <button 
                                            type="button" 
                                            className="index_create_item" 
                                            onClick={() => { if (window.confirm('This will make this chapter into its own separate item.')) this.createItem(i) } }
                                        >
                                            Create Item
                                        </button> */}
                                        Create New Archive Item

                                    </div>


                                }



                            </div>


                        ))
                )
            
        
    }

    renderForm = () => (
        <form onSubmit={this.onSubmit}>
                        
            <h2>PDF Chapter Page Index:</h2>

            <div>

                {/* <div className="index_form_grid_container">
                    <div>Page Number</div>
                    <div>Chapter Title</div>
                    <div>Chapter Description</div>
                    <div></div>
                </div> */}

                {this.state.formdata && this.state.formdata.pdf_page_index ?
                    this.renderChapters()
                : null}

            </div>
        </form>
    )

    renderButtons = () => (
        <div>
            <div className="index_add_cont">
                <div className="index_add_rem" onClick={this.addField}>+</div>
                

                <div className="index_add_rem" onClick={() => {if (window.confirm('This will delete the Sub-Category.')) this.removeField()}}>-</div>
                <span>Add/Remove Index</span>
            </div>

            <button type="submit" className="half_width_l" onClick={this.onSubmit}>Save and Return</button>
            <button type="button" className="half_width_l" onClick={(e) => { if (window.confirm('Cancelling will result in loss of all newly inputted information in this form.')) this.cancel(e) } }>Cancel</button>

        </div>
    )

    renderPage = () => (
        <div>
            {this.renderForm()}
            {this.renderButtons()}
            {this.state.saved ?
                <p className="message center">Information saved!</p>
            : null}
        </div>
    )

    render() {

        console.log(this.state.formdata);




        return (
            
            <div className="main_view">

                

                <div className="form_input item_form_input edit_page">
                    

                    
                    {this.state.cancelled ?
                        <div className="index_cancelled">All changes cancelled. Please close this tab.</div>
                    : this.state.saved ?
                        <div className="index_cancelled">All changes saved! Please close this tab.</div>
                    :
                        this.renderPage()
                    }

                        
                </div>
            </div>
            
        );
    }
}

function mapStateToProps(state) {
    return {
        items:state.items
    }
}

export default connect(mapStateToProps)(ChapterIndex)


