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
      email: this.state.email,
      password: this.state.password
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
      <div className="login-page">
      <Container className="login-main">
        <Row className="justify-content-center w-100">
          <Col className="mx-auto">
            <Card className="text-white mx-auto login-card">
              <CardBody>
                <form>
                  <p className="h4 text-center py-4 heading-font">Login</p>
                  <div className="text-white">
                    <Input label="Your email" icon="envelope" group type="email" validate error="wrong" name="email" value={email} onChange={this.onChange} success="right" />
                    <Input label="Your password" icon="lock" group type="password" validate name="password" value={password} onChange={this.onChange} />
                  </div>
                  <div className="text-center py-4 mt-3">
                    <Button className="turq-bg" onClick={this.onSubmit}>Login</Button>
                  </div>
                  <p>
                    Not a member? <Link to="/register"><span className="glyphicon glyphicon-plus-sign mt-3" aria-hidden="true"></span> Register here</Link>
                  </p>
                </form>
                {message !== '' &&
                  <div className="alert alert-warning alert-dismissible bg-grey" role="alert">
                    {message}
                  </div>
                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      </div>
    );
  }
}

export default Login;