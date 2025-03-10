const canvas = document.getElementById('jogo2D');
const ctx = canvas.getContext('2d');

const chaoY = canvas.height - 43; 

let gameOver =false;


const obstaculo = {
    x: 850,
    y: chaoY - 100,
    largura: 130,
    altura: 100,
    velocidadex: 5,
}

const personagem = {
    x: 100,
    y: chaoY - 160,
    largura: 130,
    altura: 160,
    velocidadey: 0,
    pulando: false,
    larguraPulo: 190, 
    alturaPulo: 195
}

const gravidade = 0.4;

const imgPersonagem = new Image();
imgPersonagem.src = 'hollow-knight-walk.gif';   

const imgPersonagemPulo = new Image();
imgPersonagemPulo.src = 'imagempulo.webp'; 

const imgObstaculo = new Image();
imgObstaculo.src = 'Crawlid.png'; 

const imgMorte = new Image();
imgMorte.src = 'gameOver.jpg'; 



document.addEventListener('keypress', (e) => {
    if (e.code === 'Space' && !personagem.pulando) {
        personagem.velocidadey = 15;
        personagem.pulando = true;
    }
});
document.addEventListener('click', (e) => {
    if(gameOver == true){
        location.reload()
    }
})

function desenharPersonagem() {
    if (personagem.pulando) {
        ctx.drawImage(imgPersonagemPulo, personagem.x, personagem.y, personagem.larguraPulo, personagem.alturaPulo);
    } else {
        ctx.drawImage(imgPersonagem, personagem.x, personagem.y, personagem.largura, personagem.altura);
        }
    }

function desenharObstaculo () {
    ctx.drawImage(imgObstaculo, obstaculo.x, obstaculo.y , obstaculo.largura , obstaculo.altura)
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



function atualizarObstaculo () {
    obstaculo.x -= obstaculo.velocidadex
    if(obstaculo.x <= 0 - obstaculo.largura){
        obstaculo.x = canvas.width
        obstaculo.velocidadex += 0.5
        let nova_altura = (Math.random() * 50) + 100
        obstaculo.altura = nova_altura
        obstaculo.y = chaoY - obstaculo.altura
    }
}

function verificarColisao() {
    if(
        personagem.x < obstaculo.x + obstaculo.largura &&
        personagem.x + personagem.largura > obstaculo.x &&
        personagem.y < obstaculo.y + obstaculo.altura &&
        personagem.y + personagem.altura > obstaculo.y
    ){
       HouveColisao()
    }
}

function HouveColisao(){
    gameOver = true
    personagem.velocidadey = 0
    obstaculo.velocidadex = 0
    ctx.drawImage(imgMorte, 0 , 0, canvas.width, canvas.height)
}

function loop () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    desenharObstaculo();
    desenharPersonagem();   
    verificarColisao ();
    atualizarPersonagem();
    atualizarObstaculo ();
    requestAnimationFrame(loop);
    }
        
loop()