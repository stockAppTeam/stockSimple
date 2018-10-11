import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import Authorize from '../../utils/Authorize';
import { Container, Row, Col, Input, Button, Card, CardBody } from 'mdbreact';

class Login extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      password: '',
      email: '',
      message: ''
    };
  }

    // check if token exists, and if it does then send user to home page
    componentDidMount() {
      let userAuthInfo = {
        token: localStorage.getItem('jwtToken'),
        userID: localStorage.getItem('userID')
      }
      Authorize.authenticate(userAuthInfo)
        .then((res) => {
          this.props.history.push("/");
        })
        .catch((error) => {
          this.setState({ message: 'Login failed. Please try again' });
        });
    }  

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  // when the user tries to login, pass email and username to server
  // if it responds ok, then set the token and userID into local storage
  // the page will then redirect to 'home' and since the web token is there
  // to authenticate it will allow the page to load and grab all users data
  onSubmit = (e) => {
    e.preventDefault();

    let currentUser = {
      email: this.state.email.trim(),
      password: this.state.password.trim()
    }

    Authorize.login(currentUser)
      .then((result) => {
        localStorage.setItem('jwtToken', result.data.token);
        localStorage.setItem('userID', result.data.id);
        this.setState({ message: '' });
        this.props.history.push('/')
      })
      // if there is an error with authentication, it will be caught here
      .catch((error) => {
        if (error.response.status === 401) {
          this.setState({ message: 'Login failed. Username or password do not match' });
        }
      });
  }

  render() {
    const { password, email, message } = this.state;
    return (
      <div className="login-page p-2">
        <Row className="m-0 w-100">
          <Col sm="12" md="6">
            <div className="icon chart mr-auto fixed-top">
              <i></i>
              <i></i>
              <i></i>
            </div>
          </Col>
          <Col sm="12" md="6">
            <p className="text-white heading-font h1 p-4 mt-5 mr-2 heading-text">Stock Simple</p>
          </Col>
        </Row>
        <Container className="login-main mt-4">
          <Row className="justify-content-center align-items-center w-100 mt-3 flex-column">
            <Row className="info-row mb-4 w-100 p-4 rounded justify-content-center">
              <p className="content-font text-white h4 font-weight-bold text-left login-info">
                Personal investment tracking and access to live stock information.
            </p>
            </Row>
            <Row className="w-100">
              <Col className="mb-4 col-12">
                <Card className="text-white login-card mx-auto content-font ">
                  <CardBody>
                    <form className="form content-font">
                      <p className="h4 text-center p-2">Login</p>
                      <div className="text-white">
                        <Input className="auth-input"  label="Your email" icon="envelope" group type="email" validate error="wrong" name="email" value={email} onChange={this.onChange} success="right" />
                        <Input className="auth-input" label="Your password" icon="lock" group type="password" validate name="password" value={password} onChange={this.onChange} />
                      </div>
                      <div className="text-center p-2 mt-1">
                        <Button className="turq-bg" type="sumbit" onSubmit={this.onSubmit} onClick={this.onSubmit}>Login</Button>
                      </div>
                      <p>
                        Not a member ? <Link to="/register"><span className="glyphicon glyphicon-plus-sign mt-3 auth-message" aria-hidden="true"></span>Sign up here</Link>
                      </p>
                    </form>
                    {message !== '' &&
                      <div className="alert alert-warning bg-grey auth-message" role="alert">
                        {message}
                      </div>
                    }
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Row>
        </Container>
     </div>
    );
  }
}

export default Login;