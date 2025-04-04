import { supabase } from "../supabase";

const Logout = async () => {
    await supabase.auth.signOut();
}

export default Logout;