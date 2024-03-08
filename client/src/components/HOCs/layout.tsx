import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';

import Header from '../Public/Header/header'

interface LayoutProps {
    children: ReactNode;
}


const Layout: React.FC<LayoutProps> = (props) => {
    
    let location = useLocation();

    let hideHeader = location.pathname.includes('sligo-map');

    return (
        <section className="layoutjs_wrapper">
            { !hideHeader && <Header /> }
            {props.children}
        </section>
    );
};

export default Layout;