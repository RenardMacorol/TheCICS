import { useState } from "react";
import CitationHistory from "../../components/dashboard/CitationHistory";
import DashNavTop from "../../components/dashboard/DashNavTop";

const CitationHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null); // State for selected citation format

  const citationFormats = ["APA", "MLA", "CHICAGO"];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashNavTop setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
      
      <div className="container mx-auto pt-6">
        <div className="px-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Citation History</h1>
          <p className="text-gray-600 dark:text-gray-300">Your history of copied citations</p>
        </div>
        
        {/* Citation Format Filter Buttons */}
        <div className="px-6 mb-6 flex gap-2">
          {/* "All" button first */}
          <button
            onClick={() => setSelectedFormat(null)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedFormat === null
                ? "bg-violet-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            ALL
          </button>

          {/* Citation format buttons */}
          {citationFormats.map(format => (
            <button
              key={format}
              onClick={() => setSelectedFormat(format.toLowerCase())}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedFormat === format.toLowerCase()
                  ? "bg-violet-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {format}
            </button>
          ))}
        </div>

        <CitationHistory  />
      </div>
    </div>
  );
};

export default CitationHistoryPage;