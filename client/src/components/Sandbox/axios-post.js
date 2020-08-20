import React from 'react';

import axios from 'axios';

const fs = require('browserify-fs');
 
class Sandbox extends React.Component {


    

    render() {

        

        const send = () => {

            let data =  {
                data1: 'blah1',
                data2: 'blah2'
            };


            axios.post(`http://localhost:3001/sandbox`, data  )
                .then(res => {
                    console.log(res.data);
                })
                .catch(err => {
                    console.log(err);
                });

            
        }

        return (
      

            <div>
                <button type="button" onClick={() => send()}>Send</button>

            </div>
        )
    }
};
 
export default Sandbox;

