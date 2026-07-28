import "dotenv/config";
import { prisma } from "../src/server/db";
import {
  ApplyError,
  applyToTask,
  hasApplied,
  listMyApplications,
} from "../src/server/task/service";

async function main() {
  const phone = "13800009999";
  let user = await prisma.user.findFirst({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        nickname: "报名测试",
        identities: {
          create: { provider: "PHONE", providerUserId: phone },
        },
        profile: { create: {} },
      },
    });
  }

  await prisma.taskApplication.deleteMany({
    where: { userId: user.id, taskId: { in: ["task-1", "task-2"] } },
  });
  await prisma.userSkill.deleteMany({ where: { userId: user.id } });

  try {
    await applyToTask(user.id, "task-1");
    throw new Error("expected SKILL_REQUIRED");
  } catch (e) {
    if (e instanceof ApplyError && e.code === "SKILL_REQUIRED") {
      console.log("OK skill gate:", e.message);
    } else {
      throw e;
    }
  }

  const codes = ["zh-express", "dialogue-quality", "label-basic"];
  const skills = await prisma.skill.findMany({ where: { code: { in: codes } } });
  for (const s of skills) {
    await prisma.userSkill.create({
      data: { userId: user.id, skillId: s.id, source: "ASSESSMENT" },
    });
  }

  const r1 = await applyToTask(user.id, "task-1");
  console.log("OK apply task-1", r1.id);
  console.log("OK hasApplied", await hasApplied(user.id, "task-1"));

  try {
    await applyToTask(user.id, "task-1");
    throw new Error("expected ALREADY_APPLIED");
  } catch (e) {
    if (e instanceof ApplyError && e.code === "ALREADY_APPLIED") {
      console.log("OK duplicate blocked");
    } else {
      throw e;
    }
  }

  try {
    await applyToTask(user.id, "task-2");
    throw new Error("expected SKILL_REQUIRED for task-2");
  } catch (e) {
    if (e instanceof ApplyError && e.code === "SKILL_REQUIRED") {
      console.log("OK task-2 still gated:", e.details?.missingSkills?.join(","));
    } else {
      throw e;
    }
  }

  const apps = await listMyApplications(user.id);
  console.log("OK my apps", apps.length, apps[0]?.task.title);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
