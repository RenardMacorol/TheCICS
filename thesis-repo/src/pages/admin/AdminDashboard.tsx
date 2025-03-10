import { useEffect, useState } from "react";
import { supabase } from "../../api/supabase";
import { User } from "lucide-react";

interface User {
  userID: string;
  name: string;
  email: string;
  googleAuthID: string;
  role: string;
  profilePicture: string | null;
  dateRegistered: string;
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
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student" });
  const [editingUser, setEditingUser] = useState<User | null>(null);
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

  const handleDeleteUser = async (userID: string) => {
    console.log("Attempting to delete user with ID:", userID);
    
    const { error } = await supabase.from("Users").delete().eq("userID", userID);
  
    if (error) {
      console.error("❌ Error deleting user:", error);
    } else {
      console.log("✅ User deleted successfully");
      fetchUsers();
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
    .eq("thesisID", thesisID);

  if (error) {
    console.error("❌ Error deleting thesis:", error);
  } else {
    console.log("✅ Thesis deleted successfully");
    setTheses(theses.filter((thesis) => thesis.thesisID !== thesisID));
  }
};
  
  
  
  
  

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Manage Users</h1>

      {/* Add User */}
      <div className="mb-5 p-3 border rounded">
        <h2 className="text-xl font-semibold">Add New User</h2>
        <input className="border p-2 m-2" type="text" placeholder="Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
        <input className="border p-2 m-2" type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        <select className="border p-2 m-2" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
          <option value="Student">Student</option>
          <option value="Faculty">Faculty</option>
          <option value="Admin">Admin</option>
        </select>
        <button className="bg-green-500 text-white p-2 rounded" onClick={handleCreateUser}>Add User</button>
      </div>

      {/* User List */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userID} className="border">
                <td className="border p-2">{user.userID}</td>
                <td className="border p-2">{user.name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">
                  <button className="bg-yellow-500 text-white p-1 rounded m-1" onClick={() => setEditingUser(user)}>Edit</button>
                  <button className="bg-red-500 text-white p-1 rounded m-1" onClick={() => handleDeleteUser(user.userID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit User */}
      {editingUser && (
        <div className="mt-5 p-3 border rounded">
          <h2 className="text-xl font-semibold">Edit User</h2>
          <input className="border p-2 m-2" type="text" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} />
          <input className="border p-2 m-2" type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} />
          <select className="border p-2 m-2" value={editingUser.role} onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}>
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="Admin">Admin</option>
          </select>
          <button className="bg-blue-500 text-white p-2 rounded" onClick={handleUpdateUser}>Save Changes</button>
          <button className="ml-2 bg-gray-500 text-white p-2 rounded" onClick={() => setEditingUser(null)}>Cancel</button>
        </div>
      )}

      {/* Thesis Management */}
      <h2 className="text-xl font-semibold mt-5">Manage Theses</h2>
      {loadingTheses ? <p>Loading theses...</p> : (
        <table className="w-full border-collapse border mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Thesis ID</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {theses.map((thesis) => (
              <tr key={thesis.thesisID} className="border">
                <td className="border p-2">{thesis.thesisID}</td>
                <td className="border p-2">{thesis.title}</td>
                <td className="border p-2">{thesis.status}</td>
                <td className="border p-2">
                  <button className="bg-green-500 text-white p-1 rounded m-1" onClick={() => handleApproveThesis(thesis.thesisID)}>Approve</button>
                  <button className="bg-yellow-500 text-white p-1 rounded m-1" onClick={() => handleRestrictThesis(thesis.thesisID)}>Restrict</button>
                  <button className="bg-red-500 text-white p-1 rounded m-1" onClick={() => handleDeleteThesis(thesis.thesisID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminDashboard;





