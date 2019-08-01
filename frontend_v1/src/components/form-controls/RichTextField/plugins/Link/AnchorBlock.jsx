import React from 'react';

const AnchorBlock = (props) => {
  const { href, className, target, children, ...others } = props
  let finalHref = href;

  if(href.toLowerCase().indexOf('http') !== 0) {
    finalHref = `http://${href}`;
  }
  
  return (
    <a 
      href={finalHref}
      target={target}
      className={className} 
      rel="noopener noreferrer"
      {...others} 
    >
      {children}
    </a>
  )
}

export default AnchorBlock;