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

// If you're using Context API for authentication state
// import { AuthContext } from '../context/AuthContext';

function Header() {
  // If you're using Context API for authentication state
  // const { isLoggedIn, logout } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false);
  const toggleNavbar = () => setIsOpen(!isOpen);

  // Placeholder for checking if a user is logged in. Replace with actual logic.
  const isLoggedIn = false;  // Placeholder, use the context or redux state for actual value

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarBrand to="/">fasType</NavbarBrand>
      
      <NavbarToggler onClick={toggleNavbar} />
      
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink to="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/about">About</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/contact">Contact</NavLink>
          </NavItem>
          {isLoggedIn ? (
            <Button color="secondary" onClick={() => { /*logout function*/ }}>Logout</Button>
          ) : (
            <>
              <NavItem>
                <NavLink to="/login">Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/signup">Signup</NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default Header;
