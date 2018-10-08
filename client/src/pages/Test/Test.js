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

      sectorPerformanceData: []    // In progress

    };
  }

  componentDidMount() {

    // the StockAPI file in utils calls the back end using an axios GET.
    // The back end will do the actual query of the API from the stock website
    this.updateChartDataProps();


    // These have been set up as promises so that they are completed before we update the chart info
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

    // We have the information from the stock api, now build the chart objects with that data
      Promise.all([p1, p2])
      .then(() => {
        this.updateChartDataProps();
      });




    // // Requires: one ticker, start date, end date
    // // Can probably get rid of this, and combine it with the getHistoricalInfoAllTickers function
    // StockAPI.getHistoricalInfoOneTicker()
    //   .then((stockInfo) => {
    //     // Will this route even be necessary?
    //   });

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

  // https://frontarm.com/articles/when-to-use-arrow-functions/
  updateChartDataProps = (e) => {

    console.log("history!: ", this.state.allUserTickerHistoricalInfo);

    // const keys = Object.keys(this.state.allUserTickerHistoricalInfo)
    // console.log(keys);

    let chartObjects = [];
    let allCharts = [];

    let p1 = new Promise((resolve, reject) => {

      // For each of the historical items, build a chart object
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
        // get the date values
        Object.keys(ticker.history).forEach(function (tickerDate) {
          newHistoryObject.historyDates.push(tickerDate);
        });

        // Get the daily historical values
        Object.values(ticker.history).forEach(function (tickerHistoryData) {
          newHistoryObject.historyOpen.push(tickerHistoryData.open);
          newHistoryObject.historyClose.push(tickerHistoryData.close);
          newHistoryObject.historyHigh.push(tickerHistoryData.high);
          newHistoryObject.historyLow.push(tickerHistoryData.low);
          newHistoryObject.historyVolume.push(tickerHistoryData.volume);
        });

        // Add it to the array of objects, with the object property being the ticker
        chartObjects[ticker.symbol] = newHistoryObject;
      });

      resolve();
    });


    // Build the chart objects with the data
    let p2 = new Promise((resolve, reject) => {

      // For each of the properties (which is the ticker/symbol) in the chartObjects, build a chart
      Object.keys(chartObjects).forEach(function (ticker) {

        //console.log(chartObject);
        //console.log(chartObjects[chartObject].historyDates);

        // a new chart object, to be added with the object property value being the ticker
        // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Colors/Color_picker_tool
        allCharts[ticker] = {
          labels: chartObjects[ticker].historyDates, // date info from historyDates
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
              data: chartObjects[ticker].historyOpen // from historyOpen
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
              data: chartObjects[ticker].historyClose // from historyClose
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
            //   data: chartObjects[ticker].historyVolume // from historyVolume
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

        //allCharts.push(newChart);

      });

      console.log("allCharts in P2: ", allCharts);
      resolve();
    });


    p1
      .then(p2)
      .then(() => {
        this.setState({
          allUserTickerHistoricalCharts: allCharts
        });
      });

  }

  render() {

    console.log("Rendering Page Test.js - State info:", this.state);

    // Build all the chart objects before we need to show them on the page
    //buildAllHistoricalChartObjects(this.state);

    // Mapping will only work on an array. So I needed to make sure the propery was filled with an array of data above
    let tickerList = this.state.latestTickerInfo.map((stock, index) => (
      <div key={stock.symbol}>{stock.symbol}: ${stock.price} ${stock.change_pct}%</div>
    ));

    // Build an array of chart objects
    // we're using the for-in loop because each chart object has a property (which is the ticker name), and this makes it easy to get
    let chartList = [];
    for (let ticker in this.state.allUserTickerHistoricalCharts) {

      // Add to the array of chart objects, to be used for rendering
      chartList.push([
        <div>
          <h2>{ticker}</h2>
          <Line
            key={ticker}
            data={this.state.allUserTickerHistoricalCharts[ticker]}
          />
        </div>]);

    }


    return (
      <div className="container">
        <p>World Trading Data API Test</p>
        <div>

          {tickerList}
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

export default Test;
