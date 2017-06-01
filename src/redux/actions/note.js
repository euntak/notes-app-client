import axios from 'axios';


export const CREATE_NOTE = 'CREATE_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const EDIT_NOTE = 'EDIT_NOTE';


export function createNote(note, userToken) {
    return {
        type: CREATE_NOTE,
        note,
        userToken
    }
}

export function deleteNote(noteid, userToken) {
    return {
        type: DELETE_NOTE,
        noteid,
        userToken
    }
}

