import { useState, useEffect } from "react";
import { supabase } from '../../service/supabase';


const StudentProfile = () => {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data, error } = await supabase
        .from("Users")
        .select("name, profilePicture")
        .eq("userID", user.id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
        return;
      }

      setUser({ ...user, ...data });
      setName(data?.name || "");
    };

    fetchUser();
  }, []);

  const updateName = async () => {
    if (!user) return;
    
    setLoading(true);

    const { error } = await supabase
      .from("Users")
      .update({ name })
      .eq("userID", user.id);

    setLoading(false);

    if (error) {
      console.error("Error updating name:", error);
      alert("Failed to update name.");
    } else {
      alert("Name updated successfully!");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>

      {user?.profilePicture && (
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
      )}

      <label className="block text-gray-700 text-sm font-bold mb-2">
        Name:
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={updateName}
        className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Name"}
      </button>
    </div>
  );
};

export default StudentProfile;
