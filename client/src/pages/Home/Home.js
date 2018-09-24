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

  // when the page loads grab the token and email from local storage
  // pass it into authenticate function. If server responds ok, then load data
  // if not then push to login screen
  componentDidMount() {
    let userInfo =  {
      token: localStorage.getItem('jwtToken'), 
      email: localStorage.getItem('email')
    }
    Authorize.authenticate(userInfo)
    .then((res) => {
      console.log(res.data)
    })
    .catch((error) => {
      if(error.response.status === 401) {
        this.props.history.push("/login");
      }
    }); 

  }

  // clear the web token and email from local storage when the user logs out
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
