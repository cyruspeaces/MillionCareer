import type { TaskParticipant } from "@/types/task";

type Props = {
  participants: TaskParticipant[];
  joinedCount: number;
  size?: "sm" | "md";
  max?: number;
};

export function ParticipantAvatars({
  participants,
  joinedCount,
  size = "sm",
  max = 6,
}: Props) {
  const visible = participants.slice(0, max);
  const extra = Math.max(joinedCount - visible.length, 0);
  const dim = size === "md" ? "size-8 text-xs" : "size-7 text-[11px]";

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div className="flex -space-x-2">
        {visible.map((person, index) => (
          <span
            key={`${person.initials}-${index}`}
            className={`inline-flex items-center justify-center rounded-full border-2 border-white font-semibold text-white ${dim}`}
            style={{ backgroundColor: person.color }}
            aria-hidden
          >
            {person.initials}
          </span>
        ))}
        {extra > 0 ? (
          <span
            className={`inline-flex items-center justify-center rounded-full border-2 border-white bg-[var(--color-text-secondary)] font-semibold text-white ${dim}`}
            aria-hidden
          >
            +{extra > 99 ? "99" : extra}
          </span>
        ) : null}
      </div>
    </div>
  );
}
