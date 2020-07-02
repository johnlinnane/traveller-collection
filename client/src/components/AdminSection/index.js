import React from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

 
import { getAllColls, getAllCats, getAllSubCats  } from '../../actions';
import AdminCat from './admin_cat';
import AdminIntro from './admin_intro';
import AdminInfo from './admin_info';


class Admin extends React.Component  {
    
    componentDidMount() {
        this.props.dispatch(getAllColls())
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
    }
    
    


    render() {

        // console.log(this.props)

        return (
            <div className="main_view admin_view">
                <Tabs >
                    

                    {/******** TOP TABS ***********/}

                    <TabList>
                        <Tab>Categories</Tab>
                        <Tab>Info Page</Tab>
                        <Tab>Intro Page</Tab>
                        {/* <Tab disabled>Extra</Tab> */}
                    </TabList>
                


                    {/******** CATEGORIES ***********/}

                    <TabPanel>
                        
                        <h2>Categories</h2> 
                        

                        {/******** SIDE TABS ***********/}

                        <Tabs  defaultIndex={0} className="vert_tab">
                            {this.props.cats ?
                                <TabList className="vert_tab_list">
                                    {this.props.cats.map( (cat, i) => (
                                        <Tab key={i}>{cat.title}</Tab>
                                    ))}
                                </TabList>
                            : null }


                            {/******** EACH SIDE TAB CONTENT ***********/}
                            { this.props.cats ?
                                this.props.cats.map( (cat, i) => (
                                    <TabPanel key={i}>

                                        <AdminCat chosenCatInfo={cat}/>
                                    </TabPanel>
                                ))
                            : null }

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


                    {/* <TabPanel>
                    <p>
                            <b>Toad</b> 
                        </p>
                    </TabPanel> */}


            

                </Tabs>
            </div>
        )
    }
        
}
          

function mapStateToProps(state) {
    return {
        colls:state.collections.colls,
        cats:state.cats.cats,
        subcats:state.cats.subcats
    }
}

export default connect(mapStateToProps)(Admin)



