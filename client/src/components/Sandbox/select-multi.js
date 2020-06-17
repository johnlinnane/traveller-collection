import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import { getAllCats, getItemById, updateItem } from '../../actions';


class Sandbox extends React.Component {
    
    state = {
        catOptions: [],
        existingCats: [],
        updatedCats: [],
        catsAreUpdated: false
    }

    componentDidMount() {
        this.props.dispatch(getAllCats());
        this.props.dispatch(getItemById('5edcbc5027c3271205b2360a'));
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        
        let catOptionsFromProps = prevState.catOptions;
        let catsFromProps = prevState.existingCats;

        if (nextProps.cats && nextProps.cats.length) {
            nextProps.cats.map( (cat, i) => {
                catOptionsFromProps.push({
                    value: cat.cat_id,
                    label: cat.title
                })
            })

            if (nextProps.items && nextProps.items.item && nextProps.items.item.category_ref && nextProps.items.item.category_ref.length ) {
                nextProps.items.item.category_ref.map( (catref, i) => {
                    let catTitle;
                    nextProps.cats.map( (cat, i) => {
                        if (cat.cat_id == catref) {
                            catTitle = cat.title;
                            catsFromProps.push({
                                value: catref,
                                label: catTitle
                            })
                        }
                    })
                })
            }
        }
        return {
            catOptions: catOptionsFromProps,
            existingCats: catsFromProps,
            catsAreUpdated: true
        }
    }


    handleChangeCats = (newValue) => {
        if (newValue && newValue.length) {
            this.setState({ 
                updatedCats: [...newValue]
            });
        } else {
            this.setState({ 
                updatedCats: []
            });
        }


    };

    onClickHandlerCats = () => {
        let updateData = {
            _id: '5edcbc5027c3271205b2360a',
            category_ref: []
        };
        if (this.state.updatedCats && this.state.updatedCats.length) {
            this.state.updatedCats.map( cat => {
                updateData.category_ref.push(cat.value);
            })
        } 
        this.props.dispatch(updateItem({
            ...updateData
        }))
    }
    
    render() {


        return (
            <div>
               

                {this.state.catsAreUpdated && this.props.items && this.props.items.item ?
                    <Select
                        defaultValue={this.state.existingCats}
                        isMulti
                        name="colors"
                        options={this.state.catOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={this.handleChangeCats}
                    />
                : null}

                <button type="button"onClick={this.onClickHandlerCats}>Submit</button> 
            
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

