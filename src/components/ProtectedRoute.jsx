import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * Protege rutas que requieren autenticación y, opcionalmente, un rol específico.
 * - Si no hay token → redirige a login.
 * - Si hay token pero user está cargando → muestra loader.
 * - Si requiredRole está definido y el usuario NO lo cumple → redirige a Home.
 * - Si todo es válido → renderiza children.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { user, token } = useAuth();
  const location = useLocation();

  // No hay token → no está logueado
  if (!token) {
    return (
      <Navigate
        to={`/?showLogin=true`}
        replace
        state={{ redirectTo: location.pathname }}
      />
    );
  }

  // Token presente pero user aún NO cargado
  if (token && user === null) {
    return <div>Cargando...</div>;
  }

  // Validar rol si la ruta lo requiere
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Todo correcto → permitir acceso
  return children;
}
