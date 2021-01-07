import React, {Component} from 'react';
import { connect } from 'react-redux';

import SearchHeader from './search_header';
import SearchList from './news_list';
import { getAllItems } from '../../../actions';





class Search extends Component {

    state = {
        filtered: [],
        noMatch: null
    }

    componentDidMount() {
        document.title = `Search - Traveller Collection`
        this.props.dispatch(getAllItems());

    }
    
    componentWillUnmount() {
        document.title = `Traveller Collection`
    }

    getKeyword = (event) => {
        let keyword = event.target.value.toLowerCase();
        let matchFound = false;

        let filteredByKeyword = this.props.items.items.filter( (item) => {
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
                this.setState({
                    noMatch: false
                })
                return true;
            } 
            return false;
        });
        if (!matchFound) {
            this.setState({
                noMatch: true
            })
        }
        if (keyword !== '') {
            this.setState({
                filtered: filteredByKeyword
            })
        } else {
            this.setState({
                filtered: []
            })
        }
    }


  
    render() {


        let filtered = this.state.filtered;

        if (this.state.noMatch) {
            console.log('no match found')
        }

        return (
            <div className="main_view">
                <SearchHeader keywords={this.getKeyword} placeholder="Search title, creator, description, address"/>

                { !this.state.noMatch ?
                    <SearchList news={filtered.length === 0 ? null : filtered} />
                : <p className="center">No matches found</p>}
            </div>

        )
    }
}



function mapStateToProps(state) {
  return {
      items:state.items


  }
}

export default connect(mapStateToProps)(Search);