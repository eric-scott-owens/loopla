class SearchContext {
  textQuery;

  tagQuery;

  placeIdQuery;

  constructor(searchContext) {
    if(searchContext) {
      if(searchContext.textQuery) { this.textQuery = searchContext.textQuery; }
      if(searchContext.tagQuery) { this.tagQuery = searchContext.tagQuery; }
      if(searchContext.placeIdQuery) { this.placeIdQuery = searchContext.placeIdQuery; }
    }
  }
}

export default SearchContext;