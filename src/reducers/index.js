import { routerReducer } from 'react-router-redux';
import editorLoadingReducer from './EditorLoadingReducer';
import editorDbDocuments from './EditorDbDocuments';
import editorDbResultSets from './EditorDbResultSets';
import editorDbResultMaps from './EditorDbResultMaps';
import editorDbNewDocuments from './EditorDbNewDocuments';
import editorDbDeleteDocuments from './EditorDbDeleteDocuments';
import queriesReducer from './QueriesReducer';
import editorDbMessagesReducer from './EditorDbMessagesReducer';
import editorDbResultsReducer from './EditorDbResultsReducer';

// this file is partially working, please see also EditorApplication.js
// to add more reducers to the application
export default {
  routing: routerReducer,
  editLoading: editorLoadingReducer,
  dbDocuments: editorDbDocuments,
  dbResultSets: editorDbResultSets,
  dbResultMaps: editorDbResultMaps,
  dbNewDocuments: editorDbNewDocuments,
  dbDeleteDocuments: editorDbDeleteDocuments,
  queries: queriesReducer,
  editorDbMessages: editorDbMessagesReducer,
  editorDbResults: editorDbResultsReducer
};
