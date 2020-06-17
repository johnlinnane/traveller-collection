import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';



import { getCollById, searchItem } from '../../actions';
// import { getCollWithItems } from '../../actions';
import NavigationBar from '../../widgetsUI/navigation';



class Collection  extends Component {


    navInfo = {
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        collTitle: null,
        collId: null,
        type: 'Collections'
    }


    componentDidMount() {
        let queryId = this.props.match.params.id;

        // let queryKey = this.props.match.params.key;
        // let queryValue = this.props.match.params.value;

        // console.log(queryId);

        this.props.dispatch(getCollById(queryId));
        this.props.dispatch(searchItem('collection_id', queryId))
        // this.props.dispatch(getCollWithItems(queryValue));

    }

    // setNav = (coll) => {
    //   console.log(coll);
    //     if ( coll && coll.length > 0) {
          
          
    //         this.setState({
    //             navInfo: {
    //                 collTitle: coll[0].title,
    //                 collId: coll[0].id
    //             }
    //         })
    //     }
    // }

    addDefaultImg = (ev) => {
        const newImg = '/images/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
    }


    renderColl = (coll) => {
        let imageId = null;

        if (coll && coll.length) {
          imageId = coll[0].cover_item;
        
        }
        return ( coll && coll.length ?
            <div>
                <h1>{coll[0].title}</h1> 
                <hr />
                {/* <img src={`/images/sq_thumb/${imageId}.jpg`}  alt={"Item"} /> */}

                {/* <img src={`/images/sq_thumb/1.jpg`}  alt={"Item"} /> */}
                <h2>Description</h2> {coll[0].description}
                <h2>Subject</h2> {coll[0].subject}
                <h2>Format</h2>{coll[0].format}
                <hr />
                <h1>Items</h1>
                <hr />
            </div>
            : null
        )

    }



    renderItems = (items) => (
        items ?
            items.map( (item, i) => (
              <Link to={`/items/${item._id}`}key={i}>
                <h2>{item.title}</h2> 
                <img src={`/images/items/${item._id}/sq_thumbnail/0.jpg`} alt={"Item"} onError={this.addDefaultImg}/>
                <h3>Creator</h3> {item.creator}
                <h3>Subject</h3> {item.subject}
                <h3>Description</h3> {item.description}
                <hr />
              </Link>

            ))
        : null

    )


    getCollName = () => {
        if (this.props.coll && this.props.coll.length) {
            this.navInfo.collTitle = this.props.coll[0].title;
            this.navInfo.collId = this.props.coll[0].id;
        }
    }




    render() {
        
        // console.log(this.props.coll);
        console.log(this.props);
        // this.setNav(this.state.coll);
        this.getCollName();

        
        return (
            
            <div className="main_view">
                  {/* { this.state.navInfo ? */}
                    <NavigationBar navinfo={this.navInfo}/>
                  {/* : null} */}
                  
                  {this.renderColl(this.props.coll)}
                  { this.props.items ?
                      this.renderItems(this.props.items)
                    : null
                  }
                  
              </div>
        )
    }
}


function mapStateToProps(state) {
    console.log(state);
    return {
        items: state.items.data,
        coll: state.collections.coll

    }
}


export default connect(mapStateToProps)(Collection)