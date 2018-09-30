import React from "react";
import "./Navbar.css";
import { Navbar, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'mdbreact';

const MainNavbar = props => (
    <Navbar className="nav-bg text-white content-font pt-0 pb-0 pr-2 pl-2" dark expand="md" scrolling>
        <div className="content-font h3 turq-text">
            <strong>{props.pageName}</strong>
        </div>
        {props.isWideEnough && <NavbarToggler onClick={props.navToggle} />}
        <Collapse isOpen={props.collapse} navbar>
            <NavLink to={props.pageSwitchLink} className="nav-link">{props.pageSwitchName}</NavLink>
            <NavbarNav right>
                <div className="nav-logo"></div>
                <NavItem className="d-flex align-items-center turq-text">
                    <Dropdown>
                        <DropdownToggle nav caret>{props.username}</DropdownToggle>
                        <DropdownMenu className="mr-5">
                            <DropdownItem >Delete Profile</DropdownItem>
                            <DropdownItem onClick={props.logout}>Log Out</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavItem>
            </NavbarNav>
        </Collapse>
    </Navbar>

);

export default MainNavbar