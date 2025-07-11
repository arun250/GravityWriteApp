import AuthForm from './components/AuthForm'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import './App.css'
import Home from './components/Home';
import Header from './components/Header';
import { supabase } from './supabase'
import PatientView from "./components/PatientView"
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from './components/NotFound';
const App = () => {

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user ?? null)
      setLoading(false)
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) return <div className="text-center mt-10">Loading...</div>

  return (
    <>
      <BrowserRouter>
        <Header isLoggedIn={!!user} />
      <Routes>
      <Route  path="/login" element={<AuthForm/>}/>
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/patientView" element={<ProtectedRoute><PatientView/></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
