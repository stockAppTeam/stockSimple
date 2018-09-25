import React, { Component } from 'react';
import './Register.css';
import Authorize from '../../utils/Authorize';
import { Container, Row, Col, Input, Button, Card, CardBody} from 'mdbreact';

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

    // new user object from the state and passed into register function
    let newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }

    // create new user by calling register function and redirect user to login afterwards
    Authorize.register(newUser)
      .then((result) => {
        this.props.history.push("/login");
      })
  }

  render() {
    const { name, password, email } = this.state;
    return (

      <Container>
        <Row className="justify-content-center">
          <Col md="6">
            <Card className="bg-dark text-white">
              <CardBody>
                <form>
                  <p className="h4 text-center py-4">Sign up</p>
                  <div className="grey-text">
                    <Input label="Your name" icon="user" group type="text" validate error="wrong" name="name" value={name} onChange={this.onChange} success="right" />
                    <Input label="Your email" icon="envelope" group type="email" validate error="wrong" name="email" value={email} onChange={this.onChange} success="right" />
                    <Input label="Your password" icon="lock" group type="password" validate  name="password" value={password} onChange={this.onChange} />
                  </div>
                  <div className="text-center py-4 mt-3">
                    <Button color="blue" onClick={this.onSubmit}>Go!</Button>
                  </div>
                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

    );
  }
}


export default Register;
