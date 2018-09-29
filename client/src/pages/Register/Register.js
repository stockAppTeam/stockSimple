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

  handleCheck = (e) => {
    console.log(this.state.ageCheck)
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
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
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
                  Live access to stock information and personal investment tracking. 
              </p>  
            </Row>
            <Row className="w-100">
              <Col sm="12" md="6" className="d-flex flex-column">
                <div className="registerImg registerImg1"></div>
                <div className="registerImg registerImg3 mx-auto"></div>
                <div className="registerImg registerImg2 align-self-end"></div>
              </Col>
              <Col sm="12" md="6" className="mb-4">
                <Card className="text-white register-card mx-auto content-font ">
                  <CardBody>
                    <form className="form">
                      <p className="h3 text-center p-2 heading-font mt-2">Register!</p>
                      <div className="text-white font-weight-bolder">
                        <Input label="Your name" icon="user" group type="text" validate error="wrong" name="name" value={name} onChange={this.onChange} success="right" />
                        <Input label="Your email" icon="envelope" group type="email" validate error="wrong" name="email" value={email} onChange={this.onChange} success="right" />
                        <Input label="Your password" icon="lock" group type="password" validate name="password" value={password} onChange={this.onChange} />
                        <div>
                          <input type="checkbox" onChange={this.handleCheck} />
                          <p className="d-inline ml-3">Are you at least 16 years old?</p>
                        </div>
                      </div>
                      <div className="text-center p-1 mt-3">
                        <Button className="turq-text" onClick={this.onSubmit} >Go!</Button>
                      </div>
                      Already a member? <Link to="/login"><span className="glyphicon glyphicon-plus-sign turq-text text-left" aria-hidden="true"></span>Login here</Link>
                    </form>
                    {registerError !== '' &&
                      <div className="alert alert-warning alert-dismissible mt-2" role="alert">
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
