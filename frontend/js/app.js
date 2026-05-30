const API_URL = 'http://localhost:8080/api';
const AUTH_STORAGE_KEY = 'finplanAuth';
let fluxoCaixaChartInstance = null;
let despesasCategoriaChartInstance = null;
let transacaoEmEdicaoId = null;

function normalizarTexto(texto) {
    if (typeof texto !== 'string') return texto;
    let valor = texto;

    if (/[ÃÂ]/.test(valor)) {
        try {
            valor = decodeURIComponent(escape(valor));
        } catch {}
    }

    const mapa = {
        '├í': 'á',
        '├º': 'ç',
        '├ú': 'ã',
        '├║': 'ú',
        '├¡': 'í',
        '├¬': 'ê',
        '├â': 'é',
        '├ô': 'õ',
        '├Ç': 'Á',
        '├ë': 'É',
        '├âo': 'ão'
    };

    Object.entries(mapa).forEach(([mojibake, correto]) => {
        valor = valor.split(mojibake).join(correto);
    });

    return valor;
}

function getCurrentPage() {
    const pathname = window.location.pathname;
    const file = pathname.substring(pathname.lastIndexOf('/') + 1);
    return file || 'index.html';
}

function setAuthCredentials(usuario, senha) {
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ usuario, senha }));
}

function getAuthCredentials() {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    try {
        const parsed = JSON.parse(raw);
        if (!parsed?.usuario || !parsed?.senha) return null;
        return parsed;
    } catch {
        return null;
    }
}

function clearAuthCredentials() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

function ensureAuthenticated() {
    const protectedPages = ['dashboard.html', 'transacoes.html', 'metas.html', 'relatorios.html'];
    const page = getCurrentPage();
    if (protectedPages.includes(page) && !getAuthCredentials()) {
        window.location.href = 'index.html';
    }
}

function logout() {
    clearAuthCredentials();
    window.location.href = 'index.html';
}

async function apiFetch(path, options = {}) {
    const auth = getAuthCredentials();
    if (!auth) {
        throw new Error('Usuário não autenticado');
    }

    const authHeader = 'Basic ' + btoa(`${auth.usuario}:${auth.senha}`);
    const headers = {
        Authorization: authHeader,
        ...(options.headers || {})
    };

    const response = await fetch(`${API_URL}${path}`, { ...options, headers });
    if (response.status === 401 || response.status === 403) {
        clearAuthCredentials();
        window.location.href = 'index.html';
        throw new Error('Sessão inválida');
    }

    return response;
}

function setupLoginPage() {
    const form = document.getElementById('formLogin');
    const mensagem = document.getElementById('mensagemLogin');

    if (!form || !mensagem) return;

    if (getAuthCredentials()) {
        window.location.href = 'dashboard.html';
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const usuario = String(formData.get('usuario') || '').trim();
        const senha = String(formData.get('senha') || '').trim();

        if (!usuario || !senha) {
            mensagem.textContent = 'Informe usuário e senha.';
            mensagem.className = 'mt-4 text-sm text-red-400';
            return;
        }

        setAuthCredentials(usuario, senha);

        try {
            const test = await apiFetch('/transacoes');
            if (!test.ok) {
                throw new Error('Credenciais inválidas');
            }
            window.location.href = 'dashboard.html';
        } catch {
            clearAuthCredentials();
            mensagem.textContent = 'Falha no login. Confira usuário e senha.';
            mensagem.className = 'mt-4 text-sm text-red-400';
        }
    });
}

// Formatação de moeda
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Formatação de data
function formatarData(data) {
    if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}/.test(data)) {
        const base = data.slice(0, 10);
        const [ano, mes, dia] = base.split('-').map(Number);
        return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR');
    }
    return new Date(data).toLocaleDateString('pt-BR');
}

