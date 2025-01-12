// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Faucet} from "../src/Faucet.sol";

contract FaucetTestnetScript is Script {
    Faucet public faucet;

    function setUp() public {}

    function run() public {
        address deployer = vm.rememberKey(vm.envUint("DEPLOYER_PRIVATE_KEY"));
        address signer = vm.envAddress("SIGNER_ADDRESS");

        vm.startBroadcast(deployer);
        faucet = new Faucet(signer);
        vm.stopBroadcast();

        string memory json = vm.serializeAddress("config", "address", address(faucet));
        vm.writeJson(json, string.concat(vm.projectRoot(), "/abi/faucet.mainnet.json"));
    }
}
