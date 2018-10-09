import React from 'react';
import "./WatchlistTab.css";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { ListGroup, ListGroupItem, Badge, Button} from 'mdbreact'

const WatchlistTab = props => (
    <Tabs className="mt-5 text-white mb-2 p-2">
        <TabList className="grey-bg p-2">
            {props.watchlists.map((watchlist, index) => (
                <Tab>{watchlist.name}</Tab>
            ))}
        </TabList>

        {props.watchlists.map((watchlist, index) => (
            <TabPanel>
                <ListGroup className="p-2">
                    {
                        (() => {
                            if (watchlist.stocks.length) {
                                return <div>
                                    {watchlist.stocks.map((stock, index) => (
                                        <ListGroupItem className="d-flex justify-content-between turq-text">{stock}<Badge id="badge" className="turq-bg text-white" pill>$$$</Badge></ListGroupItem>
                                    ))}
                                </div>
                            }
                            else
                                return <h5 class="content-font text-white text-center">None added yet</h5>
                        })()
                    }
                    <Button name={watchlist._id} onClick={props.deleteWatchlist} id="delete-stock-btn" className="mt-2 w-25 p-3">Delete</Button>
                </ListGroup>
            </TabPanel>
        ))}
    </Tabs>

);

export default WatchlistTab;


