import React from "react";
import "./SearchBar.css";
import { Row, Col, ListGroup, ListGroupItem, Button } from "mdbreact"
import { slide as Menu } from "react-burger-menu";

const SearchBar = props => (
    // Pass on our props
    <Menu className="content-font p-2"  {...props}>
        <h3 className="turq-text text-center mobile-hidden"><i className="fa fa-bar-chart-o custom mr-2 search-header"></i>Search Stocks</h3>

        {/* For each input, the 'name' is the property of the state that is changed when the user types something. onChange() handles that and changes and calls a function to change the state */}
        <Row className="mt-5 flex-row justfy-content-center">
            <h4 className="content-font turq-text mb-2">Search by name</h4>
            <Col className="pr-0 pl-0" lg="12">
                <div className="active-cyan-4 mb-4">
                    <input className="form-control mb-2 mt-4" type="text" name="stockSearchName" value={props.stockSearchName} onChange={props.searchVal} placeholder="Stock Name here...." aria-label="Search"></input>
                </div>
            </Col>
            {/* Each label has a value, and when that element is clicked, handleParam() is called and changes the value of searchParam in the state to the value of the input that was clicked */}
            <Col className="pr-0 pl-0 mb-2" lg="12">
                <h5 className="turq-text">Order By</h5>
                <ListGroup className="bg-dark">
                    <ListGroupItem>
                        <div className="custom-control custom-radio">
                            <input type="radio" value="HTL" checked={props.HTL} onChange={props.handleParam} className="custom-control-input" id="defaultGroupExample1" name="groupOfDefaultRadios"></input>
                            <label className="custom-control-label" htmlFor="defaultGroupExample1">High to Low</label>
                        </div>
                    </ListGroupItem>
                    <ListGroupItem>
                        <div className="custom-control custom-radio">
                            <input type="radio" value="LTH" checked={props.LTH} onChange={props.handleParam} className="custom-control-input" id="defaultGroupExample2" name="groupOfDefaultRadios"></input>
                            <label className="custom-control-label" htmlFor="defaultGroupExample2">Low to High</label>
                        </div>
                    </ListGroupItem>
                </ListGroup>
            </Col>
            <Button id="search-stock-btn" name="name" className="turq-bg text-white btn-block mt-5 ml-auto mr-auto" onClick={props.stockQueryName}>Go</Button>
        </Row>
        <hr className="bg-white mb-1 mt-4 p-0"></hr>
        <Row>
            <h4 className="content-font turq-text mb-3 mt-4">Search by ticker</h4>
            <Col className="pr-0 pl-0" lg="12">
                <div className="active-cyan-4 mb-4">
                    <input className="form-control" type="text" name="stockSearchTicker" value={props.stockSearchTicker} onChange={props.searchVal} placeholder="Ticker here.." aria-label="Search"></input>
                </div>
            </Col>

            <Button id="search-stock-btn" name="ticker" className="turq-bg text-white btn-block mt-4 ml-auto mr-auto" onClick={props.stockQueryTicker}>Go</Button>
            <p className="content-font text-white mt-3">{props.badSearch}</p>
        </Row>



    </Menu>

);

export default SearchBar;