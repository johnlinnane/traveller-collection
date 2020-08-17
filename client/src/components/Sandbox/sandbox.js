import React from 'react';

import axios from 'axios';

const fs = require('browserify-fs');
 
class Sandbox extends React.Component {


    

    render() {

        

        const send = () => {

            // let fileData =  {
            //     section: 'uploads',
            //     id: null,
            //     fileName: 'thumb'
            // };

            // axios.post(`http://localhost:3001/delete-file`, fileData  );

            let itemPath = {
                path: '/uploads/abc123def456'
            };

            axios.post(`http://localhost:3001/delete-dir`, itemPath  );

            
        }

        return (
      

            <div>
                <button type="button" onClick={() => send()}>Send</button>

            </div>
        )
    }
};
 
export default Sandbox;

