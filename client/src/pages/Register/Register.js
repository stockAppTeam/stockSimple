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
      ageCheck: false
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
      <div className="register-page">
        {/* <Col className="col-3 d-flex justify-content-center">
          <Button className="turq-text learn-btn m-4">Learn More</Button>
          <div className="icon chart">
            <i></i>
            <i></i>
            <i></i>
          </div>
        </Col> */}
        <Container className="register-main">
          <p className="text-white heading-font mb-4 display-4">Welcome to Stock Simple!</p>
          <Row className="justify-content-center w-100">
            <Col className="mx-auto">
              <Card className="text-white register-card mx-auto content-font ">
                <CardBody>
                  <form className="form">
                    <p className="h3 text-center py-4 heading-font">Register!</p>
                    <div className="text-white font-weight-bolder">
                      <Input label="Your name" icon="user" group type="text" validate error="wrong" name="name" value={name} onChange={this.onChange} success="right" />
                      <Input label="Your email" icon="envelope" group type="email" validate error="wrong" name="email" value={email} onChange={this.onChange} success="right" />
                      <Input label="Your password" icon="lock" group type="password" validate name="password" value={password} onChange={this.onChange} />
                      <div>
                        <input type="checkbox" onChange={this.handleCheck} />
                        <p className="d-inline ml-3">Are you at least 16 years old?</p>
                      </div>
                    </div>
                    <div className="text-center py-4 mt-3">
                      <Button className="turq-text" onClick={this.onSubmit}>Go!</Button>
                    </div>
                    Already a member? <Link to="/login"><span className="glyphicon glyphicon-plus-sign turq-text text-left" aria-hidden="true"></span>Login here</Link>
                  </form>
                  {registerError !== '' &&
                    <div className="alert alert-warning alert-dismissible bg-grey mt-2" role="alert">
                      {registerError}
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


export default Register;
