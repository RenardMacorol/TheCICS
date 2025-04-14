import { supabase } from "../supabase";

const Login = async(setError: (message:string) => void) => {
    const { error } = await supabase.auth.signInWithOAuth({provider: "google"});

    if ( error ) {
        console.error("Login error:", error);
        setError("An error occured during login. Please try again");
        return;
    }


    // Wait for user session to update
    setTimeout(async () => {
        const { data: userData } = await supabase.auth.getUser();

        if (userData?.user) {
            const email = userData.user.email;

            if (!email?.endsWith("@neu.edu.ph")) {
                await supabase.auth.signOut(); 
                setError("PLEASE LOGIN USING YOUR INSTITUTIONAL EMAIL.");
            }
        }
    }, );
};


export default Login;
