import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import './Test.css';
import StockAPI from '../../utils/StockAPI';
import { Line } from 'react-chartjs-2';
import LineChart from '../../components/LineChart';
// import BarChart from '../../components/BarChart';
// import PieChart from '../../components/PieChart';

class Test extends Component {

  constructor(props) {
    super(props);
    this.state = {

      userTickersFromDB: ['AAPL', 'MSFT', 'AMZN', 'GE'], // This would be obtained by a back-end call to get the user's list of tickers
      latestTickerInfo: [], // For each ticker in the user's list of tickers, this is the latest data. Up to 50 can be read at a time with our paid API
      allUserTickerHistoricalInfo: [], // an array of objects containg the historical info for each of the user's tickers
      allUserTickerCharts: [], // This holds an array of the "latest info" chartjs objects for the user's tickers
      allUserTickerHistoricalCharts: [], // This holds an array of the historical chartjs objects for the user's tickers
      // For the moment, the same date range is used for them all

      sectorPerformanceData: [],    // In progress

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

    // the StockAPI file in utils calls the back end using an axios GET.
    // The back end will do the actual query of the API from the stock website
    this.updateChartDataProps(); 
    
    
    let p1 = StockAPI.getLatestStockInfoAllTickers()
      .then((stockInfo) => {
        console.log(stockInfo);
        this.setState({
          latestTickerInfo: stockInfo.data.data
        });
      });

    // Requires: array of tickers, start date, end date
    // Oct 5: Where should these date range values be obtained?
    let p2 = StockAPI.getHistoricalInfoAllTickers()
      .then((stockInfo) => {
        console.log(stockInfo);
        this.setState({
          allUserTickerHistoricalInfo: stockInfo.data // The api returns an array of objects of historical info for each ticker
        });
      });

    Promise.all([p1, p2])
      .then(() => {
        console.log("p1 and p2 done in Test.js", this.state.latestTickerInfo, this.state.allUserTickerHistoricalInfo);
        this.updateChartDataProps();
      });





if(0){
    StockAPI.getLatestStockInfoAllTickers()
      .then((stockInfo) => {
        this.setState({
          latestTickerInfo: stockInfo.data.data
        });
      });


    // Requires: array of tickers, start date, end date
    // Oct 5: Where should these date range values be obtained?
    StockAPI.getHistoricalInfoAllTickers()
      .then((stockInfo) => {
        this.setState({
          allUserTickerHistoricalInfo: stockInfo.data // The api returns an array of objects of historical info for each ticker
        });
      });


    // // Requires: one ticker, start date, end date
    // // Can probably get rid of this, and combine it with the getHistoricalInfoAllTickers function
    StockAPI.getHistoricalInfoOneTicker()
      .then((stockInfo) => {
        // Will this route even be necessary?
      });
}

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

  updateChartDataProps = (e) => {

    console.log("history!: ", this.state.allUserTickerHistoricalInfo);

    // const keys = Object.keys(this.state.allUserTickerHistoricalInfo)
    // console.log(keys);

    let chartObjects = [];
    let allCharts = [];
    let p1 = new Promise((resolve, reject) => {

      // For each of the historical items, build a chart object
      //let chartObjects = [];
      this.state.allUserTickerHistoricalInfo.map(function (ticker) {
        console.log(ticker.symbol);

        let newHistoryObject = {};
        newHistoryObject.historyDates = [];
        newHistoryObject.historyOpen = [];
        newHistoryObject.historyClose = [];
        newHistoryObject.historyHigh = [];
        newHistoryObject.historyLow = [];
        newHistoryObject.historyVolume = [];

        newHistoryObject.ticker = ticker.symbol;

        // Obtain the dates from the historical objects. They come from the object property name
        // const keys = Object.keys(ticker.history);
        // newHistoryObject.historyDates = keys;

        console.log("-------");
        // Object.keys(ticker.history).forEach(function (ticker) {
        //   console.log(ticker); // key
        //   console.log(ticker.history); // value
        // });

        // get the date values
        Object.keys(ticker.history).forEach(function (tickerDate) {
          // console.log(tickerDate); // key
          // console.log(ticker); // value

          newHistoryObject.historyDates.push(tickerDate);
        });

        // Get the daily historical values
        Object.values(ticker.history).forEach(function (tickerHistoryData) {
          //console.log(tickerHistoryData.close); // value
          newHistoryObject.historyOpen.push(tickerHistoryData.open);
          newHistoryObject.historyClose.push(tickerHistoryData.close);
          newHistoryObject.historyHigh.push(tickerHistoryData.high);
          newHistoryObject.historyLow.push(tickerHistoryData.low);
          newHistoryObject.historyVolume.push(tickerHistoryData.volume);
        });

        // Add it to the array of objects, with the object property being the ticker
        chartObjects[ticker.symbol] = newHistoryObject;
      });

      console.log("chartObjects in P1: ", chartObjects);
      resolve();
    });



    let p2 = new Promise((resolve, reject) => {

      console.log("chartObjects: ", chartObjects);

      // Now build the chart objects
      //this.state.allUserTickerHistoricalCharts

      //console.log(typeof (chartObjects));
      // chartObjects.forEach(function (chartobject) {
      //   console.log("chartobject: ", chartobject);
      // });

      // For each of the properties (which is the ticker/symbol) in the chartObjects, build a chart
      Object.values(chartObjects).forEach(function (chartObject) {

        //console.log(chartObject);
        //console.log(chartObjects[chartObject].historyDates);

        // a new chart object, to be added with the object property value being the ticker
        let newChart = {
          labels: chartObject.historyDates, // date info from historyDates
          datasets: [
            {
              label: 'Open',
              //yAxisID: 'stockPriceAxis',
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
              data: chartObject.historyOpen // from historyOpen
            },
            {
              label: 'Close',
              //yAxisID: 'stockPriceAxis',
              fill: false,
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
              data: chartObject.historyClose // from historyClose
            }
            //{
            //   label: 'Volume',
            //   yAxisID: 'stockVolumeAxis',
            //   fill: false,
            //   lineTension: 0.1,
            //   backgroundColor: 'rgba(127, 63, 191)',
            //   borderColor: 'rgba(75,192,192,1)',
            //   borderCapStyle: 'butt',
            //   borderDash: [],
            //   borderDashOffset: 0.0,
            //   borderJoinStyle: 'miter',
            //   pointBorderColor: 'rgba(75,192,192,1)',
            //   pointBackgroundColor: '#fff',
            //   pointBorderWidth: 1,
            //   pointHoverRadius: 5,
            //   pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            //   pointHoverBorderColor: 'rgba(220,220,220,1)',
            //   pointHoverBorderWidth: 2,
            //   pointRadius: 1,
            //   pointHitRadius: 10,
            //   data: chartObject.historyVolume // from historyVolume
            // }
          ]
          // options: {
          //   scales: {
          //     yAxes: [{
          //       id: 'stockPriceAxis',
          //       type: 'linear',
          //       position: 'left',
          //     }, {
          //       id: 'stockVolumeAxis',
          //       type: 'linear',
          //       position: 'right',
          //       ticks: {
          //         max: 10,
          //         min: 0
          //       }
          //     }]
          //   }
          // }          
        };

        allCharts.push(newChart);
      });

      console.log("allCharts in P2: ", allCharts);
      resolve();
    });


    p1
      .then(p2)
      .then(() => {

        //return new Promise((resolve, reject) => {

          console.log("Both promises finished", allCharts);

          this.setState({
            allUserTickerHistoricalCharts: allCharts
          });

        });
      //});

  }

  render() {

    console.log("Rendering Page Test.js - State info:", this.state);

    // Build all the chart objects before we need to show them on the page
    //buildAllHistoricalChartObjects(this.state);

    // Mapping will only work on an array. So I needed to make sure the propery was filled with an array of data above
    let tickerList = this.state.latestTickerInfo.map((stock, index) => (
      <div key={stock.symbol}>{stock.symbol}: ${stock.price} ${stock.change_pct}%</div>
    ));

    //updateChartDataProps(this.state);
    // generate charts for all the chart objects
    let chartList = this.state.allUserTickerHistoricalCharts.map((stock, index) => (
      <div>
        <h2>Stock Name Goes Here</h2>
        <Line data={stock} />
      </div>
    ));    

    return (
      <div className="container">
        <p>World Trading Data API Test</p>
        <div>

          {/* {this.state.latestTickerInfo.map((stock, index) => (
            <div key={stock.symbol}>{stock.symbol}: ${stock.price} ${stock.change_pct}%</div>
          ))} */}

          {tickerList}

          <div>
            <h2>Apple Inc.</h2>
            <Line data={this.state.chartData} />
          </div>

          {chartList}

          {/* <h2>Apple Inc. - Line component test</h2>
        <LineChart chartData={this.state.chartData} />

        <h2>Apple Inc. - Bar component test</h2>
        <BarChart chartData={this.state.chartData} />

        <h2>Pie component test - use to show percentage of investments</h2>
        <PieChart chartData={this.state.chartData} /> */}


        </div>
      </div>
    );
  }

}

// This function builds the array of historical chart objects, according to the 
// state data which has first been updated with a call the stock API
function buildAllHistoricalChartObjects(state) {

  console.log("buildAllHistoricalChartObjects:");
  console.log("state.allUserTickerHistoricalInfo:", state.allUserTickerHistoricalInfo);
  console.log("state.allUserTickerHistoricalInfo length:", state.allUserTickerHistoricalInfo.length);
  console.log("state.allUserTickerHistoricalInfo typeof:", typeof (state.allUserTickerHistoricalInfo));

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

  // const keys = Object.keys(state.allUserTickerHistoricalInfo)
  // console.log(keys);

  // state.allUserTickerHistoricalInfo.map((tickerHistory) => {
  //   console.log("tickerHistory: ");
  // });

  //const keys = Object.keys(state.allUserTickerHistoricalCharts)
  //state.chartData.labels = keys;

  var myLineChart = {
    labels: ['A', 'B'], // Dates within the specified range
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

  console.log("myLineChart: ", myLineChart);

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


export default Test;
