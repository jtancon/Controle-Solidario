import './CardInst.css';

function CardInst() {
    return (
        <div className="card">
            <h2>ONG</h2>
            <img  
                className="imgs" 
                src={"src/assets/ONGS.jpg"}  // Usando a imagem importada
                alt="Imagem de uma ONG" // Sempre boa prática para acessibilidade
            />
        </div>
    );
}

export default CardInst;
