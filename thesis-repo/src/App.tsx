import { useEffect, useState } from 'react';
import './App.css';
import { supabase } from './service/supabase';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/dashboard/DashboardThesis';
import SignInPage from './pages/userAuth/SignIn';
import AdminDashboard from './pages/admin/AdminDashboard';
import ThesisDetails from './pages/thesisContent/ThesisDetails';
import BookmarkedTheses from './pages/bookmark/BookmarkedTheses';
import CitationHistoryPage from './pages/history/CitationHistoryPage';
import LandingPage from './pages/landingPage/LandingPage';
import StudentProfile from './pages/profile/StudentProfile';
import LoadingScreen from './components/global/LoadingScreen';


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
    return <LoadingScreen />; // Prevents redirection before user state is set // will add loading animation here
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
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path="/bookmarked" element={<BookmarkedTheses />} />
        <Route path="/citation-history" element={<CitationHistoryPage />} />
        <Route path="/thesis/:thesisID" element={<ThesisDetails />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/profile" element={<StudentProfile />} />
      </Routes>
    </Router>
  );
};

export default App;
