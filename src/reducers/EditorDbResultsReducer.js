import { createReducer } from './../actions';

const initialState = {};

export default createReducer(initialState, {
  DB_RESULT_SET: (state, payload) => {
    const obj = {};
    obj[payload[0]] = payload[1];
    return Object.assign({}, state, obj);
  },
  DB_RESULT_MAP: (state, payload) => {
    const obj = {};
    obj[payload[0]] = payload[1];
    return Object.assign({}, state, obj);
  }
});
