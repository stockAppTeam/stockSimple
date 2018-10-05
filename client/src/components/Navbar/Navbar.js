import React from "react";
import "./Navbar.css";
import { Navbar, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';

const MainNavbar = props => (
    <Navbar className="nav-bg text-white content-font pt-0 pb-0 pr-2 pl-2 fixed-top" dark expand="md" scrolling>
        <div className="nav-logo mr-2"></div>
        <h3 className="content-font h3 turq-text mr-2 d-inline">{props.username}</h3>
        {props.isWideEnough && <NavbarToggler onClick={props.navToggle} />}
        <Collapse isOpen={props.collapse} navbar>
            <NavbarNav right>
                <NavItem className="d-flex align-items-center">
                    <Dropdown>
                        <DropdownToggle nav caret>Admin</DropdownToggle>
                        <DropdownMenu className="mr-5">
                            <DropdownItem>
                                <NavLink to={props.pageSwitchLink} className="nav-link p-0">{props.pageSwitchName}</NavLink>
                            </DropdownItem>
                            <DropdownItem >Delete Profile</DropdownItem>
                            <DropdownItem onClick={props.logout}>Log Out</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavItem>
            </NavbarNav>
        </Collapse>
    </Navbar>
);

export default MainNavbar;