import React, { Component } from 'react';
import { connect } from 'react-redux';


import { getAllItems } from '../../actions';



class Sandbox extends Component {


    componentDidMount() {
        this.props.dispatch(getAllItems())
        
    }

    
    render() {

        let items = this.props.items;
        console.log(items);
        return (
            <div>
               
                {items.items ?
                    items.items.map( (item, i) => (
                      item.file_format === 'pdf' ?
                            <div key={i}>
                              {/* {item.title} */}
                              <br/>
                              cp /Users/johnlinnane/DEV/traveller-collection/client/public/media/items/{item._id}/original/0.jpg
                              /Users/johnlinnane/DEV/traveller-collection/client/public/media/items/{item._id}/original/0.pdf;
                              
                              <br/><br/>
                            </div>
                      : null
                    ))
                : null}    

            </div>
        );
    }
}

function mapStateToProps(state) {

    // console.log(state);
    return {
        items:state.items,
    }
}


export default connect(mapStateToProps)(Sandbox)