import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
    FormGroup,
    FormControl,
    ControlLabel,
} from 'react-bootstrap';

import { connect } from 'react-redux';
import { createNote } from '../redux/actions/note';
import { invokeApig, s3Upload } from '../libs/awsLib';
import LoaderButton from '../components/LoaderButton';
import styled from 'styled-components';

const Wrapper = styled.div`
    form {
        padding-bottom: 15px;
    }

    form textarea {
        height: 300px;
        font-size: 24px;
    }
`;


class NewNote extends Component {

    constructor(props) {
        super(props);

        this.file = null;
        this.state = {
            isLoading: null,
            content: '',
        };
    }
    
    validateForm() {
        return this.state.content.length > 0;
    }

    handleChange = (event) => {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    handleFileChange = (event) => {
        this.file = event.target.files[0];
    }

    handleSubmit = async (event) => {
        const { userToken, createNote, history } = this.props;
        event.preventDefault();

        if(this.file && this.file.size > process.env.MAX_ATTACHEMENT_SIZE) {
            alert('Please pick a file smaller than 5MB');
            return;
        }

        this.setState({ isLoading: true});

        try {
            
            // creating note before upload s3 file!
            const uploadedFilename = (this.file)
            ? (await s3Upload(this.file, userToken)).Location
            : null;

            await createNote(userToken, {
                content: this.state.content,
                attachment: uploadedFilename,
            });
            
            history.push('/');
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    render() {
        return (
            <Wrapper>
                <form onSubmit={this.handleSubmit}>
                    <FormGroup controlId='content'>
                        <FormControl
                            onChange={this.handleChange}
                            value={this.state.content}
                            componentClass='textarea' />
                    </FormGroup>

                    <FormGroup controlId='file'>
                        <ControlLabel>Attachement</ControlLabel>
                        <FormControl
                            onChange={this.handleFileChange}
                            type='file' />
                    </FormGroup>

                    <LoaderButton
                        block
                        bsSize='large'
                        bsStyle='primary'
                        disabled={ !this.validateForm() }
                        type='submit'
                        isLoading={this.state.isLoading}
                        text='Create'
                        loadingText='Creating...' />
                </form>
            </Wrapper>
        );
    }
}

NewNote = connect(
    (state) => ({
       userToken: state.note.userToken || localStorage.getItem('userToken'), 
    }),
    (dispatch) => ({
        createNote: (userToken, content) => dispatch(createNote(userToken, content))
    })
)(NewNote)

export default withRouter(NewNote);