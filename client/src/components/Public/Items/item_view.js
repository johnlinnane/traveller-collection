import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Slick from 'react-slick';   // uses cdn css
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import FontAwesome from 'react-fontawesome';

import { EmailShareButton, FacebookShareButton, WhatsappShareButton } from "react-share";
import { EmailIcon, FacebookIcon, WhatsappIcon } from "react-share";

import { Document, Page, pdfjs } from 'react-pdf';

import { getItemWithContributor, clearItemWithContributor, getPendItemById, getAllCats, getAllSubCats, getNextItem, getPrevItem, getParentPdf, getFilesFolder } from '../../../actions';
import NavigationBar from '../../widgetsUI/navigation';

const config = require('./../../../config_client').get(process.env.NODE_ENV);

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;



class ItemView extends Component {

    state = {

        itemdata: {
            _id: this.props.match.params.id
        },

        pdfError: false,
        numPages: null,     // total number of pages??
        setNumPages: null,  // not used
        pageNumber: 1,      // page currently displayed
        setPageNumber: 1,   // not used

        pdfPageNumber: 0,   // not used
        pdfScale: 1,

        showMap: false,
        mapZoom: 12,

        isPending: false,

        getParentCalled: false,
        getItemWithCCalled: false,

        itemFiles: [],
        imgFiles: [],
        pdfFiles: [],
        vidFiles: []
    }

    
    componentDidMount() {
        if (!this.state.getItemWithCCalled) {
            this.props.dispatch(getItemWithContributor(this.props.match.params.id));
            this.setState({
                getItemWithCCalled: true
            })
        }
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
        this.props.dispatch(getNextItem(this.props.match.params.id));
        this.props.dispatch(getPrevItem(this.props.match.params.id));

        this.props.dispatch(getFilesFolder({folder: `/items/${this.props.match.params.id}/original`}))
    }




    componentDidUpdate(prevProps, prevState) {

        if (this.props.match.params.id !== prevProps.match.params.id && !this.state.stateCleared) {
            console.log('PARAM ID CHANGED **********************')
            this.setState({
                itemFiles: [],
                imgFiles: [],
                pdfFiles: [],
                vidFiles: [],
                stateCleared: true
            })
        }

        if (this.props !== prevProps) {
            if (this.props.items) {
                if (this.props.items.item ) {
                    const item = this.props.items.item;

                    if (prevProps.items.item !== item) {
                        this.setState({
                            itemdata: item
                        })
                    }

                    document.title = `${item.title}`

                    if (item.category_ref ) {
                        this.getCatName(item.category_ref)
                    }

                    if (item.subcategory_ref ) {
                        this.getSubCatName(item.subcategory_ref)
                    }

                    if (item.is_pdf_chapter && item.pdf_item_pages && item.pdf_item_pages.start) {
                    
                        if (!this.state.getParentCalled) {
                            this.props.dispatch(getParentPdf(item.pdf_item_parent_id))
                            this.props.dispatch(getFilesFolder({folder: `/items/${item.pdf_item_parent_id}/original`}))
                        }
    
                        this.setState({
                            pageNumber: parseInt(item.pdf_item_pages.start),
                            getParentCalled: true
                        })
                    }

                    
                    if (this.props.items.files && this.props.items.files.length) {
                        let tempItemFiles = [];
                        let tempImgFiles = [];
                        let tempPdfFiles = [];
                        let tempVidFiles = [];

                        this.props.items.files.forEach( item => {
                            tempItemFiles.push(item.name)

                            if (item.name.includes(".jpg")) {
                                tempImgFiles.push(item.name)
                            } else if (item.name.includes(".pdf")) {
                                tempPdfFiles.push(item.name)
                            } else if (item.name.includes(".mp4")) {
                                tempVidFiles.push(item.name)
                            }
                        })
                        this.setState({
                            itemFiles: tempItemFiles,
                            imgFiles: tempImgFiles, 
                            pdfFiles: tempPdfFiles, 
                            vidFiles: tempVidFiles 
                        })
                    }
                } 
                
                // if (this.props.items.itemReceived && !this.props.items.item.ownerId === 'guest' && !this.props.items.item.title && this.state.getItemWithCCalled && !this.state.getPendItemCalled) {
                if (this.props.items.itemReceived && !this.props.items.item) {
                    console.log('DISPATCHED')
                    this.props.dispatch(getPendItemById(this.props.match.params.id));
                    this.setState({
                        // getPendItemCalled: true,
                        isPending: true
                    })
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
        const newImg = '/assets/media/default/default.jpg';
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
            this.props.subcats.forEach( subcat => {
                
                if (subcat._id === subCatId[0]) {
                    // console.log(cat.title);
                    this.navInfo.subCatTitle = subcat.title;
                    this.navInfo.subCatId = subcat._id;

                }
            })
        }
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





    renderSlider = (files) => {
        console.log('render slider called', `/assets/media/items/${this.props.match.params.id}/original/${files[0]}`)
        const settings = {
            dots: true,
            infinite: false,
            arrows: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            className: 'slick_slider'
            // variableWidth: true
        }

        let slickDivs = [];
        files.forEach( (file, i) => {      
            slickDivs.push( 
                <div key={i} className="featured_item"> 
                    <div className="featured_image"
                         style={{
                            background: `url(/assets/media/items/${this.props.match.params.id}/original/${files[i]}), url(/assets/media/default/default.jpg)`
                         }}
                    >
                    </div>
                </div>
            )
        })
        
        return <Slick {...settings}>{slickDivs}</Slick>;
    }




    // ****************************************** RENDER PDF ******************************************

    renderPDF = () => {
        // ************* PDF STUFF *************
        const { pageNumber, numPages } = this.state;

        const onDocumentLoadSuccess = ({ numPages }) => {
            this.setState({ numPages });
            if (!this.props.items.item.is_pdf_chapter === true) {
                this.setState({ pageNumber: 1 });
            }
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

        let pdfId = this.props.match.params.id;
        if (this.props.items.item.is_pdf_chapter === true) {
            pdfId = this.props.items.item.pdf_item_parent_id;
        }

        // ***************************************
        return (
            <div className="pdf_wrapper">
                <div className="pdf">
                    
                    <Document
                        file={`/assets/media/items/${pdfId}/original/${this.state.pdfFiles[0]}`}
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

                    <a href="/assets/media/items/5eb4417bf2ff151113f3e178/original/0.pdf">[pdf]</a>
                    
                </div>

                {/* <br />
                    <input 
                        readOnly 
                        value={this.state.pdfPageNumber} 
                        onChange={(e) => {this.handlePageChange(e)}} 
                        ref={(input)=> this.myinput = input}
                    /> */}

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

                            {this.props.items.item.has_chapter_children ?
                                <div className="index_col index_top index_child">
                                    View Item
                                </div>
                            :
                            null }
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
                                    {this.props.items.item.has_chapter_children ?
                                        <div className="index_col index_child">
                                            {chapt.has_child ? 
                                                <Link to={`/items/${chapt.child_id}`} target='_blank'>
                                                    View Item
                                                </Link>
                                            :
                                            <span>-</span> }
                                        </div>
                                    : null }
                                </div>
                        
                        ))}
                        </div>
                    </div>
                : null }


                
            </div> 
        )
    }

