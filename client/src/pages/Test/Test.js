import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import './Test.css';
import Authorize from '../../utils/Authorize'; // This is required so that I can get the user info, which includes the watchlists
import StockAPI from '../../utils/StockAPI';
import { Line } from 'react-chartjs-2';
//import LineChart from '../../components/LineChart';
//import BarChart from '../../components/BarChart';
//import PieChart from '../../components/PieChart';

class Test extends Component {

  constructor(props) {
    super(props);
    this.state = {
      
      userTickersFromDB: ['AAPL','MSFT','AMZN', 'GE'], // This would be obtained by a back-end call to get the user's list of tickers
      
      latestTickerInfo: [], // For each ticker in the user's list of tickers, this is the latest data. Up to 50 can be read at a time with our paid API
      
      allUserTickerHistoricalInfo: [], // an array of objects containg the historical info for each of the user's tickers

      allUserTickerCharts: [], // This holds an array of the "latest info" chartjs objects for the user's tickers
      
      allUserTickerHistoricalCharts: [], // This holds an array of the historical chartjs objects for the user's tickers
                                         // For the moment, the same date range is used for them all
      
      // allInfoFromStockTickers: [], // An array of stock data objects
      // historicalInfoFromStockTickers: {}, // An array of historical data for each stock in our allInfoFromStockTickers list?
      sectorPerformanceData: [],    // In progress

      // Required for user info. Oct 2, 2018: don't use for now. We need to do all the stocl API calls from the back end. Can't do from the front end or we get CORS issues
      // username: "",
      // savedArticles: [],

      // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors/Color_picker_tool
      chartData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Price per Share',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [99.23, 110.43, 104.20, 138.95, 186.00, 190.21, 202.34]
          },
          {
            label: 'Market Cap',
            fill: true,
            lineTension: 0.1,
            backgroundColor: 'rgba(127, 63, 191)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]
          }
        ]
      }


    };
  }

  componentDidMount() {

    console.log("Test.js: componentDidMount");

    // Get the user info, so we know which watchlists and other stocks that we need to add
    // let userAuthInfo = {
    //   token: localStorage.getItem('jwtToken'),
    //   userID: localStorage.getItem('userID')
    // }

    // Oct 2, 2018: Comment this out for now as we're getting CORS issues using axios on the front end
    // We need to create routes and have the back end do all the axios calls to the stock APIs
    // Authorize.authenticate(userAuthInfo)
    //   .then((res) => {
    //     console.log(res.data)
    //     this.setState({
    //       username: res.data.name,
    //       savedArticles: res.data.articles
    //       // To do: add the watchlists here. Need to create model, controller, etc.
    //     })
    //   })
    //   .catch((error) => {
    //     if (error.response.status === 401) {
    //       this.props.history.push("/login");
    //     }
    //   });



    // Should we retrieve the user's stock data here? How? Read from the back end?
    // Should we then pass this array of tickers into the functions below which use the Stock API to get info based in the tickers?

    // Requires: an array of tickers. This returns the latest stock info for all user tickers
    StockAPI.getLatestStockInfoAllTickers(this.state.userTickersFromDB)
      .then((stockInfo) => {
        console.log("getLiveWatchListStockInfo: I've gotten the stock info from WorldTradingData:", stockInfo);

        this.setState({
          latestTickerInfo: stockInfo.data
          //allInfoFromStockTickers: stockInfo.data // In contrast, here you don't have to push in .data because it needs to be an object (defined up above as object).
          // Before, I was putting the entire object into an array, so of course I couldn't iterate over it
        });
      });

    // Requires: array of tickers, start date, end date
    StockAPI.getHistoricalInfoAllTickers(this.state.userTickersFromDB, "", "")
      .then((stockInfo) => {
        console.log("I've gotten the historical stock info from WorldTradingData:", stockInfo);

        this.setState({
          allUserTickerHistoricalInfo: stockInfo // The api returns an array of objects
        });
      });

    // Requires: one ticker, start date, end date
    // Can probablt get rid of this, and combine it with the getHistoricalInfoAllTickers function
    let ticker = "GE";
    StockAPI.getHistoricalInfoOneTicker(ticker, "", "")
      .then((stockInfo) => {
        console.log("I've gotten the historical stock info from WorldTradingData:", stockInfo);

        // this.setState({
        //   historicalInfoFromStockTickers: stockInfo.history // You have to push in .data because it needs to be an array.
        //   // Before, I was putting the entire object into an array, so of course I couldn't iterate over it
        // });
      });


    // Oct 1: Commented out because I've gone over my allowed API calls for the day
    // This is another one that we could potentially cache the information for during non-trading hours
    /*
     StockAPI.getSectorPerformance()
     .then((stockInfo)=>{
       console.log("I've gotten the sector performance info from Alphavantage:",stockInfo);
     });
    */

    /* Commented out because it is an alternate free stock API, which we may not need
    StockAPI.getWatchListStockInfoFromBarchart()
    .then((stockInfo)=>{
      console.log("I've gotten the stock info from Barchart:",stockInfo);
    });
    */

  }

  render() {

    console.log("Rendering Test.js");
    console.log("State info:", this.state);

    // Build all the chart objects before we need to show them on the page
    buildAllHistoricalChartObjects(this.state);





    // Mapping will only work on an array. So I needed to make sure the propery was filled with an array of data above
    let tickerList = this.state.latestTickerInfo.map((stock, index) => (
      <div key={stock.symbol}>{stock.symbol}: ${stock.price} ${stock.change_pct}%</div>
    ));

    //updateChartDataProps(this.state);
    updateChartDataProps(this.state);

    return (
      <div className="container">
        <p>World Trading Data API Test</p>
        <div>

          {/* {this.state.allInfoFromStockTickers.map((stock, index) => (
            <div key={stock.symbol}>{stock.symbol}: ${stock.price} ${stock.change_pct}%</div>
        ))} */}

          {tickerList}

        </div>

        <div>
          <h2>Apple Inc.</h2>
          <Line data={this.state.chartData} />
        </div>

        {/* <h2>Apple Inc. - Line component test</h2>
        <LineChart chartData={this.state.chartData} />

        <h2>Apple Inc. - Bar component test</h2>
        <BarChart chartData={this.state.chartData} />

        <h2>Pie component test - use to show percentage of investments</h2>
        <PieChart chartData={this.state.chartData} /> */}

      </div>
    );
  }

}

