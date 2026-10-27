// =====================================================
//  DADOS DO JOGO (aqui você edita exercícios e dicas)
// =====================================================

// "correta" é o índice (começando em 0) da resposta certa em "opcoes".
// As opções são embaralhadas na tela, então a posição não importa.
const exerciciosCalculo = [
    {
        enunciado: "Quais são as raízes de f(x) = x² − 5x + 6?",
        opcoes: ["x = 2 e x = 3", "x = 1 e x = 6", "x = −2 e x = −3", "x = 5 e x = 6"],
        correta: 0,
        dica: "Raízes: x = (−b ± √Δ) / 2a, com Δ = b² − 4ac. Aqui a = 1, b = −5 e c = 6."
    },
    {
        enunciado: "Qual é o vértice da parábola f(x) = x² − 4x + 3?",
        opcoes: ["(2, −1)", "(−2, 1)", "(4, 3)", "(1, 0)"],
        correta: 0,
        dica: "Vértice: xv = −b / 2a. Depois é só substituir xv na função para achar yv."
    },
    {
        enunciado: "Qual é o discriminante (Δ) de f(x) = x² + 2x − 3?",
        opcoes: ["16", "−8", "4", "−16"],
        correta: 0,
        dica: "Δ = b² − 4·a·c. Cuidado com o sinal do c!"
    },
    {
        enunciado: "Quais são as raízes de f(x) = x² − 7x + 12?",
        opcoes: ["x = 3 e x = 4", "x = 2 e x = 6", "x = −3 e x = −4", "x = 1 e x = 12"],
        correta: 0,
        dica: "Soma das raízes = −b / a e produto = c / a. Aqui a soma é 7 e o produto é 12."
    },
    {
        enunciado: "Qual é o valor máximo de f(x) = −x² + 4x?",
        opcoes: ["4", "2", "−4", "0"],
        correta: 0,
        dica: "Com a < 0 a parábola abre para baixo e o máximo está no vértice. Ache xv = −b / 2a e substitua na função."
    },
    {
        enunciado: "Em que ponto o gráfico de f(x) = x² + 5x − 2 corta o eixo y?",
        opcoes: ["(0, −2)", "(−2, 0)", "(0, 5)", "(0, 2)"],
        correta: 0,
        dica: "O gráfico corta o eixo y quando x = 0. Nesse caso, f(0) é igual ao coeficiente c."
    }
];

const exerciciosDiscreta = [
    {
        enunciado: "A = {1,2,3,4,5} e B = {4,5,6,7}. Quanto vale A ∪ B?",
        opcoes: ["{1,2,3,4,5,6,7}", "{4,5}", "{1,2,3}", "{1,2,3,6,7}"],
        correta: 0,
        dica: "União (A ∪ B): todos os elementos que estão em A OU em B, sem repetir."
    },
    {
        enunciado: "A = {1,2,3,4,5} e B = {4,5,6,7}. Quanto vale A ∩ B?",
        opcoes: ["{4,5}", "{1,2,3,4,5,6,7}", "{6,7}", "{1,2,3}"],
        correta: 0,
        dica: "Interseção (A ∩ B): só os elementos que estão em A E em B ao mesmo tempo."
    },
    {
        enunciado: "A = {1,2,3,4,5} e B = {4,5,6,7}. Quanto vale A − B?",
        opcoes: ["{1,2,3}", "{6,7}", "{4,5}", "{1,2,3,6,7}"],
        correta: 0,
        dica: "Diferença (A − B): os elementos de A que NÃO estão em B."
    },
    {
        enunciado: "X = {2,4,6,8,10} e Y = {6,8,10,12}. Quanto vale Y − X?",
        opcoes: ["{12}", "{2,4}", "{6,8,10}", "{2,4,12}"],
        correta: 0,
        dica: "Y − X: os elementos de Y que NÃO estão em X. Cuidado: a ordem importa!"
    },
    {
        enunciado: "A = {1,2,3} e B = {3,4,5,6}. Quantos elementos tem A ∪ B?",
        opcoes: ["6", "7", "4", "3"],
        correta: 0,
        dica: "A ∪ B não repete elementos: o 3 está nos dois conjuntos, mas conta só uma vez. Liste a união e conte."
    },
    {
        enunciado: "A = {1,3,5} e B = {2,4,6}. Quanto vale A ∩ B?",
        opcoes: ["∅ (conjunto vazio)", "{1,2,3,4,5,6}", "{1,3,5}", "{2,4,6}"],
        correta: 0,
        dica: "Interseção: o que está nos dois conjuntos. Se não há nenhum elemento em comum, o resultado é o conjunto vazio, ∅."
    }
];

// Configuração de cada cena: classe do fundo, se é sala, texto da barra do topo
const cenas = {
    calculo: {
        classe: "sala calculo", sala: true,
        instrucao: "CÁLCULO I — Clique no quadro para resolver. Clique na porta para sair.",
        professor: "images/characters/laudelindo.png", nomeProf: "Prof. Laudelindo"
    },
    corredor: {
        classe: "corredor", sala: false, instrucao: "",
        professor: "images/characters/newsusu.png", nomeProf: "Profa. Susu"
    },
    discreta: {
        classe: "sala discreta", sala: true,
        instrucao: "MATEMÁTICA DISCRETA — Clique no quadro para resolver. Clique na porta para sair.",
        professor: "images/characters/newsusu.png", nomeProf: "Profa. Susu"
    },
    rua:    { classe: "rua",    sala: false, instrucao: "" },
    quarto: { classe: "quarto", sala: false, instrucao: "" }
};

// =====================================================
//  PERSONAGENS (botão "Personagem" da tela inicial)
// =====================================================
// nome     = texto que aparece embaixo da carta
// imagem   = sprite que aparece nas cenas e na tela de escolha
// dormindo = imagem da cena final (quarto) desse personagem
// Os caminhos são relativos ao index.html. O primeiro é o personagem padrão.
const personagens = [
    {
        nome: "Sung Jinwoo",
        imagem: "images/characters/jinwoonew.png",
        dormindo: "images/scenario/jinwoodormes.jpeg",
        posX: 0,
        posY: 0,
        escala: 1.0
    },
    {
        nome: "Sakura Haruno",
        imagem: "images/characters/sakura.png",
        dormindo: "images/scenario/sakuradormes.jpeg",
        posX: -20,
        posY: 10,
        escala: 0
    },
    {
        nome: "Eren Yeager",
        imagem: "images/characters/eren.png",
        dormindo: "images/scenario/erendormes.jpeg",
        posX: -15,
        posY: 10,
        escala: 1.2
    }
];

// =====================================================
//  MÚSICAS (pasta songs)
// =====================================================
// arquivo = caminho relativo ao index.html (confira o nome e a extensão: .mp3, .wav, .ogg)
// volume  = de 0 (mudo) até 1 (máximo)
const musicas = {
    menu:   { arquivo: "songs/entradafacul.mp3", volume: 0.5 },   // tela inicial, personagens e corredor
    sala:   { arquivo: "songs/sala.mp3", volume: 0.5 },   // sala de Cálculo I e de Matemática Discreta
    rua:    { arquivo: "songs/saidafacul.mp3", volume: 0.5 },   // fora da universidade (despedida)
    quarto: { arquivo: "songs/dormindo.mp3", volume: 0.5, inicio: 5 }    // começa aos 5 segundos
};