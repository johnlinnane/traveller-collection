import React from 'react';
import PDFViewer from 'pdf-viewer-reactjs'

 
class Sandbox extends React.Component {


    value = null;

    render() {
        return (
            <PDFViewer
            document={{
                url: '/images/items/5eb4417bf2ff151113f3e178/original/0.pdf',
                
            }}
            scale={0.5}
            scaleStep={0.05}
        />
        )
    }
};
 
export default Sandbox;

