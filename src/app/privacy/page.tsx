import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocShell } from "@/components/LegalDocShell";

export const metadata: Metadata = {
  title: "隐私政策 - 百万职场",
  description: "百万职场平台隐私政策 / 个人信息保护政策",
};

export default function PrivacyPage() {
  return (
    <LegalDocShell title="百万职场隐私政策" updatedAt="2026年7月28日">
      <p>
        百万职场（以下简称「本平台」）由百万职场运营方（以下简称「我们」）运营。我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全。本《隐私政策》旨在向您说明：我们如何收集、使用、存储、共享、转让、公开披露您的个人信息，以及您享有的相关权利。
      </p>
      <p>
        请您在使用本平台服务前仔细阅读并确认本政策。您使用我们的服务，即表示您已理解并同意我们按照本政策处理您的个人信息。本政策与
        <Link
          href="/terms"
          className="mx-1 text-[var(--color-primary)] hover:underline"
        >
          《用户协议》
        </Link>
        共同适用。
      </p>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          一、我们如何收集和使用个人信息
        </h2>
        <p className="mb-2">
          我们遵循合法、正当、必要和诚信原则，仅会出于本政策所述目的收集和使用您的个人信息：
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong className="font-medium text-[var(--color-text)]">
              注册与登录：
            </strong>
            当您使用手机号验证码登录/注册时，我们收集您的手机号码、验证码校验结果，用于创建与核验账户身份。
          </li>
          <li>
            <strong className="font-medium text-[var(--color-text)]">
              资料完善：
            </strong>
            您可填写昵称、简介等信息；上述信息用于在平台内展示与沟通识别。
          </li>
          <li>
            <strong className="font-medium text-[var(--color-text)]">
              任务与活动：
            </strong>
            当您浏览、报名任务或活动时，我们记录报名关系、报名时间及相关状态，用于履约对接、名额管理与服务统计。
          </li>
          <li>
            <strong className="font-medium text-[var(--color-text)]">
              能力测评与技能：
            </strong>
            当您完成测评时，我们处理您的作答结果、维度得分、类型结果及据此点亮的技能记录，用于生成能力报告并支持任务匹配展示。
          </li>
          <li>
            <strong className="font-medium text-[var(--color-text)]">
              结算展示：
            </strong>
            如存在结算记录，我们可能存储与展示金额、状态、关联任务及备注等信息，用于向您展示收益流水（具体支付方式以届时规则为准）。
          </li>
          <li>
            <strong className="font-medium text-[var(--color-text)]">
              保障服务安全：
            </strong>
            我们可能收集必要的设备与日志信息（如浏览器类型、访问时间、大致网络环境、操作日志），用于安全风控、故障排查与服务改进。
          </li>
        </ol>
        <p className="mt-2">
          若我们需要将信息用于本政策未载明的其他用途，或将基于特定目的收集的信息用于其他目的，我们将以合理方式告知您并征得您的同意（法律法规另有规定的除外）。
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          二、我们如何使用 Cookie 与同类技术
        </h2>
        <p>
          为保障登录状态、提升访问体验，我们可能使用 Cookie 或同类技术（例如会话凭证）。您可通过浏览器设置管理
          Cookie；但禁用后可能影响登录等功能的正常使用。
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          三、我们如何共享、转让、公开披露个人信息
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong className="font-medium text-[var(--color-text)]">共享：</strong>
            我们不会与第三方共享您的个人信息，但以下情形除外：
            （1）获得您的明确同意；（2）为完成履约所必需，与受托处理方共享且要求其按约定保护信息；（3）法律法规规定或行政、司法机关依法要求。
          </li>
          <li>
            <strong className="font-medium text-[var(--color-text)]">转让：</strong>
            我们不会将您的个人信息转让给任何公司、组织或个人，但在涉及合并、收购、资产转让时，我们将要求新的持有方继续受本政策约束，否则将重新征求您的授权同意。
          </li>
          <li>
            <strong className="font-medium text-[var(--color-text)]">
              公开披露：
            </strong>
            我们仅在获得您明确同意，或基于法律法规规定必须披露时，才会公开披露您的个人信息。
          </li>
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          四、我们如何存储与保护个人信息
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            我们在中华人民共和国境内运营中收集和产生的个人信息，原则上存储在境内。
          </li>
          <li>
            我们仅在实现本政策所述目的所必需的最短期限内保留您的个人信息，法律法规另有规定的除外。超出期限后，我们将删除或匿名化处理。
          </li>
          <li>
            我们采用合理的技术与管理措施保护您的信息安全，防止信息遭到未经授权的访问、披露、使用、修改、损坏或丢失。但请您理解，任何安全措施都无法做到百分之百安全。
          </li>
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          五、您的权利
        </h2>
        <p className="mb-2">
          按照中国相关法律法规，您对自己的个人信息享有以下权利：
        </p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>查阅、复制您的个人信息；</li>
          <li>更正、补充不准确或不完整的信息；</li>
          <li>在符合法定条件时删除个人信息；</li>
          <li>改变授权同意的范围或撤回同意（可能影响部分功能使用）；</li>
          <li>在符合条件时注销账户；</li>
          <li>获取个人信息副本（在技术可行范围内）。</li>
        </ol>
        <p className="mt-2">
          您可通过本平台公示的联系方式提出上述请求。我们将在核实身份后，于法律法规规定的期限内处理。
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          六、未成年人保护
        </h2>
        <p>
          本平台主要面向具备完全民事行为能力的成年人。如您为未成年人，请在监护人同意和指导下阅读本政策并使用服务。若我们发现在未获监护人同意的情况下收集了未成年人的个人信息，将尽快删除相关信息。
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          七、本政策如何更新
        </h2>
        <p>
          我们可能适时修订本政策。更新后的政策将在本平台发布，并注明更新日期。对于重大变更，我们还将通过站内提示等合理方式通知您。若您继续使用服务，即视为接受更新后的政策。
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          八、如何联系我们
        </h2>
        <p>
          如您对本政策或个人信息保护相关事宜有疑问、投诉或建议，请通过本平台公示的联系方式与我们联系。一般情况下，我们将在十五个工作日内予以回复。
        </p>
      </section>

      <p className="pt-2 text-[var(--color-text)]">
        （正文结束）感谢您对百万职场的信任。
      </p>
    </LegalDocShell>
  );
}
