import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Slick from 'react-slick';   // uses cdn css



import { Document, Page, pdfjs } from 'react-pdf';
// import PDFViewer from 'pdf-viewer-reactjs'




// import { getBookWithReviewer, clearBookWithReviewer } from '../../actions'; // OLD !
import { getItemWithContributor, clearItemWithContributor, getAllCats, getAllSubCats, getNextItem, getPrevItem } from '../../actions';
import NavigationBar from '../../widgetsUI/navigation';
// import Image from '../../widgetsUI/Slider/slider';
import ItemImageSlider from '../../widgetsUI/Slider/item_img_slider';


pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;




class ItemView extends Component {

    state = {
        pdfError: false,
        numPages: null,
        setNumPages: null,
        pageNumber: 1,
        setPageNumber: 1
    }

    
    // componentWillMount() {
    componentDidMount() {
        this.props.dispatch(getAllCats());
        this.props.dispatch(getAllSubCats());
        this.props.dispatch(getItemWithContributor(this.props.match.params.id));
        this.props.dispatch(getNextItem(this.props.match.params.id));
        this.props.dispatch(getPrevItem(this.props.match.params.id));
        


    }

    componentWillReceiveProps() {

    }
    

    componentWillUnmount() {
        this.props.dispatch(clearItemWithContributor());
    }


    navInfo = {
        catTitle: null,
        catId: null,
        subCatTitle: null,
        subCatId: null,
        type: 'Categories'
    }
  
    addDefaultImg = (ev) => {
        const newImg = '/images/default/default.jpg';
        if (ev.target.src !== newImg) {
            ev.target.src = newImg
        }  
        
    } 

    getCatName = (catId) => {
        if (this.props.cats && this.props.cats.length) {
            this.props.cats.map( cat => {
                
                if (cat.cat_id === catId[0]) {
                    // console.log(cat.title);
                    this.navInfo.catTitle = cat.title;
                    this.navInfo.catId = cat.cat_id;
                }
                return null;
            })
        }
    }

    getSubCatName = (subCatId) => {
        // console.log(subCatId);
        if (this.props.subcats && this.props.subcats.length) {
            this.props.subcats.map( subcat => {
                
                if (subcat.subcat_id == subCatId[0]) {
                    // console.log(cat.title);
                    this.navInfo.subCatTitle = subcat.title;
                    this.navInfo.subCatId = subcat.subcat_id;

                }
            })
        }
    }


    nextItem = () => {

    }

    renderField = (text, ref) => {
        if (ref) {
            return (
                <p className="item_field link_blue">
                    <b>{text}: </b>
                    <span dangerouslySetInnerHTML={{__html:  ref}}></span>
                </p>
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
                            background: `url(/images/items/${items.item._id}/original/${i}.jpg)`
                            // <img src={`/images/items/${items.item._id}/original/0.jpg`} alt="Item" onError={this.addDefaultImg}/>
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
        // ***************************************
        return (
            <div className="pdf_wrapper">
                <div className="pdf">
                    <Document
                        file="/images/items/5eb4417bf2ff151113f3e178/original/0.pdf"
                        onLoadSuccess={onDocumentLoadSuccess}
                        // onLoadError={this.setState({ pdfError: true })}
                        
                        
                    >
                        <Page 
                            className={"pdf_page"}
                            pageNumber={pageNumber}
                            // width={Math.min(width * 0.9, 400)} 
                            width={650} 
                            // scale={0.5}
                        />
                    </Document>
                </div> 
                <br />
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

                <p>
                    Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
                    
                </p>

                <a href="/images/items/5eb4417bf2ff151113f3e178/original/0.pdf">[pdf]</a>
                
                
            </div> 
        )
    }


    renderItem = (items) => {


        



        console.log(items);
        return ( items.item ?

            <div>
                {/* <ItemImageSlider /> */}

                { this.navInfo.catTitle  ?
                    <NavigationBar navinfo={this.navInfo} title={items.item.title}/>    
                : null }

                <div className="item_container">
                    

                    <div className="item_header">

                        <h1>{items.item.title}</h1>


                        {items.item.file_format == 'mp4' ?
                            
                                <video className="video" controls name="media">
                                    <source src={`/images/items/${items.item._id}/original/0.mp4`} type="video/mp4"/>
                                </video>
                        : null }

                        {/* {items.item.file_format === 'pdf' ?
                            <PDFViewer document={{ url: '/images/items/5eb4417bf2ff151113f3e178/original/0.pdf' }} scale={0.5} scaleStep={0.05} />
                        : null } */}

                        {items.item.file_format === 'pdf' ?
                            this.renderPDF()
                        : null }

                        

                  



                        { items.item && items.item._id && items.item.number_files == 1 && items.item.file_format !== 'mp4' && items.item.file_format !== 'pdf' ?
                            <div className="item_img">
                                <img src={`/images/items/${items.item._id}/original/0.jpg`} alt="Item" onError={i => i.target.style.display='none'}/>
                            </div>
                        : null}

                        { items.item && items.item.number_files > 1 && items.item.file_format !== 'mp4' && items.item.file_format !== 'pdf' ?
                            this.renderSlider(items)
                        : null}


                        <br />

                        
                        {items.item.creator ?
                            <h5 className="item_field item_creator"><span>Creator: </span>{items.item.creator}</h5>
                        : null }

                        
                        <div className="item_reviewer ">
                            <span className="item_field">
                                { items.contributor && items.contributor.name && items.contributor.lastname ?
                                    <span>Submitted by: {items.contributor.name} {items.contributor.lastname} - </span>
                                : null }
                                <Link to={`/user/edit-item/${this.props.match.params.id}`}>Edit</Link>
                            </span>
                        </div>
                    </div>


                    <div className="item_review">

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
                        
                        {items.item && items.item.external_link && items.item.external_link[0].url ?
                            <span className="item_field">
                                <p className="link_blue"><b>External Link: </b>
                                
                                    <Link to={items.item.external_link[0].url}  target="_blank">{items.item.external_link[0].text}</Link>
                                    {/* <a href={items.item.external_link[0].url} target="_blank">{items.item.external_link[0].text}</a> */}
                                </p>
                            
                            
                            </span>
                        : null }

                        {items.item && items.item.geo ?
                            this.renderField('Address', items.item.geo.address)
                        : null }
  
                    </div> 



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


                </div> 
            </div> 
        : null )
    }


    render() {

        // console.log(this.props);


        let items = this.props.items;
        // console.log(items.item);

        if (items.item && items.item.category_ref ) {
            {this.getCatName(items.item.category_ref)}
        }

        if (items.item && items.item.subcategory_ref ) {
            // console.log(items.item);
            {this.getSubCatName(items.item.subcategory_ref)}
        }

        return (
            <div className="main_view">
                {this.renderItem(items)}
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