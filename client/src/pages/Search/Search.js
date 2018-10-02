import React, { Component } from 'react';
import Authorize from '../../utils/Authorize';
import SearchFunction from '../../utils/ScrapeFunctions';
import ArticleFunction from '../../utils/ArticleData';
import './Search.css';
import MainNavbar from '../../components/Navbar';
import Article from '../../components/Article';
import moment from 'moment';
import { Row, Col } from 'mdbreact';
import swal from 'sweetalert';

class Search extends Component {

  constructor(props) {
    super(props);
    this.saveArticle = this.saveArticle.bind(this);
    this.navToggle = this.navToggle.bind(this);
    this.state = {
      username: "",
      collapse: false,
      isWideEnough: false,
      articleSearch: [],
      date: moment().format("DD-MM-YYYY")
    };
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
      })
  }

  saveArticle = index => {
    let { title, link, desc, imgLink } = this.state.articleSearch[index];
    let date = this.state.date;
    let user = localStorage.getItem('userID');

    ArticleFunction.saveArticle({
      user,
      title,
      link,
      desc,
      imgLink,
      date
    })
      .then((response) => {
          console.log(response)
          console.log(this.state)
        if (response.data.success) {
          this.setState({
            articleSearch: this.state.articleSearch.filter((_, i) => i !== index)
          });
          swal("Article Saved", "Its on your home page", "success");
        } else {
          swal({
            title: "Could not delete, please try again",
            icon: "error",
            dangerMode: true,
          })
        }
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
            <h1 className="turq-text text-center content-font">Latest News</h1>
            <Row className="justify-content-center">
              {this.state.articleSearch.map((article, index) => (
                <Article
                  key={index}
                  imgLink={article.imgLink}
                  title={article.title}
                  desc={article.desc}
                  action={'Save'}
                  // site uses relative url so need to interpolate full url for link to work
                  link={`https://www.investopedia.com/${article.link}`}
                  date={this.state.date}
                  actionBtn={() => this.saveArticle(index)}
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


export default Search;
