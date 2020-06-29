import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment-js';
import { Link } from 'react-router-dom';

// import { getUserPosts } from '../../actions';
import { getUserItems, getAllItems, getAllSubCats } from '../../actions';



class Sandbox extends Component {


    // componentWillMount() {
    componentDidMount() {
        this.props.dispatch(getUserItems(this.props.user.login.id))
        this.props.dispatch(getAllItems())
        
        this.props.dispatch(getAllSubCats())
    }

    showUserSubcats = (cats) => (
        cats.subcats && cats.subcats.length ?
            cats.subcats.map(subcat => (
                <span key={subcat._id}> 
									 

							{/* <span>cp ./sq_thumb/</span>
                            { item.omeka ?
								item.omeka.omeka_id
                            : null}
							<span>.jpg</span> */}
							

                            {`db.items.updateMany( { "subcategory_ref": ${subcat.subcat_id} }, { "$set": { "subcategory_ref.$": "${subcat._id}" } });`}



                            {/* { subcat.subcat_id ? 
                                subcat.subcat_id
                            : null}
                            
                            <span> - </span>
                            
                            { subcat._id ? 
                                subcat._id
                            : null} */}
                            
                            <br />							

                
							{/* <span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/0.jpg; </span><br />							
							<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_2.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/1.jpg; </span><br />
							<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_3.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/2.jpg; </span><br />
							<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_4.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/3.jpg; </span><br />
							<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_5.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/4.jpg; </span><br />
							<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_6.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/5.jpg; </span><br />
							<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_7.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/6.jpg; </span><br />
							<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_8.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/7.jpg; </span><br />
							<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_9.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/8.jpg; </span><br />
							<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_10.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/9.jpg; </span><br />
							<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_11.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/10.jpg; </span><br /><br /> */}


							{/* <span>;</span> */}
							{/* <br/> */}
                </span>
            ))
        : null
    )

    // showUserItems = (items) => (
    //     items.items ?
    //         items.items.map(item => (
    //             <span key={item._id}> 
									 

	// 						{/* <span>cp ./sq_thumb/</span>
    //                         { item.omeka ?
	// 							item.omeka.omeka_id
    //                         : null}
	// 						<span>.jpg</span> */}
							
    //                         { item.omeka ? item.omeka.omeka_id: null}<span> - </span>{ item.omeka ? item._id: null}<br />							

                
	// 						{/* <span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/0.jpg; </span><br />							
	// 						<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_2.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/1.jpg; </span><br />
	// 						<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_3.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/2.jpg; </span><br />
	// 						<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_4.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/3.jpg; </span><br />
	// 						<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_5.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/4.jpg; </span><br />
	// 						<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_6.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/5.jpg; </span><br />
	// 						<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_7.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/6.jpg; </span><br />
	// 						<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_8.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/7.jpg; </span><br />
	// 						<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_9.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/8.jpg; </span><br />
	// 						<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_10.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/9.jpg; </span><br />
	// 						<span>mv -v ./original/</span>{ item.omeka ? item.omeka.omeka_id: null}<span>_11.jpg ./items/</span>{ item.omeka ? item._id: null}<span>/original/10.jpg; </span><br /><br /> */}


	// 						{/* <span>;</span> */}
	// 						{/* <br/> */}
    //             </span>
    //         ))
    //     : null
    // )

    
    render() {
        console.log(this.props);

        let items = this.props.items;
        let cats = this.props.cats;

        return (
            <div className="user_posts">
               
                        {/* {this.showUserItems(items)} */}
                        {this.showUserSubcats(cats)}
                    
            </div>
        );
    }
}

function mapStateToProps(state) {

    console.log(state);
    return {
        user:state.user,
        items:state.items,
        cats:state.cats
    }
}


export default connect(mapStateToProps)(Sandbox)