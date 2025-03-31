import { supabase } from "../../api/supabase";

const Logout = async () => {
    await supabase.auth.signOut();
}

export default Logout;