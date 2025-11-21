## 🎮 Catálogo de Jogos Indies Brasileiros 🇧🇷

Este projeto é um catálogo interativo e responsivo, focado em apresentar jogos independentes desenvolvidos no Brasil. O site utiliza um sistema de **Infinite Scroll** (Rolagem Infinita) para carregar o conteúdo sob demanda, um sistema de **busca em tempo real** e um recurso de **troca de tema** dinâmico, incluindo modos claro, intermediário e escuro.

O projeto foi desenvolvido como parte de uma competição de programação (*ImerDEV Alura*).

-----

### ✨ Funcionalidades Principais

  * **Catálogo de Jogos:** Exibe uma lista de jogos indies brasileiros, com detalhes como nome, descrição, ano de lançamento e um link para a página da loja (Steam).
  * **Rolagem Infinita (Infinite Scroll):** O conteúdo é carregado em blocos (6 itens por vez), otimizando a performance e a experiência do usuário. O carregamento de novos cards é acionado quando o usuário se aproxima do final da página.
  * **Busca em Tempo Real:** Permite ao usuário filtrar o catálogo digitando o nome ou parte da descrição de um jogo. A busca é otimizada com a função *debounce* para evitar execuções excessivas de código durante a digitação.
  * **Troca de Tema Dinâmico:** Um botão (`#theme-toggle`) permite alternar entre três modos de cor:
      * ☀️ **Modo Escuro** (`dark-mode`)
      * 🌙 **Modo Intermediário** (`intermediate-mode`)
      * 🌗 **Modo Claro** (Padrão)
      * O tema escolhido é persistente através do `localStorage`.
  * **Modal de Detalhes:** Ao clicar em qualquer card, um modal é exibido com mais informações sobre o jogo, sem tirar o usuário da página principal.
  * **Design Responsivo:** O layout se adapta perfeitamente a diferentes tamanhos de tela (desktop, tablet, mobile) usando `media queries`.

-----

### 🛠️ Tecnologias Utilizadas

  * **HTML5:** Estrutura semântica da página.
  * **CSS3:** Estilização com uso intensivo de **variáveis CSS** (`:root`, `.dark-mode`, `.intermediate-mode`) para a funcionalidade de troca de tema.
  * **JavaScript (Vanilla JS):** Lógica de carregamento de dados, manipulação do DOM, Infinite Scroll, Debounce, busca e persistência do tema.
  * **JSON:** Fonte de dados para o catálogo de jogos (`data.json`).

-----

### ⚙️ Como Usar/Executar

1.  **Clone o repositório:**
    ```bash
    git clone [Link do Repositório]
    ```
2.  **Abra o arquivo:**
    Simplesmente abra o arquivo `Index.html` em qualquer navegador moderno.

*O projeto não requer um servidor web para execução, pois utiliza a API `fetch` para carregar um arquivo JSON local, o que é suportado pela maioria dos navegadores (embora, em alguns ambientes estritamente seguros, possa haver restrições de CORS ao carregar arquivos locais).*

-----

### 📂 Estrutura de Arquivos

```
/
├── Index.html      # Estrutura principal do site
├── Style.css       # Estilos e variáveis de tema (dark/intermediate mode)
├── script.js       # Lógica principal (fetch, infinite scroll, busca, modal, theme toggle)
└── data.json       # Dados dos jogos
```

-----

### 🧩 Detalhes do Código

#### **JavaScript (`script.js`)**

  * **`debounce(func, delay)`:** Implementa a função de debounce essencial para a busca em tempo real, garantindo que a função de busca (`IniciarBusca`) seja chamada apenas após um pequeno atraso (300ms) desde a última entrada do usuário.
  * **`carregarMaisCards()` / `handleScroll()`:** Gerencia o Infinite Scroll. A `handleScroll` monitora a posição de rolagem e, se o usuário estiver a 200px do final da página, aciona `carregarMaisCards()` para carregar a próxima fatia dos dados (definida por `ITENS_POR_PAGINA = 6`).
  * **`aplicarTemaSalvo()`:** Lê o tema preferido do `localStorage` e aplica as classes CSS (`dark-mode` ou `intermediate-mode`) no `<body>` na inicialização.

#### **CSS (`Style.css`)**

  * **Variáveis CSS:** Define as paletas de cores para cada tema.
    ```css
    :root { /* MODO CLARO */
        --primary-color: #8a4fff;
        /* ... outras variáveis ... */
    }
    body.dark-mode { /* MODO ESCURO */
        --primary-color: #a970ff;
        /* ... outras variáveis ... */
    }
    ```
  * **Responsividade:** O layout é ajustado para dispositivos móveis usando `media queries` em `768px` e `480px`. O `footer` é ocultado em telas muito pequenas para priorizar o conteúdo.
  * **Efeito Hover:** Um efeito de *hover* visualmente chamativo aplica uma imagem de fundo, muda a cor do fundo para `var(--primary-color)` e inverte as cores do texto para `var(--bg-color)` para criar um efeito de destaque forte e garantir o contraste.
