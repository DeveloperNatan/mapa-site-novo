-- DropIndex
DROP INDEX "RelacionamentoPA_Patrimonio_key";

-- AlterTable
ALTER TABLE "RelacionamentoPA" ADD COLUMN     "localizacaoPAId" INTEGER;

-- AddForeignKey
ALTER TABLE "RelacionamentoPA" ADD CONSTRAINT "RelacionamentoPA_id_fkey" FOREIGN KEY ("id") REFERENCES "LocalizacaoPA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
