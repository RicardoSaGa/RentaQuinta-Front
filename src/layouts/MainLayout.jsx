import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";

function MainLayout() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div>
      <Header onOpenLogin={() => setShowLogin(true)} />

      {showLogin && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Login (placeholder)</h2>

            <button
              className="w-full mt-4 bg-gray-900 text-white py-2 rounded-lg"
              onClick={() => setShowLogin(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <main className="pt-6">
        <Outlet />
        <Footer/>
      </main>

    </div>
  );
}

export default MainLayout;