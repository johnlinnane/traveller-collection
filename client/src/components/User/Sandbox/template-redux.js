import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';


import { getItemById} from '../../actions';




class Sandbox extends Component {




    componentDidMount() {

        this.props.dispatch(getItemById(this.props.match.params.id))

    }


    render() {


        return (
            
        )
    }
}

function mapStateToProps(state) {
    return {
        items:state.items,

    }
}

export default connect(mapStateToProps)(Sandbox)


