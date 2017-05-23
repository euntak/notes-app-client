import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'react-bootstrap';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
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
  constructor(props) {
    super(props);

    this.state = {
      userToken: null,
      isLoadingUserToken: true,
    };
  }

  async componentDidMount() {
    const currentUser = this.getCurrentUser();

    if(currentUser === null) {
      this.setState({ isLoadingUserToken: false });
      return;
    }

    try {
      const userToken = await this.getUserToken(currentUser);
      this.updateUserToken(userToken);
    } catch (e) {
      alert(e);
    }

    this.setState({ isLoadingUserToken: false });
  }

  getCurrentUser() {
    // if you config.js using.. below code 
    // const userPool = new CognitoUserPool({
    //   UserPoolId: config.cognito.USER_POOL_ID,
    //   ClientId: config.cognito.APP_CLIENT_ID
    // });

    // if you're .env using... below code
    const userPool = new CognitoUserPool({
      UserPoolId: process.env.REACT_APP_USER_POOL_ID,
      ClientId: process.env.REACT_APP_APP_CLIENT_ID
    });

    return userPool.getCurrentUser();
  }

  getUserToken(currentUser) {
    return new Promise((resolve, reject) => {
        currentUser.getSession((err, session) => {
          if(err) {
            reject(err); return;
          }
          resolve(session.getIdToken().getJwtToken());
        });
    });
  }

  updateUserToken = (userToken) => {
    this.setState({
      userToken
    });
  }

  handleNavLink = (event) => {
    event.preventDefault();
    this.props.history.push(event.currentTarget.getAttribute('href'));
  }

/*
 * clear aws credentials cache ! 
 */
  handleLogout = (event) => {
    const currentUser = this.getCurrentUser();

    if(currentUser !== null) {
      currentUser.signOut();
    }
    
    if(AWS.config.credentials) {
      AWS.config.credentials.clearCachedId();
    }

    this.updateUserToken(null);

    // redirect /login page!
    this.props.history.push('/login');
  }

  render() {
    const childProps = {
      userToken: this.state.userToken,
      updateUserToken: this.updateUserToken
    };

    return ! this.state.isLoadingUserToken
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
              { this.state.userToken
                ? <NavItem onClick={this.handleLogout}>Logout</NavItem>
                : [ <RouteNavItem key={1} onClick={this.handleNavLink} href='/signup'>Signup</RouteNavItem> ,
                    <RouteNavItem key={2} onClick={this.handleNavLink} href='/login'>Login</RouteNavItem> ]
              }
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes childProps={childProps} />
      </Wrapper>
    );
  }
}

// withRouter --> HOC (Hight Order Component!) learn more !!! plz
export default withRouter(App);
