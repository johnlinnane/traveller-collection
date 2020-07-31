import React, { Component } from 'react';

const fs = require('fs')

class Sandbox extends Component {


  deleteFile = () => {
    

    const path = './file.txt'
    
    try {
      
      // fs.unlinkSync(path)
      fs.readFile(path)
      //file removed
    } catch(err) {
      console.error(err)
    }

  }



  render() {
    return (
      <div>
          <button type="button" onClick={this.deleteFile}>Delete File</button>

      </div>
    );
  }
}

export default Sandbox;