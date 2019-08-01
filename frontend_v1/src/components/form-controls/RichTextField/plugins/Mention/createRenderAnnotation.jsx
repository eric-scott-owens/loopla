import React from 'react';

export default (options) => (props, editor, next) => {
  const { children, annotation, attributes } = props;
  const { CONTEXT_MARK_TYPE, CONTEXT_MARK_ANCHOR_ID } = options.annotations;

  switch (annotation.type) {
    case CONTEXT_MARK_TYPE: {
      return (
        // Adding the className here is important so that the `Suggestions`
        // component can find an anchor.
        <span {...attributes} className="mention-context" id={CONTEXT_MARK_ANCHOR_ID}>
          {children}
        </span>
      )
    }
    default:
      return next();
  }
}
