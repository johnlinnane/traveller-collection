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
import Auth from './components/HOCs/auth';
import Register from './components/User/UserAdmin/register';



// WHEN LOGGED IN
import Logout from './components/User/UserAdmin/logout';
import User from './components/User/UserAdmin';
import UserItems from './components/User/UserAdmin/userItems';
import AllItems from './components/User/UserAdmin/all_items';
import PendingItemsView from './components/Public/Items/pending_items_view';

import EditItem from './components/User/EditItem/edit_item';
import EditItemSel from './components/User/EditItem/edit_item_2_sel';
import EditItemFile from './components/User/EditItem/edit_item_3_file';
import ChapterIndex from './components/User/EditItem/chapter_index';

import Admin from './components/User/AdminSection';
import CatEdit from './components/User/EditItem/cat_edit';


// DEPRECATED & MISC
import Sandbox from './components/User/Sandbox/sandbox';












const Routes = () => {
    return (
        <Layout>
            <Switch>
                <Route path="/" exact component={Auth(Intro, null)}/>
                <Route path="/categories" exact component={Auth(CatList, null)}/>
                <Route path="/category/:id" exact component={Auth(CatView, null)}/>
                <Route path="/subcategory/:id" exact component={Auth(SubcatView, null)}/>
                <Route path="/items/:id" exact component={Auth(ItemView, null)}/>
                <Route path="/search" exact component={Auth(Search, null)}/>
                <Route path="/map" exact component={Auth(MainMap, null)}/>
                <Route path="/info" exact component={Auth(Info, null)}/>
                <Route path="/add_item" exact component={Auth(AddItem, null)}/>
                <Route path="/login" exact component={Auth(Login, false)}/> {/* NEVER SHOW IF USER IS LOGGED IN */}

                {/* WHEN LOGGED IN */}

                <Route path="/user/logout" exact component={Auth(Logout, true)}/>
                <Route path="/user" exact component={Auth(User, true)}/>
                <Route path="/user/user-items" exact component={Auth(UserItems, true)}/>
                <Route path="/user/all-items" exact component={Auth(AllItems, true)}/>
                <Route path="/user/pending-items" exact component={Auth(PendingItemsView, true)}/>

                <Route path="/user/edit-item/:id" exact component={Auth(EditItem, true)}/>
                <Route path="/user/edit-item-sel/:id" exact component={Auth(EditItemSel, null)}/>
                <Route path="/user/edit-item-file/:id" exact component={Auth(EditItemFile, null)}/>
                <Route path="/user/chapter-index/:id" exact component={Auth(ChapterIndex, true)}/>

                <Route path="/admin/:tab" exact component={Auth(Admin, true)}/>
                <Route path="/cat-edit/:id" exact component={Auth(CatEdit, true)}/> {/*STILL USED??*/}

                {/* DEPRECATED & MISC */}
                
                <Route path="/user/register" exact component={Auth(Register, true)}/> 
                <Route path="/home" exact component={Auth(Home, null)}/>
                <Route path="/sandbox" exact component={Auth(Sandbox, true)}/>
                
            </Switch>
        </Layout>
        
    );
};

export default Routes;