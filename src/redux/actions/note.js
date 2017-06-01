import axios from 'axios';
import noteApi from '../../api/noteApi';

export const REQUEST_NOTES = 'REQUEST_NOTES';
export const RECEIVE_NOTES_SUCCESS = 'RECEIVE_NOTES_SUCCESS';
export const RECEIVE_NOTES_FAILURE = 'RECEIVE_NOTES_FAILURE';

export const GET_NOTE = 'GET_NOTE';
export const NEW_NOTE = 'NEW_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const SAVE_NOTE = 'SAVE_NOTE';

export function getNote(noteid, userToken) {
    return {
        type: GET_NOTE,
        noteid,
        userToken,
    }
}

export function newNote(content) {
    return {
        type: NEW_NOTE,
        content
    }
}

export function deleteNote(noteid) {
    return {
        type: DELETE_NOTE,
        noteid
    }
}

export function saveNote(noteid, content) {
    return {
        type: SAVE_NOTE,
        noteid,
        content
    }
}

export function requestNotes(userToken) {
    return {
        type: REQUEST_NOTES,
        userToken,
    }
}

export function receiveNotesSuccess(notes) {
    return {
        type: RECEIVE_NOTES_SUCCESS,
        notes
    }
}

export function receiveNotesFailure(error) {
    return {
        type: RECEIVE_NOTES_FAILURE,
        error,
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
                return dispatch(receiveNotesSuccess(response.data));
            })
            .catch(function (error) {
                return dispatch(receiveNotesFailure(error));
            });
    }
}

export function getCurrentNote(noteid, userToken) {
    return (dispatch) => {
        console.log(noteid, userToken);
        const result = noteApi.getNote(noteid, userToken);
        console.log(result);
        dispatch(getNote(noteid, userToken))
    }
}