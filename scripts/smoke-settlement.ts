import "dotenv/config";
import { prisma } from "../src/server/db";
import { listMySettlements } from "../src/server/settlement/service";

async function main() {
  const user = await prisma.user.findFirst({
    where: { phone: "13800009999" },
  });
  if (!user) {
    console.log("no smoke user, skip");
    return;
  }

  await prisma.settlement.deleteMany({ where: { userId: user.id } });
  await prisma.settlement.create({
    data: {
      userId: user.id,
      taskId: "task-1",
      amount: 80,
      status: "PAID",
      note: "试标结算冒烟",
    },
  });
  await prisma.settlement.create({
    data: {
      userId: user.id,
      taskId: "task-1",
      amount: 120,
      status: "PENDING",
      note: "待打款",
    },
  });

  const r = await listMySettlements(user.id);
  console.log("summary", r.summary);
  console.log(
    "items",
    r.items.map((i) => `${i.statusLabel}:${i.amount}`).join(", "),
  );
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
