/*
  Warnings:

  - You are about to drop the column `Patrimonio` on the `RelacionamentoPA` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RelacionamentoPA" DROP COLUMN "Patrimonio",
ADD COLUMN     "PatrimonioMNT" TEXT NOT NULL DEFAULT '';
