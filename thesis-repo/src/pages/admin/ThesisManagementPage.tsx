// ThesisManagementPage.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../service/supabase";
import Thesis from "../../service/Types/Thesis";
import { FetchThesisAll } from "../../service/ContentManagement/FetchThesisAll";

const ThesisManagementPage = () => {
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [loadingTheses, setLoadingTheses] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingThesis, setEditingThesis] = useState<Thesis | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoadingTheses(true);
    const fetchThesisAll = new FetchThesisAll();
    await fetchThesisAll.fetch();
    setTheses(fetchThesisAll.thesis);
    setLoadingTheses(false);
  };

  const handleApproveThesis = async (thesisID: string) => {
    const { error } = await supabase
      .from("Thesis")
      .update({ status: "Active" })
      .eq("thesisID", thesisID);
    if (error) {
      console.error("Error approving thesis:", error);
    } else {
      fetchData();
    }
  };

  const handleRestrictThesis = async (thesisID: string) => {
    const { error } = await supabase
      .from("Thesis")
      .update({ status: "Inactive" })
      .eq("thesisID", thesisID);
    if (error) {
      console.error("Error restricting thesis:", error);
    } else {
      fetchData();
    }
  };

  const handleEditThesis = (thesis: Thesis) => {
    setEditingThesis(thesis);
  };

  const handleUpdateThesis = async () => {
    if (!editingThesis) return;

    const { error } = await supabase
      .from("Thesis")
      .update({
        title: editingThesis.title,
        abstract: editingThesis.abstract,
        keywords: editingThesis.keywords,
      })
      .eq("thesisID", editingThesis.thesisID);

    if (error) {
      console.error("Error updating thesis:", error);
    } else {
      fetchData();
      setEditingThesis(null);
    }
  };

  const filteredAndSortedTheses = theses
    .filter((thesis) => {
      const matchesSearch =
        thesis.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thesis.thesisID.toString().includes(searchQuery);

      const thesisStatus = thesis.status.toLowerCase();
      const filterStatusLower = filterStatus.toLowerCase();

      const matchesStatus =
        filterStatusLower === "all" ||
        (filterStatusLower === "active" && thesisStatus === "active") ||
        (filterStatusLower === "inactive" &&
          (thesisStatus === "inactive" || thesisStatus === "restricted"));

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const statusA = a.status.toLowerCase();
      const statusB = b.status.toLowerCase();

      if (statusA === "active" && statusB !== "active") return -1;
      if (statusA !== "active" && statusB === "active") return 1;
      return 0;
    });

  return (
    <div className="w-full pr-4">
      <div className="text-2xl font-semibold text-gray-800 p-4 bg-[#5CE1E6] border border-gray-300 rounded-t-md text-center">
        Thesis Management
      </div>

      <div className="flex justify-center items-center space-x-4 p-4 bg-white border-x border-b border-gray-300 rounded-b-md">
        <input
          type="text"
          placeholder="Search by title or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-3/4 p-2 border border-gray-300 rounded"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {loadingTheses ? (
        <p className="text-gray-500 p-4">Loading theses...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-2 bg-white text-black shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Thesis ID</th>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTheses.map((thesis) => (
              <tr
                key={thesis.thesisID}
                className="border border-gray-300 hover:bg-gray-50"
              >
                <td className="border border-gray-300 p-2">{thesis.thesisID}</td>
                <td className="border border-gray-300 p-2">{thesis.title}</td>
                <td className="border border-gray-300 p-2">{thesis.status}</td>
                <td className="border border-gray-300 p-2">
                  <div className="flex space-x-1">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded m-1"
                      onClick={() => handleApproveThesis(thesis.thesisID)}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded m-1"
                      onClick={() => handleRestrictThesis(thesis.thesisID)}
                    >
                      Restrict
                    </button>
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded m-1"
                      onClick={() => handleEditThesis(thesis)}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingThesis && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/30 backdrop-blur-md z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-2xl font-semibold">Edit Thesis</h2>
            <div className="mt-4">
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                value={editingThesis.title}
                onChange={(e) =>
                  setEditingThesis({ ...editingThesis, title: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Abstract</label>
              <textarea
                value={editingThesis.abstract}
                onChange={(e) =>
                  setEditingThesis({ ...editingThesis, abstract: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">Keywords</label>
              <input
                type="text"
                value={editingThesis.keywords}
                onChange={(e) =>
                  setEditingThesis({ ...editingThesis, keywords: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleUpdateThesis}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingThesis(null)}
                className="ml-2 bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThesisManagementPage;