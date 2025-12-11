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
    if (params.get("showLogin") === "true" || params.get("token")) {
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
        <div className="hidden md:flex items-center gap-6 relative">

          {/* NUEVO: Registrar mi Quinta (si NO está logueado o si está logueado pero no es OWNER) */}
          <Link
            to="/registrar-quinta"
            className="text-textc text-sm font-medium border border-primary/40 bg-white px-4 py-1.5 rounded-full hover:bg-primary hover:text-bg transition-colors shadow-sm"
          >
            Registrar mi Quinta
          </Link>

          {user ? (
            <>
              {/* BOTÓN USUARIO → ICONO + NOMBRE */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/40 bg-white hover:bg-primary/10 transition"
              >
                <div className="w-9 h-9 rounded-full border border-primary/40 bg-gray-100 flex items-center justify-center">
                  <FiUser className="text-xl text-textc" />
                </div>
                <span className="font-medium text-textc">
                  {user.nombre?.split(" ")[0]}
                </span>
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
                    onClick={() => setMenuOpen(false)}
                  >
                    Mi perfil
                  </Link>

                  {user.role === "OWNER" && (
                    <>
                      <Link
                        to="/dashboard"
                        className="block px-3 py-2 hover:bg-bg rounded-lg text-textc font-medium"
                        onClick={() => setMenuOpen(false)}
                      >
                        Dashboard
                      </Link>

                      <Link
                        to="/dashboard/mis-quintas"
                        className="block px-3 py-2 hover:bg-bg rounded-lg text-textc"
                        onClick={() => setMenuOpen(false)}
                      >
                        Mis quintas
                      </Link>
                    </>
                  )}


                  <Link
                    to="/mis-reservas"
                    className="block px-3 py-2 hover:bg-bg rounded-lg text-textc"
                    onClick={() => setMenuOpen(false)}
                  >
                    Mis Reservas
                  </Link>

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
            /* NO LOGUEADO → Mostrar solo Acceder */
            <div className="flex items-center gap-6">
              <button
                onClick={() => setLoginOpen(true)}
                className="flex items-center gap-2 text-textc font-medium hover:text-primary transition"
              >
                <FiUser className="text-base" />
                <span>Acceder</span>
              </button>
            </div>
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

          {/* NUEVO - MOBILE: Registrar mi Quinta */}
          <Link
            to="/registrar-quinta"
            className="block text-lg text-textc"
            onClick={() => setOpen(false)}
          >
            Registrar mi Quinta
          </Link>

          {user ? (
            <>
              <p className="mt-4 font-semibold text-textc">{user.nombre}</p>

              {user.role === "OWNER" && (
                <>
                  <Link
                    to="/dashboard"
                    className="block text-lg text-textc"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <Link
                    to="/dashboard/mis-quintas"
                    className="block text-lg text-textc"
                    onClick={() => setOpen(false)}
                  >
                    Mis Quintas
                  </Link>
                </>
              )}

              <Link
                to="/mis-reservas"
                className="block text-lg text-textc"
                onClick={() => setOpen(false)}
              >
                Mis Reservas
              </Link>

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
              <FiUser className="text-xl" /> Acceder
            </button>
          )}
        </nav>
      )}

      <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </header>
  );
}

export default Header;
