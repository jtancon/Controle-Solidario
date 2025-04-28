import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Navbar_Footer/Footer";
import Saq from "./components/pages/Saq/Saq";
import Doacao from "./components/pages/Doacao/doacao";
import HistoricoDoacao from "./components/pages/HistoricoDoacao/HistoricoDoacao"; 
import CadastroONG from "./components/pages/CadastroONG/CadastroONG";
import IndexONG from "./components/pages/IndexONG/IndexONG";
import Dashboard from "./components/pages/Dashboards/Dashboard";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        <main>
          <Routes>
            <Route path="/" element={<Saq />} />
            <Route path="/Doacao" element={<Doacao />} />
            <Route path="/CadastroONG" element={<CadastroONG />} />
            <Route path="/IndexONG" element={<IndexONG />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Historico" element={<HistoricoDoacao />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
