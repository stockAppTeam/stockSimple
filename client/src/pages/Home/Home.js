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
import { Line, Bar } from 'react-chartjs-2';

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
    this.createInvestmentBarChart = this.createInvestmentBarChart.bind(this);
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
      investmentChart: {}, // Holds the object required to pass to a chartjs Bar chart type
      investmentChartOptions: // Options for the display of the investment chart
      {
        legend: {
          display: false
        },
        barValueSpacing: 20,
        scales: {
          xAxes: [{ stacked: true, ticks: { fontSize: 18 } }],
          yAxes: [{ stacked: true, ticks: { fontSize: 18 } }]
        },
        tooltips: {
          enabled: false
        }
      },
      historicalChartDataByWatchlist: "", // used with the historical charts for watchlists
      historicalChartOptions: // Options for the display of the historical charts
      {
        legend: {
          display: true
        },
        tooltips: {
          enabled: true
        },
        scales: {
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                'day': 'MMM DD'
              }
            }
          }]
        }
      },
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

        this.setState({
          username: res.data.name,
          savedArticles: res.data.articles,
          savedArticlesFilter: res.data.articles,
          investments: res.data.investments,
          watchlists: watchlists,
          historicalChartDataByWatchlist: res.data.historicalChartDataByWatchlist,
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
        this.getInvestmentTotals().then((investmentInfo) => {
          this.createInvestmentBarChart(investmentInfo);
        });
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

      addStockToWatchListVal = addStockToWatchListVal.toUpperCase().trim();

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


  // This function provides information about the user's investments, to be consumed by
  // the createInvestmentBarChart function that builds the actual chart object
  getInvestmentTotals = (e) => {
    let investedMoney = [];
    let moneyMade = [];
    let singleStockVal = [];

    return new Promise((resolve, reject) => {

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
      resolve(singleStockVal);
    });
  }

  // This functions builds a Bar-style chart object of the user's investments
  // Because of the way that the chart is displayed, we have to do some math.
  // The base bar shows the total investment amount of the stock.
  // Depending on whether the stock has gone down or up after the initial purchase,
  // the top of the bar will show in green (gain) or red (loss).
  // This allows the user to quickly and easily see how each individual investment is doing.
  createInvestmentBarChart(info) {

    // ChartJS requires the labels and data to be in arrays, so we need to build the object accordingly
    let names = [];
    let startingVal = [];
    let currentVal = [];

    names.push("Total"); // for the summary of all values for loss/gain
    for (let stock in info) {
      names.push(info[stock].name);
      startingVal.push(info[stock].startingVal);
      currentVal.push(info[stock].currentVal);
    }

    // Now the math to properly scale the profit/loss in the chart.
    // Between the purchase price and the present price, the max scale for each stock will be the greater value.
    // The top portion of the chart will be either green (if recent > original) or red (if original > recent)
    let baseVal = [];
    let gainVal = [];
    let lossVal = [];

    // Pre-allocate the first spot in the arrays for the total values result
    baseVal.push(0);
    gainVal.push(0);
    lossVal.push(0);

    // Check each of the user's investments and build the arrays to use in the bar chart object
    for (let i = 0; i < startingVal.length; i++) {

      // If a loss, then the gainVal = 0
      if (startingVal[i] > currentVal[i]) {
        gainVal.push(0);
        lossVal.push(startingVal[i] - currentVal[i]);
        baseVal.push(currentVal[i]);
        lossVal[0] += (startingVal[i] - currentVal[i]);
      }
      else if (startingVal[i] < currentVal[i]) {
        lossVal.push(0);
        gainVal.push(currentVal[i] - startingVal[i]);
        baseVal.push(startingVal[i]);
        gainVal[0] += (currentVal[i] - startingVal[i]);
      }

      baseVal[0] += startingVal[i]; // This holds the total amount invested initially in all stocks
    }

    // Now see whether we've gained or lost overall
    if (gainVal[0] > lossVal[0]) {
      // we've made a profit!
      gainVal[0] = gainVal[0] - lossVal[0];
      lossVal[0] = 0;
    }
    else if (gainVal[0] < lossVal[0]) {
      // money has been lost
      lossVal[0] = lossVal[0] - gainVal[0];
      gainVal[0] = 0;
    }

    let investmentChartObject = ({
      labels: names,
      datasets: [
        {
          label: "Baseline",
          backgroundColor: "#127880",
          data: baseVal
        },
        {
          label: "Loss",
          backgroundColor: 'rgba(255, 0, 0, 0.3)', // Translucent red. Does this look a bit better for the loss? It needs to be clear for the user that the blue is the money they have left after the loss
          data: lossVal
        }, {
          label: "Gain",
          backgroundColor: "green",
          data: gainVal
        }
      ]
    });

    // Add this new chartjs object to the state, so we can use it in the render
    this.setState({
      investmentChart: investmentChartObject
    });

    // When rendering use something like:
    // <Bar data={this.state.investmentChart} options={this.state.investmentChartOptions} />

  }




  render() {


    // Build an array of chart objects
    // we're using the for-in loop because each chart object has a property (which is the ticker name), and this makes it easy to get
    let watchlistCharts = [];
    for (let watchlist in this.state.historicalChartDataByWatchlist) {

      // Add to the array of chart objects, to be used for rendering
      watchlistCharts.push([
        <div>
          <Line
            key={watchlist}
            data={this.state.historicalChartDataByWatchlist[watchlist]}
            options={this.state.historicalChartOptions}
          />
        </div>]);
    }

    // This is what actually gets rendered
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
          goHome={'/'}
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
                historicalChartDataByWatchlist={this.state.historicalChartDataByWatchlist}
                historicalChartOptions={this.state.historicalChartOptions}
              >
              </WatchlistTab>
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
              {/* If there are investments in the state than display the chart */}
              <InvestAccordion
                investments={this.state.investments}
                deleteInvestment={this.deleteInvestment}
              >
              </InvestAccordion>
              {this.state.investments.length ? (
                <Bar className="bar-chart" data={this.state.investmentChart} options={this.state.investmentChartOptions} />
              ) : (
                  false
                )}
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
