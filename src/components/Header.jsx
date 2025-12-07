import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiUser, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import LoginModal from "../components/LoginModal";
import { useAuth } from "../context/AuthContext";
import logoImg from "../assets/logosinfondo.png";

function Header() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const [open, setOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("showLogin") === "true") {
      setLoginOpen(true);
    }
  }, [location]);

  return (
    <header className="bg-bg backdrop-blur-xl border-b border-muted/40 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logoImg}
            alt="Logo RentaQuinta"
            className="h-11 w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* BOTÓN MOBILE */}
        <button
          className="md:hidden text-3xl text-textc"
          onClick={() => setOpen(!open)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>

        {/* NAV DESKTOP */}
        <nav className="hidden md:flex gap-10 text-textc font-medium">
          <Link
            to="/"
            className="hover:text-primary transition relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-primary hover:after:w-full after:transition-all"
          >
            Inicio
          </Link>

          <Link
            to="/destacadas"
            className="hover:text-primary transition relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-primary hover:after:w-full after:transition-all"
          >
            Destacadas
          </Link>

          <Link
            to="/mapa"
            className="hover:text-primary transition relative after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-primary hover:after:w-full after:transition-all"
          >
            Mapa
          </Link>
        </nav>

        {/* USUARIO */}
        <div className="hidden md:block relative">
          {user ? (
            <>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="w-12 h-12 rounded-full border border-primary/40 bg-white text-textc flex items-center justify-center transition hover:bg-primary/10"
              >
                <FiUser className="text-xl" />
              </button>

              {/* MENÚ DROPDOWN */}
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-muted/40 py-2 animate-fadeIn">
                  <p className="px-3 py-2 text-textc font-semibold border-b border-muted/30">
                    {user.nombre}
                  </p>

                  <Link
                    to="/perfil"
                    className="block px-3 py-2 hover:bg-bg rounded-lg text-textc"
                  >
                    Mi perfil
                  </Link>

                  {user.role === "OWNER" && (
                    <Link
                      to="/mis-quintas"
                      className="block px-3 py-2 hover:bg-bg rounded-lg text-textc"
                    >
                      Mis quintas
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg font-medium"
                  >
                    <FiLogOut /> Cerrar sesión
                  </button>
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => setLoginOpen(true)}
              className="w-12 h-12 rounded-full border border-primary/40 bg-white hover:bg-primary/10 hover:border-primary transition flex items-center justify-center text-textc"
            >
              <FiUser className="text-xl" />
            </button>
          )}
        </div>
      </div>

      {/* PANEL MOBILE */}
      {open && (
        <nav className="md:hidden bg-white border-t border-muted/30 shadow-inner px-6 py-4 space-y-4 animate-fadeIn">
          <Link
            to="/"
            className="block text-lg text-textc"
            onClick={() => setOpen(false)}
          >
            Inicio
          </Link>

          <Link
            to="/destacadas"
            className="block text-lg text-textc"
            onClick={() => setOpen(false)}
          >
            Destacadas
          </Link>

          <Link
            to="/mapa"
            className="block text-lg text-textc"
            onClick={() => setOpen(false)}
          >
            Mapa
          </Link>

          {user ? (
            <>
              <p className="mt-4 font-semibold text-textc">{user.nombre}</p>

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
              className="flex items-center gap-2 text-lg text-textc"
            >
              <FiUser className="text-xl" /> Iniciar sesión
            </button>
          )}
        </nav>
      )}

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
}

export default Header;
