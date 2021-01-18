import React from 'react';
import { Link } from 'react-router-dom';


const NavigationBar = (props) => {

    return (
        <div className="nav_bar">

            <Link to={`/`}>
                <span>Home</span>
            </Link>

            {props.navinfo && props.navinfo.type === 'Categories' ?
                <Link to={`/categories`}>
                    <span>  /  {props.navinfo.type}</span>
                </Link>
            : null }



            {props.navinfo && props.navinfo.catTitle ?
                <Link to={`/category/${props.navinfo.catId}`}>
                    <span>  /  {props.navinfo.catTitle}</span>
                </Link>
            : null}

        
            {props.navinfo && props.navinfo.subCatTitle ?
                <Link to={`/subcategory/${props.navinfo.subCatId}`}>
                    <span>  /  {props.navinfo.subCatTitle}</span>
                </Link>
            : null} 
        

            {props.title ? 
                <span className="wrap">  /  {props.title}</span>
            : null}
            
        </div>
    );
};

export default NavigationBar;