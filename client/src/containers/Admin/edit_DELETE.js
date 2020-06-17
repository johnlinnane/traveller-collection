import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


// create alot of actions to bring in the book info
import { getBook, updateBook, clearBook, deleteBook } from '../../actions';

class EditBook extends PureComponent {


    state = {
        formdata:{
            // submit id to find post
            _id:this.props.match.params.id,
            name:'',
            author:'', 
            review:'',
            pages:'',
            rating:'',
            price:''
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

        this.props.dispatch(updateBook(this.state.formdata))
    }


    deletePost = () => {
        this.props.dispatch(deleteBook(this.props.match.params.id))
    }



    redirectUser = () => {
        setTimeout(() => {
            this.props.history.push('/user/user-reviews')
        }, 1000)
    }


    // trigger getBook action
    // componentWillMount() {
    componentDidMount() {

        this.props.dispatch(getBook(this.props.match.params.id))
    }


    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        let book = nextProps.books.book;
        
        // console.log(book);

        // can create a updatedFormdata variable, but no need
        
        this.setState({
            formdata:{
                _id:book._id,
                name:book.name,
                author:book.author,
                review:book.review,
                pages:book.pages,
                rating:book.rating,
                price:book.price 
            }
        })
    }

    componentWillUnmount() {
        this.props.dispatch(clearBook())
    }

    render() {
        // console.log(this.props);

        let books = this.props.books;

        return (
            <div className="rl_container article">

                {
                    books.updateBook ?
                        <div className="edit_confirm">
                            Post updated, <Link to={`/books/${books.book._id}`}>
                                Click here to see your post
                            </Link>
                        </div>
                    : null
                }


                {
                    books.postDeleted ?
                        <div className="red_tag">
                            Post Deleted
                            {this.redirectUser()}
                        </div>

                    : null
                }


                <form onSubmit={this.submitForm}>
                    
                    <h2>Submit Edit</h2>

                    <div className="form_element">
                        <input
                            type="text"
                            placeholder="Enter name"
                            value={this.state.formdata.name} 
                            onChange={(event) => this.handleInput(event, 'name')}
                        />
                    </div>

                    <div className="form_element">
                        <input
                            type="text"
                            placeholder="Enter author"
                            value={this.state.formdata.author} 
                            onChange={(event) => this.handleInput(event, 'author')}    
                        />
                    </div>


                    <textarea
                        value={this.state.formdata.review}
                        onChange={(event) => this.handleInput(event, 'review')}
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
                            value={this.state.formdata.rating}
                            onChange={(event) => this.handleInput(event, 'rating')}
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
                            placeholder="Enter price"
                            value={this.state.formdata.price} 
                            onChange={(event) => this.handleInput(event, 'price')}                        />
                    </div>


                    <button type="submit">Edit review</button>
                    
                    <div className="delete_post">
                        <div className="button" onClick={this.deletePost}>
                            Delete review
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
        books:state.books
    }
}

export default connect(mapStateToProps)(EditBook)


