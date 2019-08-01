/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import forEach from 'lodash/forEach';
import { connect } from 'react-redux';
import CategoriesScrollBar from '../../CategoriesScrollBar/CategoriesScrollBar';
class CategoryItem extends Component{

  onSelectCategory = (event) => {
    event.stopPropagation();
    if(this.props.onSelectCategory) {
      this.props.onSelectCategory(this.props.id || this.props.parentId);
    }
  }

  render(){
    const {active, category, selectedCategoryId, selectedLoopId, statistics} = this.props;
    const subCategoriesDisplay = <CategoriesScrollBar parent={category} onSelectCategory={this.props.onSelectCategory} selectedCategoryId={selectedCategoryId} selectedLoopId={selectedLoopId }/>
    return(
      (!category.id || category.alwaysShowInMenus || (statistics && statistics.postCount > 0)) ? 
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events
           <div 
            className={`o-category-item ${active ? 'active' : ''} ${(statistics && statistics.postCount === 0) ? 'darkened' : ''}`} 
            onClick={statistics && statistics.postCount > 0 ? this.onSelectCategory : undefined}>
              {category.name }
              <span className="o-category-item-statistics">{statistics && statistics.postCount > 0 ? ` ${statistics.postCount}` : ''}</span>
              {
                (category.children && active) ? subCategoriesDisplay : ''
              }
          </div>
          :
          null
    );
  }
}

CategoryItem.propTypes = {
  // eslint-disable-next-line
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSelectCategory: PropTypes.func,
  active: PropTypes.bool,
  selectedCategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedLoopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // parentId used for when subcategory is "All"
  parentId: PropTypes.number
};

const mapStateToProps = (state, props) => {
  const { parentId } = props;
  let category;
  let statistics;

  if (props.id) {
    category = state.categories[props.id];
  } else {
    category = {id: null, name: "All", parentId};
  }

  forEach(state.categoryStatistics, categoryStat => {
    if (
      category.id
      && categoryStat.categoryId === props.id 
      && categoryStat.groupId === props.selectedLoopId
    ) {
      statistics = categoryStat;
    } 
    else if(!category.id) {
      // There's not a a category.id so this is an "all" fake.
      if(parentId) {
        // This item has a parent, so it's statistics is really
        // the statistics for the parent item
        if(
          categoryStat.categoryId === props.parentId 
          && categoryStat.groupId === props.selectedLoopId
        ) {
          statistics = categoryStat;
        }
      } else if (
        // This item does not have a parent, fetch the
        // statistics for the entire loop
        !categoryStat.categoryId
        && categoryStat.groupId === props.selectedLoopId
      ) {
        statistics = categoryStat;
      }
    }
  });

  return { category, statistics };
}

export default connect(mapStateToProps, null)(CategoryItem);