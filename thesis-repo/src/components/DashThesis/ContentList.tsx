import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../api/supabase";
import { BookOpen, Github, Star, Eye, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import CitationModal from "./CitationModal";
import Thesis from "../../service/Table/Thesis";
import { FetchThesis } from '../../service/ContentManagement/FetchThesis';
import { FetchBookmark } from '../../service/ContentManagement/FetchBookmark';
interface FilterState {
    sort: string;
    year: string;
    keywords: string[];
}
interface ContentListProps {
    searchQuery: string;
    filters?: FilterState;
}

const ContentList = ({ searchQuery, filters }: ContentListProps) => {
    const [items, setItems] = useState<Thesis[]>([]);
    const [filteredThesis, setFilteredThesis] = useState<Thesis[]>([]);
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
    const [isCitationModalOpen, setIsCitationModalOpen] = useState(false);

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            const fetchThesis = new FetchThesis();
            await fetchThesis.fetch()
            const fetchBookmark = new FetchBookmark(); 
            await fetchBookmark.fetch()
            setLoading(false);

            setItems(fetchThesis.thesis);
            setFilteredThesis(fetchThesis.thesis);
            setBookmarks(fetchBookmark.bookmarks); // Ensure correct state update
            setLoading(false);
        };
       
        fetchContent();
    }, []);
    
    useEffect(() => {
        if (!items.length) return;
        
        let filtered = [...items];
        
        // Apply search filter
        if (searchQuery) {
            const searchLower = searchQuery.toLowerCase();
            filtered = filtered.filter((thesis) =>
                thesis.title.toLowerCase().includes(searchLower) || 
                thesis.abstract.toLowerCase().includes(searchLower) ||
                thesis.keywords.toLowerCase().includes(searchLower)
            );
        }
        
        // Apply year filter
        if (filters?.year && filters.year !== 'all') {
            filtered = filtered.filter(thesis => 
                thesis.publicationYear.toString() === filters.year
            );
        }
        
        // Apply keyword filters and calculate keyword match score
        if (filters?.keywords && filters.keywords.length > 0) {
            filtered = filtered.map(thesis => {
                const thesisKeywords = thesis.keywords.split(',').map(k => k.trim().toLowerCase());
                const matchCount = filters.keywords.filter(keyword => 
                    thesisKeywords.includes(keyword.toLowerCase())
                ).length;
                
                return {
                    ...thesis,
                    keywordMatch: matchCount
                };
            }).filter(thesis => thesis.keywordMatch > 0);
        }
        
        // Apply sorting
        if (filters?.sort) {
            switch (filters.sort) {
                case 'newest':
                    filtered.sort((a, b) => b.publicationYear - a.publicationYear);
                    break;
                case 'popular':
                    filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
                    break;
                case 'recommended':
                    filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
                    break;
                case 'keywords':
                    if (filters.keywords.length > 0) {
                        // Sort by keyword relevance (number of matching keywords)
                        filtered.sort((a, b) => {
                            const aMatch = a.keywordMatch || 0;
                            const bMatch = b.keywordMatch || 0;
                            return bMatch - aMatch;
                        });
                    }
                    break;
            }
        }
        
        setFilteredThesis(filtered);
    }, [searchQuery, filters, items]);
    
    const toggleAbstract = (thesisID: string) => {
        setExpandedAbstracts(prev => ({
            ...prev,
            [thesisID]: !prev[thesisID]
        }));
    };

    const handleThesisClick = (thesisID: string) => {
        navigate(`/thesis/${thesisID}`); // Navigate to the thesis details page
    };
      

    const toggleBookmark = async (thesisID: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;


        const isBookmarked = bookmarks.includes(thesisID);
    
        if (isBookmarked) {

            // Remove bookmark (Juls)
            await supabase
                .from("UserBookmarks")
                .delete()
                .match({ userID: user.id, thesisID });
            
            setBookmarks(bookmarks.filter(id => id !== thesisID));
        } else {
            // Add bookmark (Juls)
            await supabase

                .from("UserBookmarks")
                .insert([{ userID: user.id, thesisID }]);
    
    
            console.log(`Bookmark for thesisID: ${thesisID} added successfully.`);
            setBookmarks(prev => [...prev, thesisID]); 
        }     };
    
    const handleShareClick = (thesis: Thesis) => {
        setSelectedThesis(thesis);
        setIsCitationModalOpen(true);
    };

    // Function to highlight matching keywords when filters are applied
    const highlightMatchingKeywords = (keywordString: string) => {
        if (!filters?.keywords || filters.keywords.length === 0) {
            return keywordString.split(',').map((keyword, idx) => (
                <span key={idx} className="bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200 text-xs px-2 py-1 rounded-full">
                    {keyword.trim()}
                </span>
            ));
        }
        
        return keywordString.split(',').map((keyword, idx) => {
            const trimmed = keyword.trim();
            const isMatch = filters.keywords.some(
                filterKeyword => filterKeyword.toLowerCase() === trimmed.toLowerCase()
            );
            
            return (
                <span 
                    key={idx} 
                    className={`text-xs px-2 py-1 rounded-full ${
                        isMatch 
                            ? 'bg-violet-200 dark:bg-violet-800 text-violet-800 dark:text-violet-100 font-medium' 
                            : 'bg-violet-100 dark:bg-violet-900 text-violet-800 dark:text-violet-200'
                    }`}
                >
                    {trimmed}
                </span>
            );
        });
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
            {filteredThesis.map((item) => (
                <div 
                    key={item.thesisID} 
                    className={`flex flex-col bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
                        item.keywordMatch && item.keywordMatch > 0
                            ? `border-l-4 border-violet-${Math.min(item.keywordMatch * 2, 9)}00`
                            : 'border-l-4 border-violet-500'
                    }`}
                >
                    <div className="flex">
                        {/* Thumbnail Preview */}
                        <div className="w-36 h-28 bg-violet-50 dark:bg-gray-700 flex items-center justify-center rounded-md overflow-hidden">
                            <BookOpen size={36} className="text-violet-400" />
                        </div>
                        
                        {/* Main Content */}
                        <div className="flex-1 px-4">
                            <div className="flex justify-between">
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1 cursor-pointer hover:text-violet-500" onClick={() => handleThesisClick(item.thesisID)}>
                                    {item.title}
                                    {item.keywordMatch && item.keywordMatch > 0 && (
                                        <span className="ml-2 text-xs bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200 px-2 py-0.5 rounded-full">
                                            {item.keywordMatch} keyword{item.keywordMatch > 1 ? 's' : ''} match
                                        </span>
                                    )}
                                </h3>
                                <button 
                                    onClick={() => toggleBookmark(item.thesisID)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    aria-label={bookmarks.includes(item.thesisID) ? "Remove bookmark" : "Add bookmark"}
                                >
                                   {bookmarks.includes(item.thesisID) ? (
                                    <Star className="w-5 h-5 text-violet-400 fill-violet-400" />
                                    ) : (
                                    <Star className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                By <span className="font-medium">{item.authorName}</span> • Published {item.publicationYear}
                            </p>
                            <div className="flex gap-2 mb-2 flex-wrap">
                                {highlightMatchingKeywords(item.keywords)}
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
                            <button 
                                onClick={() => handleShareClick(item)}
                                className="flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 text-sm"
                            >
                                <Share2 size={16} />
                                <span>Cite</span>
                            </button>
                        </div>
                        
                        <div className="flex gap-2">
                            <button className="flex items-center gap-1 bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200 rounded-full px-3 py-1 text-sm hover:bg-violet-200 dark:hover:bg-violet-800 transition-colors">
                                <Github size={16} />
                                <span>Code</span>
                            </button>
                            <button 
                                onClick={() => handleThesisClick(item.thesisID)}
                                className="flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 text-sm"
                            >
                                <BookOpen size={16} />
                                <span>Read</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            
            {filteredThesis.length === 0 && (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
                    <Github size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No results found</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                        Try adjusting your search or filter criteria to find more theses.
                    </p>
                </div>
            )}

            {/* Citation Modal */}
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

export default ContentList;