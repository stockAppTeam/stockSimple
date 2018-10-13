import React from 'react';
import "./WatchlistTab.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ListGroup, ListGroupItem, Badge, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';
import { Line } from 'react-chartjs-2';



// tabs component used for all watchlists displayedon the home page
const WatchlistTab = props => (
    <div className="p-2 mt-1">
        {/* check if there are any watchlists, else display a div saying 'no watchlists yet' */}

        {props.watchlists.length ? (
            <Tabs className="grey-bg text-white mb-2 p-2 tab-bg">
                <TabList className="bg-dark p-2">
                    {props.watchlists.map((watchlist, index) => (
                        <Tab key={index}>{watchlist.name}</Tab>
                    ))}
                </TabList>
                {/* map over the watchlists */}
                {props.watchlists.map((watchlist, index) => (
                    <TabPanel key={index}>
                        {/* {console.log(props.historicalChartDataByWatchlist[watchlist.name])} */}
                        <ListGroup className="p-2">
                            {/* emdedded if statement to check if a certain watchlist has any stocks in it */}
                            {
                                (() => {
                                    if (watchlist.stocks.length) {
                                        return <div>
                                            <h6 className="content-font text-white m-1 pb-2">Currently tracking in {watchlist.name}</h6>
                                            <Line
                                                key={watchlist}
                                                data={props.historicalChartDataByWatchlist[watchlist.name]}
                                                options={props.historicalChartOptions}
                                            />
                                            {watchlist.stocks.map((stock, index) => (
                                                <ListGroupItem key={index} className="d-flex justify-content-betweeen turq-text">
                                                    {stock.name}
                                                    <div className="ml-auto">
                                                        <Badge id="badge" className="turq-bg text-white mr-2" pill> {`$ ${stock.price}`}
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
                                    <DropdownMenu className="mr-5 p-2">
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
        ) : (
                <div className="turq-text contentfont grey p-4 mt-3">
                    <h4> No watchlists to display </h4>
                    <p> Hit the add button to start tracking!</p>
                </div>
            )}
    </div>
);

export default WatchlistTab;


