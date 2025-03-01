import { supabase } from "./supabase"; // Import existing Supabase client

// ✅ Function to approve a thesis
export const approveThesis = async (thesisId: string) => {
    const { error } = await supabase
        .from("theses")
        .update({ status: "approved" })
        .eq("id", thesisId);

    if (error) {
        console.error("Error approving thesis:", error);
    } else {
        console.log("Thesis approved successfully!");
    }
};

// ✅ Function to delete a thesis
export const deleteThesis = async (thesisId: string) => {
    const { error } = await supabase
        .from("theses")
        .delete()
        .eq("id", thesisId);

    if (error) {
        console.error("Error deleting thesis:", error);
    } else {
        console.log("Thesis deleted successfully!");
    }
};

// ✅ Function to update user role
export const updateUserRole = async (id: string, role: string) => {
    const { error } = await supabase
        .from("users")
        .update({ role })
        .eq("id", id);

    if (error) {
        console.error("Error updating user:", error);
    } else {
        console.log("User role updated successfully!");
    }
};

// ✅ Function to delete a user
export const deleteUser = async (id: string) => {
    const { error } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Error deleting user:", error);
    } else {
        console.log("User deleted successfully!");
    }
};
