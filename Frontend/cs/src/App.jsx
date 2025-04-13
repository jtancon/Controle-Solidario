import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Saq from "./components/pages/Saq/Saq";
import Doacao from "./components/pages/Doacao/doacao";
import CadastroONG from "./components/pages/CadastroONG/CadastroONG";

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
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
