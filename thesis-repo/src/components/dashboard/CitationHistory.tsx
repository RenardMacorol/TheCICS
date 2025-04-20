import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../service/supabase";
import { Copy, Quote, Check, Users } from "lucide-react";
import Thesis from "../../service/Types/Thesis";
import { FetchBookmarkThesis } from "../../service/ContentManagement/FetchBookMarkThesis";
import { FetchAuthor } from "../../service/ContentManagement/FetchAuthors";

interface Citation {
  id: string;
  userID: string;
  thesisID: string;
  citationType: "citation" | "link";
  citationFormat?: "apa" | "mla" | "chicago";
  citationText: string;
  timestamp: string;
}

interface CitationStats {
  [thesisID: string]: {
    uniqueUserCount: number;
    totalCitationCount: number;
  };
}

const CitationHistory = () => {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);
  const [thesis, setThesis] = useState<Thesis[]>([]);
  const [authors, setAuthors] = useState<Record<string, string>>({});
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});
  const [citationStats, setCitationStats] = useState<CitationStats>({});

  // Memoized map for quick citationText lookup by thesisID
  const citationMap = useMemo(() => {
    const map: Record<string, string> = {};
    citations.forEach((c) => {
      map[c.thesisID] = c.citationText;
    });
    return map;
  }, [citations]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchBookmarkedTheses();
      await fetchAuthors();
    };

    fetchData();
  }, []);

  const fetchBookmarkedTheses = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data: citationData, error: citationError } = await supabase
      .from("ThesisCitationCount")
      .select("*")
      .eq("userID", user.id);

    if (citationError) {
      console.error("Error fetching citations:", citationError);
      setLoading(false);
      return;
    }

    const citationsId = citationData?.map((b) => b.thesisID) || [];

    if (citationsId.length === 0) {
      setCitations([]);
      setLoading(false);
      return;
    }

    const citationFetch = new FetchBookmarkThesis(citationsId);
    const theses = await citationFetch.fetch();

    const stats: CitationStats = {};
    citationData.forEach((citation) => {
      if (!stats[citation.thesisID]) {
        stats[citation.thesisID] = {
          uniqueUserCount: 0,
          totalCitationCount: 0,
        };
      }
      stats[citation.thesisID].totalCitationCount += 1;
      stats[citation.thesisID].uniqueUserCount = 1; // Dummy for now
    });

    setCitationStats(stats);
    setCitations(citationData as Citation[]);
    setThesis(theses);
    setLoading(false);
  };

  const fetchAuthors = async () => {
    const fetcher = new FetchAuthor();
    const result = await fetcher.fetch();
    const map: Record<string, string> = {};
    result.forEach((author) => {
      map[author.authorID] = `${author.firstName} ${author.lastName}`;
    });
    setAuthors(map);
  };

  const handleCopy = async (citationId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [citationId]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [citationId]: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy citation:", err);
    }
  };

  if (loading) {
    return (
      <div className="px-6 py-12 flex justify-center">
        <div className="animate-pulse flex flex-col space-y-4 w-full max-w-3xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-5 rounded-lg shadow-md h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 space-y-6 pb-12">
      {thesis.length > 0 ? (
        thesis.map((item) => (
          <div
            key={item.thesisID}
            className="flex flex-col bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-indigo-500"
          >
            <div className="flex">
              <div className="w-24 h-24 bg-indigo-50 dark:bg-gray-700 flex items-center justify-center rounded-md overflow-hidden">
                <Quote size={32} className="text-indigo-400" />
              </div>
              <div className="flex-1 px-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                  {item.title || "Unknown Thesis"}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  By{" "}
                  <span className="font-medium">
                    {item.authorName || authors[item.authorID] || "Unknown Author"}
                  </span>{" "}
                  • Published {item.publicationYear || "Unknown"}
                </p>

                {/* Use citation from citationMap */}
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md mb-2">
                  {citationMap[item.thesisID] || "No citation available"}
                </p>

                {citationStats[item.thesisID] && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <Users size={14} />
                    <span>
                      {citationStats[item.thesisID].uniqueUserCount} unique{" "}
                      {citationStats[item.thesisID].uniqueUserCount === 1
                        ? "user has"
                        : "users have"}{" "}
                      cited this thesis
                    </span>
                    <span>
                      • {citationStats[item.thesisID].totalCitationCount} total{" "}
                      {citationStats[item.thesisID].totalCitationCount === 1
                        ? "citation"
                        : "citations"}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    {citations.find((c) => c.thesisID === item.thesisID)?.citationFormat?.toUpperCase() ||
                      "Link"}{" "}
                    • Cited on{" "}
                    {new Date(
                      citations.find((c) => c.thesisID === item.thesisID)?.timestamp || ""
                    ).toLocaleString() || "N/A"}
                  </span>
                  <button
                    onClick={() => handleCopy(item.thesisID, citationMap[item.thesisID])}
                    className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-all ${
                      copiedStates[item.thesisID]
                        ? "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-200 dark:hover:bg-indigo-800/60"
                    }`}
                  >
                    {copiedStates[item.thesisID] ? (
                      <Check size={14} className="animate-pulse" />
                    ) : (
                      <Copy size={14} />
                    )}
                    <span>{copiedStates[item.thesisID] ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Quote size={48} className="text-indigo-300 mb-3" />
          <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
            No citations found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Citations you copy will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default CitationHistory;
