'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type SwipeResult = {
  id: number;
  direction: 'left' | 'right';
};

export default function ResultsPage() {
  const [results, setResults] = useState<SwipeResult[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('swipeResults');
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  // Toggle direction for a single card
  const toggleDirection = (index: number) => {
    setResults((prev) => {
      const newResults = [...prev];
      newResults[index] = {
        ...newResults[index],
        direction: newResults[index].direction === 'left' ? 'right' : 'left',
      };
      return newResults;
    });
  };

  // Save changes to localStorage and exit edit mode
  const handleSave = () => {
    localStorage.setItem('swipeResults', JSON.stringify(results));
    setIsEditing(false);
  };

  // Enter edit mode (do not clear localStorage)
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Submit function placeholder (you can replace with your submit logic)
  const handleSubmit = () => {
    alert('ippo saukariyam illa bakki sadhanagal set akkat');
    // Add your submit logic here
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Results</h1>

      {results.length === 0 ? (
        <p className="text-gray-400">No swipe data found.</p>
      ) : (
        <ul className="w-full max-w-md space-y-4">
          {results.map((result, i) => (
            <li
              key={i}
              className={`flex justify-between items-center px-4 py-3 rounded-md shadow-md ${
                result.direction === 'right' ? 'bg-green-700' : 'bg-red-700'
              }`}
            >
              <span>Card #{result.id}</span>
              <div className="flex items-center space-x-4">
                <span className="capitalize">{result.direction}</span>
                {isEditing && (
                  <button
                    onClick={() => toggleDirection(i)}
                    className="px-3 py-1 bg-yellow-500 rounded-md text-black hover:bg-yellow-400 transition"
                  >
                   Mark {result.direction === 'left' ? 'Present' : 'Absent'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="flex space-x-4 mt-8 w-full max-w-md">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md text-white transition"
          >
            Save
          </button>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 rounded-md text-white transition"
            >
              Edit
            </button>

            <button
              onClick={handleSubmit}
              className="w-full px-6 py-3 bg-green-600 hover:bg-blue-700 rounded-md text-white transition"
            >
              Submit
            </button>

            <Link
              href="/"
              className="w-full px-6 py-3 bg-gray-600 hover:bg-blue-700 rounded-md text-white transition text-center"
            >
              ReTake
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
