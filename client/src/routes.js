import React from 'react';
import { Switch, Route } from 'react-router-dom';


import Intro from './components/Public/Intro/intro';
import CatList from './components/Public/Categories/cats_list';
import CatView from './components/Public/Categories/cat_view';
import SubcatView from './components/Public/Categories/subcat_view';
import ItemView from './components/Public/Items/item_view';
import Search from './components/Public/Search';
import MainMap from './components/Public/MainMap';
import Info from './components/Public/Info/info';
import AddItem from './components/User/EditItem/add_item';
import Login from './components/Public/Login/login';

// CONTAINERS ETC.
import Home from './components/Public/Home/home'
import Layout from './components/HOCs/layout';
import AuthContainer from './components/HOCs/auth_container';
import Register from './components/User/UserAdmin/register';



// WHEN LOGGED IN
import Logout from './components/User/UserAdmin/logout';
import User from './components/User/UserAdmin';
import UserItems from './components/User/UserAdmin/user_items';
import AllItems from './components/User/UserAdmin/all_items';
import PendingItemsView from './components/Public/Items/pending_items_view';

import EditItem from './components/User/EditItem/edit_item';
import EditItemSel from './components/User/EditItem/edit_item_2_sel';
import EditItemFile from './components/User/EditItem/edit_item_3_file';
import ChapterIndex from './components/User/EditItem/chapter_index';

import Admin from './components/User/AdminSection';
import CatEdit from './components/User/EditItem/cat_edit';


const Routes = () => {
    return (
        <Layout>
            <Switch>
                <Route path="/" exact component={AuthContainer(Intro, null)}/>
                <Route path="/categories" exact component={AuthContainer(CatList, null)}/>
                <Route path="/category/:id" exact component={AuthContainer(CatView, null)}/>
                <Route path="/subcategory/:id" exact component={AuthContainer(SubcatView, null)}/>
                <Route path="/items/:id" exact component={AuthContainer(ItemView, null)}/>
                <Route path="/search" exact component={AuthContainer(Search, null)}/>
                <Route path="/map" exact component={AuthContainer(MainMap, null)}/>
                <Route path="/info" exact component={AuthContainer(Info, null)}/>
                <Route path="/add_item" exact component={AuthContainer(AddItem, null)}/>
                <Route path="/login" exact component={AuthContainer(Login, false)}/> {/* DOESN'T SHOW IF USER IS LOGGED IN */}

                {/* WHEN LOGGED IN */}

                <Route path="/user/logout" exact component={AuthContainer(Logout, true)}/>
                <Route path="/user" exact component={AuthContainer(User, true)}/>
                <Route path="/user/user_items" exact component={AuthContainer(UserItems, true)}/>
                <Route path="/user/all-items" exact component={AuthContainer(AllItems, true)}/>
                <Route path="/user/pending-items" exact component={AuthContainer(PendingItemsView, true)}/>

                <Route path="/user/edit-item/:id" exact component={AuthContainer(EditItem, true)}/>
                <Route path="/user/edit-item-sel/:id" exact component={AuthContainer(EditItemSel, null)}/>
                <Route path="/user/edit-item-file/:id" exact component={AuthContainer(EditItemFile, null)}/>
                <Route path="/user/chapter-index/:id" exact component={AuthContainer(ChapterIndex, true)}/>

                <Route path="/admin/:tab" exact component={AuthContainer(Admin, true)}/>
                <Route path="/cat-edit/:id" exact component={AuthContainer(CatEdit, true)}/> {/*STILL USED??*/}

                {/* DEPRECATED & MISC */}
                
                <Route path="/user/register" exact component={AuthContainer(Register, true)}/> 
                <Route path="/home" exact component={AuthContainer(Home, null)}/>
                
            </Switch>
        </Layout>
        
    );
};

export default Routes;