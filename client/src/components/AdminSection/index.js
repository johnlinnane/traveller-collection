import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

 
class Admin extends React.Component  {
    
    
    
    render() {
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
                        <p>
                            <b>Categories</b> 
                        </p>

                        <p>Add/Remove Category</p>

                        <p>Choose Category Image</p>

                        <p>Add/Remove Sub-category</p>

                        <p>Choose Sub-category Image</p>

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
          

 
export default Admin;

