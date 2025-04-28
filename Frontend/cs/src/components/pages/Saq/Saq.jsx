import './Saq.css';
import NavbarDoador from '../../Navbar_Footer/NavbarDoador';

function Saq() {
  return (
    <>
    <NavbarDoador/>
    <div className="saq">
      <div className="titulo">
        <hr className="linha"/>
        <h1>Sobre Nós</h1>
        <hr className="linha"/>
      </div>
      <div className='topicos'>
        <div className='sobreNosTexto'>
          <h3>Nossa Missão</h3>
          <p>Acreditamos que a transparência e a eficiência financeira são fundamentais para que as ONGs possam causar um impacto ainda maior. Por isso, criamos uma plataforma que facilita a gestão financeira dessas organizações, ajudando-as a acompanhar suas receitas, despesas e relatórios com precisão e simplicidade.</p>
        </div>
        <img className='imgSobre' src={"src/assets/nossaMissao.png"}/>  
      </div>

      <div className="titulo">
        <hr className="linha"/>
        <h2 className='h2Valores'>Nossos Valores</h2>
      </div>
      <div className='topicos'>
        <img className='imgValores' src={"src/assets/nossosValores.jpg"}/>
        <div className='sobreNosTexto'>
          <ul>
            <li><strong>Transparência</strong>: Acreditamos que a confiança é construída com uma gestão financeira clara e acessível.</li>
            <li>Impacto Social: Nossa prioridade é capacitar ONGs para que possam focar em suas causas.</li>
            <li>Acessibilidade: Criamos uma plataforma intuitiva e acessível para organizações de todos os tamanhos.</li>
            <li>Inovação: Utilizamos tecnologia para simplificar processos e otimizar a administração financeira.</li>
          </ul>
        </div>
      </div>
      

      <div className="titulo">
        <hr className="linha"/>
        <h1>O Que Oferecemos</h1>
        <hr className="linha"/>
      </div>
      <div className="oferecemosContainer">
        <div className="faixaFundo" />
        <div className="conteudoComFaixa">
          <div className='topicos'>
            <div className='doadoresTexto'>
            <h2>Para Doadores</h2>
            <p>Contribuir para uma causa é um ato de confiança, e queremos tornar essa experiência mais transparente. Nossa plataforma permite que você faça doações de forma simples e acompanhe exatamente como as ONGs estão utilizando esses recursos. Dessa forma, garantimos mais segurança e incentivamos a participação ativa no impacto social.</p>
            </div>
            <img className='imgDoadores' src={"src/assets/paraDoadoer.jpg"}/>
          </div>
        </div>
      </div>
      
      <div className="titulo">
        <hr className="linha"/>
        <h2>Para ONGs</h2>
        <hr className="linha"/>
      </div>
      <div className="topicosONG">
        <div className="ongConteudo">
          <div className='ongFrase'>
            <h3>Facilitamos a gestão financeira da sua organização com ferramentas intuitivas e completas:</h3>
          </div>
          <div className='ongTexto'>
            <ul>
              <li>Painel de Controle Financeiro: Acompanhe receitas, despesas e relatórios detalhados.</li>
              <li>Gráficos e Relatórios: Visualize de forma clara como os recursos estão sendo aplicados.</li>
              <li>Transparência com Doadores: Exiba dados sobre os investimentos feitos com as doações, aumentando a credibilidade da sua ONG.</li>
              <li>Nosso objetivo é conectar organizações e doadores, garantindo que cada contribuição tenha um impacto real e mensurável.</li>
            </ul>
          </div>
        </div>
        <div className="containerImgOngs">
          <img className='imgOngs' src={"src/assets/paraOngs.png"}/>
        </div>
      </div>
    </div>
    </>
  );
}

export default Saq