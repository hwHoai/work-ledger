export class BLOCKCHAIN_CONSTANTS {
  static readonly CHECK_IN_CONTRACT_ADDRESS = '0x4eED5cA8Bc0d79201Cc82F7e90CDb2aF50AB1840';
}

export class CONSTRACT_ABI {
  static readonly CHECK_IN = {
    inputs: [],
    name: 'checkIn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  };
}

export class EVENT_ABI {
  static readonly EMPLOYEE_CHECKED_IN_ABI = {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'empWallet',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'timestamps',
        type: 'uint256',
      },
    ],
    name: 'CheckedIn',
    type: 'event',
  };
}
