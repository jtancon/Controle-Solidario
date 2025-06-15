import './NavFooter.css';
import "../../theme/dark.css";


import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { Menu, Moon } from 'lucide-react';

function NavbarONG() {
    const [menuAberto, setMenuAberto] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const auth = getAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/Login");
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    };

    const toggleDarkMode = () => {
        const isDark = document.body.classList.toggle("dark-mode");
        localStorage.setItem("tema", isDark ? "escuro" : "claro");
    };

    useEffect(() => {
        const dark = localStorage.getItem("tema") === "escuro";
        document.body.classList.toggle("dark-mode", dark);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuAberto(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="navbar">
            <div className="navbar-top">
                <Link to="/" className="logo-link">
                    <h1 className="logo">Controle Solidário</h1>
                </Link>
                <div className="navbar-icons">
                    <button className="icon-button menu-button" onClick={() => setMenuAberto(!menuAberto)}>
                        <Menu size={28} />
                    </button>
                    <button className="icon-button moon-button" onClick={toggleDarkMode} title="Alternar tema">
                        <Moon size={24} />
                    </button>
                </div>

                {menuAberto && (
                    <div className="nav-dropdown" ref={menuRef}>
                        <Link to="/AdminONG" className="nav-button" onClick={() => setMenuAberto(false)}>Painel Admin</Link>
                        <Link to="/PerfilONG" className="nav-button" onClick={() => setMenuAberto(false)}>Perfil</Link>
                        <Link to="/Dashboard" className="nav-button" onClick={() => setMenuAberto(false)}>Dashboard</Link>
                        <button className="nav-button logout" onClick={handleLogout}>Sair</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NavbarONG;
