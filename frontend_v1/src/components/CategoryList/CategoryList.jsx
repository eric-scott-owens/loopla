import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import forEach from 'lodash/forEach';
import keys from 'lodash/keys';
import orderBy from 'lodash/orderBy';

import Category from '../Category';
import { batchFetchCategories } from '../../containers/categories/actions';

import "./CategoryList.scss";

class CategoryList extends React.Component {

  componentDidMount() {
    if(this.props.categoryIds && this.props.categoryIds.length > 0) {
      this.props.dispatchBatchFetchCategories(this.props.categoryIds);
    }
  }

  shouldComponentUpdate(nextProps) {
    if(
      this.props.categoryIds !== nextProps.categoryIds 
      && nextProps.categoryIds
      && nextProps.categoryIds.length > 0
    ) {
      this.props.dispatchBatchFetchCategories(nextProps.categoryIds);
    }

    return true;
  }

  render() {
    const {categoryIds, categoryUsage} = this.props;
    if(!categoryIds) return null;
    
    return (
      <div className="o-category-list">
        <React.Fragment>
          {categoryUsage.map(c => (<Category key={c.id} id={c.id} count={c.count} onClick={this.props.onClick} />))}
        </React.Fragment>
      </div>
    )
  }
} 

CategoryList.propTypes = {
  categoryIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  onClick: PropTypes.func
}

const mapStateToProps = (state, props) => {
  const categoryIds = (props.categoryIds || []).slice(0);

  // Add counts
  const usageDictionary = {};
  forEach(categoryIds, (id) => {
    const indexedUsage = usageDictionary[id] || { id, count: 0 };
    usageDictionary[id] = { ...indexedUsage, count: (indexedUsage.count + 1) };
  });

  // Sort by name
  let categories = [];
  forEach(keys(usageDictionary), categoryId => { 
    if(state.categories[categoryId]) {
      categories.push(state.categories[categoryId]); 
    } 
  });
  
  categories = orderBy(categories, 'name');

  // Return the sorted usage
  const categoryUsage = categories.map(c => usageDictionary[c.id]);

  return { categoryUsage };
  
}

const mapDispatchToProps = (dispatch) => ({
  dispatchBatchFetchCategories: (categoryIds) => dispatch(batchFetchCategories(categoryIds))
});

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);