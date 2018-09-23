import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import Authorize from '../../utils/Authorize'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      test: 'test'
    };
  }

  componentDidMount() {
    let userInfo =  {
      token: localStorage.getItem('jwtToken'), 
      email: localStorage.getItem('email')
    }
    Authorize.authenticate(userInfo); 

  }

  logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('email');
    window.location.reload();
  }

  render() {
    return (
      <div className="container">
              {localStorage.getItem('jwtToken') &&
                <button className="btn btn-primary" onClick={this.logout}>Logout</button>
              }
      </div>
    );
  }
}


export default App;
