"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Brain,
  ClipboardCheck,
  Compass,
  Download,
  ListTodo,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Timer,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  fetchLatestAssessment,
  submitAssessmentAnswers,
} from "@/lib/assessment-client";
import {
  assessmentArchetypes,
  assessmentQuestions,
  clearAssessmentResult,
  personalizedNextSteps,
  saveAssessmentResult,
  toDimensionScores,
  type AssessmentResult,
  type DimensionScore,
} from "@/data/assessment";

type Stage = "intro" | "quiz" | "report";

/** 维度雷达图（纯 SVG，随维度数量自适应） */
function RadarChart({ scores }: { scores: DimensionScore[] }) {
  const size = 260;
  const center = size / 2;
  const radius = 92;
  const count = scores.length;

  const pointFor = (index: number, ratio: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    return {
      x: center + radius * ratio * Math.cos(angle),
      y: center + radius * ratio * Math.sin(angle),
    };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const valuePoints = scores
    .map((s, i) => {
      const p = pointFor(i, Math.max(s.normalized, 8) / 100);
      return `${p.x},${p.y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto w-full max-w-[280px]"
      role="img"
      aria-label="能力维度雷达图"
    >
      {gridLevels.map((level) => (
        <polygon
          key={level}
          points={scores
            .map((_, i) => {
              const p = pointFor(i, level);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={1}
        />
      ))}
      {scores.map((_, i) => {
        const p = pointFor(i, 1);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="var(--color-border)"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={valuePoints}
        fill="rgba(47, 49, 139, 0.18)"
        stroke="#2F318B"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {scores.map((s, i) => {
        const p = pointFor(i, Math.max(s.normalized, 8) / 100);
        return (
          <circle key={s.dimension.id} cx={p.x} cy={p.y} r={3.5} fill="#F08519" />
        );
      })}
      {scores.map((s, i) => {
        const p = pointFor(i, 1.22);
        return (
          <text
            key={s.dimension.id}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[var(--color-text-secondary)] text-[11px] font-medium"
          >
            {s.dimension.shortName}
          </text>
        );
      })}
    </svg>
  );
}

const levelStyle: Record<DimensionScore["level"], string> = {
  优势突出: "bg-[var(--color-primary)] text-white",
  基础在线: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  潜力萌芽: "bg-[var(--color-accent-soft)] text-[var(--color-accent-hover)]",
};

function ReportView({
  result,
  onRetake,
}: {
  result: AssessmentResult;
  onRetake: () => void;
}) {
  const archetype = assessmentArchetypes[result.archetypeId];
  const scores = toDimensionScores(result);
  const reportRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const onDownloadPdf = async () => {
    if (!reportRef.current || exporting) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");
      const el = reportRef.current;
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      let heightLeft = contentHeight;
      let position = margin;

      pdf.addImage(imgData, "PNG", margin, position, contentWidth, contentHeight);
      heightLeft -= pageHeight - margin * 2;

      while (heightLeft > 0) {
        position = margin - (contentHeight - heightLeft);
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          margin,
          position,
          contentWidth,
          contentHeight,
        );
        heightLeft -= pageHeight - margin * 2;
      }

      const safeName = archetype.name.replace(/[\\/:*?"<>|]/g, "");
      pdf.save(
        `百万职场-AI能力测评报告-${archetype.code}-${safeName}-${result.completedAt}.pdf`,
      );
    } catch (e) {
      console.error("[assessment pdf]", e);
      window.alert("导出 PDF 失败，请稍后重试");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div ref={reportRef} className="space-y-6 bg-[#f7f7fb] p-1">
      {/* 类型卡片 */}
      <section className="overflow-hidden rounded-2xl border border-[var(--color-primary)]/25 bg-white/60">
        <div className="bg-[var(--color-primary)] px-6 py-7 text-white sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold tracking-[0.2em] text-white/70">
                AI 能力测评报告 · {result.completedAt}
              </p>
              <div className="mt-3 flex flex-wrap items-baseline gap-3">
                <span className="rounded-lg bg-white/15 px-3 py-1 text-2xl font-black tracking-widest">
                  {archetype.code}
                </span>
                <h2 className="text-2xl font-bold sm:text-3xl">
                  {archetype.name}
                </h2>
              </div>
              <p className="mt-2 text-sm font-medium text-[#F8B26A]">
                {archetype.tagline}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo2.png"
              alt="百万职场"
              width={72}
              height={72}
              className="size-14 shrink-0 rounded-lg bg-white p-1 sm:size-[72px]"
            />
          </div>
        </div>
        <div className="px-6 py-5 sm:px-8">
          <p className="text-sm leading-7 text-[var(--color-text-secondary)]">
            {archetype.desc}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {archetype.recommendedDirections.map((d) => (
              <span
                key={d}
                className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-hover)]"
              >
                适合 · {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 雷达 + 维度分 */}
      <section className="rounded-2xl border border-[var(--color-border)]/70 bg-white/55 p-5 sm:p-6">
        <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)]">
          <Brain className="size-4 text-[var(--color-accent)]" aria-hidden />
          六维能力画像
        </h3>
        <div className="mt-4 grid gap-6 sm:grid-cols-[280px_minmax(0,1fr)] sm:items-center">
          <RadarChart scores={scores} />
          <ul className="space-y-3">
            {scores.map((s) => (
              <li key={s.dimension.id}>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {s.dimension.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${levelStyle[s.level]}`}
                    >
                      {s.level}
                    </span>
                    <span className="w-8 text-right text-sm font-bold text-[var(--color-primary)]">
                      {s.normalized}
                    </span>
                  </div>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[#5558c9]"
                    style={{ width: `${Math.max(s.normalized, 4)}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  {s.dimension.desc} · 对应 {s.dimension.taskDirection}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 点亮技能 */}
      <section className="rounded-2xl border border-[var(--color-border)]/70 bg-white/55 p-5 sm:p-6">
        <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)]">
          <BadgeCheck
            className="size-4 text-[var(--color-accent)]"
            aria-hidden
          />
          本次测评点亮的技能
        </h3>
        {result.litSkills.length > 0 ? (
          <>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {result.litSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-primary)] px-3 py-1.5 text-sm font-semibold text-white shadow-sm"
                >
                  <BadgeCheck className="size-4" aria-hidden />
                  {skill}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-[var(--color-text-secondary)]">
              已同步到你的技能树。漫剧制作师、模型训练师等高价资格需通过课程或任务点亮，测评只解锁起步包。
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
            本次未达到点亮阈值——先从零门槛任务开始积累，随时可以回来重测。
          </p>
        )}
      </section>

      {/* 下一步 */}
      <section className="rounded-2xl border border-[var(--color-border)]/70 bg-white/55 p-5 sm:p-6">
        <h3 className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text)]">
          <Compass className="size-4 text-[var(--color-accent)]" aria-hidden />
          接下来做的 3 件事
        </h3>
        <ol className="mt-4 space-y-3">
          {personalizedNextSteps(result).map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white">
                {i + 1}
              </span>
              <p className="text-sm leading-6 text-[var(--color-text-secondary)]">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </section>
      </div>

      {/* CTA */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/tasks"
          className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md bg-[var(--color-accent)] text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
        >
          <ListTodo className="size-4" aria-hidden />
          按推荐方向去领任务
        </Link>
        <Link
          href="/me"
          className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-md border border-[var(--color-primary)] text-sm font-medium text-[var(--color-primary)] transition hover:bg-[var(--color-primary-soft)]"
        >
          <Sparkles className="size-4" aria-hidden />
          查看我的技能树
        </Link>
        <button
          type="button"
          onClick={() => void onDownloadPdf()}
          disabled={exporting}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-[var(--color-primary)] px-5 text-sm font-medium text-[var(--color-primary)] transition hover:bg-[var(--color-primary-soft)] disabled:opacity-60"
        >
          <Download className="size-4" aria-hidden />
          {exporting ? "导出中…" : "下载为 PDF"}
        </button>
        <button
          type="button"
          onClick={onRetake}
          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-[var(--color-border)] px-5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
        >
          <RotateCcw className="size-4" aria-hidden />
          重新测评
        </button>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  const { user, openLogin } = useAuth();
  const [stage, setStage] = useState<Stage>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchLatestAssessment()
      .then((saved) => {
        if (cancelled) return;
        if (saved) {
          saveAssessmentResult(saved);
          setResult(saved);
          setStage("report");
        }
      })
      .catch(() => {
        /* 未登录或网络失败时停留在 intro */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const question = assessmentQuestions[questionIndex];
  const total = assessmentQuestions.length;
  const progress = Math.round((questionIndex / total) * 100);

  const startQuiz = () => {
    if (!user) {
      openLogin({ next: "/assessment" });
      return;
    }
    setSubmitError(null);
    setStage("quiz");
  };

  const finishQuiz = async (finalAnswers: Record<string, string>) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const computed = await submitAssessmentAnswers(finalAnswers);
      saveAssessmentResult(computed);
      setResult(computed);
      setStage("report");
    } catch (e) {
      const err = e as Error & { code?: string };
      if (err.code === "UNAUTHORIZED") {
        openLogin({ next: "/assessment" });
        setSubmitError("登录后即可保存测评结果并点亮技能");
      } else {
        setSubmitError(err.message || "提交失败，请重试");
      }
    } finally {
      setSubmitting(false);
      setLocked(false);
    }
  };

  const selectOption = (optionId: string) => {
    if (locked || submitting) return;
    setLocked(true);
    const nextAnswers = { ...answers, [question.id]: optionId };
    setAnswers(nextAnswers);

    window.setTimeout(() => {
      if (questionIndex + 1 < total) {
        setLocked(false);
        setQuestionIndex(questionIndex + 1);
      } else {
        void finishQuiz(nextAnswers);
      }
    }, 280);
  };

  const goBack = () => {
    if (questionIndex > 0) setQuestionIndex(questionIndex - 1);
  };

  const retake = () => {
    if (!user) {
      openLogin({ next: "/assessment" });
      return;
    }
    clearAssessmentResult();
    setResult(null);
    setAnswers({});
    setQuestionIndex(0);
    setSubmitError(null);
    setStage("intro");
  };

  const introHighlights = useMemo(
    () => [
      {
        icon: Timer,
        title: "约 8 分钟",
        desc: `${total} 道题，全部情景选择，不用打字`,
      },
      {
        icon: ClipboardCheck,
        title: "情景实测",
        desc: "测「你会怎么做」，不是自我感觉打分",
      },
      {
        icon: ShieldCheck,
        title: "免费 · 点亮技能",
        desc: "生成能力报告，并解锁技能树起步节点",
      },
    ],
    [total],
  );

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        {stage === "intro" ? (
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-accent)]">
              AI ABILITY TEST
            </p>
            <h1 className="mt-2 text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
              AI 能力测评
            </h1>
            <p className="mt-3 text-sm leading-7 text-[var(--color-text-secondary)] sm:text-base">
              通过 {total} 道情景题，从
              对话判断、规范安全、内容创作、Agent 工具、提示指令、交付协作
              六个维度定位你的 AI 接单能力，生成专属类型报告，并直接点亮技能树起步节点。
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {introHighlights.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[var(--color-border)]/70 bg-white/55 p-4"
                  >
                    <Icon
                      className="size-5 text-[var(--color-accent)]"
                      aria-hidden
                    />
                    <p className="mt-2 text-sm font-semibold text-[var(--color-text)]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={startQuiz}
                disabled={loading}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] text-base font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "加载中…" : user ? "开始测评" : "登录后开始测评"}
                <ArrowRight className="size-4" aria-hidden />
              </button>
              <Link
                href="/tasks"
                className="inline-flex h-12 items-center justify-center rounded-md border border-[var(--color-border)] px-6 text-sm font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)]"
              >
                先去领任务，回头再测
              </Link>
            </div>
            <p className="mt-4 text-xs text-[var(--color-text-secondary)]">
              测评完全免费。结果写入账号并点亮技能树起步节点，换设备也能同步；可随时重测（已点亮技能不撤销）。
            </p>
          </div>
        ) : null}

        {stage === "quiz" ? (
          <div className="mx-auto max-w-2xl">
            {/* 进度 */}
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={goBack}
                disabled={questionIndex === 0}
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft className="size-4" aria-hidden />
                上一题
              </button>
              <p className="text-xs font-semibold text-[var(--color-text-secondary)]">
                {questionIndex + 1} / {total}
              </p>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-bg-muted)]">
              <div
                className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* 题目 */}
            <div className="mt-8">
              <span className="rounded-full bg-[var(--color-primary-soft)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                {question.scene}
              </span>
              <h2 className="mt-3 text-lg font-bold leading-8 text-[var(--color-text)] sm:text-xl">
                {question.text}
              </h2>

              {question.material ? (
                <div className="mt-4 space-y-2">
                  {question.material.map((line) => (
                    <p
                      key={line}
                      className="rounded-xl border border-[var(--color-border)]/70 bg-white/60 px-4 py-3 text-sm leading-6 text-[var(--color-text-secondary)]"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ) : null}

              <div className="mt-6 space-y-3">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={locked || submitting}
                      onClick={() => selectOption(option.id)}
                      className={[
                        "block w-full rounded-xl border-2 px-4 py-3.5 text-left text-sm leading-6 transition sm:px-5 disabled:opacity-60",
                        selected
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] font-medium text-[var(--color-primary)]"
                          : "border-[var(--color-border)]/80 bg-white/60 text-[var(--color-text)] hover:border-[var(--color-primary)]/50",
                      ].join(" ")}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
              {submitting ? (
                <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
                  正在保存测评结果并点亮技能…
                </p>
              ) : null}
              {submitError ? (
                <p className="mt-4 text-sm text-[var(--color-accent-hover)]">
                  {submitError}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {stage === "report" && result ? (
          <ReportView result={result} onRetake={retake} />
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
