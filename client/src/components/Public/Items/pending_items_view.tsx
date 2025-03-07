import React, { useState, useEffect, useRef } from 'react';
import { connect, useDispatch } from 'react-redux';
import axios from 'axios';
import { getAllPendItems, deletePendItem, acceptItem } from '../../../../src/slices/itemsSlice';
import PendingItem from './pending_item'
import config from "../../../config";
import { AppDispatch } from '../../../../src/index';
import { getAllCats, getAllSubCats } from '../../../../src/slices/catsSlice';

const API_PREFIX = process.env.REACT_APP_API_PREFIX;

const PendingItemsView: React.FC = (props: any) => {

    const dispatch = useDispatch<AppDispatch>();
    
    const catInfoFetched = useRef(false);

    const [items, setItems] = useState<any[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>('Loading...');
    const [catMap, setCatMap] = useState({});
    const [subcatMap, setSubcatMap] = useState({});

    useEffect(() => {
        document.title = `Pending Items - ${config.defaultTitle}`;
        dispatch(getAllPendItems());
        return () => {
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    useEffect(() => {
        if (props.items.items?.length && !catInfoFetched.current) {
            dispatch(getAllCats());
            dispatch(getAllSubCats());
            catInfoFetched.current = true;
        }
    }, [props.items.items]);

    useEffect(() => {
        if (props.items.items?.error) {
            setErrorMsg('There are no pending items.')
        }
    }, [props.items.items?.error]);

    useEffect(() => {
        if (props.cats?.length) {
            const map = {};
            props.cats.forEach(cat => {
                map[cat._id] = cat.title;
            });
            setCatMap(map)
        }
    }, [props.cats]);

    useEffect(() => {
        if (props.subcats?.length) {
            const map = {};
            props.subcats.forEach(subcat => {
                map[subcat._id] = subcat.title;
            });
            setSubcatMap(map)
        }
    }, [props.subcats]);

    useEffect(() => {
        if (props.items?.items) {
            setItems(props.items.items);
        }
    }, [props.items?.items]);

    const deleteAllMedia = async (id: string) => {
        let fileData =  {
            section: 'items',
            id: id,
            fileType: null,
            fileName: null,
            deleteAll: true
        };
        try {
            await axios.post(`${API_PREFIX}/delete-dir`, fileData);
            console.log('Media deleted successfully');
        } catch (error) {
            console.log('No media deleted');
        }
    }

    const handleChoice = (itemId, choice) => {
        if (choice === 'accept') {
            dispatch(acceptItem(itemId))
        }
        if (choice === 'reject') {
            dispatch(deletePendItem(itemId));
            deleteAllMedia(itemId);
        }
        setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
    }

    return (
        <div className="main_view p_items_view">
            <h2>Pending Items</h2>
            {items && items.length ?
                items.map( (item, i) => (
                    <PendingItem 
                        key={i} 
                        item={item} 
                        catTitle={item.category_ref ? catMap[item.category_ref] : null} 
                        subcatTitle={item.subcategory_ref? subcatMap[item.subcategory_ref] : null} 
                        handleChoicePass={handleChoice} />
                ))
            : <p>{errorMsg}</p>}
        </div>
    );
}

function mapStateToProps(state: any) {
    return {
        items:state.items,
        cats: state.cats.cats,
        subcats: state.cats.subcats,
    }
}

export default connect(mapStateToProps)(PendingItemsView)

