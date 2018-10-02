import React, { Component } from 'react';
import Authorize from '../../utils/Authorize';
import SearchFunction from '../../utils/ScrapeFunctions';
import './Home.css';
import MainNavbar from '../../components/Navbar';
import Article from '../../components/Article';
import { Row, Col } from 'mdbreact';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      collapse: false,
      isWideEnough: false,
      savedArticles: []
    };
    this.navToggle = this.navToggle.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
  }

  navToggle() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }
  // when the page loads grab the token and userID from local storage
  // pass it into authenticate function. If server responds ok, then load data
  // if not then push to login screen
  componentDidMount() {
    let userAuthInfo = {
      token: localStorage.getItem('jwtToken'),
      userID: localStorage.getItem('userID')
    }
    this.scrapeMarketWatch();
    Authorize.authenticate(userAuthInfo)
      .then((res) => {
        console.log(res.data)
        this.setState({
          username: res.data.name,
          savedArticles: res.data.articles
        })
      })
      .catch((error) => {
        if (error.response.status === 401) {
          this.props.history.push("/login");
        }
      });

  }

  deleteArticle = index => {
    console.log('hey')
  }


  scrapeMarketWatch = (e) => {
    SearchFunction.marketWatch()
      .then((movers) => {
        console.log(movers)
      })
  }
  // clear the web token and email from local storage when the user logs out
  logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userID');
    window.location.reload();
  }

  render() {
    return (
      <div className="home-div">
        <MainNavbar
          navToggle={this.navToggle}
          isWideEnough={!this.state.isWideEnough}
          collapse={this.state.collapse}
          pageName={'Stock Simple |'}
          logout={localStorage.getItem('jwtToken') && this.logout}
          username={this.state.username}
          pageSwitchName='Go to Search'
          pageSwitchLink='/search'
        />
        <Row className="p-3">
          <Col sm="12" md="6">
            <Row className="justify-content-center">
              {this.state.savedArticles.map((article, index) => (
                <Article
                  key={article.id}
                  imgLink={article.imgLink}
                  title={article.title}
                  desc={article.desc}
                  action={'Delete'}
                  // site uses relative url so need to interpolate full url for link to work
                  link={`https://www.investopedia.com/${article.link}`}
                  date={article.date}
                  actionBtn={() => this.deleteArticle(index)}
                >
                </Article>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    );
  }
}


export default Home;
