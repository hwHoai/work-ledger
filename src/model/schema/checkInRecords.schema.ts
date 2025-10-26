import mongoose, { Schema, model, models } from 'mongoose';

const DOCUMENT_NAME = 'CheckInRecords';
const COLLECTION_NAME = 'checkin_records';

/*  
    example event payload:
    address: "0x4eed5ca8bc0d79201cc82f7e90cdb2af50ab1840"
    args: {empWallet: '0xbb9187...', timestamps: 1761142728n}
    blockHash: "0x2553..."
    blockNumber: 9466333n
    blockTimestamp: "0x68f8e7c8"
    eventName: "CheckedIn"
    ...
*/

const CheckInRecordsSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },
    contractAddress: { type: String, trim: true, required: true },
    blockTimestamp: { type: String, trim: true },
    blockHash: { type: String, trim: true },
    blockNumber: { type: String, trim: true },
    logIndex: { type: Number },
    transactionHash: {
      type: String,
      trim: true,
      unique: true,
      index: true,
      required: true,
    },
    transactionIndex: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
  },
  { collection: COLLECTION_NAME },
);

const CheckInRecordsModel =
  // use mongoose.models safely in environments where `models` may be undefined
  mongoose.models?.[DOCUMENT_NAME] || model(DOCUMENT_NAME, CheckInRecordsSchema);

export default CheckInRecordsModel;
