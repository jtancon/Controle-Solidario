import './Footer.css';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <div className="footer">
            <p className="footer-copy">© 2025 Controle Solidário</p>
            <div className="footer-links">
                <Link to="/Saq" className="footer-link">FAQ</Link>
                <Link to="/PerfilDoador" className="footer-link">Perfil</Link>
                <Link to="/Doacao" className="footer-link">Doar</Link>
            </div>
        </div>
    );
}

export default Footer;
