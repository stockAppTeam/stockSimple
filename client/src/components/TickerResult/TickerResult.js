import React from 'react';
import "./TickerResult.css";
import { ListGroup, ListGroupItem, Badge } from 'mdbreact'

// this component displays when a user searches by ticker, the data is passed into the props
const TickerResult = props => (
    <div>
        <h5 className="turq-bg text-white content-font mb-3 p-2">General</h5>
        <ListGroup className="mb-5 pl-1 pr-1">
            <ListGroupItem className="d-flex justify-content-between">Name<Badge id="badge" className="grey-bg" color="white" pill>{props.name}</Badge></ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between">Ticker<Badge id="badge" className="grey-bg" color="white" pill>{props.symbol}</Badge></ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between">Price<Badge id="badge" className="grey-bg" color="white" pill>{props.price}</Badge></ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between">Exchange<Badge id="badge" className="grey-bg" color="white" pill>{props.exchange}</Badge></ListGroupItem>
        </ListGroup>
        <h5 className="turq-bg text-white content-font mb-3 p-2">Historical</h5>
        <ListGroup className="mb-5 pl-1 pr-1">
            <ListGroupItem className="d-flex justify-content-between">Day Change<Badge id="badge" className="grey-bg" color="white" pill>{props.day_change}</Badge></ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between">Day High<Badge id="badge" className="grey-bg" color="white" pill>{props.day_high}</Badge></ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between">Day Low<Badge id="badge" className="grey-bg" color="white" pill>{props.day_low}</Badge></ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between">52 Week High<Badge id="badge" className="grey-bg" color="white" pill>{props.year_week_high}</Badge></ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between">52 Week Low<Badge id="badge" className="grey-bg" color="white" pill>{props.year_week_low}</Badge></ListGroupItem>
        </ListGroup>
        <h5 className="turq-bg text-white content-font mb-3 p-2">Key Metrics</h5>
        <ListGroup className="mb-2 pl-1 pr-1">
            <ListGroupItem className="d-flex justify-content-between">Market Cap<Badge id="badge" className="grey-bg" color="white" pill>{props.market_cap}</Badge></ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between">Available Shares<Badge id="badge" className="grey-bg" color="white" pill>{props.shares}</Badge></ListGroupItem>
            <ListGroupItem className="d-flex justify-content-between">Volume<Badge id="badge" className="grey-bg" color="white" pill>{props.volume}</Badge></ListGroupItem>
        </ListGroup>
        {props.children}
    </div>
);

export default TickerResult;