import React from "react";
import "./Navbar.css";
import { Navbar, NavbarNav, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';

// component is used for the navbar on both the home page and the search page
const MainNavbar = props => (
    <Navbar className="nav-bg text-white content-font pt-0 pb-0 pr-2 pl-2 fixed-top" dark expand="md" scrolling>
         <NavLink className="p-0" to={props.goHome}><div className="nav-logo mr-2"></div></NavLink>
        <NavbarNav right>
            <NavItem className="d-flex align-items-center">
                <Dropdown>
                    <DropdownToggle nav caret>{props.username}</DropdownToggle>
                    <DropdownMenu className="mr-5 p-2">
                        <DropdownItem className="nav-dropdown mx-auto">
                            <NavLink id="page-switch-link" to={props.pageSwitchLink} className="p-0 nav-dropdown turq-text">{props.pageSwitchName}</NavLink>
                        </DropdownItem>
                        <DropdownItem className="nav-dropdown turq-text mx-auto" onClick={props.deleteProfile} >Delete Profile</DropdownItem>
                        <DropdownItem className="nav-dropdown turq-text mx-auto" onClick={props.logout}>Log Out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavItem>
        </NavbarNav>
    </Navbar>
);

export default MainNavbar;