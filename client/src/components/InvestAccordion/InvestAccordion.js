import React from 'react';
import "./InvestAccordion.css";
import { Accordion, AccordionItem } from 'react-light-accordion';
import 'react-light-accordion/demo/css/index.css';
import { ListGroup, ListGroupItem, Badge, Button } from 'mdbreact'

// this is the investment component for the home page
// if there arent any in that state, than it displays a message
const InvestAccordion = props => (
    <div className="mt-1 p-2">
        {props.investments.length ? (
            <Accordion className="p-3" atomic={true}>
                {props.investments.map((investment, index) => (
                    <AccordionItem key={index} title={investment.name}>
                        <ListGroup className="p-2">
                            <ListGroupItem className="d-flex justify-content-between turq-text">Ticker<Badge id="badge" className="turq-bg text-white" pill>{investment.ticker}</Badge></ListGroupItem>
                            <ListGroupItem className="d-flex justify-content-between turq-text">Date Invested<Badge id="badge" className="turq-bg text-white" pill>{investment.dateInvested}</Badge></ListGroupItem>
                            <ListGroupItem className="d-flex justify-content-between turq-text">Shares<Badge id="badge" className="turq-bg text-white" pill>{investment.sharesPurchased}</Badge></ListGroupItem>
                            <ListGroupItem className="d-flex justify-content-between turq-text">Price Purchased<Badge id="badge" className="turq-bg text-white" pill>{`$ ${investment.pricePurchased}`}</Badge></ListGroupItem>
                            <ListGroupItem className="d-flex justify-content-between turq-text">Starting Value<Badge id="badge" className="turq-bg text-white" pill>{`$ ${investment.pricePurchased * investment.sharesPurchased}`}</Badge></ListGroupItem>
                            {investment.currentPrice ? (
                                <div>
                                    <ListGroupItem className="d-flex justify-content-between turq-text">Current Price<Badge id="badge" className="bg-dark" color="white" pill>{`$ ${investment.currentPrice}`}</Badge></ListGroupItem>
                                    <ListGroupItem className="d-flex justify-content-between turq-text">Current Value<Badge id="badge" className="bg-dark" color="white" pill>{`$ ${investment.currentPrice.toFixed(0) * investment.sharesPurchased.toFixed(0)}`}</Badge></ListGroupItem>
                                    <ListGroupItem className="d-flex justify-content-between turq-text">Profit<Badge id="badge" className="bg-dark" color="white" pill>{`$ ${(investment.currentPrice.toFixed(0) * investment.sharesPurchased.toFixed(0)) - (investment.pricePurchased.toFixed(0) * investment.sharesPurchased.toFixed(0))}`}</Badge></ListGroupItem>
                                </div>
                            ) : (
                                    <ListGroupItem className="d-flex justify-content-between turq-text">No live data</ListGroupItem>
                                )}
                        </ListGroup>
                        <div className="mb-5 ml-1 mr-1 pr-2 pl-2 pb-2 d-flex justify-content-between align-items-center">
                            <Button name={investment._id} onClick={props.deleteInvestment} id="delete-stock-btn" className="m-0">Delete</Button>
                            {/* this function checks whether the current value of the stock is higher or lower than invested, and displays either
                            a green arrow up or red arrow down depending on the result */}
                            {
                                (() => {
                                    if (investment.currentPrice) {
                                        if (((investment.currentPrice * investment.sharesPurchased) - (investment.pricePurchased * investment.sharesPurchased)) >= 0 ) {
                                         return   <i className="fa fa-arrow-up fa-2x up-arrow" aria-hidden="true"></i>
                                        } else {
                                         return   <i className="fa fa-arrow-down fa-2x down-arrow" aria-hidden="true"></i>
                                        }
                                    }
                                    else 
                                        return <i className="fa fa-times text-white fa-2x"></i>
                                })()
                            }
                        </div>
                    </AccordionItem>
                ))}
            </Accordion>

        ) : (
                <div className="turq-text contentfont grey p-4 mt-3">
                    <h4> No investments made </h4>
                    <p> Head over to the search page to look for stocks</p>
                </div>
            )}
    </div>
);


export default InvestAccordion