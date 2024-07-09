import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from './Sidenav/sidenav';

const Header: React.FC = () => {
    const [showNav, setShowNav] = useState<boolean>(false);

    return (
        <header>
            <div className="open_nav">
                <span 
                    className='headerIcon'
                    onClick={() => setShowNav(true)}
                >
                    <img src={'/assets/media/icons/svg/bars.svg'} />
                </span>
            </div>
            <Nav
                showNav={showNav}
                onHideNav={() => setShowNav(false)}
                className="sidenav_menu"

            />
            <div className="search">
                <Link to="/search">
                    <span 
                        className='headerIcon'
                    >
                        <img src={'/assets/media/icons/svg/search.svg'} />
                    </span> 
                </Link>                     
            </div>
            <Link to="/" className="logo">
                Traveller Collection
            </Link>
        </header>
    );
}

export default Header;