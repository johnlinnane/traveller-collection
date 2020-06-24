import React, { Component } from 'react';
import { connect } from 'react-redux';


import { getItemsByCat } from '../../actions';




class CatItem extends Component {

    componentDidMount() {
        this.props.dispatch(getItemsByCat(this.props.catId))
    }

    addDefaultImg = (ev) => {
        const newImg = '/images/default/default.jpg';
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
                        <img src={`/images/cover_img_cat/${cat.cat_id}.jpg`} alt="category cover" onError={this.addDefaultImg} />
                    </div>
                    <div class="centered"><h1>{cat.title}</h1></div>

                    
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