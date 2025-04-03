import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Login from '../service/LogInService/UserManagement/Login';

const SignIn = () => {
    const location = useLocation();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // State to store error messages
         
    useEffect(() => {
      if (location.state?.errorMessage) {
          setErrorMessage(location.state.errorMessage);
      }
  }, [location.state]);


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
