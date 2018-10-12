import React, { Component } from 'react';
import Authorize from '../../utils/Authorize';
import SearchFunction from '../../utils/ScrapeFunctions';
import ArticleFunction from '../../utils/ArticleData';
import QueryStock from '../../utils/StockAPI';
import WatchlistAdd from '../../utils/Watchlists';
import MainNavbar from '../../components/Navbar';
import Article from '../../components/Article';
import SearchBar from '../../components/SearchBar';
import TablePage from "../../components/MoversTable";
import ModalPage from "../../components/SideApiResult";
import TickerResult from "../../components/TickerResult";
import NameResult from "../../components/NameResult"
import moment from 'moment';
import { Row, Col } from 'mdbreact';
import swal from 'sweetalert';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact'
import './Search.css';



class Search extends Component {

  constructor(props) {
    super(props);
    this.saveArticle = this.saveArticle.bind(this);
    this.searchVal = this.searchVal.bind(this);
    this.stockQueryName = this.stockQueryName.bind(this);
    this.stockQueryTicker = this.stockQueryTicker.bind(this);
    this.handleParam = this.handleParam.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.addToWatchlist = this.addToWatchlist.bind(this);
    this.deleteProfile = this.deleteProfile.bind(this);
    this.state = {
      isLoading: true,
      username: "",
      watchlists: [],
      nameSearchPopulated: false,
      tickerSearchPopulated: false,
      sideSearchOpen: false,
      tickerSearchResult: {},
      nameSearchResult: [],
      nameSearchResultFilter: [],
      stockSearchName: "",
      stockSearchTicker: "",
      searchParam: "HTL",
      articleSearch: [],
      badSearchMessage: "",
      modal6: false,
      modal7: false,
      date: moment().format("DD-MM-YYYY"),
      columns: [
        {
          label: 'Company',
          field: 'Company',
          sort: 'asc',
        },
        {
          label: 'Symbol',
          field: 'Symbol',
          sort: 'asc'
        },
        {
          label: 'Change %',
          field: 'Change',
          sort: 'asc'
        },
        {
          label: 'Change  $',
          field: 'Change $',
          sort: 'asc'
        },
      ],
      gainerRows: [],
      loserRows: []
    };
  }



