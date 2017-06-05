import axios from 'axios';
import noteApi from '../../api/noteApi';

export const REQUEST_NOTES = 'REQUEST_NOTES';
export const RECEIVE_NOTES_SUCCESS = 'RECEIVE_NOTES_SUCCESS';
export const RECEIVE_NOTES_FAILURE = 'RECEIVE_NOTES_FAILURE';

export const GET_NOTE = 'GET_NOTE';
export const NEW_NOTE = 'NEW_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const SAVE_NOTE = 'SAVE_NOTE';

export function getNote(note) {
    return {
        type: GET_NOTE,
        note,
    }
}

export function newNote(note) {
    return {
        type: NEW_NOTE,
        note,
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

export function getCurrentNote(note) {
    return (dispatch) => {
        // console.log(noteid, userToken);
        // const result = noteApi.getNote(noteid, userToken);
        dispatch(getNote(note))
    }
}

export function createNote(userToken, note) {
    return (dispatch) => {
        noteApi.createNote(userToken, note);
        dispatch(newNote(note))
    }
}