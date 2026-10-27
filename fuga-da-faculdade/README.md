# Fuga da Faculdade 😴

Jogo feito com HTML, CSS e JavaScript puro (sem instalar nada).

## Como rodar
1. Abra esta pasta no VS Code (Arquivo → Abrir Pasta).
2. Instale a extensão **Live Server** (o VS Code vai sugerir sozinho).
3. Clique com o botão direito em `index.html` → **Open with Live Server**.

## Onde editar
| O que mudar                          | Arquivo         |
|--------------------------------------|-----------------|
| Exercícios, respostas e dicas        | `js/dados.js`   |
| Textos da barra do topo, professores | `js/dados.js`   |
| Falas e sequência das fases          | `js/script.js` (seção "HISTÓRIA") |
| Regras do jogo (porta, painel etc.)  | `js/script.js`  |
| Cores, tamanhos, fundos das salas    | `css/style.css` |
| Estrutura da tela                    | `index.html`    |

## Estrutura
```
fuga-da-faculdade/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── dados.js     (exercícios e configuração das cenas)
│   └── script.js    (lógica do jogo)
└── .vscode/
    └── extensions.json
```
