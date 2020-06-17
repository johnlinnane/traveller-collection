import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import { getAllCats, getItemById, updateItem } from '../../actions';


class Sandbox extends React.Component {
    
    state = {
        catOptions: [],
        selected: [],
        savedCats: [],
        updated: false
    }

    componentDidMount() {
        this.props.dispatch(getAllCats());
        this.props.dispatch(getItemById('5edcbc5027c3271205b2360a'));
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        
        let newCatOptions = prevState.catOptions;
        let newSelected = prevState.selected;

        // check if props have arrived
        if (nextProps.cats && nextProps.cats.length) {
            // create list of all categories and ids
            nextProps.cats.map( (cat, i) => {
                newCatOptions.push({
                    value: cat.cat_id,
                    label: cat.title
                })
            })

            // chack for any categories already set
            if (nextProps.items && nextProps.items.item && nextProps.items.item.category_ref && nextProps.items.item.category_ref.length ) {

                nextProps.items.item.category_ref.map( (catref, i) => {

                    let catTitle;

                    nextProps.cats.map( (cat, i) => {
                        if (cat.cat_id == catref) {
                            catTitle = cat.title;

                            newSelected.push({
                                value: catref,
                                label: catTitle
                            })
                        }
                    })
                })
                
            }
        }
        return {
            catOptions: newCatOptions,
            selected: newSelected,
            updated: true
        }
    }


    handleChange = (newValue) => {
        if (newValue && newValue.length) {
            this.setState({ 
                savedCats: [...newValue]
            });
        // newValue is not an array if empty
        } else {
            this.setState({ 
                savedCats: []
            });
        }


    };

    onClickHandler = () => {

        let updateData = {
            _id: '5edcbc5027c3271205b2360a',
            category_ref: []
        };

        if (this.state.savedCats && this.state.savedCats.length) {
            this.state.savedCats.map( cat => {
                updateData.category_ref.push(cat.value);
            })
        } 
 
        this.props.dispatch(updateItem({
            ...updateData
        }))
    }
    
    render() {
        
        const catOptions = this.state.catOptions;

        return (
            <div>
                {this.props.items.item && this.props.items.item.title ?
                    <h2>{this.props.items.item.title}</h2>
                : null }

                {this.state.updated ?
                    <Select
                        defaultValue={this.state.selected}
                        isMulti
                        name="colors"
                        options={catOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.handleChange}
                    />
                : null}

                <button type="button"onClick={this.onClickHandler}>Submit</button> 
            
            </div>
        );
    }
};
 

function mapStateToProps(state) {
    return {
        items:state.items,
        cats:state.cats.cats
    }
}

export default connect(mapStateToProps)(Sandbox);

