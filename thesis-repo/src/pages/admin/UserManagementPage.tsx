// UserManagementPage.tsx
import { useEffect, useState } from "react";
import { supabase } from "../../service/supabase";
import Users from "../../service/Types/User";
import { UserManagementFacade } from "../../service/Facade/UserManagementFacade";
import { FetchUserAll } from "../../service/ContentManagement/FetchUserAll";

const UserManagementPage = () => {
  const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Student" });
  const [editingUser, setEditingUser] = useState<Users | null>(null);
  const userFacade = new UserManagementFacade();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const fetchUserAll = new FetchUserAll();
    await fetchUserAll.fetch();
    setUsers(fetchUserAll.users);
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
      fetchData();
    }
  }

  async function activateUser(userID: string) {
    const success = await userFacade.handleActivateUser(userID);
    if (success) {
      alert("User activated successfully!");
      fetchData();
    }
  }

  async function updateUser(userID: string, newData: Partial<Users>) {
    const success = await userFacade.handleUpdateUser(userID, newData);
    if (success) {
      alert("User updated successfully!");
      fetchData();
    }
  }

  return (
    <div className="w-full border border-gray-300 rounded-md shadow-md bg-white mt-5">
      <div className="bg-[#5CE1E6] p-4 border-b border-gray-300 text-left">
        <h2 className="text-2xl font-semibold text-gray-800 pl-4">User Management</h2>
      </div>

      <div className="p-6 flex justify-center border-b border-gray-300">
        <div className="flex flex-wrap items-center justify-center gap-3 bg-white shadow-md p-4 rounded-md border border-gray-300 w-full max-w-3xl">
          <input
            className="border border-gray-400 p-2 rounded-md w-60"
            type="text"
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          />
          <input
            className="border border-gray-400 p-2 rounded-md w-60"
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <select
            className="border border-gray-400 p-2 rounded-md"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="Student">Student</option>
            <option value="Faculty">Faculty</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            className="bg-[#5CE1E6] hover:bg-[#06B8BE] text-white font-medium px-4 py-2 rounded-md"
            onClick={handleCreateUser}
          >
            Add User
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 p-4">Loading users...</p>
      ) : (
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
                    role: editingUser.role,
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
    </div>
  );
};

export default UserManagementPage;