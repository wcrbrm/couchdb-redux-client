import { createReducer } from './../actions';
import { Logger } from './../services/Logger';

const initialState = {
  loading: false
};

export default createReducer(initialState, {
  WAIT_STARTED: (state) => {
    Logger.of('QueriesReducer.WAIT_STARTED').info('Started');
    return Object.assign({}, state, { loading: true });
  },
  WAIT_FINISHED: (state) => {
    Logger.of('QueriesReducer.WAIT_FINISHED').info('Finished');
    return Object.assign({}, state, { loading: false });
  }
});
