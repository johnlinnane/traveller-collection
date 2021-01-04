import React, { Component } from 'react';
import { connect } from 'react-redux';

import SliderTemplates from './slider_templates'
import { getItems } from '../../../../actions';


class NewsSlider extends Component {


    componentDidMount() {
        this.props.dispatch(getItems(4,0,'asc'));
    }

    render() {
        return(
            <div>
                {this.props.items.list ?
                    <SliderTemplates data={this.props.items} type={this.props.type} settings={this.props.settings}/>
                      
                : null}
            </div>
        )
    }
}


function mapStateToProps(state) {
  return {
      items:state.items
  }
}

export default connect(mapStateToProps)(NewsSlider);