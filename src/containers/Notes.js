import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { invokeApig, s3Upload } from '../libs/awsLib';
import {
    FormGroup,
    FormControl,
    ControlLabel,
} from 'react-bootstrap';
import LoaderButton from '../components/LoaderButton';
import styled from 'styled-components';
import { connect } from 'react-redux';
import noteApi from '../api/noteApi';
import {
    getCurrentNote
} from '../redux/actions/note';


const Wrapper = styled.div`
    form {
        padding-bottom: 15px;
    }

    form textarea {
        height: 300px;
        font-size: 24px;
    }
`;

class Notes extends Component {
    constructor(props) {
        super(props);

        this.file = null;

        this.state = {
            isLoading: null,
            isDeleting: null,
            note: null,
            content: '',
        };
    }

    async componentDidMount() {
        const { userToken, match, getNote } = this.props;
        
        try {
            const result = noteApi.getNote(match.params.id, userToken);
            result.then(res => {
                getNote(res); // dispatching Action
                this.setState({
                    note: res,
                    content: res.content,
                });
            });
        } catch (e) {

        }
    }

    validateForm() {
        return this.state.content.length > 0;
    }

    formatFilename(str) {
        return (str.length < 50)
            ? str
            : str.substr(0, 20) + '...' + str.substr(str.length - 20, str.length);
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
        event.preventDefault();

        if (this.file && this.file.size > process.env.MAX_ATTACHMENT_SIZE) {
            alert('Please pick a file smaller than 5MB');
            return;
        }

        this.setState({ isLoading: true });
    }

    handleDelete = async (event) => {
        event.preventDefault();

        const confirmed = confirm('Are you sure you want to delete this note?');

        if (!confirmed) {
            return;
        }

        this.setState({ isDeleting: true });

        try {
            await this.deleteNote();
            this.props.history.push('/');
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    saveNote(note) {
        return invokeApig({
            path: `/notes/${this.props.match.params.id}`,
            method: 'PUT',
            body: note,
        }, this.props.userToken);
    }

    deleteNote() {
        return invokeApig({
            path: `/notes/${this.props.match.params.id}`,
            method: 'DELETE',
        }, this.props.userToken);
    }

    handleSubmit = async (event) => {
        const { userToken, history } = this.props;
        let uploadedFilename;

        event.preventDefault();

        if (this.file && this.file.size > process.env.MAX_ATTACHMENT_SIZE) {
            alert('Please pick a file smaller than 5MB');
            return;
        }

        this.setState({ isLoading: true });

        try {

            if (this.file) {
                uploadedFilename = (await s3Upload(this.file, userToken)).Location;
            }

            await this.saveNote({
                ...this.state.note,
                content: this.state.content,
                attachment: uploadedFilename || this.state.note.attachment,
            });

            history.push('/');
        }
        catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }

    render() {
        const { isLoading } = this.props;
        return (
            <Wrapper>
                {this.state.note &&
                    (<form onSubmit={this.handleSubmit}>
                        <FormGroup controlId="content">
                            <FormControl
                                onChange={this.handleChange}
                                value={this.state.content}
                                componentClass="textarea" />
                        </FormGroup>
                        {this.state.note.attachment &&
                            (<FormGroup>
                                <ControlLabel>Attachment</ControlLabel>
                                <FormControl.Static>
                                    <a target="_blank" rel="noopener noreferrer" href={this.state.note.attachment}>
                                        {this.formatFilename(this.state.note.attachment)}
                                    </a>
                                </FormControl.Static>
                            </FormGroup>)}
                        <FormGroup controlId="file">
                            {!this.state.note.attachment &&
                                <ControlLabel>Attachment</ControlLabel>}
                            <FormControl
                                onChange={this.handleFileChange}
                                type="file" />
                        </FormGroup>
                        <LoaderButton
                            block
                            bsStyle="primary"
                            bsSize="large"
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={this.state.isLoading}
                            text="Save"
                            loadingText="Saving…" />
                        <LoaderButton
                            block
                            bsStyle="danger"
                            bsSize="large"
                            isLoading={this.state.isDeleting}
                            onClick={this.handleDelete}
                            text="Delete"
                            loadingText="Deleting…" />
                    </form>)}
            </Wrapper>
        );
    }
}

Notes = connect(
    (state) => ({
        userToken: state.notes.userToken || localStorage.getItem('userToken'),
        note: state.note.note,
        isLoading: state.note.isLoading,
        isDeleting: state.note.isDeleting,
    }),
    (dispatch) => ({
        getNote: (note) => dispatch(getCurrentNote(note))
    })
)(Notes);

export default withRouter(Notes);