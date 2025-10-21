export class BLOCKCHAIN_CONSTANTS {
  static readonly MANAGE_EMPLOYEE_CONTRACT_ADDRESS = '0x939eb54AE0eAf9fb7A07951F8a577Cb6c9B42D66';
  static readonly CHECK_IN_CONTRACT_ADDRESS = '0xCAf2C6c6854314Fb90bBb6d9115Fc16F0D3B8e5f';
}

export class CONSTRACT_ABI {
  static readonly ADD_EMPLOYEE_ABI = 
    {
      inputs: [
        {
          internalType: 'address',
          name: 'empAddress',
          type: 'address',
        },
        {
          internalType: 'string',
          name: 'empName',
          type: 'string',
        },
      ],
      name: 'addEmployee',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
    };
}

export class EVENT_ABI {
  static readonly EMPLOYEE_ADDED_ABI = {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "empAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "createdAt",
          "type": "uint256"
        }
      ],
      "name": "EmployeeAdded",
      "type": "event"
    };
}
