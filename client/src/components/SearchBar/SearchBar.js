import React from "react";
import "./SearchBar.css";
import { slide as Menu } from "react-burger-menu";

const SearchBar = props => (
    // Pass on our props
    <Menu  {...props}>
        <button className="turq-bg btn" type="sumbit" onClick={props.scrapeInvestopedia}>Investopedia</button>
    </Menu>

);

export default SearchBar;