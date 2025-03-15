import { useState } from 'react';
import { ChevronDown, Filter, SlidersHorizontal, Calendar, Tag, TrendingUp, Clock, ThumbsUp } from 'lucide-react'; //temporarilly removed Book

interface FilterButtonProps {
    onFilterChange?: (filters: { sort: string; year: string; keywords: string[] }) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({ onFilterChange }) => {
    const [showFilters, setShowFilters] = useState(false);
    const [activeSort, setActiveSort] = useState('newest');
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
    
    const years = ['2025', '2024', '2023', '2022', '2021', '2020'];
    const popularKeywords = ['Machine Learning', 'Computer Vision', 'Cybersecurity', 
        'Blockchain', 'AI', 'Cloud Computing', 'IoT', 'Mobile', 'Web Development'];
    
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
                </div>
                
                <button 
                    className="flex items-center gap-1 px-3 py-1.5 bg-aqua-100 text-aqua-700 rounded-full text-sm font-medium hover:bg-aqua-200 transition-colors"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <SlidersHorizontal size={16} />
                    <span>Filters</span>
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
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center mb-2">
                                <Tag size={16} className="mr-1 text-violet-500" />
                                Keywords
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {popularKeywords.map(keyword => (
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
                                ))}
                            </div>
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
                                {selectedKeywords.map(keyword => (
                                    <span key={keyword} className="bg-violet-50 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded-full text-xs flex items-center">
                                        {keyword}
                                        <button 
                                            className="ml-1 hover:text-violet-900 dark:hover:text-violet-100" 
                                            onClick={() => toggleKeyword(keyword)}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
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