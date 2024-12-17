// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Faucet} from "../src/Faucet.sol";

contract FaucetScript is Script {
    Faucet public faucet;

    function setUp() public {}

    function run() public {
        address deployer = vm.rememberKey(vm.envUint("DEPLOYER_PRIVATE_KEY"));
        address signer = vm.addr(vm.envUint("SIGNER_ADDRESS"));

        vm.startBroadcast(deployer);
        faucet = new Faucet(signer);
        vm.stopBroadcast();
    }
}
