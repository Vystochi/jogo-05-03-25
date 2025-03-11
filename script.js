const canvas = document.getElementById('jogo2D');
const ctx = canvas.getContext('2d');

const chaoY = canvas.height - 43; 
let gameOver = false;
let aceleracaoQueda = 0;
let jogoIniciado = false;
let teclas = { esquerda: false, direita: false, espaco: false };
let fadeIn = false;
let alpha = 0;

const imgPersonagem = new Image();
imgPersonagem.src = 'Parado.webp';
const imgPersonagemPulo = new Image();
imgPersonagemPulo.src = 'imagempulo.png';
const imgObstaculo1 = new Image();
imgObstaculo1.src = 'Crawlid.png';
const imgObstaculo2 = new Image();
imgObstaculo2.src = 'obstaculo medio.webp';
const imgObstaculo3 = new Image();
imgObstaculo3.src = 'obstaculo grande.webp';
const imgMorte = new Image();
imgMorte.src = 'gameOver.jpg';
const imgAndando = new Image();
imgAndando.src = 'andando.gif';

const obstaculos = [
    { x: 850, y: chaoY - 80, largura: 100, altura: 80, velocidadex: 5, imagem: imgObstaculo1 },
    { x: 1200, y: chaoY - 120, largura: 110, altura: 120, velocidadex: 4, imagem: imgObstaculo2 },
    { x: 1500, y: chaoY - 130, largura: 150, altura: 130, velocidadex: 6, imagem: imgObstaculo3 }
];

const personagem = {
    x: 100, 
    y: chaoY - 140, 
    largura: 75, 
    altura: 140,
    desaceleracao: 0.89, 
    aceleracao: 1, 
    velocidadeX: 0, 
    velocidadey: 0,
    pulando: false, 
    larguraPulo: 140, 
    alturaPulo: 140,
    olhandoDireita: true,
    larguraAndando: 130,
    alturaAndando: 150,
};

const gravidade = 0.5;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !personagem.pulando) {
        personagem.velocidadey = 15;
        personagem.pulando = true;
    }
    if (e.code === 'KeyD') {
        teclas.direita = true;
        personagem.olhandoDireita = true;
    }
    if (e.code === 'KeyA') {
        teclas.esquerda = true;
        personagem.olhandoDireita = false;
    }
    if (e.code === 'KeyS') { 
        aceleracaoQueda = 1; 
    }
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'KeyD') teclas.direita = false;
    if (e.code === 'KeyA') teclas.esquerda = false;
    if (e.code === 'KeyS') { 
        aceleracaoQueda = 0;
    }
});

document.addEventListener('click', () => { if (gameOver) location.reload(); });

function desenharTelaInicial() {
    ctx.fillStyle = 'black';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Clique para começar', canvas.width / 2, canvas.height / 2);
}

document.addEventListener('click', () => {
    if (!jogoIniciado) {
        jogoIniciado = true;
        loop();
    } else if (gameOver) {
        location.reload(); 
    }
});

function desenharPersonagem() {
    ctx.save();
    let largura, altura, imagemAtual;

    if (personagem.pulando) {
        largura = personagem.larguraPulo;
        altura = personagem.alturaPulo;
        imagemAtual = imgPersonagemPulo;
    } else if (teclas.direita || teclas.esquerda) {
        largura = personagem.larguraAndando;
        altura = personagem.alturaAndando;
        imagemAtual = imgAndando;
    } else {
        largura = personagem.largura;
        altura = personagem.altura;
        imagemAtual = imgPersonagem;
    }

    if (!personagem.olhandoDireita) {
        ctx.scale(-1, 1);
        ctx.drawImage(imagemAtual, -personagem.x - largura, personagem.y, largura, altura);
    } else {
        ctx.drawImage(imagemAtual, personagem.x, personagem.y, largura, altura);
    }

    ctx.restore();
}

function desenharObstaculos() {
    obstaculos.forEach(obs => {
        ctx.drawImage(obs.imagem, obs.x, obs.y, obs.largura, obs.altura);
    });
}

function atualizarPersonagem() {
    if (teclas.direita) personagem.velocidadeX += personagem.aceleracao;
    else if (teclas.esquerda) personagem.velocidadeX -= personagem.aceleracao;
    else personagem.velocidadeX *= personagem.desaceleracao;

    personagem.velocidadeX = Math.max(-5, Math.min(5, personagem.velocidadeX));
    personagem.x += personagem.velocidadeX;

    if (personagem.pulando) {
        personagem.velocidadey -= gravidade;
        personagem.y -= personagem.velocidadey;
        if (personagem.y >= chaoY - personagem.altura) {
            personagem.y = chaoY - personagem.altura;
            personagem.velocidadey = 0;
            personagem.pulando = false;
        }
    }
}

function atualizarObstaculos() {
    obstaculos.forEach(obs => {
        obs.x -= obs.velocidadex;
        if (obs.x <= -obs.largura) {
            obs.x = canvas.width + Math.random() * 200;
        }
    });
}

function verificarColisao() {
    obstaculos.forEach(obs => {
        let margem = 20;

        let larguraPersonagem = personagem.pulando ? personagem.larguraPulo : personagem.largura;
        let alturaPersonagem = personagem.pulando ? personagem.alturaPulo : personagem.altura;

        let ajusteX = personagem.pulando ? (personagem.larguraPulo - personagem.largura) / 2 : 0;
        let ajusteY = personagem.pulando ? (personagem.altura - personagem.alturaPulo) / 2 : 0;

        if (!personagem.olhandoDireita) {
            ajusteX = -ajusteX; 
        }

        let xPersonagem = personagem.x + ajusteX;
        let yPersonagem = personagem.y + ajusteY;

        if (
            xPersonagem < obs.x + obs.largura - margem &&
            xPersonagem + larguraPersonagem > obs.x + margem &&
            yPersonagem < obs.y + obs.altura - margem &&
            yPersonagem + alturaPersonagem > obs.y + margem
        ) {
            HouveColisao();
        }
    });
}

function HouveColisao() {
    gameOver = true;
    personagem.velocidadey = 0;
    obstaculos.forEach(obs => obs.velocidadex = 0);
    ctx.drawImage(imgMorte, 0, 0, canvas.width, canvas.height);
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!jogoIniciado) {
        desenharTelaInicial(); 
    } else {
        if (!gameOver) {
            desenharObstaculos();
            desenharPersonagem();
            verificarColisao();
            atualizarPersonagem();
            atualizarObstaculos();
            requestAnimationFrame(loop);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(imgMorte, 0, 0, canvas.width, canvas.height);
        }
    }
}

loop();