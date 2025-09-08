// --------------------- FETCH DE DADOS ---------------------
async function getData() {
  const url = "http://localhost:9001/api/relacao";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Erro na requisição:", response.status);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return [];
  }
}

// --------------------- CRIAÇÃO DO LAYOUT DE PAs ---------------------
function criarEspinhaHTML(andar, numEspinha, totalLugares, data, startPA, invertido = false) {
  const lugaresPorFila = Math.ceil(totalLugares / 2);
  let fila1HTML = '';
  let fila2HTML = '';

  const espinhaStr = String(numEspinha).padStart(2, '0');

  function encontraPA(localCompleto) {
    return data.find(item => item.localCompleto === localCompleto);
  }

  let paNum = startPA;

  for (let i = 1; i <= lugaresPorFila; i++) {
    const paStr = String(paNum).padStart(3, '0');
    const localCompleto = `J1-A00-E${espinhaStr}-PA${paStr}`;
    const paData = encontraPA(localCompleto);

    fila1HTML += `<div 
      class="pa w-12 h-12 border-2 rounded-md flex items-center justify-center bg-gray-50 hover:bg-cyan-100 cursor-pointer" 
      data-local="${localCompleto}" 
      data-pc="${paData?.RelacionamentoPA.patrimonioPC || ''}" 
      data-id="${paData?.id || ''}"
      >${paStr}</div>`;

    paNum = invertido ? paNum - 1 : paNum + 1;
  }

  for (let i = lugaresPorFila + 1; i <= totalLugares; i++) {
    const paStr = String(paNum).padStart(3, '0');
    const localCompleto = `J1-A00-E${espinhaStr}-PA${paStr}`;
    const paData = encontraPA(localCompleto);

    fila2HTML += `<div 
      class="pa w-12 h-12 border-2 rounded-md flex items-center justify-center bg-gray-50 hover:bg-cyan-100 cursor-pointer" 
      data-local="${localCompleto}" 
      data-pc="${paData?.RelacionamentoPA.patrimonioPC || ''}" 
      data-id="${paData?.id || ''}"
      >${paStr}</div>`;

    paNum = invertido ? paNum - 1 : paNum + 1;
  }

  return {
    html: `
    <div class="inline-flex flex-row gap-4 rounded p-2 items-end">
      <h1 class="text-xl font-bold my-auto">${espinhaStr}</h1>
      <div class="flex flex-col justify-end gap-1 border-2 border-black rounded p-2">
        <div class="flex flex-wrap gap-1 justify-start">${fila1HTML}</div>
        <div class="flex flex-wrap gap-1 justify-start">${fila2HTML}</div>
      </div>
    </div>`,
    nextPA: paNum
  };
}

// --------------------- CRIAÇÃO DO LAYOUT COMPLETO ---------------------
async function CreateLayout() {
  const containerA = document.getElementById('container-espinhas-A');
  const containerB = document.getElementById('container-espinhas-B');
  const containerC = document.getElementById('container-espinhas-C');
  const data = await getData();

  // Coluna A
  let PAstartA = 214;
  for (let i = 13; i >= 1; i--) {
    const totalPAs = [1, 8, 13].includes(i) ? 18 : 16;
    const { html, nextPA } = criarEspinhaHTML('A', i, totalPAs, data, PAstartA, true);
    containerA.innerHTML += html;
    PAstartA = nextPA;
  }

  // Coluna B
  let PAstartB = 426;
  for (let i = 26; i >= 14; i--) {
    const totalPAs = [14, 21].includes(i) ? 18 : 16;
    const { html, nextPA } = criarEspinhaHTML('B', i, totalPAs, data, PAstartB, true);
    containerB.innerHTML += html;
    PAstartB = nextPA;
  }

  // Coluna C
  let PAstartC = 528;
  for (let i = 37; i >= 27; i--) {
    const totalPAs = [28, 31, 34, 36].includes(i) ? 8 : 10;
    const { html, nextPA } = criarEspinhaHTML('C', i, totalPAs, data, PAstartC, true);
    containerC.innerHTML += html;
    PAstartC = nextPA;
  }
}

