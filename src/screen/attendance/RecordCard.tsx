'use client';
import React from 'react';

// Local copy of the normalized record shape (keeps this component self-contained)
interface NormalizedCheckInRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  walletAddress: string;
  checkInTime: Date;
  date: string;
  blockHash: string;
  transactionHash: string;
}

interface Props {
  record: NormalizedCheckInRecord;
  onCopy: (text: string) => void;
}

export default function RecordCard({ record, onCopy }: Props) {
  const initials = (record.employeeName || '')
    .split(' ')
    .map(function (s: string) {
      return s[0];
    })
    .slice(0, 2)
    .join('');

  return (
    <article className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white rounded-xl p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-md hover:bg-gradient-to-r from-blue-600/30 to-purple-600/30 transition-all">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-full bg-amber-300 flex items-center justify-center text-white font-semibold">
            {initials}
          </div>
          <div className="flex flex-row justify-center items-center gap-2">
            <div className="font-semibold text-base">{record.employeeName}</div>
            <div className="text-xs text-muted-2">{record.employeeId}</div>
          </div>
        </div>
        <div className="text-xs text-muted-1 font-mono mb-1">{record.walletAddress}</div>
        <div className="text-sm text-foreground">
          Check-in:{' '}
          <span className="font-medium text-success">
            {record.checkInTime.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 min-w-[140px]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCopy(record.walletAddress)}
            className="text-accent text-sm font-medium inline-flex items-center gap-2 hover:cursor-pointer"
            title="Copy wallet"
          >
            Copy wallet
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-2">Block {record.blockHash.slice(0, 10)}…</span>
          <span className="text-xs text-muted-2">•</span>
          <a
            href={`https://sepolia.etherscan.io/tx/${record.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-2 hover:text-foreground  hover:underline"
          >
            View Tx
          </a>
        </div>
      </div>
    </article>
  );
}
