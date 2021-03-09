import React, { Component } from 'react';

import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';
import Nav from './Sidenav/sidenav';

class Header extends Component {

    state = {
        showNav:false
    }


    onHideNav = () => {
        this.setState({showNav:false})
    }

    render() {
        return (
            <header>
                <div className="open_nav">
                    <FontAwesome 
                        className="bars"
                        name="bars" 
                        onClick={() => this.setState({showNav:true})}
                    />
                </div>

                <Nav
                    showNav={this.state.showNav}
                    // trigger a function whenever button clicked
                    onHideNav={() => this.onHideNav()}
                    className="sidenav_menu"

                />
                <div className="search">
                    <Link to="/search">

                        <FontAwesome 
                            name="search" 
                            className="bars"
                            // onClick={() => this.setState({showNav:true})}
                         
                        />
                    </Link>
                </div>
                
                <Link to="/" className="logo">
                    Traveller Collection
                </Link>

                

                


                


               
            </header>
        );
    }
}

export default Header;