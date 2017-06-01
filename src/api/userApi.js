import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser
} from 'amazon-cognito-identity-js';

class AuthenticateUser {
    static login(username, password) {
        const userPool = new CognitoUserPool({
            UserPoolId: process.env.REACT_APP_USER_POOL_ID,
            ClientId: process.env.REACT_APP_APP_CLIENT_ID,
        });

        const authenticationData = {
            Username: username,
            Password: password
        };

        const user = new CognitoUser({ Username: username, Pool: userPool });
        const authenticationDetails = new AuthenticationDetails(authenticationData);

        return new Promise((resolve, reject) => {
            user.authenticateUser(authenticationDetails, {
                onSuccess: (result) => resolve(result.getIdToken().getJwtToken()),
                onFailure: (err) => reject(err),
            })
        });
    }

    static getCurrentUser() {
        const userPool = new CognitoUserPool({
            UserPoolId: process.env.REACT_APP_USER_POOL_ID,
            ClientId: process.env.REACT_APP_APP_CLIENT_ID
        });

        return userPool.getCurrentUser();
    }

    static getUserToken(currentUser) {
        return new Promise((resolve, reject) => {
            currentUser.getSession((err, session) => {
                if (err) {
                    reject(err); return;
                }
                resolve(session.getIdToken().getJwtToken());
            });
        });
    }
}

export default AuthenticateUser;