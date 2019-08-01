import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import forEach from 'lodash/forEach';
import intersection from 'lodash/intersection';
import map from 'lodash/map';

import Categories from '../Categories';
import CategoryItem from '../Categories/CategoryItem';

import './CategoriesScrollBar.scss';

class CategoriesScrollBar extends Component{

  constructor(props){
    super(props);
    this.categoriesRef = React.createRef();
  }
  
  scrollElement = (amount) => {
    this.categoriesRef.current.scrollLeft += amount;
  }
  /**
   * Not needed because we load all the categories once when the app loads.
   */
  // componentDidMount() {
  //   this.props.dispatchFetchCategories();
  // }

  // addActiveCategories = (props, category, allCategories, activeCategories) => {
  //   if(props.selectedCategoryId) {
  //     if(category === props.selectedCategoryId){
  //       activeCategories.push(allCategories[category].id);
  //       if(allCategories[category].parentId !== null) {
  //         activeCategories.push(allCategories[category].parentId);
  //       }
  //     }
  //   }
  //   return activeCategories;
  // }

  handleLeftClick = () => {
    this.scrollElement(window.innerWidth*(-0.6))
  }

  handleRightClick = () => {
    this.scrollElement(window.innerWidth*(0.6))
  }

  render() {
    const { categories, parent, activeCategories, onSelectCategory, selectedCategoryId, selectedLoopId } = this.props;

    if (Object.entries(categories).length < 2) {
      return null;
    }

    const activeCategoriesThisLevel = intersection(activeCategories, categories);
    const activeForThisLevel = (activeCategoriesThisLevel.length === 1) ? activeCategoriesThisLevel[0] : undefined;
    const activeForThisLevelId = activeForThisLevel ? activeForThisLevel.id : null;

    return(
      <div>
        <div className={`o-arrow o-left-arrow ${parent ? 'o-pushed-down-arrow' : ''}`} onClick={this.handleLeftClick}>{"<"}</div>
        <div className={`o-arrow o-right-arrow ${parent ? 'o-pushed-down-arrow' : ''}`} onClick={this.handleRightClick}>{">"}</div>
        <Categories reference={this.categoriesRef} className={`o-categories ${parent ? 'detached ' : ''}${this.props.sub ? '' : 'sub-item'}`}>
          {
            categories.map((category) => (
                <CategoryItem
                  key={category.id ? category.id : '-1'}
                  id={category.id}
                  active={category.id === activeForThisLevelId}
                  onSelectCategory={onSelectCategory}
                  selectedCategoryId={selectedCategoryId}
                  selectedLoopId={selectedLoopId}
                  parentId={parent ? parent.id : undefined} />
              ))
          }
        </Categories>
      </div>
    )
  }
}

CategoriesScrollBar.propTypes = {
  onSelectCategory: PropTypes.func,
  selectedCategoryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  selectedLoopId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  // eslint-disable-next-line react/forbid-prop-types
  parent: PropTypes.object
};

const mapStateToProps = (state, props) => {
  const allCategories = state.categories;
  const categories = [];
  const activeCategories = [];
  const parentId = props.parent ? props.parent.id : null;
  const { selectedCategoryId } = props;

  // we have a parent category, only show the children
  forEach(allCategories, (category) => {
    // Include all the categories to show (sharing the right parent ID)
    if(category.parentId === parentId) {
      categories.push(category);
    }

    // Conditionally include categories to mark as active
    if(selectedCategoryId) {
      // If the current category is the selected one, include it.
      if(category.id === selectedCategoryId){
        activeCategories.push(category);
        // And if the category has a parent, that one should be included
        if(category.parentId) {
          activeCategories.push(allCategories[category.parentId]);
        }
      }
    }
  });

  // Add on the all option
  categories.unshift({id: null});

  categories.sort((a, b) => {
    if(a.name < b.name) return -1;
    if(a.name > b.name) return 1;
    return 0;
  });

  return { categories, activeCategories };
}

export default connect(mapStateToProps)(CategoriesScrollBar);