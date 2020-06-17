import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// import { addBook, clearNewBook } from '../../actions';

class AddBook extends Component {


    state = {
        formdata:{
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


    showNewBook = (book) => (
        book.post ?
            <div className="conf_link">
                Cool !! <Link to={`/books/${book.bookId}`}>
                    Click the link to see the post
                </Link>
            </div>
        : null
    )


    submitForm = (e) => {
        e.preventDefault();
        
        // console.log(this.state.formdata);

        // dispatch an action, adding updated  formdata + the user id from the redux store
        this.props.dispatch(addBook({
            ...this.state.formdata,
            ownerId:this.props.user.login.id
        }))
    }


    // clear success message 
    componentWillUnmount() {
        this.props.dispatch(clearNewBook())
    }


    render() {
        // console.log(this.props);
        return (
            <div className="rl_container article">
                <form onSubmit={this.submitForm}>
                    
                    {/* <h2>Add a review</h2> */}
                    <h2>Add an item</h2>


                    <div className="form_element">
                        <input
                            type="text"
                            // placeholder="Enter name"
                            placeholder="Enter item title"
                            value={this.state.formdata.name} 
                            onChange={(event) => this.handleInput(event, 'name')}
                        />
                    </div>

                    <div className="form_element">
                        <input
                            type="text"
                            // placeholder="Enter author"
                            placeholder="Enter item creator"

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
                            // placeholder="Enter pages"
                            placeholder="Enter description"
                            value={this.state.formdata.pages} 
                            onChange={(event) => this.handleInput(event, 'pages')}                        />
                    </div>
                    <div className="form_element">Collection</div>
                    <div className="form_element">
                        <select
                            value={this.state.formdata.rating}
                            onChange={(event) => this.handleInput(event, 'rating')}
                        >
                            <option val="1">Hugh Lane Collection</option>
                            <option val="2">James Collins Collection</option>
                            <option val="3">National Photographic Collection</option>
                            <option val="4">Micheal O hAodha</option>
                            <option val="5">National Library of Ireland</option>

                        </select>
                    </div>


                    <div className="form_element">
                        <input
                            type="number"
                            // placeholder="Enter price"
                            placeholder="Enter keywords"
                            value={this.state.formdata.price} 
                            onChange={(event) => this.handleInput(event, 'price')}                        />
                    </div>


                    {/* <button type="submit">Add review</button> */}
                    <button type="submit">Submit Item</button>

                    {
                        // if new book exists
                        this.props.books.newbook ?
                            this.showNewBook(this.props.books.newbook)
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
        books:state.books
    }
}

export default connect(mapStateToProps)(AddBook)


