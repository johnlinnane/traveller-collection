import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { getItemById, updateItem, clearItem, getFilesFolder } from '../../../actions';
import { getAllCats, getAllSubCats  } from '../../../actions';
import { SubCategory } from '../../../types';
import config from "../../../config";
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const EditItemSel = props => {

    const idParam =  (props.match.params.id?.length === 24) ? props.match.params.id : "";

    interface ItemData {
        _id: string; 
        category_ref: string[];
        subcategory_ref: string[];
    }
    const [itemData, setItemData] = useState<ItemData>({
        _id: idParam,
        category_ref: [],
        subcategory_ref: [],
    });
    const [itemCatsOptions, setItemCatsOptions] = useState<{ value: string; label: string }[]>([]);
    const [itemCatsSelected, setItemCatsSelected] = useState<{ value: string; label: string }[]>([]);
    const [itemSubcatsSelected, setItemSubcatsSelected] = useState<{ value: string; label: string }[]>([]);
    const [itemSubcatOptions, setItemSubcatOptions] = useState<{ value: string; label: string }[]>([]);
    const [submitted, setSubmitted] = useState(false);


    useEffect(() => {
        document.title = `Edit Item - ${config.defaultTitle}`;
        if (idParam) {
            props.dispatch(getAllCats());
            props.dispatch(getAllSubCats());
            props.dispatch(getItemById(idParam));
        }
        return () => {
            props.dispatch(clearItem())
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idParam]);


    useEffect(() => {
        if (props.items?.item?._id) {
            props.dispatch(getFilesFolder({folder: `/items/${props.items.item._id}/original`}));
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.items?.item?._id]);


    useEffect(() => {
        const { category_ref, subcategory_ref } = props.items.item || {};
        setItemData(currentItemData => {
            const newItemData = { ...currentItemData };
            if (category_ref) {
                newItemData.category_ref = category_ref;
            }
            if (subcategory_ref) {
                newItemData.subcategory_ref = subcategory_ref;
            }
            return newItemData;
        });
    }, [props.items.item]);


    useEffect(() => {
        if (props.items?.item && props.cats?.length) {
            setItemCatsOptions(props.cats.map(cat => ({
                value: cat._id,
                label: cat.title
            })));
        }
    }, [props.cats, props.items?.item]);  
    
            
    useEffect(() => {
        if (props.items.item?.category_ref?.length && props.cats?.length) {
                const cats = props.items.item.category_ref
                    .map(catref => props.cats.find(cat => cat._id === catref))
                    .filter(cat => cat !== undefined)
                    .map(cat => ({ value: cat._id, label: cat.title }));
                setItemCatsSelected(cats);
            
        }
    }, [props.cats, props.items?.item?.category_ref]);    
    

    useEffect(() => {
        if (props.items?.item?.subcategory_ref?.length && props.subcats) {
            let options = props.items.item.subcategory_ref
                .map(subcatref => props.subcats.find(subcat => subcat._id === subcatref))
                .filter(subcat => subcat !== undefined)
                .map(subcat => ({ value: subcat._id, label: subcat.title }));
            setItemSubcatsSelected(options);
        }
    }, [props.subcats, props.items?.item?.subcategory_ref]);


    useEffect(() => {
        if (itemCatsSelected?.length && props.subcats?.length) {
            let availableSubcats = [];
            itemCatsSelected.forEach(cat => {
                props.subcats.forEach(subcat => {
                    if (cat.value === subcat.parent_cat) {
                        availableSubcats.push({value: subcat._id, label: subcat.title});
                    }
                })
            })
            setItemSubcatOptions(availableSubcats);
        }
    }, [props.subcats, itemCatsSelected]);


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


    const handleInputCats = newCatValues => {

        setItemCatsSelected(newCatValues);

        const catArray = newCatValues?.map(cat => cat.value) || [];
        setItemData({
            ...itemData,
            category_ref: catArray
        });

        const newthing = newCatValues?.length > 0
        ? newCatValues.flatMap(newval => 
            props.subcats
                .filter(subcat => newval.value === subcat.parent_cat)
                .map(subcat => ({ value: subcat._id, label: subcat.title }))
        )
        : [];

        setItemSubcatOptions(newthing);
        removeOrphanedSubcats(newCatValues, catArray)
    }


    const removeOrphanedSubcats = (newCatValues, catArray) => {
        let selectedCatIds: string[]= [];
        newCatValues.forEach(cat => selectedCatIds.push(cat.value));

        let selectedSubCatsFullData: SubCategory[]= [];
        itemSubcatsSelected.forEach(subcat => {
            props.subcats.forEach(propsubcat => {
                if (propsubcat._id === subcat.value) {
                    selectedSubCatsFullData.push(propsubcat);    
                }
                
            })
        });

        selectedSubCatsFullData.forEach(subcat => {
            if (!selectedCatIds.includes(subcat.parent_cat)) {
                const newSubcatArray = [...itemData.subcategory_ref].filter(item => item !== subcat._id);
                setItemData({
                    ...itemData,
                    category_ref: catArray,
                    subcategory_ref: newSubcatArray
                });
                let options = newSubcatArray
                    .map(subcatref => props.subcats.find(subcat => subcat._id === subcatref))
                    .filter(subcat => subcat !== undefined)
                    .map(subcat => ({ value: subcat._id, label: subcat.title }));
                setItemSubcatsSelected(options);
            }
        })
    }


    const handleInputSubcats = newSubatValues => {
        const subcatArray = newSubatValues?.map(cat => cat.value) || [];
        setItemData({
            ...itemData,
            subcategory_ref: subcatArray
        });
        setItemSubcatsSelected(newSubatValues);

    }


    const onSubmit = e => {
        e.preventDefault();
        if (!itemData.category_ref.length) {
            alert('Please select a category');
        } else if (!itemData.subcategory_ref.length) {
            alert('Please select a subcategory');
        } else {
            props.dispatch(updateItem(
                { ...itemData }
            ));
            setSubmitted(true);
            
            setTimeout(() => {
                props.items?.updateItemSuccess && props.history.push(`/edit-item-file/${idParam}`);
            }, 1000)
        }
    }


    const renderForm = () => {
        const { items } = props;
        const imagePath: string = items?.files?.length
            ? `${FS_PREFIX}/assets/media/items/${idParam}/original/${items.files[0]}`
            : '/assets/media/default/default.jpg';
        const title: string | null = items?.item?.title || null;
        return (
            <form onSubmit={onSubmit}>
                <div className="edit_item_container">
                    <Link to={`/items/${itemData._id}`} target="_blank" >
                        <div className="container">
                            <div className="img_back">
                                <div>
                                    <img src={imagePath} alt="item main" className="edit_main_img" onError={addDefaultImg} />
                                </div>
                            </div>
                            {title && (
                                <div className="centered edit_img_text">
                                    <h2>{title}</h2>
                                </div>
                            )}
                        </div>
                    </Link>
                </div>
                <h2>Edit Item Categories</h2>
                <table>
                <tbody>
                    <tr>
                        <td>
                            Category
                        </td>
                        <td>
                            <div className="form_element select">
                                <Select
                                    key={`cat_${props.items?.item ? props.items.item._id : Math.floor(Math.random() * ((Math.pow(10, 6) - 1)) - Math.pow(10, 5) + 1) + Math.pow(10, 5)}`}
                                    value={itemCatsSelected}
                                    isMulti
                                    name="colors"
                                    options={itemCatsOptions}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    onChange={handleInputCats}
                                />
                            </div>
                        </td>
                    </tr>  
                    { itemData.category_ref?.length ?
                        <tr>
                            <td>
                                Sub-categories 
                            </td>
                            <td>

                                <div className="form_element select">
                                    <Select
                                        key={`cat_${props.items?.item ? props.items.item._id : Math.floor(Math.random() * ((Math.pow(10, 6) - 1)) - Math.pow(10, 5) + 1) + Math.pow(10, 5)}`}
                                        value={itemSubcatsSelected}
                                        isMulti
                                        name="colors"
                                        options={itemSubcatOptions}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                        onChange={handleInputSubcats}
                                    />
                                </div>
                            </td>
                        </tr>
                    : null }
                    <tr>
                        <td colSpan={2} className="center">
                            <button type="submit" className="edit_page_2_save">Save and Continue</button>
                        </td>
                    </tr>
                </tbody>
                </table>
            </form>
        )
    }

    return (
        <div className="main_view">
            <div className="form_input item_form_input edit_page">
                { props.items?.itemDeleted ?
                    <div className="red_tag">
                        <>
                            <div>Item Deleted</div>
                            {redirectUser('/user/all-items')}
                        </>
                    </div>
                : null }
                {renderForm()}
                {submitted ?
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