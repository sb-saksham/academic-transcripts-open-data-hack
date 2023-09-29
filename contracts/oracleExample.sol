// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./userOracleContract.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

error RequestAlreadyExistsError(address access, string documentName);

contract Transcripts is Ownable{
    using Counters for Counters.Counter;
    VerifiedUsersOracle public userOracle;
    constructor(address oracleAddress){
        userOracle = VerifiedUsersOracle(oracleAddress);
    }
    // Institution
    struct Institution {
        string name;
        uint validtill;
        string info; // IPFS hash
    }
    struct Document {
        bytes cid;
        address uploadedBy;
        mapping(address => bool) accessAllowed;
    }
    mapping(address => Institution) public institutions;
    mapping(address => mapping(bytes32 => Document)) public documents;

    // Add an institute
    function registerInstitution(address institutionAddress, string memory institutionName, string memory info) public onlyOwner {
        Institution storage inst = institutions[institutionAddress];
        inst.name = institutionName;
        inst.validtill = block.timestamp + 180 days; //6 months validity
        inst.info = info;
    }
    // Request A document (individual for an organisation)
    struct AccessRequest {
        string documentName;
        address access;
        bool allowed;
    }
    struct AccessRequestInd{
        string documentName;
        address access;
    }

    mapping(address => AccessRequestInd[]) public accessRequests;
    mapping(address => AccessRequest[]) public requested;

    event NewAccessRequest(address accessor, address accessOf, string documentName);

    function requestAccess(address accessOf, address accessor, string memory documentName) public {
        
        uint256 numRequests = requested[accessor].length;
        for (uint256 index = 0; index < numRequests; index++) {
            if (
            requested[accessor][index].access != address(0) &&
                keccak256(bytes(requested[accessor][index].documentName)) ==
                keccak256(bytes(documentName))
            ) revert RequestAlreadyExistsError(accessor, documentName);
        }
        requested[accessor].push(AccessRequest(documentName, accessOf, false));
        uint numAccRequests = accessRequests[accessOf].length;
        for (uint256 ind = 0; ind < numAccRequests; ind++) {
            if(
            accessRequests[accessOf][ind].access != address(0) &&
                keccak256(bytes(accessRequests[accessOf][ind].documentName)) ==
                keccak256(bytes(documentName))
            ) revert RequestAlreadyExistsError(accessOf, documentName);
        }
        accessRequests[accessOf].push(AccessRequestInd(documentName, accessor));
        emit NewAccessRequest(accessor, accessOf, documentName);
    }

    // Share A document (individual)
    function giveAccess(address accessOf, address accessor, bytes32 documentName, uint idx) public {
        require(accessOf == msg.sender, "Only document owner could do this!");
        require(documents[accessOf][documentName].uploadedBy != address(0), "Document Not present! Please Ask your institution to upload it first!");
        documents[accessOf][documentName].accessAllowed[accessor] = true;
        requested[accessor][idx].allowed = true;
        delete accessRequests[accessOf];
    }

    // RequestTranscript from institution
    struct TranscriptRequest {
        address institution;
        string documentName;
    }
    struct GetTranscriptRequest {
        address requestedBy;
        string documentName;
    }
    event TranscriptRequested(address institution, string documentName, address documentOf);
    mapping(address => TranscriptRequest[]) transcriptRequest; // User to his transcripts sees this mapping
    mapping(address => GetTranscriptRequest[]) transcriptRequestedBy; // institutioin to his transcripts requests mapping

    function getTranscript(address institution, string memory documentName) public {
        string memory nm = userOracle.getNm(msg.sender);
        require(
            keccak256(bytes(nm)) != keccak256(bytes("")),
            "Only Verified Users can request Transcript!"
        );
        Institution storage inst = institutions[institution];
        require(block.timestamp < inst.validtill, "Instituion validity has expired! Please Ask the instituition to renew it!");
        
            transcriptRequestedBy[institution].requestedBy != msg.sender &&
                keccak256(bytes(transcriptRequestedBy[institution].documentName)) !=
                keccak256(bytes(documentName)),
            "Request Already there in Institution Entry!"
        );
        require(msg.value >= 0.01 ether, "Not enough amount sent for requesting Transcript!");
        transcriptRequestedBy[institution].push(GetTranscriptRequest(msg.sender, documentName));
        require(
            transcriptRequest[msg.sender].institution != institution &&
                keccak256(bytes(transcriptRequest[msg.sender].documentName)) !=
                keccak256(bytes(documentName)),
            "Request Already there in User Entry!"
        );
        transcriptRequest[msg.sender].push(TranscriptRequest(institution, documentName));
        emit TranscriptRequested(institution, documentName, msg.sender);
    }

    // Upload A document (institution)
    function uploadTranscript(
        address transcriptOf,
        bytes32 documentName,
        bytes memory _cid
    ) public {
        require(
            bytes(institutions[msg.sender].name).length == 0,
            "Only an instituion can upload Transcripts!"
        );
        Document storage dc = documents[transcriptOf][documentName];
        dc.cid = _cid;
        dc.uploadedBy = msg.sender;
        dc.accessAllowed[transcriptOf] = true;
    }

    // For conditional decryption Lighthouse
    function hasAccess(
        address accessOf,
        address accessor,
        bytes32 documentName
    ) public view returns (bool) {
        return documents[accessOf][documentName].accessAllowed[accessor];
    }

    // essentials
    function withdraw() external onlyOwner {
        (bool success, ) = msg.sender.call{ value: address(this).balance } ("");
        require(success, "Transfer failed.");
    }

    function receive() external payable { }
}
