import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { getAllPendItems, deletePendItem,  } from '../../actions';


import PendingItemCard from './pending_item_card'





class PendingItemsView extends Component {

    state = {
        items: []
    }


    componentDidMount() {
        this.props.dispatch(getAllPendItems())
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

        axios.post(`http://localhost:3001/delete-dir`, fileData  )
            .then(res => { 
                console.log(res);
                console.log('Media deleted successfully')
            })
            .catch(err => { 
                console.log('Media delete fail')
            });

        
    }


    acceptItem = (id) => {
        console.log('Item ' + id + ' accepted!')

        // move item to items database

    }

    rejectItem = (id) => {
        

        deletePendItem(id);
        this.deleteAllMedia(id);
        // console.log('Item ' + id + ' rejected!')

        let tempItems = this.state.items
        var index = tempItems.findIndex(p => p._id == id)

        if (index > -1) {
            tempItems.splice(index, 1);
        }

        this.setState({
            items: tempItems
        })
    }

    render() {

        console.log(this.state.items)

        var index = this.state.items.findIndex(p => p.title == "Blue")



        console.log(index);


        return (
            <div className="main_view">
                <div className="p_items_view">
                    <h2>Pending Items</h2>

                    {this.state.items ?
                        this.state.items.map( (item, i) => (
                            <PendingItemCard key={i} item={item} acceptItemPass={this.acceptItem} rejectItemPass={this.rejectItem} />
                        ))
                
                    : null}
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

