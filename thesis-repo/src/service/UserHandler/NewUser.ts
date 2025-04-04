import { User } from "@supabase/supabase-js";
import checkUserIsExist from "./CheckUserIsExist";

class NewUser{
    async isNewUser(user: User) {
        if( await checkUserIsExist(user.id)){
            console.log("The User is Already Exist");
            return false;
        }
    }
}

export default NewUser;