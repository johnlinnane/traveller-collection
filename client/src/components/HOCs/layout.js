import React from 'react';

import Header from '../Public/Header/header'


const Layout = (props) => {
    return (
        <section className="layoutjs_wrapper">
            <Header />
            {props.children}
        </section>
    );
};

export default Layout;