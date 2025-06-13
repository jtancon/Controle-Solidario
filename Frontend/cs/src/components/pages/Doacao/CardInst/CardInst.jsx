import './CardInst.css';
import { useNavigate } from "react-router-dom";

function CardInst({ ong }) {
    const navigate = useNavigate();

    const handleSelecionar = () => {
        // Verifica se o objeto 'ong' existe e se tem a propriedade 'nome'
        if (ong && ong.nome) {
            // ✅ ALTERAÇÃO: Usa o nome da ONG na URL.
            // encodeURIComponent garante que nomes com espaços ou caracteres especiais funcionem.
            const nomeCodificado = encodeURIComponent(ong.nome);
            navigate(`/doacao?name=${nomeCodificado}`);
        } else {
            // Informa um erro claro se o nome não estiver disponível
            console.error("Não foi possível navegar: o objeto ONG não contém um nome.", ong);
            alert("Erro: Não foi possível selecionar esta ONG pois ela não possui um nome cadastrado.");
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
