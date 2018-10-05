import React from 'react';
import "./MoversTable.css"; 
import { MDBTable, MDBTableBody, MDBTableHead } from 'mdbreact';

const TablePage = props => (
  <div className="mb-2">
    <div className="content-font text-white mb-4 h3">Daily {props.title}</div>
    <MDBTable className="movers-table turq-text" responsiveSm striped>
      <MDBTableHead columns={props.columns} />
      <MDBTableBody rows={props.rows} />
    </MDBTable>
  </div>
);

export default TablePage