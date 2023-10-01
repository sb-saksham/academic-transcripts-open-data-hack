import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';

import { useAccount, useSignMessage, useContractRead, usePrepareContractWrite, useContractWrite } from 'wagmi';

import TranscriptsArtifactsJson from "../artifacts/contracts/Transcript.sol/Transcripts.json";
import VerifiedUserOracleArtifacts from "../artifacts/contracts/userOracleContract.sol/VerifiedUsersOracle.json";
import Spinner from "./UI/Spinner/Spinner";
import Container from 'react-bootstrap/esm/Container';
import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers';

const ContractDetails = {
    address: "0x87A555014b415118f690394c2DD2bC7E50082f97",
    abi: TranscriptsArtifactsJson.abi
}
const VerifiedUserOracle = {
    address: "0xe78F5DdB21acF5b76725Ace6239023711c9A5Ad8",
    abi: VerifiedUserOracleArtifacts.abi
}
const TranscriptAddModal = (props) => {
    const[cid, SetCid]=useState("");
    
    const { config: uploadTransConfig, error: uploadTransPrepError } = usePrepareContractWrite({
        ...ContractDetails,
        functionName: "uploadTranscript",
        args: [props.currentRequestedBy || "0x0000000000000000000000000000000000000000",
            props.currentDocumentName ? ethers.utils.formatBytes32String(props.currentDocumentName) : ethers.utils.formatBytes32String(""),
            cid ? ethers.utils.formatBytes32String(cid) : ethers.utils.formatBytes32String("")
        ]
    })
    const {
        data: uploadTransData,
        isLoading: uploadTransIsLoading,
        error: uploadTransError,
        writeAsync: uploadTransWrite,
        isSuccess: uploadTransIsSuccess,
    } = useContractWrite(uploadTransConfig);
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="add-transcript-request"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Upload Transcript
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>             
            <Form disabled={!cid}>
                <FloatingLabel controlId="floatingAccount" label="Requested By Address" className='mb-3'>
                    <Form.Control
                        type="text"
                        disabled   
                        value={props.currentRequestedBy}
                    />
                </FloatingLabel>
                <FloatingLabel controlId="floatingAccount" label="Document Name" className='mb-3'>
                    <Form.Control
                        type="text"
                        disabled
                        value={props.currentDocumentName}
                    />
                </FloatingLabel>    
                <Form.Control.Feedback type='invalid' >{uploadTransPrepError?.message}</Form.Control.Feedback>                
                <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload the Transcript File</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>      
                <Button onClick={async () => {     
                    try {
                        const txHash = await uploadTransWrite?.();
                        console.log(txHash?.hash);
                        if (uploadTransIsSuccess) {
                            console.log("success");
                        }
                    } catch (error) {
                        console.log(error, uploadTransError);
                    }     
                    }} variant="info"
                    disabled={!cid || uploadTransIsLoading || uploadTransPrepError}>
                Add Transcript Request</Button>        
            </Form>
            </Modal.Body>
        </Modal>
    );
}
const InstitutionPage = () => {
    const [modalShow, setModalShow] = useState(false);
    const [uploadButton, hideUploadButton] = useState(false);
    const [currentRequestedBy, setCurrentRequestedBy] = useState();
    const [currentDocumentName, setCurrentDocumentName] = useState();
    const { address:userAddress } = useAccount();
    const { data: institutionRequests, error: institutionRequestsError,
        isLoading: institutionRequestsIsLoading } = useContractRead({
            ...ContractDetails,
            functionName: "getAllInstitutionTranscriptRequest",
            account: userAddress
        });
    return (
        <>
        <TranscriptAddModal currentRequestedBy={currentRequestedBy} currentDocumentName={currentDocumentName} show={modalShow} onHide={() => { setModalShow(false); hideUploadButton(false) }} />    
        <Container fluid className='text-center my-5'>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Person Who Requested</th>
                    <th>Document Name</th>
                    <th>Upload Transcript</th>
                </tr>
                </thead>
                <tbody>
                    {institutionRequestsIsLoading && institutionRequestsError ? <Spinner /> :
                    institutionRequests ? institutionRequests.map((el, idx) => {
                    return (
                        <tr key={"requests_"+idx}>
                            <td>{idx}</td>
                            <td>{el.requestedBy}</td>
                            <td>{el.documentName}</td>
                            <td><Button onClick={() => {
                                hideUploadButton(true);
                                setCurrentDocumentName(el.documentName);
                                setCurrentRequestedBy(el.requestedBy);
                                setModalShow(true);
                            }} disabled={uploadButton}>Upload Transcript</Button></td>
                        </tr>
                    );
                    }) : "No Requests" }    
                </tbody>
            </Table>
        </Container>
        </>
    );
}

export default InstitutionPage;