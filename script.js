// Definindo variáveis constantes para guardar os valores de altura e largura do jogo
const larguraJogo = 700;
const alturaJogo = 850;

// Configuração do jogo
const config = {
    type: Phaser.AUTO,
    width: larguraJogo,
    height: alturaJogo,

    // Ativando a física no jogo
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false // Modo de depuração (não mostra os corpos físicos)
        }
    },

    // Funções de cena do jogo
    scene: {
        preload: preload, // Carrega recursos
        create: create,   // Configura elementos iniciais
        update: update    // Atualiza o jogo a cada quadro
    }
};

// Criação do jogo com a configuração definida acima
const game = new Phaser.Game(config);

// Variáveis para os elementos do jogo
var alien;         // Sprite do alienígena
var teclado;       // Teclado
var fogo;          // Sprite do fogo (turbo)
var plataforma;    // Plataforma
var moeda;         // Moeda
var pontuacao = 0; // Pontuação inicial
var placar;        // Texto do placar
var coracao;       // Sprite do coração

console.log(variaveisJogo[5]);

// Função para carregar os recursos do jogo
function preload() {
    this.load.image('background', 'assets/bg.png');         // Fundo do jogo
    this.load.image('alien', 'assets/alienigena.png');      // Sprite do alienígena
    this.load.image('turbo_nave', 'assets/turbo.png');      // Sprite do turbo (fogo)
    this.load.image('plataforma_tijolo', 'assets/tijolos.png'); // Sprite da plataforma
    this.load.image('moeda', 'assets/moeda.png');           // Sprite da moeda
    this.load.image('coracao', 'assets/coracao.png');       // Sprite de vidas
}

// Função para configurar os elementos iniciais do jogo
function create() {
    this.add.image(larguraJogo / 2, alturaJogo / 2, 'background'); // Adiciona o fundo do jogo

    // Configuração do sprite do fogo
    fogo = this.add.sprite(0, 0, 'turbo_nave');
    fogo.setVisible(false); // Inicialmente invisível

    // Configuração do sprite do alienígena
    alien = this.physics.add.sprite(larguraJogo / 2, 0, 'alien');
    alien.setCollideWorldBounds(true); // Colisão com os limites do mundo
    teclado = this.input.keyboard.createCursorKeys(); // Captura de input do teclado

    // Configuração da plataforma
    plataforma = this.physics.add.staticGroup();

    //  Criar algumas plataformas
    plataforma.create(600, 435, 'plataforma_tijolo');
    plataforma.create(100, 435, 'plataforma_tijolo');
    this.physics.add.collider(alien, plataforma); // Colisão com a plataforma

    // Configuração da moeda
    moeda = this.physics.add.sprite(larguraJogo / 2, 0, 'moeda');
    moeda.setCollideWorldBounds(true); // Colisão com os limites do mundo
    moeda.setBounce(0.7); // Elasticidade da moeda
    this.physics.add.collider(moeda, plataforma); // Colisão com a plataforma

    // Adiciona o placar
    placar = this.add.text(50, 50, 'Moedas:' + pontuacao, { fontSize: '45px', fill: '#495613' });

    // Detecta colisão entre o alienígena e a moeda
    this.physics.add.overlap(alien, moeda, function () {
        moeda.setVisible(false); // Moeda fica "invisível"

        // Define uma nova posição para a moeda
        var posicaoMoeda_Y = Phaser.Math.RND.between(50, 650);
        moeda.setPosition(posicaoMoeda_Y, 100);

        placar.setText('Moedas:' + pontuacao); // Atualiza o texto do placar
        pontuacao += 1; // Soma pontuação

        moeda.setVisible(true); // Torna a moeda visível novamente
    });

    coracao = this.physics.add.staticGroup();
    coracao.create(500, 70, 'coracao');
    coracao.create(550, 70, 'coracao');
    coracao.create(600, 70, 'coracao');
}

// Função para atualizar a lógica do jogo a cada quadro
function update() {
    // Movimento para a esquerda
    if (teclado.left.isDown) {
        alien.setVelocityX(-150);
    }
    // Movimento para a direita
    else if (teclado.right.isDown) {
        alien.setVelocityX(150);
    }
    // Sem movimento horizontal
    else {
        alien.setVelocityX(0);
    }

    // Movimento para cima
    if (teclado.up.isDown) {
        alien.setVelocityY(-150);
        ativarTurbo(); // Ativa o turbo
    }
    // Movimento para baixo
    else {
        semTurbo(); // Desativa o turbo
    }

    fogo.setPosition(alien.x, alien.y + alien.height / 2); // Posiciona o turbo acima do alienígena

    if (alien.y === (alturaJogo - (alien.height / 2))) {
        alien.y = 200;
        alien.x = larguraJogo / 2;
        tirarCoracao();
    }

    if (coracao.visible < 3) {
        game.scene.start();
    }
}

function tirarCoracao() {
    for (var i = 0; i < 3; i++) {
        if (coracao.children.entries[i].visible) { // Verifica se o coração na posição i está visível
            coracao.children.entries[i].setVisible(false); // Torna o coração na posição i invisível
            break; // Sai do loop após encontrar e esconder um coração
        }
    }
}

// Função para ativar o turbo
function ativarTurbo() {
    fogo.setVisible(true);
}

// Função para desativar o turbo
function semTurbo() {
    fogo.setVisible(false);
}