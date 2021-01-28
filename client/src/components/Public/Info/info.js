import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getInfoText } from '../../../actions';

const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

class Info extends Component {

    componentDidMount() {
        this.props.dispatch(getInfoText());
    }

    

    renderInfo = () => {

        const text = this.props.text;



        return (

            <div className="info_page">
                {text && text.sections ?
                    text.sections.map( (section, i) => (
                        <div key={i} className="info_section">
                            { section.heading ?
                                <div className="info_heading">
                                    <h3>{section.heading}</h3>
                                </div>
                            : null}

                            <div className="img_and_para">
                                {/* <div> */}
                                    <img src={`${FS_PREFIX}/assets/media/info/${i+1}.jpg`} 
                                        alt="Item" 
                                        onError={i => i.target.style.display='none'}/
                                    >
                                {/* </div> */}

                                    { section.paragraph ?
                                        <div className="para">
                                            {section.paragraph}
                                        </div>
                                    : null }
                                
                            </div>
                        </div>
                    ) )
                : null }
                
                <hr />

                {text.iconsCaption ?
                    this.renderIcons(text)
                : null }

            </div>

        )
    }

    renderIcons = (text) => (
        <div className="info_icons">
            <div className="info_heading">
                <h3>{text.iconsCaption}</h3>
            </div>
            
            <img src={`${FS_PREFIX}/assets/media/info/icons.jpg`} 
                className="info_icons_img"
                alt="Item" 
                onError={i => i.target.style.display='none'}/
            >
        </div>
    )

      


    

    
    render() {
        console.log(this.props)
        return (
            <div className="main_view">
                
                    {this.props.text ?
                        this.renderInfo()
                        
                    :null }
                   

                    

                
            </div>
        );
    }
}


function mapStateToProps(state) {
    // console.log(state);

    return {
        text: state.infos.text
        
    }
}


export default connect(mapStateToProps)(Info)