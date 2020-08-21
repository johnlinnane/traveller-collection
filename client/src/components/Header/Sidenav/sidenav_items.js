import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';


const SidenavItems = ({user}) => {

    const items = [
        {   type:'navItem',
            icon:'home',
            text:'Home',
            link:'/',
            restricted:false
        },
        {   type:'navItem',
            icon:'file-text-o',
            text:'My Profile',
            link:'/user',
            restricted:true
        },
        {   type:'navItem',
            icon:'file-text-o',
            text:'Add Admins',
            link:'/user/register',
            restricted:true
        },
        {   type:'navItem',
            icon:'fa fa-sign-in',
            text:'Login',
            link:'/login',
            restricted:false,
            exclude:true
        },
        {   type:'navItem',
            icon:'file-text-o',
            text:'Edit My Items',
            link:'/user/user-items',
            restricted:true
        },
        {   type:'navItem',
            icon:'file-text-o',
            text:'Edit All Items',
            link:'/user/all-items',
            restricted:true
        },
        {   type:'navItem',
            icon:'file-text-o',
            text:'Add Item',
            link:'/user/add_item',
            restricted:false
        },
        {   type:'navItem',
            icon:'file-text-o',
            text:'Pending Items',
            link:'/pending-items',
            restricted:true
        },
        {   type:'navItem',
            icon:'file-text-o',
            text:'Browse Collections',
            link:'/collections',
            restricted:false
        },
        {   type:'navItem',
            icon:'file-text-o',
            text:'Browse Categories',
            link:'/categories',
            restricted:false
        },
        {   type:'navItem',
            icon:'file-text-o',
            text:'Map',
            link:'/map',
            restricted:false
        },
        {   type:'navItem',
            icon:'file-text-o',
            text:'Search',
            link:'/search',
            restricted:false
        },
        {   type:'navItem',
            icon:'file-text-o',
            text:'Admin',
            link:'/admin/0',
            restricted:true
        },
        {   type:'navItem',
            icon:'file-text-o',
            text:'Info',
            link:'/info',
            restricted:false
        },
        {   type:'navItem',
            icon:'fa fa-sign-out',
            text:'Logout',
            link:'/user/logout',
            restricted:true
        }
    ]


    const element = (item, i) => (
        <div key={i} className={item.type}>
            <Link to={item.link}>
                <FontAwesome name={item.icon}/>
                {item.text}
            </Link>
        </div>
    )

    // the first time the component renders, it will not have the user info
    const showItems = () => (
        user.login ?
            items.map((item, i) => {
              
                //check if user is authenticated
                if (user.login.isAuth) {
                    return !item.exclude ?
                        element(item, i)
                    : null
                } else {
                    return !item.restricted ?
                        element(item, i)
                    : null
                }
            })
        : null
    )


    return (
        <div>
            {showItems()}
        </div>
    );
};




function mapStateToProps(state) {
    return {
        user:state.user
    }
}


export default connect(mapStateToProps)(SidenavItems)