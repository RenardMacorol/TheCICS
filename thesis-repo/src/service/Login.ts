import { supabase } from "../api/supabase"

const Login = async() => {
    await supabase.auth.signInWithOAuth({provider: "google"})
}


<<<<<<< HEAD
export default Login;
=======
export default Login;
>>>>>>> origin/main
