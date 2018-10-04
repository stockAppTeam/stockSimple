import React from "react";
import "./SearchBar.css";
import { Row, Col, ListGroup, ListGroupItem, Button } from "mdbreact"
import { slide as Menu } from "react-burger-menu";

const SearchBar = props => (
    // Pass on our props
    <Menu className="content-font"  {...props}>
        <h3 className="turq-text text-center"><i className="fa fa-bar-chart-o custom mr-2 search-header"></i>Search Stocks</h3>

    {/* For each input, the 'name' is the property of the state that is changed when the user types something. onChange() handles that and changes and calls a function to change the state */}
        <Row className="mt-5 flex-column justfy-content-center">
            <Col className="pr-0 pl-0" lg="12">
                <h5 className="turq-text">Name</h5>
                <div className="active-cyan-4 mb-4">
                    <input className="form-control" type="text" name="stockSearchName" value={props.stockSearchName} onChange={props.searchVal}  placeholder="Tesla, Canopy...." aria-label="Search"></input>
                </div>
            </Col>
            <Col className="pr-0 pl-0" lg="12">
                <h5 className="turq-text">Symbol</h5>
                <div className="active-cyan-4 mb-4">
                    <input className="form-control" type="text"name="stockSearchTicker" value={props.stockSearchTicker} onChange={props.searchVal} placeholder="AAPL, TSLA ..." aria-label="Search"></input>
                </div>
            </Col>
            <Row>
                <Col className="col-6">
                    <h5 className="turq-text">Min Price</h5>
                    <div className="active-cyan-4 mb-4">
                        <input className="form-control" type="text" name="stockSearchMin" value={props.stockSearchMin} onChange={props.searchVal} placeholder="$Low" aria-label="Search"></input>
                    </div>
                </Col>
                <Col className="col-6">
                    <h5 className="turq-text">Max Price</h5>
                    <div className="active-cyan-4 mb-4">
                        <input className="form-control" type="text" name="stockSearchMax" value={props.stockSearchMax} onChange={props.searchVal}  placeholder="$High" aria-label="Search"></input>
                    </div>
                </Col>
            </Row>
            {/* Each label has a value, and when that element is clicked, handleParam() is called and changes the value of searchParam in the state to the value of the input that was clicked */}
            <Col className="pr-0 pl-0" lg="12">
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
                        <input type="radio" value="LTH" checked={props.LTH} onChange={props.handleParam}   className="custom-control-input" id="defaultGroupExample2" name="groupOfDefaultRadios"></input>
                        <label className="custom-control-label" htmlFor="defaultGroupExample2">Low to High</label>
                    </div>
                    </ListGroupItem>
                    <ListGroupItem>
                    <div className="custom-control custom-radio">
                        <input type="radio" value="MKT" checked={props.MKT} onChange={props.handleParam}  className="custom-control-input" id="defaultGroupExample3" name="groupOfDefaultRadios"></input>
                        <label className="custom-control-label" htmlFor="defaultGroupExample3">Market Cap</label>
                    </div>
                    </ListGroupItem>
                </ListGroup>
            </Col>
            <Button id="search-stock-btn" className="turq-bg text-white btn-block mx-auto" onClick={props.stockQuery}>Search</Button>
            <p className="content-font text-white mt-3">{props.badSearch}</p>
        </Row>



    </Menu>

);

export default SearchBar;