
import { useEffect, useState } from "react";
import { supabase } from "../../api/supabase";
import { BookOpen, Github, Star, Eye, ThumbsUp, MessageSquare, Share2, Pencil } from 'lucide-react';

type Thesis = {
    thesisID: string;
    authorID: number;
    title: string;
    abstract: string;
    publicationYear: number;
    keywords: string;
    pdfFileUrl: string;
    status: string;
    authorName?: string;
    views?: number;
    likes?: number;
    comments?: number;
}

interface Search {
    searchQuery: string;
}

const BookmarkList = ({ searchQuery }: Search) => {
    const [bookmarkedTheses, setBookmarkedTheses] = useState<Thesis[]>([]);
    const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    // Add a refreshTrigger state to force refetching of bookmarks
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const fetchBookmarkedTheses = async () => {
            setLoading(true);
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }
            
            // Fetch user's bookmarks
            const { data: bookmarkData, error: bookmarkError } = await supabase
                .from("UserBookmarks")
                .select("thesisID")
                .eq('userID', user.id);
            
            if (bookmarkError) {
                console.error("Error fetching bookmarks:", bookmarkError);
                setLoading(false);
                return;
            }
            
            // Create an array of bookmark IDs
            const bookmarkIds = bookmarkData?.map(b => b.thesisID) || [];
            
            if (bookmarkIds.length === 0) {
                setLoading(false);
                setBookmarkedTheses([]);
                return;
            }
            
            // Fetch all theses that match the bookmark IDs
            const { data: thesesData, error: thesesError } = await supabase
                .from("Thesis")
                .select("*")
                .in('thesisID', bookmarkIds)
                .eq('status', 'Active');
            
            if (thesesError) {
                console.error("Error fetching bookmarked theses:", thesesError);
                setLoading(false);
                return;
            }
            
            // Simulate fetching additional metadata
            const enhancedData = thesesData.map(thesis => ({
                ...thesis,
                authorName: `Author ${thesis.authorID}`, // Replace with actual author name fetch
                views: Math.floor(Math.random() * 500) + 50,
                likes: Math.floor(Math.random() * 100) + 5,
                comments: Math.floor(Math.random() * 20)
            }));
            
            console.log("Fetched bookmarked theses: ", enhancedData);
            setBookmarkedTheses(enhancedData);
            setLoading(false);
        };

        fetchBookmarkedTheses();
    }, [refreshTrigger]); // Add refreshTrigger to dependency array
    
    // Filter bookmarked theses based on search query
    const filteredTheses = searchQuery
        ? bookmarkedTheses.filter(thesis => 
            thesis.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : bookmarkedTheses;
    
    const toggleAbstract = (thesisID: string) => {
        setExpandedAbstracts(prev => ({
            ...prev,
            [thesisID]: !prev[thesisID]
        }));
    };

    const toggleBookmark = async (thesisID: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
      
        // Use the filter method to find the thesis in the bookmarked list
        const isBookmarked = bookmarkedTheses.some(b => b.thesisID === thesisID);
      
        if (isBookmarked) {
          // Remove bookmark
          const { error } = await supabase
            .from("UserBookmarks")
            .delete()
            .match({ userID: user.id, thesisID });
      
          if (!error) {
            // Instead of just updating the state, trigger a refresh to get the latest data
            setRefreshTrigger(prev => prev + 1);
          } else {
            console.error("Error removing bookmark:", error);
          }
        } else {
          // Add bookmark
          const { error } = await supabase
            .from("UserBookmarks")
            .insert([{ userID: user.id, thesisID }]);
      
          if (!error) {
            // Instead of just updating the state, trigger a refresh to get the latest data
            setRefreshTrigger(prev => prev + 1);
          } else {
            console.error("Error adding bookmark:", error);
          }
        }
    };      
    

    if (loading) {
        return (
            <div className="px-6 py-12 flex justify-center">
                <div className="animate-pulse flex flex-col space-y-4 w-full max-w-3xl">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white p-5 rounded-lg shadow-md h-48"></div>
                    ))}
                </div>
            </div>
        );
    }

    return(
        <div className="px-6 space-y-6 pb-12">
            {filteredTheses.length > 0 ? (
                filteredTheses.map((item) => (
                    <div 
                        key={item.thesisID} 
                        className="flex flex-col bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-violet-500"
                    >
                        <div className="flex">
                            {/* Thumbnail Preview */}
                            <div className="w-36 h-28 bg-violet-50 dark:bg-gray-700 flex items-center justify-center rounded-md overflow-hidden">
                                <BookOpen size={36} className="text-violet-400" />
                            </div>
                            
                            {/* Main Content */}
                            <div className="flex-1 px-4">
                                <div className="flex justify-between">
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">{item.title}</h3>
                                    <button
                                        onClick={() => toggleBookmark(item.thesisID)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        aria-label="Remove bookmark"
                                    >
                                        <Star className="w-5 h-5 text-aqua-400 fill-aqua-400" />
                                    </button>
                                    <button
                                        onClick={() => alert(`Clicked on ${item.title}`)}
                                        className="ml-2 bg-blue-100 text-blue-700 rounded-full px-3 py-1 text-sm hover:bg-blue-200 transition-colors"
                                        aria-label="Click action"
                                    >
                                        <span>Click</span>
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                    By <span className="font-medium">{item.authorName}</span> • Published {item.publicationYear}
                                </p>
                                <div className="flex gap-2 mb-2 flex-wrap">
                                    {item.keywords.split(',').map((keyword, idx) => (
                                        <span key={idx} className="bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 text-xs px-2 py-1 rounded-full">
                                            {keyword.trim()}
                                        </span>
                                    ))}
                                </div>
                                
                                {/* Stats Row */}
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <Eye size={14} />
                                        <span>{item.views}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ThumbsUp size={14} />
                                        <span>{item.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MessageSquare size={14} />
                                        <span>{item.comments}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Abstract Section - Expandable */}
                        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <button 
                                onClick={() => toggleAbstract(item.thesisID)}
                                className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 mb-2 flex items-center"
                            >
                                {expandedAbstracts[item.thesisID] ? "Hide Abstract" : "Show Abstract"}
                            </button>
                            
                            {expandedAbstracts[item.thesisID] && (
                                <div className="animate-fadeIn">
                                    <p className="text-gray-700 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                                        {item.abstract}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 text-sm">
                                    <ThumbsUp size={16} />
                                    <span>Like</span>
                                </button>
                                <button className="flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 text-sm">
                                    <MessageSquare size={16} />
                                    <span>Comment</span>
                                </button>
                                <button className="flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 text-sm">
                                    <Share2 size={16} />
                                    <span>Share</span>
                                </button>
                            </div>
                            
                            <div className="flex gap-2">
                                <button className="flex items-center gap-1 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200 rounded-full px-3 py-1 text-sm hover:bg-violet-200 dark:hover:bg-violet-800 transition-colors">
                                    <Github size={16} />
                                    <span>Code</span>
                                </button>
                                <button 
                                    onClick={() => window.open(item.pdfFileUrl, "_blank")}
                                    className="flex items-center gap-1 bg-aqua-100 text-aqua-700 rounded-full px-3 py-1 text-sm hover:bg-aqua-200 transition-colors"
                                >
                                    <Pencil size={16} />
                                    <span>View</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen size={48} className="text-violet-300 mb-3" />
                    <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">No bookmarked theses found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Start bookmarking theses you find interesting to see them here
                    </p>
                </div>
            )}
        </div>
    );
};

export default BookmarkList;