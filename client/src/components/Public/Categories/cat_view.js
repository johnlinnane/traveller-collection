import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import config from "../../../config";
import { getItemsByCat, getCatById, getAllSubCats } from '../../../actions';
import Breadcrumb from '../../widgetsUI/breadcrumb';

const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const CatView = props => {
    
    let catId = props.match.params.id

    useEffect(() => {
        props.dispatch(getItemsByCat(catId));
        props.dispatch(getCatById(catId));
        props.dispatch(getAllSubCats(catId));
        return () => {
            document.title = config.defaultTitle;            
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [theseSubcats, setTheseSubcats] = useState([]);
    
    const [navInfo] = useState({
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    });

    const addDefaultImg = (ev) => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    useEffect(() => {
        if (props.subcats && props.subcats.length ) {
            let tempTheseSubcats = [];
            props.subcats.forEach( subcat => {
                if (subcat.parent_cat === props.match.params.id) {
                    tempTheseSubcats.push(subcat)
                }
            })
            setTheseSubcats(tempTheseSubcats);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.subcats]);

    useEffect(() => {
        if (props.catinfo ) {
            document.title = `${props.catinfo.title} - Traveller Collection`
            navInfo.catTitle = props.catinfo.title;
            navInfo.catId = props.catinfo._id;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.subcats]);
    
    return (
        <div>
            <Breadcrumb navinfo={navInfo}/>
            <div className="main_view cat_view">
                
                {props.catinfo ?
                    <div className="cat_view_header_card">
                        <div className="cat_view_header_card_img">
                                {props.catinfo._id ?
                                    <img src={`${FS_PREFIX}/assets/media/cover_img_cat/${props.catinfo._id}.jpg`} alt="category cover" onError={addDefaultImg} />
                                : null}
                        </div>
                        <div className="cat_view_header_card_img_text">
                            <h2><b>{props.catinfo.title}</b></h2>
                            {props.catinfo.description ? props.catinfo.description : null }
                            <br />
                        </div>
                    </div>
                : null }

                <div className="cat_view_flex_container">
                    {theseSubcats && theseSubcats.length ?
                        theseSubcats.map( (subcat, i) => (
                            subcat.subCatIsHidden && subcat.subCatIsHidden === true ?
                                null
                            :
                                <Link to={`/subcategory/${subcat._id}`} key={i}>
                                    <div key={i} className="cat_view_subcat_card">
                                        <div className="cat_view_subcat_card_img">
                                            <img src={`${FS_PREFIX}/assets/media/cover_img_subcat/${subcat._id}.jpg`} 
                                                alt={subcat.title} 
                                                onError={addDefaultImg} 
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

function mapStateToProps(state) {
    return {
        catinfo: state.cats.catinfo,
        subcats: state.cats.subcats,
        catitems: state.cats.catitems
    }
}

export default connect(mapStateToProps)(CatView)