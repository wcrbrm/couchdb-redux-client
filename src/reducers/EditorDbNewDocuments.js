import { createReducer } from './../actions';
import { Logger } from './../services/Logger';

const initialState = {
  loading: false,
  error: ''
};

export default createReducer(initialState, {
  ADD_DOCUMENT: (state, payload) => {
    Logger.of('EditorDbNewDocuments.ADD_DOCUMENT').info('payload=', payload);
    const obj = {
      loading: true
    };
    return Object.assign({}, state, obj);
  },
  SET_DOCUMENT_ERROR: (state, payload) => {
    Logger.of('EditorDbNewDocuments.SET_DOCUMENT_ERROR').info('payload=', payload);
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
  }
});