// This function builds the array of historical chart objects, according to the 
// state data which has first been updated with a call the stock API
function buildAllHistoricalChartObjects(state){

  console.log("buildAllHistoricalChartObjects:");
  console.log("state.allUserTickerHistoricalInfo:",state.allUserTickerHistoricalInfo);
  console.log("state.allUserTickerHistoricalInfo length:",state.allUserTickerHistoricalInfo.length);
  console.log("state.allUserTickerHistoricalInfo typeof:",typeof(state.allUserTickerHistoricalInfo));

  // const values = Object.values(state.allUserTickerHistoricalInfo.ticker)
  // console.log(values);

  // //let valuesArray = [];
  // values.map(function (value) {
  //   console.log(`Close: ${value.close}`);
  //   //valuesArray.push(value.close);
  // });


  // state.allUserTickerHistoricalInfo.forEach(tickerHistory => {
  //   console.log("tickerHistory: ",tickerHistory.ticker);
  // });
  
  // state.allUserTickerHistoricalInfo.map(function (tickerHistory) {
  //   console.log("tickerHistory: ",tickerHistory);
  // });

  // This works
  // state.latestTickerInfo.map((stock) => {
  //   console.log("tickerHistory: ",stock);
  // });

  const keys = Object.keys(state.allUserTickerHistoricalInfo)
  console.log(keys);

  state.allUserTickerHistoricalInfo.map((tickerHistory) => {
    console.log("tickerHistory: ");
  });

  //const keys = Object.keys(state.allUserTickerHistoricalCharts)
  //state.chartData.labels = keys;

  var myLineChart = {
    labels: ['A','B'], // Dates within the specified range
    datasets: [
      {
        label: "Price per Share",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [65, 59, 80, 81, 56, 55, 40]
      },
      {
        label: "Market Cap",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: [28, 48, 40, 19, 86, 27, 90] 
      }
    ]
  };

  console.log("myLineChart: ",myLineChart);

}




// Take in a data from the stock API and use it to update the chartData property values
// so that we get the chart formatted exactly as we expect
// function updateChartDataProps(xxx) {

//   console.log("updateChartDataProps");


//   xxx.chartData.labels = ['a','b','c'];

//   xxx.chartData.labels.map(function(element ) { 
//     console.log(element); 
//   });
// }

// How can I share "this" with this function without having to pass this.state?
// https://frontarm.com/articles/when-to-use-arrow-functions/
function updateChartDataProps(state) {

  console.log("updateChartDataProps: labels");
  state.chartData.labels.map(function (element) {
    console.log(element);
  });

  // console.log("updateChartDataProps: tickers");
  // state.historicalInfoFromStockTickers.history.map(function (element) {
  //   console.log(element);
  // });

  // const keys = Object.keys(fruits)
  // console.log(keys) // [apple, orange, pear]


  const keys = Object.keys(state.allUserTickerHistoricalCharts)
  console.log(keys);

  state.chartData.labels = keys;

  const values = Object.values(state.allUserTickerHistoricalCharts)
  console.log(values);

  let valuesArray = [];
  values.map(function (value) {
    console.log(`Close: ${value.close}`);
    valuesArray.push(value.close);
  });
  state.chartData.datasets[0].data = keys;


console.log("state.chartData",state.chartData);

}

export default Test;
