import loggedReducer from './isLogged';

import { combineReducers } from 'redux';
import Alert from './alert';

const rootReducer = combineReducers({
  isLogged: loggedReducer,
  alert: Alert,
});
export default rootReducer;
