import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

// import { getUserPosts } from '../../../actions';
import { getUserItems, getAllItems } from '../../../actions';



class AllItems extends Component {


    componentDidMount() {
        this.props.dispatch(getUserItems(this.props.user.login.id))
        this.props.dispatch(getAllItems())

    }



    showUserItems = (items) => (
        items.items ?
            items.items.map(item => (
                <tr key={item._id}> 
                    <td>
                        <Link to={`/user/edit-item/${item._id}`}>
                            {item.title}
                        </Link>
                    </td>
                    <td>{item.creator}</td>
                </tr>
            ))
        : null
    )

    
    render() {
        // console.log(this.props);

        let items = this.props.items;

        return (
            <div className="user_posts">
                <h4>All Items</h4>

                <table className="item_list">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Creator</th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.showUserItems(items)}
                    </tbody>
                </table>
                
            </div>
        );
    }
}

function mapStateToProps(state) {

    console.log(state);
    return {
        user:state.user,
        items:state.items
    }
}


export default connect(mapStateToProps)(AllItems)