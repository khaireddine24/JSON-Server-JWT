import React from "react";
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { LogOut,UserCircle } from 'lucide-react';

const AdminHeader = ({ admin, onLogout }) => {
  return (
    <Navbar bg="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand className="text-light">Dashboard</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Nav className="align-items-center">
            <Navbar.Text className="me-3">
             <UserCircle size={20} className="text-light" />
             <strong className="text-light">{admin.name}</strong>
            </Navbar.Text>
            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={onLogout}
              className="d-flex align-items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminHeader;