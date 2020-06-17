


import React, { Component } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


class Sandbox extends Component {



    state = {
        numPages: null,
        pageNumber: 1,
    }
 
    onDocumentLoadSuccess = ({ numPages }) => {
        this.setState({ numPages });
    }




    render() {
        const { pageNumber, numPages } = this.state;

 
    
        return (
            <div className="pdf">
                <div>
                    <Document className="pdf"
                        file="/images/items/5eb4417bf2ff151113f3e178/original/0.pdf"
                        onLoadSuccess={this.onDocumentLoadSuccess}
                        // onLoadError={this.setState({ pdfError: true })}
                        
                        
                    >
                    <Page pageNumber={pageNumber} 
                        // width={Math.min(width * 0.9, 400)} 
                        width={200} 
                    />
                    </Document>
                    
                </div>
            </div>
        );
    }
}


export default Sandbox;