    // *********************************** RENDER ITEM **************************************************************




    renderItem = (itemdata, itemFiles, imgFiles, pdfFiles, vidFiles) => {

        return ( 
            <div className="item_container">
                <div className="item_header">
                    <h1>{itemdata.title}</h1>
                    {itemFiles && itemFiles.length ?
                        <div className="item_media">
                            {imgFiles && imgFiles.length ?
                                imgFiles.length === 1 ?
                                    /////////////////////// SHOW SINGLE IMAGE ///////////////////////
                                    <div>
                                        {/* { itemdata.number_files == null || itemdata.number_files < 2 ? */}
                                            <div className="item_img">
                                                <img src={`/assets/media/items/${itemdata._id}/original/${itemFiles[0]}`} 
                                                className="item_main_img"
                                                alt="Item" 
                                                onError={i => i.target.style.display='none'}/>
                                            </div>
                                        {/* : null } */}
                                    </div>
                                    ///////////////////////// SHOW MULTIPLE IMAGES ///////////////////////
                                    : this.renderSlider(imgFiles) 
                            : null}

                            {/* /////////////////////// SHOW PDF /////////////////////// */}
                            { ( pdfFiles.length ) || (itemdata.is_pdf_chapter === true) ? 
                                this.renderPDF()
                            : null }

                            {/* /////////////////////// SHOW VIDEO /////////////////////// */}
                            {vidFiles && vidFiles.length ?
                                
                                <video className="video" controls name="media">
                                    <source src={`/assets/media/items/${itemdata._id}/original/${vidFiles[0]}`} type="video/mp4"/>
                                </video>
                            : null }
                        </div>
                    : null }


                    
                    {itemdata.creator ?
                        <div className="item_field item_creator item_view"><p><b>Creator </b></p><h5>{itemdata.creator}</h5></div>
                    : null }



                    <div className="item_contributor ">
                        <span className="item_field">
                            { itemdata.contributor && itemdata.contributor.name && itemdata.contributor.lastname ?
                                <span>Submitted by: {itemdata.contributor.name} {itemdata.contributor.lastname} - </span>
                            : null }
                            
                            {this.props.user.login.isAuth && !this.state.isPending === true ?
                                <Link to={`/user/edit-item/${this.props.match.params.id}`}>Edit</Link>
                            : null }
                        </span>
                    </div>
                </div>


                <div className="item_view item_body">

                    {this.renderField('Subject', itemdata.subject)}
                    {this.renderField('Description', itemdata.description)}
                    {this.renderField('Source', itemdata.source)}
                    {this.renderField('Date Created', itemdata.date_created)}
                    {this.renderField('Contributor', itemdata.contributor)}
                    {this.renderField('Item Format', itemdata.item_format)}
                    {this.renderField('Materials', itemdata.materials)}
                    {this.renderField('Physical Dimensions', itemdata.physical_dimensions)}
                    {this.renderField('Pages', itemdata.pages)}
                    {this.renderField('Editor', itemdata.editor)}
                    {this.renderField('Publisher', itemdata.publisher)}
                    {this.renderField('Further Info', itemdata.further_info)}
                    
                    

                    {itemdata.geo && itemdata.geo.address ?
                        this.renderField('Address', itemdata.geo.address)
                    : null }


                    {itemdata.pdf_item_parent_id && this.props.parentpdf ?
                        <div className="item_field link_blue">
                            <p><b>Source Document Item</b></p>
                            <Link to={`/items/${this.props.parentpdf._id}`} target="_blank">
                                <span>{this.props.parentpdf.title}</span>
                            </Link>
                        </div>
                        
                    : null}


                    {itemdata.geo && itemdata.geo.latitude && itemdata.geo.longitude ? 
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
                                    center={[itemdata.geo.latitude, itemdata.geo.longitude]} 
                                    zoom={this.state.mapZoom} 
                                    style={{ height: this.state.showMap ? '350px' : '0px'}}
                                >
                                    <TileLayer
                                        attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />

                                    <Marker 
                                        position={[itemdata.geo.latitude, itemdata.geo.longitude]} 
                                        // key={incident['incident_number']} 
                                    >
                                        <Popup>
                                            <span><b>{itemdata.title}</b></span>
                                            <br/>
                                            <span>{itemdata.geo.address}</span><br/>
                                            <br/>
                                            <span>{itemdata.geo.latitude}, {itemdata.geo.longitude}</span><br/>
                                        </Popup>
                                    </Marker>
                                </Map>
                            : null }
                        </div>
                    : null}
                </div> 


                {itemdata.external_link && itemdata.external_link[0].url ?
                    <Link to={itemdata.external_link[0].url}  target="_blank">
                        <div className="link_wrapper">
                            <div className="link_img">
                                <img src='/assets/media/icons/ext_link.png' className="ext_link" alt='external link'/>
                            </div>

                            <div className="link_text">
                                <b>External Link:</b><br />
                                {itemdata.external_link[0].text}
                            </div>
                        </div>
                    </Link>
                : null }



                {itemdata.shareDisabled ?
                    null
                    :               
                    <div className="shareIcons">
                        <FacebookShareButton
                            url={`http://${config.IP_ADDRESS}:3000/items/${itemdata._id}`}
                            className="shareIcon"
                            quote={itemdata.title}
                            >
                            <FacebookIcon size={32} round={true}/>
                        </FacebookShareButton>


                        <WhatsappShareButton
                            url={`http://${config.IP_ADDRESS}:3000/items/${itemdata._id}`}
                            className="shareIcon"
                            title={itemdata.title}
                            >
                            <WhatsappIcon size={32} round={true}/>
                        </WhatsappShareButton>

                        <EmailShareButton
                            url={`http://${config.IP_ADDRESS}:3000/items/${itemdata._id}`}
                            className="shareIcon"
                            subject={itemdata.title}
                            >
                            <EmailIcon size={32} round={true}/>
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
        )
    }

    // *************************************************************************************************************


    render() {

        console.log('PROPS: ', this.props)
        console.log('STATE: ', this.state)

        let items = this.props.items;

        // if (items.item && items.item.category_ref ) {
        //     {this.getCatName(items.item.category_ref)}
        // }

        // if (items.item && items.item.subcategory_ref ) {
        //     // console.log(items.item);
        //     {this.getSubCatName(items.item.subcategory_ref)}
        // }

        return (
            
            <div className="item_view_component">
                { this.navInfo.catTitle  ?
                    <NavigationBar navinfo={this.navInfo} title={items.item.title}/>    
                : null }

                <div className="main_view">
                    {this.state.itemdata && this.state.itemFiles.length ?
                        this.renderItem(this.state.itemdata, this.state.itemFiles, this.state.imgFiles, this.state.pdfFiles, this.state.vidFiles)
                    : this.renderItem(this.state.itemdata, [], [], [], []) }
                    {/* this.renderItem(items) */}
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
        previtem: state.items.previtem,
        parentpdf: state.items.parentpdf

    }
}


export default connect(mapStateToProps)(ItemView)