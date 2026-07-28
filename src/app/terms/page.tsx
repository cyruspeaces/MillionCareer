import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocShell } from "@/components/LegalDocShell";

export const metadata: Metadata = {
  title: "用户协议 - 百万职场",
  description: "百万职场平台用户服务协议",
};

export default function TermsPage() {
  return (
    <LegalDocShell title="百万职场用户协议" updatedAt="2026年7月28日">
      <p>
        欢迎您使用「百万职场」（以下简称「本平台」）提供的产品与服务。本平台由百万职场运营方（以下简称「我们」）依法运营。请您在注册、登录或使用本平台服务前，仔细阅读并充分理解本《用户协议》（以下简称「本协议」）。一旦您点击同意、注册、登录或以其他方式使用本平台服务，即视为您已阅读并同意接受本协议全部内容。
      </p>
      <p>
        如您不同意本协议的任一条款，请立即停止注册或使用本平台服务。本协议与
        <Link
          href="/privacy"
          className="mx-1 text-[var(--color-primary)] hover:underline"
        >
          《隐私政策》
        </Link>
        共同构成约束您与我们之间权利义务的完整协议。
      </p>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          一、定义与适用范围
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong className="font-medium text-[var(--color-text)]">用户：</strong>
            指注册、登录或以其他方式使用本平台服务的自然人、法人或其他组织。
          </li>
          <li>
            <strong className="font-medium text-[var(--color-text)]">
              平台服务：
            </strong>
            包括但不限于 AI 任务浏览与报名、活动参与、能力测评、技能展示、结算信息查询及相关支持功能。
          </li>
          <li>
            本协议适用于本平台网站、后续可能上线的移动端、小程序及其他我们依法运营的客户端。
          </li>
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          二、账户注册与使用
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            您确认：在您完成注册或使用本平台服务时，您应当是具备完全民事行为能力的自然人；若您代表组织使用服务，您保证已获得充分授权。
          </li>
          <li>
            您应使用本人真实、有效的手机号码完成注册与登录，并保证所提供信息真实、准确、完整。因信息不实导致的后果由您自行承担。
          </li>
          <li>
            您应妥善保管账户与验证码等信息，不得出租、出借、转让账户。因您保管不善导致的损失，由您自行负责；如发现账户被盗用，请立即通知我们。
          </li>
          <li>
            我们有权在发现违法违规、虚假注册、恶意刷量、损害他人或平台利益等情形时，对账户采取限制、冻结或注销等措施。
          </li>
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          三、服务内容与说明
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            本平台面向创作者提供 AI 时代相关任务机会、活动参与入口及能力成长工具。平台一期可由平台自身作为任务/活动组织方发布需求。
          </li>
          <li>
            任务或活动的具体要求、报酬/权益、截止时间、参与条件等以页面展示及运营通知为准。您报名即表示知悉并接受该任务或活动的相关规则。
          </li>
          <li>
            交付、验收、结算等履约环节，可能通过平台指定的沟通与协作方式完成；具体以任务/活动说明或运营通知为准。您应按时、按质完成约定交付。
          </li>
          <li>
            能力测评、技能树等功能用于辅助展示与匹配接单能力，不构成任何就业、劳务派遣或劳动合同关系的承诺。
          </li>
          <li>
            我们有权根据业务发展调整、中断或终止部分服务，并将以合理方式进行通知或公示。
          </li>
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          四、用户行为规范
        </h2>
        <p className="mb-2">您承诺不得利用本平台从事以下行为：</p>
        <ol className="list-decimal space-y-2 pl-5">
          <li>违反法律法规、公序良俗或侵害他人合法权益；</li>
          <li>发布、传播违法、侵权、虚假、骚扰、欺诈信息；</li>
          <li>恶意报名后不履行、抄袭剽窃、伪造交付成果或刷单作弊；</li>
          <li>干扰平台正常运行，包括但不限于攻击、爬虫滥用、绕过技术措施；</li>
          <li>未经授权使用他人账户、冒用他人身份；</li>
          <li>其他我们有合理理由认为不当的行为。</li>
        </ol>
        <p className="mt-2">
          如您违反上述规范，我们有权视情节采取警告、限制功能、取消报名资格、扣除相应权益、暂停或终止服务等措施，并保留依法追责的权利。
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          五、知识产权
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            本平台所含的软件、界面设计、文案、商标、标识、数据编排等知识产权归我们或权利人所有，未经许可不得擅自使用。
          </li>
          <li>
            您在使用服务过程中上传、提交或交付的内容，应保证拥有相应合法权利，或已取得必要授权，且不侵犯第三方合法权益。
          </li>
          <li>
            就您向平台提交的任务交付物、活动作品等，在双方另有约定的范围内，您授予我们为完成评审、展示、验收、存档及改进服务所必需的使用权利；涉及商业使用或对外授权的，以具体任务/活动规则或书面约定为准。
          </li>
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          六、费用、报酬与结算
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            使用本平台基础浏览、注册、测评等功能，除另有说明外不收取费用。
          </li>
          <li>
            任务报酬、活动奖金或权益以对应页面公示为准。结算方式、周期及税务处理按任务/活动规则及适用法律法规执行。
          </li>
          <li>
            因您未按要求交付、验收未通过、提供虚假信息或违反规则导致的报酬不予发放或调整，由您自行承担相应后果。
          </li>
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          七、免责声明
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            本平台将尽力保障服务稳定，但不保证服务无中断、无错误或满足您的全部预期。因不可抗力、网络故障、第三方服务异常等导致的服务中断或数据丢失，在法律允许范围内我们不承担责任。
          </li>
          <li>
            您理解：平台展示的任务、活动机会不构成对收益的保证；实际收入取决于您的参与情况、交付质量及具体规则。
          </li>
          <li>
            对于用户之间或用户与第三方之间因履约沟通产生的争议，我们可在合理范围内提供协助，但不承担连带责任，法律法规另有规定的除外。
          </li>
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          八、协议变更与终止
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            我们可根据法律法规变化或业务需要修订本协议，修订后的协议将在本平台公布。若您继续使用服务，视为接受修订后的协议。
          </li>
          <li>
            您可随时停止使用服务并申请注销账户；我们亦可在您严重违约或依法需要时终止向您提供服务。
          </li>
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          九、法律适用与争议解决
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>本协议的订立、生效、解释与争议解决适用中华人民共和国大陆地区法律。</li>
          <li>
            因本协议引起的争议，双方应友好协商；协商不成的，任一方可向我们住所地有管辖权的人民法院提起诉讼。
          </li>
        </ol>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold text-[var(--color-text)]">
          十、联系我们
        </h2>
        <p>
          如对本协议有任何疑问、意见或投诉，请通过本平台公示的联系方式与我们联系。我们将在合理期限内予以回复。
        </p>
      </section>

      <p className="pt-2 text-[var(--color-text)]">
        （正文结束）再次感谢您选择百万职场。
      </p>
    </LegalDocShell>
  );
}
