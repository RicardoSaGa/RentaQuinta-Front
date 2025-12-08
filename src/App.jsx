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

      <Routes>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;
