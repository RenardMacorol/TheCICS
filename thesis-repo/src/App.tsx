import { useEffect, useState } from 'react';
import './App.css'
import { supabase } from '../supabase';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Auth from './service/Auth';
import Dashboard from './service/Dashboard';


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
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App
