import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { getItemById} from '../../actions';

const config = require('../../config_client').get(process.env.NODE_ENV);


class Sandbox extends Component {


    state = {
        filesArray: []
    }

    onChangeHandler = (event) => {
        event.preventDefault()


        let tempFilesArray = this.state.filesArray;

        tempFilesArray.push(event.target.files)

        this.setState({
            filesArray: tempFilesArray
        })
    }

    onClickHandler = () => {

        let data = new FormData() 

        data.append('avatar', this.state.filesArray[0][0]);
        data.append('avatar2', this.state.filesArray[1][0]);
        data.append('someinfo', 'well hello there');

        
        for (var pair of data.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }
        
        // axios.post(`http://${config.IP_ADDRESS}:3001/basic-evaa`, data)
        //     .then(res => console.log(res))
        //     .catch(err => { 
        //         console.log(err)
        //         console.error('upload fail')
        //     })

    }

    render() {


        return (
            <div>
                <p>{this.state.fileName}: Upload Fields Aaaaa Array Inspect</p>
                    
                    <input 
                        type="file" 
                        onChange={(event) => {this.onChangeHandler(event)}}
                    />

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


