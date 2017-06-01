import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import LoaderButton from '../components/LoaderButton';
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/user';
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
        };
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
        const { loginUser , history, updateUserToken} = this.props;
        try {
            const result = await loginUser(this.state.username, this.state.password);
            
            if(result.type === 'LOGIN_FAILURE') {
                alert('아이디와 비밀번호를 확인해 주세요');
                return;
            }

            // // 결과 값에서 userToken을 빼서 localStorage에 저장 한다.
            // localStorage.setItem('userToken', result.userToken);
            updateUserToken(result.userToken);
            history.push('/');
            
        } catch (e) {
            alert(e);
        }
    }

    render() {
        const { isLoading } = this.props;
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
                        isLoading={isLoading}
                        type='submit'
                        text='Login'
                        loadingText='Logging in...' />
                </form>
            </Wrapper>
        );
    }
}

Login = connect(
    (state) => ({
        isLoading: state.user.isLoading,
        userToken: state.user.userToken || localStorage.getItem('userToken')
    }),
    (dispatch) => ({
        loginUser: (username, password) => dispatch(loginUser(username, password))
    })
)(Login);

export default withRouter(Login);