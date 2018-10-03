import React from 'react';
import { MDBTable, MDBTableBody, MDBTableHead  } from 'mdbreact';

const TablePage = props => (
  <MDBTable className="movers-table text-white" responsive autoWidth striped>
      <MDBTableHead columns={props.columns}/>
      <MDBTableBody rows={props.rows} />
    </MDBTable>
);

export default TablePage