import AWS from 'aws-sdk';
import axios from 'axios';

const URL = 'https://97xouxnhli.execute-api.ap-northeast-2.amazonaws.com/prod';

export async function invokeApig(
    { path, method = 'GET', body }, userToken) {

    const config = {
        method: method,
        baseURL: URL,
        url: path,
        headers: {
            'Authorization': userToken,
        },
        data: (body) ? JSON.stringify(body) : body
    };

    const results = await axios(config)
        .then(function (response) {
            console.log(response);
            return response.data;
        })
        .catch(function (error) {
            throw new Error(error);
        });

    return results;
}

export function getAwsCredntials(userToken) {
    const authenticator = `cognito-idp.${process.env.REACT_APP_REGION}.amazonaws.com/${process.env.REACT_APP_USER_POOL_ID}`;

    AWS.config.update({ region: process.env.REACT_APP_REGION });

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
        Logins: {
            [authenticator]: userToken
        }
    });

    return AWS.config.credentials.getPromise();
}

export async function s3Upload(file, userToken) {
    await getAwsCredntials(userToken);

    const s3 = new AWS.S3({
        params: {
            Bucket: process.env.REACT_APP_BUCKET,
        }
    });

    const filename = `${AWS.config.credentials.identityId}-${Date.now()}-${file.name}`;

    return s3.upload({
        Key: filename,
        Body: file,
        ContentType: file.type,
        ACL: 'public-read',
    }).promise();
}