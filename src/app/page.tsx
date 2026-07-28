import { ActivityCarousel } from "@/components/home/ActivityCarousel";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PlatformHighlights } from "@/components/home/PlatformHighlights";
import { TaskListSection } from "@/components/home/TaskListSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { listActivities } from "@/server/activity/service";
import { listTasks } from "@/server/task/service";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [tasks, activities] = await Promise.all([
    listTasks(),
    listActivities(),
  ]);

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="pt-6 sm:pt-8">
          {activities.length > 0 ? (
            <ActivityCarousel activities={activities} />
          ) : null}
        </div>
        <PlatformHighlights />
        <TaskListSection tasks={tasks} />
        <HowItWorks />
      </main>
      <SiteFooter />
    </div>
  );
}
