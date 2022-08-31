import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Slick from 'react-slick';   // uses cdn css
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import { EmailShareButton, FacebookShareButton, WhatsappShareButton } from "react-share";
import { EmailIcon, FacebookIcon, WhatsappIcon } from "react-share";
import { Document, Page, pdfjs } from 'react-pdf';
import { getItemOrPending, clearItemWithContributor, getAllCats, getAllSubCats, getNextItem, getPrevItem, getParentPdf, getFilesFolder } from '../../../actions';
import Breadcrumb from '../../widgetsUI/breadcrumb';
import config from "../../../config";
const IP_ADDRESS_REMOTE = process.env.REACT_APP_IP_ADDRESS_REMOTE;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const ItemView: React.FC = (props: any) => {
    const [numPages, setNumPages] = useState(null);             // total number of pages??
    const [pageNumber, setPageNumber] = useState(1);            // page currently displayed
    const [pdfError, setPdfError] = useState(false);            // commented out
    // const [setNumPages, setSetNumPages] = useState(null);    // not used
    // const [setPageNumber, setSetPageNumber] = useState(1);   // not used
    // const [pdfPageNumber, setPdfPageNumber] = useState(0);   // not used
    const [pdfScale, setPdfScale] = useState(1);

    const [showMap, setShowMap] = useState(false);
    const [mapZoom, setMapZoom] = useState(12);

    const [isPending, setIsPending] = useState(false);

    const [itemFiles, setItemFiles] = useState([]);
    const [imgFiles, setImgFiles] = useState([]);
    const [pdfFiles, setPdfFiles] = useState([]);
    const [vidFiles, setVidFiles] = useState([]);
    const [prevItem, setPrevItem] = useState(null);
    const [nextItem, setNextItem] = useState(null);
    const [userIsAuth, setUserIsAuth] = useState(null);
    const [itemInfo, setItemInfo] = useState(null);

    useEffect(() => {
        props.dispatch(getItemOrPending(props.match.params.id));
        props.dispatch(getAllCats());
        props.dispatch(getAllSubCats());
        props.dispatch(getNextItem(props.match.params.id));
        props.dispatch(getPrevItem(props.match.params.id));
        props.dispatch(getFilesFolder({folder: `/items/${props.match.params.id}/original`}));
        return () => {
            props.dispatch(clearItemWithContributor());
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (props.items.error) {
            props.history.push('/');
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.items]);

    useEffect(() => {
        if (props.match.params.id) {
            props.dispatch(getItemOrPending(props.match.params.id));
            props.dispatch(getAllCats());
            props.dispatch(getAllSubCats());
            props.dispatch(getNextItem(props.match.params.id));
            props.dispatch(getPrevItem(props.match.params.id));
            props.dispatch(getFilesFolder({folder: `/items/${props.match.params.id}/original`}));
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.match.params.id]);

    useEffect(() => {
        setItemInfo(props.items.item);
        if (props.items.item) {
            const item = props.items.item; 
            if (item.title) {
                document.title = `${item.title}`
            }
            if (item.category_ref ) {
                getCatName(item.category_ref)
            }
            if (item.subcategory_ref ) {
                getSubCatName(item.subcategory_ref)
            }
            if (item.is_pdf_chapter && item.pdf_item_pages && item.pdf_item_pages.start) {
                // if (!getParentCalled) {
                    props.dispatch(getParentPdf(item.pdf_item_parent_id))
                    props.dispatch(getFilesFolder({folder: `/items/${item.pdf_item_parent_id}/original`}))
                // }
                setPageNumber(parseInt(item.pdf_item_pages.start));
                // setGetParentCalled(true);
            }
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.items.item]);

    useEffect(() => {
        if (props.items.files && props.items.files.length) {
            let tempItemFiles = [];
            let tempImgFiles = [];
            let tempPdfFiles = [];
            let tempVidFiles = [];
            props.items.files.forEach( item => {
                tempItemFiles.push(item.name)
                if (item.name.includes(".jpg")) {
                    tempImgFiles.push(item.name)
                } else if (item.name.includes(".pdf")) {
                    tempPdfFiles.push(item.name)
                } else if (item.name.includes(".mp4")) {
                    tempVidFiles.push(item.name)
                }
            })
            setItemFiles(tempItemFiles);
            setImgFiles(tempImgFiles);
            setPdfFiles(tempPdfFiles);
            setVidFiles(tempVidFiles) ;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.items.files]);

    useEffect(() => {
        if (props.items.previtem) {
            setPrevItem(props.items.previtem);
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.items.previtem]);

    useEffect(() => {
        if (props.items.nextitem) {
            setNextItem(props.items.nextitem);
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.items.nextitem]);

    useEffect(() => {
        if (props.user.login && props.user.login.isAuth) {
            setUserIsAuth(true);
        } else {
            setUserIsAuth(false);
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.user.login]);

    const navInfo = {
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    }

    // const addDefaultImg = ev => {
    //     const newImg = '/assets/media/default/default.jpg';
    //     if (ev.target.src !== newImg) {
    //         ev.target.src = newImg
    //     }  
    // } 

    const getCatName = catId => {
        if (props.cats && props.cats.length) {
            props.cats.map( cat => {
                if (cat._id === catId[0]) {
                    navInfo.catTitle = cat.title;
                    navInfo.catId = cat._id;
                }
                return null;
            })
        }
    }

    const getSubCatName = subCatId => {
        if (props.subcats && props.subcats.length) {
            props.subcats.forEach( subcat => {
                if (subcat._id === subCatId[0]) {
                    navInfo.subCatTitle = subcat.title;
                    navInfo.subCatId = subcat._id;
                }
            })
        }
    }

    const goToIndex = pageNum => {
        setPageNumber(parseInt(pageNum));
    }
    
    const renderField = (text, ref) => {
        if (ref) {
            return (
                <div className="item_field link_blue">
                    <p><b>{text}</b></p>
                    <span dangerouslySetInnerHTML={{__html:  ref}}></span>
                </div>
            )
        } 
    }

    const renderSlider = files => {
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
                            background: `url(${FS_PREFIX}/assets/media/items/${props.match.params.id}/original/${files[i]}), url(/assets/media/default/default.jpg)`
                         }}
                    >
                    </div>
                </div>
            )
        })
        return <div className="slick_div"><Slick {...settings}>{slickDivs}</Slick></div>;
    }


    const renderPDF = () => {
        const onDocumentLoadSuccess = ({ numPages }) => {
            setNumPages(numPages);
            if (!props.items.item.is_pdf_chapter === true) {
                setPageNumber(1);
            }
        }
        const changePage = (offset) => {
            setPageNumber(pageNumber + offset);
        }
        const previousPage = () => {
            changePage(-1);
        }
        const nextPage = () => {
            changePage(1);
        }
        // const scaleDown = () => {
        //     setPdfScale(pdfScale - 0.2);
        // }
        // const scaleUp = () => {
        //     setPdfScale(pdfScale + 0.2);
        // }
        let pdfId = props.match.params.id;
        if (props.items.item.is_pdf_chapter === true) {
            pdfId = props.items.item.pdf_item_parent_id;
        }
        
        return (
            <div className="pdf_wrapper">
                <div className="pdf_document">
                    <Document
                        file={`${FS_PREFIX}/assets/media/items/${pdfId}/original/${pdfFiles[0]}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                        // onLoadError={setPdfError(true)}
                    >   
                            <Page 
                                size="A4"
                                pageNumber={pageNumber}
                                scale={pdfScale}
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

                    <a href={`${FS_PREFIX}/assets/media/items/${pdfId}/original/${pdfFiles[0]}`}>[Fullscreen]</a>
                </div>

                { props.items.item.pdf_page_index && props.items.item.pdf_page_index.length ?
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

                            {props.items.item.has_chapter_children ?
                                <div className="pdf_index_col">
                                    View Item
                                </div>
                            :
                            null }
                        </div>
                        {props.items.item.pdf_page_index.map( (chapt, i) => (
                            <div key={i} className="pdf_index_row" onClick={() => goToIndex(chapt.page)}>
                                <div className="pdf_index_col pdf_index_col_1">
                                    {chapt.page}
                                </div>
                                <div className="pdf_index_col">
                                    {chapt.heading}
                                </div>
                                <div className="pdf_index_col">
                                    {chapt.description}
                                </div>
                                {props.items.item.has_chapter_children ?
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

    const renderItem = (itemInfo, itemFiles, imgFiles, pdfFiles, vidFiles) => {
        return ( 
            <div className="view_item_container">
                <div className="item_view_item_details">
                    {itemFiles && itemFiles.length ?
                        <div className="item_view_media_wrapper">
                            <div className="item_media">
                                {imgFiles && imgFiles.length ?
                                    imgFiles.length === 1 ?
                                        <div>
                                            <div className="item_img">
                                                <img src={`${FS_PREFIX}/assets/media/items/${itemInfo._id}/original/${itemFiles[0]}`} 
                                                className="item_main_img"
                                                alt="Item" 
                                                onError={i => i.target.style.display='none'}/>
                                            </div>
                                        </div>
                                    : 
                                        renderSlider(imgFiles)
                                : null}

                                { ( pdfFiles.length ) || (itemInfo.is_pdf_chapter === true) ? 
                                    renderPDF()
                                : null }

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

                            {renderField('Subject', itemInfo.subject)}
                            {renderField('Description', itemInfo.description)}
                            {renderField('Source', itemInfo.source)}
                            {renderField('Date Created', itemInfo.date_created)}
                            {renderField('Contributor', itemInfo.contributor)}
                            {renderField('Item Format', itemInfo.item_format)}
                            {renderField('Materials', itemInfo.materials)}
                            {renderField('Physical Dimensions', itemInfo.physical_dimensions)}
                            {renderField('Pages', itemInfo.pages)}
                            {renderField('Editor', itemInfo.editor)}
                            {renderField('Publisher', itemInfo.publisher)}
                            {renderField('Further Info', itemInfo.further_info)}

                            {itemInfo.geo && itemInfo.geo.address ?
                                renderField('Address', itemInfo.geo.address)
                            : null }

                            {itemInfo.pdf_item_parent_id && props.parentpdf ?
                                <div className="item_field link_blue">
                                    <p><b>Source Document Item</b></p>
                                    <Link to={`/items/${props.parentpdf._id}`} target="_blank">
                                        <span>{props.parentpdf.title}</span>
                                    </Link>
                                </div>
                            : null}

                            {itemInfo.geo && itemInfo.geo.latitude && itemInfo.geo.longitude ? 
                                <div>
                                    <div className="item_map_heading" onClick={() => setShowMap(!showMap)}>
                                        <p>
                                            <b>View on Map </b> 
                                            {showMap ?
                                                <i className="fa fa-angle-up"></i>
                                            : <i className="fa fa-angle-down"></i>}
                                        </p>
                                    </div>
                                    {showMap ?
                                        <Map 
                                            className="item_map"
                                            center={[itemInfo.geo.latitude, itemInfo.geo.longitude]} 
                                            zoom={mapZoom} 
                                            style={{ height: showMap ? '350px' : '0px'}}
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

                {userIsAuth && !isPending === true ?
                    <Link to={`/user/edit-item/${props.match.params.id}`} className="item_view_edit_link">Edit</Link>
                : null }

                {isPending === false ?
                    <div className="item_box">
                        <div className="left">
                            {prevItem ?
                                <Link to={`/items/${prevItem._id}`}>
                                    <div className="prev_next_box_header">
                                        <span>Previous Item</span>
                                    </div>
                                    <div className="prev_next_box_item">
                                        <span>{prevItem.title}</span>
                                    </div>
                                </Link>
                            : null }
                        </div>

                        <div className="right">
                            {nextItem ?
                                <Link to={`/items/${nextItem._id}`}>
                                    <div className="prev_next_box_header">
                                        <span>Next Item</span>
                                    </div>
                                    <div className="prev_next_box_item">
                                        <span>{nextItem.title}</span>
                                    </div>
                                </Link>
                            : null }
                        </div>
                    </div> 
                : null }
            </div> 
        )
    }

    return (
        <div className="item_view_component">
            { itemInfo && navInfo.catTitle  ?
                <Breadcrumb navinfo={navInfo} title={itemInfo.title}/>    
            : null }
            <div className="item_view_main_view">
                {itemInfo && itemFiles ?
                    renderItem(itemInfo, itemFiles, imgFiles, pdfFiles, vidFiles)
                : null }
            </div>
        </div>
    );
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

export default withRouter(connect(mapStateToProps)(ItemView));