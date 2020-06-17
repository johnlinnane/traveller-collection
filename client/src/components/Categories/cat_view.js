import React, { Component } from 'react';
import { connect } from 'react-redux';

import { getItemsByCat, getCatById } from '../../actions';
import PanelView from '../PanelView/panel_view';
import NavigationBar from '../../widgetsUI/navigation';


class CatView  extends Component {
    

    componentDidMount() {
        let catId = this.props.match.params.id
        this.props.dispatch(getItemsByCat(catId));
        this.props.dispatch(getCatById(catId));
    }


    state = {
        info: []
    }

    
    navInfo = {
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    }

    componentWillReceiveProps(nextProps) {
        
        if (nextProps.catitems && nextProps.catitems.length) {
            let tempArray = []
            nextProps.catitems.map( (item, i) => (
                    tempArray.push(
                        {
                            // src: `/images/sq_thumb/${item.omeka.omeka_id}.jpg`,
                            src: `/images/items/${item._id}/sq_thumbnail/0.jpg`,
                            caption: item.title,
                            link: `/items/${item._id}` 
                        }
                    )
            ))
            if (tempArray.length) {
                this.setState({ info: [...tempArray]});
            }
        }
        if (this.props.catinfo && this.props.catinfo.length) {
            this.setState({
                navInfo: {
                    catTitle: this.props.catinfo[0].title,
                    catId: this.props.catinfo[0].cat_id
                }
            })
        }
    }

    getCatName = () => {
        if (this.props.catinfo && this.props.catinfo.length) {
            this.navInfo.catTitle = this.props.catinfo[0].title;
            this.navInfo.catId = this.props.catinfo[0].cat_id;
        }
    }



    render() {

        this.getCatName();

        // console.log(this.navInfo);

        let catinfo = this.props.catinfo;

        return (
            <div className="main_view">
                <div className="cat_view">
                    <NavigationBar navinfo={this.navInfo}/>
                    { catinfo && catinfo.length > 0? 
                        <h2 className="title">{catinfo[0].title}</h2>
                    :null
                    }

                    <PanelView info={this.state.info}></PanelView>

                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {
        catitems: state.cats.catitems,
        catinfo: state.cats.catinfo
        
    }
}


export default connect(mapStateToProps)(CatView)