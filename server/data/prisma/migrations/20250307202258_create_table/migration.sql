-- CreateTable
CREATE TABLE "Computadores" (
    "id" SERIAL NOT NULL,
    "Patrimonio" TEXT NOT NULL,
    "Espinha" TEXT NOT NULL,
    "Local" TEXT NOT NULL,
    "Carteira" TEXT NOT NULL,

    CONSTRAINT "Computadores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Computadores_Patrimonio_key" ON "Computadores"("Patrimonio");
