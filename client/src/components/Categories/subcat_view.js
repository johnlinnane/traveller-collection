import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getSubcat, getItemsBySubcat, getCatById } from '../../actions';
import NavigationBar from '../../widgetsUI/navigation';


class SubcatView  extends Component {
    
   

    state = {
       
    }
    
    navInfo = {
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    }


    componentDidMount() {
        this.props.dispatch(getSubcat(this.props.match.params.id))
        this.props.dispatch(getItemsBySubcat(this.props.match.params.id))
    }




    addDefaultImg = (ev) => {
        const newImg = '/images/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    componentDidUpdate(prevProps, prevState) {


        if (prevProps !== this.props) {
            if (this.props.subcat ) {
                this.props.dispatch(getCatById(this.props.subcat.parent_cat))
            }

            if (this.props.catinfo && this.props.subcat) {
                this.navInfo.catTitle = this.props.catinfo.title;
                this.navInfo.catId = this.props.catinfo.cat_id;
                this.navInfo.subCatTitle = this.props.subcat.title;
                this.navInfo.subCatId = this.props.subcat.subcat_id;
            }
        }
    }





    renderItems = () => {
        return(
            <div className="cat_grid_row">
                <div className="cat_grid_column">
                    { this.props.subcatitems.map( (item, i) => (
                        <div key={i}>
                            <Link to={`/items/${item._id}`}key={i}>
                                <figure key={i}  className="item_list_figure">
                                    <img src={`/images/items/${item._id}/sq_thumbnail/0.jpg`} 
                                        alt={item.title} 
                                        onError={this.addDefaultImg} />
                                    <figcaption>{item.title}</figcaption>
                                </figure>
                                
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        )
    }



    render() {
        // console.log(this.props);


        

    
        return (
            <div>
                <NavigationBar navinfo={this.navInfo}/>
                <div className="main_view">
                    <div className="cat_view">
                        
                        { this.props.subcat && this.props.subcat.title ?
                            <h2 className="title">{this.props.subcat.title}</h2>
                        : null}


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