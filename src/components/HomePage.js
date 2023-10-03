import Figure from "react-bootstrap/Figure";
import Card from "react-bootstrap/esm/Card";
import Button from "react-bootstrap/esm/Button";
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import CenteredButton from "./UI/CenteredButton";

function HomePage() {
    const {address: userAddress} = useAccount()
    return (
    <>
    <Row>
        <Col sm="12">
            <h1>Academic Transcripts</h1>  
            <br />
            <h4>Uploading Retrieval and Sharing of Transcript made easy with Transperancy and Security of Blockchain!</h4>
            <br/>
        </Col>  
    </Row>
    <Row className="px-5 align-items-center">  
          <Col md="4" sm="12">
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="student.jpg" />
                <Card.Body>
                    <Card.Title>For Students/ Attendees</Card.Title>
                    <Card.Text>
                      Get your Transcripts easily from all the registered Institution with trust and transparency of Blockchain for as low as 0.01 tFIL
                    </Card.Text>
                    <Button href="#">Request Transcripts</Button>
                </Card.Body>
            </Card>
          </Col>
        <Col sm="12" md="4">
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="institution.jpeg" />
                <Card.Body>
                    <Card.Title>For Institutions</Card.Title>
                    <Card.Text>
                    Provide Transcripts easily to all verified users who attended your Institution, Paperless! Without any hassle.
                    </Card.Text>
                    <Button href="#">Upload Transcripts</Button>
                </Card.Body>
            </Card>            
        </Col>
        <Col sm="12" md="4">
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="company.jpeg" />
                <Card.Body>
                    <Card.Title>For Companies/Organisations</Card.Title>
                    <Card.Text>
                        Get the Transcripts of any student/employee of your organisation with the trust and transparency of Blockchain.
                    </Card.Text>
                    <Button href="#">Request Transcript</Button>
                </Card.Body>
            </Card>            
        </Col>
        { userAddress === undefined ?
            <Col sm="12" id="connect">
                <br />
                <h4>Connect Your Wallet and Start</h4>
                <CenteredButton><ConnectButton /></CenteredButton>
            </Col> : null
        }
        <Col sm="12">
            <h4>Project Workflow</h4>
            <Figure>
                <Figure.Image
                    width="80%"
                    height="80%"
                    alt="171x180"
                    src="Workflow.jpg"
                />
                <Figure.Caption>
                    Project Workflow
                </Figure.Caption>
            </Figure>
        </Col>
    </Row></>
  );
}

export default HomePage;