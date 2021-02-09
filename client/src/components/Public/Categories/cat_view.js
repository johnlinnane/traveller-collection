import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getItemsByCat, getCatById, getAllSubCats } from '../../../actions';
import NavigationBar from '../../widgetsUI/navigation';

const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

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
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }




    componentDidUpdate(prevProps, prevState) {
        if (this.props.subcats !== prevProps.subcats) {

            let theseSubcats = this.state.theseSubcats;

            this.props.subcats.forEach( subcat => {
                if (subcat.parent_cat === this.props.match.params.id) {
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




    render() {
        
        return (
            <div>
                <NavigationBar navinfo={this.navInfo}/>

                <div className="main_view cat_view">

                    
                    {this.props.catinfo ?
                        <div className="cat_view_header_card">
                            <div className="cat_view_header_card_img">
                                    {this.props.catinfo._id ?
                                        <img src={`${FS_PREFIX}/assets/media/cover_img_cat/${this.props.catinfo._id}.jpg`} alt="category cover" onError={this.addDefaultImg} />
                                    : null}
                            </div>

                            <div className="cat_view_header_card_img_text">
                                <h2><b>{this.props.catinfo.title}</b></h2>
                                {this.props.catinfo.description ? this.props.catinfo.description : null }
                                <br />
                            </div>
                        </div>
                    : null }



                    <div className="cat_view_flex_container">

                        {this.state.theseSubcats && this.state.theseSubcats.length ?
                            
                            this.state.theseSubcats.map( (subcat, i) => (
                            
                            
                                
                                <Link to={`/subcategory/${subcat._id}`} key={i}>
                                    <div key={i} className="cat_view_subcat_card">
                                        <div className="cat_view_subcat_card_img">
                                            <img src={`${FS_PREFIX}/assets/media/cover_img_subcat/${subcat._id}.jpg`} 
                                                alt={subcat.title} 
                                                onError={this.addDefaultImg} 
                                            />
                                        </div>
                                        <div className="cat_view_subcat_card_text">
                                            <h3>{subcat.title}</h3>
                                        </div>
                                    </div>
                                </Link>
                                
                            ))
                        : null }


                    </div>
                </div>
            </div>
        )
    }


}


function mapStateToProps(state) {
    

    return {
        catinfo: state.cats.catinfo,
        subcats: state.cats.subcats,
        catitems: state.cats.catitems
        
    }
}


export default connect(mapStateToProps)(CatView)