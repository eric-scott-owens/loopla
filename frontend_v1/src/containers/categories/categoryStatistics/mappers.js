import forEach from 'lodash/forEach';
import { mapObject } from '../../../utilities/ObjectUtilities';
import { fromServerPostReferenceObject } from '../../posts/mappers';

// eslint-disable-next-line
export function fromServerCategoryStatisticsObject(categoryStatistics) {
  const convertedCategoryStatistics = mapObject.fromServerDatabaseObject(categoryStatistics)
  
  convertedCategoryStatistics.postReferences = [];
  forEach(categoryStatistics.postReferences, postReference => {
    const convertedPostReference = fromServerPostReferenceObject(postReference);
    convertedCategoryStatistics.postReferences.push(convertedPostReference);
  });

  return convertedCategoryStatistics;
}
