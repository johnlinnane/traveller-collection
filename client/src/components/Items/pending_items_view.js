import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { getAllPendItems, deletePendItem, acceptItem, addItem } from '../../actions';


import PendingItemCard from './pending_item_card'

const config = require('../../config_client').get(process.env.NODE_ENV);




class PendingItemsView extends Component {

    state = {
        items: null
    }


    componentDidMount() {
        document.title = `Pending Items - Traveller Collection`
        this.props.dispatch(getAllPendItems())
        
    }

    componentWillUnmount() {
        document.title = `Traveller Collection`
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props != prevProps) {
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

        axios.post(`http://${config.IP_ADDRESS}:3001/delete-dir`, fileData  )
            .then(res => { 
                console.log(res);
                console.log('Media deleted successfully')
            })
            .catch(err => { 
                console.log('Media delete fail')
            });

        
    }


    handleChoice = (itemId, choice) => {

        if (choice == 'accept') {
            this.props.dispatch(acceptItem(itemId, this.props.user.login.id))
            console.log('Item ' + itemId + ' accepted! by ' + this.props.user.login.id)
            // move item to items database    
        }

        if (choice == 'reject') {
            this.props.dispatch(deletePendItem(itemId));
            this.deleteAllMedia(itemId);
            console.log('Item ' + itemId + ' rejected!')
        }

        let tempItems = this.state.items
        var index = tempItems.findIndex(p => p._id == itemId)

        if (index > -1) {
            tempItems.splice(index, 1);
        }

        this.setState({
            items: tempItems
        })

    }



    render() {

        console.log(this.props)



        return (
            <div className="main_view">
                <div className="p_items_view">
                    <h2>Categories</h2>

                    {this.state.items && this.state.items.length ?
                        this.state.items.map( (item, i) => (
                            <PendingItemCard key={i} item={item} handleChoicePass={this.handleChoice} />
                        ))
                
                    : <p>There are no pending items.</p>}
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


export default connect(mapStateToProps)(PendingItemsView)

