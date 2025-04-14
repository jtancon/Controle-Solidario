import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Saq from "./components/pages/Saq/Saq";
import Doacao from "./components/pages/Doacao/doacao";
import CadastroONG from "./components/pages/CadastroONG/CadastroONG";
import IndexONG from "./components/pages/IndexONG/IndexONG";
import Dashboard from "./components/pages/Dashboards/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Saq />} />
            <Route path="/Doacao" element={<Doacao />} />
            <Route path="/CadastroONG" element={<CadastroONG />} />
            <Route path="/IndexONG" element={<IndexONG />} />
            <Route path="/Dashboard" element={<Dashboard />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
