const prisma = require("../data/prisma");

exports.Cadastro = async function (req, res) {
  const { filial, andar, espinha, pa, patrimonioPC, carteira } = req.body;

  const localcompleto = `${filial}-A${andar.padStart(
    2,
    "0"
  )}-E${espinha.padStart(2, "0")}-PA${pa.padStart(2, "0")}`;

  try {
    const ConsultaExiste = await prisma.localizacaoPA.findFirst({
      where: {
        filial: filial,
        andar: andar,
        espinha: espinha,
        pa: pa,
      },
    });

    if (ConsultaExiste) {
      return res.status(409).json({
        error: "Local já existe",
        details: `PA com id ${localcompleto}`,
      });
    }

    const NovaPA = await prisma.localizacaoPA.create({
      data: {
        filial: filial,
        andar: andar,
        espinha: espinha,
        pa: pa,
        carteira: carteira,
      },
    });
    if (patrimonioPC && patrimonioPC.trim() !== "") {
      await prisma.relacionamentoPA.create({
        data: {
          id: NovaPA.id,
          localCompleto: localcompleto,
          patrimonioPC: patrimonioPC,
        },
      });
    }
    res.status(201).redirect("/");
  } catch (error) {
    res.status(501).json({ error: "error ao criar", details: error.message });
  }
};

exports.Delete = async function (req, res) {
  const id = parseInt(req.body.id);

  try {
    await prisma.relacionamentoPA.deleteMany({
      where: {
        id: id,
      },
    });
    await prisma.localizacaoPA.deleteMany({
      where: {
        id: id,
      },
    });
    res.status(201).redirect("/");
  } catch (error) {
    res.status(501).json({ error: "erro ao deletar", details: error.message });
  }
};

exports.Edicao = async function (req, res) {
  const id = parseInt(req.body.id);
  const { filial, andar, espinha, pa, patrimonioPC, carteira } = req.body;

  // Monta o local completo
  const localcompleto = `${filial}-A${andar.padStart(
    2,
    "0"
  )}-E${espinha.padStart(2, "0")}-PA${pa.padStart(2, "0")}`;

  try {
    // Atualiza a LocalizacaoPA
    await prisma.localizacaoPA.update({
      where: { id: id },
      data: {
        filial,
        andar,
        espinha,
        pa,
        carteira,
      },
    });

    // Atualiza o RelacionamentoPA
    await prisma.relacionamentoPA.update({
      where: { id: id },
      data: {
        patrimonioPC: patrimonioPC,
        patrimonioMNT1: "",
        patrimonioMNT2: "",
        localCompleto: localcompleto,
      },
    });

    // Trigger no banco já cria o histórico

    res.status(201).redirect("/");
  } catch (error) {
    res.status(501).json({ error: "Erro ao editar", details: error.message });
  }
};

exports.HistoricoFind = async function (req, res) {
  const id = req.params.id;
  try {
    const resultado = await prisma.relacionamentoPA.findUnique({
      where: { id: Number(id) },
      include: {
        HistoricoPA: true,
      },
    });
    res.json(resultado);
    1;
  } catch (error) {
    res
      .status(501)
      .json({ error: "Erro consultar historico", details: error.message });
  }
};
