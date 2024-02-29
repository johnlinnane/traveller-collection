import React from 'react';
import { Link } from 'react-router-dom';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';

const SidenavItems: React.FC<any> = ( {user, onHideNav}: any) => {
    const items = [
        {   type:'navItem',
            icon:'home',
            text:'Home',
            link:'/',
            authOnly:false
        },
        {   type:'navItem',
            icon:'fa-solid fa-user',
            text:'My Profile',
            link:'/user',
            authOnly:true
        },
        {   type:'navItem',
            icon:'fa-solid fa-user-plus',
            text:'Add Admins',
            link:'/user/register',
            authOnly:true
        },
        {   type:'navItem',
            icon:'fa-solid fa-list-check',
            text:'List My Items',
            link:'/user/user_items',
            authOnly:true
        },
        {   type:'navItem',
            icon:'fa-solid fa-list',
            text:'List All Items',
            link:'/user/all-items',
            authOnly:true
        },
        {   type:'navItem',
            icon:'fa-solid fa-plus',
            text:'Add Item',
            link:'/edit-item/new',
            authOnly:false
        },
        {   type:'navItem',
            icon:'fa-regular fa-clock',
            text:'Pending Items',
            link:'/user/pending-items',
            authOnly:true
        },
        {   type:'navItem',
            icon:'fa-solid fa-eye',
            text:'Browse Categories',
            link:'/categories',
            authOnly:false
        },
        {   type:'navItem',
            icon:'fa-sharp fa-solid fa-location-dot',
            text:'Map',
            link:'/map',
            authOnly:false
        },
        {   type:'navItem',
            icon:'fa-solid fa-magnifying-glass',
            text:'Search',
            link:'/search',
            authOnly:false
        },
        {   type:'navItem',
            icon:'fa-solid fa-hammer',
            text:'Admin',
            link:'/admin/0',
            authOnly:true
        },
        {   type:'navItem',
            icon:'fa-solid fa-question',
            text:'About',
            link:'/info',
            authOnly:false
        },
        {   type:'navItem',
            icon:'fa fa-sign-in',
            text:'Login',
            link:'/login',
            authOnly:false,
            guestOnly:true
        },
        {   type:'navItem',
            icon:'fa fa-sign-out',
            text:'Logout',
            link:'/user/logout',
            authOnly:true
        }
    ]

    const element = (item, i) => (
        <div key={i} className={item.type} onClick={onHideNav}>
            <Link to={item.link}>
                <FontAwesome name={item.icon}/>
                {item.text}
            </Link>
        </div>
    )

    const showItems = () => {
        return(
            user?.login ?
                items.map((item, i) => {
                    if (user.login.isAuth) {
                        return !item.guestOnly ?
                            element(item, i)
                        : null
                    } else {
                        return !item.authOnly ?
                            element(item, i)
                        : null
                    }
                })
            : null
        )
    }

    return (
        <div>
            {showItems()}
        </div>
    );
};

function mapStateToProps(state: any) {
    return {
        user:state.user
    }
}

export default connect(mapStateToProps)(SidenavItems)