import './CardInst.css';
import { useNavigate } from "react-router-dom";

function CardInst({ ong }) {
    const navigate = useNavigate();

    const handleSelecionar = () => {
        // ✅ ALTERAÇÃO: Passa o nome da ONG na URL, em vez do email.
        // Usamos encodeURIComponent para garantir que nomes com espaços ou caracteres especiais funcionem.
        const nomeCodificado = encodeURIComponent(ong.nome);
        navigate(`/doacao?name=${nomeCodificado}`);
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
