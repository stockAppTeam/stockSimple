import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import Authorize from '../../utils/Authorize'

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
          this.setState({ message: 'Login failed. Username or password not match' });
        }
      });
  }

  render() {
    const { password, email, message } = this.state;
    return (
      <div className="container">
        <form className="form-signin" onSubmit={this.onSubmit}>
          {message !== '' &&
            <div className="alert alert-warning alert-dismissible" role="alert">
              {message}
            </div>
          }
          <h2 className="form-signin-heading">Login</h2>
          <label htmlFor="Email" className="sr-only">Email</label>
          <input type="email" className="form-control" placeholder="Email" name="email" value={email} onChange={this.onChange} required />
          <label htmlFor="inputPassword" className="sr-only">Password</label>
          <input type="password" className="form-control" placeholder="Password" name="password" value={password} onChange={this.onChange} required />
          <button className="btn btn-lg btn-primary btn-block" type="submit">Login!</button>
          <p>
            Not a member? <Link to="/register"><span className="glyphicon glyphicon-plus-sign" aria-hidden="true"></span> Register here</Link>
          </p>
        </form>
      </div>
    );
  }
}

export default Login;