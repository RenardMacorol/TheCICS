import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../service/supabase";
import Thesis from "../../service/Types/Thesis";
import { Copy, Quote } from "lucide-react";
import { CitationFormat, generateCitation, recordCitation } from "../../service/citation/citationUtils";
import { FetchAuthor } from "../../service/ContentManagement/FetchAuthors";
import { FetchBookmarkThesis } from "../../service/ContentManagement/FetchBookMarkThesis";

interface Citation {
  id: string;
  userID: string;
  thesisID: string;
  citationType: "citation" | "link";
  citationFormat?: "apa" | "mla" | "chicago";
  citationText: string;
  timestamp: string;
}

const CitationHistory = () => {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(true);
  const [thesis, setThesis] = useState<Thesis[]>([]);
  const [authors, setAuthors] = useState<Record<string, string>>({});
  const [selectedThesis, setSelectedThesis] = useState<Thesis | null>(null);
  const [copiedFormat, setCopiedFormat] = useState<CitationFormat | null>(null);

  const citationMap = useMemo(() => {
    const map: Record<string, string> = {};
    citations.forEach((c) => {
      map[c.thesisID] = c.citationText;
    });
    return map;
  }, [citations]);

  useEffect(() => {
    const fetchBookmarkedTheses = async () => {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
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
      setThesis(theses);
      setCitations(citationData as Citation[]);
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

    fetchAuthors();
    fetchBookmarkedTheses();
  }, []);

  const handleCopy = async (thesis: Thesis, format: CitationFormat) => {
    try {
      const citationText = generateCitation(thesis, format);
      await navigator.clipboard.writeText(citationText);
      setCopiedFormat(format);
      setTimeout(() => {
        setCopiedFormat(null);
      }, 2000);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        recordCitation(thesis.thesisID, user.id, 'citation', format);
      }
    } catch (err) {
      console.error("Failed to copy citation:", err);
    }
  };

  const openCitationModal = (thesis: Thesis) => {
    setSelectedThesis(thesis);
  };

  const closeCitationModal = () => {
    setSelectedThesis(null);
    setCopiedFormat(null);
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

                {citationMap[item.thesisID] && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md mb-2">
                    {citationMap[item.thesisID]}
                  </p>
                )}

                <div className="flex items-center justify-end text-sm text-gray-500 dark:text-gray-400">
                  <button
                    onClick={() => openCitationModal(item)}
                    className="flex items-center gap-1 px-3 py-1 rounded-md text-sm font-medium transition-all bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-200 dark:hover:bg-indigo-800/60"
                  >
                    <Copy size={14} />
                    <span>Copy</span>
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

        {selectedThesis && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-lg flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Citation Options
              </h3>
              <button onClick={closeCitationModal} className="text-gray-500 dark:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              {["apa", "mla", "chicago"].map((format) => (
                <button
                  key={format}
                  onClick={() => handleCopy(selectedThesis, format as CitationFormat)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    copiedFormat === format
                      ? "bg-green-100 text-green-700 dark:bg-green-900/60 dark:text-green-200"
                      : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-200 dark:hover:bg-indigo-800/60"
                  }`}
                >
                  {copiedFormat === format ? "Copied!" : format.toUpperCase()}
                </button>
              ))}
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md mb-4">
              {generateCitation(selectedThesis, copiedFormat || "apa")}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Retrieved on {new Date().toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Citation formats may vary slightly depending on specific requirements
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitationHistory;