import React from 'react';
import "./NameResult.css";
import { Card, CardHeader, CardBody, Row } from 'mdbreact';

// this is the component for the 'search by name' results on the search page
//it is iterated over and one is rendered per result
const NameResult = props => (
    <Card className="mt-4 mb-4">
            <CardHeader className="turq-bg content-font text-white h5">{props.name}</CardHeader>
            <CardBody id="name-search-card" cla>
                <Row className="justify-content-between pl-4 pr-4">
                    <h5>Symbol</h5>
                    <p>{props.ticker}</p>
                </Row>
                <Row className="justify-content-between pl-4 pr-4">
                    <h5>Price</h5>
                    <p>{props.price}</p>
                </Row>
                <Row className="justify-content-between pl-4 pr-4">
                    <h5>Currency</h5>
                    <p>{props.currency}</p>
                </Row>
                <Row className="justify-content-between pl-4 pr-4">
                    <h5>Exchange</h5>
                    <p>{props.stockExchange}</p>
                </Row>
                {props.children}
            </CardBody>
    </Card>
);

export default NameResult