// Dashboard
async function carregarDashboard() {
    try {
        const inicio = '2026-05-01';
        const fim = '2026-05-28';

        const resumoResponse = await apiFetch(`/transacoes/resumo?inicio=${inicio}&fim=${fim}`);
        const resumo = await resumoResponse.json();

        document.getElementById('totalReceitas').textContent = formatarMoeda(resumo.totalReceitas);
        document.getElementById('totalDespesas').textContent = formatarMoeda(resumo.totalDespesas);
        document.getElementById('saldoAtual').textContent = formatarMoeda(resumo.totalReceitas - resumo.totalDespesas);

        const metasResponse = await apiFetch('/metas/resumo');
        const metas = await metasResponse.json();
        document.getElementById('metasConcluidas').textContent = `${metas.metasConcluidas} / ${metas.totalMetas}`;
        const percentual = metas.totalMetas > 0 ? (metas.metasConcluidas / metas.totalMetas * 100).toFixed(0) : 0;
        document.getElementById('percentualMetas').textContent = `${percentual}% concluído`;

        criarGraficoFluxoCaixa();
        criarGraficoDespesasCategoria(resumo.despesasPorCategoria);
        carregarUltimasTransacoes();
        carregarMetasAtivas();

    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

function criarGraficoFluxoCaixa() {
    const ctx = document.getElementById('fluxoCaixaChart')?.getContext('2d');
    if (!ctx) return;

    if (fluxoCaixaChartInstance) {
        fluxoCaixaChartInstance.destroy();
    }

    fluxoCaixaChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1 Mai', '8 Mai', '15 Mai', '22 Mai', '28 Mai'],
            datasets: [
                {
                    label: 'Receitas',
                    data: [2000, 2500, 3200, 3800, 4250],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Despesas',
                    data: [1500, 1800, 2100, 2400, 2850],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#94a3b8' }
                }
            },
            scales: {
                y: {
                    grid: { color: '#334155' },
                    ticks: {
                        color: '#94a3b8',
                        callback: function(value) {
                            return 'R$ ' + value;
                        }
                    }
                },
                x: {
                    grid: { color: '#334155' },
                    ticks: { color: '#94a3b8' }
                }
            }
        }
    });
}

