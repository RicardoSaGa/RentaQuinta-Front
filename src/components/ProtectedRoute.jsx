import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, token } = useAuth();
  const location = useLocation();

  // Si NO hay token, no está logueado → login
  if (!token) {
    return (
      <Navigate
        to={`/?showLogin=true`}
        replace
        state={{ redirectTo: location.pathname }}
      />
    );
  }

  // Si hay token pero user todavía ES null → estamos cargando el perfil
  if (token && user === null) {
    return <div>Cargando...</div>;
  }

  // Si hay token y user SÍ existe → permitir el acceso
  return children;
}
