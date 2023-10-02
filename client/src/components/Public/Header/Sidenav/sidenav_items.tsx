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
            icon:'file-text-o',
            text:'Edit My Items',
            link:'/user/user_items',
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
            link:'/add_item',
            restricted:false
        },
        {   type:'navItem',
            icon:'file-text-o',
            text:'Pending Items',
            link:'/user/pending-items',
            restricted:true
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
            text:'About',
            link:'/info',
            restricted:false
        },
        {   type:'navItem',
            icon:'fa fa-sign-in',
            text:'Login',
            link:'/login',
            restricted:false,
            exclude:true
        },
        {   type:'navItem',
            icon:'fa fa-sign-out',
            text:'Logout',
            link:'/user/logout',
            restricted:true
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
            user.login ?
                items.map((item, i) => {
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