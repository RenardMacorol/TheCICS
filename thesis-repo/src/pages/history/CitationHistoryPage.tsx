import { useState } from "react";
import CitationHistory from "../../components/dashboard/CitationHistory";
import DashNavTop from "../../components/dashboard/DashNavTop";

const CitationHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashNavTop setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
      
      <div className="container mx-auto pt-6">
        <div className="px-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Citation History</h1>
          <p className="text-gray-600 dark:text-gray-300">Your history of copied citations</p>
        </div>
        
        <CitationHistory />
      </div>
    </div>
  );
};

export default CitationHistoryPage;