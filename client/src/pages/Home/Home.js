import React, { Component } from 'react';
import Authorize from '../../utils/Authorize';
import ArticleFunction from '../../utils/ArticleData';
import Investment from '../../utils/InvestmentData';
import WatchlistFunction from '../../utils/Watchlists';
import MainNavbar from '../../components/Navbar';
import ModalPage from '../../components/SideApiResult';
import Article from '../../components/Article';
import InvestAccordion from '../../components/InvestAccordion';
import WatchlistTab from '../../components/WatchlistTabs';
import { Row, Col, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';
import swal from 'sweetalert';
import moment from 'moment';
import './Home.css';

class Home extends Component {

  constructor(props) {
    super(props);
    this.deleteArticle = this.deleteArticle.bind(this);
    this.handleArticleFilter = this.handleArticleFilter.bind(this);
    this.inputVal = this.inputVal.bind(this);
    this.addStockInvestment = this.addStockInvestment.bind(this);
    this.deleteInvestment = this.deleteInvestment.bind(this);
    this.getAllUserData = this.getAllUserData.bind(this);
    this.getInvestmentTotals = this.getInvestmentTotals.bind(this);
    this.addFullWatchlist = this.addFullWatchlist.bind(this);
    this.deleteWatchlist = this.deleteWatchlist.bind(this);
    this.deleteStockFromWatchlist = this.deleteStockFromWatchlist.bind(this);
    this.addStockToWatchList = this.addStockToWatchList.bind(this);
    this.deleteProfile = this.deleteProfile.bind(this);
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
      watchlists: [],
      addStockName: "",
      addStockTicker: "",
      addStockShares: "",
      addStockPrice: "",
      addWatchlistName: "",
      addStockToWatchListVal: "",
      date: moment().format("DD-MM-YYYY"),
    };
  }

  // when the page loads grab the token and userID from local storage
  // pass it into authenticate function. If server responds ok, then load data
  // if not then push to login screen
  componentDidMount() {
    this.getAllUserData();
  }

  // gets the user data, returns specific data based on parameter passed in
  getAllUserData() {
    let userAuthInfo = {
      token: localStorage.getItem('jwtToken'),
      userID: localStorage.getItem('userID')
    }
    Authorize.authenticate(userAuthInfo)
      .then((res) => {
        let { nicelyFormattedData, watchlists } = res.data;

        for (let i = 0; i < watchlists.length; i++) {
          for (let j = 0; j < watchlists[i].stocks.length; j++) {
            Object.keys(nicelyFormattedData).forEach(function (item) {
            
              let stockName = watchlists[i].stocks[j]; 

              // ticker from the API query is all uppercase, so make sure it still matches if the user inputs a lower case value
              if (typeof stockName === 'string') {
                stockName = stockName.toUpperCase(); 
              }
 
              if (stockName === nicelyFormattedData[item].symbol) {
                let stockVal = {};
                stockVal.name = watchlists[i].stocks[j];
                stockVal.price = nicelyFormattedData[item].price;
                watchlists[i].stocks[j] = stockVal;
              }
            });
            if (typeof watchlists[i].stocks[j] != 'object') {
              let name = watchlists[i].stocks[j];
              watchlists[i].stocks[j] = { name, price: 'N/A' }
            }
          }
        }

        console.log(res.data)
        this.setState({
          username: res.data.name,
          savedArticles: res.data.articles,
          savedArticlesFilter: res.data.articles,
          investments: res.data.investments,
          watchlists: watchlists, 
          addStockName: "",
          addStockTicker: "",
          addStockShares: "",
          addStockPrice: "",
          addWatchlistName: "",
          addStockToWatchListVal: "",
        })
      })
      .then(() => {
        this.setState({
          isLoading: false
        })
        this.getInvestmentTotals();
      })
      .catch((error) => {
        console.log(error)
        if (error.response.status === 401) {
          this.props.history.push("/login");
        }
      });
  }

  // delete the entire users portfolio
  deleteProfile = (e) => {
    let userAuthInfo = {
      token: localStorage.getItem('jwtToken'),
      userID: localStorage.getItem('userID')
    }
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will lose all your data Forever",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          Authorize.deleteProfile(userAuthInfo)
            .then((res) => {
              if (res.data.success) {
                this.logout()
              } else {
                swal({
                  title: "Could not delete, Please Try again",
                  icon: "error",
                  dangerMode: true,
                })
              }
            })
        } else {
          swal("Good choice!");
        }
      });

  }

  // clear the web token and email from local storage when the user logs out
  logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userID');
    window.location.reload();
  }

  // grab theindex of the article clicked and pass it into delete function
  // if the server responds with success than display a message (swal) and remove the element from the state
  // Article function imported from 'utils' which hits back end sraping route
  deleteArticle = index => {
    let { _id } = this.state.savedArticles[index];
    let userId = localStorage.getItem('userID');

    ArticleFunction.deleteArticle(_id, userId)
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

  //  parses the article search bar and filters articles that match
  handleArticleFilter(e) {
    const condition = new RegExp(e.target.value, 'i');
    const savedArticlesFilter = this.state.savedArticles.filter(name => {
      return condition.test(name.title);
    });
    this.setState({
      savedArticlesFilter
    })
  }


  // function to toggle the side result
  toggle(nr) {
    let modalNumber = 'modal' + nr
    this.setState({
      [modalNumber]: !this.state[modalNumber]
    });
  }

  // sets the state to the values of the inputs being used to add stocks
  inputVal = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  addFullWatchlist = (e) => {
    let userId = localStorage.getItem('userID');
    let { addWatchlistName } = this.state
    if (addWatchlistName) {

      addWatchlistName = addWatchlistName.trim();

      WatchlistFunction.addFullWatchlist({ addWatchlistName, userId })
        .then((res) => {
          swal("Watchlist added", "Remember to watch for market changes", "success");
          this.getAllUserData()
        })
    } else {
      swal({
        title: "Cannot add empty value",
        icon: "error",
        dangerMode: true,
      })
    }
  }

  deleteWatchlist = (e) => {
    let userId = localStorage.getItem('userID');
    // e.target.name is the id of the watchlist. the watchlist id is set to the 'name' property of each button so that it can be retrieved on click
    WatchlistFunction.deleteFullWatchList(e.target.name, userId)
      .then((res) => {
        if (res.data.success) {
          swal("Watchlist deleted", "You will no loner have access to this data", "success");
          this.getAllUserData()
        } else {
          swal({
            title: "Could not delete please try again",
            icon: "error",
            dangerMode: true,
          })
        }
      });
  }

  deleteStockFromWatchlist = (id, stock) => {
   let stockName = stock.name; 
    WatchlistFunction.deleteStockFromWatchlist({ id, stockName })
      .then((res) => {
        if (res.data.success) {
          swal("Stock deleted", "You will no loner have access to this data", "success");
          this.getAllUserData()
        } else {
          swal({
            title: "Could not delete please try again",
            icon: "error",
            dangerMode: true,
          })
        }
      })
  }

  addStockToWatchList = (id) => {
    let { addStockToWatchListVal } = this.state;
    if (addStockToWatchListVal) {

      addStockToWatchListVal = addStockToWatchListVal.trim();

      WatchlistFunction.addStockToWatchList({ addStockToWatchListVal, id })
        .then((res) => {
          if (res.data.success) {
            swal("Stock added", "Best of luck", "success");
            this.getAllUserData()
          } else {
            swal({
              title: "Could not add please try again",
              icon: "error",
              dangerMode: true,
            })
          }
        })
    } else {
      swal({
        title: "You must enter a value",
        icon: "error",
        dangerMode: true,
      })
    }

  }


  // function to add a stock to users portfolio
  addStockInvestment = (e) => {
    let { addStockName, addStockPrice, addStockShares, addStockTicker, date } = this.state;

    addStockName = addStockName.trim();
    addStockPrice = addStockPrice.trim();
    addStockShares = addStockShares.trim();
    addStockTicker = addStockTicker.trim();

    let userID = localStorage.getItem('userID');
    if (!addStockName || !addStockPrice || !addStockShares || !addStockTicker) {
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
      let stockAdded = { addStockName, addStockPrice, addStockShares, addStockTicker, userID, date }
      Investment.addStock(stockAdded)
        .then((result) => {
          if (result.data.success) {
            swal("Stock added", "Best of luck", "success");
            this.getAllUserData()
          } else {
            swal({
              title: "Could not add, please try again",
              icon: "error",
              dangerMode: true,
            })
          }
        })
    }
  }

  // deletes a stock from the users investment portfolio
  deleteInvestment = (e) => {
    let userId = localStorage.getItem('userID');
    console.log(e.target.name)
    // e.target.name is the id of the watchlist. the watchlist id is set to the 'name' property of each button so that it can be retrieved on click
    Investment.deleteStock(e.target.name, userId)
      .then((result) => {
        if (result.data.success) {
          swal("Investment deleted", "Sorry it didnt work out", "success");
          this.getAllUserData()
        }
      })
  }


  // gets the total value all of all users investments, both in total and for each stock
  // returns an array of the values
  getInvestmentTotals = (e) => {
    let investedMoney = [];
    let moneyMade = [];
    let singleStockVal = [];
    this.state.investments.forEach((investment) => {
      if (investment.currentPrice) {
        let name = investment.name;
        let startingVal = investment.sharesPurchased * investment.pricePurchased;
        let currentVal = investment.sharesPurchased * investment.currentPrice;
        let singleStock = { name, startingVal, currentVal };
        singleStockVal.push(singleStock);
        investedMoney.push(investment.sharesPurchased * investment.pricePurchased);
        moneyMade.push(investment.sharesPurchased * investment.currentPrice);
      }
    })
  }


  render() {
    return (
      <div className="home-div">
        <Button onClick={() => this.toggle(8)} className="home-article-btn p-2"></Button>
        {/* Navbar component */}
        <MainNavbar
          pageName={'Stock Simple'}
          logout={localStorage.getItem('jwtToken') && this.logout}
          username={this.state.username}
          pageSwitchName='Go to Search'
          pageSwitchLink='/search'
          deleteProfile={this.deleteProfile}
        />
        {/* Modal that toggles and displays all saved articles */}
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
            {this.state.savedArticles.length ? (
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
                <h4 className="content-font text-white text-center">No Articles Saved</h4>
              )}
          </div>
        </ModalPage>

        {/* ternary that covers all visible components. if 'this.state.isLoading' is true than the waiting icon shows */}
        {!this.state.isLoading ? (
          <Row className="w-100 m-0 justify-content-center home-page-row">
            {/* first column shows all users watchlists */}
            <Col md="6" className="investments-col p-2">
              <div className="d-flex justify-content-between">
                <h4 className="content-font turq-text ml-3 d-inline">Watchlists</h4>
                <Dropdown size="sm">
                  <DropdownToggle caret id="add-stock-drop">
                    Add Watchlist
                  </DropdownToggle>
                  <DropdownMenu className="mr-5 p-2">
                    <ul className="list-unstyled p-2 mb-0">
                      <li>
                        <input
                          name="addWatchlistName"
                          className="search w-100 mb-2 p-2 border-rounded"
                          placeholder="Name"
                          onChange={this.inputVal}
                        />
                      </li>
                    </ul>
                    <DropdownItem divider />
                    <DropdownItem
                      className="content-font p-2 drop-down-btn"
                      onClick={this.addFullWatchlist}
                    >
                      Add a watchlist
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              {/* populate watchlist tab component with info from the state */}
              <WatchlistTab
                watchlists={this.state.watchlists}
                deleteWatchlist={this.deleteWatchlist}
                deleteStock={this.deleteStockFromWatchlist}
                addStockToWatchList={this.addStockToWatchList}
                addStockToWatchListInput={this.inputVal}
                name={'addStockToWatchListVal'}
              />
            </Col>
            <Col md="6" className="p-2">
              {/* second columns shows all users investments */}
              <div className="d-flex justify-content-between">
                <h4 className="content-font turq-text ml-3 d-inline">Investments</h4>
                <Dropdown size="sm">
                  <DropdownToggle caret id="add-stock-drop">
                    Add Stock
                  </DropdownToggle>
                  <DropdownMenu className="mr-5 p-2">
                    <ul className="list-unstyled p-2 mb-0">
                      <li>
                        <input
                          name="addStockName"
                          className="search w-100 mb-2 p-2 border-rounded"
                          placeholder="Name"
                          onChange={this.inputVal}
                        />
                      </li>
                      <li>
                        <input
                          name="addStockTicker"
                          className="search w-100 mb-2 p-2 border-rounded"
                          placeholder="Stock ticker"
                          onChange={this.inputVal}
                        />
                      </li>
                      <li>
                        <input
                          name="addStockShares"
                          className="search w-100 mb-2 p-2 border-rounded"
                          placeholder="# of shares"
                          onChange={this.inputVal}
                        />
                      </li>
                      <li>
                        <input
                          name="addStockPrice"
                          className="search w-100 mb-2 p-2 border-rounded"
                          placeholder="Price"
                          onChange={this.inputVal}
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

              {/* Investment accordion component */}
              <InvestAccordion
                investments={this.state.investments}
                deleteInvestment={this.deleteInvestment}
              >
              </InvestAccordion>
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
