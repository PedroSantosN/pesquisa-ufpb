// =====================================================
//  LÓGICA DO JOGO
//  (os exercícios, dicas e cenas ficam em dados.js)
// =====================================================

// =====================================================
//  ESTADO DO JOGO
// =====================================================
const estado = {
    cena: null,
    exercicios: [],
    resolvidos: 0,
    liberada: false,
    profEmoji: "👨‍🏫",
    profNome: "Professor",
    personagem: 0   // índice do personagem escolhido (lista "personagens" em dados.js)
};

// =====================================================
//  ELEMENTOS DA PÁGINA
// =====================================================
const $ = (id) => document.getElementById(id);

const figura = (x) => /\.(png|gif|jpe?g|webp)$/i.test(x) ? `<img src="${x}" alt="">` : x;
const cenaEl = $("cena"), quadro = $("quadro"), quadroInfo = $("quadro-info");
const porta = $("porta"), portaIcone = $("porta-icone"), professorEl = $("professor");
const jogadorEl = $("jogador"), colegaEl = $("colega"), instrucao = $("instrucao");
const caixa = $("caixa-texto"), nomeFala = $("nome-fala"), textoFala = $("texto-fala");
const escolhas = $("escolhas");
const painel = $("painel"), profCabeca = $("prof-cabeca"), balao = $("balao");
const numero = $("numero"), enunciado = $("enunciado"), opcoesEl = $("opcoes"), feedback = $("feedback");
const tela = $("tela");

// ----- Escolha de personagem (criada aqui, não precisa mexer no index.html) -----
const btnPersonagem = document.createElement("button");
btnPersonagem.id = "btn-personagem";
btnPersonagem.textContent = "Personagem";
btnPersonagem.hidden = true;
$("tela-botao").after(btnPersonagem);

const selecao = document.createElement("div");
selecao.id = "selecao";
selecao.hidden = true;
$("game-container").appendChild(selecao);

function montarSelecao() {
    selecao.innerHTML = `
        <h2>ESCOLHA SEU PERSONAGEM</h2>
        <div id="cartas"></div>
        <button id="btn-confirmar">Confirmar</button>`;

    personagens.forEach((p, i) => {
        const carta = document.createElement("button");
        carta.className = "carta" + (i === estado.personagem ? " escolhida" : "");
        carta.innerHTML = figura(p.imagem) + `<span>${p.nome}</span>`;
        carta.addEventListener("click", () => {
            estado.personagem = i;
            montarSelecao();   // redesenha para destacar a carta escolhida
        });
        $("cartas").appendChild(carta);
    });

    $("btn-confirmar").addEventListener("click", () => (selecao.hidden = true));
}

btnPersonagem.addEventListener("click", () => {
    montarSelecao();
    selecao.hidden = false;
});

// ----- Apagão: escurece a tela quando o personagem dorme -----
const apagao = document.createElement("div");
apagao.id = "apagao";
$("game-container").appendChild(apagao);

// Escurece devagar e chama "depois" quando a tela já estiver toda preta
function escurecerTela(depois) {
    apagao.classList.add("escuro");
    const css = getComputedStyle(apagao);
    const ms = (parseFloat(css.transitionDuration) + parseFloat(css.transitionDelay)) * 1000;
    setTimeout(depois, ms);
}

// Tira o escurecimento na hora, sem animação (para quando o jogo recomeça)
function limparApagao() {
    apagao.style.transition = "none";
    apagao.classList.remove("escuro");
    void apagao.offsetWidth;   // força o navegador a aplicar antes de religar a animação
    apagao.style.transition = "";
}

// ----- Música -----
const faixas = {};      // guarda um objeto de áudio por música
let faixaAtual = null;  // nome da música que está tocando agora

