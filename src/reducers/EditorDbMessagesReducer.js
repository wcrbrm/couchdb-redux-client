import { createReducer } from './../actions';
import { Logger } from './../services/Logger';

const initialState = {
  error: '',
  success: ''
};

export default createReducer(initialState, {
  SET_ERROR_MESSAGES: (state, payload) => {
    Logger.of('EditorDbMessagesReducer.SET_ERROR_MESSAGES').info('payload=', payload);
    const message = Object.assign({}, initialState);
    if (typeof payload === 'object') {
      if (payload.error && payload.reason) {
        message.error = payload.reason;
      } else if (payload.error) {
        message.error = payload.error;
      }
    } else if (typeof payload === 'string') {
      message.error = payload;
    }
    return Object.assign({}, state, message);
  },
  SET_SUCCESS_MESSAGES: (state, payload) => {
    Logger.of('EditorDbMessagesReducer.SET_SUCCESS_MESSAGES').info('payload=', payload);
    const message = Object.assign({}, initialState);
    if (typeof payload === 'object') {
      if (payload.ok) {
        message.success = payload.ok;
      }
    } else if (typeof payload === 'string') {
      message.success = payload;
    }
    return Object.assign({}, state, message);
  },
  CLEAN_ALL_MESSAGES: (state) => {
    const messages = Object.assign({}, initialState);
    messages.error = '';
    messages.success = '';
    return Object.assign({}, state, messages);
  }
});
