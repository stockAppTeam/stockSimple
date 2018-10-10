import React from 'react';
import "./WatchlistTab.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ListGroup, ListGroupItem, Badge, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact'

const WatchlistTab = props => (
    <Tabs className="mt-1 text-white mb-2 p-2">
        <TabList className="grey-bg p-2">
            {props.watchlists.map((watchlist, index) => (
                <Tab key={index}>{watchlist.name}</Tab>
            ))}
        </TabList>

        {props.watchlists.map((watchlist, index) => (
            <TabPanel key={index}>
                <ListGroup className="p-2">
                    {
                        (() => {
                            if (watchlist.stocks.length) {
                                return <div>
                                    {watchlist.stocks.map((stock, index) => (
                                        <ListGroupItem key={index} className="d-flex justify-content-betweeen turq-text">
                                            {stock}
                                            <div className="ml-auto">
                                                <Badge id="badge" className="turq-bg text-white mr-2" pill>$$$
                                        </Badge><i onClick={() => props.deleteStock(watchlist._id, stock)} className="fa fa-times text-danger del-watchlist-stock fa-lg"></i>
                                            </div>
                                        </ListGroupItem>
                                    ))}
                                </div>
                            }
                            else
                                return <h5 className="content-font text-white text-center">None added yet</h5>
                        })()
                    }
                    <div className="d-flex justify-content-between align-items-center">
                        <Button name={watchlist._id} onClick={props.deleteWatchlist} id="delete-stock-btn" className="mt-2 w-25 p-2">Delete</Button>
                        <Dropdown size="sm" className="mr-3">
                            <DropdownToggle caret id="add-stock-watchlist-drop">
                                Add Stock
                    </DropdownToggle>
                            <DropdownMenu className="mr-5">
                                <ul className="list-unstyled p-2 mb-0">
                                    <li>
                                        <input
                                            name={props.name}
                                            className="search w-100 mb-2 p-2 border-rounded"
                                            placeholder="Name"
                                            onChange={props.addStockToWatchListInput}
                                        />
                                    </li>
                                </ul>
                                <DropdownItem divider />
                                <DropdownItem
                                    className="content-font p-1 add-stock-watchlist-btn"
                                    onClick={() => props.addStockToWatchList(watchlist._id)}
                                >
                                    Add to Watchlist
                    </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </ListGroup>
            </TabPanel>
        ))}
    </Tabs>

);

export default WatchlistTab;


