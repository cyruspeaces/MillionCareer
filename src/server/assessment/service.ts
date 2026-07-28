import { Prisma } from "@/generated/prisma/client";
import {
  computeAssessmentResult,
  type AssessmentResult,
  type DimensionId,
} from "@/data/assessment";
import { prisma } from "@/server/db";

export type AssessmentDto = AssessmentResult & {
  id: string;
  litSkillCodes: string[];
};

function toDto(row: {
  id: string;
  version: number;
  archetypeId: string;
  intentOptionId: string | null;
  frequencyOptionId: string | null;
  scores: unknown;
  litSkillCodes: string[];
  completedAt: Date;
}): AssessmentDto {
  const scores = (Array.isArray(row.scores) ? row.scores : []) as {
    dimensionId: DimensionId;
    raw: number;
    normalized: number;
  }[];

  return {
    id: row.id,
    version: 2,
    completedAt: row.completedAt.toISOString().slice(0, 10),
    archetypeId: row.archetypeId as AssessmentResult["archetypeId"],
    intentOptionId: row.intentOptionId,
    frequencyOptionId: row.frequencyOptionId,
    scores,
    litSkillCodes: row.litSkillCodes,
    litSkills: [], // filled by caller with names
  };
}

/** 取用户最近一次测评（含点亮技能中文名） */
export async function getLatestAssessment(
  userId: string,
): Promise<AssessmentDto | null> {
  const row = await prisma.assessmentRecord.findFirst({
    where: { userId },
    orderBy: { completedAt: "desc" },
  });
  if (!row) return null;

  const dto = toDto(row);
  if (row.litSkillCodes.length === 0) {
    dto.litSkills = [];
    return dto;
  }

  const skills = await prisma.skill.findMany({
    where: { code: { in: row.litSkillCodes } },
    select: { code: true, name: true },
  });
  const nameByCode = new Map(skills.map((s) => [s.code, s.name]));
  dto.litSkills = row.litSkillCodes
    .map((code) => nameByCode.get(code))
    .filter((n): n is string => Boolean(n));
  return dto;
}

/**
 * 提交测评答案：计分 → 落库 → 幂等点亮 UserSkill（只增不减）
 */
export async function submitAssessment(
  userId: string,
  answers: Record<string, string>,
): Promise<AssessmentDto> {
  if (!answers || typeof answers !== "object") {
    throw new Error("INVALID_ANSWERS");
  }

  const result = computeAssessmentResult(answers);

  const skillRows =
    result.litSkills.length === 0
      ? []
      : await prisma.skill.findMany({
          where: { name: { in: result.litSkills }, active: true },
          select: { id: true, code: true, name: true },
        });

  const litSkillCodes = skillRows.map((s) => s.code);
  const nameByCode = new Map(skillRows.map((s) => [s.code, s.name]));

  const record = await prisma.$transaction(async (tx) => {
    const created = await tx.assessmentRecord.create({
      data: {
        userId,
        version: result.version,
        archetypeId: result.archetypeId,
        intentOptionId: result.intentOptionId,
        frequencyOptionId: result.frequencyOptionId,
        scores: result.scores as Prisma.InputJsonValue,
        answers: answers as Prisma.InputJsonValue,
        litSkillCodes,
      },
    });

    for (const skill of skillRows) {
      await tx.userSkill.upsert({
        where: {
          userId_skillId: { userId, skillId: skill.id },
        },
        create: {
          userId,
          skillId: skill.id,
          source: "ASSESSMENT",
          sourceRef: created.id,
        },
        update: {}, // 已点亮不撤销、不覆盖来源
      });
    }

    return created;
  });

  const dto = toDto(record);
  dto.litSkills = litSkillCodes
    .map((code) => nameByCode.get(code))
    .filter((n): n is string => Boolean(n));
  return dto;
}

/** 当前用户已点亮技能（用于技能树） */
export async function listUserSkills(userId: string) {
  const rows = await prisma.userSkill.findMany({
    where: { userId },
    include: {
      skill: {
        select: {
          code: true,
          name: true,
          group: true,
          kind: true,
          tier: true,
        },
      },
    },
    orderBy: { unlockedAt: "asc" },
  });

  return rows.map((r) => ({
    code: r.skill.code,
    name: r.skill.name,
    group: r.skill.group,
    kind: r.skill.kind,
    tier: r.skill.tier,
    source: r.source,
    unlockedAt: r.unlockedAt.toISOString().slice(0, 10),
  }));
}
