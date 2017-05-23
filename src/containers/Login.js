import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import {
    CognitoUserPool,
    AuthenticationDetails,
    CognitoUser
} from 'amazon-cognito-identity-js';

import {
    FormGroup,
    FormControl,
    ControlLabel,
} from 'react-bootstrap';

import styled from 'styled-components';
const Wrapper = styled.div`
    @media all and (min-width: 480px) {
        padding: 60px 0;
        form {
            margin: 0 auto;
            max-width: 320px;
        }
    }
`;

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            isLoading: false,
        };
    }

    login(username, password) {
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

    validateForm() {
        return this.state.username.length > 0
            && this.state.password.length > 0;
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        this.setState({ isLoading: true });

        try {
            const userToken = await this.login(this.state.username, this.state.password);
            this.props.updateUserToken(userToken);
            // this.props.history.push('/');
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <Wrapper>
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId='username' bsSize='large'>
                        <ControlLabel>Email</ControlLabel>
                        <FormControl
                            autoFocus
                            type='email'
                            value={this.state.username}
                            onChange={this.handleChange} />
                    </FormGroup>
                    <FormGroup controlId='password' bsSize='large'>
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            type='password'
                            value={this.state.password}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <LoaderButton
                        block
                        bsSize='large'
                        disabled={!this.validateForm()}
                        isLoading={this.state.isLoading}
                        type='submit'
                        text='Login'
                        loadingText='Logging in...' />
                </form>
            </Wrapper>
        );
    }
}

export default withRouter(Login);