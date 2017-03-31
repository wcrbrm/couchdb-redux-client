import { createReducer } from './../actions';

const initialState = {
};

export default createReducer(initialState, {
  saveDbConfig: (state, payload) => {
    const obj = {};
    obj[payload[0]] = payload[1];
    return Object.assign({}, state, obj);
  }
});
