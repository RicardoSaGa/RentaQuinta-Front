function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-10 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 p-4">

        <div>
          <h3 className="text-xl font-bold mb-4 text-white">RentaQuinta</h3>
          <p>Encuentra la quinta ideal para tu evento, posada, cumpleaños o reunión.</p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Enlaces</h3>
          <ul className="space-y-2">
            <li>Mapa</li>
            <li>Destacadas</li>
            <li>Quintas 360°</li>
            <li>Contacto</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Síguenos</h3>
          <p>Facebook, Instagram, TikTok y próximamente YouTube.</p>
        </div>

      </div>

      <div className="text-center text-gray-500 mt-10">
        © {new Date().getFullYear()} RentaQuinta.com
      </div>
    </footer>
  );
}

export default Footer;
