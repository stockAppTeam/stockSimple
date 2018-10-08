import React from 'react';
import "./InvestAccordion.css";
import { Accordion, AccordionItem } from 'react-light-accordion';
import 'react-light-accordion/demo/css/index.css';
import { ListGroup, ListGroupItem, Badge, Button } from 'mdbreact'

const InvestAccordion = props => (
    <div className="mt-4 p-3">
        {props.investments.length ? (
            <Accordion className="p-3" atomic={true}>
                {props.investments.map((investment, index) => (
                    <AccordionItem key={index} title={investment.name}>
                        <ListGroup className="p-2">
                            <ListGroupItem className="d-flex justify-content-between turq-text">Ticker<Badge id="badge" className="turq-bg text-white" pill>{investment.ticker}</Badge></ListGroupItem>
                            <ListGroupItem className="d-flex justify-content-between turq-text">Shares<Badge id="badge" className="turq-bg text-white" pill>{investment.sharesPurchased}</Badge></ListGroupItem>
                            <ListGroupItem className="d-flex justify-content-between turq-text">Price Purchased<Badge id="badge" className="turq-bg text-white" pill>{`$ ${investment.pricePurchased}`}</Badge></ListGroupItem>
                            <ListGroupItem className="d-flex justify-content-between turq-text">Date Invested<Badge id="badge" className="turq-bg text-white" pill>{investment.dateInvested}</Badge></ListGroupItem>
                            {/* <ListGroupItem className="d-flex justify-content-between">Starting Value<Badge id="badge" className="turq-bg text-white"   pill>{investment.ticker}</Badge></ListGroupItem> */}
                            {/* <ListGroupItem className="d-flex justify-content-between">Current Value<Badge id="badge" className="bg-dark"  color="white" pill>{props.exchange}</Badge></ListGroupItem> */}
                        </ListGroup>
                        <div className="m-1 pr-2 pl-2 pb-2 d-flex justify-content-between align-items-center">
                            <Button name={investment._id} onClick={props.deleteInvestment} id="delete-stock-btn" className="m-0">Delete</Button>
                            <i className="fa fa-arrow-up fa-2x up-arrow" aria-hidden="true"></i>
                        </div>
                    </AccordionItem>
                ))}
            </Accordion>

        ) : (
                <div className="turq-text contentfont grey p-4">
                    <h4> No investments made </h4>
                    <p> Head over to the search page to look for stocks</p>
                </div>
            )}
    </div>
);


export default InvestAccordion