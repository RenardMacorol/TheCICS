import React, { useState, useEffect, useCallback } from "react";
import { Copy, X, Check, BookOpen, Users, Sparkles } from 'lucide-react'; // Added Sparkles icon
import { supabase } from "../../service/supabase";
import {
  CitationModalProps,
  CitationFormat,
  CopyState,
  CitationStats,
  formatLabels,
  formatDescriptions,
  generateCitation,
  getCurrentFormattedDate,
  fetchCitationStats as fetchStats,
  recordCitation as recordCitationAction
} from "../../service/Citation/citationUtils";

const CitationModal = ({ thesis, isOpen, onClose }: CitationModalProps) => {
  const [copied, setCopied] = useState<CopyState>({
    citation: false,
    link: false
  });
  const [citationFormat, setCitationFormat] = useState<CitationFormat>('apa');
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [citationStats, setCitationStats] = useState<CitationStats>({
    uniqueUserCount: 0,
    totalCitationCount: 0,
    hasUserCited: false // Added this property
  });
  
  // Fetch current user on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({ id: user.id });
      }
    };
    
    fetchUser();
  }, []);

  // Fetch citation stats when thesis changes or modal opens
  const fetchCitationStats = useCallback(async () => {
    if (!thesis?.thesisID || !isOpen) return;
    
    // Pass the current user ID to check if they've cited before
    const stats = await fetchStats(thesis.thesisID, currentUser?.id || null);
    setCitationStats(stats);
  }, [thesis?.thesisID, isOpen, currentUser?.id]);
  
  useEffect(() => {
    if (thesis?.thesisID && isOpen) {
      fetchCitationStats();
    }
  }, [thesis?.thesisID, isOpen, fetchCitationStats]);
  
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isOpen, onClose]);
  
  if (!isOpen || !thesis) return null;
  
  const thesisLink = `https://the-cics.vercel.app/thesis/${thesis.thesisID}`;
  const formattedDate = getCurrentFormattedDate();
  const citationText = generateCitation(thesis, citationFormat);
  
  const handleCopy = async (type: 'citation' | 'link') => {
    const textToCopy = type === 'citation' ? citationText : thesisLink;
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }));
      }, 2000);
      
      // Record the citation action
      await recordCitationAction(
        thesis.thesisID!, 
        currentUser?.id || null, 
        type, 
        type === 'citation' ? citationFormat : undefined
      );
      
      // Refresh stats after recording
      await fetchCitationStats();
      
    } catch (err) {
      console.error('Failed to copy to clipboard or record citation:', err);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFormatChange = (format: CitationFormat) => {
    setCitationFormat(format);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md transform transition-all animate-fadeIn border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-violet-600 dark:text-violet-400" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Citation Options</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Citation Stats */}
          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-violet-600 dark:text-violet-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {citationStats.uniqueUserCount} unique {citationStats.uniqueUserCount === 1 ? 'user has' : 'users have'} cited this thesis
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {citationStats.totalCitationCount} total {citationStats.totalCitationCount === 1 ? 'citation' : 'citations'}
            </span>
          </div>
          
          {/* User has cited notification - NEW COMPONENT */}
          {citationStats.hasUserCited && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 animate-fadeIn">
              <Sparkles size={16} className="text-indigo-500 dark:text-indigo-400" />
              <p className="text-sm">
                You've already cited this thesis! Wowowow!
              </p>
            </div>
          )}
          
          {/* Format Selection Tabs */}
          <div className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
            {(Object.keys(formatLabels) as CitationFormat[]).map(format => (
              <button
                key={format}
                onClick={() => handleFormatChange(format)}
                className={`flex-1 py-2.5 px-3 text-sm font-medium transition-colors ${
                  format === citationFormat
                    ? 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {format.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* Format description */}
          <p className="text-xs text-gray-500 dark:text-gray-400 italic">
            {formatDescriptions[citationFormat]}
          </p>
          
          {/* Citation Content Box */}
          <div className="relative">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md border border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-500 transition-colors">
              <p className="text-gray-700 dark:text-gray-300 text-sm break-words leading-relaxed">
                {citationText}
              </p>
            </div>
            <div className="mt-3 flex justify-end">
              <button 
                onClick={() => handleCopy('citation')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  copied.citation 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200' 
                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/50 dark:text-violet-200 dark:hover:bg-violet-800/60 shadow-sm hover:shadow'
                }`}
              >
                {copied.citation ? <Check size={16} className="animate-pulse" /> : <Copy size={16} />}
                <span>{copied.citation ? 'Copied!' : 'Copy Citation'}</span>
              </button>
            </div>
          </div>
          
          <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Retrieved on {formattedDate}
            </p>
          </div>
          
          {/* ‼️‼️Will not add this kasi github nalang siguro 'to? or ewan mag ask nalang latur */}
          {/* Link section */}
          {/* <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <LinkIcon size={16} className="text-violet-600 dark:text-violet-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Direct Link</span>
              </div>
              <button 
                onClick={() => handleCopy('link')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all hover:shadow ${
                  copied.link 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200' 
                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900/50 dark:text-violet-200 dark:hover:bg-violet-800/60'
                }`}
              >
                {copied.link ? <Check size={14} className="animate-pulse" /> : <Copy size={14} />}
                <span>{copied.link ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600">
              <p className="text-gray-700 dark:text-gray-300 text-sm break-words font-mono">
                {thesisLink}
              </p>
            </div>
          </div> */}
        </div>
        
        {/* Footer with info */}
        <div className="px-5 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Citation formats may vary slightly depending on specific requirements
          </p>
        </div>
      </div>
    </div>
  );
};

export default CitationModal;