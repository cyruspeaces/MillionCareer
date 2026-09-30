import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * schema / generate 变更后递增，避免 Next HMR 沿用旧 PrismaClient
 *（旧实例会缺 assessmentRecord 等新模型）
 */
const PRISMA_CLIENT_REVISION = 11;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaRevision?: number;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

function getPrismaClient() {
  if (globalForPrisma.prismaRevision !== PRISMA_CLIENT_REVISION) {
    globalForPrisma.prisma = undefined;
    globalForPrisma.prismaRevision = PRISMA_CLIENT_REVISION;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  // 热更新后若 Client 类未刷新，实例会缺新模型；探测后强制重建
  const client = globalForPrisma.prisma as PrismaClient & {
    job?: unknown;
  };
  if (typeof client.job === "undefined") {
    globalForPrisma.prisma = createPrismaClient();
    const rebuilt = globalForPrisma.prisma as PrismaClient & {
      job?: unknown;
    };
    if (typeof rebuilt.job === "undefined") {
      throw new Error(
        "Prisma Client 缺少 Job，请停止并重启 npm run dev（先执行 npx prisma generate）",
      );
    }
  }

  return globalForPrisma.prisma;
}

/** 懒加载，避免未连库时仅渲染页面就初始化 Client */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = getPrismaClient();
    // 必须用 client 作 receiver，否则 Prisma 的 model getter 会拿到空 Proxy
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
