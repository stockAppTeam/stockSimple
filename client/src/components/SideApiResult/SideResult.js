import React from 'react';
import "./SideResult.css"
import { Container, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';


const SideResult = props => (
      <Container className="content-font">
        {/*  */}
        <Modal isOpen={props.modal8} toggle={props.toggleview} fullHeight position="right">
          <ModalHeader>Market Results</ModalHeader>
          <ModalBody>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </ModalBody>
          <ModalFooter>
            <Button id="close-search-btn" className="turq-bg text-white" onClick={props.toggleClick}>Close</Button>
          </ModalFooter>
        </Modal>
      </Container>
    );

export default SideResult;