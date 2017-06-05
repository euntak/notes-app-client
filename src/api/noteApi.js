import axios from 'axios';

class Note {
    URL = 'https://97xouxnhli.execute-api.ap-northeast-2.amazonaws.com/prod';


    static getNoteList() {

    }

    static async getNote(noteid, userToken, body = null) {
        // console.log(noteid, userToken, body);
        const config = {
            method: 'GET',
            baseURL: 'https://97xouxnhli.execute-api.ap-northeast-2.amazonaws.com/prod',
            url: `/notes/${noteid}`,
            headers: {
                'Authorization': userToken,
            },
            data: (body) ? JSON.stringify(body) : body
        };

        const results = await axios(config)
        .then(function (response) {
            // console.log(response);
            return response.data;
        })
        .catch(function (error) {
            throw new Error(error);
        });

        return results;
    }

    static async createNote(userToken, body = null) {
        const config = {
            method: 'POST',
            baseURL: 'https://97xouxnhli.execute-api.ap-northeast-2.amazonaws.com/prod',
            url: `/notes`,
            headers: {
                'Authorization': userToken,
            },
            data: (body) ? JSON.stringify(body) : body
        };
        
        const results = await axios(config)
        .then(function (response) {
            // console.log(response);
            return response.data;
        })
        .catch(function (error) {
            throw new Error(error);
        });

        return results;
    }

    static deleteNote(noteid) {

    }

    static editNote(note, noteid) {

    } 


}

export default Note;