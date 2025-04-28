import './CardInst.css';

function CardInst({ aoSelecionar }) {
    return (
        <div className="card-instituicao">
            <img  
                className="imgs" 
                src={"src/assets/ONGS.png"} 
                alt="Imagem de uma ONG"
            />
            <button className="botao" onClick={aoSelecionar}>
                Selecionar ONG
            </button>
        </div>
    );
}

export default CardInst;
