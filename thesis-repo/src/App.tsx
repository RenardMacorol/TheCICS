import { useEffect, useState } from 'react';
import './App.css';
import { supabase } from './api/supabase';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/DashboardThesis';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import BookmarkedTheses from './pages/BookmarkedTheses';
import ThesisDetails from './pages/ThesisDetails';

const App = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
      setLoading(false); // Stop loading once user state is determined
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    fetchUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Prevents redirection before user state is set
  }

  return (
    <Router>
      <Routes>
        {/* Redirect Institutional Users to Dashboard */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />

        {/* Dashboard: Only for Institutional Users */}
        <Route 
          path="/dashboard" 
          element={
            user ? (
              user.email.endsWith("@neu.edu.ph") 
                ? <Dashboard /> 
                : <Navigate to="/SignInPage?error=1" replace />
            ) : <Navigate to="/" />
          } 
        />
        
        <Route path='/SignInPage' element={<SignInPage />} />
        <Route path='/SignUpPage' element={<SignUpPage />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path="/bookmarked" element={<BookmarkedTheses />} />
        <Route path="/ThesisUpload/:thesisID" element={<ThesisDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
