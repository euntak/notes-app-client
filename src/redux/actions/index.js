import axios from 'axios';

export const REQUEST_NOTES = 'REQUEST_NOTES';
export const RECEIVE_NOTES_SUCCESS = 'RECEIVE_NOTES_SUCCESS';
export const RECEIVE_NOTES_FAILURE = 'RECEIVE_NOTES_FAILURE';


export function requestNotes(userToken) {
    return {
        type: REQUEST_NOTES,
        userToken,
    }
}

export function receiveNotesSuccess(notes, userToken) {
    return {
        type: RECEIVE_NOTES_SUCCESS,
        notes,
        userToken,
    }
}

export function receiveNotesFailure(error, userToken) {
    return {
        type: RECEIVE_NOTES_FAILURE,
        error,
        userToken,
    }
}

export function fetchNotes(userToken) {
    return (dispatch) => {
        dispatch(requestNotes(userToken))
        const URL = 'https://97xouxnhli.execute-api.ap-northeast-2.amazonaws.com/prod';
        const config = {
            method: 'GET',
            baseURL: URL,
            url: '/notes',
            headers: {
                'Authorization': userToken,
            },
        };

        return axios(config)
            .then(function (response) {
                return dispatch(receiveNotesSuccess(response.data, userToken));
            })
            .catch(function (error) {
                return dispatch(receiveNotesFailure(error, userToken));
            });
    }
}