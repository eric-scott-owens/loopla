import React from 'react';
import MentionMatchResults from './MentionMatchResults';
import './mention.scss';

export default (options) => (props, editor, next) => {
  const children = next();
  return (
    <div className="slate-editor-with-mentions">
      {children}
      <MentionMatchResults editor={editor} options={options} />
    </div>
  )
}
