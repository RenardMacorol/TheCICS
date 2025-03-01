import { useEffect, useState } from 'react';
import './App.css';
import { supabase } from './api/supabase';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/DashboardThesis';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AdminDashboard from './pages/admin/AdminDashboard';

const App = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        await handleUserSignIn(data.user);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        await handleUserSignIn(session.user);
      }
    });

    fetchUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleUserSignIn = async (user: any) => {
    if (!user.email.endsWith("@neu.edu.ph")) {
      setUser(null);
      return;
    }

    setUser(user);

    // Check if user exists in the `users` table
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", user.email)
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 = No matching record found
      console.error("Error checking user:", error);
      return;
    }

    if (!existingUser) {
      // Insert new user record
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email.split("@")[0],
          role: "admin",
          last_login: new Date().toISOString(),
        }
      ]);

      if (insertError) {
        console.error("Error inserting user:", insertError);
      }
    } else {
      // Update last login timestamp
      await supabase.from("users").update({ last_login: new Date().toISOString() }).eq("id", user.id);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path='/SignInPage' element={<SignInPage/>}/>
        <Route path='/SignUpPage' element={<SignUpPage/>}/>
        <Route path='/admin' element={user?.role === "admin" ? <AdminDashboard/> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;