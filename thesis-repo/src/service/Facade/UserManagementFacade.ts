import { supabase } from '../supabase';
import User from '../Types/User';
import { FetchUserAll } from '../contentManagement/FetchUserAll';

export class UserManagementFacade {
    private fetchUserAll: FetchUserAll;

    constructor() {
        this.fetchUserAll = new FetchUserAll();
    }

    // Activate a user by setting their status to "Active"
    async handleActivateUser(userID: string): Promise<boolean> {
        const { error } = await supabase
            .from("Users")
            .update({ status: "Active" })
            .eq("userID", userID);

        if (error) {
            console.error("Error activating user:", error);
            return false;
        }

        console.log(`✅ User ${userID} activated successfully`);
        return true;
    }

    // Restrict a user by setting their status to "Restricted"
    async handleRestrictUser(userID: string): Promise<boolean> {
        const { error } = await supabase
            .from("Users")
            .update({ status: "Restricted" })
            .eq("userID", userID);

        if (error) {
            console.error("Error restricting user:", error);
            return false;
        }

        console.log(`✅ User ${userID} restricted successfully`);
        return true;
    }

    // Update user details
    async handleUpdateUser(userID: string, newUserData: Partial<User>): Promise<boolean> {
        const { error } = await supabase
            .from("Users")
            .update(newUserData)
            .eq("userID", userID);

        if (error) {
            console.error("Error updating user:", error);
            return false;
        }

        console.log(` User ${userID} updated successfully`);
        return true;
    }

    // Fetch all Users whooo, thank you sa code Master :)
    async fetchUsers(): Promise<User[]> {
        return await this.fetchUserAll.fetch();
    }
}
