import React, {Component} from 'react';
import { connect } from 'react-redux';

import SearchHeader from './search_header';
import NewsList from './news_list';
import { getAllItems } from '../../actions';





class Search extends Component {

    state = {
        filtered: []
    }

    componentDidMount() {
        this.props.dispatch(getAllItems());

    }

    getKeyword = (event) => {
        let keyword = event.target.value.toLowerCase();
        let filtered = this.props.items.items.filter( (item) => {
            let match = item.title.toLowerCase();
            return match.indexOf(keyword) > -1
        });
        if (keyword) {
            this.setState({
                filtered
            })
        } else {
            this.setState({
                filtered: []
            })
        }
    }

  
    render() {


        let newsFiltered = this.state.filtered;
        // let newsWhole = this.props.items.items;

        return (
            <div className="main_view">
                <SearchHeader keywords={this.getKeyword} />

                <NewsList news={this.state.filtered.length === 0 ? null : newsFiltered}>
                    {/* <h3>
                        Items: 
                    </h3> */}
                </NewsList>
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