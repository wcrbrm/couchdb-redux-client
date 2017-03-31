import { createReducer } from './../actions';
import { Logger } from './../engine/Logger';

const initialState = {
  loading: false,
  error: '',
  success: ''
};

export default createReducer(initialState, {
  DELETE_DOCUMENT: (state, payload) => {
    Logger.of('EditorDbDeleteDocuments.DELETE_DOCUMENT').info('payload=', payload);
    const obj = {
      loading: true
    };
    return Object.assign({}, state, obj);
  },
  SET_DELETE_DOCUMENT_ERROR: (state, payload) => {
    Logger.of('EditorDbDeleteDocuments.SET_DELETE_DOCUMENT_ERROR').info('payload=', payload);
    const obj = {
      loading: false
    };
    if (typeof payload === 'object') {
      if (payload.error && payload.reason) {
        obj.error = payload.reason;
      } else if (payload.error) {
        obj.error = payload.error;
      }
    } else if (typeof payload === 'string') {
      obj.error = payload;
    }
    return Object.assign({}, state, obj);
  },
  SET_DELETE_DOCUMENT_SUCCESS: (state, payload) => {
    Logger.of('EditorDbDeleteDocuments.SET_DELETE_DOCUMENT_SUCCESS').info('payload=', payload);
    const obj = {
      loading: false
    };
    if (typeof payload === 'object') {
      if (payload.ok) {
        obj.success = 'Your document has been successfully deleted.';
      }
    } else if (typeof payload === 'string') {
      obj.success = payload;
    }
    return Object.assign({}, state, obj);
  }
});
