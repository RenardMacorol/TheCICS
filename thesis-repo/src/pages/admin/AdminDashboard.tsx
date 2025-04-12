import { useEffect, useState } from "react";
import { supabase } from "../../service/supabase";
import { User } from "lucide-react";
import ThesisUpload from './ThesisUpload';
import { useNavigate } from "react-router-dom";
import Users from "../../service/Types/User";
import AdminNavTop from "../../components/dashboard/AdminNavTop";
import Thesis from "../../service/Types/Thesis";
import { UserManagementFacade } from "../../service/facade/UserManagementFacade";
import { FetchThesisAll } from "../../service/contentManagement/FetchThesisAll";
import { FetchUserAll } from "../../service/contentManagement/FetchUserAll";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student" });
  const [editingUser, setEditingUser] = useState<Users | null>(null);
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [loadingTheses, setLoadingTheses] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingThesis, setEditingThesis] = useState<Thesis | null>(null); // Added for thesis editing
  const userFacade = new UserManagementFacade();
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoadingTheses(true);
    setLoading(true);
    const fetchThesisAll = new FetchThesisAll();
    await fetchThesisAll.fetch();
    setTheses(fetchThesisAll.thesis);

    const fetchUserAll = new FetchUserAll();
    await fetchUserAll.fetch();
    setUsers(fetchUserAll.users);
    setLoadingTheses(false);
    setLoading(false);
  };

  const handleCreateUser = async () => {
    const { error } = await supabase.from("Users").insert([
      {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        googleAuthID: "manual-entry",
        profilePicture: null,
        dateRegistered: new Date().toISOString(),
      },
    ]);
    if (error) {
      console.error("Error adding user:", error);
    } else {
      fetchData();
      setNewUser({ name: "", email: "", role: "Student" });
    }
  };
  
  async function restrictUser(userID: string) {
    const success = await userFacade.handleRestrictUser(userID);
    if (success) {
        alert("User restricted successfully!");
    }
  }

  async function activateUser(userID: string) {
    const success = await userFacade.handleActivateUser(userID);
    if (success) {
        alert("User activated successfully!");
    }
  }
  
  async function updateUser(userID: string, newData: Partial<Users>) { 
    const success = await userFacade.handleUpdateUser(userID, newData);
    if (success) {
        alert("User updated successfully!");
    }
  }

  // Approve Thesis
  const handleApproveThesis = async (thesisID: string) => {
    console.log("🔄 Attempting to approve thesis with ID:", thesisID);
    const { data, error } = await supabase
      .from("Thesis")
      .update({ status: "Active" })
      .eq("thesisID", thesisID)
      .select();

    if (error) {
      console.error("❌ Error approving thesis:", error);
    } else {
      console.log("✅ Thesis approved successfully:", data);
      setTheses(theses.map((thesis) =>
        thesis.thesisID === thesisID ? { ...thesis, status: "Active" } : thesis
      ));
    }
  };

  // Restrict Thesis
  const handleRestrictThesis = async (thesisID: string) => {
    console.log("🔄 Attempting to restrict thesis with ID:", thesisID);
    const { data, error } = await supabase
      .from("Thesis")
      .update({ status: "Inactive" })
      .eq("thesisID", thesisID)
      .select();

    if (error) {
      console.error("❌ Error restricting thesis:", error);
    } else {
      console.log("✅ Thesis restricted successfully:", data);
      setTheses(theses.map((thesis) =>
        thesis.thesisID === thesisID ? { ...thesis, status: "Inactive" } : thesis
      ));
    }
  };

  // Edit Thesis
  const handleEditThesis = (thesis: Thesis) => {
    setEditingThesis(thesis);
  };

  // Update Thesis
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
      console.error("❌ Error updating thesis:", error);
    } else {
      console.log("✅ Thesis updated successfully");
      setTheses(theses.map((thesis) =>
        thesis.thesisID === editingThesis.thesisID
          ? { ...thesis, ...editingThesis }
          : thesis
      ));
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
    <div className="pt-24 p-5">
      <AdminNavTop userName="Admin" />
      
      <nav className="w-full fixed top-0 left-0 bg-[#06B8BE] text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/")} className="w-auto h-10 cursor-pointer">
            <img src="/TheCICSLogo.png" alt="TheCICS Logo" className="w-auto h-10 object-contain" />
          </button>
          <h1 className="text-2xl font-bold">Admin Dashboard - Manage Users</h1>
        </div>
        <div className="relative">
          <button className="relative p-1.5 hover:bg-[#5CE1E6] rounded-full transition-colors overflow-hidden">
            <User className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="w-full border border-gray-300 rounded-md shadow-md bg-white mt-5">
        <div className="bg-[#5CE1E6] p-4 border-b border-gray-300 text-left">
          <h2 className="text-2xl font-semibold text-gray-800 pl-4">User Management</h2>
        </div>

        <div className="p-6 flex justify-center border-b border-gray-300">
          <div className="flex flex-wrap items-center justify-center gap-3 bg-white shadow-md p-4 rounded-md border border-gray-300 w-full max-w-3xl">
            <input className="border border-gray-400 p-2 rounded-md w-60" type="text" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
            <input className="border border-gray-400 p-2 rounded-md w-60" type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
            <select className="border border-gray-400 p-2 rounded-md" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Admin">Admin</option>
            </select>
            <button className="bg-[#5CE1E6] hover:bg-[#06B8BE] text-white font-medium px-4 py-2 rounded-md" onClick={handleCreateUser}>Add User</button>
          </div>
        </div>

        {loading ? <p className="text-gray-500 p-4">Loading users...</p> : (
          <table className="w-full border-collapse border border-gray-300 bg-white text-gray-800 shadow-md mt-0">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">User ID</th>
                <th className="border border-gray-300 p-2">Name</th>
                <th className="border border-gray-300 p-2">Email</th>
                <th className="border border-gray-300 p-2">Role</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.userID} className="border border-gray-300">
                  <td className="border border-gray-300 p-2">{user.userID}</td>
                  <td className="border border-gray-300 p-2">{user.name}</td>
                  <td className="border border-gray-300 p-2">{user.email}</td>
                  <td className="border border-gray-300 p-2">{user.role}</td>
                  <td className="border border-gray-300 p-2 flex justify-center items-center gap-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => activateUser(user.userID)}
                    >
                      Active
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      onClick={() => setEditingUser(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => restrictUser(user.userID)}
                    >
                      Restrict
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-50">
          <div className="bg-white p-5 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800">Edit User</h2>
            <input
              className="border border-gray-300 p-2 m-2 rounded w-full"
              type="text"
              value={editingUser.name}
              onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            />
            <input
              className="border border-gray-300 p-2 m-2 rounded w-full"
              type="email"
              value={editingUser.email}
              onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
            />
            <select
              className="border border-gray-300 p-2 m-2 rounded w-full"
              value={editingUser.role}
              onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            >
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Admin">Admin</option>
            </select>
            <button
              className="bg-[#06B8BE] hover:bg-[#05A3A8] text-white p-2 rounded w-full mt-2"
              onClick={() => {
                if (editingUser) {
                  updateUser(editingUser.userID, {
                    name: editingUser.name,
                    email: editingUser.email,
                    role: editingUser.role
                  });
                  setEditingUser(null);
                }
              }} 
            >
              Save Changes
            </button>
            <button
              className="mt-2 bg-gray-500 hover:bg-gray-600 text-white p-2 rounded w-full"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between mt-5">
        <div className="w-1/2 pr-4">
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
        </div>

        <div className="w-1/2 pl-4">
          <ThesisUpload />
        </div>
      </div>

      {/* Edit Thesis Modal */}
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

export default AdminDashboard;