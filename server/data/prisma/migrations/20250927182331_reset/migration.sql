/*
  Warnings:

  - You are about to drop the column `Andar` on the `LocalizacaoPA` table. All the data in the column will be lost.
  - You are about to drop the column `Carteira` on the `LocalizacaoPA` table. All the data in the column will be lost.
  - You are about to drop the column `Espinha` on the `LocalizacaoPA` table. All the data in the column will be lost.
  - You are about to drop the column `PA` on the `LocalizacaoPA` table. All the data in the column will be lost.
  - You are about to drop the column `DataCricao` on the `RelacionamentoPA` table. All the data in the column will be lost.
  - You are about to drop the column `DataModificacao` on the `RelacionamentoPA` table. All the data in the column will be lost.
  - You are about to drop the column `LocalCompleto` on the `RelacionamentoPA` table. All the data in the column will be lost.
  - You are about to drop the column `PatrimonioMNT` on the `RelacionamentoPA` table. All the data in the column will be lost.
  - You are about to drop the column `PatrimonioPC` on the `RelacionamentoPA` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[localCompleto]` on the table `RelacionamentoPA` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `andar` to the `LocalizacaoPA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carteira` to the `LocalizacaoPA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `espinha` to the `LocalizacaoPA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pa` to the `LocalizacaoPA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataModificacao` to the `RelacionamentoPA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localCompleto` to the `RelacionamentoPA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patrimonioPC` to the `RelacionamentoPA` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."RelacionamentoPA_LocalCompleto_key";

-- AlterTable
ALTER TABLE "public"."LocalizacaoPA" DROP COLUMN "Andar",
DROP COLUMN "Carteira",
DROP COLUMN "Espinha",
DROP COLUMN "PA",
ADD COLUMN     "andar" TEXT NOT NULL,
ADD COLUMN     "carteira" TEXT NOT NULL,
ADD COLUMN     "espinha" TEXT NOT NULL,
ADD COLUMN     "pa" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."RelacionamentoPA" DROP COLUMN "DataCricao",
DROP COLUMN "DataModificacao",
DROP COLUMN "LocalCompleto",
DROP COLUMN "PatrimonioMNT",
DROP COLUMN "PatrimonioPC",
ADD COLUMN     "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dataModificacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "localCompleto" TEXT NOT NULL,
ADD COLUMN     "patrimonioMNT1" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "patrimonioMNT2" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "patrimonioPC" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "RelacionamentoPA_id_seq";

-- CreateTable
CREATE TABLE "public"."HistoricoPA" (
    "id" SERIAL NOT NULL,
    "localizacaoPAId" INTEGER NOT NULL,
    "relacionamentoPAId" INTEGER NOT NULL,
    "acao" TEXT NOT NULL,
    "valorAnterior" TEXT,
    "valorNovo" TEXT,
    "dataRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoPA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RelacionamentoPA_localCompleto_key" ON "public"."RelacionamentoPA"("localCompleto");

-- AddForeignKey
ALTER TABLE "public"."HistoricoPA" ADD CONSTRAINT "HistoricoPA_localizacaoPAId_fkey" FOREIGN KEY ("localizacaoPAId") REFERENCES "public"."LocalizacaoPA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."HistoricoPA" ADD CONSTRAINT "HistoricoPA_relacionamentoPAId_fkey" FOREIGN KEY ("relacionamentoPAId") REFERENCES "public"."RelacionamentoPA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
