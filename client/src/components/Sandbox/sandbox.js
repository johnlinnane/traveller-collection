import React, { Component } from 'react';
import { connect } from 'react-redux';


import { getItemById} from '../../actions';

const config = require('../../config_client').get(process.env.NODE_ENV);


class Sandbox extends Component {


    state = {
        fileName: 'myFile'
    }

    // componentDidMount() {
    //     this.props.dispatch(getItemById(this.props.match.params.id))
    // }


    render() {


        return (
            <div>
                <p>{this.state.fileName}</p>

                {/* <form action={`http://${config.IP_ADDRESS}:3001/fresh-multer-test/${this.state.fileName}`} method="post" encType="multipart/form-data"> */}
                <form action={`http://${config.IP_ADDRESS}:3001/fresh-multer-test`} method="post" encType="multipart/form-data">
                    <input type="file" name="avatar1" />

                    <input type="file" name="avatar2" />

                    <br/><br/>

                    <input type="submit" value="Submit" />
                </form>

              

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


