import SideNav from './react_simple_sidenav';
import React from 'react';
import SidenavItems from './sidenav_items';

const Nav = (props: any): JSX.Element => {
    return (
        <SideNav
            showNav={props.showNav}
            onHideNav={props.onHideNav}
            navStyle={{
                background:'#242424',
                maxWidth:'220px'
            }}
        >
            <SidenavItems onHideNav={props.onHideNav}/>
        </SideNav>
    );
};

export default Nav;