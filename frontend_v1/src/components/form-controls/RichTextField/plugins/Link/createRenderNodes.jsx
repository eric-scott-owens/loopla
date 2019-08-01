import React from 'react';
import AnchorBlock from './AnchorBlock';

export default (options) => (props, editor, next) => {
  const { attributes, children, node } = props
  const { classNames, ...otherAttributes } = (attributes || {});
  
  switch (node.type) {
    case options.blocks.link: {
      const { data } = node;
      const href = data.get('href');
      
      return (
        <AnchorBlock 
          href={href} 
          target="_blank"
          className={`${options.classNames.link} ${classNames || ''}`} 
          {...otherAttributes}
        >
          {children}
        </AnchorBlock>
      );
    }

    default: {
      return next();
    }
  }
}