import { mapObject } from '../../utilities/ObjectUtilities';

// We expect we will have more mappers here in the future
// eslint-disable-next-line
export function fromServerSearchResult(searchResult) {
  const mappedSearchResult = mapObject.fromUnderScoredObject(searchResult);

  mappedSearchResult.posts = searchResult.posts.map(pr => ({
    id: pr.id,
    ownerId: pr.owner
   }));
  mappedSearchResult.error = '';

  return mappedSearchResult;
}

