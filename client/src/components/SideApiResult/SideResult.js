import React from 'react';
import "./SideResult.css"
import { Container, Button, Modal, ModalBody, ModalHeader } from 'mdbreact';


const SideResult = props => (
  <Container className="content-font">
    <Modal isOpen={props.modal8} toggle={props.toggleview} fullHeight position="right">
      <ModalHeader className="w-100">
        <div className="side-result-header">
          <div className="pt-3 side-result-title d-flex justify-content-between align-items-center">
            {props.title}
            <Button id="close-search-btn" className="turq-bg text-white" onClick={props.toggleClick}>Close</Button>
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        {props.children}
      </ModalBody>
    </Modal>
  </Container>
);

export default SideResult;