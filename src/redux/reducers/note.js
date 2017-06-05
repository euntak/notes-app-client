import {
    GET_NOTE,
    NEW_NOTE
} from '../actions';

const initialState = {
    isLoading: false,
    isDeleting: false,
    note: {},
}

export default function note(state = initialState, action) {
    switch (action.type) {
        case GET_NOTE:
            return {
                ...state,
                isLoading: false,
                note: action.note,
            }
        case NEW_NOTE:
            return {
                ...state,
                isLoading: false,
                note: action.note,
            }

        default:
            return state
    }
}