import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getIntroText } from '../../../actions';
import config from "../../../config";
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const Intro: React.FC = (props: any) =>  {

    useEffect(() => {
        props.dispatch(getIntroText());
        document.title = config.defaultTitle;
        return () => {
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                    {props.text && props.text.title ?
                        <h1>{props.text.title}</h1>
                    : null }
                    {props.text && props.text.body ?
                        <p>{props.text.body}</p>
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
                This collection includes descriptions and links to descriptions and representations of Travellers that may be factually inaccurate, offensive and otherwise inappropriate. Part of the work of compiling this collection involves addressing discriminatory legacies and we ask for your help in identifying images or data that cause offence or harm, your feedback and suggestions are very welcome and can be sent to info@TravellerCollection.ie. 
            </div>
        </div>
    );
};

function mapStateToProps(state: any) {
    return {
        text: state.intros.text
    }
}
    
export default connect(mapStateToProps)(Intro);