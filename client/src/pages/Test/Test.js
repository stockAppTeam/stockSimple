import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import './Test.css';
import StockAPI from '../../utils/StockAPI';

class Test extends Component {

  constructor(props) {
    super(props);
    this.state = {
      allInfoFromStockTickers: [], // An array of stock data objects
      sectorPerformanceData: []    // In progress
    };
  }

  componentDidMount() {

    console.log("Test.js: componentDidMount");

    // Should we retrieve the user's stock data here? How? Read from the back end?
    // Should we then pass this array of tickers into the functions below which use the Stock API to get info based in the tickers?

    StockAPI.getLiveWatchListStockInfo()
      .then((stockInfo) => {
        console.log("I've gotten the stock info from WorldTradingData:", stockInfo);

        this.setState({
          allInfoFromStockTickers: stockInfo
        });

      });

    StockAPI.getTickerHistoricalInfo()
      .then((stockInfo) => {
        console.log("I've gotten the historical stock info from WorldTradingData:", stockInfo);
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

    // const listItems = this.state.allInfoFromStockTickers.data.map((d) =>
    //   <div key={d.symbol}>{d.symbol}: ${d.price} ${d.change_pct}%</div>
    // );

    return (
      <div className="container">
        <p>World Trading Data API Test</p>
        <div>
          {/* {listItems} */}
        </div>
      </div>
    );
  }


}
export default Test;