function criarGraficoDespesasCategoria(despesasPorCategoria) {
    const ctx = document.getElementById('despesasCategoriaChart')?.getContext('2d');
    if (!ctx) return;

    const categorias = Object.keys(despesasPorCategoria);
    const valores = Object.values(despesasPorCategoria);
    const total = valores.reduce((a, b) => a + b, 0);

    if (despesasCategoriaChartInstance) {
        despesasCategoriaChartInstance.destroy();
    }

    despesasCategoriaChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categorias,
            datasets: [{
                data: valores,
                backgroundColor: [
                    '#3b82f6', '#8b5cf6', '#f97316',
                    '#10b981', '#14b8a6', '#ef4444'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#94a3b8',
                        padding: 15
                    }
                }
            }
        }
    });

    const legendaContainer = document.getElementById('despesasCategoriaLegenda');
    if (legendaContainer) {
        legendaContainer.innerHTML = '';
        let html = '<div class="mt-4 space-y-2">';
        categorias.forEach((cat, index) => {
            const percentual = ((valores[index] / total) * 100).toFixed(0);
            html += `
                <div class="flex justify-between items-center text-sm">
                    <div class="flex items-center gap-2">
                        <div class="w-3 h-3 rounded" style="background-color: ${['#3b82f6', '#8b5cf6', '#f97316', '#10b981', '#14b8a6', '#ef4444'][index]}"></div>
                        <span class="text-slate-300">${normalizarTexto(cat)}</span>
                    </div>
                    <div class="flex gap-4">
                        <span class="text-slate-400">${percentual}%</span>
                        <span class="text-slate-300">${formatarMoeda(valores[index])}</span>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        legendaContainer.insertAdjacentHTML('beforeend', html);
    }
}

async function carregarUltimasTransacoes() {
    try {
        const response = await apiFetch('/transacoes/ultimas');
        const transacoes = await response.json();

        const container = document.getElementById('listaTransacoes');
        if (!container) return;

        container.innerHTML = transacoes.map(t => `
            <div class="flex items-center justify-between p-3 bg-slate-800 rounded-lg hover:bg-slate-750 transition">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center ${t.tipo === 'RECEITA' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}">
                        <i class="fas fa-${t.tipo === 'RECEITA' ? 'arrow-down' : 'arrow-up'}"></i>
                    </div>
                    <div>
                        <p class="text-white font-medium">${normalizarTexto(t.descricao)}</p>
                        <p class="text-slate-400 text-xs">${normalizarTexto(t.categoria)} • ${formatarData(t.data)}</p>
                    </div>
                </div>
                <span class="font-semibold ${t.tipo === 'RECEITA' ? 'text-green-400' : 'text-red-400'}">
                    ${t.tipo === 'RECEITA' ? '+' : '-'} ${formatarMoeda(t.valor)}
                </span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erro ao carregar últimas transações:', error);
    }
}

async function carregarMetasAtivas() {
    try {
        const response = await apiFetch('/metas/ativas');
        const metas = await response.json();

        const container = document.getElementById('listaMetas');
        if (!container) return;

        container.innerHTML = metas.map(meta => {
            const percentual = meta.percentualConcluido || 0;
            return `
                <div class="p-4 bg-slate-800 rounded-lg">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <h4 class="text-white font-medium">${normalizarTexto(meta.nome)}</h4>
                            <p class="text-slate-400 text-xs">${formatarData(meta.dataInicio)} - ${formatarData(meta.dataFim)}</p>
                        </div>
                        <span class="text-blue-400 font-semibold">${percentual}%</span>
                    </div>
                    <div class="w-full bg-slate-700 rounded-full h-2">
                        <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all" style="width: ${percentual}%"></div>
                    </div>
                    <div class="flex justify-between mt-2 text-xs text-slate-400">
                        <span>${formatarMoeda(meta.valorAtual)}</span>
                        <span>${formatarMoeda(meta.valorAlvo)}</span>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Erro ao carregar metas:', error);
    }
}

// Transações
let todasTransacoes = [];

async function carregarTransacoes() {
    try {
        const response = await apiFetch('/transacoes');
        todasTransacoes = await response.json();
        renderizarTransacoes(todasTransacoes);
    } catch (error) {
        console.error('Erro ao carregar transações:', error);
    }
}

function renderizarTransacoes(transacoes) {
    const tbody = document.getElementById('tabelaTransacoes');
    if (!tbody) return;

    tbody.innerHTML = transacoes.map(t => `
        <tr class="hover:bg-slate-800 transition">
            <td class="px-6 py-4 text-sm text-slate-300">${formatarData(t.data)}</td>
            <td class="px-6 py-4 text-sm text-white font-medium">${normalizarTexto(t.descricao)}</td>
            <td class="px-6 py-4 text-sm text-slate-300">${normalizarTexto(t.categoria)}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs rounded-full ${t.tipo === 'RECEITA' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}">
                    ${t.tipo === 'RECEITA' ? 'Receita' : 'Despesa'}
                </span>
            </td>
            <td class="px-6 py-4 text-sm text-right font-semibold ${t.tipo === 'RECEITA' ? 'text-green-400' : 'text-red-400'}">
                ${t.tipo === 'RECEITA' ? '+' : '-'} ${formatarMoeda(t.valor)}
            </td>
            <td class="px-6 py-4 text-center">
                <button onclick="editarTransacao(${t.id})" class="text-blue-400 hover:text-blue-300 mx-1">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="excluirTransacao(${t.id})" class="text-red-400 hover:text-red-300 mx-1">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filtrarTransacoes() {
    const descricao = document.getElementById('filtroDescricao')?.value.toLowerCase() || '';
    const tipo = document.getElementById('filtroTipo')?.value || '';
    const categoria = document.getElementById('filtroCategoria')?.value || '';

    const filtradas = todasTransacoes.filter(t => {
        const descricaoNormalizada = String(normalizarTexto(t.descricao) || '').toLowerCase();
        const matchDescricao = descricaoNormalizada.includes(descricao);
        const matchTipo = !tipo || t.tipo === tipo;
        const matchCategoria = !categoria || normalizarTexto(t.categoria) === categoria;
        return matchDescricao && matchTipo && matchCategoria;
    });

    renderizarTransacoes(filtradas);
}

// Modal
function abrirModalTransacao() {
    transacaoEmEdicaoId = null;

    const form = document.getElementById('formTransacao');
    form?.reset();

    const titulo = document.getElementById('modalTituloTransacao');
    const botaoSalvar = document.getElementById('btnSalvarTransacao');
    if (titulo) titulo.textContent = 'Nova Transação';
    if (botaoSalvar) botaoSalvar.textContent = 'Salvar';

    document.getElementById('modalTransacao')?.classList.remove('hidden');
}

function fecharModalTransacao() {
    transacaoEmEdicaoId = null;
    document.getElementById('modalTransacao')?.classList.add('hidden');
    document.getElementById('formTransacao')?.reset();

    const titulo = document.getElementById('modalTituloTransacao');
    const botaoSalvar = document.getElementById('btnSalvarTransacao');
    if (titulo) titulo.textContent = 'Nova Transação';
    if (botaoSalvar) botaoSalvar.textContent = 'Salvar';
}

// Submit form
document.getElementById('formTransacao')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const transacao = {
        descricao: formData.get('descricao'),
        valor: parseFloat(formData.get('valor')),
        tipo: formData.get('tipo'),
        categoria: formData.get('categoria'),
        data: formData.get('data')
    };

    try {
        const metodo = transacaoEmEdicaoId ? 'PUT' : 'POST';
        const endpoint = transacaoEmEdicaoId ? `/transacoes/${transacaoEmEdicaoId}` : '/transacoes';

        await apiFetch(endpoint, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transacao)
        });

        fecharModalTransacao();
        carregarTransacoes();
        if (document.getElementById('listaTransacoes')) {
            carregarDashboard();
        }
    } catch (error) {
        console.error('Erro ao salvar transação:', error);
        alert('Erro ao salvar transação');
    }
});

async function editarTransacao(id) {
    const transacao = todasTransacoes.find((item) => item.id === id);
    if (!transacao) {
        alert('Transação não encontrada para edição.');
        return;
    }

    transacaoEmEdicaoId = id;

    const form = document.getElementById('formTransacao');
    if (!form) return;

    form.descricao.value = normalizarTexto(transacao.descricao || '');
    form.valor.value = transacao.valor;
    form.tipo.value = transacao.tipo;
    form.categoria.value = normalizarTexto(transacao.categoria || '');
    form.data.value = String(transacao.data || '').slice(0, 10);

    const titulo = document.getElementById('modalTituloTransacao');
    const botaoSalvar = document.getElementById('btnSalvarTransacao');
    if (titulo) titulo.textContent = 'Editar Transação';
    if (botaoSalvar) botaoSalvar.textContent = 'Atualizar';

    document.getElementById('modalTransacao')?.classList.remove('hidden');
}

async function excluirTransacao(id) {
    if (!confirm('Deseja realmente excluir esta transação?')) return;

    try {
        await apiFetch(`/transacoes/${id}`, { method: 'DELETE' });
        carregarTransacoes();
        if (document.getElementById('listaTransacoes')) {
            carregarDashboard();
        }
    } catch (error) {
        console.error('Erro ao excluir transação:', error);
        alert('Erro ao excluir transação');
    }
}

// Inicialização por página
ensureAuthenticated();

if (getCurrentPage() === 'index.html') {
    document.addEventListener('DOMContentLoaded', setupLoginPage);
}

if (getCurrentPage() === 'dashboard.html') {
    document.addEventListener('DOMContentLoaded', carregarDashboard);
}

// Exportar funções globais
window.apiFetch = apiFetch;
window.logout = logout;
window.abrirModalTransacao = abrirModalTransacao;
window.fecharModalTransacao = fecharModalTransacao;
window.editarTransacao = editarTransacao;
window.excluirTransacao = excluirTransacao;
window.carregarTransacoes = carregarTransacoes;
window.filtrarTransacoes = filtrarTransacoes;
