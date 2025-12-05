import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Verificado from "./pages/Verificado";
import PagoExito from "./pages/PagoExito";
import PagoCancelado from "./pages/PagoCancelado";
import ProtectedRoute from "./components/ProtectedRoute";
import ReservaView from "./pages/ReservaView";
import MisReservas from "./pages/MisReservas";
import NuevaQuinta from "./pages/NuevaQuinta";

// Pages
import Home from "./pages/Home";
import QuintaView from "./pages/QuintaView";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/quintas/:id" element={<QuintaView />} />
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
          path="/mis-reservas"
          element={
            <ProtectedRoute>
              <MisReservas />
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


      </Routes>
    </BrowserRouter>
  );
}

export default App;
