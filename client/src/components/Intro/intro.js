import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getIntroText } from '../../actions';


class Intro extends Component  {


    componentDidMount() {
        this.props.dispatch(getIntroText());
    }

    addDefaultImg = (ev) => {
        const newImg = '/images/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }


    render() {
        console.log(this.props);
        return (
            // <Link to="/categories">



                // <header id="showcase" class="grid">
                //     <div class="bg-image"></div>
                //     <div class="content-wrap">
                //     <h1>Welcome to Acme Web Solutions</h1>
                //     <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci eum error earum soluta voluptatum nisi
                //         laboriosam eos saepe asperiores dolorum.</p>
                //     <a href="#section-b" class="btn">Read More</a>
                //     </div>
                // </header>


                <div id="intro">
                    <div className="bg-image"></div>
                    <div className="content-wrap">
                        {this.props.text && this.props.text.title ?
                        <h1>{this.props.text.title}</h1>
                        : null }
                        {this.props.text && this.props.text.body ?
                        <p>{this.props.text.body}</p>
                        : null}
                        <a href="/categories" className="btn">Enter</a>
                    </div>
                    

                    
                        {/* <img src={`/images/intro/intro.jpg`} alt={"Item"} onError={addDefaultImg}/> */}
                
                </div>
            // </Link>
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