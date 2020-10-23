import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getItemsByCat, getCatById, getAllSubCats } from '../../actions';
import NavigationBar from '../../widgetsUI/navigation';


class CatView  extends Component {
    
    componentDidMount() {
        let catId = this.props.match.params.id
        this.props.dispatch(getItemsByCat(catId));
        this.props.dispatch(getCatById(catId));
        this.props.dispatch(getAllSubCats(catId));
    }

    state = {
        info: [],
        theseSubcats: []
        // subcatsUsed: []
    }
    
    navInfo = {
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    }

 

    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }




    componentDidUpdate(prevProps, prevState) {
        if (this.props.subcats !== prevProps.subcats) {

            let theseSubcats = this.state.theseSubcats;

            this.props.subcats.map( subcat => {
                if (subcat.parent_cat == this.props.match.params.id) {
                    theseSubcats.push(subcat)
                }
            })

            this.setState({
                theseSubcats
              
            })
        }

        if (this.props.catinfo ) {
            document.title = `${this.props.catinfo.title} - Traveller Collection`
           
            this.navInfo.catTitle = this.props.catinfo.title;
            this.navInfo.catId = this.props.catinfo._id;
                
            
        }
    }
    componentWillUnmount() {
        document.title = `Traveller Collection`
    }


    renderImage = (subCat) => {
        // if (this.props.catitems && this.props.catitems.length) {
        //     const firstItem = this.props.catitems.find( item => item.subcategory_ref == subCat._id);
        //     if (firstItem) {
        //         console.log(firstItem);    
        //         return (
        //             <img src={`/media/items/${firstItem._id}/sq_thumbnail/0.jpg`} 
        //                 alt={firstItem.title} 
        //                 onError={this.addDefaultImg} 
        //                 className="subcat_list_img"/>
        //         )
        //     } else {
        //         return <img src={`/media/default/default.jpg`} alt="default item image" className="subcat_list_img"/>
        //     }
        // } else {
        //     return <img src={`/media/default/default.jpg`} alt="default item image" className="subcat_list_img"/>
        // }
        
        return (
            <img src={`/media/cover_img_subcat/${subCat._id}.jpg`} 
                alt={subCat.title} 
                onError={this.addDefaultImg} 
                className="subcat_list_img"
            />
        )
    }


    renderSubcats = () => {
        return (
           
                    // <div className="cat_grid_row">
                        <div className="cat_grid_row cat_grid_column">

                            {this.state.theseSubcats && this.state.theseSubcats.length ?
                                
                                this.state.theseSubcats.map( (subcat, i) => (
                                
                                
                                    <div key={i}>
                                        <Link to={`/subcategory/${subcat._id}`} key={i}>
                                            <figure>
                                                {this.renderImage(subcat)}
                                                <figcaption>{subcat.title}</figcaption>
                                            </figure>
                                        </Link>
                                    </div>
                                ))
                            : null }


                        </div>
                    // </div>
            
        )
    }





  


    render() {
        // console.log(this.props.catitems)
        let catinfo = this.props.catinfo;
        
        return (
            <div className="cat_view_component">
                <NavigationBar navinfo={this.navInfo}/>

                <div className="main_view cat_view">

                        
                        { catinfo ? 
                            <div>
                                <h2 className="title">{catinfo.title}</h2>
                                <p className="description">{catinfo.description}</p>
                            </div>
                        :null
                        }

                        <hr />
                        {this.renderSubcats()}
                </div>
            </div>
        )
    }


}


function mapStateToProps(state) {
    // console.log(state);

    return {
        catinfo: state.cats.catinfo,
        subcats: state.cats.subcats,
        catitems: state.cats.catitems
        
    }
}


export default connect(mapStateToProps)(CatView)