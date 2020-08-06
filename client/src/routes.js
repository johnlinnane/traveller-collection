import React from 'react';
import { Switch, Route } from 'react-router-dom';


import Home from './components/Home/home'
import Layout from './hoc/layout';
// import BookView from './components/Books';
import Login from './containers/Admin/login';
import User from './components/Admin';
import Auth from './hoc/auth';
// import AddReview from './components/Admin/add';
// import UserPosts from './components/Admin/userPosts';
// import EditReview from './containers/Admin/edit';
import Register from './containers/Admin/register';
import Logout from './components/Admin/logout';

import Search from './components/Search';
import CollList from './components/Collections/list';
import Collection from './components/Collections/collection';
import AddItem from './components/Admin/add_item';

import UserItems from './components/Admin/userItems';
import EditItem from './containers/Admin/edit_item';
import EditItemSel from './containers/Admin/edit_item_2_sel';
import EditItemFile from './containers/Admin/edit_item_3_file';
import ChapterIndex from './containers/Admin/chapter_index';

import ItemView from './components/Items/item_view';

import CatList from './components/Categories/cats_list';
import CatView from './components/Categories/cat_view';
import SubcatView from './components/Categories/subcat_view';

import AllItems from './components/Admin/all_items';
import Info from './components/Info/info';
import Intro from './components/Intro/intro';

import CatEdit from './containers/Admin/cat_edit';

import Admin from './components/AdminSection';


import MainMap from './components/MainMap';







import Sandbox from './components/Sandbox/sandbox';




const Routes = () => {
    return (
        <Layout>
            <Switch>
                <Route path="/" exact component={Auth(Intro, null)}/>
                <Route path="/home" exact component={Auth(Home, null)}/>
                <Route path="/login" exact component={Auth(Login, false)}/>
                <Route path="/user/logout" exact component={Auth(Logout, true)}/>
                <Route path="/user" exact component={Auth(User, true)}/>
                {/* <Route path="/user/add" exact component={Auth(AddReview, true)}/> */}
                <Route path="/user/add_item" exact component={Auth(AddItem, true)}/>
            

                <Route path="/user/register" exact component={Auth(Register, true)}/>
                {/* <Route path="/user/edit-post/:id" exact component={Auth(EditReview, true)}/> */}
                <Route path="/user/edit-item/:id" exact component={Auth(EditItem, true)}/>
                <Route path="/user/edit-item-sel/:id" exact component={Auth(EditItemSel, true)}/>
                <Route path="/user/edit-item-file/:id" exact component={Auth(EditItemFile, true)}/>

                {/* <Route path="/books/:id" exact component={Auth(BookView, null)}/>    */}
                <Route path="/items/:id" exact component={Auth(ItemView, null)}/>
                {/* <Route path="/user/user-reviews" exact component={Auth(UserPosts, true)}/> */}
                <Route path="/user/user-items" exact component={Auth(UserItems, true)}/>
                <Route path="/user/all-items" exact component={Auth(AllItems, true)}/>
                

                <Route path="/search" exact component={Auth(Search, true)}/>
                <Route path="/collections" exact component={Auth(CollList, true)}/>
                <Route path="/categories" exact component={Auth(CatList, true)}/>
                <Route path="/cat-edit/:id" exact component={Auth(CatEdit, true)}/>

                <Route path="/collection/:id" exact component={Auth(Collection, true)}/>
                <Route path="/category/:id" exact component={Auth(CatView, true)}/>
                <Route path="/subcategory/:id" exact component={Auth(SubcatView, true)}/>
                <Route path="/info" exact component={Auth(Info, true)}/>

                <Route path="/admin/:tab" exact component={Auth(Admin, true)}/>
                <Route path="/chapter-index/:id" exact component={Auth(ChapterIndex, true)}/>

                <Route path="/map" exact component={Auth(MainMap, true)}/>

                <Route path="/sandbox" exact component={Auth(Sandbox, true)}/>
                



            </Switch>
        </Layout>
        
    );
};

export default Routes;