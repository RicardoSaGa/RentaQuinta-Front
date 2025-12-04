import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  // Si NO está logeado → mandar al login con redirectTo
  if (!user) {
      openLoginModal();
      return null;
  }

  // Si sí está logeado → mostrar la página
  return children;
}
