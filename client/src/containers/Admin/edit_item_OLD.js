import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


// create alot of actions to bring in the book info
// import { getBook, updateBook, clearBook, deleteBook } from '../../actions';

import { getItemById, updateItem, clearItem, deleteItem } from '../../actions';



class EditItem extends PureComponent {


    state = {
        formdata:{
            // submit id to find post
            _id:this.props.match.params.id,
            title:'',
            creator:'', 
            description:'',
            pages:'',
            collection_id:'',
            source:''
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


    submitForm = (e) => {
        e.preventDefault();
        // console.log(this.state.formdata);

        this.props.dispatch(updateItem(this.state.formdata))
    }


    deletePost = () => {
        this.props.dispatch(deleteItem(this.props.match.params.id));
        this.props.history.push('/user/user-items');
    }



    redirectUser = () => {
        setTimeout(() => {
            this.props.history.push('/user/user-items')
        }, 1000)
    }


    componentDidMount() {

        this.props.dispatch(getItemById(this.props.match.params.id))
    }


    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        let item = nextProps.items.item;
        
        // console.log(book);

        // can create a updatedFormdata variable, but no need
        
        this.setState({
            formdata:{
                _id:item._id,
                title:item.title,
                creator:item.creator,
                description:item.description,
                pages:item.pages,
                collection_id:item.collection_id,
                source:item.source 
            }
        })
    }

    componentWillUnmount() {
        this.props.dispatch(clearItem())
    }

    render() {
        // console.log(this.props);

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
                    
                    <h2>Edit Item</h2>

                    <div className="form_element">
                        <input
                            type="text"
                            placeholder="Enter title"
                            value={this.state.formdata.title} 
                            onChange={(event) => this.handleInput(event, 'title')}
                        />
                    </div>

                    <div className="form_element">
                        <input
                            type="text"
                            placeholder="Enter creator"
                            value={this.state.formdata.creator} 
                            onChange={(event) => this.handleInput(event, 'creator')}    
                        />
                    </div>


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

                    <div className="form_element">
                        <select
                            value={this.state.formdata.element_id}
                            onChange={(event) => this.handleInput(event, 'element_id')}
                        >
                            <option val="1">1</option>
                            <option val="2">2</option>
                            <option val="3">3</option>
                            <option val="4">4</option>
                            <option val="5">5</option>

                        </select>
                    </div>


                    <div className="form_element">
                        <input
                            type="number"
                            placeholder="Enter source"
                            value={this.state.formdata.source} 
                            onChange={(event) => this.handleInput(event, 'source')}                        />
                    </div>


                    <button type="submit">Submit Edit</button>
                    
                    <div className="delete_post">
                        <div className="button" onClick={this.deletePost}>
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
        items:state.items
    }
}

export default connect(mapStateToProps)(EditItem)


