import React from 'react';
import PropTypes from 'prop-types';
import { InputGroup, InputGroupAddon, Input, Button } from 'reactstrap';
import classNames from 'classnames'

import { isNullOrWhitespace } from '../../utilities/StringUtilities';

import './SearchBar.scss';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: props.query || '',
      isFocused: false
    };
  }
  
  onSearch = () => {
    const { query } = this.state;
    if(!isNullOrWhitespace(query)) {
      this.props.onSearch(this.state.query);
    }
  }

  onClearSearch = () => {
    this.setState({query: ''});
  }

  onKeyPress = (event) => {
    if(event.key === 'Enter') {
      event.preventDefault();
      this.onSearch();
    }
  }

  onFocus = () => {
    this.setState({ isFocused: true });
  }

  onBlur = () => {
    this.setState({ isFocused: false });
  }

  handleQueryChange = (e) => {
    this.setState({query: e.target.value});
  }

  render() {
    const { query, isFocused } = this.state;
    return (
      <React.Fragment>
        <InputGroup className={classNames('o-search-bar', {'input-is-focused': isFocused})}>
          <Input 
            placeholder="Search" 
            required
            value={query}
            onChange={this.handleQueryChange}
            onKeyPress={this.onKeyPress}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            />
          { (query) && (
            <InputGroupAddon addonType="append" className="o-clear-search-addon">
              <Button 
                type="button" 
                onClick={this.onClearSearch} className="o-button-clear-search">
                <i className="fa fa-times-circle" aria-label="Clear Search" alt="Clear Search" />
              </Button>
            </InputGroupAddon>
          )}
          <InputGroupAddon addonType="append">
            <Button 
              type="button" 
              onClick={this.onSearch} className="o-button-search">
              <i className="fa fa-search" aria-label="Search" alt="Search" />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </React.Fragment>
    )
  }
} 

SearchBar.propTypes = {
  query: PropTypes.string,
  onSearch: PropTypes.func.isRequired
}

export default SearchBar