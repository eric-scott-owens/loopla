import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as actions from '../../containers/categories/actions';
import BasicButton from '../BasicButton';
import TextFinder from '../TextFinder';

import './Category.scss';


class Category extends React.Component {
  componentDidMount() {
    if(this.props.id) {
      this.props.dispatchFetchCategory(this.props.id);
    }
  }

  onDelete = () => {
    if(this.props.onDelete) {
      this.props.onDelete(this.props.category);
    }
  }

  onClick = () => {
    if(this.props.onClick) {
      this.props.onClick(this.props.id);
    }
  }

  render() {
    const { category, count, noLink, onDelete, disabled } = this.props;
    if(!category) return null;

    const categoryContents = (
      <React.Fragment>
        <span className="o-category" >
          <span className="label o-category-label"><TextFinder>{category.pathName}</TextFinder></span>
        </span>

        {(count > 1) ? (<span className="o-category-count">{count}</span>) : null}

        { onDelete && (
          <button 
            type="button" 
            className="o-delete-category-button" 
            disabled={disabled}
            onClick={this.onDelete}>x</button> 
        )}
      </React.Fragment>
    );
    
    if(noLink) return (
      <div className="o-category-wrapper">
        {categoryContents}
      </div>
    );

    return (
      <BasicButton className="o-category-wrapper" onClick={this.onClick}>
        {categoryContents}
      </BasicButton>
    );
  }
}

Category.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  count: PropTypes.number,
  noLink: PropTypes.bool,
  onDelete: PropTypes.func,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
}

const mapStateToProps = (state, props) => {
  // Fetch the category from the store
  if(!props.category) {
    const  category = state.categories[props.id];
    return { category };
  }

  return {};
}

const mapDispatchToProps = (dispatch) => ({
  dispatchFetchCategory: (categoryId) => dispatch(actions.fetchCategory(categoryId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Category);