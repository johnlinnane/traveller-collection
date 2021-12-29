import React from 'react';
import { connect } from 'react-redux';
import { WithContext as ReactTags } from 'react-tag-input';
import { updateItem } from '../actions';
 


const KeyCodes = {
  comma: 188,
  enter: 13,
};
 
const delimiters = [KeyCodes.comma, KeyCodes.enter];
 
class Tags extends React.Component {
    constructor(props) {
        super(props);
 
        this.state = {
            id: '',
            tags: [],
            suggestions: [
                { id: "Geography", text: "Geography" },
                { id: "History", text: "History" },
                { id: 'Literature', text: 'Literature' },
                { id: 'Photography', text: 'Photography' },
                { id: 'Music', text: 'Music' },
                { id: 'Theatre', text: 'Theatre' },
                { id: 'Visual Arts', text: 'Visual Arts' },
                { id: 'Language', text: 'Language' }
             ]
        };
        this.handleDelete = this.handleDelete.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDrag = this.handleDrag.bind(this);
    }
 
  

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            tags: nextProps.tags,
            id: nextProps.id,

        };
    }

    

    handleDelete(i) {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }
 
    handleAddition(tag) {
        this.setState(state => ({ tags: [...state.tags, tag] }));
        this.props.dispatch(updateItem({
            _id: this.state.id,
            tags: ['test']
            
        }
    ))
    }
 
    handleDrag(tag, currPos, newPos) {
        const tags = [...this.state.tags];
        const newTags = tags.slice();
 
        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);
 
        // re-render
        this.setState({ tags: newTags });
    }
 
    render() {
        const { tags, suggestions } = this.state;

        return (
            <div>
                <ReactTags tags={tags}
                    suggestions={suggestions}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
                    delimiters={delimiters} 
                    placeholder={'Enter some keywords here'}
                />
                
             </div>
        )
    }
};
 
const mapDispatchToProps = dispatch => ({
    dispatch       
 })

export default connect(null, mapDispatchToProps)(Tags);

