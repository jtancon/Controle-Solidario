import './NavFooter.css';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

function NavbarDoador() {
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/Login"); // redireciona após logout
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    };

    return (
        <div className="navbar">
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
                <h1 className="logo">Controle Solidário</h1>
            </Link>
            <div className="nav-links">
                <Link to="/Doacao" className="nav-button">Doações</Link>
                <Link to="/HistoricoDoacao" className="nav-button">Histórico</Link>
                <Link to="/PerfilDoador" className="nav-button">Perfil</Link>
                <button className="nav-button logout" onClick={handleLogout}>
                    Sair
                </button>
            </div>
        </div>
    );
}

export default NavbarDoador;
