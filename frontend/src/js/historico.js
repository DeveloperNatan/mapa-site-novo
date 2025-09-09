// IDs do HTML
const acaoFilter = document.getElementById("acaoFilter");
const valorFilter = document.getElementById("valorFilter");
const historicoTable = document.getElementById("historicoTable");
const localCompletoEl = document.getElementById("localCompleto");
const filialEl = document.getElementById("filial");
const andarEl = document.getElementById("andar");
const espinhaEl = document.getElementById("espinha");
const paEl = document.getElementById("pa");
const carteiraEl = document.getElementById("carteira");
const patrimonioPCE = document.getElementById("patrimonioPC");
const LocalId = document.getElementsByName("id-historico");

// Pega o ID diretamente da URL
const pathParts = window.location.pathname.split("/");
const id = pathParts[pathParts.length - 1]; // último segmento é o ID

// Variável para armazenar o histórico
let historicoData = [];

// Função para buscar dados da API
async function fetchHistorico() {
  try {
    const url = `http://localhost:9001/api/relacao/${id}`;
    const response = await fetch(url);

    if (!response.ok) throw new Error(`API request failed, status: ${response.status}`);

    const data = await response.json();

    // Preenche o header
    localCompletoEl.innerText = data.RelacionamentoPA.localCompleto;
    filialEl.innerText = data.filial;
    andarEl.innerText = data.andar;
    espinhaEl.innerText = data.espinha;
    paEl.innerText = data.pa;
    carteiraEl.innerText = data.carteira;
    patrimonioPCE.innerText = data.RelacionamentoPA.patrimonioPC;

    historicoData = data.RelacionamentoPA.HistoricoPA || [];
    renderTable();
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    historicoTable.innerHTML = `<tr><td colspan="4" class="text-center py-4">Erro ao carregar histórico</td></tr>`;
  }
}


// Função para renderizar tabela com filtros
function renderTable() {
  const filterAcao = acaoFilter.value.toUpperCase();
  const filterValor = valorFilter.value.toUpperCase();
  const filterPatrimonio = valorFilter.value.toUpperCase(); // mesma caixa de input

  historicoTable.innerHTML = "";

  const filtered = historicoData
    .filter(h =>
      (!filterAcao || h.acao.toUpperCase().includes(filterAcao)) &&
      (!filterValor || 
        h.valorAnterior.toUpperCase().includes(filterValor) || 
        h.valorNovo.toUpperCase().includes(filterValor) ||
        h.patrimonioPC?.toUpperCase().includes(filterPatrimonio) // <- adiciona patrimônio
      )
    )
    .sort((a, b) => new Date(b.dataRegistro) - new Date(a.dataRegistro));

  if (filtered.length === 0) {
    historicoTable.innerHTML = `<tr><td colspan="4" class="text-center py-4">Nenhum registro encontrado</td></tr>`;
    return;
  }

  filtered.forEach(h => {
    const tr = document.createElement("tr");
    tr.className = "hover:bg-gray-100";
    tr.innerHTML = `
      <td class="py-2 px-4">${new Date(h.dataRegistro).toLocaleString('pt-BR')}</td>
      <td class="py-2 px-4">${h.acao}</td>
      <td class="py-2 px-4">${h.valorAnterior}</td>
      <td class="py-2 px-4">${h.valorNovo}</td>
    `;
    historicoTable.appendChild(tr);
  });
}


// Eventos de filtro
acaoFilter.addEventListener("change", renderTable);
valorFilter.addEventListener("input", renderTable);

// Inicializa
fetchHistorico();
