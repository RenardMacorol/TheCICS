import { supabase } from '../api/supabase';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../service/Login';

const Auth = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [,setUser] = useState<any>(null);
         
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


  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='flex bg-white p-8 rounded-lg shadow-lg w-96 text-center items-center'>
      <h2 className='font-semibold'>Welcome to Thesis Repository</h2>
      <button className="flex items-center rounded-lg  bg-blue-400 hover:bg-blue-600"onClick={Login}>
        <img className="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"></img>
        <span >Sign in with Google </span>
        </button>
      </div>
    </div>
  );

}

export default Auth;