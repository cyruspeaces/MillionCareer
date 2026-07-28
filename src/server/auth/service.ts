import { prisma } from "@/server/db";

export type AuthUserDto = {
  id: string;
  phone: string | null;
  nickname: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
};

function toAuthUser(user: {
  id: string;
  phone: string | null;
  nickname: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: Date;
}): AuthUserDto {
  return {
    id: user.id,
    phone: user.phone,
    nickname: user.nickname,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    createdAt: user.createdAt.toISOString(),
  };
}

function defaultNickname(phone: string) {
  return `创作者_${phone.slice(-4)}`;
}

/** 按手机号登录或自动注册 */
export async function loginOrRegister(phone: string): Promise<{
  user: AuthUserDto;
  isNew: boolean;
}> {
  const existing = await prisma.user.findUnique({
    where: { phone },
  });

  if (existing) {
    return { user: toAuthUser(existing), isNew: false };
  }

  const user = await prisma.user.create({
    data: {
      phone,
      nickname: defaultNickname(phone),
      roles: ["CREATOR"],
      identities: {
        create: {
          provider: "PHONE",
          providerUserId: phone,
        },
      },
      profile: {
        create: {},
      },
    },
  });

  return { user: toAuthUser(user), isNew: true };
}

export async function getUserById(userId: string): Promise<AuthUserDto | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user ? toAuthUser(user) : null;
}
