-- 展示用报名人数。不写入 TaskApplication，报名校验仍只看真实报名数。
ALTER TABLE "Task" ADD COLUMN "displayJoinedCount" INTEGER NOT NULL DEFAULT 0;
