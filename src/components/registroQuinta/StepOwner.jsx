// src/components/registroQuinta/StepOwner.jsx
import { useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

function StepOwner({ step, setStep, ownerData, setOwnerData }) {
  const { login } = useAuth();

  const [nombre, setNombre] = useState(ownerData.nombre || "");
  const [email, setEmail] = useState(ownerData.email || "");
  const [telefono, setTelefono] = useState(ownerData.telefono || "");
  const [genero, setGenero] = useState(ownerData.genero || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
    }

    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresa un correo válido.";
    }

    if (!telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio.";
    } else if (!/^\d+$/.test(telefono)) {
      newErrors.telefono = "El teléfono solo debe contener números.";
    } else if (telefono.length < 7) {
      newErrors.telefono = "El teléfono es demasiado corto.";
    }

    if (!genero) {
      newErrors.genero = "Selecciona una opción.";
    }

    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else {
      if (password.length < 8) {
        newErrors.password = "Mínimo 8 caracteres.";
      } else if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
        newErrors.password =
          "Debe contener al menos una letra y un número.";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorGeneral("");
    setErrors({});

    const isValid = validate();
    if (!isValid) return;

    setLoading(true);

    try {
      // 1. Registrar dueño con rol OWNER
      await API.post("/auth/register", {
        nombre,
        email,
        password,
        telefono,
        genero,
        role: "OWNER",
      });

      // 2. Guardar datos en estado global del flujo
      setOwnerData({ nombre, email, telefono, genero, password });

      // 3. Avanzar al siguiente paso
      setStep(2);
    } catch (err) {
      const msg =
        err?.response?.data && typeof err.response.data === "string"
          ? err.response.data
          : "No se pudo registrar tu cuenta. Inténtalo más tarde.";
      setErrorGeneral(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Crea tu cuenta de dueño
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Estos datos serán usados para tu acceso al panel de dueño y para que
        los clientes puedan contactarte si es necesario.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre completo
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent 
                       outline-none transition"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          {errors.nombre && (
            <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>
          )}
        </div>

        {/* Correo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo electrónico
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent 
                       outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-xs text-red-600 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono de contacto
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent 
                       outline-none transition"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />
          {errors.telefono && (
            <p className="text-xs text-red-600 mt-1">{errors.telefono}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Este número puede ser usado para coordinar detalles de las reservas.
          </p>
        </div>

        {/* Género */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Género
          </label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-xl 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent 
                       outline-none transition bg-white"
            value={genero}
            onChange={(e) => setGenero(e.target.value)}
          >
            <option value="">Selecciona una opción</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
          </select>
          {errors.genero && (
            <p className="text-xs text-red-600 mt-1">{errors.genero}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent 
                       outline-none transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-xs text-red-600 mt-1">{errors.password}</p>
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
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent 
                       outline-none transition"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-600 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {errorGeneral && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {errorGeneral}
          </p>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold
                       hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed
                       shadow-md transform hover:scale-[1.01] transition"
          >
            {loading ? "Creando cuenta..." : "Continuar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StepOwner;
