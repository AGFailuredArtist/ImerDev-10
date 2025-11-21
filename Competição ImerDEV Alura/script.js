// Seletores principais
let cardcontainer = document.querySelector(".card-container");
let inputBusca = document.querySelector("input[type='text']");
let pageTitle = document.querySelector("#page-title");
let categoriaAtiva = 'jogos'; // Categoria inicial

// --- CONFIGURAÇÃO DO SCROLL INFINITO ---
const ITENS_POR_PAGINA = 6;
let paginaAtual = 1;
let carregandoMais = false;
let modoBusca = false; // Flag para controlar se estamos em modo de busca

// Dados
let todosOsDados = {};
let dadosAtuais = [];

// Função Debounce: Atraso para executar uma função após o usuário parar de digitar
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

// Busca em tempo real com debounce
inputBusca && inputBusca.addEventListener("input", debounce(IniciarBusca, 300));

// Clique no título reseta a busca e mantém a categoria atual
pageTitle && pageTitle.addEventListener("click", () => {
    if (inputBusca) inputBusca.value = "";
    mudarCategoria(categoriaAtiva);
});

// Iniciar busca
async function IniciarBusca() {
    if (!todosOsDados || Object.keys(todosOsDados).length === 0) {
        const resposta = await fetch("data.json");
        todosOsDados = await resposta.json();
    }

    const termoBusca = (inputBusca ? inputBusca.value.trim().toLowerCase() : "");
    if (!termoBusca) {
        // Se busca vazia, volta para a visualização da categoria atual
        resetarVisualizacao(todosOsDados[categoriaAtiva] || []);
        return;
    }

    modoBusca = true;
    // Busca em todas as categorias
    const todasAsCategorias = Object.values(todosOsDados).flat();
    const dadosFiltrados = todasAsCategorias.filter(dado => {
        const nome = (dado.nome || "").toLowerCase();
        const descricao = (dado.descricao || "").toLowerCase();
        return nome.includes(termoBusca) || descricao.includes(termoBusca);
    });

    cardcontainer.innerHTML = "";
    if (dadosFiltrados.length > 0) {
        adicionarCards(dadosFiltrados);
    } else {
        const p = document.createElement('p');
        p.className = 'no-results';
        p.textContent = 'Nenhum resultado encontrado.';
        cardcontainer.appendChild(p);
    }

    // Ao fazer busca, desativa o carregamento por scroll
    window.removeEventListener('scroll', handleScroll);
}

// Adiciona cards ao container
function adicionarCards(listaDeDados) {
    for (let dado of listaDeDados) {
        let article = document.createElement("article");
        article.classList.add("card");

        article.innerHTML = `
            <img src="${dado.imagem || ''}" alt="Capa do jogo ${dado.nome || ''}" />
            <div class="card-body">
                <h3>${dado.nome || ''}</h3>
                <p>${dado.descricao || ''}</p>
                <a href="${dado.link || '#'}" target="_blank" rel="noopener noreferrer">Visitar página na loja</a>
            </div>
        `;

        const linkSaibaMais = article.querySelector('a');
        if (linkSaibaMais) {
            linkSaibaMais.addEventListener('click', (event) => {
                // Impede que o clique no link "borbulhe" para o card
                event.stopPropagation();
            });
        }

        article.addEventListener('click', () => {
            mostrarModal(dado);
        });

        cardcontainer.appendChild(article);
    }
}

// Reseta visualização para uma lista de dados (categoria)
function resetarVisualizacao(dadosParaRenderizar) {
    paginaAtual = 1;
    modoBusca = false;
    dadosAtuais = dadosParaRenderizar || [];
    cardcontainer.innerHTML = "";
    window.addEventListener('scroll', handleScroll); // Garante que o scroll está ativo
    carregarMaisCards(); // Carrega a primeira página da categoria
}

