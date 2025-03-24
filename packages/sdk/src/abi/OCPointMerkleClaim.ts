export const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'ocPointContractAddress',
        type: 'address'
      },
      {
        internalType: 'contract IForwarderRegistry',
        name: 'forwarderRegistry',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes32[]',
        name: 'depositReasonCodes',
        type: 'bytes32[]'
      },
      {
        internalType: 'uint256',
        name: 'treeCounter',
        type: 'uint256'
      }
    ],
    name: 'AlreadyClaimed',
    type: 'error'
  },
  {
    inputs: [],
    name: 'IllegalInterfaceId',
    type: 'error'
  },
  {
    inputs: [],
    name: 'InconsistentArrayLengths',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'invalidOCPointContractAddress',
        type: 'address'
      }
    ],
    name: 'InvalidOCPointContractAddress',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes32[]',
        name: 'depositReasonCodes',
        type: 'bytes32[]'
      },
      {
        internalType: 'uint256',
        name: 'treeCounter',
        type: 'uint256'
      }
    ],
    name: 'InvalidProof',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'NotContractOwner',
    type: 'error'
  },
  {
    inputs: [],
    name: 'NotPaused',
    type: 'error'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'NotRoleHolder',
    type: 'error'
  },
  {
    inputs: [],
    name: 'Paused',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'root',
        type: 'bytes32'
      }
    ],
    name: 'MerkleRootSet',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'Pause',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'root',
        type: 'bytes32'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]'
      },
      {
        indexed: false,
        internalType: 'bytes32[]',
        name: 'depositReasonCodes',
        type: 'bytes32[]'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'treeCounter',
        type: 'uint256'
      }
    ],
    name: 'PayoutClaimed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      }
    ],
    name: 'RoleGranted',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'operator',
        type: 'address'
      }
    ],
    name: 'RoleRevoked',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [],
    name: 'Unpause',
    type: 'event'
  },
  {
    inputs: [],
    name: 'OC_POINT',
    outputs: [
      {
        internalType: 'contract IPoints',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'OPERATOR_ROLE',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address'
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]'
      },
      {
        internalType: 'bytes32[]',
        name: 'depositReasonCodes',
        type: 'bytes32[]'
      },
      {
        internalType: 'bytes32[]',
        name: 'proof',
        type: 'bytes32[]'
      }
    ],
    name: 'claimPayout',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    name: 'claimed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'forwarderRegistry',
    outputs: [
      {
        internalType: 'contract IForwarderRegistry',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: 'hasRole_',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'forwarder',
        type: 'address'
      }
    ],
    name: 'isTrustedForwarder',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'accounts',
        type: 'address[]'
      },
      {
        internalType: 'contract IERC20[]',
        name: 'tokens',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]'
      }
    ],
    name: 'recoverERC20s',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'accounts',
        type: 'address[]'
      },
      {
        internalType: 'contract IERC721[]',
        name: 'contracts',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'tokenIds',
        type: 'uint256[]'
      }
    ],
    name: 'recoverERC721s',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address payable[]',
        name: 'accounts',
        type: 'address[]'
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]'
      }
    ],
    name: 'recoverETH',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      }
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32'
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address'
      }
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'root',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'merkleRoot',
        type: 'bytes32'
      }
    ],
    name: 'setMerkleRoot',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4'
      }
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'treeCounter',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;
