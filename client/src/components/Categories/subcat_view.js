import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getSubcat, getItemsBySubcat, getCatById } from '../../actions';
import { addItem } from '../../actions';
import NavigationBar from '../../widgetsUI/navigation';


var mongoose = require('mongoose');

class SubcatView  extends Component {
    
   

    state = {
       newItemId: null,
     
       navInfo: {
            catTitle: null,
            catId: null,
            subCatTitle: null,
            subCatId: null,
            type: 'Categories'
        }
    }
    
    


    componentDidMount() {
        this.props.dispatch(getSubcat(this.props.match.params.id))
        this.props.dispatch(getItemsBySubcat(this.props.match.params.id))
    }




    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }


    componentDidUpdate(prevProps, prevState) {

        
        if (prevProps !== this.props) {
            if (this.props.subcat ) {
                document.title = `${this.props.subcat.title} - Traveller Collection`
                this.props.dispatch(getCatById(this.props.subcat.parent_cat))
            }

            if (this.props.catinfo && this.props.subcat) {

                let tempNavInfo = {
                    ...this.state.navInfo,
                    catTitle: this.props.catinfo.title,
                    catId: this.props.catinfo._id,
                    subCatTitle: this.props.subcat.title,
                    subCatId: this.props.subcat._id
                }

                // this.state.navInfo.catTitle = this.props.catinfo.title;
                // this.state.navInfo.catId = this.props.catinfo._id;
                // this.state.navInfo.subCatTitle = this.props.subcat.title;
                // this.state.navInfo.subCatId = this.props.subcat._id;

                this.setState({
                    navInfo: tempNavInfo
                })
            }
        }
    }
    componentWillUnmount() {
        document.title = `Traveller Collection`
    }

    addClick = () => {

        const tempNewItemId = mongoose.Types.ObjectId().toHexString()

        this.setState({
            newItemId: tempNewItemId
        })
        

        let item = {
            _id: tempNewItemId,
            subcategory_ref : [this.state.navInfo.subCatId],
            category_ref: [this.state.navInfo.catId]
        }
        
        this.props.dispatch(addItem(item))
        
        setTimeout(() => {
            this.props.history.push(`/user/edit-item/${tempNewItemId}`)
        }, 1000)

    }







    renderItems = () => {
        return(
            <div className="cat_grid_row">
                <div className="cat_grid_column">
                    { this.props.subcatitems.map( (item, i) => (
                        <div key={i}>
                            <Link to={`/items/${item._id}`} key={i}>
                                <figure key={i}  className="item_list_figure">
                                    <img src={`/media/items/${item._id}/sq_thumbnail/0.jpg`} 
                                        alt={item.title} 
                                        onError={this.addDefaultImg} />
                                    <figcaption>{item.title}</figcaption>
                                </figure>
                                
                            </Link>
                        </div>
                    ))}
                    
                        <figure 
                            className="item_list_add item_list_figure"
                            onClick={() => { if (window.confirm('Would you like to add an item to this section?')) this.addClick() }}
                        >
                            <img src={`/media/icons/add_item_icon.png`} 
                                alt="Add an item to this sub-category" 
                                onError={this.addDefaultImg} />
                            <figcaption className="item_list_add_text">Add Item</figcaption>
                        </figure>
                    
                </div>
            </div>
        )
    }



    render() {
        // console.log(this.props);


        

    
        return (
            <div>
                <NavigationBar navinfo={this.state.navInfo}/>
                <div className="main_view">
                    <div className="cat_view">
                        
                        { this.props.subcat && this.props.subcat.title ?
                            <h2 className="title">{this.props.subcat.title}</h2>
                        : null}

                        { this.props.subcat && this.props.subcat.description ?
                            <p className="description">{this.props.subcat.description}</p>
                        : null}

                        <hr />

                        { this.props.subcatitems && this.props.subcatitems.length ?
                            this.renderItems()
                            
                        : <p className="center">There are no items in this section.</p> }
                    </div>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    // console.log(state)
    return {
        // catitems: state.cats.catitems,
        // catinfo: state.cats.catinfo,
        subcat: state.cats.subcat,
        subcats: state.cats.subcats,
        subcatitems: state.cats.subcatitems,
        catinfo: state.cats.catinfo
        
    }
}


export default connect(mapStateToProps)(SubcatView)