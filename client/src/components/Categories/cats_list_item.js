import React, { Component } from 'react';
import { connect } from 'react-redux';


import { getItemsByCat } from '../../actions';




// const CatItem = (props) =>  {
class CatItem extends Component {


    
    


    componentDidMount() {
        // this.props.dispatch(getItemsByCat(this.props.catInfo.cat_id));
        
        this.props.dispatch(getItemsByCat(this.props.catId))
        
        // this.props.dispatch(getItemsByCat(4));
        // console.log(this.props.catId);
        
        

    }

    addDefaultImg = (ev) => {
        const newImg = '/images/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    } 

    render() {

        

        // if (this.props.catItems) {
        //     console.log(this.props.catItems[0].title);
        // }
        console.log(this.props.cat);

        // const catItems = this.props.items;
        
        // console.log(this.props.items);
        // console.log(this.props.catId);

        let cat = this.props.cat

        return(
            <div className="cat_list">
                <div className="container">

                    <div className="img_back">
                        <img src={`/images/cover_img_cat/${cat.cat_id}.jpg`} alt="category cover" onError={this.addDefaultImg} />
                    </div>
                    <div class="centered"><h1>{cat.title}</h1></div>

                    
                </div>
            </div>


                // catItems ?
                
                //     catItems.map( (item, i) => (
                //         <div key={i}>
                //             {item.title}
                //             <br/>
                //         </div>
                //     ))
                // : null 
                
            


            // INSERT LINK HERE

            // <div className={`${news_item} ${item_grey}`}>
            //   <div>
            //   <h3>{this.props.catInfo.title}</h3>
            //   {/* <img src={`/images/sq_thumb/${props.item.cover_item}.jpg`} alt={"Item"}/> */}
              
            //   { this.props.items ?
                  
            //           this.props.items.map( (item, i) => (
            //           <div key={item._id}>
            //               <p>{item.title}</p>
            //           </div>
            //           ))
            //   : null }




              
            // </div>
        )
    }
   
}

function mapStateToProps(state) {
    // console.log(state);
    return {
        items: state.cats.catinfo
    }
}


// export default CatItem;
export default connect(mapStateToProps)(CatItem)