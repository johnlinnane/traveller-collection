import React from 'react';
import { connect } from 'react-redux';
import CreatableSelect from 'react-select/creatable';


import { getItemById, updateItem } from '../../actions';


class Sandbox extends React.Component {
    
    state = {
        existingTags: [],
        updatedTags: [],
        tagsAreUpdated: false
    }

    componentDidMount() {
        this.props.dispatch(getItemById('5edcbc5027c3271205b2360a'));
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        let tagsFromProps = [];

        if (nextProps.items.item && nextProps.items.item.tags) {
            nextProps.items.item.tags.map( tag => {
                tagsFromProps.push({
                    value: tag.value,
                    label: tag.label
                })
            })
            
        }
        return {
            existingTags: tagsFromProps,
            tagsAreUpdated: true
        }
    }


    handleChangeTags = (newValue) => {
        if (newValue && newValue.length) {
            console.log(newValue)
            this.setState({ 
                updatedTags: [...newValue]
            });

        } else {
            this.setState({ 
                updatedTags: []
            });
        }
    };

    onClickHandlerTags = () => {
        let updateData = {
            _id: '5edcbc5027c3271205b2360a',
            tags: []
        };

        if (this.state.updatedTags && this.state.updatedTags.length) {
            this.state.updatedTags.map( tag => {
                updateData.tags.push(tag);
            })
        } 
        this.props.dispatch(updateItem({
            ...updateData
        }))
    }
    
    render() {



        return (
            <div>
               

                {this.state.tagsAreUpdated && this.props.items && this.props.items.item?
                    <CreatableSelect
                        defaultValue={this.state.existingTags}
                        isMulti
                        onChange={this.handleChangeTags}
                        options={this.state.updatedTags}
                    />
                : null}

                <button type="button"onClick={this.onClickHandlerTags}>Submit</button> 
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

