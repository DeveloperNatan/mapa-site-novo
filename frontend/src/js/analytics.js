// analytics.js

// IDs dos elementos
const totalMachinesEl = document.getElementById("total-machines");
const totalSwapsEl = document.getElementById("total-swaps");
const averageSwapsEl = document.getElementById("average-swaps");

// Chart.js canvases
const chartSwapsEl = document.getElementById("chart-swaps").getContext("2d");


// Variáveis
let analyticsData = [];

// Função para buscar dados da API
async function fetchAnalytics() {
  try {
    const response = await fetch("http://localhost:9001/api/relacao");
    if (!response.ok) throw new Error(`Erro ao buscar dados: ${response.status}`);
    const data = await response.json();
    analyticsData = data;
    processMetrics();
    renderCharts();
  } catch (error) {
    console.error("Erro ao buscar analytics:", error);
  }
}

// Processa métricas e atualiza cards
function processMetrics() {
  const totalMachines = analyticsData.length;

  // Contar total de trocas (ALTERACAO) e por dia
  let totalSwaps = 0;
  const swapsPerDay = {};

  analyticsData.forEach(item => {
    const historico = item.RelacionamentoPA.HistoricoPA || [];
    historico.forEach(h => {
      if (h.acao === "ALTERACAO") {
        totalSwaps++;
        const date = new Date(h.dataRegistro).toISOString().split("T")[0]; // yyyy-mm-dd
        swapsPerDay[date] = (swapsPerDay[date] || 0) + 1;
      }
    });
  });

  // Média de trocas por dia (últimos 30 dias)
  const last30Days = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    last30Days.push(key);
    swapsPerDay[key] = swapsPerDay[key] || 0;
  }
  const sumLast30 = last30Days.reduce((acc, day) => acc + swapsPerDay[day], 0);
  const avgPerDay = (sumLast30 / 30).toFixed(2);

  // Atualiza cards
  totalMachinesEl.innerText = totalMachines;
  totalSwapsEl.innerText = totalSwaps;
  averageSwapsEl.innerText = avgPerDay;

  // Retornar dados para gráfico
  return { swapsPerDay, last30Days };
}

// Renderiza gráficos
function renderCharts() {
  const { swapsPerDay, last30Days } = processMetrics();

  // Gráfico de trocas por dia (últimos 30 dias)
  new Chart(chartSwapsEl, {
    type: "line",
    data: {
      labels: last30Days,
      datasets: [{
        label: "Trocas por dia",
        data: last30Days.map(d => swapsPerDay[d]),
        backgroundColor: "rgba(26, 140, 170, 0.2)",
        borderColor: "#1a8caa",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: {
        x: { title: { display: true, text: "Data" } },
        y: { title: { display: true, text: "Trocas" }, beginAtZero: true }
      }
    }
  });
}


// Inicializa
fetchAnalytics();
