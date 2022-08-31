import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getInfoText } from '../../../actions';
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

const Info: React.FC = (props: any) => {

    useEffect(() => {
        props.dispatch(getInfoText());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function renderInfo() {
        return (
            <div className="info_page">
                {props.text && props.text.sections ?
                    props.text.sections.map( (section, i) => (
                        <div key={i} className="info_section">
                            { section.heading ?
                                <div className="info_heading">
                                    <h3>{section.heading}</h3>
                                </div>
                            : null}
                            <div className="img_and_para">
                                <img src={`${FS_PREFIX}/assets/media/info/${i+1}.jpg`} 
                                    alt="Item" 
                                    onError={i => i.target.style.display='none'}/
                                >

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
                {props.text.iconsCaption ?
                    renderIcons(props.text)
                : null }
            </div>
        )
    }

    function renderIcons(text) {
        return (
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
    }

    return (
        <div className="main_view">
            {props.text ?
                renderInfo()
            :null }
        </div>
    );
}

function mapStateToProps(state: any) {
    return {
        text: state.infos.text
    }
}

export default connect(mapStateToProps)(Info)