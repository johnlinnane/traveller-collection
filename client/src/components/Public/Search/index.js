import React, { useEffect, useState} from 'react';
import { connect } from 'react-redux';

import SearchHeader from './search_header';
import SearchList from './news_list';
import { getAllItems } from '../../../actions';
import config from "../../../config";

const Search = props => {
    const [filtered, setFiltered] = useState([]);
    const [noMatch, setNoMatch] = useState(null);

    useEffect(() => {
        document.title = `Search - ${config.defaultTitle}`;
        props.dispatch(getAllItems());
        return () => {
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getKeyword = (event) => {
        let keyword = event.target.value.toLowerCase();
        let matchFound = false;

        let filteredByKeyword = props.items.items.filter( (item) => {
            let isMatch = false;

            if (item.title) {
                let match = item.title.toLowerCase();
                if (match.indexOf(keyword) > -1) {
                    isMatch = true;
                }
            }
            if (item.creator) {
                let match = item.creator.toLowerCase();
                if (match.indexOf(keyword) > -1) {
                    isMatch = true;
                }
            }
            if (item.description) {
                let match = item.description.toLowerCase();
                if (match.indexOf(keyword) > -1) {
                    isMatch = true;
                }
            }
            if (item.geo && item.geo.address) {
                let match = item.geo.address.toLowerCase();
                if (match.indexOf(keyword) > -1) {
                    isMatch = true;
                }
            }
            if (isMatch) {
                matchFound = true;
                setNoMatch(false);
                return true;
            } 
            return false;
        });
        if (!matchFound) {
            setNoMatch(true);
        }
        if (keyword !== '') {
            setFiltered(filteredByKeyword);
        } else {
            setFiltered([]);
        }
    }
  
    return (
        <div className="main_view">
            <SearchHeader keywords={getKeyword} placeholder="Search title, creator, description, address"/>
            { !noMatch ?
                <SearchList news={filtered.length === 0 ? null : filtered} />
            : <p className="center">No matches found</p> }
        </div>
    )
}

function mapStateToProps(state) {
  return {
      items:state.items
  }
}

export default connect(mapStateToProps)(Search);