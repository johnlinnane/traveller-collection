import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { getInfoText } from '../../actions';


class Info extends Component {
    
    componentDidMount() {
        this.props.dispatch(getInfoText());
    }

    

    renderInfo = () => {

        const text = this.props.text;
        const headings = [text.heading_1, text.heading_2, text.heading_3, text.heading_4]
        const paragraphs = [text.paragraph_1, text.paragraph_2, text.paragraph_3, text.paragraph_4]


           


        return (
            <div>
                { headings.map( (heading, i) =>(
                    <div key={i} className="info_section">
                        <div className="info_heading">
                            {heading ?
                                <h3>{heading}</h3>
                            : null}
                        </div>
                        <div className="img_and_para">
                            <div>
                                <img src={`/images/info/${i+1}.jpg`} 
                                    alt="Item" 
                                    onError={i => i.target.style.display='none'}/
                                >
                            </div>

                            {paragraphs[i] ?
                                <div className="para">
                                    {paragraphs[i]}
                                </div>
                            : null}
                        </div>

                        

                    </div>
                )) }
            </div>        
        )
    }

      


    

    
    render() {
        console.log(this.props)
        return (
            <div className="main_view">
                <div className="info_page">
                    {this.props.text ?
                        this.renderInfo()
                    
                    :null }
                </div>
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