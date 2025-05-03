import { useEffect, useState } from 'react';
import './App.css';
import { supabase } from './service/supabase';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/dashboard/DashboardThesis';
import SignInPage from './pages/userAuth/SignIn';
import ThesisDetails from './pages/thesisContent/ThesisDetails';
import BookmarkedTheses from './pages/bookmark/BookmarkedTheses';
import CitationHistoryPage from './pages/history/CitationHistoryPage';
import LandingPage from './pages/landingPage/LandingPage';
import StudentProfile from './pages/profile/StudentProfile';

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagementPage from "./pages/admin/UserManagementPage"; // Fixed typo: UserManagemetPage -> UserManagementPage
import ThesisManagementPage from "./pages/admin/ThesisManagementPage";
import ThesisUploadPage from "./pages/admin/ThesisUploadPage";

import LoadingScreen from './components/global/LoadingScreen';
import ThesisCommentsModeration from './pages/admin/ThesisCommentsModeration';


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
      setLoading(false);
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
              user.email.endsWith("@neu.edu.ph") ? <Dashboard /> : <Navigate to="/SignInPage?error=1" replace />
            ) : <Navigate to="/" />
          }
        />

        <Route path="/SignInPage" element={<SignInPage />} />
        <Route path="/bookmarked" element={<BookmarkedTheses />} />
        <Route path="/citation-history" element={<CitationHistoryPage />} />
        <Route path="/thesis/:thesisID" element={<ThesisDetails />} />
        <Route path="/profile" element={<StudentProfile />} />

        {/* Admin Routes: Properly Nested */}
        <Route path="/admin" element={<AdminDashboard />}>
          <Route path="user-management" element={<UserManagementPage />} />
          <Route path="thesis-management" element={<ThesisManagementPage />} />
          <Route path="thesis-upload" element={<ThesisUploadPage />} />
          <Route path="comment-management" element={<ThesisCommentsModeration />} />
          <Route index element={<UserManagementPage />} /> {/* Default route under /admin */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;