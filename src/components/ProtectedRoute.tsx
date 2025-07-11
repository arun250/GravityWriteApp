import { useEffect, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

interface ProtectedRouteProps {
  children: ReactNode; 
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        navigate("/login", { replace: true });
      }
    };
    checkSession();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div className="text-center mt-10">Loading...</div>;  // ✅ Optional: simple loading indicator
  }

  return <>{children}</>;
};

export default ProtectedRoute;
