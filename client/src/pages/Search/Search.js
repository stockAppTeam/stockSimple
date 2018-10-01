import React, { Component } from 'react';
import Authorize from '../../utils/Authorize';
import SearchFunction from '../../utils/ScrapeFunctions';
import './Search.css';
import MainNavbar from '../../components/Navbar';
import Article from '../../components/Article'
import moment from 'moment';
import { Row, Col } from 'mdbreact';

class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      collapse: false,
      isWideEnough: false,
      articleSearch: [], 
      date: moment().format("DD-MM-YYYY")
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

  // function for toggling the navbar on smaller viewports
  navToggle() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  // scrapes the investopedia with the mthod from utils and logs the results
  scrapeInvestopedia = (e) => {
    SearchFunction.investopedia()
      .then((articles) => {
        this.setState({
          articleSearch: articles.data
        })
        console.log(this.state)
      })
  }
  // scrapes market watch website to get most movers and gainers from the day
  scrapeMarketWatch = (e) => {
    SearchFunction.marketWatch()
      .then((movers) => {
        console.log(movers)
      })
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
        <Row className="p-3">
          <Col sm="12" md="6">
            <button className="turq-bg btn" type="sumbit" onClick={this.scrapeInvestopedia}>Investopedia</button>
          </Col>
          <Col sm="12" md="6">
            <Row className="justify-content-center">
              {this.state.articleSearch.map((article, index) => (
                <Article
                  key={article.link}
                  imgLink={article.imgLink}
                  title={article.title}
                  desc={article.desc}
                  link={`https://www.investopedia.com/${article.link}`}
                  date={this.state.date}
                />
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}


export default Search;
