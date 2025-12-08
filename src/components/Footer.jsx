import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram, FiMap, FiStar } from "react-icons/fi";

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-muted/40 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-textc">

        {/* Columna 1 - Marca */}
        <div>
          <h3 className="text-xl font-semibold mb-3 text-primary">
            RentaQuinta
          </h3>
          <p className="text-sm text-textc/70 leading-relaxed">
            Encuentra la quinta perfecta para tu evento, posada, cumpleaños o reunión.
            Espacios verificados, anfitriones confiables y reservas seguras.
          </p>
        </div>

        {/* Columna 2 - Navegación */}
        <div>
          <h3 className="text-lg font-medium mb-3">Navegación</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/mapa" className="hover:text-primary transition flex items-center gap-2">
                <FiMap /> Mapa
              </Link>
            </li>
            <li>
              <Link to="/destacadas" className="hover:text-primary transition flex items-center gap-2">
                <FiStar /> Quintas destacadas
              </Link>
            </li>
            <li>
              <Link to="/quintas-360" className="hover:text-primary transition">
                Quintas con Tour 360°
              </Link>
            </li>
            <li>
              <Link to="/contacto" className="hover:text-primary transition">
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* Columna 3 - Social */}
        <div>
          <h3 className="text-lg font-medium mb-3">Síguenos</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
              <a
                href="https://www.facebook.com/rentaquintaoficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FiFacebook /> Facebook
              </a>
            </li>
            <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
              <FiInstagram /> Instagram
            </li>
            <li className="flex items-center gap-2 hover:text-primary transition cursor-pointer">
              TikTok
            </li>
          </ul>
        </div>

        {/* Columna 4 - Extras */}
        <div>
          <h3 className="text-lg font-medium mb-3">Información</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-primary transition cursor-pointer">Términos y condiciones</li>
            <li className="hover:text-primary transition cursor-pointer">Privacidad</li>
            <li className="hover:text-primary transition cursor-pointer">Preguntas frecuentes</li>
            <li className="hover:text-primary transition cursor-pointer">Soporte</li>
          </ul>
        </div>
      </div>

      {/* Créditos */}
      <div className="border-t border-muted/40 py-5 text-center text-sm text-textc/60">
        © {new Date().getFullYear()} RentaQuinta.com — Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
