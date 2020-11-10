import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { getItemById} from '../../actions';

const config = require('../../config_client').get(process.env.NODE_ENV);


class Sandbox extends Component {


    state = {
        filesArray: [],
        selectedFilesImg: []
    }

    onChangeHandler = (event) => {
        event.preventDefault()


        let tempFilesArray = this.state.filesArray;
        tempFilesArray.push(event.target.files)


        let tempSelectedFilesImg = this.state.selectedFilesImg;
        tempSelectedFilesImg.push(URL.createObjectURL(event.target.files[0]));


        this.setState({
            filesArray: tempFilesArray,
            selectedFilesImg: tempSelectedFilesImg
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
        
        axios.post(`http://${config.IP_ADDRESS}:3001/basic-evaa`, data)
            .then(res => console.log(res))
            .catch(err => { 
                console.log(err)
                console.error('upload fail')
            })

    }

    render() {
        console.log(this.state.filesArray)

        return (
            <div>
                <p>{this.state.fileName}: Upload Fields Aaaaa Array Inspect</p>
                
                {this.state.filesArray.map( (file, i) => (
                    <div key={`input${i}`}>
                        <p>FILENAME: {file[0].name}</p>
                        <img className="sandbox_img" src={this.state.selectedFilesImg[i]} />
                        <br />
                    </div>
                ))}


                <input
                    type="file" 
                    onChange={(event) => {this.onChangeHandler(event)}}
                />
                

                

                <hr/><br/>

                
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


