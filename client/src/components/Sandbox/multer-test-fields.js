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

    fileInput = React.createRef();
    
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

    removeFile = (i) => {

        let tempFilesArray = this.state.filesArray;
        tempFilesArray.splice(i, 1)

        let tempSelectedFilesImg = this.state.selectedFilesImg;
        tempSelectedFilesImg.splice(i, 1)

        this.setState({
            filesArray: tempFilesArray,
            selectedFilesImg: tempSelectedFilesImg
        })
    }


    onClickHandler = () => {

        // let data = new FormData() 
        // let fields = []

        // data.append('someinfo', JSON.stringify(fields));
        // data.append('someinfo', 'bones');

        let dataArray = [];

        this.state.filesArray.forEach( (file, i) => {
            // data.append(`file_${i}`, file[0]);    
            // fields.push({name: `file_${i}`, maxCount: 1});

            dataArray.push(file[0])
        })

        let formArray = new FormData() 
        
        
        formArray.append('formarray', dataArray)
        console.log('DATAARRAY: ', dataArray )
        

        
        // for (var pair of data.entries()) {
        //     console.log(pair[0]+ ', ' + pair[1]); 
        // }
        
        axios.post(`http://${config.IP_ADDRESS}:3001/basic-evaa`, formArray)
            .then(res => console.log(res))
            .catch(err => { 
                console.log(err)
                console.error('upload fail')
            })

    }

    render() {
        console.log(this.state)

        return (
            <div>
                <p>{this.state.fileName}: Upload Fields Aaaaa Array Inspect</p>
                
                {this.state.filesArray.map( (file, i) => (
                    <div key={`input${i}`}>
                        <p>FILENAME: {file[0].name}</p>
                        <img className="sandbox_img" src={this.state.selectedFilesImg[i]} />
                        <button type="button" onClick={() => this.removeFile(i)}>Remove File</button> 
                        <br />
                    </div>
                ))}

                {this.state.filesArray.length == 0 ?
                <input
                    type="file" 
                    value=''
                    onChange={(event) => {this.onChangeHandler(event)}}
                />
                : 
                <input
                    type="file" 
                    onChange={(event) => {this.onChangeHandler(event)}}
                /> }
                

                

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


