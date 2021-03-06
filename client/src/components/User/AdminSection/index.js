import React from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

 
import { getAllCats, getAllSubCats  } from '../../../actions';
import AdminCat from './admin_cat';
import AdminSubCat from './admin_subcat';
import AdminIntro from './admin_intro';
import AdminInfo from './admin_info';
import AdminAddCat from './admin_add_cat';
import AdminAddSubCat from './admin_add_subcat';


class Admin extends React.Component  {
    

    state = {
        tabIndexTop: 0,
        tabIndexSide: parseInt(this.props.match.params.tab)
   

    }

    componentDidMount() {
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
    }

   
    
    setTabIndex = (index) => {
        this.setState({
            tabIndexSide: index
        })
    }


    render() {


        return (
            <div className="main_view admin_view">
                <Tabs selectedIndex={this.state.tabIndexTop} onSelect={tabIndexTop => this.setState({ tabIndexTop })}>
                    

                    {/******** TOP TABS ***********/}

                    <TabList>
                        <Tab>Categories</Tab>
                        <Tab>Sub-Categories</Tab>
                        <Tab>Info Page</Tab>
                        <Tab>Intro Page</Tab>
                        {/* <Tab disabled>Extra</Tab> */}
                    </TabList>
                


                    {/******** CATEGORIES ***********/}

                    <TabPanel>
                        
                        <h2>Categories</h2> 
                        

                        {/******** SIDE TABS ***********/}

                        <Tabs className="vert_tab" 
                            selectedIndex={this.state.tabIndexSide} 
                            onSelect={tabIndexSide => this.setState({ tabIndexSide })}
                        >
                            {this.props.cats ?
                                <TabList className="vert_tab_list">
                                    {this.props.cats.map( (cat, i) => (
                                        <Tab key={i}>{cat.title}</Tab>
                                    ))}
                                    <Tab  className="add_cat_tab">Add Category</Tab>
                                </TabList>
                            : null }


                            {/******** EACH SIDE TAB CONTENT ***********/}
                            { this.props.cats ?
                                this.props.cats.map( (cat, i) => (
                                    <TabPanel key={i}>

                                        <AdminCat chosenCatInfo={cat} index={i} getTabIndex={this.setTabIndex}/>
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
                            selectedIndex={this.state.tabIndexSide} 
                            onSelect={tabIndexSide => this.setState({ tabIndexSide })}
                        >
                            {this.props.subcats ?
                                <TabList className="vert_tab_list">
                                    {this.props.subcats.map( (subcats, i) => (
                                        <Tab key={i}>{subcats.title}</Tab>
                                    ))}
                                    <Tab  className="add_cat_tab">Add Sub-Category</Tab>
                                </TabList>
                            : null }


                            { this.props.subcats ?
                                this.props.subcats.map( (subcat, i) => (
                                    <TabPanel key={i}>

                                        <AdminSubCat chosenSubCatInfo={subcat} index={i} getTabIndex={this.setTabIndex}/>
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
        
}
          

function mapStateToProps(state) {
    return {
        cats:state.cats.cats,
        subcats:state.cats.subcats
    }
}

export default connect(mapStateToProps)(Admin)



