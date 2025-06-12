import './CardInst.css';
import { useNavigate } from "react-router-dom";

function CardInst({ ong }) {
    const navigate = useNavigate();

    const handleSelecionar = () => {
        // Passa o email da ONG na URL, que é um identificador único.
        if (ong.email) {
            navigate(`/doacao?email=${ong.email}`);
        } else {
            console.error("Esta ONG não possui um email para realizar a doação.");
            alert("Não foi possível selecionar esta ONG.");
        }
    };

    return (
        <div className="card-instituicao">
            <div className="imagecontainer">
                <img
                    className="imgs"
                    src={ong.fotoPerfil || "src/assets/ONGS.png"}
                    alt={ong.nome || "ONG"}
                />
            </div>
            
            <h2>{ong.nome || "Nome da ONG"}</h2>
            <button className="botao" onClick={handleSelecionar}>
                Selecionar ONG
            </button>
        </div>
    );
}

export default CardInst;