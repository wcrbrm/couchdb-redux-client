import { createReducer } from './../actions';
import { Logger } from './../services/Logger';

const initialState = {
};

export default createReducer(initialState, {
  saveDbResultMaps: (state, payload) => {
    const obj = {};
    obj[payload[0]] = payload[1];
    return Object.assign({}, state, obj);
  }
});
