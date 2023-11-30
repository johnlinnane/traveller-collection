import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getItemById, updateItem, createItem } from '../../../actions';
import config from "../../../config";
import { Item } from '../../../types';

import mongoose from 'mongoose';

const ChapterIndex = props => {

    type LocalItem = Omit<Item, 'pdf_page_index'> & {
        pdf_page_index: {
            page: number,
            heading: string,
            description: string,
            has_child: boolean,
            child_id: string
        }[];
    };

    const [formdata, setFormdata] = useState<LocalItem>({
        _id: props.match.params.id,
        title: '',
        pdf_page_index: []
    });
    const [saved, setSaved] = useState(false);
    const [cancelled, setCancelled] = useState(false);

    useEffect(() => {
        if (props.match?.params?.id) {
            document.title = `Chapter Index - ${config.defaultTitle}`;
            props.dispatch(getItemById(props.match.params.id))
            return () => {
                document.title = config.defaultTitle;
            }
        }
    }, [props.match.params?.id]);

    useEffect(() => {
        if (props.items?.item) {
            setFormdata(prevFormData => ({
                ...prevFormData,
                ...props.items.item
            }));
        }
    }, [props.items?.item]);


    const handleInput = (event, field, i) => {
        let newData = formdata.pdf_page_index;
        switch(field) {
            case 'page':
                newData[i].page = event.target.value;
                break;
            case 'heading':
                newData[i].heading = event.target.value;
                break;
            case 'description':
                newData[i].description = event.target.value;
                break;
            default:
        }
        setFormdata({
            ...formdata,
            pdf_page_index: newData
        }) 
    }

    const addField = () => {
        let newFormdata = {
            ...formdata,
            pdf_page_index: [
                ...formdata.pdf_page_index,
                {
                    description: "",
                    heading: "",
                    page: null
                }
            ]
        }
        setFormdata(newFormdata);
    }

    const removeField = () => {
        let newArray = formdata.pdf_page_index;
        newArray.pop();
        let newFormdata = {
            ...formdata,
            pdf_page_index: newArray
        }
        setFormdata(newFormdata);
    }

    const cancel = () => {
        setCancelled(true);
    }

    const createChapterItem = (i) => {
        const chapterItemId = new mongoose.Types.ObjectId().toHexString()
        let temp_pdf_page_index = formdata.pdf_page_index;
        temp_pdf_page_index[i] = {
            ...formdata.pdf_page_index[i],
            has_child: true,
            child_id: chapterItemId
        }
        let newFormdata = {
            ...formdata,
            pdf_page_index: temp_pdf_page_index
        }
        setFormdata(newFormdata);

        let temp_has_chapter_children = false;
        formdata.pdf_page_index.forEach(chapt => {
            if (chapt.has_child) {
                temp_has_chapter_children = true;
            }
        })

        setFormdata({
            ...formdata,
            has_chapter_children: temp_has_chapter_children
        });

        props.dispatch(updateItem({ ...formdata }))

        let chapterItem = {
            _id: chapterItemId,
            title: formdata.pdf_page_index[i].heading,
            description: formdata.pdf_page_index[i].description,
            is_pdf_chapter: true,
            pdf_item_pages: {
                start: formdata.pdf_page_index[i].page,
                end: null
            },
            pdf_item_parent_id: props.items.item._id,
            subcategory_ref : props.items.item.subcategory_ref,
            category_ref: props.items.item.category_ref,

            creator: '',
            subject: '',
            source: '',
            date_created: '',
            
            contributor: '',
            item_format: '',
            materials: '',
            physical_dimensions: '',
            pages: '',        
            editor: '',
            publisher: '',
            further_info: '',
            language: '',
            reference: '',
            rights: '',
            external_link: [
                {
                    url: '',
                    text: ''
                }
            ],
            geo: {
                address: '',
                latitude: null,
                longitude: null
            },
            location: ''
        }
        props.dispatch(createItem(chapterItem))
        // setTimeout(() => {
        //     props.history.push(`/edit-item/${chapterItem._id}`)
        // }, 1000)
    }

    const onSubmit = (e) => {
        e.preventDefault();
        props.dispatch(updateItem({ ...formdata }));
        setSaved(true);
        // setTimeout(() => {
        //     props.history.push(`/edit-item-file/${props.match.params.id }`)
        // }, 1000)
    }

    const renderChapters = () => {
        return (
            formdata.pdf_page_index.map( (chapt, i) => (
            
                <div className="index_form_grid_container" key={i}>
                    <div>
                        <input
                            type="number"
                            placeholder="Page Number"
                            defaultValue={chapt.page}
                            onChange={(event) => handleInput(event, 'page', i)}
                            
                        />
                    </div>
                
                    <div>
                        <input
                            type="text"
                            placeholder="Chapter Title"
                            defaultValue={chapt.heading}
                            onChange={(event) => handleInput(event, 'heading', i)}
                        />

                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Chapter Description"
                            defaultValue={chapt.description}
                            onChange={(event) => handleInput(event, 'description', i)}
                        />

                    </div>
                    {/* { chapt.has_child ? */}
                    { false ?
                        <div className="index_form_grid_button">
                            <Link to={`/items/${chapt.child_id}`} target='_blank'>
                                
                                View Item
                            </Link>
                        </div>
                    :
                        <div 
                            onClick={() => { if (window.confirm('This will make this chapter into its own separate item.')) createChapterItem(i) } }
                            className="index_form_grid_button"
                        >
                            Create New Archive Item
                        </div>
                    }
                </div>
            ))
        )
    }

    const renderForm = () => (
        <form onSubmit={onSubmit}>
            <h2>PDF Chapter Page Index:</h2>
            <div>
                {/* <div className="index_form_grid_container">
                    <div>Page Number</div>
                    <div>Chapter Title</div>
                    <div>Chapter Description</div>
                    <div></div>
                </div> */}
                {formdata && formdata.pdf_page_index ?
                    renderChapters()
                : null}
            </div>
        </form>
    )

    const renderButtons = () => (
        <div>
            <div className="index_add_cont">
                <div className="index_add_rem" onClick={addField}>+</div>
                

                <div className="index_add_rem" onClick={() => {if (window.confirm('This will delete the Sub-Category.')) removeField()}}>-</div>
                <span>Add/Remove Index</span>
            </div>

            <button type="submit" className="half_width_l" onClick={onSubmit}>Save and Return</button>
            <button type="button" className="half_width_l" onClick={() => { if (window.confirm('Cancelling will result in loss of all newly inputted information in this form.')) cancel() } }>Cancel</button>

        </div>
    )

    const renderPage = () => (
        <div>
            {renderForm()}
            {renderButtons()}
            {saved ?
                <p className="message center">Information saved!</p>
            : null}
        </div>
    )

    return (
        <div className="main_view">
            <div className="form_input item_form_input edit_page">
                {cancelled ?
                    <div className="index_cancelled">All changes cancelled. Please close this tab.</div>
                : saved ?
                    <div className="index_cancelled">All changes saved! Please close this tab.</div>
                :
                    renderPage()
                }
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    return {
        items:state.items
    }
}

export default connect(mapStateToProps)(ChapterIndex);