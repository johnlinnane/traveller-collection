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
        let filteredByTitle = this.props.items.items.filter( (item) => {
            if (item.title) {
                let match = item.title.toLowerCase();
                return match.indexOf(keyword) > -1
            }
            if (item.creator) {
                let match = item.creator.toLowerCase();
                return match.indexOf(keyword) > -1
            }
            if (item.description) {
                let match = item.description.toLowerCase();
                return match.indexOf(keyword) > -1
            }
        });
        if (keyword !== '') {
            this.setState({
                filtered: filteredByTitle
            })
        // } else {
        //     this.setState({
        //         filtered
        //     })
        }
    }


    // getKeywordCreator = (event) => {
        
    //         console.log('creator exists!');
    //         let keyword = event.target.value.toLowerCase();
    //         let filteredByCreator = this.props.items.items.filter( (item) => {
    //             if (item.creator) {
    //                 let match = item.creator.toLowerCase();
    //                 return match.indexOf(keyword) > -1
    //             }
    //         });
    //         if (keyword !== '') {
    //             this.setState({
    //                 filtered: filteredByCreator
    //             })
    //         // } else {
                
    //             // this.setState({
    //             //     filtered:
    //             // })
    //         }
    // }

  
    render() {


        let newsFiltered = this.state.filtered;
        // let newsWhole = this.props.items.items;

        return (
            <div className="main_view">
                <SearchHeader keywords={this.getKeyword} placeholder="Search..."/>
                {/* <SearchHeader keywords={this.getKeywordCreator} placeholder="Creator..."/> */}

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