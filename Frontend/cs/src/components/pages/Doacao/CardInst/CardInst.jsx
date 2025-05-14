import './CardInst.css';
import { useNavigate } from "react-router-dom";

function CardInst({ ong }) {
    const navigate = useNavigate();

    const handleSelecionar = () => {
    navigate(`/doacao?id=${ong.uid}`);
    };

    return (
    <div className="card-instituicao">
        <img
        className="imgs"
        src={ong.fotoPerfil || "src/assets/ONGS.png"}
        alt={ong.nome || "ONG"}
        />
        <h2>{ong.nome || "Nome da ONG"}</h2>
        <button className="botao" onClick={handleSelecionar}>
        Selecionar ONG
        </button>
    </div>
    );
}

export default CardInst;
