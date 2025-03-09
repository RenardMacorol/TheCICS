import { supabase } from '../api/supabase';
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../service/Login';
import { User } from '@supabase/supabase-js';
<<<<<<< HEAD
=======
import Button from './global/Button';
>>>>>>> origin/main

const SignIn = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [,setUser] = useState<User>();
         
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
    <div className='m-10 flex items-center justify-center  bg-white-100'>
<<<<<<< HEAD
      <button className="p-5 flex items-center rounded-lg  bg-blue-400 hover:bg-blue-500"onClick={Login}>
        <img className="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"></img>
        <span >Sign in with Google </span>
        </button>
=======
      <Button 
            variant="whitePurple" 
            size="medium"  
            onClick={Login}> 
            Sign in with Google
        </Button>
      {/* <button className="p-5 flex items-center rounded-lg  bg-blue-400 hover:bg-blue-500"onClick={Login}>
        <img className="w-5 h-5" src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"></img>
        <span >Sign in with Google </span>
        </button> */}
>>>>>>> origin/main
    </div>
  );

}

export default SignIn;