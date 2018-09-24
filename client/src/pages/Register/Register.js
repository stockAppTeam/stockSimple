import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import './Register.css';
import Authorize from '../../utils/Authorize'

class Register extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      password: '', 
      email: ''
    };
  }
  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    let newUser = {
      name: this.state.name, 
      email: this.state.email, 
      password: this.state.password 
    }

    // create new user by calling register function and redirect user to login afterwards
    Authorize.register(newUser)
    .then((result) => {
      console.log(result)
      this.props.history.push("/login"); 
    })
  }

  render() {
    const { name, password, email } = this.state;
    return (
      <div className="container">
        <form className="form-signin" onSubmit={this.onSubmit}>
          <h2 className="form-signin-heading">Register</h2>
          <label htmlFor="Name" className="sr-only">Name</label>
          <input type="text" className="form-control" placeholder="Full Name" name="name" value={name} onChange={this.onChange} required/>
          <label htmlFor="Email" className="sr-only">Email</label>
          <input type="email" className="form-control" placeholder="Email" name="email" value={email} onChange={this.onChange} required/>
          <label htmlFor="inputPassword" className="sr-only">Password</label>
          <input type="password" className="form-control" placeholder="Password" name="password" value={password} onChange={this.onChange} required/>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Register</button>
        </form>
      </div>
    );
  }
}

export default Register;
