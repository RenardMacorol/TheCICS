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

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student" });
  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
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
    </div>
  );
};

export default AdminDashboard;





