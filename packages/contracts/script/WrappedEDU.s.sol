// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {WrappedEDU} from "../src/WrappedEDU.sol";

contract WEDUScript is Script {
    WrappedEDU public wedu;

    function setUp() public {}

    function run() public {
        address deployer = vm.rememberKey(vm.envUint("DEPLOYER_PRIVATE_KEY"));

        vm.startBroadcast(deployer);
        wedu = new WrappedEDU();
        vm.stopBroadcast();

        string memory json = vm.serializeAddress("config", "address", address(wedu));
        vm.writeJson(json, string.concat(vm.projectRoot(), "/abi/wedu.testnet.json"));
    }
}

// ✅  [Success]Hash: 0x1b13c0914bbfe0f6ec12767389e3ba0e336d3ce7009b1bee67d738dd9551b019
// Contract Address: 0x0c654EF346984af890DFCB8C08710938cfe267F9
// Block: 28002323
