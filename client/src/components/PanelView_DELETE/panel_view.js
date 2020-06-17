import React from "react";
import StackGrid, { transitions, easings } from "react-stack-grid";
import { Link } from 'react-router-dom';


// const image_list = [
// 	{
// 		src: "/images/sq_thumb/1.jpg",
// 		caption: "Old man",
// 	},
// 	{
// 		src: "/images/sq_thumb/2.jpg",
// 		caption: "Old book",
// 	},
// 	{
// 		src: "/images/sq_thumb/3.jpg",
// 		caption: "Roma Banner",
//     },
//     {
// 		src: "/images/sq_thumb/11.jpg",
// 		caption: "OldV man",
// 	},
// 	{
// 		src: "/images/sq_thumb/12.jpg",
// 		caption: "OlCd book",
// 	},
// 	{
// 		src: "/images/sq_thumb/13.jpg",
// 		caption: "RomCa Banner",
// 	}
// ];

const transition = transitions.scaleDown;



class PanelView extends React.Component {

	addDefaultImg = (ev) => {
		const newImg = '/images/default/default.jpg';
		if (ev.target.src !== newImg) {
			ev.target.src = newImg
		}  
	} 

	render() {
        let image_list = this.props.info;
        
		return (
			<StackGrid
				monitorImagesLoaded={true}
				columnWidth={250}	
				duration={200}
				gutterWidth={10}
				gutterHeight={40}
				easing={easings.cubicOut}
				appearDelay={60}
				appear={transition.appear}
				appeared={transition.appeared}
				enter={transition.enter}
				entered={transition.entered}
				leaved={transition.leaved}
				

			>

                { image_list ?
                    image_list.map( (obj, i) => (
                        <div key={i}>
                            <Link to={obj.link}>
                                <figure key={obj.src}>
                                    <img src={process.env.PUBLIC_URL + obj.src} alt={obj.caption} className="img_panel" onError={this.addDefaultImg} />
                                    <figcaption>{obj.caption}</figcaption>
                                </figure>
                            </Link>
                        </div>
                    ))
                    : null
                }

			</StackGrid>
		);
	}
}


export default PanelView;