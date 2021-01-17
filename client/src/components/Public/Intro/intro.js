import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getIntroText } from '../../../actions';


class Intro extends Component  {


    componentDidMount() {
        this.props.dispatch(getIntroText());
        document.title = "Traveller Collection"
    }

    componentWillUnmount() {
        document.title = `Traveller Collection`
    }

    addDefaultImg = (ev) => {
        const newImg = '/assets/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }


    render() {

        return (

                <div className="intro">
                    
                    <div id="intro-main">
                        <div className="bg-image"></div>
                        <div className="content-wrap">
                            {this.props.text && this.props.text.title ?
                            <h1>{this.props.text.title}</h1>
                            : null }
                            {this.props.text && this.props.text.body ?
                            <p>{this.props.text.body}</p>

                            

                            : null}
                            <Link to={'/categories'} className="btn">
                                Browse
                            </Link>
                            
                        </div>
                    </div>
                </div>
        );
    }
};


function mapStateToProps(state) {
    return {
        text: state.intros.text
    }
}
    
export default connect(mapStateToProps)(Intro)