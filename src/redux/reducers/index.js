import { combineReducers } from 'redux';
import notes from './notes';
import note from './note';
import user from './user';

const rootReducer = combineReducers({
    notes,
    note,
    user
});

export default rootReducer;