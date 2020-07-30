import React from 'react';
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card' 
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button'

const Sandbox = (props) => {
    
    // var style = {
    //     width: "50%",
    //     height: "50%"
    // };

    // var background = {
    //     backgroundSize : 'cover',
    //     width: '100%'};

    // var textStyle = {
    //     position: 'absolute', 
    //     top: '20px', 
    //     left: '10px',
    //     width: '50%',
    //     height: "50%",
    //     overflow: 'hidden'
    // };

    return(
      
        <Accordion defaultActiveKey="0">
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="0">
              Click me!
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="0">
            <Card.Body>Hello! I'm the body</Card.Body>
          </Accordion.Collapse>
        </Card>
        <Card>
          <Card.Header>
            <Accordion.Toggle as={Button} variant="link" eventKey="1">
              Click me!
            </Accordion.Toggle>
          </Card.Header>
          <Accordion.Collapse eventKey="1">
            <Card.Body>Hello! I'm another body</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
       
        // ***********

        // <div style={style}>
        //     <Image 
        //         style={background} responsive fluid
        //         src="/media/sq_thumb/1.jpg">
        //     </Image>
       
        //     <h1 style={textStyle}>Text over imageText over imageText over imageText over imageText over imageText over imageText over imageText over image</h1>
        // </div>
      
        // ***********

        // <div className="coll_list_item">
            

        //     {/* <img src={`/media/sq_thumb/1.jpg`} /> */}

        //     <div className="overlay" style={{backgroundImage: "url('/media/sq_thumb/1.jpg')"}}>
        //         <span>Here is some title text</span>
        //     </div>


            

        //     <div className="description">
        //         A brief description A brief description A brief description A brief description 
        //     </div>
            
        // </div>
    )
}

export default Sandbox;


