class Veiculo {
    constructor(tipo, marca, cor, velocidade, passageiros){
        this.tipo = tipo;
        this.marca = marca;
        this.cor = cor;
        this.velocidade = velocidade;
        this.passageiros = passageiros;
    }
    acelerar = function(){
        this.velocidade += 10;
        console.log(this.velocidade);
    }
    freiar = function(){
        if (this.velocidade > 0) {
            this.velocidade -= 5
        console.log(this.velocidade);
    } else {
        console.log("Veículo TA pAraADo");
    }
}}
const carro = new Veiculo('SUV', 'Renault', 'Cinza', 0, 0)
const outro_carro = new Veiculo('Hatch', 'golf', 'cinza', 0 ,0)
outro_carro.acelerar();
carro.acelerar();
carro.acelerar();
carro.freiar();
carro.acelerar();
outro_carro.freiar()
