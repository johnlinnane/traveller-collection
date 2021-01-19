import React, { Component } from 'react';
import { connect } from 'react-redux';



class Sandbox extends Component {

    render() {
        return (
            <div>
                <p>Sandbox Testing Area</p>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        items:state.items,
    }
}

export default connect(mapStateToProps)(Sandbox)


