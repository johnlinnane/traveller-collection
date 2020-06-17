import React, { Component } from 'react';
import { connect } from 'react-redux';

// import { getBookWithReviewer, clearBookWithReviewer } from '../../actions'; // OLD !
import { getItemWithContributor, clearItemWithContributor } from '../../actions';



class BookView extends Component {




    // componentWillMount() {
    componentDidMount() {
        this.props.dispatch(getItemWithContributor(this.props.match.params.id))
    }


    componentWillUnmount() {
        this.props.dispatch(clearItemWithContributor());
    }




    renderItem = (items) => {
        console.log(items);
        return ( items.item ?
            <div className="br_container">
                <div className="br_header">
                    <h2>{items.item.title}</h2>
                    <h5>{items.item.creator}</h5>
                    <div className="br_reviewer">
                        {/* <span>Reviewed by: </span>{items.reviewer.name} {items.reviewer.lastname} */}
                        <span>Reviewed by: </span>{items.contributor.name} {items.contributor.lastname}
                    </div>
                </div>

                <div className="br_review">
                    {items.item.description}
                </div>

                <div className="br_box">
                    
                    <div className="left">
                        <div>
                            <span>Pages:</span> {items.item.pages}
                        </div>
                        <div>
                            <span>ID:</span> {items.item.id}
                        </div>
                    </div>
                        
                    <div className="right">
                        <span>ID</span>
                        <div>{items.item.id}</div>
                    </div>
                </div>


            </div>
        : null
    )}


    render() {
        // console.log(this.props);
        console.log(this.props.match.params.id);


        let items = this.props.items;

        return (
            <div>
                {this.renderItem(items)}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        items: state.items
    }
}


export default connect(mapStateToProps)(BookView)