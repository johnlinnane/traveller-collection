import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';


import { getItemsByCat, getCatById, getAllSubCats } from '../../actions';
import PanelView from '../PanelView_DELETE/panel_view';
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
    }

    
    navInfo = {
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    }

    componentWillReceiveProps(nextProps) {
        
        if (nextProps.catitems && nextProps.catitems.length) {
            let tempArray = []
            nextProps.catitems.map( (item, i) => (
                    tempArray.push(
                        {
                            // src: `/images/sq_thumb/${item.omeka.omeka_id}.jpg`,
                            src: `/images/items/${item._id}/sq_thumbnail/0.jpg`,
                            caption: item.title,
                            link: `/items/${item._id}` 
                        }
                    )
            ))
            if (tempArray.length) {
                this.setState({ info: [...tempArray]});
            }
        }
        if (this.props.catinfo && this.props.catinfo.length) {
            this.setState({
                navInfo: {
                    catTitle: this.props.catinfo[0].title,
                    catId: this.props.catinfo[0].cat_id
                }
            })
        }
    }

    addDefaultImg = (ev) => {
        const newImg = '/images/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.subcats !== prevProps.subcats) {

            if (this.props.subcats && this.props.subcats.length) {
                let theseSubcats = [];
                
                this.props.subcats.map( subcat => {
                    if (subcat.parent_cat == this.props.match.params.id) {
                        theseSubcats.push(subcat)
                    }
                })
                this.setState({
                    theseSubcats
                })
            }
        }
    }



    renderSubCatItems = (subcat) => {

        
        return ( 
            <div className="cat_grid_column">
                
                <div className="rule"><p><span>{subcat.title}</span></p></div>
               
                {this.props.catitems.map( (item, i) => (
                    
                    item.subcategory_ref[0] == subcat.subcat_id ?
                        <div key={i}>
                            <Link to={`/items/${item._id}`}key={i}>
                                <figure key={i}>
                                    <img src={`/images/items/${item._id}/sq_thumbnail/0.jpg`} 
                                        alt={item.title} 
                                        onError={this.addDefaultImg} />
                                    <figcaption>{item.title}</figcaption>
                                </figure>
                            </Link>
                            <br/>
                        </div>
                    : null
                ))}
            </div>
        )
    }

    renderItemsBySub = () => {
        // loop through all subcats
        return (
            <div>
                {this.state.theseSubcats.map( subcat => (
                    // render the items in each subcat
                    // console.log(subcat);
                    <div className="cat_grid_row">
                        {this.renderSubCatItems(subcat)}
                    </div>
                ))
                }
            </div>
        )
    }

  



    renderGrid = () => {
        
        return(
            <div>
                
                    { this.props.catitems && this.props.catitems.length ?
                        this.renderItemsBySub()
                    : <p className="center">There are no items in this category.</p> }
                
            </div>
    )}





    getCatName = () => {
        if (this.props.catinfo && this.props.catinfo.length) {
            this.navInfo.catTitle = this.props.catinfo[0].title;
            this.navInfo.catId = this.props.catinfo[0].cat_id;
        }
    }



    render() {

        this.getCatName();

        // console.log(this.state);

        let catinfo = this.props.catinfo;

        return (
            <div className="main_view">
                <div className="cat_view">
                    <NavigationBar navinfo={this.navInfo}/>
                    { catinfo && catinfo.length > 0? 
                        <h2 className="title">{catinfo[0].title}</h2>
                    :null
                    }

                    
                    { this.props.catitems ?
                        this.renderGrid()
                    : null }

                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        catitems: state.cats.catitems,
        catinfo: state.cats.catinfo,
        subcats: state.cats.subcats
        
    }
}


export default connect(mapStateToProps)(CatView)