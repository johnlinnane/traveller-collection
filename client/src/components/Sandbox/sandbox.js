import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { getItemById} from '../../actions';

const config = require('../../config_client').get(process.env.NODE_ENV);


class Sandbox extends Component {


    state = {
        theFile: null
    }

    onChangeHandler = (event) => {
        event.preventDefault()
        this.setState({
            theFile: event.target.files
        })
    }

    onClickHandler = () => {

        let data = new FormData() 
        data.append('avatar', this.state.theFile[0]);
        data.append('someinfo', 'well hello there');


        // axios.post(`http://${config.IP_ADDRESS}:3001/fresh-multer-test`, data)
        
        //     .then(res => { // then print response status
        //         console.log(res);
        //         alert('File(s) uploaded successfully')
        //     })
        //     .catch(err => { 
        //         console.log(err)
        //         console.error('upload fail')
        //     })

        
        
        axios.post(`http://${config.IP_ADDRESS}:3001/basic-evaa`, data)
            .then(res => console.log(res))

    }

    render() {


        return (
            <div>
                <p>{this.state.fileName}</p>

                    <input 
                        type="file" 
                        onChange={(event) => {this.onChangeHandler(event)}}
                    />


                    <br/><br/>

                    
                    <button type="button" onClick={this.onClickHandler}>Save and Finish</button> 
              

            </div>
            
        )
    }
}

function mapStateToProps(state) {
    return {
        items:state.items,

    }
}

export default connect(mapStateToProps)(Sandbox)