function tocarMusica(nome) {
    if (nome === faixaAtual) return;   // já está tocando: não pausa nem recomeça

    // para a música anterior
    if (faixaAtual) {
        faixas[faixaAtual].pause();
        faixas[faixaAtual].currentTime = 0;   // apague esta linha para a música retomar de onde parou
    }

    faixaAtual = nome;

    // cria o áudio na primeira vez que a música é usada
    if (!faixas[nome]) {
        faixas[nome] = new Audio(musicas[nome].arquivo);
        faixas[nome].loop = true;
        faixas[nome].volume = musicas[nome].volume ?? 0.5;
    }

    const musica = faixas[nome];
    // começa no segundo definido em "inicio" (sem ele, começa do 0)
    const iniciarEm = musicas[nome].inicio ?? 0;
    if (musica.readyState > 0) {
        musica.currentTime = iniciarEm;
    } else {
        // o arquivo ainda está carregando: ajusta o tempo assim que ele estiver pronto
        musica.addEventListener("loadedmetadata", () => { musica.currentTime = iniciarEm; }, { once: true });
    }
    

    musica.play().catch((erro) => {
        if (erro.name === "NotAllowedError") {
            // o navegador bloqueia som antes do primeiro clique: tenta de novo no primeiro clique ou tecla
            const liberar = () => {
                document.removeEventListener("pointerdown", liberar);
                document.removeEventListener("keydown", liberar);
                if (faixaAtual === nome) musica.play().catch(() => {});
            };
            document.addEventListener("pointerdown", liberar);
            document.addEventListener("keydown", liberar);
        } else if (erro.name !== "AbortError") {
            console.warn("Não consegui tocar a música:", musicas[nome].arquivo, erro.name);
        }
    });
}

// =====================================================
//  CENAS
// =====================================================
function mostrarCena(nome) {
    limparApagao();
    const c = cenas[nome];
    estado.cena = nome;
    cenaEl.className = "cena " + c.classe;
    cenaEl.style.backgroundImage = "";   // limpa o fundo trocado na cena final

    quadro.hidden = !c.sala;
    porta.hidden = !c.sala;
    instrucao.textContent = c.instrucao;
    instrucao.hidden = !c.instrucao;

    if (c.professor) {
        estado.profEmoji = c.professor;
        estado.profNome = c.nomeProf;
    }

// Reseta os personagens usando imagens
const personagemAtual = personagens[estado.personagem];

jogadorEl.innerHTML = figura(personagemAtual.imagem);
colegaEl.innerHTML = figura("images/characters/mikasanew.png");

// Posição individual do jogador nos cenários
jogadorEl.style.setProperty("--posX", `${personagemAtual.posX || 0}px`);
jogadorEl.style.setProperty("--posY", `${personagemAtual.posY || 0}px`);

professorEl.hidden = true;
}

// =====================================================
//  SISTEMA DE DIÁLOGO (clique na caixa para avançar)
// =====================================================
let fila = [];
let aoTerminar = null;

function nomeDe(quem) {
    const nomes = { jogador: "Você", colega: "Colega", prof: estado.profNome, narrador: "" };
    return nomes[quem];
}

function destacar(quem) {
    jogadorEl.classList.toggle("falando", quem === "jogador");
    colegaEl.classList.toggle("falando", quem === "colega");
    if (quem === "prof") {
        professorEl.innerHTML = figura(estado.profEmoji);
        professorEl.hidden = false;
    } else {
        professorEl.hidden = true;
    }
}

// linhas = [{ quem: "jogador" | "colega" | "prof" | "narrador", texto: "..." }]
function falar(linhas, depois) {
    fila = [...linhas];
    aoTerminar = depois || null;
    caixa.hidden = false;
    proximaFala();
}

function proximaFala() {
    if (fila.length === 0) {
        caixa.hidden = true;
        destacar(null);
        const f = aoTerminar;
        aoTerminar = null;
        if (f) f();
        return;
    }
    const fala = fila.shift();
    nomeFala.textContent = nomeDe(fala.quem);
    textoFala.textContent = fala.texto;
    destacar(fala.quem);
}

caixa.addEventListener("click", proximaFala);

// true se alguma coisa está aberta na tela (bloqueia outros cliques)
function ocupado() {
    return !caixa.hidden || !painel.hidden || !escolhas.hidden || !tela.hidden;
}

