import React from 'react';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

 
import { getAllColls, getAllCats, getAllSubCats  } from '../../actions';


class Admin extends React.Component  {
    
    componentDidMount() {
        this.props.dispatch(getAllColls())
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
    }
    
 


    render() {

        console.log(this.props)

        return (
            <div className="main_view admin_view">
                <Tabs>

                    <TabList>
                        <Tab>Categories</Tab>
                        <Tab>Info Page</Tab>
                        <Tab>Intro Page</Tab>
                        <Tab disabled>Toad</Tab>
                    </TabList>
                

                    <TabPanel>
                        
                        <h2>Categories</h2> 
                        



                        <Tabs className="vert_tab">
                            


                                { this.props.cats ?
                                    <TabList className="vert_tab_list">
                                        {this.props.cats.map( (cat, i) => (
                                            <Tab key={i}>{cat.title}</Tab>
                                        ))}
                                    </TabList>
                                : null }


                                { this.props.cats ?
                                    
                                        this.props.cats.map( (cat, i) => (
                                            <TabPanel key={i}>
                                                <h2>{cat.title}</h2>
                                                <img className="change_cat_img" src={`/images/cover_img_cat/${cat.cat_id}.jpg`} key={i} />
                                                <h3>Sub-categories</h3>
                                                { this.props.subcats ?
                                                    this.props.subcats.map( (subcat, i) => {
                                                        if (subcat.parent_cat == cat.cat_id) {
                                                            return <p key={i}>{subcat.title}</p>
                                                        }
                                                        
                                                    } )    
                                                : null }
                                            </TabPanel>

                                        ))
                                : null }




                        </Tabs>



                    

                       

                       

                    </TabPanel>


                    <TabPanel>
                        <p>
                            <b>Info Page</b> 
                        </p>

                        <p>Paragraph 1 Heading</p>
                        <p>Paragraph 1 Content</p>
                        <p>Paragraph 1 Image</p>

                        <p>Paragraph 2 Heading</p>
                        <p>Paragraph 2 Content</p>
                        <p>Paragraph 2 Image</p>
                      
                    </TabPanel>


                    <TabPanel>
                        <p>
                            <b>Intro Page</b> 
                        </p>

                        <p>Text</p>

                        <p>Choose Image</p>
                    </TabPanel>


                    <TabPanel>
                    <p>
                            <b>Toad</b> 
                        </p>
                    </TabPanel>


            

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



