import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


import { addCat } from '../../actions';



class AdminAddCat extends Component {

    state = {
        catdata: {
            title: '',
            description: ''
        },
        saved: false
    }

    componentDidMount() {
        // this.props.dispatch(blahBlah());
    }


    componentDidUpdate(prevProps, prevState) {
    }



    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    cancel = () => {
        this.props.history.push(`/admin/0`)
    }


    handleInput = (event, field, i) => {

        const newCatdata = {
            ...this.state.catdata
        }

        if (field === 'title') {
            newCatdata.title = event.target.value;

        } 
        
        if (field === 'description') {
            newCatdata.description = event.target.value;
        } 

        // copy it back to state
        this.setState({
            catdata: newCatdata,
        })
        console.log(this.state);
    }

    submitForm = (e) => {
        e.preventDefault();
        // console.log(this.state.formdata);

        // dispatch an action, adding updated  formdata + the user id from the redux store
        this.props.dispatch(addCat({
                ...this.state.catdata,
        }));

        this.setState({
            saved: true
        })

        setTimeout(() => {
            // this.props.history.push(`/user/edit-item-sel/${this.props.items.newitem.itemId}`);
            this.props.history.push(`/admin/0`);
        }, 2000)
    }


    render() {
        // console.log(this.state)

        return (
            <div className="admin">
                    <div>
                        <form onSubmit={this.submitForm}>
                            <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <h3>Title</h3>
                                    </td>
                                    <td>

                                        <input
                                            type="text"
                                            placeholder={"Enter title"}
                                            defaultValue={this.state.catdata.title} 
                                            onChange={(event) => this.handleInput(event, 'title')}
                                        />




                                    </td>
                                </tr>


                                <tr>
                                    <td>
                                        <h3>Description</h3>
                                    </td>
                                    <td>
                                        <textarea
                                            type="text"
                                            placeholder="Enter category description"
                                            defaultValue={this.state.catdata.description} 
                                            onChange={(event) => this.handleInput(event, 'description')}
                                            rows={6}
                                        />
                                    </td>
                                </tr>


                                {/* <tr>
                                    <td>
                                        <img className="change_cat_img" src={`/media/cover_img_cat/XXXX.jpg`} onError={this.addDefaultImg}/>
                                    </td>
                                    <td>
                                        <div className="form_element">
                                            <input type="file" className="form-control" multiple name="file" onChange={this.onChangeHandler}/>
                                            <br />
                                            <button type="button" className="btn btn-success btn-block" onClick={this.onClickHandler}>Upload</button> 
                                        </div>
                                    </td>
                                </tr>

                             */}

                                
                                <tr className="spacer"></tr>

                                

                                <tr className="spacer"></tr>

                                <tr>
                                    <td>
                                        <button type="submit">Add Category</button>
                                    </td>

                                    <td>
                                        <button type="button" onClick={this.cancel}>Cancel</button>
                                    </td>
                                    
                                </tr>

                                <tr className="spacer"></tr>


                            </tbody>
                            </table>
                            
                        </form>

                        {this.state.saved ?
                            <p className="message">Sucessfully added new category!</p>
                        : null}
                        
                    </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    // console.log(state);

    return {
        // xxx: state.xxx.xxxx
        
    }
}


export default withRouter(connect(mapStateToProps)(AdminAddCat));