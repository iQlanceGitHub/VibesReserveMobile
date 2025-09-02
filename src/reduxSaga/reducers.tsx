import {combineReducers} from 'redux';
import authReducer from '../redux/auth/reducer';

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    auth: authReducer,
    ...injectedReducers,
  });

  return rootReducer;
}
