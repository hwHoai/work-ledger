'use client';
import React, { useEffect, useState } from 'react';
import { axiosInstance } from '~/config/axios.config';
import Toast from '~/components/ui/Toast';
import RecordCard from './RecordCard';

interface EmployeeInstance {
  _id: string;
  id: string;
  name: string;
  role: string;
  walletAddress: string;
  joinDate: string;
  isActive: boolean;
  isDeleted: boolean;
  endWorkDate: string | null;
  __v: number;
}

interface CheckInRecordRaw {
  _id: string;
  employee: EmployeeInstance;
  contractAddress: string;
  blockTimestamp: string;
  blockHash: string;
  blockNumber: string;
  logIndex: number;
  transactionHash: string;
  transactionIndex: number;
  createdAt: string;
  __v: number;
}

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

interface GroupedRecords {
  [date: string]: NormalizedCheckInRecord[];
}

const AttendancePage: React.FC = () => {
  // Converts raw check-in records to normalized format
  const normalizeRecords = (rawRecords: CheckInRecordRaw[]): NormalizedCheckInRecord[] => {
    return rawRecords.map((record) => {
      const timestampMs = parseInt(record.blockTimestamp, 16) * 1000;
      const checkInTime = new Date(timestampMs);
      const date = checkInTime.toISOString().split('T')[0];
      return {
        id: record._id,
        employeeName: record.employee.name,
        employeeId: record.employee.id,
        walletAddress: record.employee.walletAddress,
        checkInTime,
        date,
        blockHash: record.blockHash,
        transactionHash: record.transactionHash,
      };
    });
  };

  // Groups normalized records by date
  const groupRecordsByDate = (normalizedRecords: NormalizedCheckInRecord[]): GroupedRecords => {
    const grouped: GroupedRecords = {};
    normalizedRecords.forEach((record) => {
      if (!grouped[record.date]) {
        grouped[record.date] = [];
      }
      grouped[record.date].push(record);
    });
    // Ensure each day's records are sorted newest-first (by checkInTime)
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => b.checkInTime.getTime() - a.checkInTime.getTime());
    });
    // Sort dates descending (latest first)
    const sortedGrouped: GroupedRecords = {};
    Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .forEach((date) => {
        sortedGrouped[date] = grouped[date];
      });
    return sortedGrouped;
  };
  // records state kept only if needed later; remove to avoid unused variable warnings
  // const [records, setRecords] = useState<NormalizedCheckInRecord[]>([]);
  const [groupedRecords, setGroupedRecords] = useState<GroupedRecords>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // local state for search
  const [query, setQuery] = useState('');

  const filteredGrouped = React.useMemo(() => {
    if (!query.trim()) {
      return groupedRecords;
    }
    const q = query.toLowerCase();
    const out: GroupedRecords = {};
    Object.entries(groupedRecords).forEach(([date, recs]) => {
      const matches = recs.filter((r) =>
        r.employeeName.toLowerCase().includes(q) ||
        r.employeeId.toLowerCase().includes(q) ||
        r.walletAddress.toLowerCase().includes(q) ||
        r.transactionHash.toLowerCase().includes(q),
      );
      if (matches.length) {
        out[date] = matches;
      }
    });
    return out;
  }, [groupedRecords, query]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // show toast on success
      setToast({ visible: true, message: 'Wallet address copied', type: 'success' });
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      setToast({ visible: true, message: 'Copied (fallback)', type: 'success' });
    }
  };

  // toast state
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type?: 'info' | 'success' | 'error';
  }>({
    visible: false,
    message: '',
    type: 'info',
  });

  useEffect(() => {
    fetchCheckInRecords();
  }, []);

  const fetchCheckInRecords = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/employee/checkin');
      const data: CheckInRecordRaw[] = response.data;
  const normalized = normalizeRecords(data);
  // Defensive overall sort: newest check-ins first
  normalized.sort((a, b) => b.checkInTime.getTime() - a.checkInTime.getTime());
      const grouped = groupRecordsByDate(normalized);
      setGroupedRecords(grouped);
      setToast({ visible: true, message: 'Records refreshed', type: 'info' });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch check-in records');
      setToast({ visible: true, message: 'Failed to refresh', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 my-10 max-w-4xl mx-auto bg-white dark:bg-card-bg rounded-2xl shadow-xl border border-gray-100 dark:border-white/6 overflow-hidden">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />

          <div className="flex items-center gap-3">
            <div className="flex-1 h-10 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="w-28 h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>

          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/60 dark:bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-100 shadow-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2" />
                </div>
                <div className="flex flex-col items-end gap-2 min-w-[140px]">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-28" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh] animate-fadeIn">
        <span className="text-lg text-red-500 font-semibold">Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto mt-10 bg-white dark:bg-card-bg rounded-2xl shadow-xl border border-gray-100 dark:border-white/6 overflow-hidden">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Employee Attendance</h1>
        <p className="text-sm text-muted-1 mb-4">
          Browse check-in records grouped by date. Use search to filter by name, id, wallet or tx.
        </p>

        <div className="flex items-center gap-3 rounded-lg">
          <div className="flex-1">
            <input
              aria-label="Search records"
              placeholder="Search by name, id, wallet or tx"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-lg ring-[1px] ring-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
          <button
            onClick={() => fetchCheckInRecords()}
            className="px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm hover:brightness-105"
            title="Refresh"
          >
            Refresh
          </button>
        </div>
      </div>

      {Object.keys(filteredGrouped).length === 0 ? (
        <div className="bg-white/5 rounded-xl shadow-sm p-8 text-center animate-fadeIn border border-white/5">
          <span className="text-lg text-muted-2">No check-in records found.</span>
        </div>
      ) : (
        Object.entries(filteredGrouped).map(([date, dayRecords]) => (
          <section key={date} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-yellow-300" />
              <h2 className="text-lg font-semibold text-foreground">{date}</h2>
              <span className="text-xs text-muted-2">
                {dayRecords.length} check-in{dayRecords.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-4">
              {dayRecords.map((record, index) => (
                <React.Fragment key={index}>
                  <RecordCard record={record} onCopy={(t) => copyToClipboard(t)} />
                </React.Fragment>
              ))}
            </div>
          </section>
        ))
      )}
      <Toast
        message={toast.message}
        visible={toast.visible}
        type={toast.type}
        onClose={() => setToast((s) => ({ ...s, visible: false }))}
      />
    </div>
  );
};

export default AttendancePage;
