import { useState } from "react";
import BookmarkList from "../../components/dashboard/BookmarkList";
import BookmarkNavTop from "./BookmarkNavTop";

const BookmarkedTheses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BookmarkNavTop setSearchQuery={setSearchQuery} searchQuery={searchQuery} />
      
      <div className="container mx-auto pt-6">
        <div className="px-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Bookmarked Theses</h1>
          <p className="text-gray-600 dark:text-gray-300">Your collection of saved research papers</p>
        </div>
        
        <BookmarkList searchQuery={searchQuery} />
      </div>
    </div>
  );
};

export default BookmarkedTheses;