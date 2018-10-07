import React, { Component } from 'react';
import Authorize from '../../utils/Authorize';
import ArticleFunction from '../../utils/ArticleData';
import './Home.css';
import MainNavbar from '../../components/Navbar';
import ModalPage from '../../components/SideApiResult';
import Article from '../../components/Article';
import { Row, Col, Button } from 'mdbreact';
import swal from 'sweetalert';

class Home extends Component {

  constructor(props) {
    super(props);
    this.navToggle = this.navToggle.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.handleArticleFilter = this.handleArticleFilter.bind(this);
    this.state = {
      isLoading: true,
      username: "",
      collapse: false,
      isWideEnough: false,
      modal6: false,
      modal7: false,
      savedArticles: [],
      savedArticlesFilter: []
    };
  }

  // collapses the navbar at medium viewport
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

    Authorize.authenticate(userAuthInfo)
      .then((res) => {
        this.setState({
          username: res.data.name,
          savedArticles: res.data.articles,
          savedArticlesFilter: res.data.articles
        })
      })
      .then(() => {
        this.setState({
          isLoading: false
        })
      })
      .catch((error) => {
        if (error.response.status === 401) {
          this.props.history.push("/login");
        }
      });

  }

  // grab theindex of the article clicked and pass it into delete function
  // if the server responds with success than display a message (swal) and remove the element from the state
  // Article function imported from 'utils' which hits back end sraping route
  deleteArticle = index => {
    let { _id } = this.state.savedArticles[index];
    ArticleFunction.deleteArticle(_id)
      .then((response) => {
        if (response.data.success) {

          let {savedArticles} = this.state; 
            savedArticles = savedArticles.slice(0, index).concat(savedArticles.slice(index+1)); 
          this.setState({
            savedArticlesFilter: savedArticles,
            savedArticles: savedArticles
          });
          swal({
            title: "Article Deleted!",
            icon: "error",
            dangerMode: true,
          })
        } else {
          swal({
            title: "Could not delete, please try again",
            icon: "error",
            dangerMode: true,
          })
        }
      })
  }

  handleArticleFilter(e) {
    const condition = new RegExp(e.target.value, 'i');
    const savedArticlesFilter = this.state.savedArticles.filter(name => {
      return condition.test(name.title);
    });

    this.setState({
      savedArticlesFilter
    })
  }


  // clear the web token and email from local storage when the user logs out
  logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userID');
    window.location.reload();
  }

  // function to toggle the side result
  toggle(nr) {
    let modalNumber = 'modal' + nr
    this.setState({
      [modalNumber]: !this.state[modalNumber]
    });
  }

  render() {
    return (
      <div className="home-div">
        <Button onClick={() => this.toggle(8)} className="home-article-btn p-2"></Button>
        <MainNavbar
          navToggle={this.navToggle}
          isWideEnough={!this.state.isWideEnough}
          collapse={this.state.collapse}
          pageName={'Stock Simple'}
          logout={localStorage.getItem('jwtToken') && this.logout}
          username={this.state.username}
          pageSwitchName='Go to Search'
          pageSwitchLink='/search'
        />
        <ModalPage
          modal8={this.state.modal8}
          toggleClick={() => this.toggle(8)}
          toggleView={() => this.toggle(8)}
          title={'Saved Articles'}
        >
          {/* after importing 'Article' element, map the saved articles in the state and make an article for each one */}

          <div>
            <input
              className="search w-100 m-2"
              placeholder="Filter results by name"
              onChange={this.handleArticleFilter}
            />
            {this.state.savedArticlesFilter.length ? (
              <Row className="justify-content-center bg-dark h-100">
                {this.state.savedArticlesFilter.map((article, index) => (
                  <Article
                    key={index}
                    imgLink={article.imgLink}
                    title={article.title}
                    desc={article.desc}
                    action={'Delete'}
                    // site uses relative url so need to interpolate full url for link to work
                    link={`https://www.investopedia.com/${article.link}`}
                    date={article.date}
                    actionBtn={() => this.deleteArticle(index)}
                    className="mx-auto bg-dark"
                  >
                  </Article>
                ))}
              </Row>
            ) : (
                <h4 className="content-font text-white">No Articles Saved</h4>
              )}
          </div>
        </ModalPage>
        {/* ternary that covers all components. if 'this.state.isLoading' is true than the waiting icon shows */}
        {!this.state.isLoading ? (
          <Row className="w-100 m-0 justify-content-center">

          </Row>
        ) : (
            <div className="loading">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
          )}
      </div>
    );
  }
}


export default Home;
