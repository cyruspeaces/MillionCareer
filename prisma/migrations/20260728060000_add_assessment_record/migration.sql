-- CreateTable
CREATE TABLE "AssessmentRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 2,
    "archetypeId" TEXT NOT NULL,
    "intentOptionId" TEXT,
    "frequencyOptionId" TEXT,
    "scores" JSONB NOT NULL,
    "answers" JSONB NOT NULL,
    "litSkillCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AssessmentRecord_userId_completedAt_idx" ON "AssessmentRecord"("userId", "completedAt");

-- AddForeignKey
ALTER TABLE "AssessmentRecord" ADD CONSTRAINT "AssessmentRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
