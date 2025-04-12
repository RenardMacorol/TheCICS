import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import for navigation
import { supabase } from "../../service/supabase";
import { BookOpen, Github, Star, Eye, ThumbsUp, MessageSquare, Share2, Pencil } from 'lucide-react';
import CitationModal from "./CitationModal"; // Add this import for the citation modal
import Thesis from "../../service/Types/Thesis";

interface Search {
    searchQuery: string;
}

const BookmarkList = ({ searchQuery }: Search) => {
    const [bookmarkedTheses, setBookmarkedTheses] = useState<Thesis[]>([]);
    const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null); // Add state for selected thesis
    const [isCitationModalOpen, setIsCitationModalOpen] = useState(false); // Add state for citation modal
    const navigate = useNavigate(); // Add navigation hook

    useEffect(() => {
        const fetchBookmarkedTheses = async () => {
            setLoading(true);
            
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }
            
            const { data: bookmarkData, error: bookmarkError } = await supabase
                .from("UserBookmarks")
                .select("thesisID")
                .eq('userID', user.id);
            
            if (bookmarkError) {
                console.error("Error fetching bookmarks:", bookmarkError);
                setLoading(false);
                return;
            }
            
            const bookmarkIds = bookmarkData?.map(b => b.thesisID) || [];
            
            if (bookmarkIds.length === 0) {
                setLoading(false);
                setBookmarkedTheses([]);
                return;
            }
            
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
            
            const enhancedData = thesesData.map(thesis => ({
                ...thesis,
                authorName: `Author ${thesis.authorID}`,
                views: Math.floor(Math.random() * 500) + 50,
                likes: Math.floor(Math.random() * 100) + 5,
                comments: Math.floor(Math.random() * 20)
            }));
            
            console.log("Fetched bookmarked theses: ", enhancedData);
            setBookmarkedTheses(enhancedData);
            setLoading(false);
        };

        fetchBookmarkedTheses();
    }, [refreshTrigger]);
    
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
    
        const { data: existingBookmark, error: fetchError } = await supabase
            .from("UserBookmarks")
            .select("thesisID")
            .eq("userID", user.id)
            .eq("thesisID", thesisID)
            .single();
    
        if (fetchError && fetchError.code !== "PGRST116") {
            console.error("Error checking bookmark:", fetchError);
            return;
        }
    
        if (existingBookmark) {
            const { error: deleteError } = await supabase
                .from("UserBookmarks")
                .delete()
                .match({ userID: user.id, thesisID });
    
            if (!deleteError) {
                setRefreshTrigger(prev => prev + 1);
            } else {
                console.error("Error removing bookmark:", deleteError);
            }
        } else {
            const { error: insertError } = await supabase
                .from("UserBookmarks")
                .insert([{ userID: user.id, thesisID }]);
    
            if (!insertError) {
                setRefreshTrigger(prev => prev + 1);
            } else {
                console.error("Error adding bookmark:", insertError);
            }
        }
    };

    // Add function to handle title click and navigation
    const handleThesisClick = (thesisID: string) => {
        navigate(`/thesis/${thesisID}`); // Navigate to the thesis details page
    };

    // Add function to handle cite button click and open citation modal
    const handleShareClick = (thesis: Thesis) => {
        setSelectedThesis(thesis);
        setIsCitationModalOpen(true);
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


    return (
        <div className="px-6 space-y-6 pb-12">
            {filteredTheses.length > 0 ? (
                filteredTheses.map((item) => (
                    <div 
                        key={item.thesisID} 
                        className="flex flex-col bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-violet-500"
                    >
                        <div className="flex">
                            {/* Thumbnail Preview */}
                            <div className="w-36 h-28 bg-violet-50 flex items-center justify-center rounded-md overflow-hidden">
                                <BookOpen size={36} className="text-violet-400" />
                            </div>
                            
                            {/* Main Content */}
                            <div className="flex-1 px-4">
                                <div className="flex justify-between">
                                    {/* Update title to be clickable */}
                                    <h3 
                                        className="text-lg font-bold text-gray-800 mb-1 cursor-pointer hover:text-violet-500"
                                        onClick={() => handleThesisClick(item.thesisID)}
                                    >
                                        {item.title}
                                    </h3>
                                    <button
                                        onClick={() => toggleBookmark(item.thesisID)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                        aria-label="Remove bookmark"
                                    >
                                        <Star className="w-5 h-5 text-cyan-400 fill-cyan-400" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">
                                    By <span className="font-medium">{item.authorName}</span> • Published {item.publicationYear}
                                </p>
                                <div className="flex gap-2 mb-2 flex-wrap">
                                    {item.keywords.split(',').map((keyword, idx) => (
                                        <span key={idx} className="bg-violet-100 text-violet-800 text-xs px-2 py-1 rounded-full">
                                            {keyword.trim()}
                                        </span>
                                    ))}
                                </div>
                                
                                {/* Stats Row */}
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
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
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <button 
                                onClick={() => toggleAbstract(item.thesisID)}
                                className="text-sm text-violet-600 hover:text-violet-800 mb-2 flex items-center"
                            >
                                {expandedAbstracts[item.thesisID] ? "Hide Abstract" : "Show Abstract"}
                            </button>
                            
                            {expandedAbstracts[item.thesisID] && (
                                <div className="animate-fadeIn">
                                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-md">
                                        {item.abstract}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1 text-violet-600 hover:text-violet-800 text-sm">
                                    <ThumbsUp size={16} />
                                    <span>Like</span>
                                </button>
                                <button className="flex items-center gap-1 text-violet-600 hover:text-violet-800 text-sm">
                                    <MessageSquare size={16} />
                                    <span>Comment</span>
                                </button>
                                {/* Update Cite button to open the citation modal */}
                                <button 
                                    onClick={() => handleShareClick(item)}
                                    className="flex items-center gap-1 text-violet-600 hover:text-violet-800 text-sm"
                                >
                                    <Share2 size={16} />
                                    <span>Cite</span>
                                </button>
                            </div>
                            
                            <div className="flex gap-2">
                                <button className="flex items-center gap-1 bg-violet-100 text-violet-700 rounded-full px-3 py-1 text-sm hover:bg-violet-200 transition-colors">
                                    <Github size={16} />
                                    <span>Code</span>
                                </button>
                                <button 
                                    onClick={() => window.open(item.pdfFileUrl, "_blank")}
                                    className="flex items-center gap-1 bg-cyan-100 text-cyan-700 rounded-full px-3 py-1 text-sm hover:bg-cyan-200 transition-colors"
                                >
                                    <Pencil size={16} />
                                    <span>Read</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen size={48} className="text-violet-300 mb-3" />
                    <h3 className="text-xl font-medium text-gray-600">No bookmarked theses found</h3>
                    <p className="text-gray-500 mt-1">
                        Start bookmarking theses you find interesting to see them here
                    </p>
                </div>
            )}

            {/* Add Citation Modal */}
            {selectedThesis && (
                <CitationModal
                    thesis={selectedThesis}
                    isOpen={isCitationModalOpen}
                    onClose={() => setIsCitationModalOpen(false)}
                />
            )}
        </div>
    );
};

export default BookmarkList;