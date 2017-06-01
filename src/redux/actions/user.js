import userApi from '../../api/userApi';
import AWS from 'aws-sdk';
import { browserHistory } from 'react-router-dom';

export const LOGIN_USER = 'LOGIN_USER';
export const LOGIN_PENDER = 'LOGING_PENDER';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT_PENDER = 'LOGING_PENDER';
export const LOGOUT = 'LOGOUT';

export const UPDATE_USERTOKEN = 'UPDATE_USERTOKEN';

export function logingPender() {
    return {
        type: LOGIN_PENDER,
        isLoading: true,
        userToken: '',
        isLoadingUserToken: true,
    }
}

export function loginSuccess(userToken) {
    return {
        type: LOGIN_SUCCESS,
        isLoading: false,
        userToken,
        isLoadingUserToken: false,
    }
}

export function loginFailure(error) {
    return {
        type: LOGIN_FAILURE,
        isLoading: false,
        error,
        isLoadingUserToken: false,
    }
}

export function logoutPender() {
    return {
        type: LOGOUT_PENDER,
        isLoading: true,
        isLoadingUserToken: true,
    }
}

export function logout() {
    return {
        type: LOGOUT,
        isLoading: false,
        userToken: '',
        isLoadingUserToken: false,
    }
}

export function updateUserToken(userToken) {
    return {
        type: UPDATE_USERTOKEN,
        isLoading: false,
        userToken,
        isLoadingUserToken: false,
    }
}

export function loginUser(username, password) {
    return (dispatch) => {
        dispatch(logingPender())
        return userApi.login(username, password)
            .then(res => {
                // console.log(res);
                // dispatch(updateUserToken(res.userToken));
                return dispatch(loginSuccess(res));
            })
            .catch(error => {
                // console.log(error);
                return dispatch(loginFailure(error));
            });
    }
}

export function logoutUser(history) {
    console.log(history);
    // const { history , userToken } = this.state;
    return (dispatch) => {
        dispatch(logoutPender());
        const currentUser = userApi.getCurrentUser();

        if(currentUser !== null) {
            currentUser.signOut();
        }
        
        if(AWS.config.credentials) {
            AWS.config.credentials.clearCachedId();
        }

        localStorage.removeItem('userToken');

        if(localStorage.getItem('userToken') === null) {
            dispatch(logout());
            
        }

        // this.props.history.push('/result');
        history.push('/login');
    }
}