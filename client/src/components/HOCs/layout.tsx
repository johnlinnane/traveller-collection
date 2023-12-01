import React, { ReactNode } from 'react';
import Header from '../Public/Header/header'

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = (props) => {
    return (
        <section className="layoutjs_wrapper">
            <Header />
            {props.children}
        </section>
    );
};

export default Layout;