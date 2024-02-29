import React, { useEffect, useState} from 'react';
import { connect, useDispatch } from 'react-redux';

import SearchList from './search_list';
import { searchItems } from '../../../../src/slices/itemsSlice';
import config from "../../../config";
import { AppDispatch } from '../../../../src/index';

const Search = (props: any) => {

    const dispatch = useDispatch<AppDispatch>();

    const [noMatch, setNoMatch] = useState<boolean | null>(null);
    const [results, setResults] = useState([]);
    const [resultsNumber] = useState<number>(10); // setResultsNumber @todo

    useEffect(() => {
        document.title = `Search - ${config.defaultTitle}`;
        return () => {
            document.title = config.defaultTitle;
        }
    }, []);

    useEffect(() => {
        if (props.items?.results) {
            setResults(props.items.results);
            setNoMatch(false);
        }
    }, [props.items]);

    let timeout: NodeJS.Timeout | null = null;

    const getKeyword = (event: any) => {
        if (timeout !== null) {
            clearTimeout(timeout);
        }
        let keyword = event.target.value.toLowerCase();
        if (!keyword.length) {
            setResults([]);
        } else {
            timeout = setTimeout(() => {
                dispatch(searchItems(keyword, resultsNumber));
            }, 1000);
        }
    }
  
    return (
        <div className="main_view">
            <div className="search_input form_input">  
            <input 
                type="text" 
                onChange={getKeyword}
                placeholder="Search title, creator, description, address"
                autoComplete="off"
            />
            </div>
            { !noMatch ?
                <SearchList results={results.length === 0 ? null : results} />
            : <p className="center">No matches found</p> }
        </div>
    )
}

function mapStateToProps(state: any) {
    return {
        items:state.items
    }
}

export default connect(mapStateToProps)(Search);