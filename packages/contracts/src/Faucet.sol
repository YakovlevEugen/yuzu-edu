// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract Faucet is EIP712("Faucet", "1.0.0") {
    mapping(address => bool) private ledger;
    address private _signer;

    constructor(address signer) {
        _signer = signer;
    }

    function claim(bytes calldata signature) external payable {
        address signer = _getWithdrawalSigner(msg.sender, signature);
        require(signer == _signer, "invalid signature");

        require(ledger[msg.sender] == false, "already claimed");
        ledger[msg.sender] = true;
        bool sent = payable(msg.sender).send(0.1 ether);
        require(sent, "Failed to send Ether");
    }

    function getWithdrawalHash(address sender) public view returns (bytes32) {
        return _hashTypedDataV4(keccak256(abi.encode(sender)));
    }

    function _getWithdrawalSigner(address sender, bytes calldata signature) internal view returns (address) {
        return ECDSA.recover(getWithdrawalHash(sender), signature);
    }
}
