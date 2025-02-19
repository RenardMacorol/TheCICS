import { useEffect, useState } from 'react';
import './App.css'
import { supabase } from './api/supabase';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/DashboardThesis';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';


const App = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user && data.user.email?.endsWith("@neu.edu.ph")) {
        setUser(data.user);
      } else {
        await supabase.auth.signOut();
      }
    };

    fetchUser();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path='/SignInPage' element={<SignInPage/>}/>
        <Route path='/SignUpPage' element={<SignUpPage/>}/>
      </Routes>
    </Router>
  );
};

export default App
