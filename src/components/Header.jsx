import { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import LoginModal from "../components/LoginModal";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import logoImg from '../assets/logosinfondo.png';

function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();   // obtener usuario y logout
  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // menú de usuario

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("showLogin") === "true") {
      setLoginOpen(true);
    }
  }, [location]);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img 
            src={logoImg} 
            alt="Logo RentaQuinta" 
            className="h-10 w-auto object-contain transition-transform duration-300 hover:scale-110"
          />
        </Link>

        {/* NAV MOBILE BUTTON */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex gap-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-green-600 transition">Inicio</Link>
          <Link to="/destacadas" className="hover:text-green-600 transition">Destacadas</Link>
          <Link to="/mapa" className="hover:text-green-600 transition">Mapa</Link>
        </nav>

        {/* ------ ÁREA DEL USUARIO ------- */}
        <div className="hidden md:block relative">
          {user ? (
            <>
              {/* AVATAR DEL USUARIO */}
              <button
                className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <FiUser className="text-gray-700 text-xl" />
              </button>

              {/* MENÚ DESPLEGABLE */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl border animate-fadeIn p-2">
                  <p className="px-3 py-2 text-gray-700 font-medium border-b">
                    {user.nombre}
                  </p>

                  <Link
                    to="/perfil"
                    className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                  >
                    Mi perfil
                  </Link>

                  {/* Mostrar opción dueño */}
                  {user.role === "OWNER" && (
                    <Link
                      to="/mis-quintas"
                      className="block px-3 py-2 hover:bg-gray-100 rounded-md"
                    >
                      Mis quintas
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md text-red-600 font-medium"
                  >
                    <FiLogOut /> Cerrar sesión
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
              <FiUser className="text-gray-700 text-xl" />
            </button>
          )}
        </div>
      </div>

      {/* PANEL MOBILE */}
      {open && (
        <nav className="md:hidden bg-white border-t shadow-inner px-6 py-4 space-y-4">

          <Link to="/" className="block text-gray-700 text-lg" onClick={() => setOpen(false)}>Inicio</Link>
          <Link to="/destacadas" className="block text-gray-700 text-lg" onClick={() => setOpen(false)}>Destacadas</Link>
          <Link to="/mapa" className="block text-gray-700 text-lg" onClick={() => setOpen(false)}>Mapa</Link>

          {/* LOGIN O PERFIL EN MOBILE */}
          {user ? (
            <>
              <p className="mt-4 font-semibold text-gray-900">{user.nombre}</p>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-lg text-red-600"
              >
                <FiLogOut /> Cerrar sesión
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setOpen(false);
                setLoginOpen(true);
              }}
              className="flex items-center gap-2 text-lg text-gray-700"
            >
              <FiUser className="text-xl" /> Iniciar sesión
            </button>
          )}
        </nav>
      )}

      {/* MODAL LOGIN */}
      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
}

export default Header;
