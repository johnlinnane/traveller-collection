import React, {Component} from 'react';
import { connect } from 'react-redux';

import SearchHeader from './search_header';
import NewsList from './news_list';
import { getAllItems } from '../../actions';





class Search extends Component {

    state = {
        filtered: [],
        noMatch: null
    }

    componentDidMount() {
        this.props.dispatch(getAllItems());

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
        // let newsWhole = this.props.items.items;

        if (this.state.noMatch) {
            console.log('no match found')
        }

        return (
            <div className="main_view">
                <SearchHeader keywords={this.getKeyword} placeholder="Search title, creator, description, address"/>
                {/* <SearchHeader keywords={this.getKeywordCreator} placeholder="Creator..."/> */}

                { !this.state.noMatch ?
                <NewsList news={filtered.length === 0 ? null : filtered}>
                    {/* <h3>
                        Items: 
                    </h3> */}
                </NewsList>
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