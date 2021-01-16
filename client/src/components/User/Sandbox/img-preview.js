import React from 'react';

 
class Sandbox extends React.Component {


    state = {
        file: null
    }

    handleChange(event) {
        this.setState({
            file: URL.createObjectURL(event.target.files[0])
        })
    }

    render() {

        


        return (
      

            <div>
                <input type="file" onChange={(e) => this.handleChange(e)}/>
                <img src={this.state.file}/>
            </div>
        )
    }
};
 
export default Sandbox;

