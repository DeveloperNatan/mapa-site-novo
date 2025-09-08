const menucontainer = document.getElementById("menu-container");
const modaladd = document.getElementById("modal-add");
const buttonadd = document.getElementById("button-modal-add");
const buttonfechar = document.getElementById("buttton-modal-fechar");
const selectFilial = document.getElementById("cad-filial");
const selectEspinha = document.getElementById("cad-espinha");
const selectAndar = document.getElementById("cad-andar");
const selectpa = document.getElementById("cad-pa");
const localcompleto = document.getElementById("cad-localcompleto");
const ModalEditdiv = document.getElementById("ModalEdit");
const CloseModalButtion = document.getElementById("buttton-modal-fechar");
const ButtonEdit = document.getElementById("OpenModalEdit");
const StylesEdit = document.getElementById("styles-edit");
const InputBusca = document.getElementById("input-busca");
const ButtonBusca = document.getElementById("Button-busca");
let ArrayLocals = [];
let menutable = [];

// cria os cards na tela
function CreateItems(item) {
  const menuitems = document.createElement("div");
  const classeJ1 = document.getElementById("classe-J1");
  const classeJ0 = document.getElementById("classe-J0");
  const classeCWB = document.getElementById("classe-CWB");
  const classeSP = document.getElementById("classe-SP");

  ArrayLocals.push(item.localCompleto);

  menuitems.classList =
    "bg-white rounded-lg shadow p-1 mb-1 grid grid-cols-2 md:grid-cols-7 gap-2 items-center text-center";

  menuitems.innerHTML = `
    <span class="hidden md:inline-block">${item.filial}</span>
    <span class="hidden md:inline-block">${item.andar}</span>
    <span class="hidden md:inline-block">${item.espinha}</span>
    <span class="hidden md:inline-block">${item.pa}</span>

    <div class="col-span-1 md:col-span-1 text-left md:text-center">
        <strong class="md:hidden text-sm">Local: </strong>
        <span>${item.localCompleto}</span>
    </div>

    <div class="col-span-1 text-left md:text-center">
        <strong class="md:hidden text-sm">PC: </strong>
        <button onclick="HrefSnipePC('${item.patrimonioPC}')"
                class="underline decoration-1 text-black rounded-sm p-1 w-1/2 cursor-pointer">
            <a class="flex justify-center">${item.patrimonioPC}</a>
        </button>
    </div>

    <div class="col-span-1 flex justify-center gap-2">
        <button class="bg-[#146c84] text-white rounded p-1 cursor-pointer mr-1 btn-edit" 
                onclick="OpenModal(${item.id})" id="OpenModalEdit">
            <i class="bi bi-pencil-square"></i>
        </button>

        <form method="post" action="/delete">
            <input type="hidden" name="id" value="${item.id}">
            <button type="submit" class="bg-red-500 text-white rounded cursor-pointer button-excluir p-1 ml-1">
                <i class="bi bi-trash"></i>
            </button>
        </form>
    </div>
  `;

  switch (item.filial) {
    case "J0":
      classeJ0.appendChild(menuitems);
      break;
    case "J1":
      classeJ1.appendChild(menuitems);
      break;
    case "CWB":
      classeCWB.appendChild(menuitems);
      break;
    case "SP":
      classeSP.appendChild(menuitems);
      break;
  }
}

async function fetchApitable() {
  try {
    const url = "http://localhost:9001/api/relacao";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API request failed, status: ${response.status}`);
    }

    menutable = await response.json();
    console.log(menutable);

    // corrigido para usar localCompleto direto
    menutable.sort((a, b) =>
      a.localCompleto.localeCompare(b.localCompleto)
    );

    menutable.forEach((item) => {
      CreateItems(item);
    });
  } catch (error) {
    console.log("Erro ao buscar dados:", error);
  }
}

//Pesquisa
ButtonBusca.addEventListener("click", () => {
  const termoBusca = InputBusca.value.trim().toLowerCase();
  document.getElementById("classe-J1").innerHTML = "";

  const result = menutable.filter((item) => {
    const local = item.localCompleto.toLowerCase();
    const patrimonioPC = item.patrimonioPC?.toLowerCase();
    return (
      local.includes(termoBusca) ||
      patrimonioPC.includes(termoBusca)
    );
  });

  result.forEach(item => CreateItems(item));
});

InputBusca.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    ButtonBusca.click();
  }
});

InputBusca.addEventListener("input", () => {
  const ValueBusca = InputBusca.value.trim().toLowerCase();
  if (ValueBusca === "") {
    document.getElementById("classe-J0").innerHTML = "";
    document.getElementById("classe-J1").innerHTML = "";
    document.getElementById("classe-CWB").innerHTML = "";
    document.getElementById("classe-SP").innerHTML = "";
    menutable.forEach(item => CreateItems(item));
  }
});

async function ModalEdit(id) {
  try {
    const url = `http://localhost:9001/api/relacao/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed, status:${response.status}`);
    }

    const menu = await response.json();

    ModalEditdiv.innerHTML = `
<div class="fixed inset-0 bg-black/50 flex items-center justify-center">
  <div class="bg-white border border-gray-200 p-6 rounded-2xl shadow-xl w-full max-w-lg text-gray-900">
    <h1 class="text-2xl font-bold mb-6 text-center text-custom-header">Editar Computador</h1>
    <form action="/update" method="post" class="grid grid-cols-1 gap-4">

      <div>
        <label class="block text-sm font-medium">Patrimônio PC</label>
        <input type="text" name="patrimonioPC" value="${menu.patrimonioPC}"
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
          class="w-full bg-custom-button-add text-white py-2 px-4 rounded-lg shadow hover:bg-custom-button-close transition">
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
  } catch (error) {
    console.error(error);
  }
}

function OpenModal(id) {
  ModalEditdiv.classList.remove("hidden");
  ModalEdit(id);
}

function CloseModal() {
  ModalEditdiv.classList.add("hidden");
}

if (selectEspinha) {
  for (let i = 1; i <= 37; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    selectEspinha.appendChild(option);
  }
}

if (selectAndar) {
  for (let i = 0; i <= 8; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    selectAndar.appendChild(option);
  }
}

if (selectpa) {
  for (let i = 1; i <= 18; i++) {
    let option = document.createElement("option");
    option.value = i;
    option.innerHTML = i;
    selectpa.appendChild(option);
  }
}

buttonadd.addEventListener("click", () => {
  modaladd.classList.remove("invisible", "opacity-0");
  modaladd.classList.add("visible", "opacity-400");
  modaladd.querySelector("div").classList.remove("scale-90");
  modaladd.querySelector("div").classList.add("scale-100");
});

buttonfechar.addEventListener("click", function (e) {
  if (e.target === buttonfechar) {
    modaladd.classList.remove("visible", "opacity-400");
    modaladd.classList.add("invisible", "opacity-0");
    modaladd.querySelector("div").classList.remove("scale-100");
    modaladd.querySelector("div").classList.add("scale-90");
  }
});

function HrefSnipePC(item) {
  window.open(`https://snipe.schulze.com.br/hardware?page=1&size=20&order=asc&sort=name&search=${item}`, '_blank');
}

function HrefSnipeMNT(item) {
  window.open(`https://snipe.schulze.com.br/hardware?page=1&size=20&order=asc&sort=name&search=${item}`, '_blank');
}

fetchApitable();
