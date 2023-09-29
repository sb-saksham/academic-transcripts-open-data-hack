import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ToastContainer } from 'react-toastify';
import Nav from 'react-bootstrap/Nav';
import { NavLink } from 'react-router-dom';
import CenteredButton from "./CenteredButton";
import { ConnectButton } from '@rainbow-me/rainbowkit';

function Dashboard() {
  return (
    <Container fluid={true} className="p-4 text-center align-self-center" >
        <Navbar className="bg-body-tertiary">
            <Navbar.Brand><NavLink to="/" style={{textDecoration:"none", color:"black"}}>Academic Transcripts</NavLink></Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
            <Nav className="me-auto">
              <NavLink style={{textDecoration:"none"}} to="/institution/upload/">Upload Transcripts</NavLink>
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