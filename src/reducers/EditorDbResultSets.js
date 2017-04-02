import { createReducer } from './../actions';
import { Logger } from './../services/Logger';

const initialState = {
};

export default createReducer(initialState, {
  saveDbResultSets: (state, payload) => {
    const obj = {};
    obj[payload[0]] = payload[1];
    Logger.of('reducers.EditorDbResultSets.saveDbResultSets').info('payload=', payload);
    return Object.assign({}, state, obj);
  }
});
