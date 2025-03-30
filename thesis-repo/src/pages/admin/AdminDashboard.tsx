import { useEffect, useState } from "react";
import { supabase } from "../../api/supabase";
import { User } from "lucide-react";
import ThesisUpload from './ThesisUpload';
import { useNavigate } from "react-router-dom";
import Users from "../../service/Table/User";


interface User {
  userID: string;
  name: string;
  email: string;
  googleAuthID: string;
  role: string;
  profilePicture: string | null;
  dateRegistered: string;
  isActive: boolean; //active & deactivate
}

interface Thesis {
  thesisID: number;
  authorID: number;
  title: string;
  abstract: string;
  publicationYear: string;
  keywords: string;
  pdfFileUrl: string;
  status: "Active" | "Inactive"; // Based on ThesisStatusEnums
}


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student" });
  const [editingUser, setEditingUser] = useState<Users | null>(null);
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [loadingTheses, setLoadingTheses] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchTheses();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    console.log("Fetching users...");
    const { data, error } = await supabase.from("Users").select("*");
  
    if (error) {
      console.error("Error fetching users:", error);
    } else {
      console.log("✅ Fetched users:", data);
      setUsers(data || []);
    }
    setLoading(false);
  };

  const fetchTheses = async () => {
    setLoadingTheses(true);
    const { data, error } = await supabase.from("Thesis").select("*");
    if (error) console.error("Error fetching theses:", error);
    else setTheses(data || []);
    setLoadingTheses(false);
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
      fetchUsers();
      setNewUser({ name: "", email: "", role: "Student" });
    }
  };

  const handleRestrictUser = async (userID: string) => {
    //This should be restrict refactor soon
    console.log("Restricting", userID);
  
    console.log("Attempting to update user:", editingUser);
  
    const { error } = await supabase
      .from("Users")
      .update({
        accessType: "Restrict" 
      })
      .eq("userID", userID);
  
    if (error) {
      console.error("❌ Error updating user:", error);
    } else {
      console.log("✅ User updated successfully");
      fetchUsers();
      setEditingUser(null);
    } 
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
  
    console.log("Attempting to update user:", editingUser);
  
    const { error } = await supabase
      .from("Users")
      .update({
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
      })
      .eq("userID", editingUser.userID);
  
    if (error) {
      console.error("❌ Error updating user:", error);
    } else {
      console.log("✅ User updated successfully");
      fetchUsers();
      setEditingUser(null);
    }
  };

  // Approve Thesis
const handleApproveThesis = async (thesisID: number) => {
  console.log("🔄 Attempting to approve thesis with ID:", thesisID);
  const { data, error } = await supabase
    .from("Thesis")
    .update({ status: "Active" })
    .eq("thesisID", thesisID)
    .select(); // Fetch updated data after the operation

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
const handleRestrictThesis = async (thesisID: number) => {
  console.log("🔄 Attempting to restrict thesis with ID:", thesisID);
  const { data, error } = await supabase
    .from("Thesis")
    .update({ status: "Inactive" })
    .eq("thesisID", thesisID)
    .select(); // Fetch updated data

  if (error) {
    console.error("❌ Error restricting thesis:", error);
  } else {
    console.log("✅ Thesis restricted successfully:", data);
    setTheses(theses.map((thesis) =>
      thesis.thesisID === thesisID ? { ...thesis, status: "Inactive" } : thesis
    ));
  }
};

    // Delete Thesis
    const handleDeleteThesis = async (thesisID: number) => {
    console.log("🔄 Attempting to delete thesis with ID:", thesisID);

   const { error } = await supabase
    .from("Thesis")
    .delete()
    .match({ thesisID });

  if (error) {
    console.error("❌ Error deleting thesis:", error.message);
    alert("Failed to delete. Check Supabase RLS or constraints.");
    return;
  }

  console.log("✅ Thesis deleted successfully");

  // Filter out deleted thesis from the local state
  setTheses((prevTheses) => prevTheses.filter((thesis) => thesis.thesisID !== thesisID));
};

return (
  <div className="pt-24 p-5">
    {/* Navbar */}
    <nav className="w-full fixed top-0 left-0 bg-[#06B8BE] text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo & Title Wrapper */}
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate("/")} className="w-auto h-10 cursor-pointer">
          <img src="/TheCICSLogo.png" alt="TheCICS Logo" className="w-auto h-10 object-contain" />
        </button>
        <h1 className="text-2xl font-bold">Admin Dashboard - Manage Users</h1>
      </div>
      {/* Profile Button */}
      <div className="relative">
        <button className="relative p-1.5 hover:bg-[#5CE1E6] rounded-full transition-colors overflow-hidden">
          <User className="w-5 h-5" />
        </button>
      </div>
    </nav>

    {/* User Management */}
    <div className="w-full border border-gray-300 rounded-md shadow-md bg-white mt-5">
      <div className="bg-[#5CE1E6] p-4 border-b border-gray-300 text-left">
        <h2 className="text-2xl font-semibold text-gray-800 pl-4">User Management</h2>
      </div>

      {/* Add User Form */}
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

      {/* User List Table */}
      {loading ? <p className="text-gray-500 p-4">Loading users...</p> : (
        <table className="w-full border-collapse border border-gray-300 bg-white text-gray-800 shadow-md mt-0">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">User ID</th>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Email</th>
              <th className="border border-gray-300 p-2">Role</th>
              <th className="border border-gray-300 p-2">Status</th>
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
                <td className="border border-gray-300 p-2">{user.isActive ? "Active" : "Inactive"}</td>
                <td className="border border-gray-300 p-2 flex gap-2">
                  <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Active</button>
                  <button className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded">Deactivate</button>
                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded" onClick={() => setEditingUser(user)}>Edit</button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleRestrictUser(user.userID)}>Restrict</button>
                </td>
            </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
        {/* Edit User Section */}
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
        onClick={handleUpdateUser}
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
           {/* Thesis Management & Upload */}
            <div className="flex justify-between mt-5">
          {/* Left: Manage Theses */}
            <div className="w-1/2 pr-4">
           
          {loadingTheses ? (
          <p className="text-gray-500">Loading theses...</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300 mt-2 bg-white text-black shadow-md rounded-md">

          {/* Title Inside the Table */}
             <caption className="text-2xl font-semibold text-gray-800 p-4 bg-[#5CE1E6] border border-gray-300">
              Thesis Management
             </caption>
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Thesis ID</th>
                <th className="border border-gray-300 p-2">Title</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {theses.map((thesis) => (
                <tr key={thesis.thesisID} className="border border-gray-300 hover:bg-gray-50">
                  <td className="border border-gray-300 p-2">{thesis.thesisID}</td>
                  <td className="border border-gray-300 p-2">{thesis.title}</td>
                  <td className="border border-gray-300 p-2">{thesis.status}</td>
                  <td className="border border-gray-300 p-2">
                  <div className="flex space-x-1">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded m-1" onClick={() => handleApproveThesis(thesis.thesisID)}>Approve</button>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded m-1" onClick={() => handleRestrictThesis(thesis.thesisID)}>Restrict</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded m-1" onClick={() => handleDeleteThesis(thesis.thesisID)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Right: Upload Thesis */}
      <div className="w-1/2 pl-4">
        <ThesisUpload />
      </div>
    </div>
  </div>
);
};

export default AdminDashboard;





