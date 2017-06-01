import { combineReducers } from 'redux';
import notes from './notes';
import user from './user';

const rootReducer = combineReducers({
    notes,
    user
});

export default rootReducer;