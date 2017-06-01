import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
// import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { connect } from 'react-redux';
import UserApi from '../api/userApi';
import { updateUserToken, logoutUser } from '../redux/actions/user';
import AWS from 'aws-sdk';
import Routes from '../Routes';
import RouteNavItem from '../components/RouteNavItem';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin-top: 15px;

  .navbar-brand {
    font-weight: bold;
  }
  
  body {
    margin: 0;
    padding: 0;
    font-family: "Open Sans", sans-serif;
    font-size: 16px;
    color: #333;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: "PT Serif", serif;
  }

  select.form-control,
  textarea.form-control,
  input.form-control {
    font-size: 16px;
  }
  input[type=file] {
    width: 100%;
  }

  .spinning.glyphicon {
    margin-right: 7px;
    top: 2px;
    color: #333;
    animation: spin 1s infinite linear;
  }

  @keyframes spin {
    from { transform: scale(1) rotate(0deg); }
    to { transform: scale(1) rotate(360deg); }
  }
`;

class App extends Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     userToken: null,
  //     isLoadingUserToken: true,
  //   };
  // }

  componentWillMount() {
    if(localStorage.getItem('userToken')) localStorage.removeItem('userToken');
  }

  async componentDidMount() {
    const currentUser = UserApi.getCurrentUser();

    if (currentUser === null) {
      return;
    }

    try {
      const userToken = await UserApi.getUserToken(currentUser);
      updateUserToken(userToken);
    } catch (e) {
      alert(e);
    }
  }

  handleNavLink = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

  /*
   * clear aws credentials cache ! 
   */
  handleLogout = (event) => {
    event.preventDefault();
        
    // this.props.history.push('/login');

  }

  render() {
    const { userToken, updateUserToken, isLoadingUserToken, history, logout } = this.props;

    const childProps = {
      userToken,
      updateUserToken,
    }

    return !isLoadingUserToken
      &&
      (
        <Wrapper className="container">
          <Navbar fluid collapseOnSelect>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to='/'>Scratch</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>

            <Navbar.Collapse>
              <Nav pullRight>
                {userToken
                  ? <NavItem onClick={ logout }>Logout</NavItem>
                  : [<RouteNavItem key={1} onClick={this.handleNavLink} href='/signup'>Signup</RouteNavItem>,
                  <RouteNavItem key={2} onClick={this.handleNavLink} href='/login'>Login</RouteNavItem>]
                }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Routes childProps={childProps} />
        </Wrapper>
      );
  }
}

App = connect(
  (state) => ({
    userToken: state.user.userToken,
    isLoadingUserToken: state.user.isLoadingUserToken,
  }),
  (dispatch) => ({
    updateUserToken: (userToken) => dispatch(updateUserToken(userToken)),
    logout: (history) => dispatch(logoutUser(history))
  })
)(App)

// withRouter --> HOC (Hight Order Component!) learn more !!! plz
export default withRouter(App);
