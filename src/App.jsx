import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';

import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Verificado from "./pages/Verificado";
import PagoExito from "./pages/PagoExito";
import PagoCancelado from "./pages/PagoCancelado";
import ProtectedRoute from "./components/ProtectedRoute";
import ReservaView from "./pages/ReservaView";
import MisReservas from "./pages/MisReservas";
import NuevaQuinta from "./pages/NuevaQuinta";
import MisQuintas from "./pages/MisQuintas";
import QuintaAdmin from "./pages/QuintaAdmin";
import Home from "./pages/Home";
import QuintaView from "./pages/QuintaView";
import NotFound from "./pages/NotFound";
import RegistrarQuinta from "./pages/RegistrarQuinta";
import DashboardHome from "./pages/dashboard/DashboardHome";
import ReservasDueno from "./pages/dashboard/ReservasDueno";



function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "page_view", {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);

  return null; // No renderiza nada
}


function App() {
  return (
    <BrowserRouter>

      <PageTracker />

      <Toaster position="top-center" reverseOrder={false} containerStyle={{
        zIndex: 999999, // <--- ESTO SOLUCIONA QUE SE VEA BORROSO DETRÁS
      }}
      />

      <Routes>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />

          <Route path="restablecer-password" element={<Home />} />

          <Route path="*" element={<NotFound />} />
          <Route path="/quintas/:id" element={<QuintaView />} />
          <Route
            path="/mis-reservas"
            element={
              <ProtectedRoute>
                <MisReservas />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/verificado" element={<Verificado />} />
        <Route path="/pago/exito" element={<PagoExito />} />
        <Route path="/pago/cancelado" element={<PagoCancelado />} />

        <Route
          path="/reserva/:id"
          element={
            <ProtectedRoute>
              <ReservaView />
            </ProtectedRoute>
          }
        />

        {/* DASHBOARD DEL DUEÑO */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="OWNER">
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />

          <Route path="mis-quintas" element={<MisQuintas />} />

          <Route
            path="/dashboard/reservas"
            element={
              <ProtectedRoute>
                <ReservasDueno />
              </ProtectedRoute>
            }
          />

          <Route path="nueva-quinta" element={<NuevaQuinta />} />

          <Route path="quinta/:id" element={<QuintaAdmin />} />

          <Route path="soporte" element={<div>Centro de soporte</div>} />
        </Route>


        <Route path="/registrar-quinta" element={<RegistrarQuinta />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
