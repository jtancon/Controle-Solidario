import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Navbar_Footer/Footer";
import Saq from "./components/pages/Saq/Saq";
import Doacao from "./components/pages/Doacao/doacao";
import HistoricoDoacao from "./components/pages/HistoricoDoacao/HistoricoDoacao";
import CadastroONG from "./components/pages/CadastroONG/CadastroONG";
import IndexONG from "./components/pages/IndexONG/IndexONG";
import Dashboard from "./components/pages/Dashboards/Dashboard";
import Login from "./components/pages/Login/Login";
import { PrivateRoute } from "./routes/routes";
import { Fragment } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <BrowserRouter>
      <Fragment>
        <div className="app">
          <main>
            <Routes>
              <Route path="/" element={<Saq />} />
              <Route path="/Login" element={<Login />} />
              <Route path="/CadastroONG" element={<CadastroONG />} />
              <Route path="*" element={<Saq />} />
              
              <Route element={<PrivateRoute />}>
                <Route path="/Doacao" element={<Doacao />} />
                <Route path="/IndexONG" element={<IndexONG />} />
                <Route path="/Dashboard" element={<Dashboard />} />
                <Route path="/HistoricoDoacao" element={<HistoricoDoacao />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Fragment>
    </BrowserRouter>
  );
}

export default App;
