// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.18;

contract VerifiedUsersOracle {
    struct User {
        string name;
        string info; // IPFS Hash
    }
    mapping(address => User) public verifiedUsers;

    function addUser(string memory name, string memory info) public {
        User storage u = verifiedUsers[msg.sender];
        u.name = name;
        u.info = info;
    }

    function getNm(address usr) public view returns (string memory) {
        User storage u = verifiedUsers[usr];
        return u.name;
    }
}
