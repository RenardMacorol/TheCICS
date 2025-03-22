import { supabase } from '../api/supabase';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../service/Login';
import { User } from '@supabase/supabase-js';

const SignIn = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [,setUser] = useState<User>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to store error messages
         
    useEffect(() => {
    const checkUser = async () => {
      const { data: user } = await supabase.auth.getUser();

      // If user exists and has an NEU email, allow access
      if (user?.user && user.user.email?.endsWith("@neu.edu.ph")) {
        setUser(user.user);
        navigate("/dashboard");
      } else {
        // If user is logged in with a non-NEU email, show error and sign them out
        await supabase.auth.signOut();
      }
    };

    checkUser();
  }, [navigate]);


  return (
    <div className='m-10 flex flex-col items-center justify-center bg-white-100'>
        {errorMessage && ( // Display error message if it exists
            <div className="mb-4 p-3 text-red-600 border border-red-500 rounded">
                {errorMessage}
            </div>
        )}
        <button 
            className="p-5 flex items-center rounded-lg bg-violet-900 hover:bg-blue-500"
            onClick={() => Login(setErrorMessage)}
        >
            <img className="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google Logo" />
            <span> Sign in with Google </span>
        </button>
    </div>
  );

}

export default SignIn;
