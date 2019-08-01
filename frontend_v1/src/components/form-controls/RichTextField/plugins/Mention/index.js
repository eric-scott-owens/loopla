import ChangeNotifier from '../ChangeNotifier';

import createRenderInline from './createRenderInline';
import createRenderEditor from './createRenderEditor';
import createRenderAnnotation from './createRenderAnnotation';



export default function MentionPerson(options = {}) {
  
  const config = {
    searchAsync: undefined,
    ...options
  };

  const annotations = {
    CONTEXT_MARK_TYPE: 'mentionContext',
    CONTEXT_MARK_ANCHOR_ID: 'mention-context-anchor',
    ...config.annotations
  };

  const inlines = {
    mention: 'mention',
    ...config.inlines
  };

  const classNames = {
    mention: 'o-mention',
    ...config.classNames
  };

  const changeNotifier = new ChangeNotifier();

  const renderInline = createRenderInline({ config, annotations, inlines, classNames, changeNotifier });
  const renderAnnotation = createRenderAnnotation({ config, annotations, inlines, classNames, changeNotifier });
  const renderEditor = createRenderEditor({ config, annotations, inlines, classNames, changeNotifier });


  const onChange = async (change, editor) => {
    changeNotifier.notifyListeners(change, editor);
  }

  return [
    {
      renderInline,
      renderAnnotation,
      renderEditor,
      onChange,
      
      /**
       * The annotation mark type that the menu will position itself against. The
       * "context" is just the current text after the @ symbol.
       * @type {String}
       */
      schema: {
        inlines: {
          [inlines.mention]: {
            // It's important that we mark the mentions as void nodes so that users
            // can't edit the text of the mention.
            isVoid: true
          }
        }
      }

    }
  ];

}