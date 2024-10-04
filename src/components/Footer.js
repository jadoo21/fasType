import React from 'react';
import { Container, Row, Col, Navbar } from 'reactstrap';

function Footer() {
  return (
    <Navbar color="dark" dark expand="md" className="footer">
      <Container>
        <Row>
          <Col md="6" xs="12">
            <h5 className="text-white">fasType</h5>
            <p className="text-white-50">
              A platform for your typing needs.
            </p>
          </Col>
          <Col md="6" xs="12" className="text-md-right text-center">
            <p className="text-white-50">
              © {new Date().getFullYear()} fasType, Inc.
            </p>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
}

export default Footer;