

import React from "react";
import StackGrid, { transitions, easings } from "react-stack-grid";

const image_list = [
	{
		src: "/images/sq_thumb/1.jpg",
		caption: "Old man",
	},
	{
		src: "/images/sq_thumb/2.jpg",
		caption: "Old book",
	},
	{
		src: "/images/sq_thumb/3.jpg",
		caption: "Roma Banner",
    },
    {
		src: "/images/sq_thumb/11.jpg",
		caption: "OldV man",
	},
	{
		src: "/images/sq_thumb/12.jpg",
		caption: "OlCd book",
	},
	{
		src: "/images/sq_thumb/13.jpg",
		caption: "RomCa Banner",
	}
];

const transition = transitions.scaleDown;

export default class Gallery extends React.Component {
	render() {
		return (
			<StackGrid
				monitorImagesLoaded={true}
				columnWidth={250}
				duration={600}
				gutterWidth={5}
				gutterHeight={5}
				easing={easings.cubicOut}
				appearDelay={60}
				appear={transition.appear}
				appeared={transition.appeared}
				enter={transition.enter}
				entered={transition.entered}
				leaved={transition.leaved}
			>
				{image_list.map(obj => (
					<figure key={obj.src}>
						<img src={process.env.PUBLIC_URL + obj.src} alt={obj.caption} />
						<figcaption>{obj.caption}</figcaption>
					</figure>
				))}
			</StackGrid>
		);
	}
}