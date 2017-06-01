import {
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGING_PENDER,
    UPDATE_USERTOKEN,
    LOGOUT_PENDER,
    LOGOUT
} from '../actions/user';

const initialState = {
    isLoading: false,
    userToken: '',
    error:'',
    isLoadingUserToken: false,
}

export default function user(state = initialState, action) {
    switch(action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoading: false,
                userToken: action.userToken,
            }
        case LOGIN_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.error,
            }        
        case LOGING_PENDER:
            return {
                ...state,
                isLoading: true,
                isLoadingUserToken: true,
                userToken: action.userToken,
            }
        case UPDATE_USERTOKEN:
            return {
                ...state,
                userToken: action.userToken,
            }
        case LOGOUT_PENDER:
            return {
                ...state,
                isLoading: true,
                userToken: action.userToken,
            }
        case LOGOUT:
            return initialState
        default: 
            return state
    }
}