// --------------------- MODAL DE DETALHES ---------------------
function OpenModalItens(localCompleto, patrimonioPC, id) {
  const ModalItens = document.getElementById("ModalItens");

  ModalItens.innerHTML = `
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[600px] overflow-auto p-6 border border-[#146c84] flex flex-col gap-4">
      
      <h1 class="text-3xl font-bold text-center text-[#146c84] mb-6">Detalhes da PA</h1>
      
      <div class="flex flex-col gap-4">
        <div id="local-info" data-id="${id}" class="text-center text-white bg-[#146c84] py-2 rounded-lg text-lg font-semibold">
          ${localCompleto}
        </div>
        <div>
          <h2 class="font-semibold text-gray-700 mb-1">Computador</h2>
          <a id="local-pc" class="text-gray-600 hover:text-cyan-600 transition-colors cursor-pointer">
            ${patrimonioPC || 'Não cadastrado'}
          </a>
        </div>
        <div class="flex justify-end">
          <button class="bg-[#146c84] text-white rounded-md p-2 cursor-pointer hover:bg-[#0f5365] transition-colors" id="OpenModalEdit">
            <i class="bi bi-pencil-square"></i> Editar
          </button>
        </div>
      </div>
      
      <button id="ButtonFechar" class="mt-4 w-full bg-[#146c84] text-white py-2 rounded-lg hover:bg-[#0f5365] transition-colors">
        Fechar
      </button>
    </div>
  </div>
  `;

  // Evento botão fechar
  const botaoFechar = ModalItens.querySelector('#ButtonFechar');
  botaoFechar.addEventListener('click', () => {
    ModalItens.classList.add('hidden');
    ModalItens.classList.remove('flex');
  });

  // Evento botão editar
  const botaoEditar = ModalItens.querySelector('#OpenModalEdit');
  botaoEditar.addEventListener('click', () => {
    ModalEdit(id);
  });

  ModalItens.classList.remove('hidden');
  ModalItens.classList.add('flex');
}

// --------------------- MODAL DE EDIÇÃO ---------------------
async function ModalEdit(id) {
  try {
    const url = `http://localhost:9001/api/relacao/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed, status:${response.status}`);
    }

    const menu = await response.json();
    const ModalEditdiv = document.getElementById('ModalItens');

    ModalEditdiv.innerHTML = `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div class="bg-white border border-gray-200 p-6 rounded-2xl shadow-xl w-full max-w-lg text-gray-900">
        <h1 class="text-2xl font-bold mb-6 text-center text-custom-header">Editar Computador</h1>
        <form action="/update" method="post" class="grid grid-cols-1 gap-4">

          <div>
            <label class="block text-sm font-medium">Patrimônio PC</label>
            <input type="text" name="patrimonioPC" value="${menu.RelacionamentoPA.patrimonioPC}"
              class="mt-1 block p-2 w-full rounded-md border border-gray-300 bg-gray-50">
            <input type="hidden" name="id" value="${menu.id}">
          </div>

          <div>
            <label class="block text-sm font-medium">Filial</label>
            <select name="filial" class="mt-1 block p-2 w-full rounded-md border border-gray-300 bg-gray-50">
              <option ${menu.filial === 'J1' ? 'selected' : ''} value="J1">Joinville Site (J1)</option>
            </select>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium">Andar</label>
              <input type="text" name="andar" value="${menu.andar}"
                class="mt-1 block p-2 w-full rounded-md border border-gray-300 bg-gray-50">
            </div>
            <div>
              <label class="block text-sm font-medium">Espinha</label>
              <input type="text" name="espinha" value="${menu.espinha}"
                class="mt-1 block p-2 w-full rounded-md border border-gray-300 bg-gray-50">
            </div>
            <div>
              <label class="block text-sm font-medium">PA</label>
              <input type="text" name="pa" value="${menu.pa}"
                class="mt-1 block p-2 w-full rounded-md border border-gray-300 bg-gray-50">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium">Carteira/Setor</label>
            <select name="carteira" class="mt-1 block p-2 w-full rounded-md border border-gray-300 bg-gray-50">
              <option ${menu.carteira === 'BV' ? 'selected' : ''} value="BV">BV</option>
              <option ${menu.carteira === 'PAN' ? 'selected' : ''} value="PAN">PAN</option>
              <option ${menu.carteira === 'SANTANDER' ? 'selected' : ''} value="SANTANDER">SANTANDER</option>
              <option ${menu.carteira === 'BRADESCO' ? 'selected' : ''} value="BRADESCO">BRADESCO</option>
              <option ${menu.carteira === 'INFRA' ? 'selected' : ''} value="INFRA">INFRA</option>
            </select>
          </div>

          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button type="submit"
              class="w-full bg-[#1a8caa] text-white py-2 px-4 rounded-lg shadow hover:bg-custom-button-close transition">
              Salvar Alterações
            </button>
            <button type="button" onclick="CloseModal()"
              class="w-full bg-gray-400 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-500 transition">
              Fechar
            </button>
          </div>

        </form>
      </div>
    </div>
    `;

    ModalEditdiv.classList.remove('hidden');
    ModalEditdiv.classList.add('flex');

  } catch (error) {
    console.error(error);
  }
}

// --------------------- FUNÇÃO PARA FECHAR MODAL ---------------------
function CloseModal() {
  const ModalItens = document.getElementById('ModalItens');
  ModalItens.classList.add('hidden');
  ModalItens.classList.remove('flex');
}

// --------------------- CONFIGURAÇÃO DE EVENTOS PAs ---------------------
function configurarPAs() {
  document.querySelectorAll('.pa').forEach(pa => {
    pa.addEventListener('click', () => {
      const local = pa.dataset.local;
      const pc = pa.dataset.pc;
      const id = pa.dataset.id;
      OpenModalItens(local, pc, id);
    });
  });
}

// --------------------- INICIALIZAÇÃO ---------------------
document.addEventListener('DOMContentLoaded', async () => {
  await CreateLayout();
  configurarPAs();
});
