import React, { Component } from 'react';
import { connect } from 'react-redux';

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
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }


    render() {
        console.log(process.env.NODE_ENV);
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
                            <a href="/categories" className="btn">Browse</a>
                            
                        </div>
                        

                        
                            {/* <img src={`/media/intro/intro.jpg`} alt={"Item"} onError={addDefaultImg}/> */}
                    
                    </div>
                    {/* <div className="intro-items">
                        <p>Hello</p>
                        </div> */}
                
                </div>
        );
    }
};


function mapStateToProps(state) {
    // console.log(state);

    return {
        text: state.intros.text
        
    }
}


export default connect(mapStateToProps)(Intro)