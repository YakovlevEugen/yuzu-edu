// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Faucet} from "../src/Faucet.sol";

contract FaucetTest is Test {
    Faucet public faucet;

    address constant SIGNER = address(0xBBED9678e14027A48c1f294D0468bBc402E3e4ef);
    uint256 constant SIGNER_PK = 0x98b8a9c18e38fc621fd142ae6df307d52404c621743f6f6891cc8def49a77e0c;
    address constant USER = address(30001);
    address constant USER2 = address(30002);
    address constant HACKER = address(30003);

    function setUp() public {
        faucet = new Faucet(SIGNER);
        vm.deal(address(faucet), 1 ether);
    }

    function test_Claim() public {
        vm.startPrank(USER);

        bytes32 digest = faucet.getWithdrawalHash(USER);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER_PK, digest);

        faucet.claim(abi.encodePacked(r, s, v));
        uint256 balance = address(USER).balance;
        assertEq(balance, 0.1 ether);
    }

    function test_Claim_FAIL() public {
        vm.startPrank(HACKER);

        bytes32 digest = faucet.getWithdrawalHash(USER);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(SIGNER_PK, digest);

        vm.expectRevert();
        faucet.claim(abi.encodePacked(r, s, v));

        uint256 balance = address(HACKER).balance;
        assertEq(balance, 0 ether);
    }

    function test_ClaimTo() public {
        vm.startPrank(SIGNER);
        faucet.claimTo(USER2);

        assertEq(address(USER2).balance, 0.1 ether);

        vm.expectRevert();
        faucet.claimTo(USER2);

        assertEq(address(USER2).balance, 0.1 ether);
    }

    function test_ClaimTo_FAIL_not_a_signer() public {
        vm.startPrank(HACKER);

        vm.expectRevert();
        faucet.claimTo(HACKER);

        uint256 balance = address(HACKER).balance;
        assertEq(balance, 0 ether);
    }
}
