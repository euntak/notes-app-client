import {
    REQUEST_NOTES,
    RECEIVE_NOTES_SUCCESS,
    RECEIVE_NOTES_FAILURE,
    GET_NOTE
} from '../actions';

const initialState = {
    isLoading: false,
    list: [],
    userToken: '',
}

export default function notes(state = initialState, action) {
    switch (action.type) {
        case REQUEST_NOTES:
            return {
                ...state,
                isLoading: true,
                userToken: action.userToken,
            }
        case RECEIVE_NOTES_SUCCESS:
            return {
                ...state,
                list: action.notes,
                isLoading: false,
            }
        case RECEIVE_NOTES_FAILURE:
            return {
                ...state,
                isLoading: false,
                list: null,
            }
        case GET_NOTE:
            return {
                ...state,
                isLoading: false,
                userToken: action.userToken
            }

        default:
            return state
    }
}