import React from 'react';
import Header from '../Public/Header/header'

export default function Layout(props) {
    return (
        <section className="layoutjs_wrapper">
            <Header />
            {props.children}
        </section>
    );
};