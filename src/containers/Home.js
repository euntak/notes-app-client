import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
    PageHeader,
    ListGroup,
    ListGroupItem
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { fetchNotes } from '../redux/actions';
import styled from 'styled-components';

const Wrapper = styled.div`
    .lander {
            padding: 80px 0;
            text-align: center;
        }

    .lander h1 {
            font-family: "Open Sans", sans-serif;
            font-weight: 600;
        }

    .lander p {
            color: #999;
        }

    .notes h4 {
        font-family: "Open Sans", sans-serif;
        font-weight: 600;
        overflow: hidden;
        line-height: 1.5;
        white-space: nowrap;
        text-overflow: ellipsis;
        }

    .notes p {
        color: #666;
    }
`;

class Home extends Component {

    componentDidMount() {
        if (this.props.userToken === null) return;
        this.notes();
    }

    handleNoteClick = (evnet) => {
        event.preventDefault();
        this.props.history.push(event.currentTarget.getAttribute('href'));
    }

    // async await 으로 notes 리스트를 받아온다.
    async notes() {
        const { fetchNotes, userToken } = this.props;

        try {
            await fetchNotes(userToken);
        } catch (e) {
            throw new Error(e);
        }
    }

    renderNotesList(notes) {
        return [{}].concat(notes).map((note, i) => (
            i !== 0
                ? (<ListGroupItem
                    key={note.noteid}
                    href={`/notes/${note.noteid}`}
                    onClick={this.handleNoteClick}
                    header={note.content.trim().split('\n')[0]}>
                    {"Created: " + (new Date(note.createdAt)).toLocaleString()}
                </ListGroupItem>)
                : (<ListGroupItem
                    key="new"
                    href="/notes/new"
                    onClick={this.handleNoteClick}>
                    <h4><b>{'\uFF0B'}</b> Create a new note</h4>
                </ListGroupItem>)
        ));
    }

    // default rendering 
    renderLander() {
        return (
            <div className="lander">
                <h1>Scratch</h1>
                <p>A simple note taking app</p>
            </div>
        );
    }

    // this is rendering method then notes item is exsisting
    renderNotes(notes) {
        const { isLoading } = this.props;
        return (
            <div className='notes'>
                <PageHeader>Your Notes</PageHeader>
                <ListGroup>
                    {
                        !isLoading
                        && this.renderNotesList(notes)
                    }
                </ListGroup>
            </div>
        )
    }

    render() {
        const { userToken, notes } = this.props;

        return (
            <Wrapper>
                {
                    userToken === null
                        ? this.renderNotes()
                        : this.renderNotes(notes)
                }
            </Wrapper>
        );
    }
}

Home = connect(
    (state) => ({
        notes: state.notes.list,
        isLoading: state.notes.isLoading,
    }),
    (dispatch) => ({
        fetchNotes: (userToken) => dispatch(fetchNotes(userToken))
    })
)(Home);

export default withRouter(Home);