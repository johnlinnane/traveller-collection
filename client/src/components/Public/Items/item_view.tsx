import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import Slick from 'react-slick';   // uses cdn css
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { Icon } from 'leaflet'
import { EmailShareButton, FacebookShareButton, WhatsappShareButton } from "react-share";
import { EmailIcon, FacebookIcon, WhatsappIcon } from "react-share";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
// import 'react-pdf/dist/Page/AnnotationLayefr.css';
import { Link, useParams, useNavigate } from "react-router-dom";

import { getItemById, clearItemFromState, getNextItem, getPrevItem, getParentPdf, getFilesFolder } from '../../../../src/slices/itemsSlice';
import { getAllCats, getAllSubCats } from '../../../../src/slices/catsSlice';
import Breadcrumb from '../../widgetsUI/breadcrumb';
import config from "../../../config";
import { Item, NavInfo, Category, SubCategory } from '../../../types';
import { AppDispatch } from '../../../../src/index';

const IP_ADDRESS_REMOTE = process.env.REACT_APP_IP_ADDRESS_REMOTE;
const FS_PREFIX = process.env.REACT_APP_FILE_SERVER_PREFIX;

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

// interface ItemViewProps extends RouteComponentProps<{ id: string }> {
interface ItemViewProps {
    dispatch: Function;
    items: {
        item: Item | null;
        error: any; 
        files: string[];
        nextitem: Item | null;
        previtem: Item | null;
    };
    cats: Category[];
    subcats: SubCategory[];
    
    parentpdf: Item | null;
    user: {
      login: {
        error: boolean;
        isAuth: boolean;
      };
    };
  }