// =====================================================
//  TELA GRANDE (início, falta, fim)
// =====================================================
function mostrarTela(titulo, texto, botao, acao, classe = "") {
    tela.className = classe;
    btnPersonagem.hidden = true;   // o botão "Personagem" só aparece na tela inicial
    $("tela-titulo").innerHTML = figura(titulo);
    const imagem = $("tela-titulo").querySelector("img");
        if (imagem && classe === "inicio") {
        imagem.style.position = "relative";
        imagem.style.top = "-35px";
}
    $("tela-texto").textContent = texto;
    $("tela-botao").textContent = botao;
    $("tela-botao").onclick = () => {
        tela.hidden = true;
        acao();
    };
    tela.hidden = false;
}

// =====================================================
//  SALA: EXERCÍCIOS E PORTA
// =====================================================
function iniciarSala(nomeCena, exercicios) {
    mostrarCena(nomeCena);
    estado.exercicios = exercicios;
    estado.resolvidos = 0;
    estado.liberada = false;
    atualizarSala();
}

function atualizarSala() {
    quadroInfo.textContent = `Exercícios: ${estado.resolvidos}/${estado.exercicios.length}`;
    porta.classList.toggle("aberta", estado.liberada);
    portaIcone.textContent = estado.liberada ? "🔓" : "🔒";
}

function embaralhar(lista) {
    return lista.sort(() => Math.random() - 0.5);
}

function abrirPainel() {
    if (estado.liberada) {
        falar([{ quem: "prof", texto: "Vocês já terminaram tudo! Podem sair pela porta." }]);
        return;
    }
    profCabeca.innerHTML = figura(estado.profEmoji);
    painel.hidden = false;
    mostrarExercicio("");
}

function mostrarExercicio(mensagemErro) {
    const ex = estado.exercicios[estado.resolvidos];

    numero.textContent = `Exercício ${estado.resolvidos + 1} de ${estado.exercicios.length}`;
    balao.textContent = "💡 " + ex.dica;
    enunciado.textContent = ex.enunciado;
    feedback.textContent = mensagemErro;
    feedback.className = mensagemErro ? "erro" : "";

    opcoesEl.innerHTML = "";
    const opcoes = ex.opcoes.map((texto, i) => ({ texto, certa: i === ex.correta }));
    embaralhar(opcoes).forEach((op) => {
        const b = document.createElement("button");
        b.className = "opcao";
        b.textContent = op.texto;
        b.addEventListener("click", () => responder(op.certa));
        opcoesEl.appendChild(b);
    });
}

function responder(certa) {
    // Errou: o exercício NÃO conta, e a pergunta volta com as opções embaralhadas
    if (!certa) {
        mostrarExercicio("Errado! Tente de novamente.");
        return;
    }

    // Acertou
    estado.resolvidos++;
    atualizarSala();
    feedback.textContent = "Boa, acertou!";
    feedback.className = "ok";
    opcoesEl.querySelectorAll("button").forEach((b) => (b.disabled = true));

    setTimeout(() => {
        if (estado.resolvidos < estado.exercicios.length) {
            if (!painel.hidden) mostrarExercicio("");
        } else {
            // Terminou todos: libera a porta
            painel.hidden = true;
            estado.liberada = true;
            atualizarSala();
            falar([
                { quem: "prof", texto: "O que? Terminaram tudo mesmo?" },
                { quem: "prof", texto: "Hmm... Então tá, estão liberados." },
                { quem: "colega", texto: estado.cena === "discreta" ? "Vambora!!" : "AAAA LIBERDADE!!" }
            ]);
        }
    }, 1000);
}

$("fechar-painel").addEventListener("click", () => (painel.hidden = true));

quadro.addEventListener("click", () => {
    if (ocupado()) return;
    abrirPainel();
});

porta.addEventListener("click", () => {
    if (ocupado()) return;

    if (estado.liberada) {
        if (estado.cena === "calculo") iniciarCorredor();
        else iniciarRua();
        return;
    }

    // Porta trancada: o professor avisa e o jogador decide
    falar(
        [{ quem: "prof", texto: "Aí! Se vocês saírem sem finalizar os exercícios, vou dar falta aos dois!" }],
        () => (escolhas.hidden = false)
    );
});

$("btn-voltar").addEventListener("click", () => (escolhas.hidden = true));

