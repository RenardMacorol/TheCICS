import { User } from "@supabase/supabase-js";
class ValidUser{
    async isValidUser (user: User){
        if(user?.email?.endsWith("@neu.edu.ph")){
            return true;
        }
        else{
            return false;
        }
    }
}

export default ValidUser;