  // when the page loads grab the token and userID from local storage
  // pass it into authenticate function.
  //if server responds ok than populate watchlists (used for the 'add to watchlist' feature of the search page)
  // then scrape websites for articles, then set is loading to false to remove to loading icon
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
          watchlists: [...res.data.watchlists]
        })
      })
      .then(() => {
        this.scrapeMarketWatch();
        this.scrapeInvestopedia();
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


  // scrapes the investopedia and populates the article search array of the state
  scrapeInvestopedia = (e) => {
    SearchFunction.investopedia()
      .then((articles) => {
        this.setState({
          articleSearch: articles.data
        })
      })
  }

  // function for getting best and worst performant stocks
  // Search function imported from 'utils' which hits back end sraping route
  scrapeMarketWatch = (e) => {
    SearchFunction.marketWatch()
      .then((movers) => {
        this.setState({
          gainerRows: movers.data.gainers,
          loserRows: movers.data.losers
        })
      })
  }


  //function saves article. It finds the selected article by getting the array element with the index passed in from the 'map function'
  // when the server responds with succuess, filter through the articles array of the state to remove the one that was just saved and sisplay a message
  saveArticle = index => {
    let { title, link, desc, imgLink } = this.state.articleSearch[index];
    let date = this.state.date;
    let user = localStorage.getItem('userID');

    ArticleFunction.saveArticle({ user, title, link, desc, imgLink, date })
      .then((response) => {
        if (response.data.success) {
          this.setState({
            articleSearch: this.state.articleSearch.filter((_, i) => i !== index)
          });
          swal("Article Saved", "Its on your home page", "success");
        } else {
          swal({
            title: response.data.msg,
            icon: "error",
            dangerMode: true,
          });
        }
      })
  }


  // this function changes the state of the search inputs for the 'search side navgation' based on what is being typed in the input
  searchVal = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    state.sideSearchOpen = true;
    this.setState(state);
  }

  // method is called to change the value of 'search param' in the state, which is how the user wants their results ordered
  // the value changes based on which radio button is checked
  handleParam = (e) => {
    this.setState({
      searchParam: e.target.value
    })
  }

  // method called when user queries a stock by name
  stockQueryName = (e) => {
    // make an object of the search name, and search type based on which button was pressed
    let { stockSearchName, searchParam } = this.state;
    let queryObj = { stockSearchName };
    queryObj.queryType = e.target.name;

    if (!stockSearchName) {
      this.setState({
        badSearchMessage: "Your query is incomplete. You need to include a name",
        sideSearchOpen: true
      })
    } else {
      QueryStock.userStockSearch(queryObj)
        .then((result) => {
          // set the result array equal to a variable
          let results = result.data.data;

          // search param grabbed from the state when destructured at the beggining of the query
          // 'LTH' === low to high, and 'HTL' === high to low
          // API returns number as string so need to parse it
          // sorting an array of objects, so need to sort by a property of that object
          if (searchParam === 'LTH') {
            results.sort(function (a, b) {
              return parseFloat(a.price) - parseFloat(b.price)
            })
          } else {
            results.sort(function (a, b) {
              return parseFloat(b.price) - parseFloat(a.price)
            })
          }

          // return the sorted array
          return results;
        })
        .then((sortedResults) => {

          // array of objects sorted based on price
          if (sortedResults.length) {
            this.setState({
              nameSearchResult: sortedResults,
              nameSearchResultFilter: sortedResults,
              nameSearchPopulated: true,
              tickerSearchPopulated: false,
              sideSearchOpen: false,
              stockSearchName: "",
              stockSearchTicker: ""
            })
          } else {
            this.setState({
              sideSearchOpen: true,
              badSearchMessage: "That search returned zero results. Try again"
            })
          }
          return sortedResults.length
        })
        .then((length) => {
          // toggle the side bar after the results have come back
          if (length) {
            this.toggle(8)
          }
        })
        .catch((err) => {
          this.setState({
            badSearchMessage: "That search returned zero results. Try again"
          })
        });
    }
  }

  // method called when user queries a stock by ticker
  stockQueryTicker = (e) => {
    // make an object of the search ticker, and search type based on which button was pressed
    let { stockSearchTicker } = this.state;
    let queryObj = { stockSearchTicker };
    queryObj.queryType = e.target.name;

    if (!stockSearchTicker) {
      this.setState({
        badSearchMessage: "Your query is incomplete. You need to include a ticker"
      })
    } else {
      QueryStock.userStockSearch(queryObj)
        .then((result) => {
          // object with one stock ticker and related data
          this.setState({
            tickerSearchResult: result.data.data[0],
            tickerSearchPopulated: true,
            nameSearchPopulated: false,
            sideSearchOpen: false,
            stockSearchName: "",
            stockSearchTicker: ""
          })
        })
        .then(() => {
          // toggle the side bar after the results have come back
          this.toggle(8)
        })
        .catch((err) => {
          this.setState({
            badSearchMessage: "That search returned zero results. Try again"
          })
        });
    }
  }

  // function to toggle the sideview div to display the api results
  toggle(nr) {
    let modalNumber = 'modal' + nr
    this.setState({
      [modalNumber]: !this.state[modalNumber]
    });
  }

  // filters the search and sets the results property of the state to the filtered version based on what the user types in the input
  handleSearch(e) {
    const condition = new RegExp(e.target.value, 'i');
    const nameSearchResultFilter = this.state.nameSearchResult.filter(name => {
      return condition.test(name.name);
    });

    this.setState({
      nameSearchResultFilter
    })
  }

  // adds a stock to a watchlist - in either the 'search by name' or 'search by ticker' results
  // the buttons are made by mapping the users 'watchlists' in the state and the id is passed into the 'on click' function
  // if condition used to check where the request came from because the state stores the 'search by ticker' and search by name resulst separately
  addToWatchlist = (name, watchlistId, stockInfo) => {
    let addedStock = {};
    addedStock.id = watchlistId;
    if (stockInfo === 'ticker') {
      let symbol = this.state.tickerSearchResult.symbol;
      addedStock.addStockToWatchListVal = symbol;
    } else {
      addedStock.addStockToWatchListVal = stockInfo.symbol;
    }

    WatchlistAdd.addStockToWatchList(addedStock)
      .then((res) => {
        if (res.data.success) {
          swal({
            title: "Complete",
            text: res.data.message,
            icon: "success",
          });
        } else {
          swal({
            title: "Could not add. Please try again",
            icon: "error",
            dangerMode: true,
          });
        }
      })
      .catch((err) => {
        swal({
          title: "Could not add. Please try again",
          icon: "error",
          dangerMode: true,
        });
      })

  }

  //use regex to put commas on large numbers. used for stock market cap, available shares, and volume
  addCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  render() {
    return (
      <div className="search-div">
        <MainNavbar
          navToggle={this.navToggle}
          pageName={'Stock Simple'}
          logout={localStorage.getItem('jwtToken') && this.logout}
          username={this.state.username}
          pageSwitchName='Go to Home'
          pageSwitchLink='/'
          goHome='/'
          deleteProfile={this.deleteProfile}
        />

        {/* Side Modal that displays results. Component displayed determined by which boolean in state is true */}
        <ModalPage
          modal8={this.state.modal8}
          toggleClick={() => this.toggle(8)}
          toggleView={() => this.toggle(8)}
          title={'Market Results'}
        >
          {/* if the ticker search has been returned display this */}
          {this.state.tickerSearchPopulated ? (
            <TickerResult
              name={this.state.tickerSearchResult.name}
              symbol={this.state.tickerSearchResult.symbol}
              price={this.state.tickerSearchResult.price}
              exchange={this.state.tickerSearchResult.stock_exchange_short}
              day_change={this.state.tickerSearchResult.day_change}
              day_low={this.state.tickerSearchResult.day_low}
              day_high={this.state.tickerSearchResult.day_high}
              year_week_high={this.state.tickerSearchResult[`52_week_high`]}
              year_week_low={this.state.tickerSearchResult[`52_week_low`]}
              market_cap={this.addCommas(this.state.tickerSearchResult.market_cap)}
              shares={this.addCommas(this.state.tickerSearchResult.shares)}
              volume={this.addCommas(this.state.tickerSearchResult.volume)}
            >
              <Dropdown className="dropdown">
                <DropdownToggle caret color="grey">
                  Add to Watchlist
                    </DropdownToggle>
                <DropdownMenu className="p-2">
                  {this.state.watchlists.map((watchlist, index) => (
                    <DropdownItem key={index} className="drop-down-btn" onClick={() => this.addToWatchlist(watchlist.name, watchlist._id, 'ticker')}>{watchlist.name}</DropdownItem>
                  ))
                  }
                </DropdownMenu>
              </Dropdown>
            </TickerResult>
          ) : false}

          {/* if the name search has been returned display this */}
          {this.state.nameSearchPopulated ? (
            <div>
              <input
                className="search w-100"
                placeholder="Filter results by name"
                onChange={this.handleSearch}
              />
              {this.state.nameSearchResultFilter.map((stock, filterindex) => (
                <NameResult
                  cla={true}
                  key={filterindex}
                  name={stock.name}
                  ticker={stock.symbol}
                  price={stock.price}
                  currency={stock.currency}
                  stockExchange={stock.stock_exchange_short}
                >
                  <Dropdown className="dropdown">
                    <DropdownToggle caret color="grey">
                      Add to Watchlist
                    </DropdownToggle>
                    <DropdownMenu className="p-2">
                      {this.state.watchlists.map((watchlist, index) => (
                        <DropdownItem key={index} className="drop-down-btn" onClick={() => this.addToWatchlist(watchlist.name, watchlist._id, stock)}>{watchlist.name}</DropdownItem>
                      ))
                      }
                    </DropdownMenu>
                  </Dropdown>
                </NameResult>
              ))
              }
            </div>
          ) : false}
        </ModalPage>


        {/* ternary that covers all page components. if 'this.state.isLoading' is true than the waiting icon shows */}
        {!this.state.isLoading ? (
          <div id="SearchContainer">

            <SearchBar pageWrapId={"page-wrap"} outerContainerId={"SearchContainer"}
              searchVal={this.searchVal}
              stockQueryName={this.stockQueryName}
              stockQueryTicker={this.stockQueryTicker}
              stockName={this.state.stockSearchName}
              stockTicker={this.state.stockSearchTicker}
              // 'High to Low, Low to High, and Market' - these are the props passed into the search component radio buttons that change the value of 'search Param' in the state
              HTL={this.state.searchParam === "HTL"}
              LTH={this.state.searchParam === "LTH"}
              handleParam={this.handleParam}
              // paragraph gets populated if the search value is empty
              badSearch={this.state.badSearchMessage}
              open={this.state.sideSearchOpen}
            />

            {/* empty div that covers the page when the side bar slides out */}
            <div id="page-wrap">
            </div>

            {/* Tables showing top gainers and losers for the day */}
            <Row className="w-100 p-3 justify-content-center m-0">
              <Col>
                <TablePage
                  title="Gainers"
                  columns={this.state.columns}
                  rows={this.state.gainerRows}
                ></TablePage>
              </Col>
              <Col>
                <TablePage
                  title="Losers"
                  columns={this.state.columns}
                  rows={this.state.loserRows}
                ></TablePage>
              </Col>
            </Row>

            {/* Display the latest news articles */}
            <Row className="justify-content-center p-2">
              <Col lg="12" className="mb-2 pl-4">
                <h4 className="turq-text text-center content-font d-block">Latest News</h4>
              </Col>

              {/* render the articles and only return 5*/}
              {this.state.articleSearch.map((article, index) => {
                if (index < 5) {
                  return (
                    <div key={index} className="p-2">
                      <Article
                        imgLink={article.imgLink}
                        title={article.title}
                        desc={article.desc}
                        action={'Save'}
                        // site uses relative url so need to interpolate full url for link to work
                        link={`https://www.investopedia.com/${article.link}`}
                        date={this.state.date}
                        actionBtn={() => this.saveArticle(index)}
                        className="m-2"
                      >
                      </Article>
                    </div>
                  )
                }
              })}
            </Row>
          </div>
          // end of the ternary, so display loading dots if page has not loaded
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


export default Search;