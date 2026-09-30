-- CreateTable
CREATE TABLE "BankCardBinding" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "holderName" TEXT NOT NULL,
    "idCardEnc" TEXT NOT NULL,
    "accountNoEnc" TEXT NOT NULL,
    "mobileEnc" TEXT NOT NULL,
    "idCardMask" TEXT NOT NULL,
    "cardMask" TEXT NOT NULL,
    "mobileMask" TEXT NOT NULL,
    "bankName" TEXT,
    "cardType" TEXT,
    "cardName" TEXT,
    "verifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankCardBinding_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankCardBinding_userId_key" ON "BankCardBinding"("userId");

-- AddForeignKey
ALTER TABLE "BankCardBinding" ADD CONSTRAINT "BankCardBinding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
