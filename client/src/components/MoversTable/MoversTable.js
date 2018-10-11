import React from 'react';
import "./MoversTable.css"; 
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';


// this component displays the tables on the search page
// coulmns and rows are passed into the props from the state on the home page
const TablePage = props => (
  <div className="mb-2">
    <div className="content-font text-white mb-4 h4">Daily {props.title}</div>
    <MDBTable className="movers-table turq-text" responsiveSm striped>
      <MDBTableHead columns={props.columns} />
      <MDBTableBody rows={props.rows} />
    </MDBTable>
  </div>
);

export default TablePage