$("btn-sair").addEventListener("click", () => {
    escolhas.hidden = true;
    mostrarTela(
        "images/boxes/falta.png",
        "Você saiu sem terminar as atividades! Você reprovou por falta.",
        "Tentar de novo",
        () => (estado.cena === "calculo" ? iniciarCalculo() : iniciarDiscreta()),
        "falta"
    );
});

// =====================================================
//  HISTÓRIA (sequência das fases)
// =====================================================
function iniciarJogo() {
    tocarMusica("menu");
    mostrarCena("calculo");
    mostrarTela(
        "images/boxes/logonew.png",
        "Conclua sua rotina acadêmica com êxito para ir para casa descansar!.",
        "Vamos lá",
        iniciarCalculo,
        "inicio"
    );
    btnPersonagem.hidden = false;   // botão "Personagem" só na tela inicial
}

function iniciarCalculo() {
    tocarMusica("sala");
    iniciarSala("calculo", exerciciosCalculo);
    falar([
        { quem: "colega", texto: "Cara... que sono. Eu só queria estar dormindo." },
        { quem: "jogador", texto: "Eu também... Dormi muito mal." },
        { quem: "colega", texto: "Só temos duas disciplinas hoje. E se a gente for embo-" },
        { quem: "narrador", texto: "De repente, Laudelindo spawna na sala!" },
        { quem: "prof", texto: "Bom dia! Hoje teremos exercício de revisão. Vocês tem duas opções..." },
        { quem: "prof", texto: "... fazer ou fazer! hahaHAHAHAHA!" },
        { quem: "colega", texto: "..." },
        { quem: "jogador", texto: "É, não vai ter jeito..." }
    ]);
}

function iniciarCorredor() {
    tocarMusica("menu");
    mostrarCena("corredor");
    falar(
        [
            { quem: "jogador", texto: "Nossa, finalmente..." },
            { quem: "colega", texto: "Finalmente! Achei que a gente nunca ia sair daquela sala." },
            { quem: "colega", texto: "Vamos vazar antes que-" },
            { quem: "prof", texto: "BOM DIA, AMIGUINHOS!" },
            { quem: "colega", texto: "..." },
            { quem: "colega", texto: "Bom dia, professora." },
            { quem: "jogador", texto: "Bom dia!" },
            { quem: "prof", texto: "Hoje a aula vai ser ótima! Espero vocês lá." },
            { quem: "colega", texto: "É, vamos logo..." }
        ],
        iniciarDiscreta
    );
}

function iniciarDiscreta() {
    tocarMusica("sala");
    iniciarSala("discreta", exerciciosDiscreta);
    falar([
        { quem: "prof", texto: "Sentem-se! Hoje o assunto é operações entre conjuntos." },
        { quem: "prof", texto: "Ah, e vocês vão levar falta se não fizerem, tá? haha!" },
        { quem: "colega", texto: "Isso só pode ser brincadeira..." },
        { quem: "jogador", texto: "Vamos logo. Última aula e a gente está livre!" }
    ]);
}

function iniciarRua() {
    tocarMusica("rua");
    mostrarCena("rua");
    falar(
        [
            { quem: "jogador", texto: "Agora sim! Livres de verdade." },
            { quem: "colega", texto: "Hoje foi mais puxado que o normal... Até amanhã!" },
            { quem: "jogador", texto: "Até amanhã! Preciso de uma cama urgente." }
        ],
        iniciarQuarto
    );
}

function iniciarQuarto() {
    tocarMusica("quarto");
    mostrarCena("quarto");
    falar(
        [
            { quem: "narrador", texto: "Mais tarde, em casa..." },
            { quem: "jogador", texto: "Que sono... finalmente, minha cama." }
        ],
        () => {
            cenaEl.classList.add("dormindo");
            cenaEl.style.backgroundImage = `url("${personagens[estado.personagem].dormindo}")`;

            // a tela escurece devagar; só depois de ficar toda preta aparece o "Zzz" e libera o clique
            escurecerTela(() => {
                falar([{ quem: "narrador", texto: "Zzz..." }], () =>
                    mostrarTela("FIM", "Finalmente, dormindo. Bons sonhos...", "Recomeçar o dia", iniciarJogo, "fim")
                );
            });
        }
    );
}

// =====================================================
//  COMEÇA O JOGO
// =====================================================
iniciarJogo();