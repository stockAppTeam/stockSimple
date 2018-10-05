import React, { Component } from 'react';
import Authorize from '../../utils/Authorize';
import SearchFunction from '../../utils/ScrapeFunctions';
import ArticleFunction from '../../utils/ArticleData';
import QueryStock from '../../utils/StockAPI';
import './Search.css';
import MainNavbar from '../../components/Navbar';
import Article from '../../components/Article';
import SearchBar from '../../components/SearchBar'
import TablePage from "../../components/MoversTable"
import ModalPage from "../../components/SideApiResult"
import moment from 'moment';
import { Row, Col } from 'mdbreact';
import swal from 'sweetalert';

class Search extends Component {

  constructor(props) {
    super(props);
    this.saveArticle = this.saveArticle.bind(this);
    this.navToggle = this.navToggle.bind(this);
    this.searchVal = this.searchVal.bind(this);
    this.stockQuery = this.stockQuery.bind(this);
    this.handleParam = this.handleParam.bind(this);
    this.state = {
      isLoading: true,
      username: "",
      collapse: false,
      isWideEnough: false,
      stockSearchName: "",
      stockSearchTicker: "",
      stockSearchMin: "",
      stockSearchMax: "",
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
      .then(() => {
        this.scrapeMarketWatch()
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

  // scrapes the investopedia with the method from utils and logs the results
  scrapeInvestopedia = (e) => {
    SearchFunction.investopedia()
      .then((articles) => {
        this.setState({
          articleSearch: articles.data
        })
      })
  }

  // function for getting 'best and worst performant stocks
  // Search function imported from 'utils' which hits back end sraping route
  scrapeMarketWatch = (e) => {
    SearchFunction.marketWatch()
      .then((movers) => {
        console.log(movers)
        this.setState({
          gainerRows: movers.data.gainers,
          loserRows: movers.data.losers
        })
      })
  }


  //function saves article. It finds the selected article by getting the array element with the index passed in from the 'map function'
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


  // this function changes the state of the search paramaters for the 'search side navgation' based on what is being typed in the input
  searchVal = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }

  // method is called to change the value of 'search param' in the state, which is how the user wants their results ordered
  // the value changes based on which radio button is checked
  handleParam = (e) => {
    this.setState({
      searchParam: e.target.value
    })
  }

  // method called when user queries a stock, values are retrieved from the state (which were set by stockQuery() and searchParam())
  stockQuery = (e) => {
    let { stockSearchName, stockSearchTicker, stockSearchMin, stockSearchMax, searchParam } = this.state;
    let queryObj = { stockSearchName, stockSearchTicker, stockSearchMin, stockSearchMax, searchParam };

    if (!stockSearchName || !stockSearchTicker) {
      this.setState({
        badSearchMessage: "Your query is incomplete. You need at least a name or ticker. Please Try again"
      })
    } else {
      console.log(this.state);
      this.toggle(8)
      QueryStock.userStockSearch(queryObj);
    }
  }


  // function to toggle the sideview div to display the api results
  toggle(nr) {
    let modalNumber = 'modal' + nr
    this.setState({
      [modalNumber]: !this.state[modalNumber]
    });
  }



  render() {
    return (
      <div className="search-div">
        <MainNavbar
          navToggle={this.navToggle}
          isWideEnough={!this.state.isWideEnough}
          collapse={this.state.collapse}
          pageName={'Stock Simple'}
          logout={localStorage.getItem('jwtToken') && this.logout}
          username={this.state.username}
          pageSwitchName='Go to Home'
          pageSwitchLink='/'
        />
        <ModalPage
          modal8={this.state.modal8}
          toggleClick={() => this.toggle(8)}
          toggleView={() => this.toggle(8)}
        />
        {!this.state.isLoading ? (
          <div id="App">
            <SearchBar pageWrapId={"page-wrap"} outerContainerId={"App"}
              searchVal={this.searchVal}
              stockQuery={this.stockQuery}
              stockName={this.state.stockSearchName}
              stockTicker={this.state.stockSearchTicker}
              stockMin={this.state.stockSearchName}
              stockMax={this.state.stockSearchName}
              // 'High to Low, Low to High, and Market' - these are the props passed into the search component radio buttons that change the value of 'search Param' in the state
              HTL={this.state.searchParam === "HTL"}
              LTH={this.state.searchParam === "LTH"}
              MKT={this.state.searchParam === "MKT"}
              handleParam={this.handleParam}
              // paragraph gets populated if the search value is empty
              badSearch={this.state.badSearchMessage}
            />
            <div id="page-wrap">
            </div>
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
            <Row className="justify-content-center w-100">
              <Col lg="12" className="mb-2 pl-4">
                <h2 className="turq-text text-center content-font d-block pl-3">Latest News</h2>
              </Col>
              {/* render the articles */}
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
                  className="m-2"
                >
                </Article>
              ))}
            </Row>
          </div>
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
