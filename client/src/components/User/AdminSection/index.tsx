import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useParams } from "react-router-dom";
 
import { getAllCats, getAllSubCats  } from '../../../../src/slices/catsSlice';
import AdminCat from './admin_cat';
import AdminSubCat from './admin_subcat';
import AdminIntro from './admin_intro';
import AdminInfo from './admin_info';
import AdminAddCat from './admin_add_cat';
import AdminAddSubCat from './admin_add_subcat';
import { AppDispatch } from '../../../../src/index';

const Admin = props => {

    const dispatch = useDispatch<AppDispatch>();

    const params = useParams();

    const [tabIndexTop, setTabIndexTop] = useState(0);
    const [tabIndexSide, setTabIndexSide] = useState(parseInt(params.tab));
    
    useEffect(() => {
        dispatch(getAllCats());
        dispatch(getAllSubCats());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const setTabIndex = (index) => {
        setTabIndexSide(index);
    }

    return (
        <div className="main_view admin_view">
            <Tabs selectedIndex={tabIndexTop} onSelect={tabIndexTop => setTabIndexTop(tabIndexTop)}>

                {/******** TOP TABS ***********/}
                <TabList>
                    <Tab>Categories</Tab>
                    <Tab>Sub-Categories</Tab>
                    <Tab>About Page</Tab>
                    <Tab>Intro Page</Tab>
                    {/* <Tab disabled>Extra</Tab> */}
                </TabList>

                {/******** CATEGORIES ***********/}
                <TabPanel>
                    <h2>Categories</h2> 

                    {/******** SIDE TABS ***********/}
                    <Tabs className="vert_tab" 
                        selectedIndex={tabIndexSide} 
                        onSelect={tabIndexSide => setTabIndexSide(tabIndexSide)}
                    >
                        {props.cats ?
                            <TabList className="vert_tab_list">
                                {props.cats.map( (cat, i) => (
                                    <Tab key={i}>{cat.title}</Tab>
                                ))}
                                <Tab  className="add_cat_tab">Add Category</Tab>
                            </TabList>
                        : null }


                        {/******** EACH SIDE TAB CONTENT ***********/}
                        { props.cats ?
                            props.cats.map( (cat, i) => (
                                <TabPanel key={i}>

                                    <AdminCat chosenCatInfo={cat} index={i} getTabIndex={setTabIndex}/>
                                </TabPanel>
                            ))
                        : null }
                        <TabPanel>
                            <AdminAddCat />
                        </TabPanel>
                    </Tabs>
                </TabPanel>

                {/******** SUB CATEGORIES ***********/}
                <TabPanel>
                    <h2>Sub-Categories</h2> 

                    {/******** SIDE TABS ***********/}
                    <Tabs className="vert_tab" 
                        selectedIndex={tabIndexSide} 
                        onSelect={tabIndexSide => setTabIndexSide(tabIndexSide)}
                    >
                        {props.subcats ?
                            <TabList className="vert_tab_list">
                                {props.subcats.map( (subcats, i) => (
                                    <Tab key={i}>{subcats.title}</Tab>
                                ))}
                                <Tab  className="add_cat_tab">Add Sub-Category</Tab>
                            </TabList>
                        : null }
                        { props.subcats ?
                            props.subcats.map( (subcat, i) => (
                                <TabPanel key={i}>

                                    <AdminSubCat chosenSubcatInfo={subcat} index={i} getTabIndex={setTabIndex}/>
                                </TabPanel>
                            ))
                        : null }
                        <TabPanel>
                            <AdminAddSubCat />
                        </TabPanel>
                    </Tabs>
                </TabPanel>

                {/******** INFO ***********/}
                <TabPanel>
                    <AdminInfo />
                </TabPanel>

                {/******** INTRO ***********/}
                <TabPanel>
                    <AdminIntro />
                </TabPanel>
            </Tabs>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        cats:state.cats.cats,
        subcats:state.cats.subcats
    }
}

export default connect(mapStateToProps)(Admin)