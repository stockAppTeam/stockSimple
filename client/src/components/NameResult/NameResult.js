import React from 'react';
import "./NameResult.css";
import { Card, CardHeader, CardBody, Row } from 'mdbreact';

const NameResult = props => (
    <Card className="mt-4 mb-4" style={{ width: '22rem', marginTop: '1rem' }}>
        <CardHeader className="turq-bg content-font text-white h5">{props.name}</CardHeader>
        <CardBody id="name-search-card" cla>
            <Row className="justify-content-between">
                <h5>Symbol</h5>
                <p>{props.ticker}</p>
            </Row>
            <Row className="justify-content-between">
                <h5>Price</h5>
                <p>{props.price}</p>
            </Row>
            <Row className="justify-content-between">
                <h5>Currency</h5>
                <p>{props.currency}</p>
            </Row>
            <Row className="justify-content-between">
                <h5>Exchange</h5>
                <p>{props.stockExchange}</p>
            </Row>
        </CardBody>
    </Card>
);

export default NameResult