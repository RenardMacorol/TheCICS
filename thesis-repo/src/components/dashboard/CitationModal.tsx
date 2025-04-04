import React, { useState } from "react";
import { Copy, X, Check, Link, ChevronDown } from 'lucide-react';
import Thesis from "../../service/Types/Thesis";



type CitationModalProps = {
  thesis: Thesis | null;
  isOpen: boolean;
  onClose: () => void;
};

type CopyState = {
  citation: boolean;
  link: boolean;
}

type CitationFormat = 'apa' | 'mla' | 'chicago';

const CitationModal = ({ thesis, isOpen, onClose }: CitationModalProps) => {
  const [copied, setCopied] = useState<CopyState>({
    citation: false,
    link: false
  });
  const [citationFormat, setCitationFormat] = useState<CitationFormat>('apa');
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  
  if (!isOpen || !thesis) return null;
  
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
  
  // Format last name, first initial with fallback for missing authorName
  const authorName = thesis.authorName || `Author ${thesis.authorID}`;
  const authorParts = authorName.split(' ');
  const lastName = authorParts.pop() || '';
  const firstInitial = authorParts.length > 0 ? authorParts[0].charAt(0) : '';
  const formattedAuthor = firstInitial ? `${lastName}, ${firstInitial}.` : lastName;
  
  // Citation formats here~
  const citations = {
    apa: `${formattedAuthor} (${thesis.publicationYear}). ${thesis.title} [Thesis]. TheCICS. ${thesis.pdfFileUrl}`,
    mla: `${lastName}, ${firstInitial ? firstInitial + '.' : ''} "${thesis.title}." TheCICS, ${thesis.publicationYear}. Web. ${formattedDate}.`,
    chicago: `${lastName}, ${firstInitial ? firstInitial + '.' : ''} "${thesis.title}." Thesis, TheCICS, ${thesis.publicationYear}. ${thesis.pdfFileUrl}.`
  };
  
  const formatLabels = {
    apa: "APA 7th Edition",
    mla: "MLA 9th Edition",
    chicago: "Chicago 17th Edition"
  };
  
  const handleCopy = (type: 'citation' | 'link') => {
    const textToCopy = type === 'citation' ? citations[citationFormat] : thesis.pdfFileUrl;
    navigator.clipboard.writeText(textToCopy);
    
    setCopied(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      setCopied(prev => ({ ...prev, [type]: false }));
    }, 2000);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFormatChange = (format: CitationFormat) => {
    setCitationFormat(format);
    setShowFormatDropdown(false);
  };
  
  return (
    <div 
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md transform transition-all animate-fadeIn">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Citation Options</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <div className="relative">
                <button 
                  onClick={() => setShowFormatDropdown(!showFormatDropdown)}
                  className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                >
                  {formatLabels[citationFormat]}
                  <ChevronDown size={16} className={`transition-transform duration-200 ${showFormatDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showFormatDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                    {(Object.keys(formatLabels) as CitationFormat[]).map(format => (
                      <button
                        key={format}
                        onClick={() => handleFormatChange(format)}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          format === citationFormat
                            ? 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        {formatLabels[format]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600 hover:border-violet-300 dark:hover:border-violet-500 transition-colors">
              <p className="text-gray-700 dark:text-gray-300 text-sm break-words">
                {citations[citationFormat]}
              </p>
            </div>
            <div className="mt-2 flex justify-end">
              <button 
                onClick={() => handleCopy('citation')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-all hover:shadow-md ${
                  copied.citation 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-violet-100 text-violet-700 hover:bg-violet-200 dark:bg-violet-900 dark:text-violet-200 dark:hover:bg-violet-800'
                }`}
              >
                {copied.citation ? <Check size={14} className="animate-pulse" /> : <Copy size={14} />}
                <span>{copied.citation ? 'Copied~💜' : 'Copy Citation'}</span>
              </button>
            </div>
          </div>
          
          <div className="group">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PDF Link</h4>
            <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600 group-hover:border-blue-300 dark:group-hover:border-blue-500 transition-colors flex items-center">
              <p className="text-gray-700 dark:text-gray-300 text-sm truncate flex-1">
                {thesis.pdfFileUrl}
              </p>
            </div>
            <div className="mt-2 flex justify-end">
              <button 
                onClick={() => handleCopy('link')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-all hover:shadow-md ${
                  copied.link 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800'
                }`}
              >
                {copied.link ? <Check size={14} className="animate-pulse" /> : <Link size={14} />}
                <span>{copied.link ? 'Yown, copied!' : 'Copy PDF Link'}</span>
              </button>
            </div>
          </div>
          
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Retrieved on {formattedDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CitationModal;

