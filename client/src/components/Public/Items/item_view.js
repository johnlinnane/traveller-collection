import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Slick from 'react-slick';   // uses cdn css
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'

import { EmailShareButton, FacebookShareButton, WhatsappShareButton } from "react-share";
import { EmailIcon, FacebookIcon, WhatsappIcon } from "react-share";

import { Document, Page, pdfjs } from 'react-pdf';

import { getItemOrPending, clearItemWithContributor, getAllCats, getAllSubCats, getNextItem, getPrevItem, getParentPdf, getFilesFolder, getPendItemById } from '../../../actions';
import NavigationBar from '../../widgetsUI/navigation';

const IP_ADDRESS_REMOTE = process.env.REACT_APP_IP_ADDRESS_REMOTE;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


class ItemView extends Component {

    state = {

        itemId: this.props.match.params.id,

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

        // getParentCalled: false,

        itemFiles: [],
        imgFiles: [],
        pdfFiles: [],
        vidFiles: []
    }

    componentDidMount() {
        this.props.dispatch(getItemOrPending(this.state.itemId));
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
        this.props.dispatch(getNextItem(this.state.itemId));
        this.props.dispatch(getPrevItem(this.state.itemId));
        this.props.dispatch(getFilesFolder({folder: `/items/${this.props.match.params.id}/original`}))
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props !== prevProps) {

            if (this.props.match.params.id !== prevProps.match.params.id) { //  && !this.state.stateCleared
                this.setState({
                    itemId: this.props.match.params.id
                })
                this.props.dispatch(getItemOrPending(this.props.match.params.id));
                this.props.dispatch(getAllCats());
                this.props.dispatch(getAllSubCats());
                this.props.dispatch(getNextItem(this.props.match.params.id));
                this.props.dispatch(getPrevItem(this.props.match.params.id));
            }


            if (this.props.items.item !== prevProps.items.item) {
                this.setState({
                    itemInfo: this.props.items.item
                })

                // *************************** DERIVE CAT NAME FROM REF ***************************

                if (this.props.items.item) {
                    const item = this.props.items.item; 
                    if (item.title) {
                        document.title = `${item.title}`
                    }
                    if (item.category_ref ) {
                        this.getCatName(item.category_ref)
                    }
                    if (item.subcategory_ref ) {
                        this.getSubCatName(item.subcategory_ref)
                    }

                    if (item.is_pdf_chapter && item.pdf_item_pages && item.pdf_item_pages.start) {
                        // if (!this.state.getParentCalled) {
                            this.props.dispatch(getParentPdf(item.pdf_item_parent_id))
                            this.props.dispatch(getFilesFolder({folder: `/items/${item.pdf_item_parent_id}/original`}))
                        // }
                        this.setState({
                            pageNumber: parseInt(item.pdf_item_pages.start),
                            // getParentCalled: true
                        })
                    }
                }
            }

            if (this.props.items.files !== prevProps.items.files) {
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


            if (this.props.items.previtem !== prevProps.items.previtem) {
                this.setState({
                    prevItem: this.props.items.previtem
                })
            }

            if (this.props.items.nextitem !== prevProps.items.nextitem) {
                this.setState({
                    nextItem: this.props.items.nextitem
                })
            }

            if (this.props.user.login !== prevProps.user.login) {
                if (this.props.user.login.isAuth) {
                    this.setState({
                        userIsAuth: true
                    })
                } else {
                    this.setState({
                        userIsAuth: false
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
                    this.navInfo.catTitle = cat.title;
                    this.navInfo.catId = cat._id;
                }
                return null;
            })
        }
    }

    getSubCatName = (subCatId) => {
        if (this.props.subcats && this.props.subcats.length) {
            this.props.subcats.forEach( subcat => {
                
                if (subcat._id === subCatId[0]) {
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
                            background: `url(${FS_PREFIX}/assets/media/items/${this.state.itemId}/original/${files[i]}), url(/assets/media/default/default.jpg)`
                         }}
                    >
                    </div>
                </div>
            )
        })
        return <div className="slick_div"><Slick {...settings}>{slickDivs}</Slick></div>;
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


        // const scaleDown = () => {
        //     this.setState({
        //         pdfScale: this.state.pdfScale - 0.2
        //     })
        // }

        // const scaleUp = () => {
        //     this.setState({
        //         pdfScale: this.state.pdfScale + 0.2
        //     })
        // }

        let pdfId = this.state.itemId; // this.props.match.params.id
        if (this.props.items.item.is_pdf_chapter === true) {
            pdfId = this.props.items.item.pdf_item_parent_id;
        }

        
        return (
            <div className="pdf_wrapper">
                <div className="pdf_document">
                    <Document
                        file={`${FS_PREFIX}/assets/media/items/${pdfId}/original/${this.state.pdfFiles[0]}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        // onLoadError={this.setState({ pdfError: true })}
                    >   
                            <Page 
                                size="A4"
                                pageNumber={pageNumber}
                                scale={this.state.pdfScale}
                            />
                    </Document>

                </div> 

                <div className="pdf_control_panel">
                    {/* <FontAwesome 
                        className="fa-search-minus pdf_scale"
                        onClick={scaleDown}
                    />
                    <FontAwesome 
                        className="fa-search-plus pdf_scale"
                        onClick={scaleUp}
                    /> */}

                    <span className="item_pagenum">
                        Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                    </span>

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

                    <a href={`${FS_PREFIX}/assets/media/items/${pdfId}/original/${this.state.pdfFiles[0]}`}>[Fullscreen]</a>
                </div>

                { this.props.items.item.pdf_page_index && this.props.items.item.pdf_page_index.length ?
                    <div className="pdf_index_table">

                        <div className="pdf_index_row pdf_index_header">
                            <div className="pdf_index_col pdf_index_col_1">
                                Page
                            </div>
                            <div className="pdf_index_col">
                                Heading
                            </div>
                            <div className="pdf_index_col">
                                Description
                            </div>

                            {this.props.items.item.has_chapter_children ?
                                <div className="pdf_index_col">
                                    View Item
                                </div>
                            :
                            null }
                        </div>
                        {this.props.items.item.pdf_page_index.map( (chapt, i) => (
                            <div key={i} className="pdf_index_row" onClick={() => this.goToIndex(chapt.page)}>
                                <div className="pdf_index_col pdf_index_col_1">
                                    {chapt.page}
                                </div>
                                <div className="pdf_index_col">
                                    {chapt.heading}
                                </div>
                                <div className="pdf_index_col">
                                    {chapt.description}
                                </div>
                                {this.props.items.item.has_chapter_children ?
                                    <div className="pdf_index_col">
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
                : null }
            </div> 
        )
    }

    // *********************************** RENDER ITEM **************************************************************




    renderItem = (itemInfo, itemFiles, imgFiles, pdfFiles, vidFiles) => {

        return ( 
            <div className="view_item_container">
                <div className="item_view_item_details">

                    {itemFiles && itemFiles.length ?
                        <div className="item_view_media_wrapper">
                            <div className="item_media">
                                {imgFiles && imgFiles.length ?
                                    imgFiles.length === 1 ?
                                        /////////////////////// SHOW SINGLE IMAGE ///////////////////////
                                        <div>
                                                <div className="item_img">
                                                    <img src={`${FS_PREFIX}/assets/media/items/${itemInfo._id}/original/${itemFiles[0]}`} 
                                                    className="item_main_img"
                                                    alt="Item" 
                                                    onError={i => i.target.style.display='none'}/>
                                                </div>
                                            {/* : null } */}
                                        </div>
                                        ///////////////////////// SHOW MULTIPLE IMAGES ///////////////////////
                                    : 
                                        this.renderSlider(imgFiles)
                                        
                                : null}

                                {/* /////////////////////// SHOW PDF /////////////////////// */}
                                { ( pdfFiles.length ) || (itemInfo.is_pdf_chapter === true) ? 
                                    this.renderPDF()
                                : null }

                                {/* /////////////////////// SHOW VIDEO /////////////////////// */}
                                {vidFiles && vidFiles.length ?
                                    
                                    <video className="video" controls name="media">
                                        <source src={`${FS_PREFIX}/assets/media/items/${itemInfo._id}/original/${vidFiles[0]}`} type="video/mp4"/>
                                    </video>
                                : null }
                            </div>
                        </div>
                    : null }

                    <div className="item_view_text">
                        <h1>{itemInfo.title}</h1>
                        
                        {itemInfo.creator ?
                            <div className="item_field item_creator item_view"><p><b>Creator </b></p><h5>{itemInfo.creator}</h5></div>
                        : null }

                        {/* <div className="item_contributor ">
                            <span className="item_field">
                                { itemInfo.contributor && itemInfo.contributor.name && itemInfo.contributor.lastname ?
                                    <span>Submitted by: {itemInfo.contributor.name} {itemInfo.contributor.lastname} - </span>
                                : null }
                            </span>
                        </div> */}

                        <div className="item_view item_body">

                            {this.renderField('Subject', itemInfo.subject)}
                            {this.renderField('Description', itemInfo.description)}
                            {this.renderField('Source', itemInfo.source)}
                            {this.renderField('Date Created', itemInfo.date_created)}
                            {this.renderField('Contributor', itemInfo.contributor)}
                            {this.renderField('Item Format', itemInfo.item_format)}
                            {this.renderField('Materials', itemInfo.materials)}
                            {this.renderField('Physical Dimensions', itemInfo.physical_dimensions)}
                            {this.renderField('Pages', itemInfo.pages)}
                            {this.renderField('Editor', itemInfo.editor)}
                            {this.renderField('Publisher', itemInfo.publisher)}
                            {this.renderField('Further Info', itemInfo.further_info)}
                            
                            

                            {itemInfo.geo && itemInfo.geo.address ?
                                this.renderField('Address', itemInfo.geo.address)
                            : null }


                            {itemInfo.pdf_item_parent_id && this.props.parentpdf ?
                                <div className="item_field link_blue">
                                    <p><b>Source Document Item</b></p>
                                    <Link to={`/items/${this.props.parentpdf._id}`} target="_blank">
                                        <span>{this.props.parentpdf.title}</span>
                                    </Link>
                                </div>
                                
                            : null}

                            {itemInfo.geo && itemInfo.geo.latitude && itemInfo.geo.longitude ? 
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
                                            center={[itemInfo.geo.latitude, itemInfo.geo.longitude]} 
                                            zoom={this.state.mapZoom} 
                                            style={{ height: this.state.showMap ? '350px' : '0px'}}
                                        >
                                            <TileLayer
                                                attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />

                                            <Marker 
                                                position={[itemInfo.geo.latitude, itemInfo.geo.longitude]} 
                                                // key={incident['incident_number']} 
                                            >
                                                <Popup>
                                                    <span><b>{itemInfo.title}</b></span>
                                                    <br/>
                                                    <span>{itemInfo.geo.address}</span><br/>
                                                    <br/>
                                                    <span>{itemInfo.geo.latitude}, {itemInfo.geo.longitude}</span><br/>
                                                </Popup>
                                            </Marker>
                                        </Map>
                                    : null }
                                </div>
                            : null}
                        </div> 


                        {itemInfo.external_link && itemInfo.external_link[0].url ?
                            <a href={itemInfo.external_link[0].url} target="_blank" rel="noreferrer">

                                <div className="link_wrapper">
                                    <div className="link_text">
                                        <b>Visit</b><br />
                                        {itemInfo.external_link[0].text}
                                    </div>
                                    <div className="link_img">
                                        <img src='/assets/media/icons/ext_link.png' className="ext_link" alt='external link'/>
                                    </div>
                                </div>
                            </a>
                        : null }
                    </div>
                </div>

                {itemInfo.shareDisabled ?
                    null
                    :               
                    <div className="shareIcons">
                        <FacebookShareButton
                            url={`${IP_ADDRESS_REMOTE}/items/${itemInfo._id}`}
                            className="shareIcon"
                            quote={itemInfo.title}
                            >
                            <FacebookIcon size={32} round={true}/>
                        </FacebookShareButton>


                        <WhatsappShareButton
                            url={`${IP_ADDRESS_REMOTE}/items/${itemInfo._id}`}
                            className="shareIcon"
                            title={itemInfo.title}
                            >
                            <WhatsappIcon size={32} round={true}/>
                        </WhatsappShareButton>

                        <EmailShareButton
                            url={`${IP_ADDRESS_REMOTE}/items/${itemInfo._id}`}
                            className="shareIcon"
                            subject={itemInfo.title}
                            >
                            <EmailIcon size={32} round={true}/>
                        </EmailShareButton>
                    </div>
                }

                {this.state.userIsAuth && !this.state.isPending === true ?
                    <Link to={`/user/edit-item/${this.props.match.params.id}`} className="item_view_edit_link">Edit</Link>
                : null }


                {this.state.isPending === false ?
                    <div className="item_box">
                        <div className="left">
                            {this.state.prevItem ?
                                <Link to={`/items/${this.state.prevItem._id}`}>
                                    <div className="prev_next_box_header">
                                        <span>Previous Item</span>
                                    </div>
                                    <div className="prev_next_box_item">
                                        <span>{this.state.prevItem.title}</span>
                                    </div>
                                </Link>
                            : null }
                        </div>

                        <div className="right">
                            {this.state.nextItem ?
                                <Link to={`/items/${this.state.nextItem._id}`}>
                                    <div className="prev_next_box_header">
                                        <span>Next Item</span>
                                    </div>
                                    <div className="prev_next_box_item">
                                        <span>{this.state.nextItem.title}</span>
                                    </div>
                                </Link>
                            : null }
                        </div>
                    </div> 
                : null }
            </div> 
        )
    }

    render() {
        return (
            
            <div className="item_view_component">
                { this.state.itemInfo && this.navInfo.catTitle  ?
                    <NavigationBar navinfo={this.navInfo} title={this.state.itemInfo.title}/>    
                : null }
                <div className="item_view_main_view">
                    {this.state.itemInfo && this.state.itemFiles ?
                        this.renderItem(this.state.itemInfo, this.state.itemFiles, this.state.imgFiles, this.state.pdfFiles, this.state.vidFiles)
                    : null }
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

export default withRouter(connect(mapStateToProps)(ItemView))