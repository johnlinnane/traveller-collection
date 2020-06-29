import React from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

 
import { getAllColls, getAllCats, getAllSubCats  } from '../../actions';
import AdminCat from './admin_cat';


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


                    <TabPanel>
                        <p>
                            <b>Info Page</b> 
                        </p>
                        <input
                            type="text"
                            placeholder="Paragraph 1 Heading"
                            defaultValue={null} 
                            onChange={(event) => this.handleInput(event)}
                        />
                        <br />
                        <textarea
                            type="text"
                            placeholder="Paragraph 1 Content"
                            defaultValue={null} 
                            onChange={(event) => this.handleInput(event)}
                            rows={6}
                        />

                        <p>Paragraph 1 Image</p>

                        <input
                            type="text"
                            placeholder="Paragraph 2 Heading"
                            defaultValue={null} 
                            onChange={(event) => this.handleInput(event)}
                        />
                        <br />
                        <textarea
                            type="text"
                            placeholder="Paragraph 2 Content"
                            defaultValue={null} 
                            onChange={(event) => this.handleInput(event)}
                            rows={6}
                        />
                        <p>Paragraph 2 Image</p>
                      
                    </TabPanel>


                    <TabPanel>
                        <p>
                            <b>Intro Page</b> 
                        </p>

                        <textarea
                            type="text"
                            placeholder="Text"
                            defaultValue={null} 
                            onChange={(event) => this.handleInput(event)}
                            rows={6}
                        />

                        <p>Choose Image</p>
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



