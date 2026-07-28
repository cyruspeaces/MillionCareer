const steps = [
  {
    n: "01",
    title: "发布或领取 AI 任务",
    desc: "发包方发布商单与验收标准；创作者按能力领取对话、数据或内容任务。",
  },
  {
    n: "02",
    title: "交付作品与结果",
    desc: "按约定提交标注结果、脚本、成片或评测报告，过程可追踪。",
  },
  {
    n: "03",
    title: "验收结算与沉淀",
    desc: "验收通过后结算；优质交付进入创作者档案，解锁更高阶商单与活动。",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-[var(--color-border)]/60 bg-transparent px-4 py-12 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-lg font-semibold text-[var(--color-primary)] sm:text-xl">
          如何协作
        </h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          不是投递简历，而是围绕 AI 任务完成一次可信交付
        </p>
        <ol className="mt-8 grid gap-8 sm:grid-cols-3 sm:gap-6">
          {steps.map((step) => (
            <li key={step.n}>
              <p className="text-xs font-semibold tracking-widest text-[var(--color-accent)]">
                {step.n}
              </p>
              <h3 className="mt-2 text-base font-semibold text-[var(--color-text)]">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
