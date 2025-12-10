import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

import MainLayout from "./layouts/MainLayout";
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
import { Toaster } from 'react-hot-toast';


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

        <Route
          path="/dashboard/nueva-quinta"
          element={
            <ProtectedRoute>
              <NuevaQuinta />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/mis-quintas"
          element={
            <ProtectedRoute>
              <MisQuintas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/quinta/:id"
          element={
            <ProtectedRoute>
              <QuintaAdmin />
            </ProtectedRoute>
          }
        />

        <Route path="/registrar-quinta" element={<RegistrarQuinta />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
