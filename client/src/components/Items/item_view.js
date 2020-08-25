import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Slick from 'react-slick';   // uses cdn css
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import FontAwesome from 'react-fontawesome';

import { EmailShareButton, FacebookShareButton, WhatsappShareButton } from "react-share";
import { EmailIcon, FacebookIcon, WhatsappIcon } from "react-share";




import { Document, Page, pdfjs } from 'react-pdf';
// import PDFViewer from 'pdf-viewer-reactjs'




// import { getBookWithReviewer, clearBookWithReviewer } from '../../actions'; // OLD !
import { getItemWithContributor, clearItemWithContributor, getPendItemById, getAllCats, getAllSubCats, getNextItem, getPrevItem } from '../../actions';
import NavigationBar from '../../widgetsUI/navigation';
// import Image from '../../widgetsUI/Slider/slider';
import ItemImageSlider from '../../widgetsUI/Slider/item_img_slider';


const config = require('./../../config_client').get(process.env.NODE_ENV);

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;




class ItemView extends Component {

    state = {
        pdfError: false,
        numPages: null,
        setNumPages: null,
        pageNumber: 1,
        setPageNumber: 1,

        pdfPageNumber: 0,
        pdfScale: 1,

        showMap: false,
        mapZoom: 12,

        isPending: false
    }

    
    componentDidMount() {
        this.props.dispatch(getPendItemById(this.props.match.params.id));
        
        
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
        this.props.dispatch(getNextItem(this.props.match.params.id));
        this.props.dispatch(getPrevItem(this.props.match.params.id));
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props != prevProps) {
            if (this.props.items) {
                if (this.props.items.item ) {
                    document.title = `${this.props.items.item.title}`
                    if (this.props.items.item.ownerId && this.props.items.item.ownerId === 'guest'){
                        this.setState({
                            isPending: true
                        })
                    } 
                } else {
                    this.props.dispatch(getItemWithContributor(this.props.match.params.id));
                }
            } 
        }
    }

    

    componentWillUnmount() {
        this.props.dispatch(clearItemWithContributor());
        document.title = `Traveller Collection`
    }
    


    navInfo = {
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    }
  
    addDefaultImg = (ev) => {
        const newImg = '/media/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
        
    } 

    getCatName = (catId) => {
        if (this.props.cats && this.props.cats.length) {
            this.props.cats.map( cat => {
                
                if (cat._id === catId[0]) {
                    // console.log(cat.title);
                    this.navInfo.catTitle = cat.title;
                    this.navInfo.catId = cat._id;
                }
                return null;
            })
        }
    }

    getSubCatName = (subCatId) => {
        // console.log(subCatId);
        if (this.props.subcats && this.props.subcats.length) {
            this.props.subcats.map( subcat => {
                
                if (subcat._id == subCatId[0]) {
                    // console.log(cat.title);
                    this.navInfo.subCatTitle = subcat.title;
                    this.navInfo.subCatId = subcat._id;

                }
            })
        }
    }


    nextItem = () => {

    }

    goToIndex = (pageNum) => {
        this.setState({
            pageNumber: parseInt(pageNum)
        })

    }

    
    renderField = (text, ref) => {
        if (ref) {
            return (
                <div className="item_field link_blue">
                    <p><b>{text}</b></p>
                    
                    <span dangerouslySetInnerHTML={{__html:  ref}}></span>
                </div>
            )
        } 
    }



           

    renderSlider = (items) => {


        const settings = {
            dots: true,
            infinite: false,
            arrows: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            className: 'slick_slider'
            // variableWidth: true

            


            // ...props.settings
        }



        var divs = [];
        
        for (var i = 0; i < items.item.number_files; i++) {
            divs.push( 
                <div key={i} className={"featured_item"}> 
                    <div className={"featured_image"} 
                         style={{
                            background: `url(/media/items/${items.item._id}/original/${i}.jpg)`
                            // <img src={`/media/items/${items.item._id}/original/0.jpg`} alt="Item" onError={this.addDefaultImg}/>
                         }}
                    >
                    </div>
                </div>
            )
        }
        
        return <Slick {...settings}>{divs}</Slick>;


    }


    renderPDF = () => {
        // ************* PDF STUFF *************
        const { pageNumber, setPageNumber, numPages, setNumPages } = this.state;

        const onDocumentLoadSuccess = ({ numPages }) => {
            this.setState({ numPages });
            this.setState({ pageNumber: 1 });
        }
        
        const changePage = (offset) => {
            this.setState({ pageNumber: pageNumber + offset});
        }
        
        const previousPage = () => {
            changePage(-1);
        }
        
        const nextPage = () => {
            changePage(1);
        }


        const scaleDown = () => {
            this.setState({
                pdfScale: this.state.pdfScale - 0.2
            })
        }

        const scaleUp = () => {
            this.setState({
                pdfScale: this.state.pdfScale + 0.2
            })
        }

        const handlePageChange = (event) => {
            this.setState({
                pageNumber: parseInt(event.target.value)
            })
        }


        

        // ***************************************
        return (
            <div className="pdf_wrapper">
                <div className="pdf">
                    <Document
                        file={`/media/items/${this.props.match.params.id}/original/0.pdf`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        // onLoadError={this.setState({ pdfError: true })}
                        
                        
                    >   
                        <div className="pdf_page">
                            <Page 
                                className={"pdf_page"}
                                pageNumber={pageNumber}
                                // width={Math.min(width * 0.9, 400)} 
                                width={650} 
                                scale={this.state.pdfScale}
                            />
                        </div>
                    </Document>
                </div> 

                <div className="pdf_control_panel">
                    <div className="pdf_prev_next">
                        <button
                            type="button"
                            disabled={pageNumber <= 1}
                            onClick={previousPage}
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            disabled={pageNumber >= numPages}
                            onClick={nextPage}
                        >
                            Next
                        </button>
                    </div>



                    <FontAwesome 
                        className="fa-search-minus pdf_scale"
                        onClick={scaleDown}
                    />


                    <FontAwesome 
                        className="fa-search-plus pdf_scale"
                        onClick={scaleUp}
                    />
                    

                    <span className="item_pagenum">
                        Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                        
                    </span>

                    <a href="/media/items/5eb4417bf2ff151113f3e178/original/0.pdf">[pdf]</a>
                    
                </div>

                {/* <br /> */}
                {/* <input readOnly value={this.state.pdfPageNumber} onChange={(e) => {this.handlePageChange(e)}} ref={(input)=> this.myinput = input}/> */}

                { this.props.items.item.pdf_page_index && this.props.items.item.pdf_page_index.length ?
                    <div className="index_container">
                        <div className="index_table">
                            <div className="index_col index_top index_page">
                                Page
                            </div>
                            <div className="index_col index_top index_heading">
                                Heading
                            </div>
                            <div className="index_col index_top index_desc">
                                Description
                            </div>
                            {this.props.items.item.pdf_page_index.map( (chapt, i) => (
                                <div key={i} className="index_row" onClick={() => this.goToIndex(chapt.page)}>
                                    <div className="index_col index_page">
                                        {chapt.page}
                                    </div>
                                    <div className="index_col index_heading">
                                        {chapt.heading}
                                    </div>
                                    <div className="index_col index_desc">
                                        {chapt.description}
                                    </div>
                                </div>
                        
                        ))}
                        </div>
                    </div>
                : null }


                
            </div> 
        )
    }


    renderItem = (items) => {


        
        // console.log(this.props.user)


        // console.log(items);
        return ( items.item ?

            <div>
                {/* <ItemImageSlider /> */}

                

                <div className="item_container">
                    

                    <div className="item_header">

                        <h1>{items.item.title}</h1>


                        {items.item.file_format == 'mp4' ?
                            
                                <video className="video" controls name="media">
                                    <source src={`/media/items/${items.item._id}/original/0.mp4`} type="video/mp4"/>
                                </video>
                        : null }

                   

                        {items.item.file_format === 'pdf' ?
                            this.renderPDF()
                        : null }

                        
                        



                        { items.item && items.item._id  && items.item.file_format !== 'mp4' && items.item.file_format !== 'pdf' ?
                            <div>
                                { items.item.number_files == null || items.item.number_files < 2 ?
                                    <div className="item_img">
                                        <img src={`/media/items/${items.item._id}/original/0.jpg`} 
                                        className="item_main_img"
                                        alt="Item" 
                                        onError={i => i.target.style.display='none'}/>
                                    </div>
                                : null }
                            </div>
                        : null}

                        { items.item && items.item.number_files > 1 && items.item.file_format !== 'mp4' && items.item.file_format !== 'pdf' ?
                            this.renderSlider(items)
                        : null}


                        <br />

                        
                        {items.item.creator ?
                            <div className="item_field item_creator item_review"><p><b>Creator </b></p><h5>{items.item.creator}</h5></div>
                        : null }



                        {/* <div className="item_field link_blue">
                            <p><b>{text}</b></p>
                            
                            <span dangerouslySetInnerHTML={{__html:  ref}}></span>
                        </div> */}
                        
                        <div className="item_reviewer ">
                            <span className="item_field">
                                { items.contributor && items.contributor.name && items.contributor.lastname ?
                                    <span>Submitted by: {items.contributor.name} {items.contributor.lastname} - </span>
                                : null }

                                
                                {this.props.user.login.isAuth ?
                                    <Link to={`/user/edit-item/${this.props.match.params.id}`}>Edit</Link>
                                : null }
                            </span>
                        </div>
                    </div>


                    <div className="item_review item_body">

                        {this.renderField('Subject', items.item.subject)}
                        {this.renderField('Description', items.item.description)}
                        {this.renderField('Source', items.item.source)}
                        {this.renderField('Date Created', items.item.date_created)}
                        {this.renderField('Contributor', items.item.contributor)}
                        {this.renderField('Item Format', items.item.item_format)}
                        {this.renderField('Materials', items.item.materials)}
                        {this.renderField('Physical Dimensions', items.item.physical_dimensions)}
                        {this.renderField('Pages', items.item.pages)}
                        {this.renderField('Editor', items.item.editor)}
                        {this.renderField('Publisher', items.item.publisher)}
                        {this.renderField('Further Info', items.item.further_info)}
                        
                        

                        {items.item && items.item.geo ?
                            this.renderField('Address', items.item.geo.address)
                        : null }


                        {this.props.items && this.props.items.item.geo.latitude && this.props.items.item.geo.longitude ? 
                            <div>
                                <div className="item_map_heading" onClick={() => this.setState({showMap: !this.state.showMap})}>
                                    <p>
                                        <b>View on Map </b> 
                                        {this.state.showMap ?
                                            <i className="fa fa-angle-up"></i>
                                        : <i className="fa fa-angle-down"></i>}
                                    </p>
                                </div>
                                {this.state.showMap ?
                                    <Map 
                                        className="item_map"
                                        center={[this.props.items.item.geo.latitude, this.props.items.item.geo.longitude]} 
                                        zoom={this.state.mapZoom} 
                                        style={{ height: this.state.showMap ? '350px' : '0px'}}
                                    >
                                        <TileLayer
                                            attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />

                                        <Marker 
                                            position={[this.props.items.item.geo.latitude, this.props.items.item.geo.longitude]} 
                                            // key={incident['incident_number']} 
                                        >
                                            <Popup>
                                                <span><b>{this.props.items.item.title}</b></span>
                                                <br/>
                                                <span>{this.props.items.item.geo.address}</span><br/>
                                                <br/>
                                                <span>{this.props.items.item.geo.latitude}, {this.props.items.item.geo.longitude}</span><br/>
                                            </Popup>
                                        </Marker>
                                    </Map>
                                : null }
                            </div>
                        : null}



                        

                        


                        
  
                    </div> 



                    


                    {items.item && items.item.external_link && items.item.external_link[0].url ?
                                <Link to={items.item.external_link[0].url}  target="_blank">
                                    <div className="link_wrapper">
                                        <div className="link_img">
                                            <img src='/media/icons/ext_link.png' className="ext_link"/>
                                        </div>

                                        <div className="link_text">
                                            {items.item.external_link[0].text}
                                        </div>
                                    </div>
                                </Link>
                    : null }



                    {items.item.shareDisabled ?
                        null
                        :               
                        <div className="shareIcons">
                            <FacebookShareButton
                                url={`http://${config.IP_ADDRESS}:3000/items/${this.props.items.item._id}`}
                                className="shareIcon"
                                quote={this.props.items.item.title}
                                >
                                <FacebookIcon logoFillColor="white" size={32} round={true}/>
                            </FacebookShareButton>


                            <WhatsappShareButton
                                url={`http://${config.IP_ADDRESS}:3000/items/${this.props.items.item._id}`}
                                className="shareIcon"
                                title={this.props.items.item.title}
                                >
                                <WhatsappIcon logoFillColor="white" size={32} round={true}/>
                            </WhatsappShareButton>

                            <EmailShareButton
                                url={`http://${config.IP_ADDRESS}:3000/items/${this.props.items.item._id}`}
                                className="shareIcon"
                                subject={this.props.items.item.title}
                                >
                                <EmailIcon logoFillColor="white" size={32} round={true}/>
                            </EmailShareButton>
                        </div>
                    }




                    {!this.state.isPending ?
                        <div className="item_box">
                            <div className="left">
                                {this.props.previtem ?
                                    <Link to={`/items/${this.props.previtem._id}`}>
                                        <div>
                                            <span className="white_txt">Previous Item</span>
                                        </div>
                                        <div className="no_overflow">
                                            <span>{this.props.previtem.title}</span>
                                        </div>
                                    </Link>
                                : null }
                            </div>



                            
                            <div className="right">
                                {this.props.nextitem ?
                                    <Link to={`/items/${this.props.nextitem._id}`}>
                                        <div>
                                            <span className="white_txt">Next Item</span>
                                        </div>
                                        <div>
                                            <span>{this.props.nextitem.title}</span>
                                        </div>
                                    </Link>
                                : null }
                            </div>

                        </div> 
                    : null }


                </div> 
            </div> 
        : null )
    }


    render() {

        // console.log(this.state.pageNumber);
        console.log(this.state)


        let items = this.props.items;
        console.log(items.item);

        if (items.item && items.item.category_ref ) {
            {this.getCatName(items.item.category_ref)}
        }

        if (items.item && items.item.subcategory_ref ) {
            // console.log(items.item);
            {this.getSubCatName(items.item.subcategory_ref)}
        }

        return (
            
            <div>
                { this.navInfo.catTitle  ?
                    <NavigationBar navinfo={this.navInfo} title={items.item.title}/>    
                : null }

                <div className="main_view">
                    {this.renderItem(items)}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        items: state.items,
        cats: state.cats.cats,
        subcats: state.cats.subcats,
        nextitem: state.items.nextitem,
        previtem: state.items.previtem

    }
}


export default connect(mapStateToProps)(ItemView)