import React from 'react';
import { Link } from 'react-router-dom';


const Intro = () => {

    const addDefaultImg = (ev) => {
        const newImg = '/images/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }

    return (
        // <Link to="/categories">



            // <header id="showcase" class="grid">
            //     <div class="bg-image"></div>
            //     <div class="content-wrap">
            //     <h1>Welcome to Acme Web Solutions</h1>
            //     <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Adipisci eum error earum soluta voluptatum nisi
            //         laboriosam eos saepe asperiores dolorum.</p>
            //     <a href="#section-b" class="btn">Read More</a>
            //     </div>
            // </header>


            <div id="intro">
                <div className="bg-image"></div>
                <div className="content-wrap">
                    <h1>Welcome to the Traveller Collection</h1>
                    <p>Traveller history and culture is a diverse and complex
                        subject, there is not one story to define Traveller
                        identity, but many.</p>
                    <a href="/categories" className="btn">Enter</a>
                </div>
                

                
                    {/* <img src={`/images/intro/intro.jpg`} alt={"Item"} onError={addDefaultImg}/> */}
            
            </div>
        // </Link>
    );
};

export default Intro;