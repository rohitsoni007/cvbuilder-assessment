import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import resumeReducer from './resumeSlice';
import authReducer from './authSlice';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  customization: customizationReducer,
  resume: resumeReducer,
  auth: authReducer,
});

export default reducer;
