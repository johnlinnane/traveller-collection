import React, { Component } from 'react';
import { connect } from 'react-redux';


import { getItemsByCat } from '../../actions';




class CatItem extends Component {

    componentDidMount() {
        this.props.dispatch(getItemsByCat(this.props.catId))
    }

    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    } 

    render() {

        console.log(this.props.cat);

        let cat = this.props.cat

        return(
            <div className="cat_list">
                <div className="container">

                    <div className="img_back">
                        <img src={`/media/cover_img_cat/${cat._id}.jpg`} alt="category cover" className="cat_list_img" onError={this.addDefaultImg} />
                    </div>
                    <div className="centered"><h1>{cat.title}</h1></div>

                    
                </div>
            </div>

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