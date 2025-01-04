// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Faucet} from "../src/Faucet.sol";

contract FaucetTestnetScript is Script {
    Faucet public faucet;

    function setUp() public {}

    function run() public {
        address deployer = vm.rememberKey(vm.envUint("DEPLOYER_PRIVATE_KEY"));
        address signer = vm.addr(vm.envUint("SIGNER_ADDRESS"));

        vm.startBroadcast(deployer);
        faucet = new Faucet(signer);
        vm.stopBroadcast();

        string memory json = vm.serializeAddress("config", "address", address(faucet));
        vm.writeJson(json, string.concat(vm.projectRoot(), "/abi/faucet.testnet.json"));
    }
}

// ✅  [Success]Hash: 0xb581c0b0e3540ef949a37efac39b7db1c61c442a2226ea8c327a730bf34d4063
// Contract Address: 0x4F78556137d9E1BA69F23A804631C94E42329A09
// Block: 28001920
