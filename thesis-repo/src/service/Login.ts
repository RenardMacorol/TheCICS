import { supabase } from "../api/supabase"

const Login = async() => {
    await supabase.auth.signInWithOAuth({provider: "google"})
}


export default Login;
