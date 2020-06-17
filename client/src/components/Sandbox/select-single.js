import React from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';

import { getAllColls, getItemById, updateItem } from '../../actions';


class Sandbox extends React.Component {
    
    state = {
       
        collOptions: [{ value: null, label: 'None' } ],
        existingColl: null,
        updatedColl: null,
        collIsUpdated: false,
  
        isClearable: true,
        isDisabled: false,
        isLoading: false,
        isRtl: false,
        isSearchable: true,
      };

    componentDidMount() {
        this.props.dispatch(getAllColls());
        this.props.dispatch(getItemById('5edcbc5027c3271205b2360a'));
    }


    static getDerivedStateFromProps(nextProps, prevState) {
        


        let collOptionsFromProps = [];
        let collFromProps = null;


        if (nextProps.colls && nextProps.colls.length) {
            nextProps.colls.map( coll => {
                collOptionsFromProps.push({
                    value: coll.id,
                    label: coll.title
                })
            })

            if (nextProps.items && nextProps.items.item && nextProps.items.item.collection_id) {
                nextProps.colls.map ( coll => {
                    let collTitle = null;
                    if (coll.id == nextProps.items.item.collection_id) {
                        collTitle = coll.title;

                        collFromProps = {
                            value: nextProps.items.item.collection_id,
                            label: collTitle
                        }
                    }
                })
            }


            return {
                collOptions: [...prevState.collOptions, ...collOptionsFromProps],
                existingColl: collFromProps,
                collIsUpdated: true
            }
 
        }
               
    }


    handleChangeColl = (newValue) => {
        console.log(newValue);
        if (newValue) {
            this.setState({ 
                updatedColl: newValue
            });
        } 
    };

    onClickHandlerColl = () => {

        let updateData = {
            _id: '5edcbc5027c3271205b2360a',
            collection_id: null
        };
        if (this.state.updatedColl ) {
            updateData.collection_id = this.state.updatedColl.value;
        } 
        this.props.dispatch(updateItem({
            ...updateData
        }))
    }
    
    render() {

        const {
            isClearable,
            isSearchable,
            isDisabled,
            isLoading,
            isRtl,
          } = this.state;


        

        return (
            <div>
                    
                {this.state.collIsUpdated && this.props.items && this.props.items.item  ?
                    <Select
                        className="basic-single"
                        classNamePrefix="select"
                        defaultValue={this.state.existingColl}
                        isDisabled={isDisabled}
                        isLoading={isLoading}
                        isClearable={isClearable}
                        isRtl={isRtl}
                        isSearchable={isSearchable}
                        name="color"
                        options={this.state.collOptions}
                        onChange={this.handleChangeColl}
                    />
                : null}

                <button type="button"onClick={this.onClickHandlerColl}>Submit</button> 
            
            </div>
        );
    }
};
 

function mapStateToProps(state) {
    return {
        items:state.items,
        colls:state.collections.colls
    }
}

export default connect(mapStateToProps)(Sandbox);

