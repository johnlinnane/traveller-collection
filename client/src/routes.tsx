import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { CompatRouter, CompatRoute } from "react-router-dom-v5-compat";


import Intro from './components/Public/Intro/intro';
import CatList from './components/Public/Categories/cats_list';
import CatView from './components/Public/Categories/cat_view';
import SubcatView from './components/Public/Categories/subcat_view';
import ItemView from './components/Public/Items/item_view';
import Search from './components/Public/Search';
import MainMap from './components/Public/MainMap';
import Info from './components/Public/Info/info';
import Login from './components/Public/Login/login';
import SligoMap from './components/Public/SligoMap';

// CONTAINERS ETC.
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


const URLRoutes = () => {
    return (
        <Layout>
            <CompatRouter>
                <Switch>
                    <CompatRoute path="/" exact component={AuthContainer(Intro, null)}/>
                    <CompatRoute path="/categories" exact component={AuthContainer(CatList, null)}/>
                    <CompatRoute path="/category/:id" exact component={AuthContainer(CatView, null)}/>
                    <CompatRoute path="/subcategory/:id" exact component={AuthContainer(SubcatView, null)}/>
                    <CompatRoute path="/items/:id" exact component={AuthContainer(ItemView, null)}/>
                    <CompatRoute path="/search" exact component={AuthContainer(Search, null)}/>
                    <CompatRoute path="/map" exact component={AuthContainer(MainMap, null)}/>
                    <CompatRoute path="/info" exact component={AuthContainer(Info, null)}/>
                    <CompatRoute path="/login" exact component={AuthContainer(Login, 'user')}/> {/* DOESN'T SHOW IF USER IS LOGGED IN */}

                    <CompatRoute path="/edit-item/:id" exact component={AuthContainer(EditItem, null)}/>
                    <CompatRoute path="/edit-item-sel/:id" exact component={AuthContainer(EditItemSel, null)}/>
                    <CompatRoute path="/edit-item-file/:id" exact component={AuthContainer(EditItemFile, null)}/>

                    <CompatRoute path="/sligo-map" exact component={AuthContainer(SligoMap, null)}/>

                    {/* WHEN LOGGED IN */}

                    <CompatRoute path="/user/logout" exact component={AuthContainer(Logout, 'login')}/>
                    <CompatRoute path="/user" exact component={AuthContainer(User, 'login')}/>
                    <CompatRoute path="/user/user_items" exact component={AuthContainer(UserItems, 'login')}/>
                    <CompatRoute path="/user/all-items" exact component={AuthContainer(AllItems, 'login')}/>
                    <CompatRoute path="/user/pending-items" exact component={AuthContainer(PendingItemsView, 'login')}/>

                    <CompatRoute path="/user/chapter-index/:id" exact component={AuthContainer(ChapterIndex, 'login')}/>

                    <CompatRoute path="/admin/:tab" exact component={AuthContainer(Admin, 'login')}/>
                    <CompatRoute path="/cat-edit/:id" exact component={AuthContainer(CatEdit, 'login')}/> {/*STILL USED??*/}

                    {/* DEPRECATED & MISC */}
                    
                    <CompatRoute path="/user/register" exact component={AuthContainer(Register, 'login')}/> 
                    
                </Switch>
            </CompatRouter>
        </Layout>
        
    );
};

export default URLRoutes;