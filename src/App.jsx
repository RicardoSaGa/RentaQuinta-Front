import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Verificado from "./pages/Verificado";



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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
