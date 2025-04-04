import { User } from "@supabase/supabase-js";
import { supabase } from "../../supabase";

class InsertNewUser{
    async insertNewUser(user : User){
        const error = await supabase.from("Users").insert({
        userID: user.id,
        name: user.user_metadata?.full_name,
        email: user.email,
        role: "Student",
        googleAuthID: user.id,
        profilePicture: user.user_metadata?.avatar_url,
        dateRegistered: new Date().toISOString()
      });
      if(error) {
        console.error("Error Inserting the User", error)
      }

    }
}
export default InsertNewUser;