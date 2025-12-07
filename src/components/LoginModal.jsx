import { useState } from "react";
import { createPortal } from "react-dom"; // <--- IMPORTANTE
import { FiX } from "react-icons/fi";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [view, setView] = useState("login");

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      onClose();
    } catch (err) {
      if (err.response) {
        const status = err.response.status;
        if (status === 401) {
          setError("Correo o contraseña incorrectos.");
        } else if (status === 403) {
          setError("Debes verificar tu correo antes de iniciar sesión.");
        } else {
          setError("Error al iniciar sesión. Intenta más tarde.");
        }
      } else {
        setError("No se pudo conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/auth/register", {
        nombre,
        email,
        password,
        telefono
      });
      alert("Cuenta creada. Revisa tu bandeja de entrada.");
      setView("login");
    } catch (err) {
      setError("Error al crear cuenta. Intenta otro correo.");
    } finally {
      setLoading(false);
    }
  };

  // Usamos createPortal para renderizar esto directamente en el body
  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
      {/* Fondo clickeable para cerrar si quieres (opcional) */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fadeInScale relative z-10 mx-4">
        {/* CERRAR */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition text-2xl"
          onClick={onClose}
        >
          <FiX />
        </button>

        {/* LOGIN */}
        {view === "login" && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Iniciar sesión
            </h2>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transform hover:scale-[1.02] transition shadow-md"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Acceder"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              ¿No tienes cuenta?{" "}
              <button
                onClick={() => setView("register")}
                className="text-green-600 font-semibold hover:underline"
              >
                Crear una ahora
              </button>
            </p>
          </>
        )}

        {/* REGISTRO */}
        {view === "register" && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Crear cuenta
            </h2>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono (10 dígitos)
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</p>}

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transform hover:scale-[1.02] transition shadow-md"
                disabled={loading}
              >
                {loading ? "Registrando..." : "Crear cuenta"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={() => setView("login")}
                className="text-green-600 font-semibold hover:underline"
              >
                Iniciar sesión
              </button>
            </p>
          </>
        )}
      </div>
    </div>,
    document.body // Aquí le decimos que lo renderice en el BODY, fuera del Header
  );
}

export default LoginModal;