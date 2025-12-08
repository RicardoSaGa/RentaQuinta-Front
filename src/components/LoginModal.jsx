import { useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const COUNTRY_OPTIONS = [
  { code: "MX", name: "México", dialCode: "+52" },
  { code: "US", name: "Estados Unidos", dialCode: "+1" },
  { code: "CA", name: "Canadá", dialCode: "+1" },
  { code: "AR", name: "Argentina", dialCode: "+54" },
  { code: "CL", name: "Chile", dialCode: "+56" },
  { code: "CO", name: "Colombia", dialCode: "+57" },
  { code: "PE", name: "Perú", dialCode: "+51" },
  { code: "ES", name: "España", dialCode: "+34" },
  { code: "BR", name: "Brasil", dialCode: "+55" },
  { code: "CR", name: "Costa Rica", dialCode: "+506" },
];

function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const [view, setView] = useState("login");

  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [genero, setGenero] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_OPTIONS[0]);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registerErrors, setRegisterErrors] = useState({});

  if (!isOpen) return null;

  // GOOGLE ANALYTICS | GA4: el modal se abrió
  if (window.gtag) {
    window.gtag("event", "login_opened");
  }

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

  const validateRegister = () => {
    const errors = {};

    if (!nombre.trim()) {
      errors.nombre = "El nombre es obligatorio.";
    }

    if (!telefono.trim()) {
      errors.telefono = "El teléfono es obligatorio.";
    } else if (!/^\d+$/.test(telefono)) {
      errors.telefono = "El teléfono solo debe contener números.";
    } else {
      if (selectedCountry.code === "MX" && telefono.length !== 10) {
        errors.telefono = "En México el teléfono debe tener 10 dígitos.";
      } else if (telefono.length < 7) {
        errors.telefono = "El teléfono es demasiado corto.";
      }
    }

    if (!email.trim()) {
      errors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Ingresa un correo válido.";
    }

    if (!genero) {
      errors.genero = "Selecciona una opción.";
    }

    if (!password) {
      errors.password = "La contraseña es obligatoria.";
    } else {
      if (password.length < 8) {
        errors.password = "Mínimo 8 caracteres.";
      } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        errors.password =
          "Debe contener al menos una letra y un número.";
      }
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Confirma tu contraseña.";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden.";
    }

    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRegisterErrors({});

    const isValid = validateRegister();
    if (!isValid) {
      setLoading(false);
      return;
    }

    const telefonoCompleto = `${selectedCountry.dialCode}${telefono}`;

    try {
      await API.post("/auth/register", {
        nombre,
        email,
        password,
        telefono: telefonoCompleto,
        genero,
      });
      alert("Cuenta creada. Revisa tu bandeja de entrada.");
      setView("login");
    } catch (err) {
      setError("Error al crear cuenta. Intenta otro correo.");
    } finally {
      setLoading(false);
    }
  };

  const switchToRegister = () => {
    setView("register");
    setError("");
    setRegisterErrors({});
  };

  const switchToLogin = () => {
    setView("login");
    setError("");
    setRegisterErrors({});
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="absolute inset-0" onClick={onClose}></div>

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl animate-fadeInScale relative z-10 mx-4 
      max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition text-2xl"
          onClick={onClose}
        >
          <FiX />
        </button>

        {/* LOGIN (sin cambios de funcionalidad) */}
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

              {error && (
                <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}

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
                onClick={switchToRegister}
                className="text-green-600 font-semibold hover:underline"
              >
                Crear una ahora
              </button>
            </p>
          </>
        )}

        {/* REGISTRO MEJORADO */}
        {view === "register" && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              Crear cuenta
            </h2>

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                {registerErrors.nombre && (
                  <p className="text-red-600 text-sm mt-1">
                    {registerErrors.nombre}
                  </p>
                )}
              </div>

              {/* Teléfono con país */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-xl bg-white text-sm"
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const c = COUNTRY_OPTIONS.find(
                        (item) => item.code === e.target.value
                      );
                      if (c) setSelectedCountry(c);
                    }}
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} ({c.dialCode})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-xl 
                               focus:ring-2 focus:ring-green-500 focus:border-transparent 
                               outline-none transition w-full"
                    placeholder="Número sin lada"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />

                </div>
                {registerErrors.telefono && (
                  <p className="text-red-600 text-sm mt-1">
                    {registerErrors.telefono}
                  </p>
                )}
              </div>

              {/* Género */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition bg-white"
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="Prefiero no decirlo">
                    Prefiero no decirlo
                  </option>
                </select>
                {registerErrors.genero && (
                  <p className="text-red-600 text-sm mt-1">
                    {registerErrors.genero}
                  </p>
                )}
              </div>

              {/* Correo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {registerErrors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {registerErrors.email}
                  </p>
                )}
              </div>

              {/* Contraseña con ojo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm"
                    onClick={() =>
                      setShowRegisterPassword((prev) => !prev)
                    }
                  >
                    {showRegisterPassword ? "Ocultar" : "Ver"}
                  </button>
                </div>
                {registerErrors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {registerErrors.password}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 8 caracteres, al menos una letra y un número.
                </p>
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar contraseña
                </label>
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {registerErrors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1">
                    {registerErrors.confirmPassword}
                  </p>
                )}
              </div>

              {error && (
                <p className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-lg">
                  {error}
                </p>
              )}

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
                onClick={switchToLogin}
                className="text-green-600 font-semibold hover:underline"
              >
                Iniciar sesión
              </button>
            </p>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

export default LoginModal;
