import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';




import { getItemById, updateItem, clearItem, deleteItem } from '../../actions';



class ChapterIndex extends PureComponent {


    state = {
        formdata: {
            _id: this.props.match.params.id,
            pdf_page_index: []

        },
       
        saved: false,
        cancelled: false
       

    }


    // pdf_page_index: [
    //     {
    //         page: Number,
    //         heading: String,
    //         description: String
    //     }
    // ]


    componentDidMount() {
        this.props.dispatch(getItemById(this.props.match.params.id))
 
    }





    componentDidUpdate(prevProps, prevState) {

        if (this.props !== prevProps) {
            if (this.props.items.item.pdf_page_index) {
                
                let newFormdata = {
                    ...this.state.formdata,
                    pdf_page_index: this.props.items.item.pdf_page_index
                }

                this.setState({
                    formdata: newFormdata
                })  
            }
            
              
        } 


    }


    handleInput(event, field, i) {
        // console.log(field, i);
        
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
                // console.log(this.props.items.item.pdf_page_index)
                return (
                        this.state.formdata.pdf_page_index.map( (chapt, i) => (
                      

                            <tr key={i}>
                                <td>
                                    <input
                                        type="number"
                                        placeholder="Page Number"
                                        defaultValue={chapt.page}
                                        onChange={(event) => this.handleInput(event, 'page', i)}
                                        
                                    />
                                </td>
                            
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Chapter Title"
                                        defaultValue={chapt.heading}
                                        onChange={(event) => this.handleInput(event, 'heading', i)}
                                    />

                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Chapter Description"
                                        defaultValue={chapt.description}
                                        onChange={(event) => this.handleInput(event, 'description', i)}
                                    />

                                </td>

                            </tr>


                        ))
                )
            
        
    }

    renderForm = () => (
        <form onSubmit={this.onSubmit}>
                        
            <h2>PDF Chapter Page Index:</h2>

            <table>
            <tbody>

                <tr>
                    <td>Page Number</td>
                    <td>Chapter Title</td>
                    <td>Chapter Description</td>
                </tr>

                {this.state.formdata && this.state.formdata.pdf_page_index ?
                    this.renderChapters()
                : null}

            </tbody>
            </table>
        </form>
    )

    renderButtons = () => (
        <div>
            <div className="index_add_cont">
                <div className="index_add_rem" onClick={this.addField}>+</div>
                <div className="index_add_rem" onClick={this.removeField}>-</div>
                <span>Add/Remove Fields</span>
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
        console.log('rendered');

        let items = this.props.items;

        // console.log(this.state);
        console.log(this.state);

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


