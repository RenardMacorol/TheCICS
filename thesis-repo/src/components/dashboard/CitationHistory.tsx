import { useEffect, useState } from "react";
import { supabase } from "../../service/supabase";
import { Copy, Quote, Check, Users } from 'lucide-react';

interface Citation {
  id: string;
  userID: string;
  thesisID: string;
  citationType: 'citation' | 'link';
  citationFormat?: 'apa' | 'mla' | 'chicago';
  citationText: string;
  timestamp: string;
  thesis: {
    thesisID: string;
    title: string;
    authorID: string;
    publicationYear: number;
    authorName?: string;
  };
}

interface CitationStats {
  uniqueUserCount: number;
  totalCitationCount: number;
}

interface Search {
  searchQuery: string;
  selectedFormat: string | null; // Add selectedFormat prop
}

const CitationHistory = ({ searchQuery, selectedFormat }: Search) => {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [citationStats, setCitationStats] = useState<Record<string, CitationStats>>({});
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({ id: user.id });
      }
    };
    fetchUser();
  }, []);

  // Fetch citation history and stats
  useEffect(() => {
    const fetchCitationHistory = async () => {
      setLoading(true);

      if (!currentUser) {
        setLoading(false);
        return;
      }

      // Fetch user's citations with thesis details
      const { data: citationData, error: citationError } = await supabase
        .from("UserCitations")
        .select(`
          id,
          userID,
          thesisID,
          citationType,
          citationFormat,
          citationText,
          timestamp,
          thesis:Thesis (
            thesisID,
            title,
            authorID,
            publicationYear,
            authorName
          )
        `)
        .eq('userID', currentUser.id)
        .order('timestamp', { ascending: false });

      if (citationError) {
        console.error("Error fetching citations:", citationError);
        setLoading(false);
        return;
      }

      // Normalize the thesis field (handle array vs. object)
      const normalizedCitations = (citationData || []).map(citation => {
        let normalizedThesis;
        if (Array.isArray(citation.thesis)) {
          normalizedThesis = citation.thesis[0] || {
            thesisID: citation.thesisID,
            title: "Unknown Thesis",
            authorID: "Unknown",
            publicationYear: 0,
          };
        } else {
          normalizedThesis = citation.thesis || {
            thesisID: citation.thesisID,
            title: "Unknown Thesis",
            authorID: "Unknown",
            publicationYear: 0,
          };
        }

        return {
          ...citation,
          thesis: normalizedThesis,
        };
      });

      // Fetch citation stats for each thesis
      const stats: Record<string, CitationStats> = {};
      for (const citation of normalizedCitations) {
        const { data: statsData, error: statsError } = await supabase
          .from("UserCitations")
          .select("userID", { count: "exact" })
          .eq('thesisID', citation.thesisID);

        if (statsError) {
          console.error("Error fetching citation stats:", statsError);
          continue;
        }

        const uniqueUserCount = new Set(statsData?.map(item => item.userID)).size;
        const totalCitationCount = statsData?.length || 0;

        stats[citation.thesisID] = {
          uniqueUserCount,
          totalCitationCount,
        };
      }

      setCitationStats(stats);
      setCitations(normalizedCitations);
      setLoading(false);
    };

    if (currentUser) {
      fetchCitationHistory();
    }
  }, [currentUser]);

  // Filter citations based on search query and selected format
  const filteredCitations = citations.filter(citation => {
    const matchesSearch = searchQuery
      ? citation.thesis.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesFormat = selectedFormat
      ? citation.citationFormat === selectedFormat
      : true;
    return matchesSearch && matchesFormat;
  });

  const handleCopy = async (citationId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [citationId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [citationId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy citation:', err);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-12 flex justify-center">
        <div className="animate-pulse flex flex-col space-y-4 w-full max-w-3xl">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-5 rounded-lg shadow-md h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-6 pb-12">
      {filteredCitations.length > 0 ? (
        filteredCitations.map((item) => (
          <div
            key={item.id}
            className="flex flex-col bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-indigo-500"
          >
            <div className="flex">
              {/* Thumbnail Preview */}
              <div className="w-24 h-24 bg-indigo-50 dark:bg-gray-700 flex items-center justify-center rounded-md overflow-hidden">
                <Quote size={32} className="text-indigo-400" />
              </div>

              {/* Main Content */}
              <div className="flex-1 px-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                  {item.thesis.title || "Unknown Thesis"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  By <span className="font-medium">{item.thesis.authorName || `Author ${item.thesis.authorID || "Unknown"}`}</span> • Published {item.thesis.publicationYear || "Unknown"}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md mb-2">
                  {item.citationText}
                </p>

                {/* Citation Stats */}
                {citationStats[item.thesisID] && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <Users size={14} />
                    <span>
                      {citationStats[item.thesisID].uniqueUserCount} unique {citationStats[item.thesisID].uniqueUserCount === 1 ? 'user has' : 'users have'} cited this thesis
                    </span>
                    <span>
                      • {citationStats[item.thesisID].totalCitationCount} total {citationStats[item.thesisID].totalCitationCount === 1 ? 'citation' : 'citations'}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    {item.citationFormat?.toUpperCase() || 'Link'} • Cited on {new Date(item.timestamp).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleCopy(item.id, item.citationText)}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      copiedStates[item.id]
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200'
                        : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-200 dark:hover:bg-indigo-800/60'
                    }`}
                  >
                    {copiedStates[item.id] ? <Check size={14} className="animate-pulse" /> : <Copy size={14} />}
                    <span>{copiedStates[item.id] ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Quote size={48} className="text-indigo-300 mb-3" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">No citations found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Citations you copy will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default CitationHistory;