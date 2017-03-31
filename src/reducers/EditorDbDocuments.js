import { createReducer } from './../actions';

const initialState = {
};

export default createReducer(initialState, {
  SAVE_DOCUMENTS: (state, documents) => {
    const newState = Object.assign({}, state);
    Object.keys(documents).forEach((docId) => {
      newState[docId] = documents[docId];
    });
    return newState;
  },
  saveDbDocument: (state, payload) => {
    const obj = {};
    obj[payload[0]] = payload[1];
    return Object.assign({}, state, obj);
  }
});
