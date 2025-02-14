import { supabase } from '../../supabase';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Auth = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    const [user,setUser] = useState<any>(null);
         
     useEffect(() => {
    const checkUser = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (user?.user && user.user.email?.endsWith("@neu.edu.ph")) {
        setUser(user.user);
        navigate("/dashboard");
      } else {
        await supabase.auth.signOut();
      }
    };

    checkUser();
  }, [navigate]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };

  return (
    <div>
      <h2>Welcome to Thesis Repository</h2>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );

}

export default Auth;