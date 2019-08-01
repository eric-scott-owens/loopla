import React from 'react';
import PropTypes from 'prop-types';
import { Editor } from 'slate-react';
import ListsPlugin from '@convertkit/slate-lists';
import Keymap from '@convertkit/slate-keymap';

import FormatBold from '@material-ui/icons/FormatBold';
import FormatItalic from '@material-ui/icons/FormatItalic';
import FormatListBulleted from '@material-ui/icons/FormatListBulleted';
import FormatListNumbered from '@material-ui/icons/FormatListNumbered';
import FormatIndentIncrease from '@material-ui/icons/FormatIndentIncrease';
import FormatIndentDecrease from '@material-ui/icons/FormatIndentDecrease';
import InsertLink from '@material-ui/icons/InsertLink';

import IconButton from '../../IconButton';
import LinkPlugin from './plugins/Link';
// import MentionPlugin from './plugins/Mention';
import BoldMark from './marks/BoldMark';
import ItalicMark from './marks/ItalicMark';


/**
 * Used to simulate sending a next function. Used by the event handlers
 * we have added on top of the Slate Editor ones to make our API 
 * more consistent to use
 */
function simulatedNextFunc() {};


class SlateEditor extends React.Component {

  constructor(props) {
    super(props);
    this.editor = React.createRef();

    this.plugins = [
      ListsPlugin(),
      LinkPlugin(),
      // MentionPlugin({
      //   searchAsync: props.searchPeopleAsync,
      //   inlines: {
      //     mention: 'mentionPerson'
      //   }
      // }),
      Keymap({
        'mod+b': (event, editor) => editor.toggleMark('bold'),
        'mod+i': (event, editor) => editor.toggleMark('italic'),
        'mod+k': (event, editor) => editor.toggleLink(),
        'mod+shift+7': (event, editor) => editor.toggleList({ type: 'ordered-list' }),
        'mod+shift+8': (event, editor) => editor.toggleList()
      })
    ];
    
  }

  shouldComponentUpdate(nextProps) {
    if(this.props.value === nextProps.value
      && this.props.disabled === nextProps.disabled
      && this.props.placeholder === nextProps.placeholder
    ) {
      return false;
    }
    return true;
  }

  onChange = (change) => {
    if(this.props.onChange) {
      if(!this.props.value || this.props.value.document !== change.value.document) {
        this.props.onChange(change);
      }
    }
  }

  onKeyDown = (event, editor, next) => {
    let returnValue;
    if(this.props.onKeyDown) {
      returnValue = this.props.onKeyDown(event, editor, next);
    }

    return returnValue || next();
  }

  onFocus = (event, editor, next) => {
    let returnValue;
    if(this.props.onFocus) {
      returnValue = this.props.onFocus(event, editor, next);
    }

    return returnValue || next();
  }

  onBlur = (event, editor, next) => {
    let returnValue;
    if(this.props.onBlur) {
      returnValue = this.props.onBlur(event, editor, next);
    }

    // Temporarily store the current selection state
    // in case one of our toolbar buttons is being pressed
    // Clear it shortly thereafter so that we can't try to
    // restore stale focus data
    this.lastSelection = editor.value.selection;
    setTimeout(() => { this.lastSelection = undefined; }, 500);

    return returnValue || next();
  }

  onToolbarClick = (event) => {
    if(this.props.onToolbarClick) {
      this.props.onToolbarClick(event, this.editor, simulatedNextFunc);
    }
  }

  onToolbarButtonClick = (event) => {
    if(this.props.onToolbarButtonClick) {
      this.props.onToolbarButtonClick(event, this.editor, simulatedNextFunc);
    }
  }

  toggleBold = (event) => {
    event.preventDefault();
    if(this.props.disabled) return;
    this.editor.current.select(this.lastSelection || this.editor.current.selection()).toggleMark('bold');
    this.onToolbarButtonClick(event);
  }

  toggleItalic = (event) => {
    event.preventDefault();
    if(this.props.disabled) return;
    this.editor.current.select(this.lastSelection || this.editor.current.selection()).toggleMark('italic');
    this.onToolbarButtonClick(event);
  }

  toggleLink = (event) => {
    const { lastSelection } = this; // Need to save because the prompt from editor's toggleLink will have missed the window we make it available off of this.lastSelection
    event.preventDefault();
    if(this.props.disabled) return;
    this.editor.current.toggleLink();
    this.onToolbarButtonClick(event);

    if(lastSelection) {
      this.editor.current.select(lastSelection);
    }
  }

  toggleList = (event) => {
    event.preventDefault();
    if(this.props.disabled) return;
    this.editor.current.select(this.lastSelection || this.editor.current.selection()).toggleList();
    this.onToolbarButtonClick(event);
  }

  toggleOrderedList = (event) => {
    event.preventDefault();
    if(this.props.disabled) return;
    this.editor.current.select(this.lastSelection || this.editor.current.selection()).toggleList({ type: 'ordered-list' });
    this.onToolbarButtonClick(event);
  }

  indent = event => {
    event.preventDefault();
    if(this.props.disabled) return;
    this.editor.current.select(this.lastSelection || this.editor.current.selection()).increaseListItemDepth();
    this.onToolbarButtonClick(event);
  };

  outdent = event => {
    event.preventDefault();
    if(this.props.disabled) return;
    this.editor.current.select(this.lastSelection || this.editor.current.selection()).decreaseListItemDepth();
    this.onToolbarButtonClick(event);
  };

  renderMark = (props, editor, next) => {
    switch (props.mark.type) {
      case 'bold':
        return <BoldMark {...props} />
      case 'italic':
        return <ItalicMark {...props} />
      default:
        return next();
    }
  }

  render() {
    const { disabled, placeholder, value } = this.props;

    return (
      <React.Fragment>
        <div className='o-rich-text-editor-toolbar' onClick={this.onToolbarButtonClick} onKeyDown={this.onToolbarButtonClick} role="toolbar" >
          <IconButton onClick={this.toggleBold} disabled={disabled}><FormatBold /></IconButton>
          <IconButton onClick={this.toggleItalic} disabled={disabled}><FormatItalic /></IconButton>
          <IconButton onClick={this.toggleLink} disabled={disabled}><InsertLink /></IconButton>
          <IconButton onClick={this.toggleList} disabled={disabled}><FormatListBulleted/></IconButton>
          <IconButton onClick={this.toggleOrderedList} disabled={disabled}><FormatListNumbered/></IconButton>
          <IconButton onClick={this.indent} disabled={disabled}><FormatIndentIncrease/></IconButton>
          <IconButton onClick={this.outdent} disabled={disabled}><FormatIndentDecrease/></IconButton>
        </div>

        <Editor 
          ref={this.editor}
          plugins={this.plugins}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={disabled}
          defaultValue={value}
          onChange={this.onChange} 
          onKeyDown={this.onKeyDown}
          renderMark={this.renderMark}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          />
      </React.Fragment>
    );
  }
}

SlateEditor.propTypes = {
  value: PropTypes.shape({}),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onToolbarClick: PropTypes.func,
  onToolbarButtonClick: PropTypes.func,

  searchPeopleAsync: PropTypes.func
};

export default SlateEditor;