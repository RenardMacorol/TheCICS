import { useState, useEffect } from 'react';
import { ChevronDown, Filter, SlidersHorizontal, Calendar, Tag, TrendingUp, Clock, ThumbsUp, X } from 'lucide-react';
import { supabase } from '../../api/supabase';

interface FilterButtonProps {
    onFilterChange?: (filters: { sort: string; year: string; keywords: string[] }) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onFilterChange }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [activeSort, setActiveSort] = useState('newest');
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    const [popularKeywords, setPopularKeywords] = useState<string[]>([]);
    const [allKeywords, setAllKeywords] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showAllKeywords, setShowAllKeywords] = useState(false);
    
    const years = ['2025', '2024', '2023', '2022', '2021', '2020'];
    
    useEffect(() => {
        const fetchKeywords = async () => {
            setIsLoading(true);
            
            try {
                const { data, error } = await supabase
                    .from("Thesis")
                    .select("keywords")
                    .eq('status', 'Active');
                
                if (error) {
                    console.error("Error fetching keywords:", error);
                    return;
                }
                
                let extractedKeywords: string[] = [];
                data.forEach(thesis => {
                    if (thesis.keywords) {
                        const thesisKeywords = thesis.keywords
                            .split(',')
                            .map((k: string) => k.trim())
                            .filter((k: string) => k);
                            
                        extractedKeywords = [...extractedKeywords, ...thesisKeywords];
                    }
                });
                
                const keywordCount: Record<string, number> = {};
                extractedKeywords.forEach(keyword => {
                    keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
                });
                
                const sortedKeywords = Object.entries(keywordCount)
                    .sort((a, b) => b[1] - a[1])
                    .map(entry => entry[0]);
                
                setAllKeywords([...new Set(extractedKeywords)].sort());
                
                setPopularKeywords(sortedKeywords.slice(0, 12));
            } catch (error) {
                console.error("Error processing keywords:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchKeywords();
    }, []);
    
    const handleSortChange = (sort: string) => {
        setActiveSort(sort);
        onFilterChange?.({ sort, year: selectedYear, keywords: selectedKeywords });
    };
    
    const handleYearChange = (year: string) => {
        setSelectedYear(year);
        onFilterChange?.({ sort: activeSort, year, keywords: selectedKeywords });
    };
    
    const toggleKeyword = (keyword: string) => {
        let newKeywords;
        if (selectedKeywords.includes(keyword)) {
            newKeywords = selectedKeywords.filter(k => k !== keyword);
        } else {
            newKeywords = [...selectedKeywords, keyword];
        }
        setSelectedKeywords(newKeywords);
        onFilterChange?.({ sort: activeSort, year: selectedYear, keywords: newKeywords });
    };

    const displayedKeywords = showAllKeywords ? allKeywords : popularKeywords;

    return (
        <div className="px-6 py-4">
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    <button 
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                            activeSort === 'newest' 
                                ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => handleSortChange('newest')}
                    >
                        <Clock size={16} />
                        <span>Newest</span>
                    </button>
                    <button 
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                            activeSort === 'popular' 
                                ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => handleSortChange('popular')}
                    >
                        <TrendingUp size={16} />
                        <span>Popular</span>
                    </button>
                    <button 
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                            activeSort === 'recommended' 
                                ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => handleSortChange('recommended')}
                    >
                        <ThumbsUp size={16} />
                        <span>Recommended</span>
                    </button>
                    <button 
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                            activeSort === 'keywords' 
                                ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200' 
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        onClick={() => handleSortChange('keywords')}
                    >
                        <Tag size={16} />
                        <span>Keywords</span>
                    </button>
                </div>
                
                <button 
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                    ${selectedKeywords.length > 0 
                        ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200' 
                        : 'bg-violet-200 text-violet-800 hover:bg-violet-300 dark:bg-violet-800 dark:text-violet-300 dark:hover:bg-violet-700'}`}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal size={16} />
                    <span>Filters {selectedKeywords.length > 0 ? `(${selectedKeywords.length})` : ''}</span>
                    <ChevronDown 
                        size={16} 
                        className={`transition-transform ${showFilters ? 'transform rotate-180' : ''}`} 
                    />
                </button>
            </div>
            
            {/* Expandable Filter Panel */}
            {showFilters && (
                <div className="mt-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Year Filter */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-2">
                                <Calendar size={16} className="mr-1 text-violet-500" />
                                Publication Year
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                        selectedYear === 'all' 
                                            ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200' 
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                    onClick={() => handleYearChange('all')}
                                >
                                    All Years
                                </button>
                                {years.map(year => (
                                    <button
                                        key={year}
                                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                            selectedYear === year 
                                                ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200' 
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }`}
                                        onClick={() => handleYearChange(year)}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Keywords Filter */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                                    <Tag size={16} className="mr-1 text-violet-500" />
                                    Keywords {selectedKeywords.length > 0 && `(${selectedKeywords.length} selected)`}
                                </h3>
                                {allKeywords.length > popularKeywords.length && (
                                    <button 
                                        className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
                                        onClick={() => setShowAllKeywords(!showAllKeywords)}
                                    >
                                        {showAllKeywords ? "Show less" : "Show all"}
                                    </button>
                                )}
                            </div>
                            
                            {isLoading ? (
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div 
                                            key={i} 
                                            className="px-3 py-1 text-xs rounded-full animate-pulse bg-gray-200 dark:bg-gray-600 w-20 h-6"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {/* Selected Keywords (if any) */}
                                    {selectedKeywords.length > 0 && (
                                        <div className="mb-2 p-2 bg-violet-50 dark:bg-violet-900/30 rounded-md">
                                            <div className="flex flex-wrap gap-1">
                                                {selectedKeywords.map(keyword => (
                                                    <div
                                                        key={`selected-${keyword}`}
                                                        className="bg-violet-100 dark:bg-violet-800 text-violet-700 dark:text-violet-200 text-xs rounded-full px-2 py-1 flex items-center"
                                                    >
                                                        {keyword}
                                                        <button
                                                            className="ml-1 hover:text-violet-900 dark:hover:text-violet-100"
                                                            onClick={() => toggleKeyword(keyword)}
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Available Keywords */}
                                    <div className="max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                                        <div className="flex flex-wrap gap-2">
                                            {displayedKeywords.length > 0 ? (
                                                displayedKeywords.map(keyword => (
                                                    <button
                                                        key={keyword}
                                                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                                                            selectedKeywords.includes(keyword) 
                                                                ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-200' 
                                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                        }`}
                                                        onClick={() => toggleKeyword(keyword)}
                                                    >
                                                        {keyword}
                                                    </button>
                                                ))
                                            ) : (
                                                <p className="text-xs text-gray-500 dark:text-gray-400">No keywords available</p>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    
                    {/* Active Filters Display */}
                    {(selectedYear !== 'all' || selectedKeywords.length > 0) && (
                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 flex-wrap gap-2">
                                <Filter size={14} className="mr-1" />
                                <span>Active filters:</span>
                                {selectedYear !== 'all' && (
                                    <span className="bg-violet-50 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full text-xs flex items-center">
                                        Year: {selectedYear}
                                        <button 
                                            className="ml-1 hover:text-violet-900 dark:hover:text-violet-100" 
                                            onClick={() => handleYearChange('all')}
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {selectedKeywords.length > 0 && (
                                    <span className="bg-violet-50 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full text-xs flex items-center">
                                        Keywords: {selectedKeywords.length}
                                    </span>
                                )}
                                <button
                                    className="ml-auto text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                    onClick={() => {
                                        setSelectedYear('all');
                                        setSelectedKeywords([]);
                                        onFilterChange?.({ sort: activeSort, year: 'all', keywords: [] });
                                    }}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FilterButton;