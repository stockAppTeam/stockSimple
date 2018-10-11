import React, { Component } from 'react';
import './Register.css';
import { Link } from 'react-router-dom';
import Authorize from '../../utils/Authorize';
import { Container, Row, Col, Input, Button, Card, CardBody } from 'mdbreact';

class Register extends Component {

  constructor() {
    super();
    this.state = {
      name: '',
      password: '',
      email: '',
      registerError: '',
      about: '',
      ageCheck: false, 
      
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
        console.log(error)
      });
  }

  // checks the value of the checkbox. it is true only if the user checks it upon registering
  handleCheck = (e) => {
    this.setState({ ageCheck: !this.state.ageCheck });
  }

  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  onSubmit = (e) => {
    e.preventDefault();

    // new user object from the state and passed into register function
    let newUser = {
      name: this.state.name.trim(),
      email: this.state.email.trim(),
      password: this.state.password.trim(),
      age: this.state.ageCheck
    }

    // create new user by calling register function and redirect user to login afterwards
    Authorize.register(newUser)
      .then((result) => {
        //server throws an error if all information is not in and 'of age' is not passed as true
        //related message is displayed to the user
        if (!result.data.success) {
          this.setState({
            registerError: result.data.msg
          })
        } else {
          this.props.history.push("/login");
        }
      })
  }  

  render() {
    const { name, password, email, registerError } = this.state;
    return (
      <div className="register-page p-2">
        <Row className="m-0">
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
        <Container className="register-main mt-4">
          <Row className="justify-content-center align-items-center w-100 mt-3 flex-column">
            <Row className="info-row mb-4 w-100 p-4 rounded justify-content-center">
              <p className="content-font text-white h4 font-weight-bold text-left register-info">
              Personal investment tracking and access to live stock information.
              </p>  
            </Row>
            <Row className="w-100 justify-content-center">
              <Col sm="6" className="mb-4">
                <Card className="text-white register-card mx-auto content-font ">
                  <CardBody>
                    <form className="form content-font">
                      <p className="h3 text-center p-2  mt-2">Register!</p>
                      <div className="text-white font-weight-bolder">
                        <Input className="auth-input" label="Your name" icon="user" group type="text" validate error="wrong" name="name" value={name} onChange={this.onChange} success="right" />
                        <Input className="auth-input" label="Your email" icon="envelope" group type="email" validate error="wrong" name="email" value={email} onChange={this.onChange} success="right" />
                        <Input className="auth-input" label="Your password" icon="lock" group type="password" validate name="password" value={password} onChange={this.onChange} />
                        <div>
                          <input type="checkbox" onChange={this.handleCheck} />
                          <p className="d-inline ml-3">I am 16 years old</p>
                        </div>
                      </div>
                      <div className="text-center p-1 mt-3">
                        <Button className="turq-bg" type="sumbit" onSubmit={this.onSubmit} onClick={this.onSubmit} >Go!</Button>
                      </div>
                      Already a member? <Link to="/login"><span className="glyphicon glyphicon-plus-sign turq-text text-left" aria-hidden="true"></span>Login here</Link>
                    </form>
                    {registerError !== '' &&
                      <div className="alert alert-warning alert-dismissible mt-2 auth-message" role="alert">
                        {registerError}
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


export default Register;
