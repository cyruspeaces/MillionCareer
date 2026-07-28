-- AlterTable
ALTER TABLE "Task" DROP COLUMN "acceptanceCriteria",
ADD COLUMN     "acceptance" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "deliverables" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "enrollSteps" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "location" TEXT,
ADD COLUMN     "publisherName" TEXT,
ADD COLUMN     "publisherNote" TEXT,
ADD COLUMN     "references" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "rewardAmount" DECIMAL(12,2),
ADD COLUMN     "rewardUnit" TEXT,
ADD COLUMN     "specs" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "suitFor" TEXT,
ADD COLUMN     "workType" TEXT;

-- CreateIndex
CREATE INDEX "Task_category_idx" ON "Task"("category");
