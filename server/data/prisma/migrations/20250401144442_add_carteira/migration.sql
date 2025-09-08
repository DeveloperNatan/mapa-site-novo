/*
  Warnings:

  - A unique constraint covering the columns `[Patrimonio]` on the table `RelacionamentoPA` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Carteira` to the `LocalizacaoPA` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LocalizacaoPA" ADD COLUMN     "Carteira" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RelacionamentoPA_Patrimonio_key" ON "RelacionamentoPA"("Patrimonio");
