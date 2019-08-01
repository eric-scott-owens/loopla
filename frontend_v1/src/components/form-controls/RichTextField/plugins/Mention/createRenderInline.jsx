import React from 'react';

export default (options) => (props, editor, next) => {
  const { attributes, node } = props
  const { classNames, ...otherAttributes } = (attributes || {});

  switch (node.type) {
    case options.inlines.mention: {
      return (
        <span
          {...otherAttributes} 
          className={`${options.classNames.mention} ${classNames || ''}`} 
          href="#"
          disabled
        >
          {'@'}{node.text}
        </span>
      )
    }

    default: {
      return next();
    }
  }
}