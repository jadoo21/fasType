import React, { useState } from 'react';
import { 
  Navbar, 
  NavbarBrand, 
  Nav, 
  NavItem, 
  NavLink, 
  NavbarToggler, 
  Collapse,
  Button 
} from 'reactstrap';

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleNavbar = () => setIsOpen(!isOpen);

  const isLoggedIn = false;

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarBrand to="/">fasType</NavbarBrand>
      
      <NavbarToggler onClick={toggleNavbar} />
      
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/about">About</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="/contact">Contact</NavLink>
          </NavItem>
          {isLoggedIn ? (
            <Button color="secondary" onClick={() => { /*logout function*/ }}>Logout</Button>
          ) : (
            <>
              <NavItem>
                <NavLink href="/login">Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/signup">Signup</NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default Header;
