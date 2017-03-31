import { createReducer } from './../actions';

const initialState = {
  loading: false,
  error: ''
};

export default createReducer(initialState, {
  saveStarted: (state, payload) => {
    const obj = {
      loading: true
    };
    return Object.assign({}, state, obj);
  },
  saveFinished: (state, payload) => {
    const obj = {
      loading: false
    };
    return Object.assign({}, state, obj);
  },
  saveError: (state, payload) => {
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
