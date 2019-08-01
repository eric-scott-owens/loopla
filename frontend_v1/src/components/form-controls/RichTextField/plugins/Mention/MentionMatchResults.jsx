import React from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';


const MENTION_QUERY_REGEX = /@(\S*)$/

/**
 * Get get the potential mention query input.
 * @type {Value}
 */
function getMentionQuery(value) {
  // In some cases, like if the node that was selected gets deleted,
  // `startText` can be null.
  if (!value.startText) {
    return null
  }

  const startOffset = value.selection.start.offset
  const textBefore = value.startText.text.slice(0, startOffset)
  const result = MENTION_QUERY_REGEX.exec(textBefore)

  return result == null ? null : result[1]
}


/**
 * Determine if the current selection has valid ancestors for a context. In our
 * case, we want to make sure that the mention is only a direct child of a
 * paragraph. In this simple example it isn't that important, but in a complex
 * editor you wouldn't want it to be a child of another inline like a link.
 *
 * @param {Value} value
 */
function hasValidAncestors(value) {
  const { document, selection } = value

  const invalidParent = document.getClosest(
    selection.start.key,
    // In this simple case, we only want mentions to live inside a paragraph.
    // This check can be adjusted for more complex rich text implementations.
    node => node.type !== 'paragraph'
  )

  // If invalidParent is undefined, we're good to go. No ancestor could be found,
  // except for a paragraph (which is a valid parent).
  //
  // We also have to check for the document object as some queries walk right
  // past the paragraph element up to the document. In which case we are still
  // a valid element as the child of "document" is a paragraph.
  const invalidParentJs = invalidParent ? invalidParent.toJS() : undefined;
  return (!invalidParent || invalidParentJs.object === "document")
}


const DEFAULT_POSITION = {
  top: -10000
}

function getOffsetFromSlateEditorWithMentions(element, offsets = { top: 0 }) {
  if(element.classList.contains('slate-editor-with-mentions')) {
    return offsets;
  }

  const talliedOffsets = {
    top: offsets.top + element.offsetTop
  }
  
  const { offsetParent } = element;
  return getOffsetFromSlateEditorWithMentions(offsetParent, talliedOffsets);
}


class MentionMatchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchingResults: [],
      uniqueCounter: 0, // Used to delay addAnnotation until the editor has been updated

      position: DEFAULT_POSITION
    }

    this.query = undefined;
    this.debounceUpdateMatchingResultsAsync = debounce(this.updateMatchingResultsAsync, 500, { maxWait: 1000 });
  }

  componentDidMount() {
    this.props.options.changeNotifier.addListener(this.changeListener);
  }

  componentWillUnmount() {
    this.props.options.changeNotifier.removeListener(this.changeNotifier);
  }

  changeListener = (change) => {
    const query = getMentionQuery(change.value);
    const { CONTEXT_MARK_TYPE } = this.props.options.annotations;

    if (this.query !== query && hasValidAncestors(change.value)) {
      this.debounceUpdateMatchingResultsAsync(query);

      if(query && query.length > 0) {
        const { selection } = change.value

        const annotation = {
          key: 'MENTION-QUERY-ANNOTATION',
          type: CONTEXT_MARK_TYPE,
          anchor: {
            path: selection.start.path,
            key: selection.start.key,
            offset: selection.start.offset - (query ? (query.length + 1) : 1)
          },
          focus: {
            path: selection.start.path,
            key: selection.start.key,
            offset: selection.start.offset
          }
        };

        // Use this add a delay to ensure we don't update
        // the editor until the current change has already been
        // applied to it.
        this.setState(({ uniqueCounter }) => {
          this.props.editor.setAnnotation(annotation);
          return { uniqueCounter: uniqueCounter + 1 };
        });
      }
    }
  }

  updateMatchingResultsAsync = async (query) => {
    this.query = query;
    const matchingResults = await this.props.options.config.searchAsync(query);
    this.setState({ matchingResults });
    this.updateMenu();
  };

  updateMenu = () =>  {
    const { CONTEXT_MARK_ANCHOR_ID } = this.props.options.annotations;
    const anchor = window.document.querySelector(`#${CONTEXT_MARK_ANCHOR_ID}`);
    
    if (!anchor) {
      return this.setState(DEFAULT_POSITION);
    }
    
    const offsets = getOffsetFromSlateEditorWithMentions(anchor);
    
    return this.setState({
      position: {
        top: offsets.top + 20, // move the suggestions below the current line
      }
    });
  }

  insertMention = mention => {
    const { editor } = this.props
    const { value } = editor;
    const inputValue = getMentionQuery(value)

    // Delete the captured value, including the `@` symbol
    editor.deleteBackward(inputValue.length + 1)

    const selectedRange = value.selection

    editor
      .insertInlineAtRange(selectedRange, {
        data: {
          ...mention
        },
        nodes: [
          {
            object: 'text',
            text: mention.text
          },
        ],
        type: this.props.options.inlines.mention
      })
      .focus();
  }

  render() {
    const { matchingResults, position } = this.state;

    if(!matchingResults || matchingResults.length === 0) return null;

    return (
      <ul 
        className="mention-match-results"
        style={{
          top: position.top
        }}>
        {matchingResults.map(m => (
          <li key={m.id}><button type="button" onClick={() => this.insertMention(m)}>{m.description || m.text}</button></li>
        ))}
      </ul>
    )
  }

}

MentionMatchResults.propTypes = {
  options: PropTypes.shape({
    changeNotifier: PropTypes.shape({
      addListener: PropTypes.func.isRequired,
      removeListener: PropTypes.func.isRequired
    }).isRequired,
    config: PropTypes.shape({
      searchAsync: PropTypes.func.isRequired
    })
  }).isRequired,
  editor: PropTypes.shape({
    value: PropTypes.shape({}).isRequired
  }).isRequired
}

export default MentionMatchResults;