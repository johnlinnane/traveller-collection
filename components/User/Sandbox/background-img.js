import React from 'react';
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card' 

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
      
        <Card style={{ width: '50%' }}>
            <Card.Img src="/media/sq_thumb/1.jpg" alt="Card image" />
            <Card.ImgOverlay>
                <Card.Title>Card title</Card.Title>
                <Card.Text>
                This is a wider card with supporting text below as a natural lead-in to
                additional content. This content is a little bit longer.
                </Card.Text>
                <Card.Text>Last updated 3 mins ago</Card.Text>
            </Card.ImgOverlay>
        </Card>
       
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


