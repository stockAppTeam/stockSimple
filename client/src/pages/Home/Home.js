import React, { Component } from 'react';
import Authorize from '../../utils/Authorize';
import ArticleFunction from '../../utils/ArticleData';
import Investment from '../../utils/InvestmentData';
import './Home.css';
import MainNavbar from '../../components/Navbar';
import ModalPage from '../../components/SideApiResult';
import Article from '../../components/Article';
import InvestAccordion from '../../components/InvestAccordion';
import { Row, Col, Button } from 'mdbreact';
import swal from 'sweetalert';
import moment from 'moment';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';

class Home extends Component {

  constructor(props) {
    super(props);
    this.navToggle = this.navToggle.bind(this);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.handleArticleFilter = this.handleArticleFilter.bind(this);
    this.addInvestmentVal = this.addInvestmentVal.bind(this);
    this.addStockInvestment = this.addStockInvestment.bind(this);
    this.deleteInvestment = this.deleteInvestment.bind(this);
    this.state = {
      isLoading: true,
      username: "",
      collapse: false,
      isWideEnough: false,
      modal6: false,
      modal7: false,
      savedArticles: [],
      savedArticlesFilter: [],
      investments: [], 
      addStockName: "",
      addStockTicker: "",
      addStockShares: "",
      addStockPrice: "",
      date: moment().format("DD-MM-YYYY"),
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
          savedArticlesFilter: res.data.articles, 
          investments: res.data.investments
        })
        console.log(res)
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

          let { savedArticles } = this.state;
          savedArticles = savedArticles.slice(0, index).concat(savedArticles.slice(index + 1));
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

  // sets the state to whatever is being searched
  addInvestmentVal = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  // function to add a stock to their portfolio
  addStockInvestment = (e) => {
    let {addStockName, addStockPrice, addStockShares, addStockTicker, date}  = this.state; 
    let userID  =  localStorage.getItem('userID'); 
    if (!addStockName || !addStockPrice ||  !addStockShares || !addStockTicker) {
      swal({
        title: "You must fill all fields",
        icon: "error",
        dangerMode: true,
      })
    } else if (!parseInt(addStockPrice) || !parseInt(addStockShares)) {
      swal({
        title: "Shares purchased and price must be numbers",
        icon: "error",
        dangerMode: true,
      })
    } else {
      let stockAdded = {addStockName, addStockPrice, addStockShares, addStockTicker, userID, date}
      Investment.addStock(stockAdded)
      .then ((result) => {
         this.setState({
           investments: result.data.investments
         })
      })
    }
  }

  deleteInvestment = (e) => {
    console.log(e.target.name)
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
            <Col md="6" className="investments-col">
              <h4 className="content-font turq-text ml-2">Watchlists</h4>
            </Col>
            <Col md="6" className="p-2">
              <div className="d-flex justify-content-between">
                <h4 className="content-font turq-text ml-2 d-inline">Investments</h4>
                <Dropdown size="sm" className="mr-3">
                  <DropdownToggle caret id="add-stock-drop">
                    Add Stock
                    </DropdownToggle>
                  <DropdownMenu className="mr-5">
                    <ul className="list-unstyled p-2 mb-0">
                      <li>
                        <input
                          name="addStockName"
                          className="search w-100 mb-2 p-2 border-rounded"
                          placeholder="Name"
                          onChange={this.addInvestmentVal}
                        />
                      </li>
                      <li>
                        <input
                          name="addStockTicker"
                          className="search w-100 mb-2 p-2 border-rounded"
                          placeholder="Stock ticker"
                          onChange={this.addInvestmentVal}
                        />
                      </li>
                      <li>
                        <input
                          name="addStockShares"
                          className="search w-100 mb-2 p-2 border-rounded"
                          placeholder="# of shares"
                          onChange={this.addInvestmentVal}
                        />
                      </li>
                      <li>
                        <input
                          name="addStockPrice"
                          className="search w-100 mb-2 p-2 border-rounded"
                          placeholder="Price"
                          onChange={this.addInvestmentVal}
                        />
                      </li>
                    </ul>
                    <DropdownItem divider />
                    <DropdownItem 
                    className="content-font p-2 drop-down-btn"
                    onClick={this.addStockInvestment}
                    >
                      Add to investments
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <InvestAccordion 
              investments={this.state.investments}
              deleteInvestment={this.deleteInvestment}
              />
            </Col>
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
