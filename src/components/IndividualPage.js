import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';

import { ethers } from "ethers";
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite } from 'wagmi';
import { readContract, writeContract } from "wagmi/actions";

import useDebounce from "../hooks/useDebounce";
import TranscriptsArtifactsJson from "../artifacts/contracts/Transcript.sol/Transcripts.json";
import Spinner from "./UI/Spinner/Spinner";
import Container from 'react-bootstrap/esm/Container';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';

const ContractDetails = {
    address: "0x87A555014b415118f690394c2DD2bC7E50082f97",
    abi: TranscriptsArtifactsJson.abi
}
// const GiveAccessModal = 
const GetTranscriptModal = (props) => {
    const [institutionRef, setInstitutionRef] = useState();
    const debouncedInstitutionRef = useDebounce(institutionRef, 500);
    const [dcRef, setDcRef] = useState("");
    const debouncedDcRef = useDebounce(dcRef, 500);
    const { config: getTranscriptConfig, error: getTransPrepError } = usePrepareContractWrite({
        ...ContractDetails,
        functionName: "getTranscript",
        args: [debouncedInstitutionRef || "0x0000000000000000000000000000000000000000", debouncedDcRef.toString() || ""],
        value: ethers.utils.parseEther("0.01")
    })
    const {
        data: getTransData,
        isLoading: getTransIsLoading,
        error: getTransError,
        writeAsync: getTransWrite,
        isSuccess: getTransIsSuccess,
    } = useContractWrite(getTranscriptConfig);
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="add-transcript-request"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Get Transcript From Institution
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>  
            <Form>
                <FloatingLabel controlId="floatingAccount" label="Institution Address" className='mb-3'>
                <Form.Control
                    type="text"
                    placeholder="0x4a6d...5a4dd"
                    onChange={(e)=>{setInstitutionRef(e.target.value)}}
                    name="institutionAdd"
                    isValid={!getTransPrepError}
                    isInvalid={getTransPrepError}
                />
                <Form.Control.Feedback type='invalid'>{getTransPrepError?.message}</Form.Control.Feedback>
                </FloatingLabel>
            
                <FloatingLabel controlId="floatingdc" label="Document Name" className='mb-3'>
                <Form.Control
                    type="text"
                    placeholder="Degree Name and College/Institution Name"
                    onChange={(e)=>{setDcRef(e.target.value)}}
                    name="documentName"
                    isValid={!getTransPrepError}
                    isInvalid={getTransPrepError}
                />
                <Form.Control.Feedback type='invalid'>{getTransPrepError?.message}</Form.Control.Feedback>            
                </FloatingLabel>    
                <Button onClick={async () => {
                    try {
                        const txHash = await getTransWrite?.();
                        console.log(txHash?.hash);
                        if (getTransIsSuccess) {
                            console.log("success");
                        }
                    } catch (error) {
                        console.log(error);
                    }     
                }} variant="info" disabled={getTransIsLoading || getTransPrepError}>Add Transcript Request</Button>        
            </Form>
            </Modal.Body>
        </Modal>
    );
}
const IndividualRequestsPage = () => {
    const [modalShow, setModalShow] = useState(false);
    const [hideAllowAccess, setHideAllowAccess] = useState(false);
    const {address:userAddress } = useAccount();
    const { data: indAccessRequest, error: indAccessRequestError,
        isLoading: indAccessRequestIsLoading } = useContractRead({
            ...ContractDetails,
            functionName: "getAllIndAccessRequests",
            account: userAddress
        });
    const {indGetTransRequest, error: indGetTransRequestError,
        isLoading: indGetTransRequestIsLoading } = useContractRead({
            ...ContractDetails,
            functionName: "getAllIndividualTranscriptRequest",
            account: userAddress
        });
    return (
        <>
        <GetTranscriptModal show={modalShow} onHide={()=>setModalShow(false)} />    
        <Container fluid className='text-center my-5'>
            <Button className="my-5" variant="info" onClick={() => setModalShow(true)}>Request Transcript from Institution</Button>
            <h5>Access Requests Give Access To these Documents to Companies</h5>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Document Requested By</th>
                    <th>Document Name</th>
                    <th>Allow Access</th>
                </tr>
                </thead>
                <tbody>
                    {indAccessRequestIsLoading && indAccessRequestError ? <Spinner /> :
                    indAccessRequest?.map((el, idx) => {
                        let docData;
                        readContract({
                            ...ContractDetails,
                            account: userAddress,
                            functionName: "documents",
                            args: [userAddress, ethers.utils.formatBytes32String(el.documentName)]
                        }).then((val)=>docData = val);
                        return (
                            <tr key={"requestsInd_" + idx}>
                                <td>{idx}</td>
                                <td>{el.access}</td>
                                <td>{el.documentName}</td>
                                <td>{docData ? docData.accessAllowed[el.access] ? "Access Provided!" : "Institution has not uploaded the Document Yet! Request The institution if you haven't yet or wait for Institution to upload!" : <Button variant='info' disabled={hideAllowAccess} onClick={async () => {
                                    setHideAllowAccess(true);
                                    await writeContract({
                                        ...ContractDetails,
                                        account: userAddress,
                                        functionName: "giveAccess",
                                        args: [
                                            el.access,
                                            ethers.utils.formatBytes32String(el.documentName),
                                            idx
                                        ]
                                    });
                                    setHideAllowAccess(false);
                                }}>Allow Access</Button>}
                                </td>
                            </tr>
                        );
                    })}    
                </tbody>
            </Table>
            <h5>List Of Transcripts Requests You've made From Institution</h5>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Institution</th>
                    <th>Document Name</th>
                    <th>Document Uploaded</th>
                </tr>
                </thead>
                <tbody>
                    {indGetTransRequestIsLoading && indGetTransRequestError ? <Spinner /> :
                    indGetTransRequest?.map((el, idx) => {
                        let docData;
                        readContract({
                            ...ContractDetails,
                            account: userAddress,
                            functionName: "documents",
                            args: [userAddress, ethers.utils.formatBytes32String(el.documentName)]
                        }).then((val)=>docData = val);
                        return (
                            <tr key={"requestsInd_" + idx}>
                                <td>{idx}</td>
                                <td>{el.institution}</td>
                                <td>{el.documentName}</td>
                                <td>{docData ? <Button variant='info'>
                                    <a rel="noreferrer" href={`https://files.lighthouse.storage/viewFile/${docData}`} target="_blank">
                                        Allow Access</a></Button>
                                    : "Institution has not uploaded the Document Yet!"}
                                </td>
                            </tr>
                        );
                    })}    
                </tbody>
            </Table>    
        </Container>
        </>
    );
}

export default IndividualRequestsPage;