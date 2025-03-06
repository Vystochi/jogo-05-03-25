const canvas = document.getElementById('jogo2D');

const ctx = canvas.getContext('2d');

const chaoY = canvas.height - 43; 

const personagem = {
    x: 100,
    y: chaoY - 43,
    largura: 80,
    altura: 100,
    velocidadey: 0,
    pulando: false,
    larguraPulo: 115, 
    alturaPulo: 120
}

const gravidade = 0.5;

const imgPersonagem = new Image();
imgPersonagem.src = 'hollow-knight-walk.gif';   

const imgPersonagemPulo = new Image();
imgPersonagemPulo.src = 'imagempulo.webp'; 

document.addEventListener('keypress', (e) => {
    if (e.code === 'Space' && !personagem.pulando) {
        personagem.velocidadey = 15;
        personagem.pulando = true;
    }
    if (e.code === 'KeyD') {
        personagem.x += 10; 
        personagem.viradoParaEsquerda = false;
    }
    if (e.code === 'KeyA') {
        personagem.x -= 10; 
        personagem.viradoParaEsquerda = true;
    }
});

function desenharPersonagem() {
    if (personagem.viradoParaEsquerda) {
        ctx.scale(-1, 1); 
        ctx.drawImage(imgPersonagem, -personagem.x - personagem.largura, personagem.y, personagem.largura, personagem.altura);
    } else {
        ctx.drawImage(imgPersonagem, personagem.x, personagem.y, personagem.largura, personagem.altura);
    }
}
function atualizarPersonagem() {
    if (personagem.pulando == true) {
        personagem.velocidadey -= gravidade;
        personagem.y -= personagem.velocidadey;
        
        if (personagem.y >= chaoY - personagem.altura) {
            personagem.y = chaoY - personagem.altura;  
            personagem.velocidadey  = 0; 
            personagem.pulando = false; 
        }
    }

}

function loop () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharPersonagem();   
    requestAnimationFrame(loop);
    atualizarPersonagem();
}

loop()