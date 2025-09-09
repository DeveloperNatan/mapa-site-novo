const prisma = require("../data/prisma");

exports.Cadastro = async function (req, res) {
  console.log(req.body);
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
    await prisma.relacionamentoPA.create({
      data: {
        id: NovaPA.id,
        localCompleto: localcompleto,
        patrimonioPC: patrimonioPC,
      },
    });
    res.status(201).redirect("/");
  } catch (error) {
    console.error({ error: "erro ao criar", details: error.message });
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
    res.status(401).json({ error: "erro ao deletar", details: error.message });
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

    // Trigger no banco já cria o histórico, não precisa fazer nada manualmente aqui

    res.status(200).json({ message: "Atualizado com sucesso" });
  } catch (error) {
    console.error({ error: "Erro ao editar", details: error.message });
    res.status(500).json({ error: "Erro ao editar", details: error.message });
  }
};
