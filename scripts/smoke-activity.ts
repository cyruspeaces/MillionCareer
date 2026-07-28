import "dotenv/config";
import { prisma } from "../src/server/db";
import {
  RegisterError,
  getActivityById,
  hasRegistered,
  listActivities,
  registerActivity,
} from "../src/server/activity/service";

async function main() {
  const list = await listActivities();
  console.log(
    "OK list",
    list.length,
    list.map((a) => a.id).join(","),
  );

  const detail = await getActivityById("act-1");
  console.log("OK detail", detail?.title, detail?.canRegister);

  const phone = "13800008888";
  let user = await prisma.user.findFirst({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        phone,
        nickname: "活动报名测试",
        identities: {
          create: { provider: "PHONE", providerUserId: phone },
        },
        profile: { create: {} },
      },
    });
  }

  await prisma.activityRegistration.deleteMany({
    where: { userId: user.id, activityId: "act-1" },
  });

  const r = await registerActivity(user.id, "act-1");
  console.log("OK register", r.id);
  console.log("OK hasRegistered", await hasRegistered(user.id, "act-1"));

  try {
    await registerActivity(user.id, "act-1");
    throw new Error("expected ALREADY_REGISTERED");
  } catch (e) {
    if (e instanceof RegisterError && e.code === "ALREADY_REGISTERED") {
      console.log("OK duplicate blocked");
    } else {
      throw e;
    }
  }
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
