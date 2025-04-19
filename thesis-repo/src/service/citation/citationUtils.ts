import Thesis from "../Types/Thesis";
import { supabase } from "../supabase";

export type CitationFormat = 'apa' | 'mla' | 'chicago';

export type CopyState = {
  citation: boolean;
  link: boolean;
}

export type CitationStats = {
  uniqueUserCount: number;
  totalCitationCount: number;
}

export type CitationModalProps = {
  thesis: Thesis | null;
  isOpen: boolean;
  onClose: () => void;
};

export const formatLabels = {
  apa: "APA 7th Edition",
  mla: "MLA 9th Edition",
  chicago: "Chicago 17th Edition"
};

export const formatDescriptions = {
  apa: "Author-date citation style used in social sciences",
  mla: "Common in humanities, especially language and literature",
  chicago: "Flexible style often used in history and arts"
};

// Generate citation text based on thesis data and format
export const generateCitation = (thesis: Thesis, format: CitationFormat): string => {
  const thesisLink = `https://the-cics.vercel.app/thesis/${thesis.thesisID}`;
  
  // Format author name
  const authorName = thesis.authorName || `Author ${thesis.authorID}`;
  const authorParts = authorName.split(' ');
  const lastName = authorParts.pop() || '';
  const firstInitial = authorParts.length > 0 ? authorParts[0].charAt(0) : '';
  const formattedAuthor = firstInitial ? `${lastName}, ${firstInitial}.` : lastName;
  
  // Get current date for MLA format
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
  
  // Citations in different formats
  switch(format) {
    case 'apa':
      return `${formattedAuthor} (${thesis.publicationYear}). ${thesis.title} [Thesis]. TheCICS. ${thesisLink}`;
    case 'mla':
      return `${lastName}, ${firstInitial ? firstInitial + '.' : ''} "${thesis.title}." TheCICS, ${thesis.publicationYear}. Web. ${formattedDate}.`;
    case 'chicago':
      return `${lastName}, ${firstInitial ? firstInitial + '.' : ''} "${thesis.title}." Thesis, TheCICS, ${thesis.publicationYear}. ${thesisLink}.`;
    default:
      return `${formattedAuthor} (${thesis.publicationYear}). ${thesis.title}. TheCICS.`;
  }
};

// Get formatted current date
export const getCurrentFormattedDate = (): string => {
  const currentDate = new Date();
  return `${currentDate.toLocaleString('default', { month: 'long' })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
};

// Fetch citation statistics
export const fetchCitationStats = async (thesisID: string): Promise<CitationStats> => {
  if (!thesisID) {
    return { uniqueUserCount: 0, totalCitationCount: 0 };
  }
  
  try {
    // Get all citation records for this thesis
    const { data: allCitations, error: fetchError } = await supabase
      .from('ThesisCitationCount')
      .select('userID')
      .eq('thesisID', thesisID);
    
    if (fetchError) {
      console.error('Error fetching citation data:', fetchError);
      return { uniqueUserCount: 0, totalCitationCount: 0 };
    }
    
    // Count total citations (Ano 'to per click ng user wahahhaha)
    const totalCount = allCitations?.length || 0;
    
    // Count unique users (filter out null userIDs and count unique values)
    const validUserIDs = allCitations
      ?.filter(citation => citation.userID !== null)
      .map(citation => citation.userID) || [];
    
    const uniqueUserIDs = [...new Set(validUserIDs)];
    const uniqueCount = uniqueUserIDs.length;
    
    return {
      uniqueUserCount: uniqueCount,
      totalCitationCount: totalCount
    };
  } catch (err) {
    console.error('Failed to fetch citation statistics:', err);
    return { uniqueUserCount: 0, totalCitationCount: 0 };
  }
};

// Record citation activity
export const recordCitation = async (
  thesisID: string,
  userID: string | null,
  type: 'citation' | 'link',
  citationFormat?: CitationFormat
): Promise<boolean> => {
  try {
    const { error: insertError } = await supabase
      .from('ThesisCitationCount')
      .insert({
        thesisID: thesisID,
        userID: userID || null,
        citationFormat: type === 'citation' ? citationFormat : null,
        citationType: type,
        copiedAt: new Date().toISOString()
      });
      
    if (insertError) {
      console.error('Error recording citation:', insertError);
      return false;
    }
    
    console.log(`Citation recorded successfully. Type: ${type}, User: ${userID || 'anonymous'}`);
    return true;
  } catch (err) {
    console.error('Failed to record citation:', err);
    return false;
  }
};