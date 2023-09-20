import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import SliderTemplates from './slider_templates'
import { getItems } from '../../../actions';


const SlickCarouselOldHomepage = props => {

    useEffect(() => {
        props.dispatch(getItems(4,0,'asc'));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <div>
            {props.items.list ?
                <SliderTemplates data={props.items} type={props.type} settings={props.settings}/>
            : null}
        </div>
    )
}

function mapStateToProps(state) {
  return {
      items:state.items
  }
}

export default connect(mapStateToProps)(SlickCarouselOldHomepage);