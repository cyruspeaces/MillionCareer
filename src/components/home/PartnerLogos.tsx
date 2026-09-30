const partners = [
  { name: "阿里云", src: "/partners/aliyun.svg" },
  { name: "腾讯云", src: "/partners/tencent-cloud.svg" },
  { name: "WorkBuddy", src: "/partners/workbuddy.svg" },
  { name: "火山引擎", src: "/partners/volcengine.svg" },
  { name: "豆包", src: "/partners/doubao.svg" },
  { name: "百度", src: "/partners/baidu.svg" },
];

export function PartnerLogos() {
  return (
    <section className="border-t border-[var(--color-border)]/60 py-12 sm:py-14">
      <div className="page-wrap">
        <h2 className="text-lg font-semibold text-[var(--color-primary)] sm:text-xl">
          合作伙伴
        </h2>
        <ul className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-5 rounded-2xl border border-[var(--color-border)] bg-white/70 px-5 py-5 sm:px-8 sm:py-6">
          {partners.map((partner) => (
            <li
              key={partner.name}
              className="flex min-w-[7.5rem] flex-1 items-center justify-center gap-2.5"
            >
              <img
                src={partner.src}
                alt=""
                width={28}
                height={28}
                className="size-7 shrink-0 object-contain"
              />
              <span className="text-sm font-medium text-[var(--color-text)]">
                {partner.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
