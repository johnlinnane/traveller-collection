// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';



// import { getAllCats } from '../../../actions'; // from the old one

// // import SubcatViewItem from './subcat_view_item';



// import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
// import { getSubcat, getItemsBySubcat, getCatById } from '../../../actions';
// import { addItem } from '../../../actions';
// import NavigationBar from '../../widgetsUI/navigation';



// class SubcatView extends Component {


//     state = {
//         newItemId: null,
        
//         navInfo: {
//             catTitle: null,
//             catId: null,
//             subCatTitle: null,
//             subCatId: null,
//             type: 'Categories'
//         },
//         catDispatched: false,

//         initLat: 53.342609,
//         initLong: -7.603976,
//         initZoom: 8,
//         showMap: false
  
//     }


//     componentDidMount() {
//         // document.title = "Categories - Traveller Collection" // from the old one
//         // this.props.dispatch(getAllCats()); // from the old one

//         this.props.dispatch(getSubcat(this.props.match.params.id))
//         this.props.dispatch(getItemsBySubcat(this.props.match.params.id))

//     }
//     componentWillUnmount() {
//         document.title = `Traveller Collection`
//     }

//     addDefaultImg = (ev) => {
//         const newImg = '/assets/media/default/default.jpg';
//         if (ev.target.src !== newImg) {
//             ev.target.src = newImg
//         }  
//     }


//     // navInfo = {
//     //     catTitle: null,
//     //     catId: null,
//     //     subCatTitle: null,
//     //     subCatId: null,
//     //     type: 'Categories'
//     // }


//     componentDidUpdate(prevProps, prevState) {

        
//         if (prevProps !== this.props) {
//             if (this.props.subcat && !this.state.catDispatched) {
//                 document.title = `${this.props.subcat.title} - Traveller Collection`
//                 this.props.dispatch(getCatById(this.props.subcat.parent_cat))
//                 this.setState({
//                     catDispatched: true
//                 })
//             }

//             if (this.props.catinfo && this.props.subcat) {

//                 let tempNavInfo = {
//                     ...this.state.navInfo,
//                     catTitle: this.props.catinfo.title,
//                     catId: this.props.catinfo._id,
//                     subCatTitle: this.props.subcat.title,
//                     subCatId: this.props.subcat._id
//                 }

//                 this.setState({
//                     navInfo: tempNavInfo
//                 })
//             }
           
//             if (this.props.subcatitems !== prevProps.subcatitems) {
//                 if (this.props.subcatitems && this.props.subcatitems.length) {
//                     let hasMapCount = 0;
//                     this.props.subcatitems.forEach( (item, i) => {
//                         if (item.geo && item.geo.latitude && item.geo.longitude) {
//                             hasMapCount++;
//                         }
//                     } )
//                     if (hasMapCount) {
//                         this.setState({
//                             showMap: true
//                         })
//                     }
//                 }
//             }
//         }
//     }


//     componentWillUnmount() {
//         document.title = `Traveller Collection`
//     }


//     addClick = () => {

//         const tempNewItemId = mongoose.Types.ObjectId().toHexString()

//         this.setState({
//             newItemId: tempNewItemId
//         })
        

//         let item = {
//             _id: tempNewItemId,
//             subcategory_ref : [this.state.navInfo.subCatId],
//             category_ref: [this.state.navInfo.catId]
//         }
        
//         this.props.dispatch(addItem(item))
        
//         setTimeout(() => {
//             this.props.history.push(`/user/edit-item/${tempNewItemId}`)
//         }, 1000)

//     }






//     render() {
//         let cats = this.props.cats;

//         return (
//             <div className="subcat_view_wrapper">
//                 <NavigationBar navinfo={this.navInfo}/>
//                 {/* <div className="main_view"> */}
                    
//                     {/* <div className="cat_list"> */}
//                     <div className="main_view subcat_view_items_view">
//                         <h2 className="subcat_view_item_title">Categories</h2>

//                         { cats && cats.length ?
//                             cats.map( (cat, i) => (
//                                 cat.catIsHidden === false ?
//                                     null
//                                 : 
//                                 <Link key={cat._id} to={`/category/${cat._id}`}>
//                                     <SubcatViewItem cat={cat}/>
//                                 </Link>
//                             ))
//                         : null }
//                     </div>
//                 {/* </div> */}
//             </div>

            
//         );
//     }
// }

// function mapStateToProps(state) {
//     // console.log(state);
//     return {
//         // cats: state.cats.cats,
//         // items: state.cats.catitems
//         subcat: state.cats.subcat,
//         subcats: state.cats.subcats,
//         subcatitems: state.cats.subcatitems,
//         catinfo: state.cats.catinfo
//     }
// }


// export default connect(mapStateToProps)(SubcatView)