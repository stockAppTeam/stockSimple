import React, { Component } from 'react';
import Authorize from '../../utils/Authorize'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      test: 'test'
    };
  }

  // when the page loads grab the token and userID from local storage
  // pass it into authenticate function. If server responds ok, then load data
  // if not then push to login screen
  componentDidMount() {
    let userAuthInfo =  {
      token: localStorage.getItem('jwtToken'), 
      userID: localStorage.getItem('userID')
    }
    Authorize.authenticate(userAuthInfo)
    .then((res) => {
      console.log(res.data)
      console.log(this.state)
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
    localStorage.removeItem('userID');
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
