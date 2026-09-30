import { HowItWorks } from "@/components/home/HowItWorks";
import { PartnerLogos } from "@/components/home/PartnerLogos";
import { PlatformHighlights } from "@/components/home/PlatformHighlights";
import { TaskListSection } from "@/components/home/TaskListSection";
import { TencentJobsBanner } from "@/components/jobs/TencentJobsBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { listTasks } from "@/server/task/service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const tasks = await listTasks();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="pt-6 sm:pt-8">
          <section>
            <div className="page-wrap">
              <div className="overflow-hidden rounded-xl">
                <TencentJobsBanner href="/jobs" />
              </div>
            </div>
          </section>
        </div>
        <PlatformHighlights />
        <TaskListSection tasks={tasks} />
        <HowItWorks />
        <PartnerLogos />
      </main>
      <SiteFooter />
    </div>
  );
}
