import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { addDefaultImg } from '../../../utils';
import { getItemsByCat, getCatById, getAllSubCats } from '../../../../src/slices/catsSlice';
import Breadcrumb from '../../widgetsUI/breadcrumb';
import config from '../../../config';
import { SubCategory, NavInfo } from '../../../types';
import { AppDispatch } from '../../../../src/index';

const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;


const CatView: React.FC = (props: any) => {
    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();

    let catId = params.id;

    useEffect(() => {
        if (params?.id) {
            dispatch(getItemsByCat(catId));
            dispatch(getCatById(catId));
            dispatch(getAllSubCats());
        }
        return () => {
            document.title = config.defaultTitle;            
        } // eslint-disable-next-line
    }, [params?.id]);

    const [theseSubcats, setTheseSubcats] = useState<SubCategory[] | []>([]);
    
    const [navInfo, setNavInfo] = useState<NavInfo>({
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    });

    useEffect(() => {
        if (props.subcats && props.subcats.length) {
            const filteredSubcats: SubCategory[] = props.subcats.filter(subcat => subcat.parent_cat === params?.id);
            setTheseSubcats(filteredSubcats);
        }
    }, [props.subcats, params?.id]);

    useEffect(() => {
        if (props.catinfo?.title) {
            document.title = `${props.catinfo.title} - Traveller Collection`
            setNavInfo(prevNavInfo => ({
                ...prevNavInfo,
                catTitle: props.catinfo.title,
                catId: props.catinfo._id
            }));
        }
    }, [props.catinfo]);
    
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

function mapStateToProps(state: any) {
    return {
        catinfo: state.cats.catinfo,
        subcats: state.cats.subcats,
        catitems: state.cats.catitems
    }
}

export default connect(mapStateToProps)(CatView)