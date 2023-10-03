import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';

import { ethers } from "ethers";
import { useAccount, useContractRead, usePrepareContractWrite, useContractWrite } from 'wagmi';
import { readContract } from "wagmi/actions";

import useDebounce from "../hooks/useDebounce";
import TranscriptsArtifactsJson from "../artifacts/contracts/Transcript.sol/Transcripts.json";
import Spinner from "./UI/Spinner/Spinner";
import Container from 'react-bootstrap/esm/Container';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import { toast } from 'react-toastify';

const ContractDetails = {
    address: "0x87A555014b415118f690394c2DD2bC7E50082f97",
    abi: TranscriptsArtifactsJson.abi
}
const TranscriptAddModal = (props) => {
    const [accessOfRef, setAccessOfRef] = useState();
    const debouncedAccessOfRef = useDebounce(accessOfRef, 500);
    const [dcRef, setDcRef] = useState();
    const debouncedDcRef = useDebounce(dcRef, 500);
    const { config: accessRequestConfig, error: accessReqPrepError } = usePrepareContractWrite({
        ...ContractDetails,
        functionName: "requestAccess",
        args: [debouncedAccessOfRef || "0x0000000000000000000000000000000000000000", debouncedDcRef || ""]
    })
    const {
        data: accessReqData,
        isLoading: accessReqIsLoading,
        error: accessReqError,
        writeAsync: accessReqWrite,
        isSuccess: accessReqIsSuccess,
    } = useContractWrite(accessRequestConfig);
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="add-transcript-request"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add a Transcript Request
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>  
            <Form>
                <FloatingLabel controlId="floatingAccount" label="Account Address" className='mb-3'>
                <Form.Control
                    type="text"
                    placeholder="0x4a6d...5a4dd"
                    onChange={(e)=>{setAccessOfRef(e.target.value)}}
                    name="accessOf"
                    isValid={!accessReqPrepError}
                    isInvalid={accessReqPrepError}
                />
                <Form.Control.Feedback type='invalid'>{accessReqPrepError?.message}</Form.Control.Feedback>
                </FloatingLabel>
            
                <FloatingLabel controlId="floatingdc" label="Document Name" className='mb-3'>
                <Form.Control
                    type="text"
                    placeholder="Degree Name and College/Institution Name"
                    onChange={(e)=>{setDcRef(e.target.value)}}
                    name="documentName"
                    isValid={!accessReqPrepError}
                    isInvalid={accessReqPrepError}
                />
                <Form.Control.Feedback type='invalid'>{accessReqPrepError?.message}</Form.Control.Feedback>            
                </FloatingLabel>    
                <Button onClick={async () => {
                    try {
                        const txHash = await accessReqWrite?.();
                        console.log(txHash?.hash);
                        toast.success("Access Request Submitted Successfully!")
                        if (accessReqIsSuccess) {
                            console.log("success");

                        }
                    } catch (error) {
                        console.log(error);
                        toast.error("An error occurred!")
                    }     
                }} variant="info" disabled={accessReqIsLoading || accessReqPrepError}>Add Transcript Request</Button>        
            </Form>
            </Modal.Body>
        </Modal>
    );
}
const TranscriptsRequested = () => {
    const [modalShow, setModalShow] = useState(false);
    const {address:userAddress } = useAccount();
    const { data: companyRequested, error: companyRequestedError,
        isLoading: companyRequestedIsLoading } = useContractRead({
        ...ContractDetails,
        functionName: "getAllCompanyAccessRequests",
        account: userAddress
    })
    return (
        <>
        <TranscriptAddModal show={modalShow} onHide={()=>setModalShow(false)} />    
        <Container fluid className='text-center my-5'>
            <Button className="my-5" variant="info" onClick={() => setModalShow(true)}>Add Transcript Request</Button>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Document Of Person</th>
                    <th>Document Name</th>
                    <th>Access Granted</th>
                </tr>
                </thead>
                <tbody>
                    {companyRequestedIsLoading && companyRequestedError ? <Spinner /> :
                    companyRequested?.map((el, idx) => {
                        let docData;
                        readContract({
                            ...ContractDetails,
                            account: userAddress,
                            functionName: "documents",
                            args: [el.access, ethers.utils.formatBytes32String(el.documentName)]
                        }).then((val)=>docData = val);
                        console.log(docData);
                        return (
                            <tr key={"requestsOrg_" + idx}>
                                <td>{idx}</td>
                                <td>{el.access}</td>
                                <td>{el.documentName}</td>
                                <td>{el.allowed ? "LINk" :
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                                    <path fill="#F44336" d="M21.5 4.5H26.501V43.5H21.5z" transform="rotate(45.001 24 24)"></path><path fill="#F44336" d="M21.5 4.5H26.5V43.501H21.5z" transform="rotate(135.008 24 24)"></path>
                                    </svg>}
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

export default TranscriptsRequested;