// Mostrar modal com detalhes
function mostrarModal(dado) {
    const overlay = document.createElement('div');
    overlay.classList.add('card-modal-overlay');

    const modal = document.createElement('div');
    modal.classList.add('card-modal');

    modal.innerHTML = `
        <button class="modal-close-button" aria-label="Fechar">✕</button>
        <div class="modal-inner">
            <img src="${dado.imagem || ''}" alt="Capa do jogo ${dado.nome || ''}" />
            <div class="card-content">
                <h2>${dado.nome || ''}</h2>
                ${dado.ano ? `<p><strong>Ano:</strong> ${dado.ano}</p>` : ''}
                <p>${dado.descricao || ''}</p>
                ${dado.link ? `<a href="${dado.link}" target="_blank" rel="noopener noreferrer">Visitar página na loja</a>` : ''}
            </div>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden'; // Impede o scroll da página ao fundo

    function fecharModal() {
        document.body.removeChild(overlay);
        document.body.style.overflow = 'auto';
    }

    const btnClose = modal.querySelector('.modal-close-button');
    if (btnClose) btnClose.addEventListener('click', fecharModal);

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            fecharModal();
        }
    });
}

// Carregar mais cards (infinite scroll)
function carregarMaisCards() {
    if (carregandoMais) return;
    carregandoMais = true;

    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    const fim = inicio + ITENS_POR_PAGINA;
    const proximosDados = (dadosAtuais || []).slice(inicio, fim);

    if (proximosDados.length > 0) {
        adicionarCards(proximosDados);
        paginaAtual++;
    }

    carregandoMais = false;

    // Se não houver mais dados para carregar ou se a busca estiver ativa, remove o evento de scroll
    if (proximosDados.length < ITENS_POR_PAGINA || modoBusca) {
        window.removeEventListener('scroll', handleScroll);
    }
}

function handleScroll() {
    // Verifica se o usuário está perto do final da página
    if (!modoBusca && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200) {
        carregarMaisCards();
    }
}

// Muda a categoria ativa
function mudarCategoria(novaCategoria) {
    categoriaAtiva = novaCategoria;
    if (inputBusca) {
        inputBusca.value = ""; // Limpa a busca ao trocar de categoria
    }

    // Atualiza botões de categoria, se existirem
    const categoryButtons = document.querySelectorAll('[data-category]');
    categoryButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === novaCategoria) {
            btn.classList.add('active');
        }
    });

    resetarVisualizacao(todosOsDados[novaCategoria] || []);
}

// Carrega dados iniciais e configura listeners de categoria
async function carregarDadosIniciais() {
    const loadingMessage = document.createElement('p');
    loadingMessage.textContent = 'Carregando conteúdo...';
    loadingMessage.className = 'no-results'; // Reutilizando o estilo
    if (cardcontainer) cardcontainer.appendChild(loadingMessage);

    const resposta = await fetch("data.json");
    todosOsDados = await resposta.json();

    // Remove mensagem de carregamento
    if (loadingMessage.parentNode) loadingMessage.parentNode.removeChild(loadingMessage);

    // Vincula botões de categoria
    const categoryButtons = document.querySelectorAll('[data-category]');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => mudarCategoria(btn.dataset.category));
    });

    // Inicia com a categoria padrão
    mudarCategoria(categoriaAtiva);
}

// --- LÓGICA PARA TROCA DE TEMA ---
const themeToggle = document.getElementById('theme-toggle');
const body = document.body || document.querySelector('body');

function aplicarTemaSalvo() {
    const temaSalvo = localStorage.getItem('theme');
    if (!body) return;
    body.classList.remove('dark-mode', 'intermediate-mode');

    if (temaSalvo === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) themeToggle.textContent = '☀️';
    } else if (temaSalvo === 'intermediate') {
        body.classList.add('intermediate-mode');
        if (themeToggle) themeToggle.textContent = '🌙';
    } else {
        if (themeToggle) themeToggle.textContent = '🌗';
    }
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isLight = !body.classList.contains('dark-mode') && !body.classList.contains('intermediate-mode');
        const isIntermediate = body.classList.contains('intermediate-mode');

        if (isLight) {
            // De Claro para Intermediário
            body.classList.remove('dark-mode');
            body.classList.add('intermediate-mode');
            localStorage.setItem('theme', 'intermediate');
            themeToggle.textContent = '🌙';
        } else if (isIntermediate) {
            // De Intermediário para Escuro
            body.classList.remove('intermediate-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            themeToggle.textContent = '☀️';
        } else {
            // De Escuro para Claro
            body.classList.remove('dark-mode', 'intermediate-mode');
            localStorage.setItem('theme', 'light');
            themeToggle.textContent = '🌗';
        }
    });
}

// Inicialização ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    aplicarTemaSalvo();
    carregarDadosIniciais();
});
window.addEventListener('scroll', handleScroll);