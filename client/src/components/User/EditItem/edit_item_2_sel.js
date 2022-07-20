import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { getItemById, getPendItemById, updateItem, updatePendItem, clearItem, getFilesFolder } from '../../../actions';
import { getAllCats, getAllSubCats  } from '../../../actions';
import config from "../../../config";
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const EditItemSel = props => {
    const [dataToUpdate, setDataToUpdate] = useState({
        _id: null,
        category_ref: [],
        subcategory_ref: [],
        tags: []
    });
    const [catsConverted, setCatsConverted] = useState(null);
    const [subcatsConverted, setSubcatsConverted] = useState(null);
    const [tagsConverted, setTagsConverted] = useState(null);
    const [catList, setCatList] = useState(null);
    const [subcatList, setSubcatList] = useState([]);
    const [subcatsInitialised, setSubcatsInitialised] = useState(false);
    const [saved, setSaved] = useState(false);
    const [tagsDisabled, setTagsDisabled] = useState(true);
    
    useEffect(() => {
        document.title = `Edit Item - ${config.defaultTitle}`;
        if (props.user.login && props.user.login.isAuth) {
            props.dispatch(getItemById(props.match.params.id))
        } else {
            props.dispatch(getPendItemById(props.match.params.id))
        }
        props.dispatch(getAllCats());
        props.dispatch(getAllSubCats());
        props.dispatch(getFilesFolder({folder: `/items/${props.match.params.id}/original`}));
        return () => {
            props.dispatch(clearItem())
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.items && props.items.item && props.cats && props.subcats) {
            let catsForState = [];
            if (props.items.item.category_ref && props.items.item.category_ref.length) {
                props.items.item.category_ref.forEach( (catref) => {
                    props.cats.forEach( (cat) => {
                        if ( cat._id === catref) {
                            catsForState.push(
                                {
                                    value: cat._id,
                                    label: cat.title
                                }
                            )
                        }
                    })
                })
            }

            let subcatsForState = [];
            if (props.items.item.subcategory_ref && props.items.item.subcategory_ref.length) {
                props.items.item.subcategory_ref.forEach( (subcatref) => {
                    props.subcats.forEach( (subcat) => {
                        if ( subcat._id === subcatref) {
                            subcatsForState.push(
                                {
                                    value: subcat._id,
                                    label: subcat.title
                                }
                            )
                        }
                    })
                })
            }
            let existsForState = {
                _id: props.items.item._id,
                category_ref: props.items.item.category_ref,
                subcategory_ref: props.items.item.subcategory_ref,
                tags: props.items.item.tags,
            }
            let tagsForState = props.items.item.tags;
            if (!tagsForState) {
                tagsForState = []
            }
            getCatOptions()
            getSubcatOptions()
            renderForm()

            setCatsConverted(catsForState);
            setSubcatsConverted(subcatsForState);
            setTagsConverted(tagsForState);
            setDataToUpdate(existsForState);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    const addDefaultImg = ev => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    } 

    const redirectUser = url => {
        setTimeout(() => {
            props.history.push(url)
        }, 1000)
    }

    const handleInputTags = newValue => {
        let latestData = {
            ...dataToUpdate,
            tags: newValue
        }
        let catchData = {
            ...dataToUpdate,
            tags: []
        }
        if (newValue == null) {
            setDataToUpdate(catchData);
        } else {
            setDataToUpdate(latestData);
        }
    }

    const handleInputCats = newValue => {
        let catArray = [];
        if (newValue && newValue.length) {
            newValue.forEach( cat => {
                catArray.push(cat.value)
            })
        }
        let newSubcatList = [];
        if (newValue && newValue.length) {
            newValue.forEach( newval => {
                props.subcats.forEach( (subcat) => {
                    if (newval.value === subcat.parent_cat){
                        newSubcatList.push({
                            value: subcat._id,
                            label: subcat.title
                        })
                    }
                })
            })
        }
        let latestData = {
            ...dataToUpdate,
            category_ref: catArray
        }
        setDataToUpdate(latestData);
        setSubcatList(newSubcatList);
    }

    const handleInputSubcats = newValue => {
        let subcatArray = [];
        if (newValue && newValue.length) {
            newValue.forEach( subcat => {
                subcatArray.push(subcat.value)
            })
        }
        let latestData = {
            ...dataToUpdate,
            subcategory_ref: subcatArray
        }
        setDataToUpdate(latestData);
    }

    const onSubmit = e => {
        e.preventDefault();
        if (props.user.login.isAuth) {
            props.dispatch(updateItem(
                { ...dataToUpdate }
            ))
        } else {
            props.dispatch(updatePendItem(
                { ...dataToUpdate }
            ))
        }
        setSaved(true);
        setTimeout(() => {
            props.history.push(`/user/edit-item-file/${props.match.params.id }`)
        }, 1000)
    }

    const getCatOptions = () => {
        let catList = [];
        props.cats.forEach( cat => {
            catList.push({
                value: cat._id,
                label: cat.title
            })
        })
        setCatList(catList);
    }

    const getSubcatOptions = () => {
        if (!subcatsInitialised) {
            if (props.items.item.category_ref && props.items.item.category_ref.length) {
                props.subcats.forEach( (subcat) => {
                    if (props.items.item.category_ref.indexOf(subcat.parent_cat) !== -1) {
                        subcatList.push({
                            value: subcat._id,
                            label: subcat.title
                        })
                    }  
                })
            } else {
                props.subcats.forEach( subcat => {
                    subcatList.push({
                        value: subcat._id,
                        label: subcat.title
                    })
                })
            }
            setSubcatList(subcatList);
            setSubcatsInitialised(true);
        }
    }

    const renderForm = () => (
        <form onSubmit={onSubmit}>
            <div className="edit_item_container">
                <Link to={`/items/${dataToUpdate._id}`} target="_blank" >
                    <div className="container">
                        <div className="img_back">
                            { props.items.files && props.items.files.length ?
                                <div>
                                <img src={`${FS_PREFIX}/assets/media/items/${props.match.params.id}/original/${props.items.files[0].name}`} alt="item main" className="edit_main_img" onError={addDefaultImg} />
                                </div>
                            : <img src={'/assets/media/default/default.jpg'} alt='default'/> }
                        </div>
                        {props.items && props.items.item ?
                            <div className="centered edit_img_text"><h2>{props.items.item.title}</h2></div>
                        : null}
                    </div>
                </Link>
            </div>
            <h2>Edit Item Categories</h2>
            <table>
            <tbody>
                {tagsDisabled === true ?
                    null
                :
                    <tr>
                        <td>
                            Tags
                        </td>
                        <td>
                            <div className="form_element select">
                                <CreatableSelect
                                    defaultValue={tagsConverted}
                                    isMulti
                                    onChange={handleInputTags}
                                    options={tagsConverted}
                                />
                            </div>
                        </td>
                    </tr>
                }
                <tr>
                    <td>
                        Category
                    </td>
                    <td>
                        <div className="form_element select">
                            <Select
                                key={`cat_${props.items.item._id}`}
                                defaultValue={catsConverted}
                                isMulti
                                name="colors"
                                options={catList}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={handleInputCats}
                            />
                        </div>
                    </td>
                </tr>  
                { catsConverted ?
                    <tr>
                        <td>
                            Sub-categories 
                        </td>
                        <td>

                            <div className="form_element select">
                                <Select
                                    key={`cat_${props.items.item._id}`}
                                    defaultValue={subcatsConverted}
                                    isMulti
                                    name="colors"
                                    options={subcatList}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={handleInputSubcats}
                                />
                            </div>
                        </td>
                    </tr>
                : null }
                <tr>
                    <td colSpan="2" className="center">
                        <button type="submit" className="edit_page_2_save">Save and Continue</button>
                    </td>
                </tr>
            </tbody>
            </table>
        </form>
    )

    return (
        <div className="main_view">
            <div className="form_input item_form_input edit_page">
                {
                    props.items.itemDeleted ?
                        <div className="red_tag">
                            Item Deleted    
                            {redirectUser('/user/all-items')}
                        </div>

                    : null
                }
                {tagsConverted && catsConverted && subcatsConverted ?
                    renderForm()
                : null }
                {saved ?
                    <p className="message center">Information saved!</p>
                : null}
            </div>
        </div>
        
    );
}

function mapStateToProps(state) {
    return {
        items:state.items,
        cats:state.cats.cats,
        subcats:state.cats.subcats
    }
}

export default connect(mapStateToProps)(EditItemSel);