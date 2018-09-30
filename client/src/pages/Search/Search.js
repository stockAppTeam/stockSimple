import React, { Component } from 'react';
import Authorize from '../../utils/Authorize';
import SearchFunction from '../../utils/ScrapeFunctions';
import './Search.css';
import MainNavbar from '../../components/Navbar';
import {Button, Row } from 'mdbreact';

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      collapse: false,
      isWideEnough: false,
    };
    this.navToggle = this.navToggle.bind(this);
  }

  // when the page loads grab the token and userID from local storage
  // pass it into authenticate function. If server responds ok, then load data
  // if not then push to login screen
  componentDidMount() {
    let userAuthInfo = {
      token: localStorage.getItem('jwtToken'),
      userID: localStorage.getItem('userID')
    }
    Authorize.authenticate(userAuthInfo)
      .then((res) => {
        console.log(res.data)
        this.setState({
          username: res.data.name
        })
      })
      .catch((error) => {
        if (error.response.status === 401) {
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

  navToggle() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  scrapeArticles = (e) => {
    console.log('hey')
    SearchFunction.investopedia()
  }

  render() {
    return (
      <div className="search-div">
        <MainNavbar
          navToggle={this.navToggle}
          isWideEnough={!this.state.isWideEnough}
          collapse={this.state.collapse}
          pageName={'Stock Simple |'}
          logout={localStorage.getItem('jwtToken') && this.logout}
          username={this.state.username}
          pageSwitchName='Go to Home'
          pageSwitchLink='/'
        />
        <Row className="p-2">
          <Button className="turq-bg" type="sumbit" onClick={this.scrapeArticles}>Scrape</Button>
        </Row>
      </div>
    );
  }
}


export default Search;
