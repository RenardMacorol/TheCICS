import { supabase } from "../api/supabase"

const Login = async(setError: (message:string) => void) => {
    const { error } = await supabase.auth.signInWithOAuth({provider: "google"});

    if ( error ) {
        console.error("Login error:", error);
        setError("An error occured during login. Please try again");
    }
}


export default Login;
