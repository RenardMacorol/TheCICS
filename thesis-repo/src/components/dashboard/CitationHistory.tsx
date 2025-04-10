// CitationHistory.tsx
import React, { useEffect, useState } from "react";

type Props = {
  userId: string;
};

type HistoryEntry = {
  citation: string;
  date: string;
};

const CitationHistory: React.FC<Props> = ({ userId }) => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // Replace this with actual fetching from localStorage, API, or DB
    const stored = localStorage.getItem(`citationHistory-${userId}`);
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, [userId]);

  if (!history.length) return null;

  return (
    <div className="mt-5 border-t pt-4 border-gray-200 dark:border-gray-700">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Citation History</h4>
      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 max-h-40 overflow-y-auto pr-1">
        {history.map((entry, index) => (
          <li
            key={index}
            className="p-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-600"
          >
            <div className="break-words">{entry.citation}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Copied on {entry.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CitationHistory;
