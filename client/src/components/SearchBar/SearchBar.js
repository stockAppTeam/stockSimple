import React from "react";
import "./SearchBar.css";
import { Row, Col, ListGroup, ListGroupItem } from "mdbreact"
import { slide as Menu } from "react-burger-menu";

const SearchBar = props => (
    // Pass on our props
    <Menu className="content-font"  {...props}>
        <h3 className="turq-text text-center"><i class="fa fa-bar-chart-o custom mr-2 search-header"></i>Search Stocks</h3>

        <Row className="mt-5 flex-column justfy-content-center">
            <Col className="pr-0 pl-0" lg="12">
                <h5 className="turq-text">Name</h5>
                <div className="active-cyan-4 mb-4">
                    <input className="form-control" type="text" placeholder="Tesla, Canopy...." aria-label="Search"></input>
                </div>
            </Col>
            <Col className="pr-0 pl-0" lg="12">
                <h5 className="turq-text">Symbol</h5>
                <div className="active-cyan-4 mb-4">
                    <input className="form-control" type="text" placeholder="AAPL, TSLA ..." aria-label="Search"></input>
                </div>
            </Col>
            <Row>
                <Col className="col-6">
                    <h5 className="turq-text">Min Price</h5>
                    <div className="active-cyan-4 mb-4">
                        <input className="form-control" type="text" placeholder="$Low" aria-label="Search"></input>
                    </div>
                </Col>
                <Col className="col-6">
                    <h5 className="turq-text">Max Price</h5>
                    <div className="active-cyan-4 mb-4">
                        <input className="form-control" type="text" placeholder="$High" aria-label="Search"></input>
                    </div>
                </Col>
            </Row>
            <Col className="pr-0 pl-0" lg="12">
                <h5 className="turq-text">Order By</h5>
                <ListGroup className="bg-dark">
                    <ListGroupItem>
                    <div className="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="defaultGroupExample1" name="groupOfDefaultRadios"></input>
                        <label className="custom-control-label" htmlFor="defaultGroupExample1">High to Low</label>
                    </div>
                    </ListGroupItem>
                    <ListGroupItem>
                    <div className="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="defaultGroupExample2" name="groupOfDefaultRadios"></input>
                        <label className="custom-control-label" htmlFor="defaultGroupExample2">Low to High</label>
                    </div>
                    </ListGroupItem>
                    <ListGroupItem>
                    <div className="custom-control custom-radio">
                        <input type="radio" class="custom-control-input" id="defaultGroupExample3" name="groupOfDefaultRadios"></input>
                        <label className="custom-control-label" htmlFor="defaultGroupExample3">Market Cap</label>
                    </div>
                    </ListGroupItem>
                </ListGroup>
            </Col>
        </Row>



    </Menu>

);

export default SearchBar;