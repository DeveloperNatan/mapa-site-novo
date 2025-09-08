-- CreateTable
CREATE TABLE "LocalizacaoPA" (
    "id" SERIAL NOT NULL,
    "filial" TEXT NOT NULL,
    "Andar" TEXT NOT NULL,
    "Espinha" TEXT NOT NULL,
    "PA" INTEGER NOT NULL,

    CONSTRAINT "LocalizacaoPA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RelacionamentoPA" (
    "id" SERIAL NOT NULL,
    "LocalCompleto" TEXT NOT NULL,
    "Patrimonio" TEXT NOT NULL,
    "DataCricao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DataModificacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelacionamentoPA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RelacionamentoPA_LocalCompleto_key" ON "RelacionamentoPA"("LocalCompleto");
