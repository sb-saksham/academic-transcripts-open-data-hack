import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import CenteredButton from "./CenteredButton";
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Dashboard() {
  return (
    <Container fluid={true} className="p-4 text-center align-self-center" >
        <Navbar className="bg-body-tertiary">
            <Navbar.Brand>
              <NavLink to="/" style={{textDecoration:"none", color:"black"}}>Academic Transcripts</NavLink>
            </Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
              <Nav className="me-auto">
                <Nav.Item className='mx-1'>
                  <NavLink style={{ textDecoration: "none", color: "black" }} to="/individual/">Individual</NavLink>
                </Nav.Item>
                <Nav.Item className='mx-1'>
                  <NavLink style={{ textDecoration: "none", color: "black" }} to="/institution/">Institution</NavLink>
                </Nav.Item>
                <Nav.Item className='mx-1'>
                  <NavLink style={{ textDecoration: "none", color: "black" }} to="/company/">Company</NavLink>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
        </Navbar>
      <CenteredButton><ConnectButton /></CenteredButton>
      <ToastContainer />
        <Outlet/>  
    </Container>
  );
}

export default Dashboard;