const ItemView: React.FC<ItemViewProps> = props => {

    const dispatch = useDispatch<AppDispatch>();

    const params = useParams();
    const navigate = useNavigate();

    const [numPages, setNumPages] = useState<number | null>(null);             // total number of pages??
    const [pageNumber, setPageNumber] = useState<number>(1);            // page currently displayed
    const [pdfScale] = useState<number>(1);
    const [showMap, setShowMap] = useState<boolean>(false);

    const [itemFiles, setItemFiles] = useState<string[]>([]);
    const [imgFiles, setImgFiles] = useState<string[]>([]);
    const [pdfFiles, setPdfFiles] = useState<string[]>([]);
    const [vidFiles, setVidFiles] = useState<string[]>([]);
    const [prevItem, setPrevItem] = useState<Item | null>(null);
    const [nextItem, setNextItem] = useState<Item | null>(null);
    const [userIsAuth, setUserIsAuth] = useState<boolean | null>(null);
    const [itemInfo, setItemInfo] = useState<Item | null>(null);

    const MAP_ZOOM: number = 12;

    useEffect(() => {
        if (params?.id) {
            dispatch(getItemById(params.id));
            dispatch(getAllCats());
            dispatch(getAllSubCats());
            dispatch(getNextItem(params.id));
            dispatch(getPrevItem(params.id));
            dispatch(getFilesFolder({folder: `/items/${params.id}/original`}));
        }
        return () => {
            dispatch(clearItemFromState());
            document.title = config.defaultTitle;
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params?.id]);

    useEffect(() => {
        if (props.items.error) {
            navigate('/');
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.items?.error]);

    useEffect(() => {
        if (props.items.item?.isPending && props.user.login?.error) {
            navigate('/');
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.items.item, props.user.login]);

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
                if (typeof item?.pdf_item_parent_id === 'string') {
                    dispatch(getParentPdf(item.pdf_item_parent_id))
                    dispatch(getFilesFolder({folder: `/items/${item.pdf_item_parent_id}/original`}))
                }
                const pageNumber = typeof item.pdf_item_pages.start === 'string'
                    ? parseInt(item.pdf_item_pages.start)
                    : item.pdf_item_pages.start;
                setPageNumber(pageNumber);
                // setGetParentCalled(true);
            }
        } // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.items.item]);

    useEffect(() => {
        if (props.items.files && props.items.files.length) {
            const categorizedFiles = props.items.files.reduce(
                (result, fileName: string) => {
                    if (fileName) {
                            result.all.push(fileName);
                        if (fileName.includes('.jpg')) {
                            result.images.push(fileName);
                        } else if (fileName.includes('.pdf')) {
                            result.pdfs.push(fileName);
                        } else if (fileName.includes('.mp4')) {
                            result.videos.push(fileName);
                        }
                    }
                return result;
                },
                { all: [], images: [], pdfs: [], videos: [] } as {
                    all: string[];
                    images: string[];
                    pdfs: string[];
                    videos: string[];
                }
            );
      
            setItemFiles(categorizedFiles.all);
            setImgFiles(categorizedFiles.images);
            setPdfFiles(categorizedFiles.pdfs);
            setVidFiles(categorizedFiles.videos);
        }
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

    const [navInfo, setNavInfo] = useState<NavInfo>({
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    });


    const getCatName = catId => {
        if (props.cats && props.cats.length) {
            props.cats.map( cat => {
                if (cat._id === catId[0]) {
                    setNavInfo(prevNavInfo => ({
                        ...prevNavInfo,
                        catTitle: cat.title,
                        catId: cat._id
                    }));
                }
                
                return null;
            })
        }
    }

    const getSubCatName = subCatId => {
        if (props.subcats && props.subcats.length) {
            props.subcats.forEach( subcat => {
                if (subcat._id === subCatId[0]) {
                    setNavInfo(prevNavInfo => ({
                        ...prevNavInfo,
                        subCatTitle: subcat.title,
                        subCatId: subcat._id
                    }));
                }
            })
        }
    }

    const goToIndex = pageNum => {
        setPageNumber(parseInt(pageNum));
    }
    
    const renderField = (text: string, ref: string) => {
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

        const slickDivs: React.ReactElement[] = files?.length ? files.map((file: string, i: number) => (
            <div key={i} className="featured_item"> 
              <div className="featured_image"
                style={{
                  background: `url(${FS_PREFIX}/assets/media/items/${params.id}/original/${file}), url(/assets/media/default/default.jpg)`
                }}
              >
              </div>
            </div>
          )) : [];
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
        let pdfId: string | null = params.id ? params.id : null;
        if (props.items?.item?.is_pdf_chapter === true) {
            pdfId = props.items?.item?.pdf_item_parent_id ? props.items?.item?.pdf_item_parent_id : null;
        }
        
        return (
            <div className="pdf_wrapper">
                <div className="pdf_document">
                    <Document
                        file={`${FS_PREFIX}/assets/media/items/${pdfId}/original/${pdfFiles[0]}`}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >   
                            <Page 
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

                { props.items?.item?.pdf_page_index?.length ?
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
                                                onError={i => (i.target as HTMLElement).style.display='none'}/>
                                            </div>
                                        </div>
                                    : 
                                        renderSlider(imgFiles)
                                : null}

                                { ( pdfFiles.length ) || (itemInfo.is_pdf_chapter === true) ? 
                                    renderPDF()
                                : null }

                                {vidFiles && vidFiles.length ?
                                    <video className="video" controls>
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
                                            {showMap ?
                                            <b><u>Hide Map</u></b> 
                                            : <b><u>Show On Map</u></b>}
                                        </p>
                                    </div>
                                    {showMap ?
                                        <MapContainer 
                                            className="item_map"
                                            center={[itemInfo.geo.latitude, itemInfo.geo.longitude]} 
                                            zoom={MAP_ZOOM} 
                                            style={{ height: showMap ? '350px' : '0px'}}
                                        >
                                            <TileLayer
                                                attribution='&copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker 
                                                position={[itemInfo.geo.latitude, itemInfo.geo.longitude]} 
                                                icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
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
                                        </MapContainer>
                                    : null }
                                </div>
                            : null}
                        </div> 

                        {itemInfo?.external_link && itemInfo.external_link[0]?.url ?
                            <a href={itemInfo.external_link[0].url} target="_blank" rel="noreferrer">

                                <div className="link_wrapper">
                                    <div className="link_text">
                                        <b>External Link</b><br />
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
                            title={itemInfo.title}
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

                {userIsAuth ?
                    <Link to={`/edit-item/${params.id}`} className="item_view_edit_link">Edit</Link>
                : null }

                {itemInfo.isPending !== true?
                    <div className="item_box">
                        <div className="left">
                            {prevItem?._id ?
                                <Link to={`/items/${prevItem._id}`}>
                                    <div className="prev_next_box_header">
                                        <span>Previous Item</span>
                                    </div>
                                    <div className="prev_next_box_item">
                                        <span>{prevItem.title || 'No Title'}</span>
                                    </div>
                                </Link>
                            : null }
                        </div>
                        {nextItem?._id ?
                            <div className="right">
                                <Link to={`/items/${nextItem._id}`}>
                                    <div className="prev_next_box_header">
                                        <span>Next Item</span>
                                    </div>
                                    <div className="prev_next_box_item">
                                        <span>{nextItem.title || 'No Title'}</span>
                                    </div>
                                </Link>
                            </div>
                        : null }
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

export default connect(mapStateToProps)(ItemView);