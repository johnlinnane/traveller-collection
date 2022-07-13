import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { getAllPendItems, deletePendItem, acceptItem } from '../../../actions';
import PendingItemCard from './pending_item_card'
import config from "../../../config";
const API_PREFIX = process.env.REACT_APP_API_PREFIX;

class PendingItemsView extends Component {

    state = {
        items: null
    }


    componentDidMount() {
        document.title = `Pending Items - Traveller Collection`
        this.props.dispatch(getAllPendItems())
        
    }

    componentWillUnmount() {
        document.title = config.defaultTitle;
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps) {
            if (this.props.items && this.props.items.items) {
                this.setState({
                    items: this.props.items.items
                })
            }
        }
    }

    deleteAllMedia = (id) => {
        let fileData =  {
            section: 'items',
            id: id,
            fileType: null,
            fileName: null,
            deleteAll: true
        };
        axios.post(`${API_PREFIX}/delete-dir`, fileData  )
            .then(res => { 
                console.log('Media deleted successfully')
            })
            .catch(err => { 
                console.log('No media deleted')
            });

        
    }


    handleChoice = (itemId, choice) => {

        if (choice === 'accept') {
            this.props.dispatch(acceptItem(itemId, this.props.user.login.id))
        }

        if (choice === 'reject') {
            this.props.dispatch(deletePendItem(itemId));
            this.deleteAllMedia(itemId);
        }

        let tempItems = this.state.items
        let index = tempItems.findIndex(p => p._id === itemId)

        if (index > -1) {
            tempItems.splice(index, 1);
        }

        this.setState({
            items: tempItems
        })

    }



    render() {

        return (
            <div className="main_view p_items_view">
                {/* <div className="p_items_view"> */}
                    <h2>Pending Items</h2>

                    {this.state.items && this.state.items.length ?
                        this.state.items.map( (item, i) => (
                            <PendingItemCard key={i} item={item} handleChoicePass={this.handleChoice} />
                        ))
                
                    : <p>There are no pending items.</p>}
                {/* </div> */}

                
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        items:state.items
    }
}


export default connect(mapStateToProps)(PendingItemsView)

