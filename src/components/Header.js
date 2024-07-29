import React, { useState } from 'react';
import { Navbar, Nav, Dropdown, DropdownButton, Container } from 'react-bootstrap';
import { FaArrowLeft } from 'react-icons/fa';
import Logo from '../vendor/logo.svg'

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <Navbar bg="light" expand="lg" className="justify-content-between">
      <Container>
        <Nav>
          <Nav.Link href="#" className="d-flex align-items-center">
            <FaArrowLeft size={24} />
          </Nav.Link>
        </Nav>
        <Navbar.Brand href="#" onClick={toggleMenu} className="mx-auto">
          <img
            src={Logo} // Reemplaza esto con la URL de tu logo
            width="165"
            height="165"
            className="d-inline-block align-top"
            alt="Logo"
          />
        </Navbar.Brand>
        {showMenu && (
          <DropdownButton
            id="dropdown-basic-button"
            title=""
            className="dropdown-menu-right"
            show={showMenu}
            onClick={toggleMenu}
          >
            <Dropdown.Item href="/create-class">Crear Clase</Dropdown.Item>
            <Dropdown.Item href="#/modify-profile">Modificar Perfil</Dropdown.Item>
            <Dropdown.Item href="#/contact">Contacto</Dropdown.Item>
            <Dropdown.Item href="#/logout">Cerrar Sesión</Dropdown.Item>
          </DropdownButton>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;
