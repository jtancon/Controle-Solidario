import './NavFooter.css';
import { Link } from 'react-router-dom';

function NavbarDoador() {
    return (
        <div className="navbar">
            <h1 className="logo">Controle Solidário</h1>
            <div className="nav-links">
                <Link to="/Doacao" className="nav-button">Doações</Link>
                <Link to="/HistoricoDoacao" className="nav-button">Histórico</Link>
                <Link to="/PerfilDoador" className="nav-button">Perfil</Link>
                <Link to="/Login" className="nav-button logout">Sair</Link>
            </div>
        </div>
    );
}

export default NavbarDoador;
