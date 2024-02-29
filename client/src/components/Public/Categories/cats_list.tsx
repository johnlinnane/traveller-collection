import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import config from "../../../config";

import Breadcrumb from '../../widgetsUI/breadcrumb';
import { getAllCats } from '../../../../src/slices/catsSlice';
import CatItem from './cats_list_item';
import { AppDispatch } from '../../../../src/index';

const CatList: React.FC = (props: any) => {
    const dispatch = useDispatch<AppDispatch>();
    const navInfo ={
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    };

    useEffect(() => {
        document.title = `Categories - ${config.defaultTitle}`
        dispatch(getAllCats());
        return () => {
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="cats_list_wrapper">
            <Breadcrumb navinfo={navInfo}/>
            <div className="main_view cat_items_view">
                <h2 className="cat_list_title">Categories</h2>
                { props.cats && props.cats.length ?
                    props.cats.map( (cat, i) => (
                        cat.catIsHidden === true ?
                            null
                        : 
                        <Link key={cat._id} to={`/category/${cat._id}`}>
                            <CatItem cat={cat}/>
                        </Link>
                    ))
                : null }
            </div>
        </div>
    );
}

function mapStateToProps(state: any) {
    return {
        cats: state.cats.cats,
        items: state.cats.catitems
    }
}

export default connect(mapStateToProps)(CatList);