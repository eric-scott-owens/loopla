import { createAction } from 'redux-actions';
import { ACTION_TYPES } from './ACTION_TYPES';

export const stopEditingAllComments = createAction(ACTION_TYPES.comment.stopEditingAll);
export const enableAllNewComments = createAction(ACTION_TYPES.comment.enableAllNew);