import { useEffect, useState } from "react";
import { supabase } from "../../api/supabase";
import { BookOpen, Github, Star, StarOff, Eye, ThumbsUp, MessageSquare, Share2, Pencil } from "lucide-react"; //temporarilly removed Download and View

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

const ContentList = () => {
    const [items, setItems] = useState<Thesis[]>([]);
    const [bookmarks, setBookmarks] = useState<string[]>([]);
    const [expandedAbstracts, setExpandedAbstracts] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTheses = async () => {
            setLoading(true);
            
            // Fetch theses
            const { data: thesesData, error: thesesError } = await supabase
                .from("Thesis")
                .select("*")
                .eq('status', 'Active');

            if (thesesError) {
                console.error("Error fetching theses:", thesesError);
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
            
            console.log("Fetched theses: ", enhancedData);
            setItems(enhancedData);
            setLoading(false);
        };

        // Fetch user bookmarks
        const fetchBookmarks = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from("UserBookmarks")
                    .select("thesisID")
                    .eq('userID', user.id);
                
                if (!error && data) {
                    setBookmarks(data.map(item => item.thesisID));
                }
            }
        };

        fetchTheses();
        fetchBookmarks();
    }, []); 
    
    const toggleAbstract = (thesisID: string) => {
        setExpandedAbstracts(prev => ({
            ...prev,
            [thesisID]: !prev[thesisID]
        }));
    };

    const toggleBookmark = async (thesisID: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const isBookmarked = bookmarks.includes(thesisID);
        
        if (isBookmarked) {
            // Remove bookmark
            await supabase
                .from("UserBookmarks")
                .delete()
                .match({ userID: user.id, thesisID });
            
            setBookmarks(bookmarks.filter(id => id !== thesisID));
        } else {
            // Add bookmark
            await supabase
                .from("UserBookmarks")
                .insert({ userID: user.id, thesisID });
            
            setBookmarks([...bookmarks, thesisID]);
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
            {items.map((item) => (
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
                                    aria-label={bookmarks.includes(item.thesisID) ? "Remove bookmark" : "Add bookmark"}
                                >
                                    {bookmarks.includes(item.thesisID) ? 
                                        <Star className="w-5 h-5 text-aqua-400 fill-aqua-400" /> : 
                                        <StarOff className="w-5 h-5 text-gray-400" />
                                    }
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
                            <button className="flex items-center gap-1 bg-aqua-100 text-aqua-700 rounded-full px-3 py-1 text-sm hover:bg-aqua-200 transition-colors">
                                <Pencil size={16} />
                                <span>View</span>
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            
            {/* Empty State */}
            {items.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen size={48} className="text-violet-300 mb-3" />
                    <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">No theses found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your filters or check back later</p>
                </div>
            )}
        </div>
    );
};

export default ContentList;