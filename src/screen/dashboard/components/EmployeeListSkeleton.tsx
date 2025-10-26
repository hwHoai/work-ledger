'use client';

import React from 'react';

type Props = {
  rows?: number;
};

export default function EmployeeListSkeleton({ rows = 8 }: Props) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr
          key={i}
          className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}`}
        >
          <td className="py-4 px-4">
            <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="py-4 px-4">
            <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="py-4 px-4">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="py-4 px-4">
            <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
          </td>
          <td className="py-4 px-4">
            <div className="h-6 w-16 bg-gray-200 rounded-full animate-pulse" />
          </td>
          <td className="py-4 px-4">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
          </td>
        </tr>
      ))}
    </>
  );
}
