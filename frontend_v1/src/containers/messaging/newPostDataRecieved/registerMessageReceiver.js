import SOCKET_IO_EVENTS from '../../../../../socket-app/SOCKET_IO_EVENTS';
import { fromServerPostObject } from '../../posts/mappers';
import { mapObject } from '../../../utilities/ObjectUtilities';
import { setPost, removePost, batchFetchPosts } from '../../posts/actions';
import { removePostFromDashboardReferences } from '../../dashboard/actions';
import configuration from '../../../configuration';

let socket;
let store;
let storeStorageService;
let errorLoggingService;
let appEventPublisher;

function postDataReceivedMessageHandler(underscoredPost) {
  try {
    if(underscoredPost.model === configuration.MODEL_TYPES.post) {
  
      const camelCasedPost = mapObject.fromUnderScoredObject(underscoredPost);
      const clientPost = fromServerPostObject(camelCasedPost);
      storeStorageService.posts.setAsync(clientPost);
      store.dispatch(setPost(clientPost.id, clientPost));
      
      // load the associated refreshed data
      store.dispatch(batchFetchPosts([clientPost.id]));

      // Notify anyone in the app listening that we got new data that they may care about
      appEventPublisher.publishEvent(SOCKET_IO_EVENTS.posts.dataReceived, [ clientPost ]);
    }
  } catch(e) {
    errorLoggingService.error(`Failed to process new post data: ${e}`);
  }
};

function postDataRemovedMessageHandler(underscoredPost) {
  try {
    if(underscoredPost.model === configuration.MODEL_TYPES.post) {
  
      const camelCasedPost = mapObject.fromUnderScoredObject(underscoredPost);
      const clientPost = fromServerPostObject(camelCasedPost);
      storeStorageService.posts.removeAsync(clientPost.key);
      store.dispatch(removePost(clientPost));
      store.dispatch(removePostFromDashboardReferences(clientPost));

      // Notify anyone in the app listening that we got new data that they may care about
      appEventPublisher.publishEvent(SOCKET_IO_EVENTS.posts.dataRemoved, [ clientPost ]);
    }
  } catch(e) {
    errorLoggingService.error(`Failed to process delete post data: ${e}`);
  }
}

function registerMessageReceiver(
  socketImplementation, 
  storeImplementation, 
  storeStorageServiceImplementation, 
  errorLoggingServiceImplementation, 
  appEventPublisherInstance
) {
  socket = socketImplementation;
  store = storeImplementation;
  storeStorageService = storeStorageServiceImplementation;
  errorLoggingService = errorLoggingServiceImplementation;
  appEventPublisher = appEventPublisherInstance;

  socket.on(SOCKET_IO_EVENTS.posts.dataReceived, postDataReceivedMessageHandler);
  socket.on(SOCKET_IO_EVENTS.posts.dataRemoved, postDataRemovedMessageHandler);
}

export default registerMessageReceiver;