import React, { useState, useEffect } from 'react';
import { AuditEntry } from '../types';

interface AdminAreaProps {
  onClose: () => void;
}

const AdminArea: React.FC<AdminAreaProps> = ({ onClose }) => {
  const [auditHistory, setAuditHistory] = useState<AuditEntry[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('gbp-audit-history');
    if (storedHistory) {
      try {
        const parsedHistory: AuditEntry[] = JSON.parse(storedHistory);
        // Sort by most recent first
        parsedHistory.sort((a: AuditEntry, b: AuditEntry) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setAuditHistory(parsedHistory);
      } catch (e) {
        console.error("Failed to parse audit history:", e);
        setAuditHistory([]);
      }
    }
  }, []);
  
  const clearHistory = () => {
    if(window.confirm('Are you sure you want to clear all audit history? This cannot be undone.')) {
        localStorage.removeItem('gbp-audit-history');
        setAuditHistory([]);
    }
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg animate-fade-in">
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel - Audit History</h2>
            <button
                onClick={onClose}
                className="py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                &times; Close
            </button>
        </div>
        
        {auditHistory.length > 0 ? (
            <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {auditHistory.map((entry, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(entry.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{entry.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{entry.businessName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{entry.location}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{entry.phoneNumber}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-6 text-right">
                <button
                    onClick={clearHistory}
                    className="py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Clear History
                </button>
            </div>
            </>
        ) : (
            <div className="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No Audit History</h3>
                <p className="mt-1 text-sm text-gray-500">Perform an audit to see data here.</p>
            </div>
        )}
    </div>
  );
};

export default AdminArea;