import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getIntroText } from '../../../actions';

const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

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
                        <div 
                            className="bg-image" 
                            style={{
                                // position: 'absolute',
                                background: `url(${FS_PREFIX}/assets/media/intro/intro.jpg), #333`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover',
                                // width: '100%',
                                // // height: '600px',
                                // zIndex: '-1',
                                // opacity: '0.8',
                                // top: '0',
                                // bottom: '0'
                            }}
                        >
                        </div>


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
                    <div
                        style={{
                            padding: '.5rem',
                            fontSize: '.8rem',
                            background: '#aeddeb'
                        }}
                    >
                        This collection includes descriptionns and links to descriptions and representations of Travellers that may be factually inaccurate, offensive and otherwise inappropriate. Part of the work of compiling this collection involves adressing discrimatory legacies and we ask for your help in identifiying images or data that cause offence or harm, your feedback and suggestions are very welcome and can be sent to info@TravellerCollection.ie.
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