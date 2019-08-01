import React from 'react';
import './categories.scss';


class Categories extends React.Component {
  render(){
    return(
      <div 
      ref={this.props.reference}
      className={`o-categories ${this.props.className}`}
      >
        {this.props.children}
      </div>
    );
  }
}
export default Categories;