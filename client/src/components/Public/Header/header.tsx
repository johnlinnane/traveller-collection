import React, { useState } from 'react';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';
import Nav from './Sidenav/sidenav';

const Header: React.FC = () => {
    const [showNav, setShowNav] = useState<boolean>(false);

    return (
        <header>
            <div className="open_nav">
                <FontAwesome 
                    className="bars"
                    name="bars" 
                    onClick={() => setShowNav(true)}
                />
            </div>
            <Nav
                showNav={showNav}
                onHideNav={() => setShowNav(false)}
                className="sidenav_menu"

            />
            <div className="search">
                <Link to="/search">
                    <FontAwesome 
                        name="search" 
                        className="bars"
                    />
                </Link>
            </div>
            <Link to="/" className="logo">
                Traveller Collection
            </Link>
        </header>
    );
}

export default Header;