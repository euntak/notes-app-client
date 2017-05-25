import { combineReducers } from 'redux';
import {
    REQUEST_NOTES,
    RECEIVE_NOTES_SUCCESS,
    RECEIVE_NOTES_FAILURE,
} from '../actions';

const initialState = {
    isLoading: false,
    list: [],
    userToken: '',
}

function notes(state = initialState, action) {
    switch (action.type) {
        case REQUEST_NOTES:
            return {
                ...state,
                isLoading: true,
                userToken: state.userToken,
            }
        case RECEIVE_NOTES_SUCCESS:
            return {
                ...state,
                list: action.notes,
                isLoading: false,
                userToken: state.userToken,
            }
        case RECEIVE_NOTES_FAILURE:
            return {
                ...state,
                isLoading: false,
                list: null,
                userToken: state.userToken
            }
        default:
            return state
    }
}

const rootReducer = combineReducers({
    notes
});

export default rootReducer;