import SideNav from 'react-simple-sidenav';
import React from 'react';
import SidenavItems from './sidenav_items';

const Nav: React.FC = (props: any) => {
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