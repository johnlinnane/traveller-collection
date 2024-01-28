import React from 'react';
import { Routes, Route } from 'react-router-dom';

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
            {/* <CompatRouter> */}
                <Routes>
                    <Route path="/" element={<AuthContainer Component={Intro} redirectTo={null} />} />
                    <Route path="/categories" element={<AuthContainer Component={CatList} redirectTo={null} />} />

                    <Route path="/category/:id" element={<AuthContainer Component={CatView} redirectTo={null} />} />
                    <Route path="/subcategory/:id" element={<AuthContainer Component={SubcatView} redirectTo={null} />} />
                    <Route path="/items/:id" element={<AuthContainer Component={ItemView} redirectTo={null} />} />
                    <Route path="/search" element={<AuthContainer Component={Search} redirectTo={null} />} />
                    <Route path="/map" element={<AuthContainer Component={MainMap} redirectTo={null} />} />
                    <Route path="/info" element={<AuthContainer Component={Info} redirectTo={null} />} />
                    <Route path="/login" element={<AuthContainer Component={Login} redirectTo={'user'} />} /> 
                    {/* DOESN'T SHOW IF USER IS LOGGED IN */}

                    <Route path="/edit-item/:id" element={<AuthContainer Component={EditItem} redirectTo={null} />} />
                    <Route path="/edit-item-sel/:id" element={<AuthContainer Component={EditItemSel} redirectTo={null} />} />
                    <Route path="/edit-item-file/:id" element={<AuthContainer Component={EditItemFile} redirectTo={null} />} />

                    <Route path="/sligo-map" element={<AuthContainer Component={SligoMap} redirectTo={null} />} />

                    {/* WHEN LOGGED IN */}

                    <Route path="/user/logout" element={<AuthContainer Component={Logout} redirectTo={'login'} />} />
                    <Route path="/user" element={<AuthContainer Component={User} redirectTo={'login'} />} />
                    <Route path="/user/user_items" element={<AuthContainer Component={UserItems} redirectTo={'login'} />} />
                    <Route path="/user/all-items" element={<AuthContainer Component={AllItems} redirectTo={'login'} />} />
                    <Route path="/user/pending-items" element={<AuthContainer Component={PendingItemsView} redirectTo={'login'} />} />

                    <Route path="/user/chapter-index/:id" element={<AuthContainer Component={ChapterIndex} redirectTo={'login'} />} />

                    <Route path="/admin/:tab" element={<AuthContainer Component={Admin} redirectTo={'login'} />} />
                    <Route path="/cat-edit/:id" element={<AuthContainer Component={CatEdit} redirectTo={'login'} />} /> 
                    {/*STILL USED??*/}

                    {/* DEPRECATED & MISC */}
                    
                    <Route path="/user/register" element={<AuthContainer Component={Register} redirectTo={'login'} />} /> 
                    
                </Routes>
            {/* </CompatRouter> */}
        </Layout>
        
    );
};

export default URLRoutes;